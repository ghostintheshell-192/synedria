# Synedria

A platform for forming small, intentional study groups built on shared interests and goals, with an explicit preference for in-person meetings.

From the Greek *synedria* — "to sit together".

## Tech Stack

- **Next.js** (App Router) — frontend + API
- **Supabase** — PostgreSQL, auth, row-level security
- **Vercel** — deployment
- **Tailwind CSS** — styling

## Development

```bash
npm run dev     # Start dev server
npm run build   # Production build
npm run lint    # Lint
```

### Database tests

Schema and row-level-security policies are tested with pgTAP against the local
Supabase stack:

```bash
npx supabase db reset   # apply migrations + seed on a clean local db
npx supabase test db    # run every test in supabase/tests/
```

See [supabase/tests/README.md](supabase/tests/README.md) for conventions.

## Documentation

- [Vision](vision.md) — product vision and design principles
- [Architecture](.development/ARCHITECTURE.md) — technical architecture
- [Current Status](.development/CURRENT-STATUS.md) — project state
