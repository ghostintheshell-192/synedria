import { createClient } from "@/lib/supabase/server";
import { getProfileCompleteness } from "@/lib/profile";
import {
  getPendingRequestsForReferent,
  getMyCandidatures,
  getMyActiveGroups,
} from "@/lib/dashboard";
import type { Profile, UserSkill } from "@/types/database";
import LandingPage from "@/components/landing/LandingPage";
import Dashboard from "@/components/dashboard/Dashboard";

export default async function Home({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  await params;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return <LandingPage />;
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
    .returns<UserSkill[]>();

  if (!profile) {
    return <LandingPage />;
  }

  const missingFields = getProfileCompleteness(profile, skills ?? []);
  const pendingRequests = await getPendingRequestsForReferent(supabase, user.id);
  const candidatures = await getMyCandidatures(supabase, user.id);
  const activeGroups = await getMyActiveGroups(supabase, user.id);

  return (
    <Dashboard
      displayName={profile.display_name}
      missingFields={missingFields}
      pendingRequests={pendingRequests}
      candidatures={candidatures}
      activeGroups={activeGroups}
    />
  );
}
