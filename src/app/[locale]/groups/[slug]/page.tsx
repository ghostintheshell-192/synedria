import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { createClient } from "@/lib/supabase/server";
import type { Metadata } from "next";
import Image from "next/image";
import { Link } from "@/i18n/navigation";
import PendingRequests from "@/components/groups/PendingRequests";
import CheckInForm from "@/components/groups/CheckInForm";

type GroupRow = {
  id: string;
  name: string;
  slug: string;
  skill_tag: string;
  objective: string;
  roadmap_url: string | null;
  city: string;
  preferred_format: string;
  entry_mode: string;
  status: string;
  progress_mode: string;
  deadline: string | null;
  meeting_place: string | null;
  study_mode: string | null;
  climate: string | null;
  expected_attendance: string | null;
  description: string | null;
  is_indexable: boolean;
  created_at: string;
};

type MemberRow = {
  id: string;
  user_id: string;
  role: string;
  personal_objective: string | null;
  profiles: {
    display_name: string;
    avatar_url: string | null;
    is_public_profile: boolean;
  };
};

type CheckInRow = {
  id: string;
  meeting_date: string;
  location: string | null;
  duration: number | null;
  attendee_count: number;
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const supabase = await createClient();

  const { data: group } = await supabase
    .from("groups")
    .select("name, objective, city, skill_tag, is_indexable")
    .eq("slug", slug)
    .single();

  if (!group) return { title: "Not Found" };

  return {
    title: `${group.name} — Synedria`,
    description: `${group.objective} | ${group.skill_tag} | ${group.city}`,
    robots: group.is_indexable
      ? { index: true, follow: true }
      : { index: false, follow: false },
    openGraph: {
      title: group.name,
      description: group.objective,
      siteName: "Synedria",
    },
  };
}

export default async function GroupPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { slug } = await params;
  const supabase = await createClient();
  const t = await getTranslations("groupPage");
  const tProfile = await getTranslations("profile");

  // Fetch group
  const { data: group } = await supabase
    .from("groups")
    .select("*")
    .eq("slug", slug)
    .single<GroupRow>();

  if (!group) notFound();

  // Fetch members with profiles
  const { data: members } = await supabase
    .from("group_members")
    .select("id, user_id, role, personal_objective, profiles(display_name, avatar_url, is_public_profile)")
    .eq("group_id", group.id)
    .order("joined_at", { ascending: true })
    .returns<MemberRow[]>();

  // Fetch check-ins
  const { data: checkIns } = await supabase
    .from("check_ins")
    .select("id, meeting_date, location, duration")
    .eq("group_id", group.id)
    .order("meeting_date", { ascending: false })
    .limit(10);

  // Get attendee counts for check-ins
  const checkInsWithCounts: CheckInRow[] = [];
  if (checkIns) {
    for (const ci of checkIns) {
      const { count } = await supabase
        .from("check_in_attendees")
        .select("*", { count: "exact", head: true })
        .eq("check_in_id", ci.id);
      checkInsWithCounts.push({ ...ci, attendee_count: count ?? 0 });
    }
  }

  // Current user membership
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const currentMember = user
    ? members?.find((m) => m.user_id === user.id)
    : null;
  const isMember = !!currentMember;
  const isReferent = currentMember?.role === "referent";
  const memberCount = members?.length ?? 0;
  const isFull = memberCount >= 8;
  const isOpen = group.status === "open";
  const isOpenAccess = group.entry_mode === "open";

  // Fetch pending requests (referent only)
  type JoinRequestRow = {
    id: string;
    applicant_id: string;
    intro_message: string | null;
    personal_objective: string;
    created_at: string;
    profiles: {
      display_name: string;
      avatar_url: string | null;
      city: string | null;
    };
  };

  let pendingRequests: JoinRequestRow[] = [];
  if (isReferent) {
    const { data } = await supabase
      .from("join_requests")
      .select("id, applicant_id, intro_message, personal_objective, created_at, profiles:applicant_id(display_name, avatar_url, city)")
      .eq("group_id", group.id)
      .eq("status", "pending")
      .order("created_at", { ascending: true })
      .returns<JoinRequestRow[]>();
    pendingRequests = data ?? [];
  }

  // Check for pending request (applicant)
  let hasPendingRequest = false;
  if (user && !isMember) {
    const { data: pending } = await supabase
      .from("join_requests")
      .select("id")
      .eq("group_id", group.id)
      .eq("applicant_id", user.id)
      .eq("status", "pending")
      .single();
    hasPendingRequest = !!pending;
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-3xl font-bold text-zinc-900 dark:text-zinc-50">
              {group.name}
            </h1>
            <div className="mt-2 flex flex-wrap gap-2">
              <span className="rounded-full bg-zinc-100 px-3 py-1 text-sm text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300">
                {group.skill_tag}
              </span>
              <span className="rounded-full bg-zinc-100 px-3 py-1 text-sm text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300">
                {group.city}
              </span>
              <span className="rounded-full bg-zinc-100 px-3 py-1 text-sm text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300">
                {tProfile(`format.${group.preferred_format}`)}
              </span>
            </div>
          </div>
          <div className="text-right">
            <span
              className={`inline-block rounded-full px-3 py-1 text-sm font-medium ${
                isOpen
                  ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                  : "bg-zinc-200 text-zinc-600 dark:bg-zinc-700 dark:text-zinc-400"
              }`}
            >
              {t(isOpen ? "statusOpen" : "statusClosed")}
            </span>
            <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
              {t("memberCount", { count: memberCount, max: 8 })}
            </p>
          </div>
        </div>
      </div>

      {/* Objective */}
      <section className="mb-8">
        <h2 className="mb-2 text-lg font-semibold text-zinc-800 dark:text-zinc-200">
          {t("objective")}
        </h2>
        <p className="text-zinc-600 dark:text-zinc-400">{group.objective}</p>
        {group.roadmap_url && (
          <a
            href={group.roadmap_url}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-2 inline-block text-sm text-zinc-500 underline hover:text-zinc-700 dark:text-zinc-400 dark:hover:text-zinc-200"
          >
            {t("roadmap")}
          </a>
        )}
      </section>

      {/* Group details */}
      {(group.study_mode || group.climate || group.expected_attendance || group.meeting_place) && (
        <section className="mb-8 rounded-md border border-zinc-200 p-4 dark:border-zinc-700">
          <h2 className="mb-3 text-lg font-semibold text-zinc-800 dark:text-zinc-200">
            {t("howItWorks")}
          </h2>
          <dl className="space-y-2 text-sm">
            {group.study_mode && (
              <div>
                <dt className="font-medium text-zinc-700 dark:text-zinc-300">
                  {t("studyMode")}
                </dt>
                <dd className="text-zinc-500 dark:text-zinc-400">
                  {group.study_mode}
                </dd>
              </div>
            )}
            {group.climate && (
              <div>
                <dt className="font-medium text-zinc-700 dark:text-zinc-300">
                  {t("climate")}
                </dt>
                <dd className="text-zinc-500 dark:text-zinc-400">
                  {group.climate}
                </dd>
              </div>
            )}
            {group.expected_attendance && (
              <div>
                <dt className="font-medium text-zinc-700 dark:text-zinc-300">
                  {t("expectedAttendance")}
                </dt>
                <dd className="text-zinc-500 dark:text-zinc-400">
                  {group.expected_attendance}
                </dd>
              </div>
            )}
            {group.meeting_place && (
              <div>
                <dt className="font-medium text-zinc-700 dark:text-zinc-300">
                  {t("meetingPlace")}
                </dt>
                <dd className="text-zinc-500 dark:text-zinc-400">
                  {group.meeting_place}
                </dd>
              </div>
            )}
          </dl>
        </section>
      )}

      {group.description && (
        <section className="mb-8">
          <h2 className="mb-2 text-lg font-semibold text-zinc-800 dark:text-zinc-200">
            {t("description")}
          </h2>
          <p className="text-zinc-600 dark:text-zinc-400 whitespace-pre-line">
            {group.description}
          </p>
        </section>
      )}

      {/* Pending requests (referent only) */}
      {isReferent && (
        <PendingRequests
          requests={pendingRequests}
          groupId={group.id}
          groupSlug={group.slug}
        />
      )}

      {/* Members */}
      {members && members.length > 0 && (
        <section className="mb-8">
          <h2 className="mb-3 text-lg font-semibold text-zinc-800 dark:text-zinc-200">
            {t("members")}
          </h2>
          <ul className="space-y-3">
            {members.map((member) => {
              if (!member.profiles) return null;
              const showDetails = isMember || member.profiles.is_public_profile;
              return (
                <li
                  key={member.id}
                  className="flex items-center gap-3 rounded-md border border-zinc-200 p-3 dark:border-zinc-700"
                >
                  {member.profiles.avatar_url && showDetails ? (
                    <Image
                      src={member.profiles.avatar_url}
                      alt=""
                      width={40}
                      height={40}
                      className="rounded-full"
                    />
                  ) : (
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-zinc-200 text-zinc-500 dark:bg-zinc-700 dark:text-zinc-400">
                      ?
                    </div>
                  )}
                  <div>
                    <p className="font-medium text-zinc-900 dark:text-zinc-100">
                      {showDetails
                        ? member.profiles.display_name
                        : t("privateMember")}
                      {member.role === "referent" && (
                        <span className="ml-2 text-xs text-zinc-500 dark:text-zinc-400">
                          {t("referent")}
                        </span>
                      )}
                    </p>
                    {isMember && member.personal_objective && (
                      <p className="text-sm text-zinc-500 dark:text-zinc-400">
                        {member.personal_objective}
                      </p>
                    )}
                  </div>
                </li>
              );
            })}
          </ul>
        </section>
      )}

      {/* Meeting log */}
      {checkInsWithCounts.length > 0 && (
        <section className="mb-8">
          <h2 className="mb-3 text-lg font-semibold text-zinc-800 dark:text-zinc-200">
            {t("meetingLog")}
          </h2>
          <ul className="space-y-2">
            {checkInsWithCounts.map((ci) => (
              <li
                key={ci.id}
                className="flex items-center justify-between rounded-md border border-zinc-200 px-4 py-2 text-sm dark:border-zinc-700"
              >
                <span className="text-zinc-900 dark:text-zinc-100">
                  {new Date(ci.meeting_date).toLocaleDateString()}
                </span>
                <div className="flex gap-4 text-zinc-500 dark:text-zinc-400">
                  {ci.location && <span>{ci.location}</span>}
                  {ci.duration && (
                    <span>
                      {Math.floor(ci.duration / 60)}h{ci.duration % 60 > 0 ? ` ${ci.duration % 60}m` : ""}
                    </span>
                  )}
                  <span>
                    {t("attendees", { count: ci.attendee_count })}
                  </span>
                </div>
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* Check-in form (members only) */}
      {isMember && (
        <section className="mb-8">
          <CheckInForm groupId={group.id} members={members ?? []} />
        </section>
      )}

      {/* Actions */}
      <div className="flex gap-3">
        {!isMember && isOpen && !isFull && user && !hasPendingRequest && (
          <Link
            href={`/groups/${group.slug}/join`}
            className="rounded-md bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-700 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-300"
          >
            {isOpenAccess ? t("joinDirectly") : t("askToJoin")}
          </Link>
        )}
        {!isMember && hasPendingRequest && (
          <p className="text-sm text-amber-600 dark:text-amber-400">
            {t("requestPending")}
          </p>
        )}
        {!isMember && isOpen && !isFull && !user && (
          <p className="text-sm text-zinc-500 dark:text-zinc-400">
            {t("loginToJoin")}
          </p>
        )}
        {!isMember && isFull && (
          <p className="text-sm text-zinc-500 dark:text-zinc-400">
            {t("groupFull")}
          </p>
        )}
        {!isMember && !isOpen && (
          <p className="text-sm text-zinc-500 dark:text-zinc-400">
            {t("groupClosed")}
          </p>
        )}
      </div>
    </div>
  );
}
