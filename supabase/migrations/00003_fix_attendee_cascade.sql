-- =============================================================================
-- Fix: check_in_attendees preserves records on user deletion
--
-- Previously the composite PK (check_in_id, user_id) forced user_id NOT NULL,
-- and ON DELETE CASCADE wiped attendance records when a user was deleted.
-- Adding a surrogate PK and switching to ON DELETE SET NULL keeps the historical
-- record intact, with user_id = NULL indicating a deleted user.
-- =============================================================================

-- Add surrogate PK
ALTER TABLE check_in_attendees ADD COLUMN id uuid DEFAULT gen_random_uuid();
ALTER TABLE check_in_attendees DROP CONSTRAINT check_in_attendees_pkey;
ALTER TABLE check_in_attendees ADD PRIMARY KEY (id);

-- Switch user_id to nullable ON DELETE SET NULL
ALTER TABLE check_in_attendees DROP CONSTRAINT IF EXISTS check_in_attendees_user_id_fkey;
ALTER TABLE check_in_attendees ALTER COLUMN user_id DROP NOT NULL;
ALTER TABLE check_in_attendees
  ADD CONSTRAINT check_in_attendees_user_id_fkey
  FOREIGN KEY (user_id) REFERENCES profiles(id) ON DELETE SET NULL;

-- Prevent duplicate active attendance (only when user_id is not null)
CREATE UNIQUE INDEX check_in_attendees_unique_active
  ON check_in_attendees (check_in_id, user_id) WHERE user_id IS NOT NULL;
