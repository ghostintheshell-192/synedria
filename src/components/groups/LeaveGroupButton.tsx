"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { createClient } from "@/lib/supabase/client";

export default function LeaveGroupButton({
  groupId,
  userId,
  isReferent,
  isLastMember,
  isOpen,
}: {
  groupId: string;
  userId: string;
  isReferent: boolean;
  isLastMember: boolean;
  isOpen: boolean;
}) {
  const t = useTranslations("groupPage");
  const router = useRouter();
  const supabase = createClient();

  const [showConfirm, setShowConfirm] = useState(false);
  const [leaving, setLeaving] = useState(false);

  // Referent cannot leave an open group if other members exist
  if (isReferent && !isLastMember && isOpen) {
    return (
      <p className="text-sm text-stone-400 dark:text-stone-500">
        {t("leaveBlockedReferent")}
      </p>
    );
  }

  async function handleLeave() {
    setLeaving(true);

    await supabase
      .from("group_members")
      .delete()
      .eq("group_id", groupId)
      .eq("user_id", userId);

    router.refresh();
  }

  if (!showConfirm) {
    return (
      <button
        onClick={() => setShowConfirm(true)}
        className="block text-sm text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300"
      >
        {isLastMember ? t("leaveAndClose") : t("leaveGroup")}
      </button>
    );
  }

  return (
    <div className="flex flex-col items-start gap-2 sm:flex-row sm:items-center sm:gap-3">
      <p className="text-sm text-red-600 dark:text-red-400">
        {isLastMember ? t("leaveAndCloseConfirm") : t("leaveConfirm")}
      </p>
      <div className="flex gap-2">
        <button
          onClick={handleLeave}
          disabled={leaving}
          className="rounded-md bg-red-600 px-3 py-2 text-sm font-medium text-white hover:bg-red-700 disabled:opacity-50 dark:bg-red-700 dark:hover:bg-red-600"
        >
          {leaving ? t("leaving") : t("leaveConfirmButton")}
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
