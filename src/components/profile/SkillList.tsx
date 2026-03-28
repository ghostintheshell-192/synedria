"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import type { UserSkill, SkillLevel, SkillIntention } from "@/types/database";

const LEVELS: SkillLevel[] = ["beginner", "intermediate", "advanced"];
const INTENTIONS: SkillIntention[] = ["learn", "teach", "collaborate"];

function SkillForm({
  skill,
  onSaved,
  onCancel,
}: {
  skill?: UserSkill;
  onSaved: () => void;
  onCancel: () => void;
}) {
  const t = useTranslations("profile");
  const supabase = createClient();

  const [skillName, setSkillName] = useState(skill?.skill_name ?? "");
  const [level, setLevel] = useState<SkillLevel>(skill?.level ?? "beginner");
  const [intention, setIntention] = useState<SkillIntention>(
    skill?.intention ?? "learn"
  );
  const [goal, setGoal] = useState(skill?.goal ?? "");
  const [saving, setSaving] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!skillName.trim()) return;

    setSaving(true);

    if (skill) {
      await supabase
        .from("user_skills")
        .update({
          skill_name: skillName.trim(),
          level,
          intention,
          goal: goal.trim() || null,
        })
        .eq("id", skill.id);
    } else {
      await supabase.from("user_skills").insert({
        skill_name: skillName.trim(),
        level,
        intention,
        goal: goal.trim() || null,
      });
    }

    setSaving(false);
    onSaved();
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 rounded-md border border-zinc-200 p-4 dark:border-zinc-700">
      <div>
        <label className="mb-1 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
          {t("skillName")}
        </label>
        <input
          type="text"
          value={skillName}
          onChange={(e) => setSkillName(e.target.value)}
          placeholder={t("skillNamePlaceholder")}
          required
          className="w-full rounded-md border border-zinc-300 bg-white px-3 py-2 text-zinc-900 dark:border-zinc-600 dark:bg-zinc-800 dark:text-zinc-100"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="mb-1 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
            {t("level")}
          </label>
          <select
            value={level}
            onChange={(e) => setLevel(e.target.value as SkillLevel)}
            className="w-full rounded-md border border-zinc-300 bg-white px-3 py-2 text-zinc-900 dark:border-zinc-600 dark:bg-zinc-800 dark:text-zinc-100"
          >
            {LEVELS.map((l) => (
              <option key={l} value={l}>
                {t(`skillLevel.${l}`)}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
            {t("intention")}
          </label>
          <select
            value={intention}
            onChange={(e) => setIntention(e.target.value as SkillIntention)}
            className="w-full rounded-md border border-zinc-300 bg-white px-3 py-2 text-zinc-900 dark:border-zinc-600 dark:bg-zinc-800 dark:text-zinc-100"
          >
            {INTENTIONS.map((i) => (
              <option key={i} value={i}>
                {t(`skillIntention.${i}`)}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
          {t("goal")}
        </label>
        <input
          type="text"
          value={goal}
          onChange={(e) => setGoal(e.target.value)}
          placeholder={t("goalPlaceholder")}
          className="w-full rounded-md border border-zinc-300 bg-white px-3 py-2 text-zinc-900 dark:border-zinc-600 dark:bg-zinc-800 dark:text-zinc-100"
        />
      </div>

      <div className="flex gap-2">
        <button
          type="submit"
          disabled={saving}
          className="rounded-md bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-700 disabled:opacity-50 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-300"
        >
          {saving ? t("saving") : skill ? t("updateSkill") : t("addSkill")}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="rounded-md border border-zinc-300 px-4 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-100 dark:border-zinc-600 dark:text-zinc-300 dark:hover:bg-zinc-800"
        >
          {t("cancel")}
        </button>
      </div>
    </form>
  );
}

export default function SkillList({ skills }: { skills: UserSkill[] }) {
  const t = useTranslations("profile");
  const supabase = createClient();
  const router = useRouter();

  const [adding, setAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  async function handleDelete(id: string) {
    await supabase.from("user_skills").delete().eq("id", id);
    router.refresh();
  }

  function handleSaved() {
    setAdding(false);
    setEditingId(null);
    router.refresh();
  }

  return (
    <div className="space-y-4">
      {skills.map((skill) =>
        editingId === skill.id ? (
          <SkillForm
            key={skill.id}
            skill={skill}
            onSaved={handleSaved}
            onCancel={() => setEditingId(null)}
          />
        ) : (
          <div
            key={skill.id}
            className="flex items-start justify-between rounded-md border border-zinc-200 p-4 dark:border-zinc-700"
          >
            <div>
              <div className="font-medium text-zinc-900 dark:text-zinc-100">
                {skill.skill_name}
              </div>
              <div className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
                {t(`skillLevel.${skill.level}`)} ·{" "}
                {t(`skillIntention.${skill.intention}`)}
              </div>
              {skill.goal && (
                <div className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
                  {skill.goal}
                </div>
              )}
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setEditingId(skill.id)}
                className="text-sm text-zinc-500 hover:text-zinc-700 dark:text-zinc-400 dark:hover:text-zinc-200"
              >
                {t("edit")}
              </button>
              <button
                onClick={() => handleDelete(skill.id)}
                className="text-sm text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
              >
                {t("delete")}
              </button>
            </div>
          </div>
        )
      )}

      {adding ? (
        <SkillForm onSaved={handleSaved} onCancel={() => setAdding(false)} />
      ) : (
        <button
          onClick={() => setAdding(true)}
          className="rounded-md border border-dashed border-zinc-300 px-4 py-2 text-sm text-zinc-500 hover:border-zinc-400 hover:text-zinc-700 dark:border-zinc-600 dark:text-zinc-400 dark:hover:border-zinc-500 dark:hover:text-zinc-300"
        >
          + {t("addSkill")}
        </button>
      )}
    </div>
  );
}
