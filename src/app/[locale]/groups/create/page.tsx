import { redirect } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { createClient } from "@/lib/supabase/server";
import { isProfileComplete } from "@/lib/profile";
import type { Profile, UserSkill } from "@/types/database";
import GroupCreateForm from "@/components/groups/GroupCreateForm";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "groups" });
  return {
    title: t("createTitle"),
    robots: { index: false, follow: false },
  };
}

export default async function CreateGroupPage({
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

  const [{ data: profile }, { data: skills }] = await Promise.all([
    supabase.from("profiles").select("*").eq("id", user.id).single<Profile>(),
    supabase.from("user_skills").select("*").eq("user_id", user.id).returns<UserSkill[]>(),
  ]);

  if (!profile || !isProfileComplete(profile, skills ?? [])) {
    redirect(`/${locale}/profile`);
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-12">
      <GroupCreateForm userId={user.id} />
    </div>
  );
}
