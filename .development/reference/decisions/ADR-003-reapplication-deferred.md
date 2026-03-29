# ADR-003: Re-Application After Rejection Deferred to Post-MVP

## Status

Accepted

## Date

2026-03-28

## Context

When a join request is rejected by a group's referent, the question arises: can the candidate apply again? And under what conditions?

This touches moderation, social dynamics, and abuse prevention — areas where premature design can create more problems than it solves.

## Decision

For MVP, a rejected candidate cannot re-apply to the same group. The re-application system is deferred to post-MVP.

## Future Vision

The intended design (to be validated and implemented later) includes:

1. **Candidate messaging**: After rejection, the candidate can send a message to the referent explaining their interest and motivation.
2. **Referent actions**: The referent can either:
   - Reopen the original candidacy and accept it (if within a time window)
   - Explicitly allow re-application for that candidate
3. **Blacklist/whitelist mechanism**: Referents can maintain per-group lists to permanently block or pre-approve specific users.
4. **Cooldown period**: A minimum waiting period before re-application is possible, even when allowed.

## Rationale for Deferral

- **Complexity**: This feature requires messaging infrastructure, moderation UI, and abuse prevention — each substantial in scope.
- **Uncertain dynamics**: Without real users and real rejections, we cannot design the right social mechanics. Building it wrong is worse than not building it.
- **MVP focus**: The MVP validates whether people want to form study groups at all. Rejection edge cases only matter if the core loop works.
- **Safe default**: "No re-application" is the conservative choice. It prevents harassment (repeated unwanted applications) at the cost of some friction for legitimate cases.

## Consequences

- A rejected user who genuinely wants to join has no recourse within the platform for MVP. They would need to contact the referent through external channels.
- This is an intentional trade-off: safety over convenience in the early stage.
- The future vision is documented here to preserve the design intent and avoid re-deriving it later.
