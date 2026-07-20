-- Certification catalog (see spec 10-certification-catalog)
-- A curated, finite reference universe of official certifications a group can
-- optionally point to. Two normalized tables (issuers, certifications) + a
-- single nullable FK on groups. Public read, no client write (curation only).
-- Structure: enum → tables (with policies) → groups alterations

-- =============================================================================
-- ENUM
-- =============================================================================

-- Fixed taxonomy, not free text (FR-4a). No `other` catch-all: a genuinely new
-- category is a deliberate migration (ALTER TYPE ... ADD VALUE).
CREATE TYPE certification_category AS ENUM (
  'cloud',
  'networking',
  'security',
  'data',
  'devops',
  'development',
  'systems',
  'project_management'
);

-- =============================================================================
-- ISSUERS
-- =============================================================================

CREATE TABLE issuers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),  -- surrogate identity, never changes (FR-5)
  name text NOT NULL,                             -- display name, mutable
  slug text NOT NULL UNIQUE,                       -- stable handle
  website_url text,
  logo_url text,                                   -- project-hosted asset, no hotlinking
  is_active boolean NOT NULL DEFAULT true,         -- retire via false, never hard-delete (FR-6)
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TRIGGER set_updated_at BEFORE UPDATE ON issuers
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

ALTER TABLE issuers ENABLE ROW LEVEL SECURITY;

-- Reference data: public read, no client write (curation via service role only).
CREATE POLICY "Issuers are publicly readable"
  ON issuers FOR SELECT
  USING (true);

-- =============================================================================
-- CERTIFICATIONS
-- =============================================================================

CREATE TABLE certifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),  -- surrogate identity (FR-5)
  issuer_id uuid NOT NULL REFERENCES issuers(id) ON DELETE RESTRICT,  -- no cascade: deletion never happens (FR-8)
  name text NOT NULL,                             -- named credential, mutable (FR-4)
  slug text NOT NULL UNIQUE,                       -- stable handle
  code text,                                       -- exam version, mutable (e.g. SAA-C03) — updated, not re-rowed (FR-4)
  category certification_category NOT NULL,
  official_url text,
  is_active boolean NOT NULL DEFAULT true,         -- retire via false, never hard-delete (FR-6)
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX idx_certifications_issuer_id ON certifications(issuer_id);
CREATE INDEX idx_certifications_category ON certifications(category);
CREATE INDEX idx_certifications_active ON certifications(is_active);

CREATE TRIGGER set_updated_at BEFORE UPDATE ON certifications
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

ALTER TABLE certifications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Certifications are publicly readable"
  ON certifications FOR SELECT
  USING (true);

-- =============================================================================
-- GROUPS LINK
-- =============================================================================

-- One optional certification per group, stored once (FR-1, FR-9). Reverse
-- direction ("groups targeting cert X") is a query, never stored.
ALTER TABLE groups
  ADD COLUMN certification_id uuid REFERENCES certifications(id) ON DELETE RESTRICT;

CREATE INDEX idx_groups_certification_id ON groups(certification_id);

-- Title may be derived from the certification instead of a custom name (FR-10a):
-- name becomes nullable, but a group must always have a title — custom OR
-- derived. The only forbidden state is neither.
ALTER TABLE groups
  ALTER COLUMN name DROP NOT NULL;

ALTER TABLE groups
  ADD CONSTRAINT groups_name_or_certification
  CHECK (name IS NOT NULL OR certification_id IS NOT NULL);
