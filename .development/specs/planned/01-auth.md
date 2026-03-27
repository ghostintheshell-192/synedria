# Authentication (OAuth)

## Overview

User authentication via social login (OAuth) is the entry point for all authenticated features in Synedria. Registration happens exclusively through OAuth providers — no email+password flow — reducing friction, eliminating password management overhead, and leveraging provider-level account quality as an implicit filter against throwaway profiles.

This is a foundational MVP feature: without authentication, no user can create a profile, form a group, or request to join one.

## User Stories

1. As a visitor, I want to sign up using my GitHub account so I can register quickly without creating another password.
2. As a visitor, I want to sign up using my Google account so I can register even if I don't have a GitHub account.
3. As a visitor, I want to sign up using my Apple ID so I can register from my Apple device without friction.
4. As a returning user, I want to log in with the same provider I used to register so I can resume where I left off.
5. As a logged-in user, I want to log out so that my session ends and my account is not accessible on shared devices.
6. As a logged-in user, I want to delete my account so that my personal data is removed in compliance with GDPR.
7. As a visitor, I want to browse public group pages without logging in so I can evaluate the platform before committing.

## Functional Requirements

### OAuth Flow

- FR-1: The application must support three OAuth providers: GitHub, Google, and Apple ID.
- FR-2: All three providers are available from day one — no staged rollout.
- FR-3: The sign-up and sign-in flows use the same OAuth entry point (Supabase handles new vs returning users transparently).
- FR-4: After successful OAuth, the user is redirected to the dashboard with an active session.
- FR-5: If a user attempts OAuth with a provider email that already exists under a different provider, the system must handle the conflict gracefully (Supabase default: separate accounts per provider unless explicitly linked).

### Session Management

- FR-6: Sessions are managed via Supabase Auth helpers for Next.js, SSR-compatible.
- FR-7: Session tokens are stored in HTTP-only cookies (not localStorage) for security and SSR compatibility.
- FR-8: Sessions persist across page reloads and browser restarts until explicit logout or token expiry.
- FR-9: Expired sessions redirect the user to the login page with a clear message.

### Protected Routes

- FR-10: Public routes (group pages, landing page, search) are accessible without authentication.
- FR-11: Authenticated routes (profile, group management, join requests) redirect unauthenticated users to the login page.
- FR-12: Route protection is enforced server-side via Next.js middleware, not client-side only.

### Logout

- FR-13: Logout clears the session on both client and server (Supabase signOut).
- FR-14: After logout, the user is redirected to the landing page.

### Account Deletion

- FR-15: A logged-in user can request account deletion from their profile settings.
- FR-16: Account deletion requires explicit confirmation (e.g., type "DELETE" or confirm dialog).
- FR-17: On deletion, all personal data is removed (profile, email, OAuth tokens, preferences).
- FR-18: Public group contributions (check-ins, progress updates visible on group pages) are anonymized, not deleted — group continuity is preserved.
- FR-19: Account deletion is irreversible. The user is informed of this before confirming.
- FR-20: After deletion, the user is logged out and redirected to the landing page.

## Technical Notes

- **Supabase Auth** handles all three OAuth providers natively — no custom OAuth implementation needed.
- **Auth helpers**: Use `@supabase/ssr` for Next.js App Router integration (replaces the deprecated `@supabase/auth-helpers-nextjs`).
- **Middleware**: Next.js middleware (`middleware.ts`) refreshes the session on every request and enforces route protection.
- **Server components**: Use `createServerClient` from `@supabase/ssr` to access the session in Server Components and Route Handlers.
- **Client components**: Use `createBrowserClient` from `@supabase/ssr` for client-side session access where needed.
- **Callback route**: A `/auth/callback` route handler is needed to exchange the OAuth code for a session after provider redirect.
- **Apple ID specifics**: Apple requires a registered Services ID and domain verification. Apple also returns the user's name only on the first login — it must be captured and stored immediately.
- **Account deletion**: Supabase Admin API (`auth.admin.deleteUser`) is needed server-side. This requires the service role key, which must never be exposed to the client.
- **No identity linking in phase 1**: If a user signs in with GitHub and later tries Google (same email), these are treated as separate accounts. Identity linking can be added later if needed.

## Dependencies

### Depends on

- Supabase project provisioned with Auth enabled
- OAuth apps registered with GitHub, Google, and Apple (client IDs and secrets configured in Supabase dashboard)
- Environment variables: `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY` (server-only)

### Depended on by

- **02-User Profile**: requires authenticated user to create/edit profile
- **All authenticated features**: group creation, join requests, check-ins — all require a session

## Out of Scope

- Email+password authentication (by design — never planned)
- Identity verification (no need in phase 1)
- Admin roles and admin dashboard
- Identity linking across providers
- Two-factor authentication
- Rate limiting on auth endpoints (handled by Supabase infrastructure)

## Open Questions

1. **Apple ID name capture**: Apple only sends the user's name on first consent. Need a fallback strategy if not captured (e.g., prompt user to enter name manually on first profile setup).
2. **Session duration**: Supabase default is 1 hour with automatic refresh. Is this appropriate, or should it be extended?
