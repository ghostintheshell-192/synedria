"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { createClient } from "@/lib/supabase/client";

type Member = {
  id: string;
  user_id: string;
  profiles: {
    display_name: string;
  } | null;
};

const DURATION_OPTIONS = [30, 60, 90, 120, 150, 180];

export default function CheckInForm({
  groupId,
  members,
}: {
  groupId: string;
  members: Member[];
}) {
  const t = useTranslations("checkIn");
  const supabase = createClient();
  const router = useRouter();

  const [today] = useState(() => new Date().toISOString().split("T")[0]);
  const [minDate] = useState(
    () =>
      new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
        .toISOString()
        .split("T")[0]
  );

  const [meetingDate, setMeetingDate] = useState(() =>
    new Date().toISOString().split("T")[0]
  );
  const [location, setLocation] = useState("");
  const [duration, setDuration] = useState(60);
  const [attendees, setAttendees] = useState<Set<string>>(
    new Set(members.map((m) => m.user_id))
  );
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [open, setOpen] = useState(false);

  function toggleAttendee(userId: string) {
    setAttendees((prev) => {
      const next = new Set(prev);
      if (next.has(userId)) {
        next.delete(userId);
      } else {
        next.add(userId);
      }
      return next;
    });
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError("");

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data: checkIn, error: insertError } = await supabase
      .from("check_ins")
      .insert({
        group_id: groupId,
        created_by: user.id,
        meeting_date: meetingDate,
        location: location.trim() || null,
        duration,
      })
      .select("id")
      .single();

    if (insertError) {
      setError(
        insertError.code === "23505"
          ? t("duplicateError")
          : t("genericError")
      );
      setSaving(false);
      return;
    }

    // Insert attendees
    if (attendees.size > 0) {
      await supabase.from("check_in_attendees").insert(
        Array.from(attendees).map((userId) => ({
          check_in_id: checkIn.id,
          user_id: userId,
        }))
      );
    }

    setSaving(false);
    setOpen(false);
    router.refresh();
  }

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="rounded-md bg-amber-600 px-4 py-2 text-sm font-medium text-stone-900 hover:bg-amber-500 dark:bg-amber-500 dark:text-stone-900 dark:hover:bg-amber-400"
      >
        {t("recordMeeting")}
      </button>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4 rounded-md border border-stone-200 p-4 dark:border-stone-700"
    >
      <h3 className="font-semibold text-stone-900 dark:text-stone-100">
        {t("recordMeeting")}
      </h3>

      {error && (
        <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
      )}

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="mb-1 block text-sm font-medium text-stone-700 dark:text-stone-300">
            {t("date")}
          </label>
          <input
            type="date"
            value={meetingDate}
            onChange={(e) => setMeetingDate(e.target.value)}
            min={minDate}
            max={today}
            className="w-full rounded-md border border-stone-300 bg-white px-3 py-2 text-stone-900 dark:border-stone-600 dark:bg-stone-800 dark:text-stone-100"
          />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-stone-700 dark:text-stone-300">
            {t("duration")}
          </label>
          <select
            value={duration}
            onChange={(e) => setDuration(Number(e.target.value))}
            className="w-full rounded-md border border-stone-300 bg-white px-3 py-2 text-stone-900 dark:border-stone-600 dark:bg-stone-800 dark:text-stone-100"
          >
            {DURATION_OPTIONS.map((d) => (
              <option key={d} value={d}>
                {d >= 60
                  ? `${Math.floor(d / 60)}h${d % 60 > 0 ? ` ${d % 60}m` : ""}`
                  : `${d}m`}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium text-stone-700 dark:text-stone-300">
          {t("location")}
        </label>
        <input
          type="text"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          placeholder={t("locationPlaceholder")}
          className="w-full rounded-md border border-stone-300 bg-white px-3 py-2 text-stone-900 dark:border-stone-600 dark:bg-stone-800 dark:text-stone-100"
        />
      </div>

      <div>
        <label className="mb-2 block text-sm font-medium text-stone-700 dark:text-stone-300">
          {t("attendees")}
        </label>
        <div className="space-y-2">
          {members.map((member) => (
            <label key={member.user_id} className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={attendees.has(member.user_id)}
                onChange={() => toggleAttendee(member.user_id)}
                className="rounded"
              />
              <span className="text-sm text-stone-700 dark:text-stone-300">
                {member.profiles?.display_name ?? "Member"}
              </span>
            </label>
          ))}
        </div>
      </div>

      <div className="flex gap-2">
        <button
          type="submit"
          disabled={saving}
          className="rounded-md bg-amber-600 px-4 py-2 text-sm font-medium text-stone-900 hover:bg-amber-500 disabled:opacity-50 dark:bg-amber-500 dark:text-stone-900 dark:hover:bg-amber-400"
        >
          {saving ? t("saving") : t("save")}
        </button>
        <button
          type="button"
          onClick={() => setOpen(false)}
          className="rounded-md border border-stone-300 px-4 py-2 text-sm font-medium text-stone-700 hover:bg-stone-100 dark:border-stone-600 dark:text-stone-300 dark:hover:bg-stone-800"
        >
          {t("cancel")}
        </button>
      </div>
    </form>
  );
}
