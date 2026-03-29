import { getTranslations } from "next-intl/server";
import { createClient } from "@/lib/supabase/server";
import { getProfileCompleteness } from "@/lib/profile";
import type { Profile, UserSkill } from "@/types/database";
import LoginButton from "@/components/LoginButton";
import LogoutButton from "@/components/LogoutButton";
import OnboardingBanner from "@/components/OnboardingBanner";
import { Link } from "@/i18n/navigation";

export default async function Home({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  await params;
  const t = await getTranslations("home");
  const tAuth = await getTranslations("auth");
  const tGroups = await getTranslations("groups");

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  let missingFields: ReturnType<typeof getProfileCompleteness> = [];

  if (user) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .single<Profile>();

    const { data: skills } = await supabase
      .from("user_skills")
      .select("*")
      .eq("user_id", user.id)
      .returns<UserSkill[]>();

    if (profile) {
      missingFields = getProfileCompleteness(profile, skills ?? []);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-zinc-950">
      <main className="flex w-full max-w-md flex-col items-center gap-8 px-8 text-center">
        <h1 className="text-4xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
          {t("title")}
        </h1>
        <p className="max-w-md text-lg text-zinc-600 dark:text-zinc-400">
          {t("subtitle")}
        </p>
        {user ? (
          <>
            {missingFields.length > 0 && (
              <OnboardingBanner missingFields={missingFields} />
            )}
            <div className="flex flex-col items-center gap-3">
              {missingFields.length === 0 && (
                <Link
                  href="/groups/create"
                  className="rounded-md bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-700 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-300"
                >
                  {tGroups("createButton")}
                </Link>
              )}
              <Link
                href="/profile"
                className="text-sm text-zinc-500 hover:text-zinc-700 dark:text-zinc-400 dark:hover:text-zinc-200"
              >
                {tAuth("viewProfile")}
              </Link>
              <LogoutButton />
            </div>
          </>
        ) : (
          <LoginButton />
        )}
      </main>
    </div>
  );
}
