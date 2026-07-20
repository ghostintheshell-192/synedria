---
type: refactor
priority: high
status: open
discovered: 2026-07-19
related: []
related_decision: ../reference/decisions/001-skill-tags-free-text.md
---

# Group tag model is single + coarse (no curated multi-tags)

## Description

Two limitations of the current tag model surfaced while wiring the
certification link into group creation (increment #4 of the catalog feature):

1. **A group carries only one tag.** `groups.skill_tag` is a single
   `text NOT NULL` column. A group can express exactly one topic.
2. **The catalog's tagging is coarse.** A certification has a single
   `category` enum (`cloud`, `security`, `data`, …). Real certifications are
   categorized with **several** tags on their official pages — e.g. AWS
   Solutions Architect is cloud *and* architecture *and* infrastructure. The
   seed flattens all of that to one enum value.

As a stopgap, the create form seeds the (editable) skill tag from the
**issuer** name ("AWS", "Cisco") rather than the category, because the issuer
is more concrete and searchable than a macro-category like "data". But it is
still a single tag, chosen once.

## Impact

- **Discovery is impoverished — and discovery is the core of Synedria.** A
  group preparing AWS SAA, tagged only "AWS", does not surface for someone
  searching "cloud" or "architecture". The one thing the platform must do well
  (help the right people find each other) is degraded by a one-word tag.
- **Cross-referencing users ↔ groups is weak.** The tag system is shared with
  user profiles (ADR-001) precisely to match them; a single coarse tag on each
  side limits how well that matching works.
- **The category enum is too coarse for a good filter** (FR-14–16 in the
  certification-catalog spec), which was one of the catalog's motivations.
- **No post-creation fix today.** There is no group-edit flow yet (FR-9/FR-15
  of spec 04 are unimplemented), so whatever tag is chosen at creation is
  effectively permanent until that lands.

## Proposed Solution

1. **Curate multi-tags on the catalog.** Add `tags text[]` to `certifications`,
   populated in the seed by looking at how each certification is actually
   categorized on the issuer's official page. Keep `category` as the coarse
   filter cut; `tags[]` is the rich layer.
2. **Let a group carry more than one tag.** This answers the open question
   already recorded in spec 04 ("Tag limit: one primary + optional secondary,
   or unlimited?"). Likely `groups.skill_tag` → a normalized `group_tags` table
   or a `text[]` column. On cert selection, seed the group's tags from the
   certification's curated `tags[]` (still editable).
3. **Wire search** (FR-14–16) and revisit **ADR-001** so the free-text tag
   system and the curated catalog tags interoperate coherently.

## Notes

- Discovered during increment #4 (group-creation form + certification link),
  branch `feature/group-certification-link`.
- Flagged **important** by the product owner: it touches discovery, the
  platform's central value.
- Coupled to the missing **group-edit** flow (FR-9/FR-15): without edit, tag
  quality at creation matters more, not less.
- Deliberately kept out of increment #4 to avoid scope creep — that increment
  is a coherent, finished block (link, derived title, suggestion, auto-fill).
