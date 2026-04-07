# Referent Transfer

## Summary

Allow a group referent to transfer their role to another member. The transfer requires acceptance from the target member.

## Motivation

Currently a referent cannot leave an open group with other members (ADR-005 enforces single referent). The only option is to close the group, which penalizes all members. A transfer mechanism lets the referent step down gracefully.

## Flow

1. Referent selects a member from the group to nominate as successor
2. The nominated member receives a notification (visible on dashboard and group page)
3. The nominee can accept or decline
4. On acceptance: nominee becomes referent, original referent becomes regular member
5. On decline: nothing changes, referent can nominate someone else

## Database changes

- New table or column to track pending transfers (e.g., `referent_transfers` with `group_id`, `from_user_id`, `to_user_id`, `status`, `created_at`)
- OR reuse `join_requests` pattern with a new status type

## Constraints

- Only one pending transfer per group at a time
- Transfer expires after a configurable period (e.g., 7 days)
- Referent can cancel a pending transfer
- ADR-005 (single referent) remains — the swap is atomic, not a second referent

## Dependencies

- Requires notification system or at minimum a visible indicator on dashboard/group page
