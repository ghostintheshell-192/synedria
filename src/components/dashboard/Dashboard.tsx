import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import type {
  PendingRequestGroup,
  Candidature,
  ActiveGroup,
} from "@/lib/dashboard";
import type { MissingField } from "@/lib/profile";
import OnboardingBanner from "@/components/OnboardingBanner";
import GroupCard from "@/components/groups/GroupCard";

export default async function Dashboard({
  displayName,
  missingFields,
  pendingRequests,
  candidatures,
  activeGroups,
}: {
  displayName: string;
  missingFields: MissingField[];
  pendingRequests: PendingRequestGroup[];
  candidatures: Candidature[];
  activeGroups: ActiveGroup[];
}) {
  const t = await getTranslations("dashboard");

  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <h1 className="mb-6 text-2xl font-bold text-stone-900 dark:text-stone-50">
        {t("welcome", { name: displayName })}
      </h1>

      {missingFields.length > 0 && (
        <div className="mb-6">
          <OnboardingBanner missingFields={missingFields} />
        </div>
      )}

      {/* Pending requests for referents */}
      {pendingRequests.length > 0 && (
        <section className="mb-6">
          <h2 className="mb-3 text-lg font-semibold text-stone-800 dark:text-stone-200">
            {t("pendingTitle")}
          </h2>
          <ul className="space-y-2">
            {pendingRequests.map((pr) => (
              <li key={pr.groupSlug}>
                <Link
                  href={`/groups/${pr.groupSlug}`}
                  className="block rounded-md border border-amber-200 bg-amber-50 px-4 py-3 text-sm hover:border-amber-300 dark:border-amber-800 dark:bg-amber-950 dark:hover:border-amber-700"
                >
                  <span className="font-medium text-amber-800 dark:text-amber-200">
                    {t("pendingGroup", {
                      count: pr.pendingCount,
                      group: pr.groupName,
                    })}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* My candidatures */}
      {candidatures.length > 0 && (
        <section className="mb-6">
          <h2 className="mb-3 text-lg font-semibold text-stone-800 dark:text-stone-200">
            {t("candidaturesTitle")}
          </h2>
          <ul className="space-y-2">
            {candidatures.map((c) => (
              <li
                key={c.id}
                className="flex items-center justify-between rounded-md border border-stone-200 px-4 py-3 text-sm dark:border-stone-700"
              >
                <Link
                  href={`/groups/${c.group.slug}`}
                  className="font-medium text-stone-900 hover:underline dark:text-stone-100"
                >
                  {c.group.name}
                </Link>
                <span
                  className={`text-xs font-medium ${
                    c.status === "pending"
                      ? "text-amber-600 dark:text-amber-400"
                      : c.status === "approved"
                        ? "text-green-600 dark:text-green-400"
                        : "text-stone-400"
                  }`}
                >
                  {t(`candidature${c.status.charAt(0).toUpperCase() + c.status.slice(1)}` as "candidaturePending")}
                </span>
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* Active groups */}
      <section className="mb-6">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-stone-800 dark:text-stone-200">
            {t("activeGroupsTitle")}
          </h2>
          <Link
            href="/my-groups"
            className="text-sm text-stone-500 hover:text-amber-700 dark:text-stone-400 dark:hover:text-amber-500"
          >
            {t("viewAll")}
          </Link>
        </div>
        {activeGroups.length > 0 ? (
          <div className="space-y-3">
            {activeGroups.slice(0, 4).map((group) => (
              <GroupCard
                key={group.id}
                name={group.name}
                slug={group.slug}
                skillTag={group.skill_tag}
                city={group.city}
                preferredFormat={group.preferred_format}
                memberCount={group.member_count}
                role={group.role}
              />
            ))}
          </div>
        ) : (
          <div className="rounded-lg border border-dashed border-stone-300 p-6 text-center dark:border-stone-700">
            <p className="text-sm text-stone-500 dark:text-stone-400">
              {t("noActiveGroups")}
            </p>
            <div className="mt-3 flex flex-wrap justify-center gap-3">
              <Link
                href="/search"
                className="rounded-md border border-stone-300 px-4 py-2 text-sm font-medium text-stone-700 hover:border-amber-400 hover:text-amber-700 dark:border-stone-600 dark:text-stone-300 dark:hover:border-amber-600 dark:hover:text-amber-500"
              >
                {t("searchGroupsCta")}
              </Link>
              <Link
                href="/groups/create"
                className="rounded-md bg-amber-600 px-4 py-2 text-sm font-medium text-stone-900 hover:bg-amber-500 dark:bg-amber-500 dark:hover:bg-amber-400"
              >
                {t("createGroupCta")}
              </Link>
            </div>
          </div>
        )}
      </section>
    </div>
  );
}
