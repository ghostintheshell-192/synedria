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
      <h1 className="mb-6 text-2xl font-bold text-zinc-900 dark:text-zinc-50">
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
          <h2 className="mb-3 text-lg font-semibold text-zinc-800 dark:text-zinc-200">
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
          <h2 className="mb-3 text-lg font-semibold text-zinc-800 dark:text-zinc-200">
            {t("candidaturesTitle")}
          </h2>
          <ul className="space-y-2">
            {candidatures.map((c) => (
              <li
                key={c.id}
                className="flex items-center justify-between rounded-md border border-zinc-200 px-4 py-3 text-sm dark:border-zinc-700"
              >
                <Link
                  href={`/groups/${c.group.slug}`}
                  className="font-medium text-zinc-900 hover:underline dark:text-zinc-100"
                >
                  {c.group.name}
                </Link>
                <span
                  className={`text-xs font-medium ${
                    c.status === "pending"
                      ? "text-amber-600 dark:text-amber-400"
                      : c.status === "approved"
                        ? "text-green-600 dark:text-green-400"
                        : "text-zinc-400"
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
          <h2 className="text-lg font-semibold text-zinc-800 dark:text-zinc-200">
            {t("activeGroupsTitle")}
          </h2>
          <Link
            href="/my-groups"
            className="text-sm text-zinc-500 hover:text-zinc-700 dark:text-zinc-400 dark:hover:text-zinc-200"
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
          <div className="rounded-lg border border-dashed border-zinc-300 p-6 text-center dark:border-zinc-700">
            <p className="text-sm text-zinc-500 dark:text-zinc-400">
              {t("noActiveGroups")}
            </p>
            <Link
              href="/groups/create"
              className="mt-3 inline-block rounded-md bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-700 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-300"
            >
              {t("createGroupCta")}
            </Link>
          </div>
        )}
      </section>
    </div>
  );
}
