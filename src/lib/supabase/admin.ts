import { createClient } from "@supabase/supabase-js";

// Server-only: this client uses the Supabase secret key and must never reach
// the browser. The key is not NEXT_PUBLIC_ (so Next strips it from any client
// bundle); this guard fails loudly if the module is ever loaded client-side.
if (typeof window !== "undefined") {
  throw new Error("admin client must never be used in the browser");
}

export function createAdminClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SECRET_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } }
  );
}
