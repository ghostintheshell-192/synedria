import { redirect } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { createClient } from "@/lib/supabase/server";
import { getMyActiveGroups } from "@/lib/dashboard";
import { Link } from "@/i18n/navigation";
import GroupCard from "@/components/groups/GroupCard";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "myGroups" });
  return {
    title: t("pageTitle"),
    robots: { index: false, follow: false },
  };
}

export default async function MyGroupsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect(`/${locale}/login`);
  }

  const allGroups = await getMyActiveGroups(supabase, user.id);
  const active = allGroups.filter((g) => g.status === "open");
  const history = allGroups.filter((g) => g.status === "closed");

  const t = await getTranslations("myGroups");

  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <div className="mb-8 flex items-center justify-between">
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

      <section className="mb-10">
        <h2 className="mb-4 text-xl font-semibold text-stone-800 dark:text-stone-200">
          {t("active")}
        </h2>
        {active.length > 0 ? (
          <div className="space-y-3">
            {active.map((group) => (
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
          <p className="text-sm text-stone-500 dark:text-stone-400">
            {t("noActive")}
          </p>
        )}
      </section>

      {history.length > 0 && (
        <section>
          <h2 className="mb-4 text-xl font-semibold text-stone-800 dark:text-stone-200">
            {t("history")}
          </h2>
          <div className="space-y-3">
            {history.map((group) => (
              <GroupCard
                key={group.id}
                name={group.name}
                slug={group.slug}
                skillTag={group.skill_tag}
                city={group.city}
                preferredFormat={group.preferred_format}
                memberCount={group.member_count}
                status={group.status}
              />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
