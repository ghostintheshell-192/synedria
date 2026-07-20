---
type: code-quality
priority: medium
status: open
discovered: 2026-07-19
related: []
related_decision: null
---

# Supabase client is untyped (no Database generic)

## Description

The Supabase clients (`src/lib/supabase/server.ts`, `client.ts`) are created
without the generated `Database` generic:

```ts
createServerClient(url, key, { cookies: { ... } }) // no <Database>
```

`src/types/database.ts` is **hand-written** and holds only entity types
(`Profile`, `Certification`, …) — it is *not* the generated schema type with
`Tables` / `Relationships`. As a result every query result is effectively
`any`, and supabase-js types nested relations as an **array** by default.

## Impact

- No type safety across the entire data layer: column typos, wrong field
  names, and shape mismatches are not caught at compile time — the opposite of
  the project's "TypeScript strict" stance.
- Forces `as unknown as { ... }` casts wherever a query result is passed to a
  typed function. Each cast is a blind spot: it silences the checker without
  guaranteeing the runtime shape. There are **8**, all from the same cause —
  without the generic, supabase-js types a nested relation as an array rather
  than to-one:
  - `src/lib/dashboard.ts` — 4 (lines 66, 99, 121, 136)
  - `src/lib/certifications.ts` — 1 (line 23)
  - `src/app/api/account/route.ts` — 1 (line 23)
  - `src/app/[locale]/groups/[slug]/join/page.tsx` — 1 (line 104)
  - `src/app/[locale]/search/page.tsx` — 1 (line 130)

## Proposed Solution

Generate the schema type and pass it as the client generic:

1. `npx supabase gen types typescript --local > src/types/database.generated.ts`
   (run against the local DB; regenerate after each migration).
2. `createServerClient<Database>(...)` / `createBrowserClient<Database>(...)`.
3. Remove the `as unknown as` casts — with the generic in place, a FK-based
   relation like `certification:certification_id(name)` is typed to-one, so the
   array/object mismatch disappears at the source.
4. Keep the hand-written entity types only if still useful for app-level DTOs;
   otherwise derive them from the generated `Database`.

## Notes

Medium priority: not a runtime bug (the casts are correct at runtime today),
but it erodes type safety broadly and grows a maintenance cost with every new
query. Best tackled as a focused pass, not piecemeal. Regenerating types needs
the Supabase CLI against the local DB (Valentina runs it; the sandbox can't
reach it over TCP).
