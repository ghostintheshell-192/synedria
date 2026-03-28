"use client";

import { createClient } from "@/lib/supabase/client";
import { useTranslations } from "next-intl";

export default function LoginButton() {
  const supabase = createClient();
  const t = useTranslations("auth");

  async function handleLogin() {
    await supabase.auth.signInWithOAuth({
      provider: "github",
      options: {
        redirectTo: window.location.origin + "/it/auth/callback",
      },
    });
  }

  return (
    <button
      onClick={handleLogin}
      className="rounded-md bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-700 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-300"
    >
      {t("signInGithub")}
    </button>
  );
}
