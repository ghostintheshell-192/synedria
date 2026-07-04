# ADR-004: Public Profile Default

**Date**: 2026-04-07
**Status**: Accepted
**Impact**: medium
**Summary**: `is_public_profile` defaults to `true` (member identities visible on public group pages), with no UI toggle exposed yet.

## Context

The `profiles` table has a boolean field `is_public_profile` that controls whether a user's name and avatar are visible on public group pages to non-members. The field was originally set to `false` by default, with the intention of adding a toggle in the profile settings later.

In practice, this meant that all members appeared as "? Membro" on public group pages, making it impossible for potential members to see who was in a group before joining. This undermined the platform's core principle that reputation emerges from visible activity, and reduced the usefulness of public group pages for discovery.

## Decision

Set `is_public_profile` to `true` by default for all profiles. No toggle is exposed in the UI at this stage.

## Rationale

- Group pages are designed to be public and indexable — hiding member identities contradicts this
- The platform's philosophy is that reputation comes from visibility, not from explicit ratings
- No user has ever requested profile privacy, because there are no users yet
- Adding a toggle now would add complexity for a scenario that may never arise

## Future considerations

When the platform has active users, conduct a user survey to understand privacy preferences. If demand exists, add an `is_public_profile` toggle in the profile settings page. The database field and RLS policies are already in place to support this.
