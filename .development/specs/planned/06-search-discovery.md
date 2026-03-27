# Search and Discovery

## Overview

Search is how users find groups to join — it's the bridge between signing up and participating. The primary search target is groups (not individual users), filtered by skill, location, availability, and format. Geography is a filter, not a feature: the value is shared learning with compatible people, not proximity for its own sake.

The search interface is deliberately text-based (no map view in MVP). In early phases with few users, a list with three results communicates opportunity; three pins on a map communicates emptiness.

## User Stories

1. As a user, I want to search for groups by skill/topic so I can find people studying what I want to learn.
2. As a user, I want to filter groups by city so I only see groups I can physically attend.
3. As a user, I want to filter by format (in-person / hybrid / online) to match my preference.
4. As a user, I want to filter by time availability so I find groups that meet when I'm free.
5. As a user, I want to see at a glance whether a group is active (recent check-ins) or dormant.
6. As a user seeing no results, I want to be encouraged to create a group rather than leave the platform.
7. As a visitor (not logged in), I want to browse groups to evaluate the platform before signing up.

## Functional Requirements

### Search Interface

- FR-1: Search page with a text input for skill/topic and filter controls for:
  - City / area (text, with autocomplete from existing group locations)
  - Format: in-person / hybrid / online-only (multi-select)
  - Time availability: days and time slots (matching user's availability structure)
- FR-2: Filters combine with AND logic — results must match all active filters.
- FR-3: Search is available to both authenticated and unauthenticated users.
- FR-4: The search page is itself indexable for SEO (e.g., `/search?skill=devops&city=milano` generates a meaningful page).

### Results Display

- FR-5: Results show groups only (not individual users).
- FR-6: Each result card displays:
  - Group name / objective
  - Skill tags
  - City and area
  - Format (in-person / hybrid / online)
  - Status (open / closed)
  - Member count (e.g., "3/8")
  - Activity indicator (last check-in date or "active this week" / "active this month" / "inactive")
- FR-7: Only groups with status "open" appear in search results by default.
- FR-8: Results are sorted by relevance, with secondary sort by recent activity.
- FR-9: Each result links to the group's public page.

### Empty States

- FR-10: When no results match the filters, show a clear message with:
  - Suggestion to broaden filters
  - Prominent call-to-action: "No groups found? Create one!" (links to group creation, requires login)
- FR-11: When there are few results (e.g., < 3), show the create-group CTA alongside results.

### Search Filtering Logic

- FR-12: Skill search uses case-insensitive matching against group tags.
- FR-13: City search matches against the group's city/area field (case-insensitive, partial match).
- FR-14: Availability matching: show groups whose meeting times overlap with the user's declared availability. For unauthenticated users, skip this filter.
- FR-15: Groups with incomplete or missing data still appear if they match available filters.

## Technical Notes

- **Search implementation**: Start with PostgreSQL `ILIKE` queries for text search. Upgrade to full-text search (`tsvector`/`tsquery`) or Supabase's built-in search if performance or relevance becomes an issue.
- **Autocomplete for city**: Query distinct city values from existing groups. No external geocoding API needed.
- **Activity indicator**: Derived from the most recent check-in date. Computed at query time or cached as a materialized view if performance requires it.
- **Pagination**: Implement cursor-based or offset pagination. For MVP with few groups, a simple load-more button is sufficient.
- **URL-driven filters**: All filters should be reflected in the URL query string for shareability and SEO. Server-side rendering with these parameters.
- **Server Component**: The search results list can be a Server Component. Filter controls are Client Components that update URL params.

## Dependencies

### Depends on

- **04-Group Creation**: groups must exist to be searched
- **02-User Profile**: availability matching uses the user's profile data
- **03-Onboarding**: only users with complete profiles appear in any user-facing results (if user search is added later)
- **09-i18n**: search page and results use translated UI strings

### Depended on by

- **07-Join Request**: search results lead to group pages where users request to join
- **05-Group Page**: search results link to group pages

## Out of Scope

- Interactive map with group pins (backlog — needs critical mass)
- User search / user directory (users are found through groups)
- AI-powered matching or recommendations
- Saved searches or search alerts
- Advanced filters (group size preference, progress stage, etc.)

## Open Questions

1. **Relevance ranking**: What defines "relevance"? Tag exact match > partial match > related tags? For MVP, exact match on tags + recency is probably sufficient.
2. **Closed groups in results**: Should closed groups appear in results at all (grayed out, for context), or be hidden entirely? Hiding them is simpler and avoids frustration.
3. **Federated search**: Should search also return individual users looking for groups (not yet in one)? This could help bootstrap — two people searching for the same thing could find each other. Deferred to post-MVP.
