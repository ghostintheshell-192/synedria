import { getTranslations } from "next-intl/server";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "contact" });
  return { title: t("pageTitle") };
}

export default async function ContactPage() {
  const t = await getTranslations("contact");

  return (
    <div className="mx-auto max-w-2xl px-4 py-12">
      <h1 className="mb-6 text-3xl font-bold text-zinc-900 dark:text-zinc-50">
        {t("pageTitle")}
      </h1>
      <p className="text-zinc-600 dark:text-zinc-400">{t("content")}</p>
      <a
        href={`mailto:${t("email")}`}
        className="mt-2 inline-block text-zinc-900 underline hover:text-zinc-700 dark:text-zinc-100 dark:hover:text-zinc-300"
      >
        {t("email")}
      </a>
    </div>
  );
}
