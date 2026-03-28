"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import type { MissingField } from "@/lib/profile";

export default function OnboardingBanner({
  missingFields,
}: {
  missingFields: MissingField[];
}) {
  const t = useTranslations("onboarding");
  const [dismissed, setDismissed] = useState(() => {
    if (typeof window === "undefined") return false;
    return sessionStorage.getItem("onboarding-dismissed") === "true";
  });

  if (dismissed || missingFields.length === 0) {
    return null;
  }

  function handleDismiss() {
    sessionStorage.setItem("onboarding-dismissed", "true");
    setDismissed(true);
  }

  return (
    <div className="rounded-lg border border-zinc-200 bg-white p-5 dark:border-zinc-700 dark:bg-zinc-800">
      <div className="flex items-start justify-between">
        <div>
          <p className="font-medium text-zinc-900 dark:text-zinc-100">
            {t("title")}
          </p>
          <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
            {t("description")}
          </p>
          <ul className="mt-3 space-y-1">
            {missingFields.map((field) => (
              <li key={field} className="text-sm">
                <Link
                  href="/profile"
                  className="text-zinc-700 underline hover:text-zinc-900 dark:text-zinc-300 dark:hover:text-zinc-100"
                >
                  {t(`missing.${field}`)}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <button
          onClick={handleDismiss}
          className="ml-4 text-zinc-400 hover:text-zinc-600 dark:text-zinc-500 dark:hover:text-zinc-300"
          aria-label={t("dismiss")}
        >
          ✕
        </button>
      </div>
    </div>
  );
}
