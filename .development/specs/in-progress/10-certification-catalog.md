# Certification Catalog

## Overview

Today a group's target is captured as free text in the `objective` field
(e.g., "prepare for AWS Solutions Architect certification"). This works but
can't be searched, filtered, or shown consistently. The certification catalog
adds an **optional structured layer on top** of that free text: a curated set
of official certifications a group can point to, so that people looking for
"a group preparing for the AWS SAA" can actually find one.

The catalog is a **finite, official reference universe** — the opposite of the
free-text skill tags (ADR-001), which are open and personal. That difference is
exactly what justifies a curated catalog here while skills stay free-form.

**Scope of this first pass**: catalog data model + optional link from a group +
search filter. Profile ("certifications I hold / aim for"), learning logs, and
earned-badge integrations (Credly / Open Badges) are explicitly **out of scope**
and belong to later features.

## User Stories

1. As a person searching, I want to filter groups by the certification they
   target, so I can find a group preparing for the exam I care about.
2. As a group creator, I want to optionally tag my group with an official
   certification, so the right people find it without me writing exact prose.
3. As a group creator with no matching catalog entry, I want to still describe
   my objective in free text, so the catalog never blocks group creation.
4. As a user, I want to suggest a missing certification (name + official link),
   so the catalog grows without me being able to pollute it directly.
5. As the platform curator, I want to add / rename / retire catalog entries
   without ever breaking a group that already references one.

## Functional Requirements

### Catalog Model

- FR-1: The catalog has two normalized tables — **issuers** and
  **certifications**. A group's link to a certification is stored **once**, as a
  single nullable foreign key on the existing `groups` table (FR-9) — never as a
  list of groups on the certification side. The reverse direction ("which groups
  target this certification") is a query, not stored data, so the two can never
  diverge.
- FR-2: An **issuer** has:
  - `id` (surrogate UUID — the stable identity, never changes)
  - `name` (display name — mutable)
  - `slug` (stable handle, unique)
  - `website_url`
  - `logo_url` (optional)
  - `is_active` (boolean, default true)
- FR-3: A **certification** has:
  - `id` (surrogate UUID — stable identity)
  - `issuer_id` (FK → issuers.id)
  - `name` (display name — mutable, e.g. "Solutions Architect – Associate")
  - `slug` (stable handle, unique)
  - `code` (optional, mutable — e.g. "SAA-C03")
  - `category` (**fixed enum**, not free text — see FR-4a)
  - `official_url`
- FR-4a: `category` is a Postgres enum (`certification_category`), not free
  text, to prevent inconsistent ad-hoc naming as entries are added over time.
  Starter values: `cloud`, `networking`, `security`, `data`, `devops`,
  `development`, `systems`, `project_management`. There is deliberately **no
  `other` catch-all** — a genuinely new category is added via migration
  (`ALTER TYPE ... ADD VALUE`), keeping categorization a conscious act.
  - `is_active` (boolean, default true)
- FR-4: A certification is modeled at the level of the **named credential**, not
  the exam version. A version bump (SAA-C02 → SAA-C03) updates the `code` field;
  it does **not** create a new catalog entry (which would fragment groups).

### Identity & Robustness

- FR-5: All references use the surrogate `id`, never a mutable business
  attribute (name, code, URL). Renaming an issuer or certification is a
  single-row update that propagates automatically; nothing pointing to it breaks.
- FR-6: Catalog entries are **never hard-deleted**. Retiring an issuer or
  certification sets `is_active = false`. This mirrors ADR-002 (groups are
  closed, not deleted) — preserve history, hide from future selection.
- FR-7: Retired entries disappear from pickers used to create/edit groups
  (filtered by `is_active = true`), but groups that already reference a retired
  entry keep showing it (historical truth).
- FR-8: Foreign keys use `ON DELETE RESTRICT` — consistent with FR-6, deletion
  never happens, so no cascade damage is possible.

### Group Link

- FR-9: A group MAY reference exactly **one** certification via a nullable
  `certification_id` (FK → certifications.id) on the `groups` table.
  - One certification per group is deliberate: a person realistically pursues
    one certification at a time. Multi-certification groups are out of scope
    (revisit only if a real need appears).
- FR-10: The free-text `objective` field on the group **remains**. The
  certification is optional structure *on top* — a group can point to a catalog
  entry, describe its goal in free text, or both. The catalog never blocks
  group creation.
- FR-10a: A group creator may **derive the group title from the linked
  certification** instead of typing a custom one, for maximum clarity about what
  the group does. To support this:
  - `groups.name` becomes **nullable**.
  - A CHECK constraint requires at least one of (`name`, `certification_id`) to
    be present — a group always has a title, custom or derived; the only
    forbidden state is neither.
  - The displayed title is **derived, never copied**:
    `title = group.name ?? certification.name` (the certification name is read
    live from the catalog). If the certification is later renamed (FR-5), the
    derived title follows automatically — no stored copy, no divergence,
    consistent with FR-1.
  - Cases covered: custom name only (as today); custom name + certification
    (custom title wins, certification still drives filter/badge); certification
    only (title derived).
- FR-11: Where a group references a certification, its page, search card, **and
  the groups list** show the certification name + issuer, with the curated
  issuer logo (see Technical Notes) where available. When the title is derived
  from the certification (FR-10a), the issuer logo sits alongside the derived
  title prominently, so the group's target is clear at a glance.

### Suggestions (Hybrid Curation)

- FR-12: The catalog is **curated**: entries are added by the platform curator
  via seed / migration / manual SQL. There is no in-app write path for the
  catalog.
- FR-13: Users can **suggest** a missing certification through a lightweight
  form that sends an email to the curator with a free-text name and an official
  link. The curator evaluates and adds it manually.
  - Start with email only. A persisted `certification_suggestions` table and a
    review queue are out of scope until volume justifies them.
- FR-13a: The suggestion entry point is a link placed **directly below the
  certification list/picker** (in the group-creation form), styled to be
  noticeable — not tucked away — e.g. "Can't find your certification? Suggest
  one." Discoverability matters: a suggestion path nobody sees never grows the
  catalog.

### Search & Discovery

- FR-14: Search gains a **certification filter** alongside the existing
  skill / city filters (see 06-Search/Discovery).
- FR-15: The filter offers only `is_active = true` certifications.
- FR-16: (Optional, if cheap) allow filtering/grouping by **issuer** as a
  coarser cut — enabled by the normalized issuers table.

## Technical Notes

- **Database schema**: two new tables (`issuers`, `certifications`) + one
  nullable FK column (`certification_id`) on `groups`, plus making `groups.name`
  nullable with the `name OR certification_id` CHECK constraint (FR-10a). New
  migration in `supabase/migrations/` (next sequential number after `00007`).
- **Slug generation**: the group slug currently derives from `name`. With a
  nullable name (FR-10a), generate the slug from the **effective display title**
  — i.e. from the certification name when the title is derived. Keep collision
  handling (numeric suffix) unchanged.
- **RLS**:
  - `issuers` and `certifications`: **public read** (reference data), **no
    client write** (no INSERT/UPDATE/DELETE policy for authenticated users).
    Writes happen only via migration / service role.
  - `groups.certification_id`: writable only by the group referent, same policy
    as other group fields.
- **Seed**: ship an initial curated set of common tech certifications (AWS,
  Cisco, Microsoft, CompTIA, etc.) as a seed so the feature is useful on day one.
- **Types**: extend `src/types/database.ts` with `Issuer` and `Certification`.
- **Logos**: curate our own issuer logo assets — recover each issuer's official
  logo and store it as a project-hosted asset, with `logo_url` pointing to it.
  Do **not** hotlink external badge/logo images (licensing + stability). Treat
  logo sourcing as part of the curation work when seeding an issuer.
- **Distinction from badges**: earned-credential badges (Credly / Open Badges
  2.0) are proof a *specific person* passed an exam — a different concern from
  this abstract catalog, and there is no "in-progress" badge. Any badge work
  belongs to a future profile / learning-logs feature, not here.

## Dependencies

### Depends on

- **04-Group Creation**: the `groups` table gains the `certification_id` link,
  and `name` becomes optional (title may be derived from the certification —
  FR-10a). That spec's "Name/title (free text)" required field must be updated
  to reflect the new optional-with-CHECK rule.
- **02-User Profile**: unchanged for this pass (no profile certifications yet).

### Depended on by

- **05-Group Page**: displays the linked certification.
- **06-Search/Discovery**: certification filter.
- Future: profile "certifications held / targeted", learning logs, and any
  Credly / Open Badges earned-badge integration.

## Out of Scope

- Profile-level certifications (held or targeted) — future feature.
- Learning logs and any roadmap.sh integration — roadmap.sh has no certification
  program or public API today; its value is learning *paths*, which belong to
  the learning-logs axis, not this catalog. Re-verify their capabilities when
  that feature is scheduled.
- Earned-badge integration (Credly / Open Badges) — future, profile-side.
- Multi-certification groups.
- In-app catalog editing UI / admin panel — curation via seed + SQL for now.
- Persisted suggestion queue — email form only to start.
- Automatic import from any external certification API — none suitable exists;
  curation is the deliberate, robust choice.

## Resolved Decisions

1. **Category taxonomy** → fixed enum `certification_category` (FR-4a). Chosen
   over free text to prevent inconsistent naming drift as entries accumulate —
   the same structure-over-drift logic that motivates the catalog itself.
2. **Issuer logos** → curate our own asset set: recover each official logo and
   store it project-hosted (Technical Notes). No hotlinking.
3. **Suggestion form placement** → a noticeable link directly below the
   certification list in the group-creation form (FR-13a), not hidden away.

## Open Questions

*None blocking. Any refinements surface during implementation.*
