---
type: feature
priority: critical
status: open
discovered: 2026-07-19
related: []
related_decision: null
---

# No group-edit flow — referent cannot change a group after creation

## Description

A group referent has **no way to modify their group after creating it**. The
only write to the `groups` table anywhere in the codebase is the `INSERT` in
`GroupCreateForm`; there is no `UPDATE groups` and no edit page. A referent can
close the group, manage join requests, and leave — but cannot change name,
skill tag, objective, city, format, entry mode, or the linked certification.

This is **specified but unbuilt**: spec 04 (`04-group-creation.md`), FR-9 ("The
referent can edit all group settings") and FR-15 ("edit all group fields after
creation"). It is an implementation gap, not a design decision.

## Impact

- **Whatever is chosen at creation is permanent.** A typo, a wrong city, a
  certification linked by mistake, or a derived default the user meant to refine
  (skill tag seeded from the issuer, objective implied by the certification) can
  never be corrected. The only escape is to close the group and start over —
  which, per ADR-002, is not even a delete: the abandoned group persists.
- **Directly undercuts the certification work just shipped.** Increment #4
  leans on editable-at-creation defaults; without edit, "editable" only holds
  for the few seconds before submit.
- **Core referent capability missing.** Managing a group is a headline promise
  of the referent role (spec 04, User Stories 6); today it is half-there.

## Proposed Solution

Three pieces, each a twin of an existing creation-side piece:

1. **Edit form** — like `GroupCreateForm`, pre-filled with current values
   (reuse the same fields, validation, title toggle, certification combobox).
2. **Route/action** doing the `UPDATE groups` for the changed fields.
3. **RLS UPDATE policy** allowing the update **only by the group's referent**.
   Current RLS covers insert and the F2-hardened `group_members` writes, not
   field updates on `groups` — verify and add the policy (with a pgTAP `rls_`
   regression, per the test harness).

## Notes

- Surfaced during increment #4 (certification link), branch
  `feature/group-certification-link`.
- **Sequencing:** agreed as the next work *after* the certification-catalog
  spec is finished (issuer logos, group-page/card cert display, search filter).
  Tracked in memory `next-work-group-edit`.
- Coupled to the tag-model tech-debt (`group-tag-model-single-and-coarse`):
  without edit, tag/objective quality at creation matters more, not less.
