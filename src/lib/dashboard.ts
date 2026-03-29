import type { SupabaseClient } from "@supabase/supabase-js";

export type PendingRequestGroup = {
  groupName: string;
  groupSlug: string;
  pendingCount: number;
};

export type Candidature = {
  id: string;
  status: string;
  created_at: string;
  group: {
    name: string;
    slug: string;
  };
};

export type ActiveGroup = {
  id: string;
  name: string;
  slug: string;
  skill_tag: string;
  city: string;
  preferred_format: string;
  status: string;
  role: string;
  member_count: number;
};

export async function getPendingRequestsForReferent(
  supabase: SupabaseClient,
  userId: string
): Promise<PendingRequestGroup[]> {
  const { data: referentGroups } = await supabase
    .from("group_members")
    .select("group_id, groups(name, slug)")
    .eq("user_id", userId)
    .eq("role", "referent");

  if (!referentGroups || referentGroups.length === 0) return [];

  const results: PendingRequestGroup[] = [];

  for (const gm of referentGroups) {
    const group = gm.groups as unknown as { name: string; slug: string };
    const { count } = await supabase
      .from("join_requests")
      .select("*", { count: "exact", head: true })
      .eq("group_id", gm.group_id)
      .eq("status", "pending");

    if (count && count > 0) {
      results.push({
        groupName: group.name,
        groupSlug: group.slug,
        pendingCount: count,
      });
    }
  }

  return results;
}

export async function getMyCandidatures(
  supabase: SupabaseClient,
  userId: string
): Promise<Candidature[]> {
  const { data } = await supabase
    .from("join_requests")
    .select("id, status, created_at, groups:group_id(name, slug)")
    .eq("applicant_id", userId)
    .order("created_at", { ascending: false })
    .limit(10);

  if (!data) return [];

  return data.map((row) => ({
    id: row.id,
    status: row.status,
    created_at: row.created_at,
    group: row.groups as unknown as { name: string; slug: string },
  }));
}

export async function getMyActiveGroups(
  supabase: SupabaseClient,
  userId: string
): Promise<ActiveGroup[]> {
  const { data } = await supabase
    .from("group_members")
    .select("role, groups(id, name, slug, skill_tag, city, preferred_format, status)")
    .eq("user_id", userId);

  if (!data) return [];

  const results: ActiveGroup[] = [];

  for (const membership of data) {
    const group = membership.groups as unknown as {
      id: string;
      name: string;
      slug: string;
      skill_tag: string;
      city: string;
      preferred_format: string;
      status: string;
    };

    const { count } = await supabase
      .from("group_members")
      .select("*", { count: "exact", head: true })
      .eq("group_id", group.id);

    results.push({
      ...group,
      role: membership.role,
      member_count: count ?? 0,
    });
  }

  return results;
}
