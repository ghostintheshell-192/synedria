---
captured: 2026-10-10
status: open
context: "ad-hoc idea from the owner; relates to spec 08 (check-in / personal progress) and spec 10 (certification catalog)"
tags: [api, mcp, ai-agents, integrations, certifications, progress]
---

# AI agent integrations (user side + company side)

## The idea

Expose Synedria through an API / MCP server so AI agents can act on behalf of
users and companies.

**User side.** Members keep their notes wherever they like (paper, Notion,
Obsidian, ...). Today they must update their Synedria progress by hand. With an
MCP server, an AI that already reads their notes can post the personal progress
update for them (spec 08, FR-10/11). Manual entry stays; this is an additional
path, not a replacement.

**Company side (to be explored, less clear).**
- Possible integration with roadmap.sh — needs investigation (what it exposes,
  whether it fits at all).
- API letting companies/issuers add or update their certification
  automatically.

## Why it deserves attention

It removes friction on the one thing the platform depends on: members keeping
their progress current. Fits the vision rule "reduce friction / keep existing
groups healthier".

## Initial assessment

- **User side: solid, small first step.** Scope it to *progress updates only*:
  an MCP tool that writes a free-text update for the authenticated member in a
  group they belong to. Needs per-user scoped tokens (not a service key) so RLS
  keeps working. Open points: token UX, rate limiting, and marking
  agent-authored updates (provenance) so FR-14 attribution stays honest.
- **Company side: the stated use case conflicts with a current decision.** The
  certification catalog is deliberately curated and write-protected (spec 10:
  FR-12, service role / migration only). Letting issuers write directly would
  reverse that. Safer reading: issuers *propose* changes (feeds into the
  existing suggestion flow, FR-13) or a read-only/sync feed the curator
  reviews. Before building, clarify who the real company-side actor is
  (issuers? employers? training providers?) and what they gain.
- roadmap.sh: no official public API or partner program found (checked
  2026-10-10). Content lives as Markdown in the public GitHub repo
  (`kamranahmedse/developer-roadmap`); a community MCP server wraps it, not
  official. Reuse license NOT verified — read the repo license file before
  copying any content. Likely best as a link/reference or "start from this
  roadmap" hint on group creation, not a two-way integration.

## Minimal next step if picked up

1. Spike: read-only MCP server + one write tool `add_progress_update` behind a
   personal access token.
2. Separately, a short discovery note on the company side (actors, value,
   roadmap.sh feasibility) before any spec.
