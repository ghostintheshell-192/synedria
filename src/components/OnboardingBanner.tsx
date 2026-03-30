"use client";

import { useSyncExternalStore } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import type { MissingField } from "@/lib/profile";

export default function OnboardingBanner({
  missingFields,
}: {
  missingFields: MissingField[];
}) {
  const t = useTranslations("onboarding");

  const dismissed = useSyncExternalStore(
    (callback) => {
      window.addEventListener("storage", callback);
      return () => window.removeEventListener("storage", callback);
    },
    () => sessionStorage.getItem("onboarding-dismissed") === "true",
    () => false
  );

  if (dismissed || missingFields.length === 0) {
    return null;
  }

  function handleDismiss() {
    sessionStorage.setItem("onboarding-dismissed", "true");
    window.dispatchEvent(new Event("storage"));
  }

  return (
    <div className="rounded-lg border border-stone-200 bg-white p-5 dark:border-stone-700 dark:bg-stone-800">
      <div className="flex items-start justify-between">
        <div>
          <p className="font-medium text-stone-900 dark:text-stone-100">
            {t("title")}
          </p>
          <p className="mt-1 text-sm text-stone-500 dark:text-stone-400">
            {t("description")}
          </p>
          <ul className="mt-3 space-y-1">
            {missingFields.map((field) => (
              <li key={field} className="text-sm">
                <Link
                  href="/profile"
                  className="text-stone-700 underline hover:text-stone-900 dark:text-stone-300 dark:hover:text-stone-100"
                >
                  {t(`missing.${field}`)}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <button
          onClick={handleDismiss}
          className="ml-4 text-stone-400 hover:text-stone-600 dark:text-stone-500 dark:hover:text-stone-300"
          aria-label={t("dismiss")}
        >
          ✕
        </button>
      </div>
    </div>
  );
}
