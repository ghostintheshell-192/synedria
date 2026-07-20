---
type: bug
priority: high
status: open
discovered: 2026-07-20
related: []
related_decision: null
---

# Production schema is applied by hand and tracked nowhere

## Description

The production database has no `supabase_migrations.schema_migrations` table.
Migrations were never applied through the Supabase CLI — the schema was built by
pasting SQL into the dashboard's SQL Editor, which leaves no record of what ran.

The consequence is not that production lags behind, but that **nobody can tell
what production contains**. As of 2026-07-20 the applied set was determined only
by probing the live database for individual columns, indexes, functions and
policies:

| Applied | Missing |
| --- | --- |
| 00001, 00002, 00003, 00004, 00006, 00007 | 00005, 00008, 00009, 00010 |

Note the shape of that gap. Production is not "stopped at 00004": `00005` was
**skipped** while later migrations were applied over it. It is a two-line file
containing a single `ALTER TABLE`, which is exactly the kind of thing that gets
lost when files are applied by hand.

## Impact

This already caused a user-facing production bug that went unnoticed for weeks.
`profiles.preferred_locale` did not exist, the deployed code wrote it on every
profile save, and PostgREST rejected the **entire** request with
`PGRST204` — so no field was saved, not just that one. Users saw their inputs
revert with no error. (The invisibility was a separate defect, fixed in
`fix/silent-write-failures`.)

Still open as a direct result:

- **`00009` is missing in production**, and it is the security-hardening
  migration. The original `group_members` insert policy is therefore still live,
  letting any authenticated user insert themselves into any group with any role,
  bypassing approval and exposing co-members' private profiles and skills. This
  is an immediate action item, not debt.
- **`develop` cannot be deployed.** The certification catalog depends on `00008`
  and `00010`; merging to `main` today would break group creation in exactly the
  same silent way.
- `supabase db push` is unusable as-is — with no tracking table it would attempt
  `00001` against an existing schema and fail.
- Every future schema change carries the same risk, and there is no check that
  would catch it.

## Proposed Solution

1. **Reconcile the tracking table.** Register the migrations already present as
   applied (`supabase link`, then `supabase migration repair --status applied`
   for 00001-00004, 00006, 00007, plus 00005 which was applied by hand on
   2026-07-20 to stop the bleeding).
2. **Apply the remainder through the CLI** (`supabase db push`) so 00008, 00009,
   00010 and 00011 land with a record — 00009 first, given the open policy.
3. **Make the CLI the only path.** Hand-applied SQL is what created this; once
   tracking exists, applying migrations any other way silently reintroduces it.
4. **Add a preflight check** comparing `supabase/migrations/` against the applied
   set, so a deploy with a schema gap fails loudly instead of shipping. This is
   the part that turns the fix into a guarantee rather than a one-off cleanup.

## Notes

- Discovered on 2026-07-20 while diagnosing why profile saves silently failed.
  Three plausible hypotheses (cookie handling, provider-specific auth, browser
  differences) were investigated and discarded before the actual cause surfaced,
  because the failing request's response body was being thrown away by the
  client code.
- The project memory recorded "00001-00007 in production, 00008 pending", which
  was wrong about 00005 and about 00009/00010. That note is what made schema
  drift look like an already-excluded explanation. Any claim about production
  schema state should be verified against the database, not against notes, until
  tracking exists.
