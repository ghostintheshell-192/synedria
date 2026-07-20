-- =============================================================================
-- LOCAL-ONLY: table privileges for the Supabase roles
-- =============================================================================
-- On hosted Supabase the anon / authenticated / service_role roles receive
-- their table privileges automatically from the platform. `supabase db reset`
-- does NOT reproduce that locally, so without this block the roles cannot touch
-- any table at all: INSERT/SELECT fail with 42501 "permission denied for table"
-- (a missing GRANT, NOT an RLS denial) and RLS never even runs. This mirrors the
-- hosted grants so the local database behaves like production. It lives in the
-- seed (local-only, never shipped in a migration), so production's own grants
-- are left untouched. RLS policies remain the real access control — these grants
-- only open the table-level door that RLS then guards row-by-row. Seed runs after
-- migrations on reset, so ALL TABLES covers everything that exists by then.

GRANT USAGE ON SCHEMA public TO anon, authenticated, service_role;
GRANT ALL ON ALL TABLES    IN SCHEMA public TO anon, authenticated, service_role;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated, service_role;
GRANT ALL ON ALL ROUTINES  IN SCHEMA public TO anon, authenticated, service_role;

-- The certification catalog used to live here. It moved to
-- 00012_seed_certification_catalog.sql: the seed only runs on a local
-- `supabase db reset` and is never applied to production, so reference data the
-- app depends on has to travel as a migration. Keep this file for local-only
-- concerns such as the grants above.
