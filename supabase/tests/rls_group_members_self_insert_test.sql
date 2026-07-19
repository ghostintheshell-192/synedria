-- Regression for security finding F2 (migration 00009_security_hardening).
--
-- The pre-00009 policy "Members can insert via join flow" checked only
-- auth.uid() = user_id, so ANY authenticated user could self-insert into ANY
-- group with ANY role: it bypassed the approval gate and, once co-member,
-- exposed other members' private profiles/skills via the co-member SELECT
-- policies. 00009 replaced it with two narrow policies:
--   (a) self-join as member  -> only into open-entry, open-status groups
--   (b) creator bootstrap     -> created_by may seat themselves as referent
--
-- This test pins that boundary: the legitimate self-join still works, and the
-- two escalation paths F2 closed stay closed.

begin;
select plan(4);

-- ---------------------------------------------------------------------------
-- Fixtures (superuser role here => RLS bypassed while we set the stage)
-- ---------------------------------------------------------------------------

-- Two users. Inserting into auth.users fires handle_new_user(), which creates
-- the matching profiles row, so the groups.created_by FK is satisfied for free.
insert into auth.users (id, aud, role, email, raw_user_meta_data)
values
  ('11111111-1111-1111-1111-111111111111', 'authenticated', 'authenticated',
   'owner@test.local', '{"full_name":"Owner"}'),
  ('22222222-2222-2222-2222-222222222222', 'authenticated', 'authenticated',
   'attacker@test.local', '{"full_name":"Attacker"}');

-- An OPEN group (self-join is the legitimate flow) and an APPROVAL group
-- (self-join must go through referent approval, never direct insert).
insert into groups (id, name, slug, skill_tag, objective, city, preferred_format,
                    entry_mode, status, created_by)
values
  ('33333333-3333-3333-3333-333333333333', 'Open Group', 'open-group',
   'rust', 'Learn Rust', 'Milano', 'in_person',
   'open', 'open', '11111111-1111-1111-1111-111111111111'),
  ('44444444-4444-4444-4444-444444444444', 'Approval Group', 'approval-group',
   'go', 'Learn Go', 'Milano', 'in_person',
   'approval', 'open', '11111111-1111-1111-1111-111111111111');

-- ---------------------------------------------------------------------------
-- Become the attacker: an authenticated user unrelated to either group.
-- ---------------------------------------------------------------------------
set local role authenticated;
set local request.jwt.claims to '{"sub":"22222222-2222-2222-2222-222222222222","role":"authenticated"}';

-- Sanity: we are impersonating the attacker.
select is(
  auth.uid(),
  '22222222-2222-2222-2222-222222222222'::uuid,
  'auth.uid() reflects the impersonated attacker'
);

-- (1) Legitimate self-join into an OPEN group as member SUCCEEDS.
--     Doubles as a grant check: if the authenticated role lacked INSERT on
--     group_members, this would fail loudly (permission denied) instead.
select lives_ok(
  $$ insert into group_members (group_id, user_id, role)
     values ('33333333-3333-3333-3333-333333333333',
             '22222222-2222-2222-2222-222222222222', 'member') $$,
  'attacker may self-join an OPEN group as member (legitimate flow intact)'
);

-- (2) F2: self-join into an APPROVAL group as member is DENIED by RLS.
--     Asserts on the message, not just 42501, so a missing grant cannot make
--     this pass for the wrong reason.
select throws_like(
  $$ insert into group_members (group_id, user_id, role)
     values ('44444444-4444-4444-4444-444444444444',
             '22222222-2222-2222-2222-222222222222', 'member') $$,
  '%row-level security%',
  'F2: attacker cannot self-join an APPROVAL group as member'
);

-- (3) F2: self-insert as REFERENT into a group they do not own is DENIED.
--     (Privilege escalation: the creator-bootstrap policy requires created_by.)
select throws_like(
  $$ insert into group_members (group_id, user_id, role)
     values ('44444444-4444-4444-4444-444444444444',
             '22222222-2222-2222-2222-222222222222', 'referent') $$,
  '%row-level security%',
  'F2: attacker cannot self-insert as referent into a group they do not own'
);

reset role;  -- pgTAP bookkeeping runs as superuser again
select * from finish();
rollback;
