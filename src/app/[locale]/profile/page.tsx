import { redirect } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { createClient } from "@/lib/supabase/server";
import type { Profile, UserSkill } from "@/types/database";
import ProfileForm from "@/components/profile/ProfileForm";
import SkillList from "@/components/profile/SkillList";

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
    redirect(`/${locale}`);
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single<Profile>();

  const { data: skills } = await supabase
    .from("user_skills")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: true })
    .returns<UserSkill[]>();

  if (!profile) {
    redirect(`/${locale}`);
  }

  const t = await getTranslations("profile");

  return (
    <div className="mx-auto max-w-2xl px-4 py-12">
      <h1 className="mb-8 text-3xl font-bold text-zinc-900 dark:text-zinc-50">
        {t("pageTitle")}
      </h1>

      <section className="mb-10">
        <h2 className="mb-4 text-xl font-semibold text-zinc-800 dark:text-zinc-200">
          {t("basicInfo")}
        </h2>
        <ProfileForm profile={profile} />
      </section>

      <section>
        <h2 className="mb-4 text-xl font-semibold text-zinc-800 dark:text-zinc-200">
          {t("skills")}
        </h2>
        <SkillList userId={user.id} skills={skills ?? []} />
      </section>
    </div>
  );
}
