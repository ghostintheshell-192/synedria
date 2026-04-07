-- Synedria MVP: Initial database schema
-- Structure: enums → functions → tables (with basic policies) → cross-table policies

-- =============================================================================
-- ENUMS
-- =============================================================================

CREATE TYPE preferred_format AS ENUM ('in_person', 'hybrid', 'online');
CREATE TYPE skill_level AS ENUM ('beginner', 'intermediate', 'advanced');
CREATE TYPE skill_intention AS ENUM ('learn', 'teach', 'collaborate');
CREATE TYPE group_entry_mode AS ENUM ('approval', 'open');
CREATE TYPE group_status AS ENUM ('open', 'closed');
CREATE TYPE progress_mode AS ENUM ('accumulation', 'deadline', 'both');
CREATE TYPE group_role AS ENUM ('referent', 'member');
CREATE TYPE join_request_status AS ENUM ('pending', 'approved', 'rejected', 'expired');

-- =============================================================================
-- TRIGGER FUNCTIONS
-- =============================================================================

CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- =============================================================================
-- PROFILES (table + self-referencing policies only)
-- =============================================================================

CREATE TABLE profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  display_name text NOT NULL,
  avatar_url text,
  city text,
  availability jsonb,
  preferred_format preferred_format,
  is_public_profile boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TRIGGER set_updated_at BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own profile"
  ON profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Public profiles readable by anyone"
  ON profiles FOR SELECT
  USING (is_public_profile = true);

CREATE POLICY "Users can insert own profile"
  ON profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id);

CREATE POLICY "Users can delete own profile"
  ON profiles FOR DELETE
  USING (auth.uid() = id);

-- =============================================================================
-- USER SKILLS (table + self-referencing policies only)
-- =============================================================================

CREATE TABLE user_skills (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  skill_name text NOT NULL,
  level skill_level NOT NULL,
  intention skill_intention NOT NULL,
  goal text,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX idx_user_skills_user_id ON user_skills(user_id);
CREATE INDEX idx_user_skills_skill_name ON user_skills(lower(skill_name));

ALTER TABLE user_skills ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own skills"
  ON user_skills FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own skills"
  ON user_skills FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own skills"
  ON user_skills FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own skills"
  ON user_skills FOR DELETE
  USING (auth.uid() = user_id);

-- =============================================================================
-- GROUPS
-- =============================================================================

CREATE TABLE groups (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  slug text NOT NULL UNIQUE,
  skill_tag text NOT NULL,
  objective text NOT NULL,
  roadmap_url text,
  city text NOT NULL,
  preferred_format preferred_format NOT NULL,
  entry_mode group_entry_mode NOT NULL DEFAULT 'approval',
  status group_status NOT NULL DEFAULT 'open',
  progress_mode progress_mode NOT NULL DEFAULT 'accumulation',
  deadline date,
  meeting_place text,
  study_mode text,
  climate text,
  expected_attendance text,
  description text,
  is_indexable boolean NOT NULL DEFAULT true,
  created_by uuid NOT NULL REFERENCES profiles(id),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX idx_groups_skill_tag ON groups(lower(skill_tag));
CREATE INDEX idx_groups_city ON groups(lower(city));
CREATE INDEX idx_groups_status ON groups(status);

CREATE TRIGGER set_updated_at BEFORE UPDATE ON groups
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

ALTER TABLE groups ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Groups are publicly readable"
  ON groups FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can create groups"
  ON groups FOR INSERT
  WITH CHECK (auth.uid() = created_by);

-- =============================================================================
-- GROUP MEMBERS
-- =============================================================================

CREATE TABLE group_members (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  group_id uuid NOT NULL REFERENCES groups(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  role group_role NOT NULL DEFAULT 'member',
  personal_objective text,
  joined_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (group_id, user_id)
);

CREATE INDEX idx_group_members_group_id ON group_members(group_id);
CREATE INDEX idx_group_members_user_id ON group_members(user_id);

ALTER TABLE group_members ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Group membership is publicly readable"
  ON group_members FOR SELECT
  USING (true);

CREATE POLICY "Members can insert via join flow"
  ON group_members FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Members can remove themselves"
  ON group_members FOR DELETE
  USING (auth.uid() = user_id);

-- =============================================================================
-- JOIN REQUESTS
-- =============================================================================

CREATE TABLE join_requests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  applicant_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  group_id uuid NOT NULL REFERENCES groups(id) ON DELETE CASCADE,
  status join_request_status NOT NULL DEFAULT 'pending',
  intro_message text,
  personal_objective text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  resolved_at timestamptz,
  resolved_by uuid REFERENCES profiles(id)
);

CREATE INDEX idx_join_requests_group_status ON join_requests(group_id, status);
CREATE INDEX idx_join_requests_applicant ON join_requests(applicant_id);

ALTER TABLE join_requests ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Applicants can read own requests"
  ON join_requests FOR SELECT
  USING (auth.uid() = applicant_id);

CREATE POLICY "Authenticated users can create requests"
  ON join_requests FOR INSERT
  WITH CHECK (auth.uid() = applicant_id);

-- =============================================================================
-- CHECK-INS
-- =============================================================================

CREATE TABLE check_ins (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  group_id uuid NOT NULL REFERENCES groups(id) ON DELETE CASCADE,
  created_by uuid NOT NULL REFERENCES profiles(id),
  meeting_date date NOT NULL,
  location text,
  duration integer, -- in minutes
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (group_id, meeting_date)
);

CREATE INDEX idx_check_ins_group_id ON check_ins(group_id);
CREATE INDEX idx_check_ins_meeting_date ON check_ins(group_id, meeting_date DESC);

CREATE TRIGGER set_updated_at BEFORE UPDATE ON check_ins
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

ALTER TABLE check_ins ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Check-ins are publicly readable"
  ON check_ins FOR SELECT
  USING (true);

CREATE POLICY "Creator can update within 48h"
  ON check_ins FOR UPDATE
  USING (
    auth.uid() = created_by
    AND created_at > now() - interval '48 hours'
  );

-- =============================================================================
-- CHECK-IN ATTENDEES
-- =============================================================================

CREATE TABLE check_in_attendees (
  check_in_id uuid NOT NULL REFERENCES check_ins(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  PRIMARY KEY (check_in_id, user_id)
);

ALTER TABLE check_in_attendees ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Attendance is publicly readable"
  ON check_in_attendees FOR SELECT
  USING (true);

-- =============================================================================
-- PROGRESS UPDATES
-- =============================================================================

CREATE TABLE progress_updates (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  group_id uuid NOT NULL REFERENCES groups(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  content text NOT NULL,
  is_public boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX idx_progress_updates_group ON progress_updates(group_id, created_at DESC);
CREATE INDEX idx_progress_updates_user ON progress_updates(user_id);

ALTER TABLE progress_updates ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public updates readable by anyone"
  ON progress_updates FOR SELECT
  USING (is_public = true);

CREATE POLICY "Owner can update own progress"
  ON progress_updates FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Owner can delete own progress"
  ON progress_updates FOR DELETE
  USING (auth.uid() = user_id);

-- =============================================================================
-- CROSS-TABLE POLICIES (depend on group_members, defined after all tables)
-- =============================================================================

-- Profiles: visible to group co-members
CREATE POLICY "Users can read profiles of group co-members"
  ON profiles FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM group_members gm1
      JOIN group_members gm2 ON gm1.group_id = gm2.group_id
      WHERE gm1.user_id = auth.uid() AND gm2.user_id = profiles.id
    )
  );

-- User skills: visible to group co-members
CREATE POLICY "Users can read skills of group co-members"
  ON user_skills FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM group_members gm1
      JOIN group_members gm2 ON gm1.group_id = gm2.group_id
      WHERE gm1.user_id = auth.uid() AND gm2.user_id = user_skills.user_id
    )
  );

-- Groups: referent can update
CREATE POLICY "Referent can update group"
  ON groups FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM group_members
      WHERE group_id = groups.id AND user_id = auth.uid() AND role = 'referent'
    )
  );

-- Group members: referent can add members (via join request approval)
CREATE POLICY "Referent can add members"
  ON group_members FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM group_members gm
      WHERE gm.group_id = group_members.group_id
        AND gm.user_id = auth.uid()
        AND gm.role = 'referent'
    )
  );

-- Group members: referent can update roles
CREATE POLICY "Referent can update roles"
  ON group_members FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM group_members gm
      WHERE gm.group_id = group_members.group_id AND gm.user_id = auth.uid() AND gm.role = 'referent'
    )
  );

-- Join requests: referent can read and update
CREATE POLICY "Referent can read requests for their groups"
  ON join_requests FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM group_members
      WHERE group_id = join_requests.group_id AND user_id = auth.uid() AND role = 'referent'
    )
  );

CREATE POLICY "Referent can update request status"
  ON join_requests FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM group_members
      WHERE group_id = join_requests.group_id AND user_id = auth.uid() AND role = 'referent'
    )
  );

-- Check-ins: group members can create
CREATE POLICY "Group members can create check-ins"
  ON check_ins FOR INSERT
  WITH CHECK (
    auth.uid() = created_by
    AND EXISTS (
      SELECT 1 FROM group_members
      WHERE group_id = check_ins.group_id AND user_id = auth.uid()
    )
  );

-- Check-in attendees: creator of check-in can manage
CREATE POLICY "Check-in creator can manage attendees"
  ON check_in_attendees FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM check_ins
      WHERE id = check_in_attendees.check_in_id AND created_by = auth.uid()
    )
  );

CREATE POLICY "Check-in creator can remove attendees"
  ON check_in_attendees FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM check_ins
      WHERE id = check_in_attendees.check_in_id
        AND created_by = auth.uid()
        AND created_at > now() - interval '48 hours'
    )
  );

-- Progress updates: group members can read and insert
CREATE POLICY "Members can read group progress"
  ON progress_updates FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM group_members
      WHERE group_id = progress_updates.group_id AND user_id = auth.uid()
    )
  );

CREATE POLICY "Members can insert progress"
  ON progress_updates FOR INSERT
  WITH CHECK (
    auth.uid() = user_id
    AND EXISTS (
      SELECT 1 FROM group_members
      WHERE group_id = progress_updates.group_id AND user_id = auth.uid()
    )
  );

-- =============================================================================
-- AUTO-CREATE PROFILE ON SIGNUP
-- =============================================================================

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
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();
