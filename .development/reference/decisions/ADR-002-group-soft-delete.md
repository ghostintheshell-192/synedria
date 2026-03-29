# ADR-002: Groups Are Closed, Never Deleted

## Status

Accepted

## Date

2026-03-28

## Context

When a group ends its activity — whether naturally or by the referent's decision — the platform needs to handle the group record. Two approaches were considered:

1. **Hard delete**: Remove the group and associated data from the database.
2. **Soft delete (close)**: Mark the group as closed. The group page remains visible but is clearly marked as inactive. No new members can join.

## Decision

Groups are closed, never deleted. A closed group retains its page, history, and member records.

## Rationale

- **Data integrity**: Group records are referenced by check-ins, progress updates, and member histories. Hard deletion would require cascading deletes or leave orphaned references.
- **User trust**: Members contributed time and effort. Deleting the group erases visible proof of their participation.
- **SEO continuity**: Public group pages may be indexed. Deleting them creates broken links and lost search equity.
- **Historical value**: Closed groups serve as examples for new users browsing the platform. They show what groups look like with real activity.
- **GDPR compatibility**: User deletion (GDPR right to erasure) is handled separately at the user level — anonymizing their contributions without removing the group structure.

## Consequences

- Groups accumulate over time. Search and discovery must filter by active/closed status (default: active only).
- The group page needs a clear visual state for "closed" groups.
- Storage grows monotonically, but group records are small — not a concern at any foreseeable scale.
- This decision may evolve: future versions could allow archiving or unlisting closed groups.
