import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";

export default async function Footer() {
  const t = await getTranslations("footer");

  return (
    <footer className="border-t border-amber-300 dark:border-amber-800/70">
      <div className="mx-auto max-w-5xl px-4 py-6">
        <div className="flex flex-col items-center gap-3">
          <div className="flex items-center text-xs text-stone-400 dark:text-stone-500">
            <Link
              href="/privacy"
              className="px-2 hover:text-amber-700 hover:underline dark:hover:text-amber-500"
            >
              {t("privacy")}
            </Link>
            <span aria-hidden>·</span>
            <Link
              href="/cookies"
              className="px-2 hover:text-amber-700 hover:underline dark:hover:text-amber-500"
            >
              {t("cookies")}
            </Link>
            <span aria-hidden>·</span>
            <Link
              href="/contact"
              className="px-2 hover:text-amber-700 hover:underline dark:hover:text-amber-500"
            >
              {t("contact")}
            </Link>
          </div>
          <p className="text-xs text-stone-400 dark:text-stone-600">
            <a
              href="https://ghostintheshell-192.github.io/"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-amber-700 hover:underline dark:hover:text-amber-500"
            >
              ghostintheshell-192
            </a>
            {" · "}Made with ❤️ and Claude Code
          </p>
        </div>
      </div>
    </footer>
  );
}
