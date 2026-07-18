"use client";

import { useState } from "react";
import { Link } from "@/i18n/navigation";
import LogoutButton from "@/components/LogoutButton";
import LanguageSwitcher from "./LanguageSwitcher";

type Props = {
  isLoggedIn: boolean;
  userId?: string | null;
  labels: {
    search: string;
    myGroups: string;
    profile: string;
    signIn: string;
  };
};

export default function MobileMenu({ isLoggedIn, userId, labels }: Props) {
  const [open, setOpen] = useState(false);

  return (
    <div className="md:hidden">
      <button
        onClick={() => setOpen(!open)}
        className="p-1 text-stone-600 hover:text-amber-700 dark:text-stone-400 dark:hover:text-amber-500"
        aria-label="Menu"
        aria-expanded={open}
      >
        {open ? (
          <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        ) : (
          <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="3" y1="6" x2="21" y2="6" />
            <line x1="3" y1="12" x2="21" y2="12" />
            <line x1="3" y1="18" x2="21" y2="18" />
          </svg>
        )}
      </button>

      {open && (
        <div className="absolute left-0 right-0 top-full z-50 border-b border-stone-200 bg-white px-4 py-4 dark:border-stone-800 dark:bg-stone-950">
          <nav className="mx-auto flex max-w-5xl flex-col gap-4">
            <Link
              href="/search"
              onClick={() => setOpen(false)}
              className="text-sm text-stone-600 hover:text-amber-700 dark:text-stone-400 dark:hover:text-amber-500"
            >
              {labels.search}
            </Link>
            {isLoggedIn ? (
              <>
                <Link
                  href="/my-groups"
                  onClick={() => setOpen(false)}
                  className="text-sm text-stone-600 hover:text-amber-700 dark:text-stone-400 dark:hover:text-amber-500"
                >
                  {labels.myGroups}
                </Link>
                <Link
                  href="/profile"
                  onClick={() => setOpen(false)}
                  className="text-sm text-stone-600 hover:text-amber-700 dark:text-stone-400 dark:hover:text-amber-500"
                >
                  {labels.profile}
                </Link>
                <LogoutButton />
              </>
            ) : (
              <Link
                href="/login"
                onClick={() => setOpen(false)}
                className="text-sm font-medium text-amber-700 hover:text-amber-800 dark:text-amber-500 dark:hover:text-amber-400"
              >
                {labels.signIn}
              </Link>
            )}
            <div className="border-t border-stone-200 pt-4 dark:border-stone-800">
              <LanguageSwitcher userId={userId} />
            </div>
          </nav>
        </div>
      )}
    </div>
  );
}
