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
  typed function. Already present in `src/lib/dashboard.ts` (3×) and, since
  FR-10a, `search/page.tsx` and `groups/[slug]/join/page.tsx`. Each cast is a
  blind spot: it silences the checker without guaranteeing the runtime shape.

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
