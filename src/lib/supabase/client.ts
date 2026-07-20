import { createBrowserClient } from "@supabase/ssr";

// Callers invoke this from component bodies, so a fresh client would be built
// on every render — 23 call sites' worth of GoTrueClient instances competing
// over the same Web Locks and auth state. One per browser context is enough,
// and this keeps the call sites unchanged.
let browserClient: ReturnType<typeof createBrowserClient> | undefined;

export function createClient() {
    browserClient ??= createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!
    );

    return browserClient;
}