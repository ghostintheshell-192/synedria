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
        className="rounded-md bg-amber-600 px-4 py-2 text-sm font-medium text-stone-900 hover:bg-amber-500 dark:bg-amber-500 dark:text-stone-900 dark:hover:bg-amber-400"
      >
        {t("signInGithub")}
      </button>
      <button
        onClick={() => handleLogin("google")}
        className="rounded-md border border-stone-300 bg-white px-4 py-2 text-sm font-medium text-stone-700 hover:bg-stone-100 dark:border-stone-600 dark:bg-stone-800 dark:text-stone-300 dark:hover:bg-amber-500"
      >
        {t("signInGoogle")}
      </button>
    </div>
  );
}
