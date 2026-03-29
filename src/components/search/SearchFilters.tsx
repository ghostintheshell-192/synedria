"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import type { PreferredFormat } from "@/types/database";

const FORMATS: PreferredFormat[] = ["in_person", "hybrid", "online"];

export default function SearchFilters() {
  const t = useTranslations("search");
  const tProfile = useTranslations("profile");
  const searchParams = useSearchParams();
  const router = useRouter();

  const skill = searchParams.get("skill") ?? "";
  const city = searchParams.get("city") ?? "";
  const format = searchParams.get("format") ?? "";

  function updateFilter(key: string, value: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    router.push(`?${params.toString()}`);
  }

  return (
    <div className="mb-8 space-y-4">
      <div className="flex gap-4">
        <input
          type="text"
          defaultValue={skill}
          placeholder={t("skillPlaceholder")}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              updateFilter("skill", e.currentTarget.value);
            }
          }}
          onBlur={(e) => updateFilter("skill", e.currentTarget.value)}
          className="flex-1 rounded-md border border-zinc-300 bg-white px-3 py-2 text-zinc-900 dark:border-zinc-600 dark:bg-zinc-800 dark:text-zinc-100"
        />
        <input
          type="text"
          defaultValue={city}
          placeholder={t("cityPlaceholder")}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              updateFilter("city", e.currentTarget.value);
            }
          }}
          onBlur={(e) => updateFilter("city", e.currentTarget.value)}
          className="flex-1 rounded-md border border-zinc-300 bg-white px-3 py-2 text-zinc-900 dark:border-zinc-600 dark:bg-zinc-800 dark:text-zinc-100"
        />
      </div>
      <div className="flex gap-2">
        <button
          onClick={() => updateFilter("format", "")}
          className={`rounded-full px-3 py-1 text-sm ${
            !format
              ? "bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900"
              : "bg-zinc-100 text-zinc-600 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-400 dark:hover:bg-zinc-700"
          }`}
        >
          {t("allFormats")}
        </button>
        {FORMATS.map((f) => (
          <button
            key={f}
            onClick={() => updateFilter("format", f)}
            className={`rounded-full px-3 py-1 text-sm ${
              format === f
                ? "bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900"
                : "bg-zinc-100 text-zinc-600 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-400 dark:hover:bg-zinc-700"
            }`}
          >
            {tProfile(`format.${f}`)}
          </button>
        ))}
      </div>
    </div>
  );
}
