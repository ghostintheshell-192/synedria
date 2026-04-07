"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import type { PreferredFormat } from "@/types/database";

const FORMATS: PreferredFormat[] = ["in_person", "hybrid", "online"];

export default function SearchFilters() {
  const t = useTranslations("search");
  const tProfile = useTranslations("profile");
  const searchParams = useSearchParams();
  const router = useRouter();

  const format = searchParams.get("format") ?? "";

  const [skillInput, setSkillInput] = useState(searchParams.get("skill") ?? "");
  const [cityInput, setCityInput] = useState(searchParams.get("city") ?? "");

  useEffect(() => {
    const timer = setTimeout(() => {
      const params = new URLSearchParams(searchParams.toString());
      if (skillInput) {
        params.set("skill", skillInput);
      } else {
        params.delete("skill");
      }
      if (cityInput) {
        params.set("city", cityInput);
      } else {
        params.delete("city");
      }
      router.push(`?${params.toString()}`);
    }, 400);

    return () => clearTimeout(timer);
  }, [skillInput, cityInput]); // eslint-disable-line react-hooks/exhaustive-deps

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
          value={skillInput}
          placeholder={t("skillPlaceholder")}
          onChange={(e) => setSkillInput(e.target.value)}
          className="flex-1 rounded-md border border-stone-300 bg-white px-3 py-2 text-stone-900 dark:border-stone-600 dark:bg-stone-800 dark:text-stone-100"
        />
        <input
          type="text"
          value={cityInput}
          placeholder={t("cityPlaceholder")}
          onChange={(e) => setCityInput(e.target.value)}
          className="flex-1 rounded-md border border-stone-300 bg-white px-3 py-2 text-stone-900 dark:border-stone-600 dark:bg-stone-800 dark:text-stone-100"
        />
      </div>
      <div className="flex gap-2">
        <button
          onClick={() => updateFilter("format", "")}
          className={`rounded-full px-3 py-1 text-sm ${
            !format
              ? "bg-amber-600 text-stone-900 dark:bg-amber-500 dark:text-stone-900"
              : "bg-stone-100 text-stone-600 hover:bg-stone-200 dark:bg-stone-800 dark:text-stone-400 dark:hover:bg-amber-500 dark:hover:text-stone-900"
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
                ? "bg-amber-600 text-stone-900 dark:bg-amber-500 dark:text-stone-900"
                : "bg-stone-100 text-stone-600 hover:bg-stone-200 dark:bg-stone-800 dark:text-stone-400 dark:hover:bg-amber-500 dark:hover:text-stone-900"
            }`}
          >
            {tProfile(`format.${f}`)}
          </button>
        ))}
      </div>
    </div>
  );
}
