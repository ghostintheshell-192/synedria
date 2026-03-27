# Public Group Page

## Overview

The group page is the public face of every study group on Synedria. It serves two audiences: search engines and potential members (who see public info to evaluate the group), and current members (who use it as a group dashboard). Group pages are server-rendered and SEO-indexable by default, designed to be found via searches like "gruppo di studio DevOps Milano".

Active groups produce fresh, unique content through check-ins and progress updates — exactly what search engines reward over time.

## User Stories

1. As a visitor (not logged in), I want to view a group's public page so I can evaluate whether to sign up and join.
2. As a logged-in user, I want to view a group's page to decide if I want to request to join.
3. As a group member, I want to see the group dashboard with progress, meeting history, and member info.
4. As a group referent, I want to manage group settings from the group page.
5. As a group referent, I want to toggle whether the group page is indexable by search engines.
6. As a potential member, I want to see how the group works (study mode, climate, frequency) before requesting to join.
7. As a potential member, I want to see the personal objectives of current members to understand the group's composition.

## Functional Requirements

### Public View (Visitors and Logged-in Non-Members)

- FR-1: The public view displays:
  - Group name and objective
  - Skill/interest tags
  - City and area
  - Preferred format (in-person / hybrid / online)
  - Status: open (accepting members) or closed
  - Current member count (e.g., "3/8 members")
  - Group description: study mode, climate, attendance expectations
  - Progress tracking: current progress (by accumulation or deadline)
  - Meeting log: dates, approximate locations, durations of past meetings
  - Recurring meeting place (if set)
  - Roadmap URL (if set, as external link)
- FR-2: If the group is open, show a prominent "Ask to join" button (requires login).
- FR-3: If the group is closed or full (8 members), the join button is replaced with a clear message.

### Member View (Authenticated Group Members)

- FR-4: Everything in the public view, plus:
  - Member list with names, avatars, skills, and personal objectives
  - Access to check-in creation (see 08-Check-in)
  - Personal progress update form
  - Group settings link (referent only)
- FR-5: Members see each other's personal objectives (declared at join time).

### Referent View

- FR-6: Everything in the member view, plus:
  - Link to group settings (edit all group fields)
  - Pending join requests indicator (see 07-Join Request)
  - Toggle for search engine indexability
  - Referent transfer option

### SEO and Indexability

- FR-7: Group pages are indexable by default (`index, follow` meta tags).
- FR-8: The referent can disable indexing (sets `noindex, nofollow`).
- FR-9: SSR (server-side rendering) for all public content — search engines see the full page content.
- FR-10: SEO metadata: `<title>`, `<meta description>`, Open Graph tags (og:title, og:description, og:image).
- FR-11: URL structure is SEO-friendly: `/groups/[slug]` (e.g., `/groups/devops-study-milano`).
- FR-12: `hreflang` tags for i18n (see 09-i18n).

### Meeting Log

- FR-13: Past meetings are displayed in reverse chronological order.
- FR-14: Each meeting entry shows: date, approximate location, duration, number of attendees.
- FR-15: The meeting log is visible to everyone (public view).

## Technical Notes

- **Server Components**: The group page is primarily a Server Component for SSR. Interactive elements (join button, check-in form, settings) are Client Components embedded within.
- **Dynamic routes**: `app/[locale]/groups/[slug]/page.tsx` — locale prefix for i18n, slug for SEO.
- **RLS**: Public group data is readable by anyone (including anonymous). Member-specific data (personal objectives, member details) requires authentication and group membership.
- **Open Graph image**: Generate a simple OG image with group name, topic, and city. Can use a template-based approach (no dynamic image generation needed in MVP).
- **Structured data**: Consider adding JSON-LD structured data (Event or Organization schema) for richer search results. Not critical for MVP but beneficial.
- **Caching**: Group pages with infrequent updates benefit from ISR (Incremental Static Regeneration) or `revalidate` in Next.js. Balance freshness with performance.

## Dependencies

### Depends on

- **01-Auth**: determines which view to show (public / member / referent)
- **04-Group Creation**: group data must exist
- **09-i18n**: locale routing and translated UI strings

### Depended on by

- **06-Search/Discovery**: search results link to group pages
- **07-Join Request**: "Ask to join" button lives on this page
- **08-Check-in**: check-in form and meeting log displayed here

## Out of Scope

- Static neighborhood map (Leaflet + OpenStreetMap — backlog)
- Certification catalog display (MVP: just text in objective field)
- Group lifecycle indicators (TTL warnings, inactivity notices — backlog)
- Social sharing buttons
- Comments or discussion on the group page

## Open Questions

1. **OG image**: Static template with text overlay, or skip OG image in MVP and just use text metadata?
2. **ISR vs SSR**: Should group pages use ISR with a revalidation interval, or full SSR on every request? ISR is better for performance, but check-in freshness matters.
3. ~~**Member list visibility**~~ **Resolved**: Member details are private by default. Each user can enable "public profile" in their settings — if enabled, their name and avatar are visible on group pages to unauthenticated visitors. Member count is always public regardless of individual settings.
