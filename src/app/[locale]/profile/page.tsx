import { redirect } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { createClient } from "@/lib/supabase/server";
import { getProfileCompleteness, isProfileComplete } from "@/lib/profile";
import type { Profile, UserSkill } from "@/types/database";
import ProfileForm from "@/components/profile/ProfileForm";
import SkillList from "@/components/profile/SkillList";
import DeleteAccountButton from "@/components/profile/DeleteAccountButton";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "profile" });
  return {
    title: t("pageTitle"),
    robots: { index: false, follow: false },
  };
}

export default async function ProfilePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect(`/${locale}/login`);
  }

  const [{ data: profile }, { data: skills }] = await Promise.all([
    supabase.from("profiles").select("*").eq("id", user.id).single<Profile>(),
    supabase.from("user_skills").select("*").eq("user_id", user.id).order("created_at", { ascending: true }).returns<UserSkill[]>(),
  ]);

  if (!profile) {
    redirect(`/${locale}`);
  }

  const t = await getTranslations("profile");
  const complete = isProfileComplete(profile, skills ?? []);
  const missing = getProfileCompleteness(profile, skills ?? []);

  return (
    <div className="mx-auto max-w-2xl px-4 py-12">
      <h1 className="mb-4 text-3xl font-bold text-stone-900 dark:text-stone-50">
        {t("pageTitle")}
      </h1>

      <div className="mb-8 rounded-md border p-3 text-sm">
        {complete ? (
          <p className="text-green-700 dark:text-green-400">
            {t("visibilityComplete")}
          </p>
        ) : (
          <div className="text-amber-700 dark:text-amber-400">
            <p>{t("visibilityIncomplete")}</p>
            <ul className="mt-1 list-inside list-disc">
              {missing.map((field) => (
                <li key={field}>{t(`missing.${field}`)}</li>
              ))}
            </ul>
          </div>
        )}
      </div>

      <section className="mb-10">
        <h2 className="mb-4 text-xl font-semibold text-stone-800 dark:text-stone-200">
          {t("basicInfo")}
        </h2>
        <ProfileForm profile={profile} />
      </section>

      <section>
        <h2 className="mb-4 text-xl font-semibold text-stone-800 dark:text-stone-200">
          {t("skills")}
        </h2>
        <SkillList userId={user.id} skills={skills ?? []} />
      </section>

      <section className="mt-16 rounded-lg border border-red-300 bg-red-50/50 p-6 dark:border-red-800 dark:bg-red-950/30">
        <h2 className="mb-4 text-xl font-semibold text-red-800 dark:text-red-200">
          {t("dangerZone")}
        </h2>
        <DeleteAccountButton />
      </section>
    </div>
  );
}
