# Join Request Flow

## Overview

The join request flow is how users become members of existing groups. For groups with active approval (the default), the platform acts as intermediary: the applicant submits a request with an optional introduction, the referent reviews it from their dashboard, and the platform handles notification. The referent's email is never exposed before approval.

For open-access groups, the flow is simpler: the user joins directly without approval.

This flow is critical for MVP because it's the mechanism through which groups grow beyond their founder.

## User Stories

1. As a user, I want to request to join a group so I can study with others who share my interests.
2. As a user, I want to write a brief introduction when requesting to join so the referent knows who I am and why I want to join.
3. As a user, I want to declare my personal objective when joining (e.g., "I want to take the certification by June") so group members know my intention.
4. As a user, I want to see the status of my pending requests (pending / approved / rejected).
5. As a referent, I want to receive an email when someone requests to join my group so I don't miss requests.
6. As a referent, I want to see the applicant's profile and introduction message so I can make an informed decision.
7. As a referent, I want to approve or reject requests from my dashboard.
8. As a user, I want to join an open-access group directly without waiting for approval.

## Functional Requirements

### Request Submission

- FR-1: The "Ask to join" button is visible on the public group page for authenticated users who are not already members.
- FR-2: The button is hidden (or replaced with a message) when:
  - The group is closed
  - The group has reached the 8-member limit
  - The user already has a pending request for this group
  - The user is already a member
- FR-3: Clicking "Ask to join" opens a form with:
  - **Introduction message** (optional, free text, max ~500 characters)
  - **Personal objective** (required, free text — why the user wants to join this specific group)
- FR-4: On submission, a join request record is created with status "pending".

### Notification

- FR-5: The platform sends an email to the group referent: "[User name] wants to join [Group name]".
- FR-6: The email includes a link to the referent's dashboard where the request can be reviewed.
- FR-7: The email does NOT include the applicant's email address or contact information.

### Request Management (Referent Dashboard)

- FR-8: The referent's dashboard shows a list of pending join requests for all their groups.
- FR-9: Each request displays:
  - Applicant's profile summary (name, avatar, relevant skills with levels, city)
  - Introduction message (if provided)
  - Personal objective
  - Request date
- FR-10: The referent can **approve** or **reject** each request.
- FR-11: On approval: the applicant becomes a member, their personal objective is stored, and they receive an email notification.
- FR-12: On rejection: the applicant is notified (generic message, no reason required). They can submit a new request later if they wish.
- FR-13: A pending request that is neither approved nor rejected within 5 days expires automatically and is treated as rejected. This short window ensures applicants can move on quickly and try other groups if the referent is unresponsive.

### Open-Access Groups

- FR-14: For groups with open access, the "Ask to join" button is replaced with "Join group".
- FR-15: Clicking "Join group" immediately adds the user as a member (still requires personal objective declaration).
- FR-16: No email notification to the referent is sent for open-access joins (but the referent can see new members on the group page).

### Request Status (Applicant View)

- FR-17: The applicant can see the status of their requests from their dashboard: pending / approved / rejected / expired.
- FR-18: For pending requests, the group page shows "Request pending" instead of the join button.

## Technical Notes

- **Database**: `join_requests` table (applicant_id, group_id, status, intro_message, personal_objective, created_at, resolved_at, resolved_by).
- **RLS policies**: Applicant can read their own requests. Referent can read/update requests for their groups. No other user can see join requests.
- **Email notifications**: Use Supabase Edge Functions or a lightweight email service (Resend, Postmark). Keep email templates simple — plain text is fine for MVP.
- **Rate limiting**: Consider limiting how many join requests a user can submit per day to prevent spam. Not critical for MVP but worth a simple check.
- **Expiration**: A scheduled job (Supabase cron or Edge Function) to expire old pending requests, or check expiration at query time (simpler for MVP).

## Dependencies

### Depends on

- **01-Auth**: user must be authenticated to submit or manage requests
- **02-User Profile**: applicant's profile is shown to the referent
- **04-Group Creation**: groups must exist; referent role must be assigned
- **05-Group Page**: "Ask to join" button lives on the group page

### Depended on by

- **08-Check-in**: only members (who joined through this flow) can create check-ins

## Out of Scope

- In-platform messaging between applicant and referent
- Automated matching ("you might fit this group")
- Waiting list when group is full
- Invitation system (referent inviting specific users)
- Rejection reason (referent does not explain why)
- Appeal process for rejected requests

## Open Questions

1. **Re-application after rejection**: Should there be a cooldown period before a rejected user can re-apply to the same group? Or unlimited re-application? Unlimited is simpler, and social dynamics will self-regulate.
2. **Multiple pending requests**: Can a user have pending requests to multiple groups simultaneously? Yes — they might be exploring options. But if approved by two groups, they join both (no conflict, a user can be in multiple groups).
3. **Referent rejection notification**: Should the applicant be told they were rejected, or should the request simply expire silently? Explicit rejection is more honest; silent expiry avoids confrontation. Current lean: explicit notification with a gentle, generic message.
