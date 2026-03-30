"use client";

import { useState } from "react";
import { useRouter } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import { createClient } from "@/lib/supabase/client";
import { generateSlug } from "@/lib/slug";
import type { PreferredFormat } from "@/types/database";

type GroupEntryMode = "approval" | "open";
type ProgressMode = "accumulation" | "deadline" | "both";

const FORMATS: PreferredFormat[] = ["in_person", "hybrid", "online"];
const ENTRY_MODES: GroupEntryMode[] = ["approval", "open"];
const PROGRESS_MODES: ProgressMode[] = ["accumulation", "deadline", "both"];

export default function GroupCreateForm({ userId }: { userId: string }) {
  const t = useTranslations("groups");
  const tProfile = useTranslations("profile");
  const supabase = createClient();
  const router = useRouter();

  const [name, setName] = useState("");
  const [skillTag, setSkillTag] = useState("");
  const [objective, setObjective] = useState("");
  const [city, setCity] = useState("");
  const [preferredFormat, setPreferredFormat] =
    useState<PreferredFormat>("in_person");
  const [entryMode, setEntryMode] = useState<GroupEntryMode>("approval");
  const [progressMode, setProgressMode] =
    useState<ProgressMode>("accumulation");
  const [deadline, setDeadline] = useState("");
  const [roadmapUrl, setRoadmapUrl] = useState("");
  const [meetingPlace, setMeetingPlace] = useState("");
  const [studyMode, setStudyMode] = useState("");
  const [climate, setClimate] = useState("");
  const [expectedAttendance, setExpectedAttendance] = useState("");
  const [description, setDescription] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim() || !skillTag.trim() || !objective.trim() || !city.trim()) {
      return;
    }

    setSaving(true);
    setError("");

    let slug = generateSlug(name);

    // Check for slug collision and add suffix if needed
    const { data: existing } = await supabase
      .from("groups")
      .select("slug")
      .like("slug", `${slug}%`);

    if (existing && existing.length > 0) {
      const existingSlugs = new Set(existing.map((g) => g.slug));
      if (existingSlugs.has(slug)) {
        let suffix = 2;
        while (existingSlugs.has(`${slug}-${suffix}`)) {
          suffix++;
        }
        slug = `${slug}-${suffix}`;
      }
    }

    const { data: group, error: insertError } = await supabase
      .from("groups")
      .insert({
        name: name.trim(),
        slug,
        skill_tag: skillTag.trim(),
        objective: objective.trim(),
        city: city.trim(),
        preferred_format: preferredFormat,
        entry_mode: entryMode,
        progress_mode: progressMode,
        deadline: deadline || null,
        roadmap_url: roadmapUrl.trim() || null,
        meeting_place: meetingPlace.trim() || null,
        study_mode: studyMode.trim() || null,
        climate: climate.trim() || null,
        expected_attendance: expectedAttendance.trim() || null,
        description: description.trim() || null,
        created_by: userId,
      })
      .select("id, slug")
      .single();

    if (insertError || !group) {
      setError(t("createError"));
      setSaving(false);
      return;
    }

    // Add creator as referent member
    await supabase.from("group_members").insert({
      group_id: group.id,
      user_id: userId,
      role: "referent",
    });

    router.push(`/groups/${group.slug}`);
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <h1 className="text-3xl font-bold text-stone-900 dark:text-stone-50">
        {t("createTitle")}
      </h1>
      <p className="text-sm text-stone-500 dark:text-stone-400">
        {t("createHint")}
      </p>

      {error && (
        <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
      )}

      {/* Required fields */}
      <div>
        <label className="mb-1 block text-sm font-medium text-stone-700 dark:text-stone-300">
          {t("groupName")} *
        </label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          className="w-full rounded-md border border-stone-300 bg-white px-3 py-2 text-stone-900 dark:border-stone-600 dark:bg-stone-800 dark:text-stone-100"
        />
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium text-stone-700 dark:text-stone-300">
          {t("skillTag")} *
        </label>
        <input
          type="text"
          value={skillTag}
          onChange={(e) => setSkillTag(e.target.value)}
          placeholder={t("skillTagPlaceholder")}
          required
          className="w-full rounded-md border border-stone-300 bg-white px-3 py-2 text-stone-900 dark:border-stone-600 dark:bg-stone-800 dark:text-stone-100"
        />
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium text-stone-700 dark:text-stone-300">
          {t("objective")} *
        </label>
        <textarea
          value={objective}
          onChange={(e) => setObjective(e.target.value)}
          placeholder={t("objectivePlaceholder")}
          required
          rows={3}
          className="w-full rounded-md border border-stone-300 bg-white px-3 py-2 text-stone-900 dark:border-stone-600 dark:bg-stone-800 dark:text-stone-100"
        />
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium text-stone-700 dark:text-stone-300">
          {tProfile("city")} *
        </label>
        <input
          type="text"
          value={city}
          onChange={(e) => setCity(e.target.value)}
          placeholder={tProfile("cityPlaceholder")}
          required
          className="w-full rounded-md border border-stone-300 bg-white px-3 py-2 text-stone-900 dark:border-stone-600 dark:bg-stone-800 dark:text-stone-100"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="mb-1 block text-sm font-medium text-stone-700 dark:text-stone-300">
            {tProfile("preferredFormat")}
          </label>
          <select
            value={preferredFormat}
            onChange={(e) =>
              setPreferredFormat(e.target.value as PreferredFormat)
            }
            className="w-full rounded-md border border-stone-300 bg-white px-3 py-2 text-stone-900 dark:border-stone-600 dark:bg-stone-800 dark:text-stone-100"
          >
            {FORMATS.map((f) => (
              <option key={f} value={f}>
                {tProfile(`format.${f}`)}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-stone-700 dark:text-stone-300">
            {t("entryMode")}
          </label>
          <select
            value={entryMode}
            onChange={(e) => setEntryMode(e.target.value as GroupEntryMode)}
            className="w-full rounded-md border border-stone-300 bg-white px-3 py-2 text-stone-900 dark:border-stone-600 dark:bg-stone-800 dark:text-stone-100"
          >
            {ENTRY_MODES.map((m) => (
              <option key={m} value={m}>
                {t(`entryModeOption.${m}`)}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium text-stone-700 dark:text-stone-300">
          {t("progressMode")}
        </label>
        <select
          value={progressMode}
          onChange={(e) => setProgressMode(e.target.value as ProgressMode)}
          className="w-full rounded-md border border-stone-300 bg-white px-3 py-2 text-stone-900 dark:border-stone-600 dark:bg-stone-800 dark:text-stone-100"
        >
          {PROGRESS_MODES.map((m) => (
            <option key={m} value={m}>
              {t(`progressModeOption.${m}`)}
            </option>
          ))}
        </select>
      </div>

      {(progressMode === "deadline" || progressMode === "both") && (
        <div>
          <label className="mb-1 block text-sm font-medium text-stone-700 dark:text-stone-300">
            {t("deadline")}
          </label>
          <input
            type="date"
            value={deadline}
            onChange={(e) => setDeadline(e.target.value)}
            className="w-full rounded-md border border-stone-300 bg-white px-3 py-2 text-stone-900 dark:border-stone-600 dark:bg-stone-800 dark:text-stone-100"
          />
        </div>
      )}

      {/* Optional fields */}
      <details className="rounded-md border border-stone-200 p-4 dark:border-stone-700">
        <summary className="cursor-pointer text-sm font-medium text-stone-700 dark:text-stone-300">
          {t("optionalFields")}
        </summary>
        <div className="mt-4 space-y-4">
          <div>
            <label className="mb-1 block text-sm font-medium text-stone-700 dark:text-stone-300">
              {t("roadmapUrl")}
            </label>
            <input
              type="url"
              value={roadmapUrl}
              onChange={(e) => setRoadmapUrl(e.target.value)}
              placeholder="https://roadmap.sh/devops"
              className="w-full rounded-md border border-stone-300 bg-white px-3 py-2 text-stone-900 dark:border-stone-600 dark:bg-stone-800 dark:text-stone-100"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-stone-700 dark:text-stone-300">
              {t("meetingPlace")}
            </label>
            <input
              type="text"
              value={meetingPlace}
              onChange={(e) => setMeetingPlace(e.target.value)}
              placeholder={t("meetingPlacePlaceholder")}
              className="w-full rounded-md border border-stone-300 bg-white px-3 py-2 text-stone-900 dark:border-stone-600 dark:bg-stone-800 dark:text-stone-100"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-stone-700 dark:text-stone-300">
              {t("studyMode")}
            </label>
            <input
              type="text"
              value={studyMode}
              onChange={(e) => setStudyMode(e.target.value)}
              placeholder={t("studyModePlaceholder")}
              className="w-full rounded-md border border-stone-300 bg-white px-3 py-2 text-stone-900 dark:border-stone-600 dark:bg-stone-800 dark:text-stone-100"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-stone-700 dark:text-stone-300">
              {t("climate")}
            </label>
            <input
              type="text"
              value={climate}
              onChange={(e) => setClimate(e.target.value)}
              placeholder={t("climatePlaceholder")}
              className="w-full rounded-md border border-stone-300 bg-white px-3 py-2 text-stone-900 dark:border-stone-600 dark:bg-stone-800 dark:text-stone-100"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-stone-700 dark:text-stone-300">
              {t("expectedAttendance")}
            </label>
            <input
              type="text"
              value={expectedAttendance}
              onChange={(e) => setExpectedAttendance(e.target.value)}
              placeholder={t("expectedAttendancePlaceholder")}
              className="w-full rounded-md border border-stone-300 bg-white px-3 py-2 text-stone-900 dark:border-stone-600 dark:bg-stone-800 dark:text-stone-100"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-stone-700 dark:text-stone-300">
              {t("description")}
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              className="w-full rounded-md border border-stone-300 bg-white px-3 py-2 text-stone-900 dark:border-stone-600 dark:bg-stone-800 dark:text-stone-100"
            />
          </div>
        </div>
      </details>

      <button
        type="submit"
        disabled={saving}
        className="w-full rounded-md bg-amber-600 px-4 py-2 text-sm font-medium text-stone-900 hover:bg-amber-500 disabled:opacity-50 dark:bg-amber-500 dark:text-stone-900 dark:hover:bg-amber-400"
      >
        {saving ? t("creating") : t("createButton")}
      </button>
    </form>
  );
}
