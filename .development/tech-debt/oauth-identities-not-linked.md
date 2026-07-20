---
type: bug
priority: high
status: open
discovered: 2026-07-20
related: []
related_decision: null
---

# One person signing in with two OAuth providers becomes two users

## Description

Signing in with GitHub and signing in with Google produce two distinct
`auth.users` rows, and therefore two distinct `profiles` rows. Nothing in the
platform recognises them as the same human being.

This is not hypothetical: it is the current state of production. Valentina's own
account exists twice — once via GitHub (the one used throughout development) and
once via Google — and the duplication was only noticed by accident while
inspecting the `profiles` table during an unrelated investigation.

`supabase/config.toml` has `enable_manual_linking = false`, and no part of the
application attempts to reconcile identities. The signup trigger
(`handle_new_user`) creates one profile per auth user unconditionally.

## Impact

The most concrete consequence is that **the same person can join the same group
twice**. `group_members` has `UNIQUE (group_id, user_id)`, which dedupes by
account, not by person — two accounts are two `user_id`s and the constraint
never fires. A group capped at five members could hold three actual people.

That directly undercuts a core product commitment: groups of 2-5 real humans who
meet in person. A roster that overstates its own size is worse than a small
group, because members plan around a number that isn't real.

Secondary effects, all following from the same split:

- Reputation-by-visibility is diluted: check-ins, group history and activity are
  divided across two identities, so neither reflects the person's real presence.
- Profile completeness must be redone per account; a user who completed their
  profile once appears incomplete after signing in with the other provider.
- Account deletion (`/api/account`) erases one identity and silently leaves the
  other intact — a GDPR-relevant gap, since a user asking to be forgotten would
  reasonably believe they had been.
- A person could hold two seats in a group with different `personal_objective`
  values, with no way for the referent to tell.

## Proposed Solution

**Investigate first**: check whether the two `auth.users` rows carry the same
email. Supabase links identities automatically when a second provider returns an
email that is already present *and verified*; if that did not happen here, the
reason decides the fix. Different emails on the two providers means automatic
linking could never have fired, and no configuration change would have prevented
this — the mitigation is then detection and merging, not settings.

Depending on that answer, in rough order of preference:

1. **Rely on verified-email linking** where the emails do match, and confirm the
   project's auth settings actually permit it.
2. **Enable manual linking** (`enable_manual_linking = true`) plus a "link
   another sign-in method" flow in the profile page, which also covers the
   different-email case.
3. **Detect and warn at signup**: when a new OAuth identity arrives with an email
   already present in `profiles`, surface it instead of silently creating a
   second account.
4. **Restrict to a single provider per person** — simplest, but discards the
   convenience of offering both.

Whatever is chosen, a **merge path for the accounts that already exist** is
needed separately; configuration only prevents new duplicates.

## Notes

- Raised by Valentina on 2026-07-20 after noticing her own duplicate profile
  rows in production while diagnosing the silent-write-failure bug.
- The duplication was invisible until someone read the database directly. Worth
  a one-off query over `profiles` for repeated emails before launch, to size how
  widespread this already is.
- Interacts with [ADR-005](../reference/decisions/005-single-referent-per-group.md):
  the single-referent partial unique index still holds per group, but a person
  with two accounts could be referent under one and an ordinary member under the
  other, which the index cannot detect.
