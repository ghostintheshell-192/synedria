"use client";

import { createClient } from "@/lib/supabase/client";
import { useLocale, useTranslations } from "next-intl";

export default function LoginButton() {
  const supabase = createClient();
  const t = useTranslations("auth");
  const locale = useLocale();

  async function handleLogin(provider: "github" | "google") {
    await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: window.location.origin + `/${locale}/auth/callback`,
      },
    });
  }

  return (
    <div className="flex flex-col gap-2">
      <button
        onClick={() => handleLogin("github")}
        className="rounded-md bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-700 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-300"
      >
        {t("signInGithub")}
      </button>
      <button
        onClick={() => handleLogin("google")}
        className="rounded-md border border-zinc-300 bg-white px-4 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-100 dark:border-zinc-600 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-700"
      >
        {t("signInGoogle")}
      </button>
    </div>
  );
}
