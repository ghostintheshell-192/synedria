"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/navigation";
import { createClient } from "@/lib/supabase/client";

export default function JoinRequestForm({
  groupId,
  groupName,
  groupSlug,
  userId,
  isOpenAccess,
}: {
  groupId: string;
  groupName: string;
  groupSlug: string;
  userId: string;
  isOpenAccess: boolean;
}) {
  const t = useTranslations("joinRequest");
  const supabase = createClient();
  const router = useRouter();

  const [introMessage, setIntroMessage] = useState("");
  const [personalObjective, setPersonalObjective] = useState("");
  const [saving, setSaving] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!personalObjective.trim()) return;

    setSaving(true);

    if (isOpenAccess) {
      // Direct join
      await supabase.from("group_members").insert({
        group_id: groupId,
        user_id: userId,
        role: "member",
        personal_objective: personalObjective.trim(),
      });
    } else {
      // Submit join request
      await supabase.from("join_requests").insert({
        group_id: groupId,
        applicant_id: userId,
        intro_message: introMessage.trim() || null,
        personal_objective: personalObjective.trim(),
      });
    }

    router.push(`/groups/${groupSlug}`);
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <h1 className="text-2xl font-bold text-stone-900 dark:text-stone-50">
        {isOpenAccess ? t("joinTitle") : t("requestTitle")}
      </h1>
      <p className="text-sm text-stone-500 dark:text-stone-400">
        {t("forGroup", { name: groupName })}
      </p>

      {!isOpenAccess && (
        <div>
          <label className="mb-1 block text-sm font-medium text-stone-700 dark:text-stone-300">
            {t("introMessage")}
          </label>
          <textarea
            value={introMessage}
            onChange={(e) => setIntroMessage(e.target.value)}
            placeholder={t("introPlaceholder")}
            maxLength={500}
            rows={3}
            className="w-full rounded-md border border-stone-300 bg-white px-3 py-2 text-stone-900 dark:border-stone-600 dark:bg-stone-800 dark:text-stone-100"
          />
          <p className="mt-1 text-xs text-stone-400">
            {introMessage.length}/500
          </p>
        </div>
      )}

      <div>
        <label className="mb-1 block text-sm font-medium text-stone-700 dark:text-stone-300">
          {t("personalObjective")} *
        </label>
        <textarea
          value={personalObjective}
          onChange={(e) => setPersonalObjective(e.target.value)}
          placeholder={t("objectivePlaceholder")}
          required
          rows={3}
          className="w-full rounded-md border border-stone-300 bg-white px-3 py-2 text-stone-900 dark:border-stone-600 dark:bg-stone-800 dark:text-stone-100"
        />
      </div>

      <button
        type="submit"
        disabled={saving}
        className="w-full rounded-md bg-amber-600 px-4 py-2 text-sm font-medium text-stone-900 hover:bg-amber-500 disabled:opacity-50 dark:bg-amber-500 dark:text-stone-900 dark:hover:bg-amber-400"
      >
        {saving
          ? t("submitting")
          : isOpenAccess
            ? t("joinButton")
            : t("requestButton")}
      </button>
    </form>
  );
}
