"use client";

import { Fragment, useState } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { createClient } from "@/lib/supabase/client";
import type { Profile, PreferredFormat } from "@/types/database";

const DAYS = [
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
  "saturday",
  "sunday",
] as const;

const TIME_SLOTS = ["morning", "afternoon", "evening"] as const;

const FORMATS: PreferredFormat[] = ["in_person", "hybrid", "online"];

export default function ProfileForm({ profile }: { profile: Profile }) {
  const t = useTranslations("profile");
  const supabase = createClient();
  const router = useRouter();

  const [displayName, setDisplayName] = useState(profile.display_name);
  const [city, setCity] = useState(profile.city ?? "");
  const [preferredFormat, setPreferredFormat] = useState<PreferredFormat | "">(
    profile.preferred_format ?? ""
  );
  const [availability, setAvailability] = useState<Record<string, string[]>>(
    (profile.availability as Record<string, string[]>) ?? {}
  );
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  function toggleSlot(day: string, slot: string) {
    setAvailability((prev) => {
      const daySlots = prev[day] ?? [];
      const updated = daySlots.includes(slot)
        ? daySlots.filter((s) => s !== slot)
        : [...daySlots, slot];
      const next = { ...prev };
      if (updated.length === 0) {
        delete next[day];
      } else {
        next[day] = updated;
      }
      return next;
    });
  }

  async function handleSave() {
    setSaving(true);
    setSaved(false);

    await supabase
      .from("profiles")
      .update({
        display_name: displayName,
        city: city || null,
        preferred_format: preferredFormat || null,
        availability: Object.keys(availability).length > 0 ? availability : null,
      })
      .eq("id", profile.id);

    setSaving(false);
    setSaved(true);

    router.refresh();
    setTimeout(() => setSaved(false), 2000);
  }

  return (
    <div className="space-y-6">
      <div>
        <label className="mb-1 block text-sm font-medium text-stone-700 dark:text-stone-300">
          {t("displayName")}
        </label>
        <input
          type="text"
          value={displayName}
          onChange={(e) => setDisplayName(e.target.value)}
          className="w-full rounded-md border border-stone-300 bg-white px-3 py-2 text-stone-900 dark:border-stone-600 dark:bg-stone-800 dark:text-stone-100"
        />
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium text-stone-700 dark:text-stone-300">
          {t("city")}
        </label>
        <input
          type="text"
          value={city}
          onChange={(e) => setCity(e.target.value)}
          placeholder={t("cityPlaceholder")}
          className="w-full rounded-md border border-stone-300 bg-white px-3 py-2 text-stone-900 dark:border-stone-600 dark:bg-stone-800 dark:text-stone-100"
        />
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium text-stone-700 dark:text-stone-300">
          {t("preferredFormat")}
        </label>
        <select
          value={preferredFormat}
          onChange={(e) => setPreferredFormat(e.target.value as PreferredFormat)}
          className="w-full rounded-md border border-stone-300 bg-white px-3 py-2 text-stone-900 dark:border-stone-600 dark:bg-stone-800 dark:text-stone-100"
        >
          <option value="">{t("selectFormat")}</option>
          {FORMATS.map((f) => (
            <option key={f} value={f}>
              {t(`format.${f}`)}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="mb-3 block text-sm font-medium text-stone-700 dark:text-stone-300">
          {t("availability")}
        </label>
        <div className="grid grid-cols-4 gap-1 text-center text-sm">
          <div />
          {TIME_SLOTS.map((slot) => (
            <div
              key={slot}
              className="font-medium text-stone-500 dark:text-stone-400"
            >
              {t(`timeSlot.${slot}`)}
            </div>
          ))}
          {DAYS.map((day) => (
            <Fragment key={day}>
              <div
                className="py-1 text-left font-medium text-stone-700 dark:text-stone-300"
              >
                {t(`day.${day}`)}
              </div>
              {TIME_SLOTS.map((slot) => {
                const active = availability[day]?.includes(slot) ?? false;
                return (
                  <button
                    key={`${day}-${slot}`}
                    type="button"
                    onClick={() => toggleSlot(day, slot)}
                    className={`rounded py-2.5 transition-colors ${
                      active
                        ? "bg-stone-800 text-white dark:bg-stone-200 dark:text-stone-900"
                        : "bg-stone-100 text-stone-400 hover:bg-stone-200 dark:bg-stone-700 dark:text-stone-500 dark:hover:bg-stone-600"
                    }`}
                  >
                    {active ? "✓" : "·"}
                  </button>
                );
              })}
            </Fragment>
          ))}
        </div>
      </div>

      <button
        onClick={handleSave}
        disabled={saving}
        className="rounded-md bg-amber-600 px-4 py-2 text-sm font-medium text-stone-900 hover:bg-amber-500 disabled:opacity-50 dark:bg-amber-500 dark:text-stone-900 dark:hover:bg-amber-400"
      >
        {saving ? t("saving") : saved ? t("saved") : t("save")}
      </button>
    </div>
  );
}
