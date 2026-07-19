import type { SupabaseClient } from "@supabase/supabase-js";
import { deriveGroupTitle } from "@/lib/groups";

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
    name: string | null;
    slug: string;
    certification: { name: string } | null;
  };
};

export type ActiveGroup = {
  id: string;
  name: string | null;
  slug: string;
  skill_tag: string;
  city: string;
  preferred_format: string;
  status: string;
  role: string;
  member_count: number;
  certification: {
    name: string;
    issuer: { name: string; logo_url: string | null } | null;
  } | null;
};

export async function getPendingRequestsForReferent(
  supabase: SupabaseClient,
  userId: string
): Promise<PendingRequestGroup[]> {
  const { data: referentGroups } = await supabase
    .from("group_members")
    .select("group_id, groups(name, slug, certification:certification_id(name))")
    .eq("user_id", userId)
    .eq("role", "referent");

  if (!referentGroups || referentGroups.length === 0) return [];

  const groupIds = referentGroups.map((gm) => gm.group_id);

  const { data: pendingRows } = await supabase
    .from("join_requests")
    .select("group_id")
    .in("group_id", groupIds)
    .eq("status", "pending");

  const pendingCountByGroup = new Map<string, number>();
  for (const row of pendingRows ?? []) {
    pendingCountByGroup.set(row.group_id, (pendingCountByGroup.get(row.group_id) ?? 0) + 1);
  }

  const results: PendingRequestGroup[] = [];
  for (const gm of referentGroups) {
    const count = pendingCountByGroup.get(gm.group_id) ?? 0;
    if (count > 0) {
      const group = gm.groups as unknown as {
        name: string | null;
        slug: string;
        certification: { name: string } | null;
      };
      results.push({
        groupName: deriveGroupTitle(group),
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
    .select("id, status, created_at, groups:group_id(name, slug, certification:certification_id(name))")
    .eq("applicant_id", userId)
    .order("created_at", { ascending: false })
    .limit(10);

  if (!data) return [];

  return data.map((row) => ({
    id: row.id,
    status: row.status,
    created_at: row.created_at,
    group: row.groups as unknown as {
      name: string | null;
      slug: string;
      certification: { name: string } | null;
    },
  }));
}

export async function getMyActiveGroups(
  supabase: SupabaseClient,
  userId: string
): Promise<ActiveGroup[]> {
  const { data } = await supabase
    .from("group_members")
    .select(
      "role, groups(id, name, slug, skill_tag, city, preferred_format, status, certification:certification_id(name, issuer:issuer_id(name, logo_url)))",
    )
    .eq("user_id", userId);

  if (!data || data.length === 0) return [];

  const groupIds = data.map((m) => {
    const group = m.groups as unknown as { id: string };
    return group.id;
  });

  const { data: memberRows } = await supabase
    .from("group_members")
    .select("group_id")
    .in("group_id", groupIds);

  const memberCountByGroup = new Map<string, number>();
  for (const row of memberRows ?? []) {
    memberCountByGroup.set(row.group_id, (memberCountByGroup.get(row.group_id) ?? 0) + 1);
  }

  return data.map((membership) => {
    const group = membership.groups as unknown as {
      id: string;
      name: string | null;
      slug: string;
      skill_tag: string;
      city: string;
      preferred_format: string;
      status: string;
      certification: {
        name: string;
        issuer: { name: string; logo_url: string | null } | null;
      } | null;
    };

    return {
      ...group,
      role: membership.role,
      member_count: memberCountByGroup.get(group.id) ?? 0,
    };
  });
}
