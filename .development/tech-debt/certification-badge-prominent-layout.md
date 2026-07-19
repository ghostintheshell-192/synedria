---
type: refactor
priority: low
status: open
discovered: 2026-07-19
related: []
related_decision: null
---

# Prominent certification badge takes a full row on the group page

## Description

On the group page header, the prominent `CertificationBadge` (amber box) sits
on its **own full-width row** below the title. It reads as a heavy block rather
than a natural part of the header, especially now that — for derived titles —
it only carries the issuer (e.g. "🎓 Anthropic"), which is short.

## Impact

- Purely cosmetic; no functional problem. The information is correct and shown
  everywhere it should be (FR-11).
- The full-row block feels disproportionate to its short content and separates
  the title from its metadata pills more than necessary.

## Proposed Solution

Rework the prominent variant's placement/size — e.g. inline next to the title,
or a lighter inline treatment sitting with the skill/city/format pills, rather
than a standalone full-width box. Keep the compact variant (cards) as is.
Revisit together with issuer-logo work (#2), since a real logo changes the
badge's visual weight.

## Notes

- Raised by Valentina while reviewing increment #6/#7 (badge display); the
  concept was approved, layout deferred to a refinement pass.
- Branch `feature/group-certification-link`.
