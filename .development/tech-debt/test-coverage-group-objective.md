---
type: testing
priority: medium
status: open
discovered: 2026-07-19
related: []
related_decision: null
---

# No pgTAP coverage for group objective nullability (migration 00010)

## Description

Migration `00010_group_objective_nullable` makes `groups.objective` nullable
and adds the CHECK `groups_objective_or_certification`
(`objective IS NOT NULL OR certification_id IS NOT NULL`), so a group's goal may
be a free-text objective, a linked certification, or both — never neither
(FR-10). There is **no pgTAP test** pinning this invariant.

## Impact

- The "a group always expresses a goal" guarantee is unguarded. A regression
  that dropped the CHECK, or re-imposed NOT NULL, would pass silently and only
  break at runtime (a group with neither objective nor certification, or
  creation blocked for cert-only groups).
- This CHECK is the objective-side twin of the derived-title CHECK (00008); the
  derived-objective UI in the create form relies on it holding.

## Proposed Solution

Add `schema_group_objective_test.sql` covering:

- `objective` is nullable (insert a group with `objective = null` but a
  `certification_id` set → succeeds);
- CHECK rejects a group with **both** `objective` and `certification_id` null;
- CHECK accepts objective-only and certification-only groups.

Can live alongside the catalog schema test, or share
`schema_certification_catalog_test.sql` — keep the CHECK assertions grouped so
the derived-title and derived-objective invariants are tested together.

Runner: `supabase test db` (Valentina runs it; the sandbox blocks the runner's
local TCP, so Claude authors but cannot execute).

## Notes

- Gap found while validating increment #4 (certification link); the migration
  was added this session.
- See the companion gap `test-coverage-certification-catalog` (00008) and
  `supabase/tests/README.md` for test anatomy.
