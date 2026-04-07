-- Enforce single referent per group (see ADR-005)
CREATE UNIQUE INDEX group_members_single_referent
  ON group_members (group_id) WHERE role = 'referent';
