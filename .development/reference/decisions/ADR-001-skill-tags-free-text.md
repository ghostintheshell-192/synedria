# ADR-001: Skill Tags as Free Text

## Status

Accepted

## Date

2026-03-28

## Context

Users describe their skills and interests when creating profiles and groups. The platform needs a system for tagging skills that enables search and matching between users and groups.

Two approaches were considered:

1. **Curated list**: A predefined taxonomy of skills maintained by the platform. Users select from the list, optionally suggesting new tags for approval.
2. **Free text with matching**: Users type freely. The system normalizes input (case-insensitive) and suggests existing tags via autocomplete as the user types.

## Decision

Free text input with case-insensitive matching and UI autocomplete suggestions from existing tags.

## Rationale

- **Low maintenance**: A curated list requires ongoing curation, moderation, and taxonomy decisions. With two people building this, that overhead is not sustainable.
- **User autonomy**: Tech skills evolve rapidly. A curated list would always lag behind what users actually study (e.g., a new framework released last week).
- **Organic normalization**: Autocomplete nudges users toward existing tags without forcing them. Over time, popular tags naturally consolidate.
- **MVP-appropriate**: Free text is simpler to implement. If tag fragmentation becomes a real problem, we can add normalization or merging later without changing the user experience.

## Consequences

- Tags may fragment (e.g., "React", "ReactJS", "react.js"). Mitigated by case-insensitive matching and autocomplete.
- Search quality depends on how well autocomplete surfaces existing tags.
- Future option: batch normalization or tag aliasing if fragmentation becomes measurable.
