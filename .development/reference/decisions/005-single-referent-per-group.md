# ADR-005: Single Referent Per Group

**Date**: 2026-04-07
**Status**: Accepted
**Impact**: high
**Summary**: A single referent per group is enforced by a unique partial index at the database level; no multi-referent flow exists.

## Context

The `group_members` table allows any member to have the role `referent`. The RLS policy "Referent can update roles" permits a referent to change any member's role within their group, including promoting others to referent. There is no database constraint limiting the number of referents per group.

This creates an uncontrolled privilege surface: once a second referent is created, there is no mechanism to revoke the role, no audit trail of who promoted whom, and no consent required from the original referent. While the practical risk for a study group platform is low, this violates the principle of least privilege.

## Decision

Enforce a single referent per group via a unique partial index on the database. No multi-referent functionality is exposed in the UI.

## Rationale

- Eliminates privilege escalation surface entirely at the database level
- Simplifies the authorization model: one referent, one decision-maker
- Avoids building revocation, consent, and audit features that aren't needed yet
- The RLS policy for role updates becomes effectively a no-op (referent cannot promote anyone because the constraint blocks it)

## Trade-offs

- Single point of failure: if the referent leaves or becomes inactive, the group loses its administrator
- No delegation possible (referent cannot go on vacation and hand off temporarily)

## Future considerations

When the platform has active groups and real usage patterns, evaluate whether multi-referent is needed. If so, design the complete flow: nomination, acceptance, revocation, and audit logging. Remove the unique index and replace with application-level controls.
