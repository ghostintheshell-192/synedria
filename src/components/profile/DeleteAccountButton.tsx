"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { createClient } from "@/lib/supabase/client";

export default function DeleteAccountButton() {
  const t = useTranslations("profile");
  const router = useRouter();
  const supabase = createClient();

  const [showConfirm, setShowConfirm] = useState(false);
  const [confirmText, setConfirmText] = useState("");
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState("");

  const confirmWord = t("deleteConfirmWord");

  async function handleDelete() {
    setDeleting(true);
    setError("");

    const res = await fetch("/api/account", { method: "DELETE" });

    if (!res.ok) {
      const data = await res.json();
      if (data.error === "referent_of_open_groups") {
        setError(t("deleteErrorReferent"));
      } else {
        setError(t("deleteErrorGeneric"));
      }
      setDeleting(false);
      return;
    }

    await supabase.auth.signOut();
    router.push("/");
  }

  if (!showConfirm) {
    return (
      <button
        onClick={() => setShowConfirm(true)}
        className="text-sm text-red-600 underline hover:text-red-800 dark:text-red-400 dark:hover:text-red-300"
      >
        {t("deleteAccount")}
      </button>
    );
  }

  return (
    <div className="rounded-md border border-red-300 bg-red-50 p-4 dark:border-red-800 dark:bg-red-950">
      <p className="mb-3 text-sm font-medium text-red-800 dark:text-red-200">
        {t("deleteWarning")}
      </p>
      <p className="mb-3 text-sm text-red-600 dark:text-red-400">
        {t("deleteConfirmPrompt", { word: confirmWord })}
      </p>
      <input
        type="text"
        value={confirmText}
        onChange={(e) => setConfirmText(e.target.value)}
        placeholder={confirmWord}
        className="mb-3 w-full rounded-md border border-red-300 bg-white px-3 py-2 text-sm text-stone-900 dark:border-red-700 dark:bg-stone-800 dark:text-stone-100"
      />
      {error && (
        <p className="mb-3 text-sm text-red-600 dark:text-red-400">{error}</p>
      )}
      <div className="flex gap-3">
        <button
          onClick={handleDelete}
          disabled={confirmText !== confirmWord || deleting}
          className="rounded-md bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 disabled:opacity-50 dark:bg-red-700 dark:hover:bg-red-600"
        >
          {deleting ? t("deleteDeleting") : t("deleteConfirmButton")}
        </button>
        <button
          onClick={() => {
            setShowConfirm(false);
            setConfirmText("");
            setError("");
          }}
          className="rounded-md border border-stone-300 px-4 py-2 text-sm text-stone-600 hover:bg-stone-100 dark:border-stone-600 dark:text-stone-400 dark:hover:bg-stone-800"
        >
          {t("cancel")}
        </button>
      </div>
    </div>
  );
}
