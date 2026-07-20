# Coding Standards

## Naming Conventions

- **Components**: `PascalCase` (e.g., `GroupCard`, `SearchFilter`)
- **Files - components**: `PascalCase.tsx` (e.g., `GroupCard.tsx`)
- **Files - utilities/hooks**: `camelCase.ts` (e.g., `useGroups.ts`, `formatDate.ts`)
- **Files - API routes**: `route.ts` in kebab-case directories (Next.js App Router convention)
- **Variables/functions**: `camelCase`
- **Constants**: `UPPER_SNAKE_CASE`
- **Types/Interfaces**: `PascalCase`, no `I` prefix (e.g., `Group`, `UserProfile`)
- **Database tables/columns**: `snake_case` (PostgreSQL convention)

## Code Style

- **TypeScript**: Strict mode enabled
- **Linting & formatting**: ESLint with Next.js recommended config is the single
  gate (`npm run lint`, wired into the format-check hook and CI via
  `.development/automation/format-check.sh`). No separate formatter is configured;
  if Prettier is adopted later, add it there.
- **Imports order**:
  1. React/Next.js
  2. Third-party libraries
  3. Local modules (absolute paths with `@/`)
  4. Relative imports (styles, types)

## File Organization

- **App Router**: `app/` directory for pages and API routes
- **Components**: `components/` with co-located styles and tests
- **Database**: `lib/supabase/` for client, server client, and types
- **Utilities**: `lib/` for shared logic
- **Types**: Co-located where possible; `types/` for shared types

## Documentation

- **Language**: English for code and comments
- **Focus**: Explain "why", not "what"
- **JSDoc**: For exported functions and complex logic only
- **No over-documenting**: Self-evident code needs no comments

## Supabase Conventions

- **Row Level Security**: Always enabled on every table
- **RLS policies**: Defined in SQL migrations, never bypassed in application code
- **Auth**: Use Supabase Auth helpers for Next.js (SSR-compatible)
- **Migrations**: Sequential, in `supabase/migrations/`
