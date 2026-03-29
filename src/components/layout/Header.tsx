import { getTranslations } from "next-intl/server";
import { createClient } from "@/lib/supabase/server";
import { Link } from "@/i18n/navigation";
import LogoutButton from "@/components/LogoutButton";
import NotificationBadge from "./NotificationBadge";

export default async function Header() {
  const t = await getTranslations("header");
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <header className="border-b border-zinc-200 dark:border-zinc-800">
      <nav className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3">
        <Link
          href="/"
          className="text-lg font-bold text-zinc-900 dark:text-zinc-50"
        >
          Synedria
        </Link>

        <div className="flex items-center gap-4">
          <Link
            href="/search"
            className="text-sm text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100"
          >
            {t("search")}
          </Link>

          {user ? (
            <>
              <Link
                href="/my-groups"
                className="text-sm text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100"
              >
                {t("myGroups")}
              </Link>
              <Link
                href="/profile"
                className="text-sm text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100"
              >
                {t("profile")}
              </Link>
              <NotificationBadge userId={user.id} />
              <LogoutButton />
            </>
          ) : (
            <Link
              href="/login"
              className="rounded-md bg-zinc-900 px-3 py-1.5 text-sm font-medium text-white hover:bg-zinc-700 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-300"
            >
              {t("signIn")}
            </Link>
          )}
        </div>
      </nav>
    </header>
  );
}
