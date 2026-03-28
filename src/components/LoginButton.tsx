"use client";

import { createClient } from "@/lib/supabase/client";

export default function LoginButton() {
    const supabase = createClient();

    async function handleLogin() {
        await supabase.auth.signInWithOAuth({
            provider: "github",
            options: {
                redirectTo: window.location.origin + "/it/auth/callback",
            },
        });
    }
    return (
  <div className="App">
    <button  onClick={handleLogin}>Sign In</button>
  </div>
  );

}