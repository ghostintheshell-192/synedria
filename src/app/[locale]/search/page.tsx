import { Suspense } from "react";
import { getTranslations } from "next-intl/server";
import { createClient } from "@/lib/supabase/server";
import { Link } from "@/i18n/navigation";
import SearchFilters from "@/components/search/SearchFilters";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "search" });
  return {
    title: t("pageTitle"),
  };
}

type GroupResult = {
  id: string;
  name: string;
  slug: string;
  skill_tag: string;
  objective: string;
  city: string;
  preferred_format: string;
  status: string;
  member_count: number;
  last_check_in: string | null;
};

function getActivityLabel(
  lastCheckIn: string | null,
  t: (key: string) => string
): string {
  if (!lastCheckIn) return t("noActivity");
  const days = Math.floor(
    (Date.now() - new Date(lastCheckIn).getTime()) / (1000 * 60 * 60 * 24)
  );
  if (days <= 7) return t("activeThisWeek");
  if (days <= 30) return t("activeThisMonth");
  return t("inactive");
}

export default async function SearchPage({
  params,
  searchParams: searchParamsPromise,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ skill?: string; city?: string; format?: string }>;
}) {
  await params;
  const searchParams = await searchParamsPromise;
  const t = await getTranslations("search");
  const tProfile = await getTranslations("profile");
  const tGroupPage = await getTranslations("groupPage");

  const supabase = await createClient();

  // Build query
  let query = supabase
    .from("groups")
    .select("id, name, slug, skill_tag, objective, city, preferred_format, status")
    .order("status", { ascending: true }) // open before closed (enum order: open=1, closed=2)
    .order("created_at", { ascending: false });

  if (searchParams.skill) {
    query = query.ilike("skill_tag", `%${searchParams.skill}%`);
  }
  if (searchParams.city) {
    query = query.ilike("city", `%${searchParams.city}%`);
  }
  if (searchParams.format) {
    query = query.eq("preferred_format", searchParams.format);
  }

  const { data: groups } = await query;

  // Enrich with member counts and last check-in — 2 queries total instead of 2N
  const results: GroupResult[] = [];
  if (groups && groups.length > 0) {
    const groupIds = groups.map((g) => g.id);

    const [{ data: memberRows }, { data: checkInRows }] = await Promise.all([
      supabase
        .from("group_members")
        .select("group_id")
        .in("group_id", groupIds),
      supabase
        .from("check_ins")
        .select("group_id, meeting_date")
        .in("group_id", groupIds)
        .order("meeting_date", { ascending: false }),
    ]);

    const memberCountByGroup = new Map<string, number>();
    for (const row of memberRows ?? []) {
      memberCountByGroup.set(row.group_id, (memberCountByGroup.get(row.group_id) ?? 0) + 1);
    }

    const lastCheckInByGroup = new Map<string, string>();
    for (const row of checkInRows ?? []) {
      if (!lastCheckInByGroup.has(row.group_id)) {
        lastCheckInByGroup.set(row.group_id, row.meeting_date);
      }
    }

    for (const group of groups) {
      results.push({
        ...group,
        member_count: memberCountByGroup.get(group.id) ?? 0,
        last_check_in: lastCheckInByGroup.get(group.id) ?? null,
      });
    }
  }

  const hasFilters = searchParams.skill || searchParams.city || searchParams.format;

  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-3xl font-bold text-stone-900 dark:text-stone-50">
          {t("pageTitle")}
        </h1>
        <Link
          href="/groups/create"
          className="rounded-md bg-amber-600 px-4 py-2 text-sm font-medium text-stone-900 hover:bg-amber-500 dark:bg-amber-500 dark:text-stone-900 dark:hover:bg-amber-400"
        >
          {t("createCta")}
        </Link>
      </div>

      <Suspense>
        <SearchFilters />
      </Suspense>

      {results.length === 0 ? (
        <div className="rounded-lg border border-dashed border-stone-300 p-8 text-center dark:border-stone-700">
          <p className="text-stone-500 dark:text-stone-400">
            {hasFilters ? t("noResults") : t("noGroups")}
          </p>
          <p className="mt-2 text-sm text-stone-400 dark:text-stone-500">
            {t("broaden")}
          </p>
          <Link
            href="/groups/create"
            className="mt-4 inline-block rounded-md bg-amber-600 px-4 py-2 text-sm font-medium text-stone-900 hover:bg-amber-500 dark:bg-amber-500 dark:text-stone-900 dark:hover:bg-amber-400"
          >
            {t("createCta")}
          </Link>
        </div>
      ) : (
        <>
          <ul className="space-y-4">
            {results.map((group) => (
              <li key={group.id}>
                <Link
                  href={`/groups/${group.slug}`}
                  className={`group block rounded-lg border p-4 transition-colors ${
                    group.status === "closed"
                      ? "border-stone-200 opacity-60 hover:border-stone-300 dark:border-stone-800 dark:hover:border-stone-700"
                      : "border-stone-200 hover:border-amber-400 hover:bg-amber-100 dark:border-stone-700 dark:hover:border-amber-600 dark:hover:bg-amber-500"
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="min-w-0">
                      <h2 className="font-semibold text-stone-900 dark:text-stone-100 dark:group-hover:text-stone-900">
                        {group.name}
                      </h2>
                      <p className="mt-1 text-sm text-stone-500 dark:text-stone-400 dark:group-hover:text-stone-700">
                        {group.objective}
                      </p>
                    </div>
                    <span className="ml-2 shrink-0 whitespace-nowrap text-sm text-stone-500 dark:text-stone-400 dark:group-hover:text-stone-700">
                      {group.member_count}/8
                    </span>
                  </div>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {group.status === "closed" && (
                      <span className="rounded-full bg-stone-200 px-2 py-0.5 text-xs text-stone-500 dark:bg-stone-700 dark:text-stone-400">
                        {tGroupPage("statusClosed")}
                      </span>
                    )}
                    <span className="rounded-full bg-stone-100 px-2 py-0.5 text-xs text-stone-600 dark:bg-stone-800 dark:text-stone-400 dark:group-hover:bg-amber-200 dark:group-hover:text-stone-700">
                      {group.skill_tag}
                    </span>
                    <span className="rounded-full bg-stone-100 px-2 py-0.5 text-xs text-stone-600 dark:bg-stone-800 dark:text-stone-400 dark:group-hover:bg-amber-200 dark:group-hover:text-stone-700">
                      {group.city}
                    </span>
                    <span className="rounded-full bg-stone-100 px-2 py-0.5 text-xs text-stone-600 dark:bg-stone-800 dark:text-stone-400 dark:group-hover:bg-amber-200 dark:group-hover:text-stone-700">
                      {tProfile(`format.${group.preferred_format}`)}
                    </span>
                    <span className="rounded-full bg-stone-100 px-2 py-0.5 text-xs text-stone-600 dark:bg-stone-800 dark:text-stone-400 dark:group-hover:bg-amber-200 dark:group-hover:text-stone-700">
                      {getActivityLabel(group.last_check_in, t)}
                    </span>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
          {results.filter((g) => g.status === "open").length < 3 && (
            <div className="mt-6 text-center">
              <p className="text-sm text-stone-400 dark:text-stone-500">
                {t("fewResults")}
              </p>
              <Link
                href="/groups/create"
                className="mt-2 inline-block text-sm text-stone-600 underline hover:text-stone-800 dark:text-stone-400 dark:hover:text-stone-200"
              >
                {t("createCta")}
              </Link>
            </div>
          )}
        </>
      )}
    </div>
  );
}
