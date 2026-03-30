-- =============================================================================
-- Auto-close groups when they lose all members
--
-- If all members leave or are deleted, no one can approve join requests.
-- A group with zero members is automatically closed to prevent orphaned open
-- groups that can never be joined.
-- =============================================================================

CREATE OR REPLACE FUNCTION close_group_if_empty()
RETURNS TRIGGER AS $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM group_members WHERE group_id = OLD.group_id
  ) THEN
    UPDATE groups SET status = 'closed' WHERE id = OLD.group_id;
  END IF;
  RETURN OLD;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER close_group_when_empty
  AFTER DELETE ON group_members
  FOR EACH ROW EXECUTE FUNCTION close_group_if_empty();
