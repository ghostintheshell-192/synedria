"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { createClient } from "@/lib/supabase/client";

export default function CloseGroupButton({ groupId }: { groupId: string }) {
  const t = useTranslations("groupPage");
  const router = useRouter();
  const supabase = createClient();

  const [showConfirm, setShowConfirm] = useState(false);
  const [closing, setClosing] = useState(false);

  async function handleClose() {
    setClosing(true);

    await supabase
      .from("groups")
      .update({ status: "closed" })
      .eq("id", groupId);

    router.refresh();
  }

  if (!showConfirm) {
    return (
      <button
        onClick={() => setShowConfirm(true)}
        className="block text-sm text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300"
      >
        {t("closeGroup")}
      </button>
    );
  }

  return (
    <div className="flex flex-col items-start gap-2 sm:flex-row sm:items-center sm:gap-3">
      <p className="text-sm text-red-600 dark:text-red-400">
        {t("closeGroupConfirm")}
      </p>
      <div className="flex gap-2">
        <button
          onClick={handleClose}
          disabled={closing}
          className="rounded-md bg-red-600 px-3 py-2 text-sm font-medium text-white hover:bg-red-700 disabled:opacity-50 dark:bg-red-700 dark:hover:bg-red-600"
        >
          {closing ? t("closingGroup") : t("closeConfirmButton")}
        </button>
        <button
          onClick={() => setShowConfirm(false)}
          className="text-sm text-stone-500 underline hover:text-stone-700 dark:text-stone-400 dark:hover:text-stone-200"
        >
          {t("leaveCancel")}
        </button>
      </div>
    </div>
  );
}
