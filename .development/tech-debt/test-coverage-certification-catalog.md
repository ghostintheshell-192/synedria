---
type: testing
priority: medium
status: open
discovered: 2026-07-19
related: []
related_decision: ../reference/decisions/002-group-soft-delete.md
---

# No pgTAP coverage for the certification catalog (migration 00008)

## Description

Migration `00008_certification_catalog` ships the whole catalog layer —
`issuers` and `certifications` tables, the `groups.certification_id` FK, and
the nullable-`name` + `groups_name_or_certification` CHECK — but the pgTAP
suite (`supabase/tests/`) has **no test** exercising any of it. The only test
present covers F2 RLS on `group_members` (migration 00009).

## Impact

- The catalog's structural invariants are unguarded: a future migration or seed
  change could silently break them and only surface in production.
- Specifically unverified: `ON DELETE RESTRICT` on the FKs (FR-8, the guarantee
  that catalog rows are never cascade-deleted), `is_active` defaults (FR-2/FR-3),
  slug uniqueness, and the derived-title CHECK `name IS NOT NULL OR
  certification_id IS NOT NULL` (FR-10a) — the invariant the whole derived-title
  feature rests on.
- Public-read / no-client-write RLS on `issuers`/`certifications` (Technical
  Notes) is also untested.

## Proposed Solution

Add `schema_certification_catalog_test.sql` (and, if convenient, an
`rls_certification_catalog_test.sql`) covering:

- `issuers` / `certifications` columns and NOT NULL constraints;
- FK `certifications.issuer_id` and `groups.certification_id` are `ON DELETE
  RESTRICT` (attempt a delete, expect denial);
- `is_active` defaults to true; slug UNIQUE;
- CHECK `groups_name_or_certification`: reject a group with both `name` and
  `certification_id` null; accept each single-populated case;
- public SELECT but no authenticated INSERT/UPDATE/DELETE on the catalog tables.

Runner: `supabase test db` (Valentina runs it — the runner needs local TCP,
which the sandbox blocks; Claude can author the tests, not execute them).

## Notes

- Gap found while validating increment #4 (certification link).
- Mirrors the existing test's style/anatomy — see `supabase/tests/README.md`.
