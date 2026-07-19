import { cache } from "react";
import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { createClient } from "@/lib/supabase/server";
import { deriveGroupTitle } from "@/lib/groups";
import type { Metadata } from "next";
import Image from "next/image";
import { Link } from "@/i18n/navigation";
import PendingRequests from "@/components/groups/PendingRequests";
import CheckInForm from "@/components/groups/CheckInForm";
import LeaveGroupButton from "@/components/groups/LeaveGroupButton";
import CloseGroupButton from "@/components/groups/CloseGroupButton";

type GroupRow = {
  id: string;
  name: string | null;
  slug: string;
  skill_tag: string;
  objective: string | null;
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
  certification: { name: string } | null;
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

type AttendeeRow = {
  id: string;
  check_in_id: string;
  user_id: string | null;
  profiles: {
    display_name: string;
    avatar_url: string | null;
  } | null;
};

type CheckInRow = {
  id: string;
  meeting_date: string;
  location: string | null;
  duration: number | null;
  attendees: AttendeeRow[];
};

const getGroup = cache(async (slug: string) => {
  const supabase = await createClient();
  const { data } = await supabase
    .from("groups")
    .select("*, certification:certification_id(name)")
    .eq("slug", slug)
    .single<GroupRow>();
  return data;
});

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const group = await getGroup(slug);

  if (!group) return { title: "Not Found" };

  return {
    title: `${deriveGroupTitle(group)} — Synedria`,
    // objective may be null when the goal is implied by the linked certification
    // (FR-10) — fall back to the derived title so the description is never "null".
    description: `${group.objective ?? deriveGroupTitle(group)} | ${group.skill_tag} | ${group.city}`,
    robots: group.is_indexable
      ? { index: true, follow: true }
      : { index: false, follow: false },
    openGraph: {
      title: deriveGroupTitle(group),
      description: group.objective ?? deriveGroupTitle(group),
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

  // Fetch group (cached — shared with generateMetadata)
  const group = await getGroup(slug);
  if (!group) notFound();

  // Fetch members, check-ins, and current user in parallel
  const [{ data: members }, { data: checkIns }, { data: { user } }] = await Promise.all([
    supabase
      .from("group_members")
      .select("id, user_id, role, personal_objective, profiles(display_name, avatar_url, is_public_profile)")
      .eq("group_id", group.id)
      .order("joined_at", { ascending: true })
      .returns<MemberRow[]>(),
    supabase
      .from("check_ins")
      .select("id, meeting_date, location, duration")
      .eq("group_id", group.id)
      .order("meeting_date", { ascending: false })
      .limit(10),
    supabase.auth.getUser(),
  ]);

  // Fetch all attendees for these check-ins in one query
  const checkInsWithAttendees: CheckInRow[] = [];
  if (checkIns && checkIns.length > 0) {
    const { data: allAttendees } = await supabase
      .from("check_in_attendees")
      .select("id, check_in_id, user_id, profiles(display_name, avatar_url)")
      .in("check_in_id", checkIns.map((ci) => ci.id))
      .returns<AttendeeRow[]>();

    for (const ci of checkIns) {
      const attendees = allAttendees?.filter((a) => a.check_in_id === ci.id) ?? [];
      checkInsWithAttendees.push({ ...ci, attendees });
    }
  }

  const currentMember = user
    ? members?.find((m) => m.user_id === user.id)
    : null;
  const isMember = !!currentMember;
  const isReferent = currentMember?.role === "referent";
  const hasReferent = members?.some((m) => m.role === "referent") ?? false;
  const memberCount = members?.length ?? 0;
  const isFull = memberCount >= 8;
  const isOpen = group.status === "open";
  const isOpenAccess = group.entry_mode === "open";
  const canJoin = isOpen && !isFull && (isOpenAccess || hasReferent);

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
            <h1 className="text-3xl font-bold text-stone-900 dark:text-stone-50">
              {deriveGroupTitle(group)}
            </h1>
            <div className="mt-2 flex flex-wrap gap-2">
              <span className="rounded-full bg-stone-100 px-3 py-1 text-sm text-stone-700 dark:bg-stone-800 dark:text-stone-300">
                {group.skill_tag}
              </span>
              <span className="rounded-full bg-stone-100 px-3 py-1 text-sm text-stone-700 dark:bg-stone-800 dark:text-stone-300">
                {group.city}
              </span>
              <span className="rounded-full bg-stone-100 px-3 py-1 text-sm text-stone-700 dark:bg-stone-800 dark:text-stone-300">
                {tProfile(`format.${group.preferred_format}`)}
              </span>
            </div>
          </div>
          <div className="text-right">
            <span
              className={`inline-block rounded-full px-3 py-1 text-sm font-medium ${
                isOpen
                  ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                  : "bg-stone-200 text-stone-600 dark:bg-stone-700 dark:text-stone-400"
              }`}
            >
              {t(isOpen ? "statusOpen" : "statusClosed")}
            </span>
            <p className="mt-1 text-sm text-stone-500 dark:text-stone-400">
              {t("memberCount", { count: memberCount, max: 8 })}
            </p>
          </div>
        </div>
      </div>

      {/* Objective — may be absent when the goal is implied by the linked
          certification (FR-10); the derived title already names it, and the
          certification badge will carry it (FR-11, #6/#7). */}
      {(group.objective || group.roadmap_url) && (
      <section className="mb-8">
        <h2 className="mb-2 text-lg font-semibold text-stone-800 dark:text-stone-200">
          {t("objective")}
        </h2>
        {group.objective && (
          <p className="text-stone-600 dark:text-stone-400">
            {group.objective}
          </p>
        )}
        {group.roadmap_url && (
          <a
            href={group.roadmap_url}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-2 inline-block text-sm text-stone-500 underline hover:text-stone-700 dark:text-stone-400 dark:hover:text-stone-200"
          >
            {t("roadmap")}
          </a>
        )}
      </section>
      )}

      {/* Group details */}
      {(group.study_mode || group.climate || group.expected_attendance || group.meeting_place) && (
        <section className="mb-8 rounded-md border border-stone-200 p-4 dark:border-stone-700">
          <h2 className="mb-3 text-lg font-semibold text-stone-800 dark:text-stone-200">
            {t("howItWorks")}
          </h2>
          <dl className="space-y-2 text-sm">
            {group.study_mode && (
              <div>
                <dt className="font-medium text-stone-700 dark:text-stone-300">
                  {t("studyMode")}
                </dt>
                <dd className="text-stone-500 dark:text-stone-400">
                  {group.study_mode}
                </dd>
              </div>
            )}
            {group.climate && (
              <div>
                <dt className="font-medium text-stone-700 dark:text-stone-300">
                  {t("climate")}
                </dt>
                <dd className="text-stone-500 dark:text-stone-400">
                  {group.climate}
                </dd>
              </div>
            )}
            {group.expected_attendance && (
              <div>
                <dt className="font-medium text-stone-700 dark:text-stone-300">
                  {t("expectedAttendance")}
                </dt>
                <dd className="text-stone-500 dark:text-stone-400">
                  {group.expected_attendance}
                </dd>
              </div>
            )}
            {group.meeting_place && (
              <div>
                <dt className="font-medium text-stone-700 dark:text-stone-300">
                  {t("meetingPlace")}
                </dt>
                <dd className="text-stone-500 dark:text-stone-400">
                  {group.meeting_place}
                </dd>
              </div>
            )}
          </dl>
        </section>
      )}

      {group.description && (
        <section className="mb-8">
          <h2 className="mb-2 text-lg font-semibold text-stone-800 dark:text-stone-200">
            {t("description")}
          </h2>
          <p className="text-stone-600 dark:text-stone-400 whitespace-pre-line">
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
          <h2 className="mb-3 text-lg font-semibold text-stone-800 dark:text-stone-200">
            {t("members")}
          </h2>
          <ul className="space-y-3">
            {members.map((member) => {
              if (!member.profiles) return null;
              const showDetails = isMember || member.profiles.is_public_profile;
              return (
                <li
                  key={member.id}
                  className="flex items-center gap-3 rounded-md border border-stone-200 p-3 dark:border-stone-700"
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
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-stone-200 text-stone-500 dark:bg-stone-700 dark:text-stone-400">
                      ?
                    </div>
                  )}
                  <div>
                    <p className="font-medium text-stone-900 dark:text-stone-100">
                      {showDetails
                        ? member.profiles.display_name
                        : t("privateMember")}
                      {member.role === "referent" && (
                        <span className="ml-2 text-xs text-stone-500 dark:text-stone-400">
                          {t("referent")}
                        </span>
                      )}
                    </p>
                    {isMember && member.personal_objective && (
                      <p className="text-sm text-stone-500 dark:text-stone-400">
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
      {checkInsWithAttendees.length > 0 && (
        <section className="mb-8">
          <h2 className="mb-3 text-lg font-semibold text-stone-800 dark:text-stone-200">
            {t("meetingLog")}
          </h2>
          <ul className="space-y-2">
            {checkInsWithAttendees.map((ci) => (
              <li
                key={ci.id}
                className="rounded-md border border-stone-200 px-4 py-3 text-sm dark:border-stone-700"
              >
                <div className="flex items-center justify-between">
                  <span className="text-stone-900 dark:text-stone-100">
                    {new Date(ci.meeting_date).toLocaleDateString()}
                  </span>
                  <div className="flex gap-4 text-stone-500 dark:text-stone-400">
                    {ci.location && <span>{ci.location}</span>}
                    {ci.duration && (
                      <span>
                        {Math.floor(ci.duration / 60)}h{ci.duration % 60 > 0 ? ` ${ci.duration % 60}m` : ""}
                      </span>
                    )}
                  </div>
                </div>
                {ci.attendees.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-1">
                    {ci.attendees.map((a) => (
                      <span
                        key={a.id}
                        className={`rounded-full px-2 py-0.5 text-xs ${
                          a.profiles
                            ? "bg-stone-100 text-stone-600 dark:bg-stone-800 dark:text-stone-400"
                            : "bg-stone-100 text-stone-400 italic dark:bg-stone-800 dark:text-stone-500"
                        }`}
                      >
                        {a.profiles?.display_name ?? t("deletedUser")}
                      </span>
                    ))}
                  </div>
                )}
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

      {/* Group management (members only) */}
      {isMember && user && (
        <section className="mb-8 rounded-lg border border-stone-200 p-5 dark:border-stone-700">
          <h2 className="mb-4 text-sm font-medium text-stone-500 dark:text-stone-400">
            {t("groupManagement")}
          </h2>
          <div className="flex gap-6">
            <LeaveGroupButton
              groupId={group.id}
              userId={user.id}
              isReferent={isReferent}
              isLastMember={memberCount <= 1}
              isOpen={isOpen}
            />
            {isReferent && isOpen && (
              <CloseGroupButton groupId={group.id} />
            )}
          </div>
        </section>
      )}

      {/* Actions */}
      <div className="flex gap-3">
        {!isMember && canJoin && user && !hasPendingRequest && (
          <Link
            href={`/groups/${group.slug}/join`}
            className="rounded-md bg-amber-600 px-4 py-2 text-sm font-medium text-stone-900 hover:bg-amber-500 dark:bg-amber-500 dark:text-stone-900 dark:hover:bg-amber-400"
          >
            {isOpenAccess ? t("joinDirectly") : t("askToJoin")}
          </Link>
        )}
        {!isMember && hasPendingRequest && (
          <p className="text-sm text-amber-600 dark:text-amber-400">
            {t("requestPending")}
          </p>
        )}
        {!isMember && canJoin && !user && (
          <p className="text-sm text-stone-500 dark:text-stone-400">
            {t("loginToJoin")}
          </p>
        )}
        {!isMember && isOpen && !hasReferent && !isOpenAccess && (
          <p className="text-sm text-stone-500 dark:text-stone-400">
            {t("noReferent")}
          </p>
        )}
        {!isMember && isFull && (
          <p className="text-sm text-stone-500 dark:text-stone-400">
            {t("groupFull")}
          </p>
        )}
        {!isMember && !isOpen && (
          <p className="text-sm text-stone-500 dark:text-stone-400">
            {t("groupClosed")}
          </p>
        )}
      </div>
    </div>
  );
}
