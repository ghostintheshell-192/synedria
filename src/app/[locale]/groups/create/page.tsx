import { redirect } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { createClient } from "@/lib/supabase/server";
import { isProfileComplete } from "@/lib/profile";
import type { Profile, UserSkill } from "@/types/database";
import GroupCreateForm from "@/components/groups/GroupCreateForm";
import type { CertOption } from "@/components/groups/CertificationCombobox";

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
    redirect(`/${locale}/login`);
  }

  const [{ data: profile }, { data: skills }, { data: certRows }] =
    await Promise.all([
      supabase.from("profiles").select("*").eq("id", user.id).single<Profile>(),
      supabase
        .from("user_skills")
        .select("*")
        .eq("user_id", user.id)
        .returns<UserSkill[]>(),
      // Only active certifications from active issuers reach the picker (FR-7,
      // FR-15). The nested issuer relation is typed as an array by supabase-js
      // (same shape handled with a cast elsewhere), so we normalize it below.
      supabase
        .from("certifications")
        .select("id, name, issuer:issuer_id!inner(name, is_active)")
        .eq("is_active", true)
        .eq("issuer.is_active", true)
        .order("name"),
    ]);

  if (!profile || !isProfileComplete(profile, skills ?? [])) {
    redirect(`/${locale}/profile`);
  }

  const certifications: CertOption[] = (
    (certRows ?? []) as unknown as {
      id: string;
      name: string;
      issuer: { name: string } | null;
    }[]
  )
    .map((c) => ({
      id: c.id,
      name: c.name,
      issuerName: c.issuer?.name ?? "",
    }))
    .sort(
      (a, b) =>
        a.issuerName.localeCompare(b.issuerName) || a.name.localeCompare(b.name),
    );

  return (
    <div className="mx-auto max-w-2xl px-4 py-12">
      <GroupCreateForm userId={user.id} certifications={certifications} />
    </div>
  );
}
