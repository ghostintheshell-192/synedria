# Group Creation

## Overview

Group creation is the founding act of Synedria — it's how new study groups come into existence. Any registered user can create a group when they can't find an existing one that matches their needs. The creator becomes the group's referent, responsible for managing join requests and group settings.

Groups are small by design (recommended 2-5, max 8) and can operate with active approval (default) or open access. The group page is public and SEO-indexable, serving as the group's visible presence on the platform.

## User Stories

1. As a user who can't find a suitable group, I want to create one so that others with similar interests can find and join me.
2. As a group creator, I want to set the group's topic, objective, and location so that the right people can find it.
3. As a group creator, I want to choose whether new members need my approval or can join freely.
4. As a group creator, I want to describe how the group works (study mode, climate, attendance expectations) so potential members can self-select.
5. As a group creator, I want to choose between progress tracking by accumulation or by deadline.
6. As a group referent, I want to edit group settings after creation.
7. As a group referent, I want to transfer my referent role to another member.
8. As a group referent, I want to close the group to new members when we have enough people.

## Functional Requirements

### Group Data Model

- FR-1: A group has the following fields:
  - **Name/title** (free text)
  - **Skill / interest tag** (same tag system as user profiles)
  - **Objective** (free text — e.g., "prepare for AWS Solutions Architect certification")
  - **Roadmap URL** (optional, free text — link to roadmap.sh or similar)
  - **City and area** (free text — e.g., "zona Navigli, Milano")
  - **Preferred format**: in-person / hybrid / online-only
  - **Entry mode**: active approval (default) / open access
  - **Status**: open / closed
  - **Progress tracking mode**: by accumulation / by deadline / both
  - **Deadline** (optional, only if tracking by deadline — e.g., "10 weeks starting March 2026")
  - **Recurring meeting place** (optional, free text — e.g., "Biblioteca Sormani, Milano")
  - **Group description** (structured):
    - Study mode: everyone prepares and explains / practical projects / Q&A taking turns / other
    - Climate: absolute focus / fairly informal / tangents ok
    - Expected attendance: every meeting / flexible

### Creation Flow

- FR-2: Any registered user who has filled all required profile fields (at least one skill with level and intention, city, time availability) can create a group.
- FR-3: Group creation is a single form — all fields on one page, optional fields clearly marked.
- FR-4: The creator is automatically assigned as the group **referent**.
- FR-5: The creator is automatically the first member of the group.
- FR-6: On creation, the group status is "open" by default.
- FR-7: Entry mode defaults to "active approval".

### Referent Role

- FR-8: The referent receives and manages join requests (see 07-Join Request).
- FR-9: The referent can edit all group settings.
- FR-10: The referent can transfer the referent role to any active member of the group.
- FR-11: If the referent leaves the group without transferring, the member with the longest membership is automatically promoted.
- FR-12: There is exactly one referent per group at any time.

### Size Limits

- FR-13: The recommended size is 2-5 members, displayed as guidance during creation.
- FR-14: The hard maximum is 8 members. The system enforces this — no join requests can be submitted or accepted when the group has 8 members.

### Group Settings (Post-Creation)

- FR-15: The referent can edit all group fields after creation.
- FR-16: The referent can change group status between "open" and "closed".
- FR-17: Any member can leave the group at any time.
- FR-18: When a member leaves, their public contributions (check-ins, progress) remain on the group page.

## Technical Notes

- **Database schema**: `groups` table with all fields above + `group_members` junction table (user_id, group_id, role, joined_at).
- **RLS policies**: Anyone can read public group data. Only the referent can update group settings. Only members can see member-only data (personal objectives, contact info).
- **SSR**: Group pages must be server-rendered for SEO. Use Next.js Server Components.
- **Slug**: Generate a URL-friendly slug from the group name for SEO-friendly URLs (e.g., `/groups/devops-study-milano`). Handle collisions with a numeric suffix.
- **Tags**: Use the same tag system as user profiles for skill/interest tags. This enables cross-referencing between users and groups in search.
- **Referent succession**: Implement as a database trigger or application-level check on member removal.

## Dependencies

### Depends on

- **01-Auth**: creator must be authenticated
- **02-User Profile**: creator must have a complete profile (skill, city, availability)
- Tag system (shared with user profiles)

### Depended on by

- **05-Group Page**: displays the created group
- **06-Search/Discovery**: groups appear in search results
- **07-Join Request**: join flow targets a group
- **08-Check-in**: check-ins belong to a group

## Out of Scope

- Certification catalog (MVP uses free text for objective)
- roadmap.sh deep integration (MVP: optional URL field)
- Static map on group page (backlog)
- Group lifecycle / TTL / inactivity detection (backlog)
- Group deletion by referent (backlog — groups can be closed but not deleted in MVP)
- Multiple referents / co-admins

## Open Questions

1. **Group deletion**: Should the referent be able to delete a group entirely, or only close it? Closing preserves history; deletion removes it. Leaning toward close-only in MVP.
2. **Minimum members**: Can a group exist with just the creator (1 member)? Yes — it's a group looking for its first member. The group page should clearly show this.
3. **Tag limit**: Should there be a maximum number of tags per group? One primary tag + optional secondary tags, or unlimited?
