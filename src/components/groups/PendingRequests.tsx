"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";

type JoinRequest = {
  id: string;
  applicant_id: string;
  intro_message: string | null;
  personal_objective: string;
  created_at: string;
  profiles: {
    display_name: string;
    avatar_url: string | null;
    city: string | null;
  };
};

export default function PendingRequests({
  requests,
  groupId,
  groupSlug,
}: {
  requests: JoinRequest[];
  groupId: string;
  groupSlug: string;
}) {
  const t = useTranslations("referent");
  const locale = useLocale();
  const router = useRouter();
  const [processing, setProcessing] = useState<string | null>(null);

  async function handleAction(requestId: string, action: "approve" | "reject") {
    setProcessing(requestId);

    await fetch(`/${locale}/groups/${groupSlug}/manage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action, requestId, groupId }),
    });

    setProcessing(null);
    router.refresh();
  }

  if (requests.length === 0) return null;

  return (
    <section className="mb-8">
      <h2 className="mb-3 text-lg font-semibold text-stone-800 dark:text-stone-200">
        {t("pendingRequests", { count: requests.length })}
      </h2>
      <ul className="space-y-3">
        {requests.map((req) => (
          <li
            key={req.id}
            className="rounded-md border border-amber-200 bg-amber-50 p-4 dark:border-amber-800 dark:bg-amber-950"
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="font-medium text-stone-900 dark:text-stone-100">
                  {req.profiles?.display_name ?? t("unknownUser")}
                </p>
                {req.profiles?.city && (
                  <p className="text-sm text-stone-500 dark:text-stone-400">
                    {req.profiles.city}
                  </p>
                )}
              </div>
              <span className="text-xs text-stone-400">
                {new Date(req.created_at).toLocaleDateString()}
              </span>
            </div>
            <p className="mt-2 text-sm text-stone-700 dark:text-stone-300">
              <span className="font-medium">{t("objective")}:</span>{" "}
              {req.personal_objective}
            </p>
            {req.intro_message && (
              <p className="mt-1 text-sm text-stone-600 dark:text-stone-400">
                <span className="font-medium">{t("message")}:</span>{" "}
                {req.intro_message}
              </p>
            )}
            <div className="mt-3 flex gap-2">
              <button
                onClick={() => handleAction(req.id, "approve")}
                disabled={processing === req.id}
                className="rounded-md bg-green-700 px-3 py-1 text-sm font-medium text-white hover:bg-green-600 disabled:opacity-50 dark:bg-green-600 dark:hover:bg-green-500"
              >
                {t("approve")}
              </button>
              <button
                onClick={() => handleAction(req.id, "reject")}
                disabled={processing === req.id}
                className="rounded-md border border-stone-300 px-3 py-1 text-sm font-medium text-stone-700 hover:bg-stone-100 disabled:opacity-50 dark:border-stone-600 dark:text-stone-300 dark:hover:bg-stone-800"
              >
                {t("reject")}
              </button>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
