import { getTranslations } from "next-intl/server";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "privacy" });
  return { title: t("pageTitle") };
}

export default async function PrivacyPage() {
  const t = await getTranslations("privacy");

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
          <h2 className="mb-2 text-lg font-semibold text-stone-800 dark:text-stone-200">{t("controllerTitle")}</h2>
          <p>{t("controller")}</p>
        </section>

        <section>
          <h2 className="mb-2 text-lg font-semibold text-stone-800 dark:text-stone-200">{t("dataTitle")}</h2>
          <p className="mb-3">{t("dataIntro")}</p>
          <ul className="list-disc space-y-2 pl-5">
            <li>{t("dataAuth")}</li>
            <li>{t("dataProfile")}</li>
            <li>{t("dataSkills")}</li>
            <li>{t("dataGroups")}</li>
          </ul>
        </section>

        <section>
          <h2 className="mb-2 text-lg font-semibold text-stone-800 dark:text-stone-200">{t("legalBasisTitle")}</h2>
          <p>{t("legalBasis")}</p>
        </section>

        <section>
          <h2 className="mb-2 text-lg font-semibold text-stone-800 dark:text-stone-200">{t("thirdPartiesTitle")}</h2>
          <p>{t("thirdParties")}</p>
        </section>

        <section>
          <h2 className="mb-2 text-lg font-semibold text-stone-800 dark:text-stone-200">{t("retentionTitle")}</h2>
          <p>{t("retention")}</p>
        </section>

        <section>
          <h2 className="mb-2 text-lg font-semibold text-stone-800 dark:text-stone-200">{t("rightsTitle")}</h2>
          <p className="mb-3">{t("rightsIntro")}</p>
          <ul className="list-disc space-y-2 pl-5">
            <li>{t("rightAccess")}</li>
            <li>{t("rightRectify")}</li>
            <li>{t("rightDelete")}</li>
            <li>{t("rightPortability")}</li>
            <li>{t("rightObject")}</li>
          </ul>
          <p className="mt-3">{t("rightsOutro")}</p>
        </section>

        <section>
          <h2 className="mb-2 text-lg font-semibold text-stone-800 dark:text-stone-200">{t("changesTitle")}</h2>
          <p>{t("changes")}</p>
        </section>
      </div>
    </div>
  );
}
