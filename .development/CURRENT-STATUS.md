# Synedria - Current Status

*Last updated: 2026-07-04*

## Project Phase

**Current phase**: MVP live in production, refinement + feature-depth stage
**Next milestone**: Certification catalog (first of the two remaining large features)

## Tech Stack (as built)

- **Next.js 16** (App Router, `--webpack`) + **React 19**
- **Supabase** (PostgreSQL, Auth, RLS)
- **next-intl 4** — i18n (IT/EN)
- **Tailwind CSS 4**
- **TypeScript** strict

Codebase: ~47 source files, ~4,100 LOC. No outstanding TODO/FIXME markers.

## What Exists (implemented & on `develop`)

- **Auth** — GitHub OAuth via Supabase (SSR-compatible)
- **User profile** — skills (free-text tags, ADR-001), availability, locale preference, public-by-default (ADR-004)
- **Onboarding** flow
- **Groups** — creation, public group page, single-referent enforcement (ADR-005)
- **Search & discovery** — filters (skill/city), realtime, N+1 fixes applied
- **Join requests** — with pending-requests management
- **Check-in** — attendance logging
- **Group lifecycle** — leave group (referent safeguards), close group, auto-close empty groups
- **GDPR** — account deletion with confirmation flow, privacy & cookie pages
- **i18n** — full IT/EN, independent copy per language (not literal translations)

### Database

Migrations `00001`–`00007`, all applied in production (verified 2026-04-16).
See `.development/reference/technical/database-schema.md`.

## Open Threads

- **Landing page hero** — redesign from April is intentionally *non-final*; being lived-in before crystallizing (`src/components/landing/LandingPage.tsx`).
- **Release cadence** — `develop` is the integration branch; `main` is production (auto-deploys to Vercel).

## Next Steps

1. **Certification catalog** — design (schema, spec, UI) then implement
2. **Learning logs** — after the catalog
3. Secondary backlog: back-navigation arrow, max-length validation on text fields, group edit page, referent transfer (`specs/backlog/referent-transfer.md`), request expiration

## Quick Links

| What | Where |
|------|-------|
| **Vision** | `vision.md` |
| **Specs** | `.development/specs/` |
| **Tech debt** | `.development/tech-debt/` |
| **ADR** | `.development/reference/decisions/` |
| **DB schema** | `.development/reference/technical/database-schema.md` |

## Methodology

**Spec-Driven Development**: each feature has a dedicated specification in `specs/`.
- `specs/planned/` - specs for shipped/confirmed features
- `specs/backlog/` - validated but not scheduled
</content>
</invoke>
