-- Curated certification catalog: issuers and certifications (FR-12).
--
-- This is reference data the application cannot work without — the
-- certification combobox and derived group titles read it — so it ships as a
-- migration instead of living in supabase/seed.sql. The seed only runs on a
-- local `supabase db reset`; `db push` never applies it, which would have left
-- the hosted catalog empty and the feature dead on arrival in production.
--
-- Curation stays SQL-only (FR-12: there is no in-app write path). To extend or
-- correct the catalog, add a further migration rather than editing this one —
-- editing an applied migration leaves already-migrated databases behind.
--
-- Notes for the curator:
-- Notes for the curator:
--   * logo_url is set below (separate UPDATE block) only for issuers whose logo
--     has been curated as a self-hosted asset under public/logos/ (no hotlinking).
--     Issuers without a cleared asset stay NULL and render a monogram tile.
--   * official_url and code values are best-known at seed time — re-verify them
--     as part of curation before relying on them in production.
--   * Idempotent: ON CONFLICT (slug) DO NOTHING makes this safe to re-run and to
--     apply on top of an existing catalog without duplicating entries.

-- =============================================================================
-- ISSUERS
-- =============================================================================

INSERT INTO issuers (name, slug, website_url) VALUES
  ('Amazon Web Services', 'aws',              'https://aws.amazon.com/certification/'),
  ('Microsoft',           'microsoft',        'https://learn.microsoft.com/credentials/'),
  ('Cisco',               'cisco',            'https://www.cisco.com/site/us/en/learn/training-certifications/certifications/index.html'),
  ('CompTIA',             'comptia',          'https://www.comptia.org/certifications'),
  ('Google Cloud',        'google-cloud',     'https://cloud.google.com/learn/certification'),
  ('The Linux Foundation','linux-foundation', 'https://training.linuxfoundation.org/certification-catalog/'),
  ('HashiCorp',           'hashicorp',        'https://www.hashicorp.com/certification'),
  ('(ISC)²',              'isc2',             'https://www.isc2.org/certifications'),
  ('Project Management Institute', 'pmi',      'https://www.pmi.org/certifications'),
  ('Scrum.org',           'scrum-org',        'https://www.scrum.org/professional-scrum-certifications'),
  ('Oracle',              'oracle',           'https://education.oracle.com/certification'),
  ('Anthropic',           'anthropic',        'https://www.anthropic.com/')
ON CONFLICT (slug) DO NOTHING;

-- Curated self-hosted logos (public/logos/, no hotlinking — see spec Technical
-- Notes "Logos"). Set via UPDATE so re-seeding also backfills pre-existing rows
-- that ON CONFLICT DO NOTHING left untouched. Only issuers with a cleared asset
-- are listed; the rest keep logo_url NULL and fall back to a monogram tile.
UPDATE issuers SET logo_url = '/logos/aws.png'          WHERE slug = 'aws';
UPDATE issuers SET logo_url = '/logos/cisco.svg'        WHERE slug = 'cisco';
UPDATE issuers SET logo_url = '/logos/google-cloud.svg' WHERE slug = 'google-cloud';
UPDATE issuers SET logo_url = '/logos/hashicorp.png'    WHERE slug = 'hashicorp';

-- =============================================================================
-- CERTIFICATIONS
-- =============================================================================

INSERT INTO certifications (issuer_id, name, slug, code, category, official_url) VALUES
  -- Amazon Web Services
  ((SELECT id FROM issuers WHERE slug='aws'), 'AWS Certified Cloud Practitioner',                 'aws-cloud-practitioner',              'CLF-C02', 'cloud',       'https://aws.amazon.com/certification/certified-cloud-practitioner/'),
  ((SELECT id FROM issuers WHERE slug='aws'), 'AWS Certified Solutions Architect – Associate',    'aws-solutions-architect-associate',   'SAA-C03', 'cloud',       'https://aws.amazon.com/certification/certified-solutions-architect-associate/'),
  ((SELECT id FROM issuers WHERE slug='aws'), 'AWS Certified Developer – Associate',              'aws-developer-associate',             'DVA-C02', 'development', 'https://aws.amazon.com/certification/certified-developer-associate/'),
  ((SELECT id FROM issuers WHERE slug='aws'), 'AWS Certified SysOps Administrator – Associate',   'aws-sysops-administrator-associate',  'SOA-C02', 'systems',     'https://aws.amazon.com/certification/certified-sysops-admin-associate/'),
  ((SELECT id FROM issuers WHERE slug='aws'), 'AWS Certified Solutions Architect – Professional', 'aws-solutions-architect-professional','SAP-C02', 'cloud',       'https://aws.amazon.com/certification/certified-solutions-architect-professional/'),
  ((SELECT id FROM issuers WHERE slug='aws'), 'AWS Certified Security – Specialty',               'aws-security-specialty',              'SCS-C02', 'security',    'https://aws.amazon.com/certification/certified-security-specialty/'),
  ((SELECT id FROM issuers WHERE slug='aws'), 'AWS Certified Data Engineer – Associate',          'aws-data-engineer-associate',         'DEA-C01', 'data',        'https://aws.amazon.com/certification/certified-data-engineer-associate/'),

  -- Microsoft
  ((SELECT id FROM issuers WHERE slug='microsoft'), 'Microsoft Certified: Azure Fundamentals',                          'azure-fundamentals',                        'AZ-900', 'cloud',       'https://learn.microsoft.com/credentials/certifications/azure-fundamentals/'),
  ((SELECT id FROM issuers WHERE slug='microsoft'), 'Microsoft Certified: Azure Administrator Associate',               'azure-administrator-associate',             'AZ-104', 'cloud',       'https://learn.microsoft.com/credentials/certifications/azure-administrator/'),
  ((SELECT id FROM issuers WHERE slug='microsoft'), 'Microsoft Certified: Azure Developer Associate',                   'azure-developer-associate',                 'AZ-204', 'development', 'https://learn.microsoft.com/credentials/certifications/azure-developer/'),
  ((SELECT id FROM issuers WHERE slug='microsoft'), 'Microsoft Certified: Azure Solutions Architect Expert',            'azure-solutions-architect-expert',          'AZ-305', 'cloud',       'https://learn.microsoft.com/credentials/certifications/azure-solutions-architect/'),
  ((SELECT id FROM issuers WHERE slug='microsoft'), 'Microsoft Certified: DevOps Engineer Expert',                      'azure-devops-engineer-expert',              'AZ-400', 'devops',      'https://learn.microsoft.com/credentials/certifications/devops-engineer/'),
  ((SELECT id FROM issuers WHERE slug='microsoft'), 'Microsoft Certified: Security, Compliance, and Identity Fundamentals', 'security-compliance-identity-fundamentals', 'SC-900', 'security', 'https://learn.microsoft.com/credentials/certifications/security-compliance-and-identity-fundamentals/'),
  ((SELECT id FROM issuers WHERE slug='microsoft'), 'Microsoft Certified: Azure Data Fundamentals',                     'azure-data-fundamentals',                   'DP-900', 'data',        'https://learn.microsoft.com/credentials/certifications/azure-data-fundamentals/'),

  -- Cisco
  ((SELECT id FROM issuers WHERE slug='cisco'), 'Cisco Certified Network Associate',              'ccna',                     '200-301', 'networking', 'https://www.cisco.com/site/us/en/learn/training-certifications/certifications/enterprise/ccna/index.html'),
  ((SELECT id FROM issuers WHERE slug='cisco'), 'Cisco Certified Network Professional Enterprise','ccnp-enterprise',          '350-401', 'networking', 'https://www.cisco.com/site/us/en/learn/training-certifications/certifications/enterprise/ccnp-enterprise/index.html'),
  ((SELECT id FROM issuers WHERE slug='cisco'), 'Cisco Certified CyberOps Associate',             'cisco-cyberops-associate', '200-201', 'security',   'https://www.cisco.com/site/us/en/learn/training-certifications/certifications/security/cyberops-associate/index.html'),

  -- CompTIA
  ((SELECT id FROM issuers WHERE slug='comptia'), 'CompTIA A+',        'comptia-a-plus',        '220-1201/1202', 'systems',     'https://www.comptia.org/certifications/a'),
  ((SELECT id FROM issuers WHERE slug='comptia'), 'CompTIA Network+',  'comptia-network-plus',  'N10-009',       'networking',  'https://www.comptia.org/certifications/network'),
  ((SELECT id FROM issuers WHERE slug='comptia'), 'CompTIA Security+', 'comptia-security-plus', 'SY0-701',       'security',    'https://www.comptia.org/certifications/security'),
  ((SELECT id FROM issuers WHERE slug='comptia'), 'CompTIA Linux+',    'comptia-linux-plus',    'XK0-005',       'systems',     'https://www.comptia.org/certifications/linux'),

  -- Google Cloud
  ((SELECT id FROM issuers WHERE slug='google-cloud'), 'Google Cloud Associate Cloud Engineer',      'gcp-associate-cloud-engineer',    NULL, 'cloud', 'https://cloud.google.com/learn/certification/cloud-engineer'),
  ((SELECT id FROM issuers WHERE slug='google-cloud'), 'Google Cloud Professional Cloud Architect',  'gcp-professional-cloud-architect', NULL, 'cloud', 'https://cloud.google.com/learn/certification/cloud-architect'),
  ((SELECT id FROM issuers WHERE slug='google-cloud'), 'Google Cloud Professional Data Engineer',    'gcp-professional-data-engineer',   NULL, 'data',  'https://cloud.google.com/learn/certification/data-engineer'),

  -- The Linux Foundation
  ((SELECT id FROM issuers WHERE slug='linux-foundation'), 'Certified Kubernetes Administrator',          'cka',  NULL, 'devops',  'https://training.linuxfoundation.org/certification/certified-kubernetes-administrator-cka/'),
  ((SELECT id FROM issuers WHERE slug='linux-foundation'), 'Certified Kubernetes Application Developer',  'ckad', NULL, 'devops',  'https://training.linuxfoundation.org/certification/certified-kubernetes-application-developer-ckad/'),
  ((SELECT id FROM issuers WHERE slug='linux-foundation'), 'Linux Foundation Certified System Administrator', 'lfcs', NULL, 'systems', 'https://training.linuxfoundation.org/certification/linux-foundation-certified-sysadmin-lfcs/'),

  -- HashiCorp
  ((SELECT id FROM issuers WHERE slug='hashicorp'), 'HashiCorp Certified: Terraform Associate', 'terraform-associate', '003', 'devops', 'https://www.hashicorp.com/certification/terraform-associate'),

  -- (ISC)²
  ((SELECT id FROM issuers WHERE slug='isc2'), 'Certified in Cybersecurity',                                'isc2-cc', NULL, 'security', 'https://www.isc2.org/certifications/cc'),
  ((SELECT id FROM issuers WHERE slug='isc2'), 'CISSP – Certified Information Systems Security Professional','cissp',   NULL, 'security', 'https://www.isc2.org/certifications/cissp'),

  -- Project Management Institute
  ((SELECT id FROM issuers WHERE slug='pmi'), 'Project Management Professional',           'pmp',  NULL, 'project_management', 'https://www.pmi.org/certifications/project-management-pmp'),
  ((SELECT id FROM issuers WHERE slug='pmi'), 'Certified Associate in Project Management', 'capm', NULL, 'project_management', 'https://www.pmi.org/certifications/certified-associate-capm'),

  -- Scrum.org
  ((SELECT id FROM issuers WHERE slug='scrum-org'), 'Professional Scrum Master I', 'psm-i', NULL, 'project_management', 'https://www.scrum.org/assessments/professional-scrum-master-i-certification'),

  -- Oracle
  ((SELECT id FROM issuers WHERE slug='oracle'), 'Oracle Certified Professional: Java SE 17 Developer', 'oracle-java-se-17-developer', '1Z0-829', 'development', 'https://education.oracle.com/java-se-17-developer/pexam_1Z0-829'),

  -- Anthropic — Claude Certification Program (launched 2026, delivered via
  -- Pearson VUE). Added deliberately: Synedria is built with Claude.
  -- CURATOR CAVEAT: eligibility is currently restricted to organizations in the
  -- Claude Partner Network (registration via the Anthropic Partner Academy), so
  -- unlike open exams (CCNA, Security+) an individual cannot freely sit these
  -- yet. Decide whether that access barrier fits a catalog aimed at individuals
  -- before production. Classed as 'development' (no ai/ml category yet — FR-4a).
  -- official_url points to the Pearson VUE program page; verify a canonical
  -- Anthropic-hosted URL if one exists.
  ((SELECT id FROM issuers WHERE slug='anthropic'), 'Claude Certified Associate – Foundations',  'claude-certified-associate-foundations',  'CCAO-F', 'development', 'https://www.pearsonvue.com/us/en/anthropic.html'),
  ((SELECT id FROM issuers WHERE slug='anthropic'), 'Claude Certified Developer – Foundations',  'claude-certified-developer-foundations',  'CCDV-F', 'development', 'https://www.pearsonvue.com/us/en/anthropic.html'),
  ((SELECT id FROM issuers WHERE slug='anthropic'), 'Claude Certified Architect – Foundations',  'claude-certified-architect-foundations',  'CCAR-F', 'development', 'https://www.pearsonvue.com/us/en/anthropic.html'),
  ((SELECT id FROM issuers WHERE slug='anthropic'), 'Claude Certified Architect – Professional', 'claude-certified-architect-professional', 'CCAR-P', 'development', 'https://www.pearsonvue.com/us/en/anthropic.html')
ON CONFLICT (slug) DO NOTHING;
