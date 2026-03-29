import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";

export default async function LandingPage() {
  const t = await getTranslations("landing");

  return (
    <div className="flex flex-col items-center">
      {/* Hero */}
      <section className="flex min-h-[60vh] flex-col items-center justify-center px-4 text-center">
        <h1 className="text-4xl font-bold tracking-tight text-zinc-900 sm:text-5xl dark:text-zinc-50">
          {t("hero")}
        </h1>
        <p className="mt-4 max-w-lg text-lg text-zinc-600 dark:text-zinc-400">
          {t("heroSub")}
        </p>
        <div className="mt-8 flex gap-4">
          <Link
            href="/search"
            className="rounded-md bg-zinc-900 px-5 py-2.5 text-sm font-medium text-white hover:bg-zinc-700 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-300"
          >
            {t("searchCta")}
          </Link>
          <Link
            href="/login"
            className="rounded-md border border-zinc-300 px-5 py-2.5 text-sm font-medium text-zinc-700 hover:bg-zinc-100 dark:border-zinc-600 dark:text-zinc-300 dark:hover:bg-zinc-800"
          >
            {t("signInCta")}
          </Link>
        </div>
      </section>

      {/* How it works */}
      <section className="w-full max-w-3xl px-4 py-16">
        <div className="grid gap-8 sm:grid-cols-3">
          <div className="text-center">
            <div className="mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-zinc-100 text-lg font-bold text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300">
              1
            </div>
            <h3 className="font-semibold text-zinc-900 dark:text-zinc-100">
              {t("step1Title")}
            </h3>
            <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
              {t("step1Desc")}
            </p>
          </div>
          <div className="text-center">
            <div className="mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-zinc-100 text-lg font-bold text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300">
              2
            </div>
            <h3 className="font-semibold text-zinc-900 dark:text-zinc-100">
              {t("step2Title")}
            </h3>
            <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
              {t("step2Desc")}
            </p>
          </div>
          <div className="text-center">
            <div className="mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-zinc-100 text-lg font-bold text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300">
              3
            </div>
            <h3 className="font-semibold text-zinc-900 dark:text-zinc-100">
              {t("step3Title")}
            </h3>
            <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
              {t("step3Desc")}
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
