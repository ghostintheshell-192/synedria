# Database tests (pgTAP)

Automated tests for the Postgres schema and its Row-Level Security (RLS)
policies. They run **inside the database** via pgTAP and are executed by the
Supabase CLI. No copy/paste into the SQL Editor — one command runs everything.

## How to run

```bash
supabase start          # local stack up (once per session)
supabase db reset       # reapply all migrations + seed on a clean db
supabase test db        # run every *.sql file in this folder
```

`supabase test db` reports `ok` / `not ok` per assertion, TAP-style. Run it after
**any** change to a migration, a policy, or the seed — that is the whole point:
a regression re-opens instantly instead of being discovered in production.

## What goes here

Two kinds of tests, distinguished by a filename prefix:

| Prefix       | Verifies                                             |
| ------------ | ---------------------------------------------------- |
| `schema_`    | Structure: tables, columns, constraints, indexes     |
| `rls_`       | Behaviour of RLS policies (who can read/write what)  |
| `function_`  | SECURITY DEFINER functions, triggers                 |

Naming: `<prefix>_<subject>_test.sql` (e.g. `rls_group_members_self_insert_test.sql`).
Files are kept **flat** in this folder — the runner does not rely on subdirectories.

## Anatomy of a test

Every file wraps its work in a transaction so fixtures never persist:

```sql
begin;
select plan(N);          -- declare how many assertions will run
-- ... fixtures + assertions ...
select * from finish();  -- verify N assertions actually ran
rollback;                -- discard all fixtures
```

## Two gotchas that make RLS tests correct (read before writing one)

1. **The test runs as a superuser, which BYPASSES RLS.** To actually exercise a
   policy you must drop into the `authenticated` role and set the JWT identity:

   ```sql
   set local role authenticated;
   set local request.jwt.claims to '{"sub":"<user-uuid>","role":"authenticated"}';
   ```

   `auth.uid()` then reads `sub`. Use `reset role;` before `finish()` so pgTAP's
   own bookkeeping runs as superuser again. Fixtures (inserting users, groups)
   are created *before* switching role, while RLS is still bypassed.

2. **SQLSTATE `42501` is ambiguous.** A blocked INSERT raises `42501` both when a
   policy denies it *and* when the role simply lacks the table grant. They mean
   opposite things. So an RLS-denial test asserts on the **message**
   (`throws_like(..., '%row-level security%', ...)`), not just the code — otherwise
   a missing grant would make the test pass for the wrong reason. Pairing each
   denial with a positive `lives_ok` on a legitimate flow doubles as a grant check.

## Fixtures & the auth trigger

Inserting into `auth.users` fires `handle_new_user()`, which auto-creates the
matching `public.profiles` row. So test fixtures insert auth users directly and
get profiles for free — no need to insert profiles by hand.
