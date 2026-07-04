# Key Decisions

⚠️ **Auto-generated digest of high-impact architecture decisions (ADR Impact ≥ high).**
Loaded into every session via the @include in `.claude/CLAUDE.md`. Open the linked ADR for full context.

## High-impact context

Decisions that shape ongoing work — know these before deciding.

- **[ADR-002: Groups Are Closed, Never Deleted](../.development/reference/decisions/002-group-soft-delete.md)** — Groups are closed (soft-deleted), never hard-deleted — pages, history, and member records are preserved; user erasure is handled separately by anonymization.
- **[ADR-005: Single Referent Per Group](../.development/reference/decisions/005-single-referent-per-group.md)** — A single referent per group is enforced by a unique partial index at the database level; no multi-referent flow exists.

---

*Auto-generated from ADRs with Impact ≥ high. Run `.development/scripts/generate-claude-config.sh` to update.*
