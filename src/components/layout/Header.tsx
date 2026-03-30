import { getTranslations } from "next-intl/server";
import { createClient } from "@/lib/supabase/server";
import { Link } from "@/i18n/navigation";
import LogoutButton from "@/components/LogoutButton";
import NotificationBadge from "./NotificationBadge";
import MobileMenu from "./MobileMenu";

export default async function Header() {
  const t = await getTranslations("header");
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <header className="relative border-b border-amber-300 dark:border-amber-800/70">
      <nav className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3">
        <Link
          href="/"
          className="text-lg font-bold text-amber-700 dark:text-amber-500"
        >
          Synedria
        </Link>

        {/* Desktop nav */}
        <div className="hidden items-center gap-4 md:flex">
          <Link
            href="/search"
            className="text-sm text-stone-600 hover:text-amber-700 dark:text-stone-400 dark:hover:text-amber-500"
          >
            {t("search")}
          </Link>

          {user ? (
            <>
              <Link
                href="/my-groups"
                className="text-sm text-stone-600 hover:text-amber-700 dark:text-stone-400 dark:hover:text-amber-500"
              >
                {t("myGroups")}
              </Link>
              <Link
                href="/profile"
                className="text-sm text-stone-600 hover:text-amber-700 dark:text-stone-400 dark:hover:text-amber-500"
              >
                {t("profile")}
              </Link>
              <NotificationBadge userId={user.id} />
              <LogoutButton />
            </>
          ) : (
            <Link
              href="/login"
              className="rounded-md bg-amber-600 px-3 py-1.5 text-sm font-medium text-stone-900 hover:bg-amber-500 dark:bg-amber-500 dark:hover:bg-amber-400"
            >
              {t("signIn")}
            </Link>
          )}
        </div>

        {/* Mobile menu */}
        <MobileMenu
          isLoggedIn={!!user}
          labels={{
            search: t("search"),
            myGroups: t("myGroups"),
            profile: t("profile"),
            signIn: t("signIn"),
          }}
        />
      </nav>
    </header>
  );
}
