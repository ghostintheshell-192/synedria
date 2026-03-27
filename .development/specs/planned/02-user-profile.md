# User Profile

## Overview

The user profile is the foundation of Synedria's matching system. Unlike traditional platforms where a user has a single role, Synedria profiles are **per-skill**: the same person can be advanced on DevOps and beginner on Python, with different intentions for each.

The profile feeds directly into search and group matching — without it, users can't be found and groups can't form. Profile visibility is carefully designed: always private for search engines, visible to group members and potential joiners, with only verifiable facts shown publicly.

## User Stories

1. As a new user, I want to create my profile after signing up so I can be found by potential study partners.
2. As a user, I want to add multiple skills to my profile, each with its own level and intention, so I can participate in groups across different topics.
3. As a user, I want to set my city and neighborhood so that nearby groups can find me.
4. As a user, I want to declare my time availability (days and time slots) so I match with people who have compatible schedules.
5. As a user, I want to set my preferred format (in-person / hybrid / online) so I find compatible groups.
6. As a user, I want to edit or remove skills from my profile as my interests evolve.
7. As a user, I want to view another user's profile (from a group page) to evaluate compatibility before joining.
8. As a user, I want my profile to never appear in search engine results (Google, etc.).

## Functional Requirements

### Profile Data Model

- FR-1: Each user has one profile with the following base fields:
  - Display name (from OAuth provider, editable)
  - Avatar (from OAuth provider, not uploadable in MVP)
  - City / neighborhood (free text, e.g., "zona Navigli, Milano")
  - Time availability (structured: days of the week + time slots)
  - Preferred format: in-person / hybrid / online-only
- FR-2: Each user can have multiple **skill entries**, each with:
  - Skill name / tag (from a predefined tag set or free text)
  - Current level: beginner / intermediate / advanced
  - Intention: wants to learn / wants to teach / wants to work on projects together
  - Concrete goal (optional, free text) — e.g., "get AWS certification by June"
- FR-3: A user must have at least one skill entry, city, and availability to appear in search results.

### Profile CRUD

- FR-4: Profile is created automatically on first login with data from the OAuth provider (name, avatar, email).
- FR-5: User can edit all profile fields from a settings page.
- FR-6: User can add, edit, and remove skill entries.
- FR-7: Changes are saved immediately (no "save" button — or with autosave and clear feedback).

### Profile Views

- FR-8: **Self view** (settings): full edit access to all fields, search visibility indicator.
- FR-9: **Member view** (from group page): shows name, avatar, skills (with levels and intentions), personal objective for that group. Visible to group members and people evaluating whether to join.
- FR-10: **Public reputation data** (future — not in MVP): groups completed, attendance rate, topics studied, times re-invited.

### Privacy and SEO

- FR-11: All user profile pages must have `noindex, nofollow` meta tags — never indexable by search engines.
- FR-12: By default, profile data (name, avatar, skills) is only visible to authenticated users viewing a group that the profile owner belongs to.
- FR-13: A user can enable **"public profile"** in their settings. When enabled, their name and avatar are visible on group pages to unauthenticated visitors as well. This setting is off by default.
- FR-14: Email address is never displayed publicly, regardless of profile visibility setting.

### Account Deletion (GDPR)

- FR-15: On account deletion, all personal data (name, email, avatar, skills, preferences) is removed.
- FR-16: Public group contributions (check-ins, progress updates) are anonymized — attributed to "Former member".

## Technical Notes

- **Database schema**: `profiles` table (1:1 with auth.users) + `user_skills` table (1:many). Skill tags can be a simple text field in MVP, evolving to a normalized tags table later.
- **RLS policies**: Users can only edit their own profile. Profile read access is scoped to group membership context.
- **Avatar**: Use the OAuth provider's avatar URL directly. No file upload in MVP.
- **Availability structure**: Store as JSONB — e.g., `{"monday": ["morning", "evening"], "wednesday": ["afternoon"]}`. Simple and flexible, avoids over-engineering a calendar system.
- **Skill tags**: Start with free text + suggested autocomplete from existing tags in the database. A curated tag list can come later.
- **Server components**: Profile view pages can be Server Components (no client interactivity needed for viewing). Profile edit requires Client Components for form interaction.

## Dependencies

### Depends on

- **01-Auth**: user must be authenticated; profile is seeded from OAuth data on first login
- Supabase database with RLS enabled

### Depended on by

- **03-Onboarding**: checks profile completeness
- **04-Group Creation**: group creator must have a profile
- **06-Search/Discovery**: searches profiles by skill, city, availability
- **07-Join Request**: applicant profile is shown to the referent

## Out of Scope

- Reputation system display (groups completed, attendance rate, re-invitations — needs data, backlog)
- Profile photo upload (use OAuth avatar in MVP)
- Data export / GDPR portability (backlog)
- Profile verification or badges
- Social links (GitHub profile, LinkedIn, etc.)

## Open Questions

1. **Skill tags**: Free text only, or a curated list with autocomplete? Free text is simpler but risks fragmentation ("DevOps" vs "devops" vs "Dev Ops"). Suggestion: free text with case-insensitive matching and autocomplete from existing tags.
2. **Availability granularity**: Time slots (morning/afternoon/evening) or specific hours? Slots are simpler and sufficient for MVP.
3. **Multiple cities**: Can a user set more than one city? (e.g., lives in Monza, works in Milano). For MVP, one city is sufficient.
