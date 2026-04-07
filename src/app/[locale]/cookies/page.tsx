import { getTranslations } from "next-intl/server";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "cookies" });
  return { title: t("pageTitle") };
}

export default async function CookiesPage() {
  const t = await getTranslations("cookies");

  return (
    <div className="mx-auto max-w-2xl px-4 py-12">
      <h1 className="mb-2 text-3xl font-bold text-stone-900 dark:text-stone-50">
        {t("pageTitle")}
      </h1>
      <p className="mb-8 text-sm text-stone-400 dark:text-stone-500">
        {t("lastUpdated")}
      </p>

      <div className="space-y-8 text-stone-600 leading-relaxed dark:text-stone-400">
        <section>
          <h2 className="mb-2 text-lg font-semibold text-stone-800 dark:text-stone-200">{t("introTitle")}</h2>
          <p>{t("intro")}</p>
        </section>

        <section>
          <h2 className="mb-2 text-lg font-semibold text-stone-800 dark:text-stone-200">{t("technicalTitle")}</h2>
          <p>{t("technical")}</p>
        </section>

        <section>
          <h2 className="mb-2 text-lg font-semibold text-stone-800 dark:text-stone-200">{t("cookieListTitle")}</h2>
          <ul className="list-disc space-y-2 pl-5">
            <li>{t("cookieSession")}</li>
            <li>{t("cookieLocale")}</li>
          </ul>
        </section>

        <section>
          <h2 className="mb-2 text-lg font-semibold text-stone-800 dark:text-stone-200">{t("noTrackingTitle")}</h2>
          <p>{t("noTracking")}</p>
        </section>

        <section>
          <h2 className="mb-2 text-lg font-semibold text-stone-800 dark:text-stone-200">{t("bannerTitle")}</h2>
          <p>{t("banner")}</p>
        </section>

        <section>
          <h2 className="mb-2 text-lg font-semibold text-stone-800 dark:text-stone-200">{t("controlTitle")}</h2>
          <p>{t("control")}</p>
        </section>
      </div>
    </div>
  );
}
