# Post-Meeting Check-in

## Overview

The check-in is the heartbeat of every group — a lightweight record that a meeting happened. It's deliberately minimal (not a meeting report) to reduce friction and encourage consistent use. Check-ins serve multiple purposes: they keep the group page fresh (SEO), feed the reputation system (attendance rates), signal group activity (lifecycle management), and provide a meeting history log.

Each member can also update their personal progress alongside check-ins, creating a record of what they've learned over time.

## User Stories

1. As a group member, I want to record that we met so our group page stays active and visible.
2. As a group member, I want to mark who was present at a meeting so attendance is tracked fairly.
3. As a group member, I want to update my personal progress after a meeting so I can track what I've learned.
4. As a group member, I want to see the history of past meetings on the group page.
5. As a potential member, I want to see a group's meeting history to gauge how active they are.
6. As a user viewing my profile, I want to see my attendance rate across groups.

## Functional Requirements

### Check-in Creation

- FR-1: Any group member can create a check-in (not just the referent).
- FR-2: A check-in records:
  - **Date** of the meeting (defaults to today, can be backdated)
  - **Approximate location** (free text — e.g., "Biblioteca Sormani" or "online")
  - **Approximate duration** (e.g., 1h, 1.5h, 2h — simple dropdown or input)
  - **Attendees** (checkboxes for all group members — who was present)
- FR-3: Only one check-in per group per day (prevents duplicates for the same meeting).
- FR-4: Check-ins can be edited by the creator within 48 hours of creation (to correct mistakes).
- FR-5: Check-ins cannot be deleted (they're part of the group's verifiable history).

### Attendance Tracking

- FR-6: Attendance is derived from check-ins: each member's presence/absence at each recorded meeting.
- FR-7: Attendance rate is calculated as: meetings attended / total meetings since joining the group.
- FR-8: Attendance rate is visible on the user's profile (aggregated across all groups) and within the group context.
- FR-9: Attendance is recorded by whoever creates the check-in — it's a group-level record, not self-declared.

### Personal Progress Updates

- FR-10: Each member can post a personal progress update at any time (not necessarily tied to a check-in).
- FR-11: A progress update is a free-text entry (e.g., "completed module 3 on networking", "passed the practice exam").
- FR-12: Progress updates are visible to other group members during the journey.
- FR-13: At the end of a group's journey, members can choose which progress updates to make public on their profile.
- FR-14: Progress updates are attributed to the member and timestamped.

### Meeting History (Group Page)

- FR-15: The group page displays past meetings in reverse chronological order.
- FR-16: Each meeting entry shows: date, location, duration, number of attendees (not names in public view).
- FR-17: In the member view, attendee names are visible for each meeting.
- FR-18: The meeting log is part of the public group page (visible to visitors).

### Activity Indicator

- FR-19: Groups with a check-in in the last 7 days are marked "active this week".
- FR-20: Groups with a check-in in the last 30 days are marked "active this month".
- FR-21: Groups with no check-in in 30+ days show no activity badge (not marked as "inactive" to avoid negative framing).

## Technical Notes

- **Database**: `check_ins` table (group_id, created_by, meeting_date, location, duration, created_at) + `check_in_attendees` junction table (check_in_id, user_id). `progress_updates` table (group_id, user_id, content, created_at, is_public).
- **RLS policies**: Only group members can create check-ins and progress updates. Check-in data is publicly readable (part of the group page). Progress updates are readable by group members; public flag controls visibility to others.
- **One-per-day constraint**: Unique constraint on (group_id, meeting_date) in the database.
- **Attendance calculation**: Can be a database view or computed at query time. For MVP, query-time computation is fine.
- **Backdating limit**: Allow backdating up to 7 days (meetings might not be recorded immediately). Beyond 7 days, the check-in is rejected.

## Dependencies

### Depends on

- **01-Auth**: user must be authenticated
- **04-Group Creation**: check-ins belong to groups
- **07-Join Request**: only members can create check-ins (membership established through join flow)

### Depended on by

- **05-Group Page**: meeting history and activity indicator displayed on the group page
- **06-Search/Discovery**: activity indicator shown in search results
- Future: reputation system (attendance rate), group lifecycle (inactivity detection)

## Out of Scope

- End-of-group check-in ("would you study again with these people?" — backlog)
- Automated reminders to check in after a meeting
- Photo upload for meetings
- Calendar integration (Google Calendar, iCal)
- Meeting scheduling (Synedria records that meetings happened, it doesn't schedule them)
- Detailed meeting notes or minutes

## Open Questions

1. **Who marks attendance?** Currently any member can create the check-in and mark who was present. Should other members be able to confirm/dispute the attendance record? For MVP, trust the creator — disputes are unlikely in groups of 2-5 people.
2. **Anonymous check-ins**: Should check-ins be attributable to a specific creator, or anonymous? Attributable is simpler and more transparent.
3. **Progress update format**: Free text only, or structured milestones? Free text for MVP. Structured milestones could come with the certification catalog integration.
