# Synedria - Current Status

*Last updated: 2026-03-25*

## Project Phase

**Current phase**: Pre-development (vision complete, documentation setup)
**Next milestone**: M1 - Project scaffolding and database schema

## What Exists

- **Vision document** (`vision.md`) - Complete product vision, v0.3
- **Project documentation** - Full development infrastructure set up
- **Name chosen**: Synedria (from Greek synedria, "to sit together")
- **Domains identified**: synedria.app (primary), synedria.it (Italian market)

## Next Steps

1. **Repository initialization** - git init, .gitignore, package.json
2. **Next.js scaffolding** - App Router, TypeScript, Tailwind CSS
3. **Supabase setup** - Project creation, initial schema design
4. **Database schema** - Users, groups, skills, check-ins
5. **Authentication** - GitHub, Google, Apple ID via Supabase Auth

## Quick Links

| What | Where |
|------|-------|
| **Vision** | `vision.md` |
| **Specs** | `.development/specs/` |
| **Tech debt** | `.development/tech-debt/` |
| **ADR** | `.development/reference/decisions/` |

## Methodology

**Spec-Driven Development**: each feature has a dedicated specification in `specs/`.
- `specs/implemented/` - working features
- `specs/planned/` - confirmed for upcoming milestones
- `specs/backlog/` - validated but not scheduled
