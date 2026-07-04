import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";

export default async function GroupCard({
  name,
  slug,
  skillTag,
  city,
  preferredFormat,
  memberCount,
  role,
  status,
}: {
  name: string;
  slug: string;
  skillTag: string;
  city: string;
  preferredFormat: string;
  memberCount: number;
  role?: string;
  status?: string;
}) {
  const tProfile = await getTranslations("profile");
  const tMyGroups = await getTranslations("myGroups");

  return (
    <Link
      href={`/groups/${slug}`}
      className="group block rounded-lg border border-stone-200 p-4 transition-colors hover:border-amber-400 hover:bg-amber-100 dark:border-stone-700 dark:hover:border-amber-600 dark:hover:bg-amber-500"
    >
      <div className="flex items-start justify-between">
        <div className="min-w-0">
          <h3 className="font-semibold text-stone-900 dark:text-stone-100 dark:group-hover:text-stone-900">
            {name}
          </h3>
          <div className="mt-2 flex flex-wrap gap-2">
            <span className="rounded-full bg-stone-100 px-2 py-0.5 text-xs text-stone-600 dark:bg-stone-800 dark:text-stone-400 dark:group-hover:bg-amber-200 dark:group-hover:text-stone-700">
              {skillTag}
            </span>
            <span className="rounded-full bg-stone-100 px-2 py-0.5 text-xs text-stone-600 dark:bg-stone-800 dark:text-stone-400 dark:group-hover:bg-amber-200 dark:group-hover:text-stone-700">
              {city}
            </span>
            <span className="rounded-full bg-stone-100 px-2 py-0.5 text-xs text-stone-600 dark:bg-stone-800 dark:text-stone-400 dark:group-hover:bg-amber-200 dark:group-hover:text-stone-700">
              {tProfile(`format.${preferredFormat}`)}
            </span>
          </div>
        </div>
        <div className="ml-2 shrink-0 text-right">
          <span className="text-sm text-stone-500 dark:text-stone-400 dark:group-hover:text-stone-700">
            {memberCount}/8
          </span>
          {role === "referent" && (
            <p className="text-xs text-stone-400 dark:text-stone-500 dark:group-hover:text-stone-600">
              {tMyGroups("role")}
            </p>
          )}
          {status === "closed" && (
            <p className="text-xs text-stone-400 dark:text-stone-500 dark:group-hover:text-stone-600">
              Closed
            </p>
          )}
        </div>
      </div>
    </Link>
  );
}
