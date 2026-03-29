import { redirect } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { createClient } from "@/lib/supabase/server";
import JoinRequestForm from "@/components/groups/JoinRequestForm";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "joinRequest" });
  return {
    title: t("pageTitle"),
    robots: { index: false, follow: false },
  };
}

export default async function JoinPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect(`/${locale}`);
  }

  // Get group
  const { data: group } = await supabase
    .from("groups")
    .select("id, name, slug, status, entry_mode")
    .eq("slug", slug)
    .single();

  if (!group || group.status !== "open") {
    redirect(`/${locale}/groups/${slug}`);
  }

  // Check if already a member
  const { data: membership } = await supabase
    .from("group_members")
    .select("id")
    .eq("group_id", group.id)
    .eq("user_id", user.id)
    .single();

  if (membership) {
    redirect(`/${locale}/groups/${slug}`);
  }

  // Check member count
  const { count: memberCount } = await supabase
    .from("group_members")
    .select("*", { count: "exact", head: true })
    .eq("group_id", group.id);

  if ((memberCount ?? 0) >= 8) {
    redirect(`/${locale}/groups/${slug}`);
  }

  // Check for pending request
  const { data: pendingRequest } = await supabase
    .from("join_requests")
    .select("id")
    .eq("group_id", group.id)
    .eq("applicant_id", user.id)
    .eq("status", "pending")
    .single();

  if (pendingRequest) {
    redirect(`/${locale}/groups/${slug}`);
  }

  const isOpenAccess = group.entry_mode === "open";

  return (
    <div className="mx-auto max-w-lg px-4 py-12">
      <JoinRequestForm
        groupId={group.id}
        groupName={group.name}
        groupSlug={group.slug}
        userId={user.id}
        isOpenAccess={isOpenAccess}
      />
    </div>
  );
}
