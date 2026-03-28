"use client";

import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { createClient } from "@/lib/supabase/client";

export default function LogoutButton() {
  const supabase = createClient();
  const router = useRouter();
  const t = useTranslations("auth");

  async function handleLogout() {
    await supabase.auth.signOut();
    router.refresh();
  }

  return (
    <button
      onClick={handleLogout}
      className="text-sm text-zinc-500 hover:text-zinc-700 dark:text-zinc-400 dark:hover:text-zinc-200"
    >
      {t("signOut")}
    </button>
  );
}
