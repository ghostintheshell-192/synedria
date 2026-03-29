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

  const supabase = await createClient();

  // Build query
  let query = supabase
    .from("groups")
    .select("id, name, slug, skill_tag, objective, city, preferred_format, status")
    .eq("status", "open")
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

  // Enrich with member counts and last check-in
  const results: GroupResult[] = [];
  if (groups) {
    for (const group of groups) {
      const { count: memberCount } = await supabase
        .from("group_members")
        .select("*", { count: "exact", head: true })
        .eq("group_id", group.id);

      const { data: lastCheckIn } = await supabase
        .from("check_ins")
        .select("meeting_date")
        .eq("group_id", group.id)
        .order("meeting_date", { ascending: false })
        .limit(1)
        .single();

      results.push({
        ...group,
        member_count: memberCount ?? 0,
        last_check_in: lastCheckIn?.meeting_date ?? null,
      });
    }
  }

  const hasFilters = searchParams.skill || searchParams.city || searchParams.format;

  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <h1 className="mb-6 text-3xl font-bold text-zinc-900 dark:text-zinc-50">
        {t("pageTitle")}
      </h1>

      <Suspense>
        <SearchFilters />
      </Suspense>

      {results.length === 0 ? (
        <div className="rounded-lg border border-dashed border-zinc-300 p-8 text-center dark:border-zinc-700">
          <p className="text-zinc-500 dark:text-zinc-400">
            {hasFilters ? t("noResults") : t("noGroups")}
          </p>
          <p className="mt-2 text-sm text-zinc-400 dark:text-zinc-500">
            {t("broaden")}
          </p>
          <Link
            href="/groups/create"
            className="mt-4 inline-block rounded-md bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-700 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-300"
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
                  className="block rounded-lg border border-zinc-200 p-4 transition-colors hover:border-zinc-400 dark:border-zinc-700 dark:hover:border-zinc-500"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <h2 className="font-semibold text-zinc-900 dark:text-zinc-100">
                        {group.name}
                      </h2>
                      <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
                        {group.objective}
                      </p>
                    </div>
                    <span className="ml-4 whitespace-nowrap text-sm text-zinc-500 dark:text-zinc-400">
                      {group.member_count}/8
                    </span>
                  </div>
                  <div className="mt-3 flex flex-wrap gap-2">
                    <span className="rounded-full bg-zinc-100 px-2 py-0.5 text-xs text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400">
                      {group.skill_tag}
                    </span>
                    <span className="rounded-full bg-zinc-100 px-2 py-0.5 text-xs text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400">
                      {group.city}
                    </span>
                    <span className="rounded-full bg-zinc-100 px-2 py-0.5 text-xs text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400">
                      {tProfile(`format.${group.preferred_format}`)}
                    </span>
                    <span className="rounded-full bg-zinc-100 px-2 py-0.5 text-xs text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400">
                      {getActivityLabel(group.last_check_in, t)}
                    </span>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
          {results.length < 3 && (
            <div className="mt-6 text-center">
              <p className="text-sm text-zinc-400 dark:text-zinc-500">
                {t("fewResults")}
              </p>
              <Link
                href="/groups/create"
                className="mt-2 inline-block text-sm text-zinc-600 underline hover:text-zinc-800 dark:text-zinc-400 dark:hover:text-zinc-200"
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
