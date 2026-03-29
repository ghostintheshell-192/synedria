import { createClient } from "@/lib/supabase/server";
import { Link } from "@/i18n/navigation";

export default async function NotificationBadge({
  userId,
}: {
  userId: string;
}) {
  const supabase = await createClient();

  // Get groups where user is referent
  const { data: referentGroups } = await supabase
    .from("group_members")
    .select("group_id")
    .eq("user_id", userId)
    .eq("role", "referent");

  if (!referentGroups || referentGroups.length === 0) return null;

  const groupIds = referentGroups.map((g) => g.group_id);

  const { count } = await supabase
    .from("join_requests")
    .select("*", { count: "exact", head: true })
    .in("group_id", groupIds)
    .eq("status", "pending");

  if (!count || count === 0) return null;

  return (
    <Link
      href="/"
      className="relative flex h-6 w-6 items-center justify-center rounded-full bg-red-100 text-xs font-medium text-red-700 dark:bg-red-900 dark:text-red-200"
      title={`${count} pending`}
    >
      {count}
    </Link>
  );
}
