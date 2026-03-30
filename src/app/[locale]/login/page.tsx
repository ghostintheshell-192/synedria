import { redirect } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { createClient } from "@/lib/supabase/server";
import LoginButton from "@/components/LoginButton";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "login" });
  return { title: t("pageTitle") };
}

export default async function LoginPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) {
    redirect(`/${locale}`);
  }

  const t = await getTranslations("login");

  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-4">
      <h1 className="mb-2 text-2xl font-bold text-stone-900 dark:text-stone-50">
        {t("pageTitle")}
      </h1>
      <p className="mb-8 max-w-md text-center text-sm text-stone-500 dark:text-stone-400">
        {t("subtitle")}
      </p>
      <LoginButton />
    </div>
  );
}
