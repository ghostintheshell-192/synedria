import { createBrowserClient } from "@supabase/ssr";

// Wrapped rather than inlined below so the cache can be typed as
// ReturnType<typeof makeClient>: createBrowserClient is generic, and taking
// ReturnType of it directly instantiates the type parameters with their
// defaults, degrading the client to an untyped one at every call site.
function makeClient() {
    return createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!
    );
}

// Callers invoke this from component bodies, so a fresh client would be built
// on every render — 23 call sites' worth of GoTrueClient instances competing
// over the same Web Locks and auth state. One per browser context is enough,
// and this keeps the call sites unchanged.
let browserClient: ReturnType<typeof makeClient> | undefined;

export function createClient() {
    browserClient ??= makeClient();

    return browserClient;
}