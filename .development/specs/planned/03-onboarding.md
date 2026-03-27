# Onboarding

## Overview

Synedria's onboarding follows a no-tutorial philosophy: after first login, users land directly on the dashboard with all features visible. A discrete, non-blocking prompt guides them toward completing the minimum profile information needed to appear in search results.

This soft approach respects the tech-savvy 18-30 target audience, avoids patronizing step-by-step wizards, and stays coherent with the platform's tone. Users can explore freely before completing their profile, but they remain invisible to search until the minimum data is present.

## User Stories

1. As a new user, I want to land directly on the dashboard after my first login so I can immediately see what the platform offers.
2. As a new user, I want to understand what profile information is missing so I know what to complete to be discoverable.
3. As a user with an incomplete profile, I want a gentle reminder (not a blocker) that tells me why completing my profile matters.
4. As a user with an incomplete profile, I want to dismiss the prompt temporarily so it doesn't get in the way while I explore.
5. As a user, I want the prompt to reappear on subsequent visits if my profile is still incomplete, so I don't forget.
6. As a user, I want the prompt to disappear permanently once I've completed the required fields.
7. As a user with a complete profile, I want confirmation that I'm now visible in search results.

## Functional Requirements

### Profile Completeness Check

- FR-1: The system tracks three required fields for search visibility:
  - **At least one skill** with level and intention
  - **City / area**
  - **Time availability** (days and time slots)
- FR-2: A user is considered "search-visible" only when all three requirements are met.
- FR-3: The completeness check is queryable both client-side (for UI) and server-side (for search filtering).

### First-Login Detection

- FR-4: Detect first login (no previous session or profile data beyond OAuth seed).
- FR-5: On first login, show the dashboard prompt in its most visible form.

### Dashboard Prompt

- FR-6: A banner or card displayed on the dashboard when the profile is incomplete.
- FR-7: Tone is a suggestion, not obligation. Example: "Complete your profile to be found by people studying the same things as you."
- FR-8: Lists which specific fields are still missing (e.g., "Add at least one skill", "Set your city", "Set your availability").
- FR-9: Each missing item links directly to the relevant settings section.
- FR-10: Dismissible — user can close it for the current session.
- FR-11: Persistent — reappears on next visit if profile is still incomplete.
- FR-12: Disappears permanently once all required fields are filled.
- FR-13: Never blocks access to any feature — the user can explore freely at all times.

### Search Visibility Indicator

- FR-14: Profile settings page shows current search visibility status.
- FR-15: Clear messaging: "You won't appear in search results until you complete: [list]."
- FR-16: Once complete: positive confirmation that the profile is now discoverable.

## Technical Notes

- **Profile completeness logic**: Implement as a utility function (`getProfileCompleteness`) returning the list of missing fields. Reusable across dashboard, settings, and search filtering.
- **First-login detection**: Check for a flag on the user profile (e.g., `has_completed_onboarding` boolean or absence of profile data).
- **Dismissal state**: `sessionStorage` for session-scoped dismissal. No need to persist server-side — prompt should reappear on new sessions.
- **Search filtering**: The search query (server-side) must exclude users missing any required field. This is a PostgreSQL/Supabase filter, not client-side.
- **App Router**: Completeness check runs in a Server Component, passes result as props to a client-side dismissible banner component.

## Dependencies

### Depends on

- **01-Auth**: user must be logged in; first-login detection requires auth state
- **02-User Profile**: profile fields (skills, city, availability) must exist in the database schema

### Depended on by

- **06-Search/Discovery**: relies on completeness check to filter visible profiles

## Out of Scope

- Step-by-step tutorial or wizard flow
- Tooltips on every feature or guided tours
- Email drip campaigns for incomplete profiles
- Gamification of profile completion (progress bars, badges)
- Forced profile completion before accessing features

## Open Questions

1. Should the banner have a "remind me later" option with a specific delay, or is session-based dismissal sufficient?
2. Should there be a subtle indicator (e.g., a dot on the settings icon) in addition to the dashboard banner?
