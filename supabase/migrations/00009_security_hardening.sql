-- Security hardening (see security/audit branch)
-- F2: tighten group_members self-insert RLS (privacy bypass)
-- F4: pin search_path on the SECURITY DEFINER signup trigger

-- =============================================================================
-- F2: group_members self-insert
-- =============================================================================

-- The original policy let ANY authenticated user insert themselves into ANY
-- group with ANY role (WITH CHECK only verified auth.uid() = user_id). That
-- bypassed the approval gate and, once co-member, exposed other members'
-- private profiles/skills via the co-member SELECT policies.
--
-- entry_mode is enforced client-side only (JoinRequestForm), so it must be
-- enforced here server-side. We split the single permissive policy into two
-- narrow ones that cover exactly the two legitimate self-insert flows:
--   1. self-join as member  -> only into open-entry, open-status groups
--   2. creator bootstrap     -> created_by may insert themselves as referent
-- The approval flow stays covered by the existing "Referent can add members".

DROP POLICY "Members can insert via join flow" ON group_members;

-- (1) Open-access self-join, member role only.
CREATE POLICY "Members can self-join open groups"
  ON group_members FOR INSERT
  WITH CHECK (
    auth.uid() = user_id
    AND role = 'member'
    AND EXISTS (
      SELECT 1 FROM groups g
      WHERE g.id = group_members.group_id
        AND g.entry_mode = 'open'
        AND g.status = 'open'
    )
  );

-- (2) Group creator seats themselves as referent (once; the single-referent
-- partial unique index prevents a second referent, so this cannot be abused
-- to hijack a group that already has one).
CREATE POLICY "Creator can self-insert as referent"
  ON group_members FOR INSERT
  WITH CHECK (
    auth.uid() = user_id
    AND role = 'referent'
    AND EXISTS (
      SELECT 1 FROM groups g
      WHERE g.id = group_members.group_id
        AND g.created_by = auth.uid()
    )
  );

-- =============================================================================
-- F4: pin search_path on SECURITY DEFINER function
-- =============================================================================

-- A SECURITY DEFINER function with a mutable search_path can be hijacked by an
-- attacker who creates objects in a schema searched before the intended one.
-- All references here are already schema-qualified (public.profiles), so an
-- empty search_path is safe and closes the vector (matches Supabase's linter).
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, display_name, avatar_url)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name', 'User'),
    COALESCE(NEW.raw_user_meta_data->>'avatar_url', NEW.raw_user_meta_data->>'picture')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = '';
