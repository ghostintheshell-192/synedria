-- =============================================================================
-- Fix: groups.created_by and check_ins.created_by allow user deletion
--
-- Previously both columns were NOT NULL with no ON DELETE behavior (defaults to
-- RESTRICT), which prevented deleting a user who owned groups or check-ins.
-- Making them nullable with ON DELETE SET NULL lets the user be deleted while
-- preserving the group/check-in records.
-- =============================================================================

-- groups.created_by
ALTER TABLE groups ALTER COLUMN created_by DROP NOT NULL;
ALTER TABLE groups DROP CONSTRAINT IF EXISTS groups_created_by_fkey;
ALTER TABLE groups
  ADD CONSTRAINT groups_created_by_fkey
  FOREIGN KEY (created_by) REFERENCES profiles(id) ON DELETE SET NULL;

-- check_ins.created_by
ALTER TABLE check_ins ALTER COLUMN created_by DROP NOT NULL;
ALTER TABLE check_ins DROP CONSTRAINT IF EXISTS check_ins_created_by_fkey;
ALTER TABLE check_ins
  ADD CONSTRAINT check_ins_created_by_fkey
  FOREIGN KEY (created_by) REFERENCES profiles(id) ON DELETE SET NULL;
