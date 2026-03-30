import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";

export default async function LandingPage() {
  const t = await getTranslations("landing");

  return (
    <div className="flex flex-col items-center">
      {/* Hero */}
      <section className="flex min-h-[60vh] flex-col items-center justify-center px-4 text-center">
        <h1 className="text-4xl font-bold tracking-tight text-stone-900 sm:text-5xl dark:text-stone-50">
          {t("hero")}
        </h1>
        <p className="mt-4 max-w-lg text-lg text-stone-600 dark:text-stone-400">
          {t("heroSub")}
        </p>
        <div className="mt-8 flex gap-4">
          <Link
            href="/search"
            className="rounded-md bg-amber-600 px-5 py-2.5 text-sm font-medium text-stone-900 hover:bg-amber-500 dark:bg-amber-500 dark:hover:bg-amber-400"
          >
            {t("searchCta")}
          </Link>
          <Link
            href="/login"
            className="rounded-md border border-stone-300 px-5 py-2.5 text-sm font-medium text-stone-700 hover:bg-stone-100 dark:border-stone-600 dark:text-stone-300 dark:hover:bg-stone-800"
          >
            {t("signInCta")}
          </Link>
        </div>
      </section>

      {/* How it works */}
      <section className="w-full max-w-3xl px-4 py-16">
        <div className="grid gap-8 sm:grid-cols-3">
          <div className="text-center">
            <div className="mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-amber-100 text-lg font-bold text-amber-800 dark:bg-amber-900/40 dark:text-amber-400">
              1
            </div>
            <h3 className="font-semibold text-stone-900 dark:text-stone-100">
              {t("step1Title")}
            </h3>
            <p className="mt-1 text-sm text-stone-500 dark:text-stone-400">
              {t("step1Desc")}
            </p>
          </div>
          <div className="text-center">
            <div className="mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-amber-100 text-lg font-bold text-amber-800 dark:bg-amber-900/40 dark:text-amber-400">
              2
            </div>
            <h3 className="font-semibold text-stone-900 dark:text-stone-100">
              {t("step2Title")}
            </h3>
            <p className="mt-1 text-sm text-stone-500 dark:text-stone-400">
              {t("step2Desc")}
            </p>
          </div>
          <div className="text-center">
            <div className="mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-amber-100 text-lg font-bold text-amber-800 dark:bg-amber-900/40 dark:text-amber-400">
              3
            </div>
            <h3 className="font-semibold text-stone-900 dark:text-stone-100">
              {t("step3Title")}
            </h3>
            <p className="mt-1 text-sm text-stone-500 dark:text-stone-400">
              {t("step3Desc")}
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
