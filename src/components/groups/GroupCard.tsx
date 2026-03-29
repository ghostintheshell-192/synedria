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
      className="block rounded-lg border border-zinc-200 p-4 transition-colors hover:border-zinc-400 dark:border-zinc-700 dark:hover:border-zinc-500"
    >
      <div className="flex items-start justify-between">
        <div>
          <h3 className="font-semibold text-zinc-900 dark:text-zinc-100">
            {name}
          </h3>
          <div className="mt-2 flex flex-wrap gap-2">
            <span className="rounded-full bg-zinc-100 px-2 py-0.5 text-xs text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400">
              {skillTag}
            </span>
            <span className="rounded-full bg-zinc-100 px-2 py-0.5 text-xs text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400">
              {city}
            </span>
            <span className="rounded-full bg-zinc-100 px-2 py-0.5 text-xs text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400">
              {tProfile(`format.${preferredFormat}`)}
            </span>
          </div>
        </div>
        <div className="text-right">
          <span className="text-sm text-zinc-500 dark:text-zinc-400">
            {memberCount}/8
          </span>
          {role === "referent" && (
            <p className="text-xs text-zinc-400 dark:text-zinc-500">
              {tMyGroups("role")}
            </p>
          )}
          {status === "closed" && (
            <p className="text-xs text-zinc-400 dark:text-zinc-500">
              Closed
            </p>
          )}
        </div>
      </div>
    </Link>
  );
}
