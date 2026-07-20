"use client";

import { useState } from "react";
import { useRouter } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import { createClient } from "@/lib/supabase/client";
import { generateSlug } from "@/lib/slug";
import type { PreferredFormat } from "@/types/database";
import CertificationCombobox, {
  type CertOption,
} from "@/components/groups/CertificationCombobox";

type GroupEntryMode = "approval" | "open";
type ProgressMode = "accumulation" | "deadline" | "both";
type TitleMode = "custom" | "derived";

const FORMATS: PreferredFormat[] = ["in_person", "hybrid", "online"];
const ENTRY_MODES: GroupEntryMode[] = ["approval", "open"];
const PROGRESS_MODES: ProgressMode[] = ["accumulation", "deadline", "both"];

export default function GroupCreateForm({
  userId,
  certifications,
}: {
  userId: string;
  certifications: CertOption[];
}) {
  const t = useTranslations("groups");
  const tProfile = useTranslations("profile");
  const tContact = useTranslations("contact");
  const supabase = createClient();
  const router = useRouter();

  const [titleMode, setTitleMode] = useState<TitleMode>("custom");
  const [certificationId, setCertificationId] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [skillTag, setSkillTag] = useState("");
  const [objective, setObjective] = useState("");
  // Once the user edits a pre-filled field, stop overwriting it on cert change.
  const [skillTagTouched, setSkillTagTouched] = useState(false);
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

  // Selecting a certification seeds the skill tag as a soft, editable default
  // from the issuer (e.g. "AWS") — more concrete and searchable than the coarse
  // category — but only if the user hasn't typed their own. The objective is
  // NOT pre-filled: "prepare for certification X" is shown as a derived,
  // read-only line and implied by certification_id, never mixed into the user's
  // free text. On deselect, the still-untouched tag is cleared again.
  function handleCertChange(id: string | null) {
    setCertificationId(id);
    const cert = id ? certifications.find((c) => c.id === id) : null;
    if (!skillTagTouched) {
      setSkillTag(cert ? cert.issuerName : "");
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    // Title comes from a custom name OR is derived from the linked certification
    // (FR-10a) — mirrors the DB CHECK (name OR certification_id). The effective
    // title also drives the slug.
    const selectedCert = certifications.find((c) => c.id === certificationId);
    const derivedTitle =
      titleMode === "custom" ? name.trim() : selectedCert?.name ?? "";

    if (titleMode === "custom" && !name.trim()) return;
    if (!skillTag.trim() || !city.trim()) {
      return;
    }
    // The combobox has no native HTML validation, so surface this explicitly
    // instead of failing the submit silently.
    if (titleMode === "derived" && !selectedCert) {
      setError(t("certificationRequired"));
      return;
    }
    // The objective is required only when no certification is linked — the
    // certification implies the goal (mirrors the DB CHECK objective OR
    // certification_id).
    if (!certificationId && !objective.trim()) {
      return;
    }

    setSaving(true);
    setError("");

    let slug = generateSlug(derivedTitle);

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
        name: titleMode === "custom" ? name.trim() : null,
        certification_id: certificationId,
        slug,
        skill_tag: skillTag.trim(),
        objective: objective.trim() || null,
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

    // Add creator as referent member. If this is silently dropped the group is
    // left with no referent, so the failure must surface instead of navigating.
    const { data: member, error: memberError } = await supabase
      .from("group_members")
      .insert({
        group_id: group.id,
        user_id: userId,
        role: "referent",
      })
      .select("group_id");

    if (memberError || !member?.length) {
      setError(t("referentError"));
      setSaving(false);
      return;
    }

    router.push(`/groups/${group.slug}`);
  }

  const selectedCert = certifications.find((c) => c.id === certificationId);

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

      {/* Title: custom name, or derived from the linked certification (FR-10a) */}
      <fieldset>
        <legend className="mb-2 block text-sm font-medium text-stone-700 dark:text-stone-300">
          {t("titleModeLabel")}
        </legend>
        <div className="flex flex-col gap-2 sm:flex-row sm:gap-6">
          {(["custom", "derived"] as const).map((mode) => (
            <label
              key={mode}
              className="flex items-center gap-2 text-sm text-stone-700 dark:text-stone-300"
            >
              <input
                type="radio"
                name="titleMode"
                value={mode}
                checked={titleMode === mode}
                onChange={() => setTitleMode(mode)}
                className="accent-amber-600"
              />
              {t(`titleModeOption.${mode}`)}
            </label>
          ))}
        </div>
      </fieldset>

      {titleMode === "custom" && (
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
      )}

      {/* Certification link (FR-9): highlighted so the (optional) link is
          noticed. Required when the title is derived from it. */}
      <div className="rounded-lg border border-amber-300 bg-amber-50 p-4 dark:border-amber-800/60 dark:bg-amber-950/30">
        <label className="mb-1 block text-sm font-medium text-stone-800 dark:text-stone-200">
          {t("certification")}{" "}
          {titleMode === "derived" ? "*" : `(${t("optional")})`}
        </label>
        <p className="mb-3 text-xs text-stone-600 dark:text-stone-400">
          {t("certificationLead")}
        </p>
        <CertificationCombobox
          options={certifications}
          value={certificationId}
          onChange={handleCertChange}
        />
        {titleMode === "derived" && (
          <p className="mt-1 text-xs text-stone-600 dark:text-stone-400">
            {t("titleDerivedHint")}
          </p>
        )}
        <p className="mt-2 text-sm">
          <a
            href={`mailto:${tContact("email")}?subject=${encodeURIComponent(
              t("suggestEmailSubject"),
            )}&body=${encodeURIComponent(t("suggestEmailBody"))}`}
            className="font-medium text-amber-700 underline hover:text-amber-600 dark:text-amber-500 dark:hover:text-amber-400"
          >
            {t("suggestCertification")}
          </a>
        </p>
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium text-stone-700 dark:text-stone-300">
          {t("skillTag")} *
        </label>
        <input
          type="text"
          value={skillTag}
          onChange={(e) => {
            setSkillTag(e.target.value);
            setSkillTagTouched(true);
          }}
          placeholder={t("skillTagPlaceholder")}
          required
          className="w-full rounded-md border border-stone-300 bg-white px-3 py-2 text-stone-900 dark:border-stone-600 dark:bg-stone-800 dark:text-stone-100"
        />
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium text-stone-700 dark:text-stone-300">
          {t("objective")} {certificationId ? `(${t("optional")})` : "*"}
        </label>
        {selectedCert && (
          <p className="mb-2 flex items-center gap-1.5 rounded-md bg-stone-100 px-3 py-2 text-sm text-stone-600 dark:bg-stone-800 dark:text-stone-400">
            <span aria-hidden>🎓</span>
            {t("objectiveFromCert", { name: selectedCert.name })}
          </p>
        )}
        <textarea
          value={objective}
          onChange={(e) => setObjective(e.target.value)}
          placeholder={
            certificationId
              ? t("objectiveExtraPlaceholder")
              : t("objectivePlaceholder")
          }
          required={!certificationId}
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

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
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
