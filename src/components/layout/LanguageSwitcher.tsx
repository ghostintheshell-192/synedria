"use client";

import { Fragment, useTransition } from "react";
import { useLocale, useTranslations } from "next-intl";
import { usePathname, useRouter } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";
import { createClient } from "@/lib/supabase/client";

type Props = {
  // When set, the choice is persisted to the user's profile so it follows
  // them across devices. Anonymous visitors rely on next-intl's cookie.
  userId?: string | null;
};

export default function LanguageSwitcher({ userId }: Props) {
  const t = useTranslations("header");
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  async function switchTo(target: string) {
    if (target === locale || isPending) return;

    if (userId) {
      const supabase = createClient();
      const { data, error } = await supabase
        .from("profiles")
        .update({ preferred_locale: target })
        .eq("id", userId)
        .select("id");

      // The switch itself still works through next-intl's cookie, so a failed
      // write only means the choice won't follow the user across devices —
      // not worth blocking the UI, but not worth swallowing either.
      if (error || !data?.length) {
        console.error("Could not persist preferred_locale", error);
      }
    }

    // next-intl also sets the NEXT_LOCALE cookie, persisting the choice
    // for anonymous visitors within the device.
    startTransition(() => {
      router.replace(pathname, { locale: target });
    });
  }

  return (
    <div className="flex items-center gap-1 text-xs" aria-label={t("language")}>
      {routing.locales.map((loc, i) => (
        <Fragment key={loc}>
          {i > 0 && (
            <span className="text-stone-300 dark:text-stone-600">/</span>
          )}
          <button
            type="button"
            onClick={() => switchTo(loc)}
            disabled={isPending}
            aria-current={loc === locale ? "true" : undefined}
            className={
              loc === locale
                ? "font-semibold text-amber-700 dark:text-amber-500"
                : "text-stone-400 hover:text-amber-700 disabled:opacity-50 dark:text-stone-500 dark:hover:text-amber-500"
            }
          >
            {loc.toUpperCase()}
          </button>
        </Fragment>
      ))}
    </div>
  );
}
