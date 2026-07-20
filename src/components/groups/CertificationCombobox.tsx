"use client";

import { useEffect, useId, useRef, useState } from "react";
import { useTranslations } from "next-intl";

export type CertOption = {
  id: string;
  name: string;
  issuerName: string;
};

/**
 * Searchable single-select for the certification catalog. Filters the (small)
 * active-certification list locally by certification name or issuer name.
 * Controlled by the parent via `value` (the selected certification id) and
 * `onChange`; the empty state is a plain search input, the selected state a
 * clearable chip. Validation lives in the form, not here.
 */
export default function CertificationCombobox({
  options,
  value,
  onChange,
}: {
  options: CertOption[];
  value: string | null;
  onChange: (id: string | null) => void;
}) {
  const t = useTranslations("groups");
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [highlight, setHighlight] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const listboxId = useId();

  const selected = options.find((o) => o.id === value) ?? null;

  const q = query.trim().toLowerCase();
  const filtered = q
    ? options.filter(
        (o) =>
          o.name.toLowerCase().includes(q) ||
          o.issuerName.toLowerCase().includes(q),
      )
    : options;

  useEffect(() => {
    function onDocClick(e: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, []);

  function choose(opt: CertOption) {
    onChange(opt.id);
    setQuery("");
    setOpen(false);
  }

  function clear() {
    onChange(null);
    setQuery("");
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setOpen(true);
      setHighlight((h) => Math.min(h + 1, filtered.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setHighlight((h) => Math.max(h - 1, 0));
    } else if (e.key === "Enter") {
      if (open && filtered[highlight]) {
        e.preventDefault();
        choose(filtered[highlight]);
      }
    } else if (e.key === "Escape") {
      setOpen(false);
    }
  }

  // Selected state: a clearable chip instead of the search input.
  if (selected) {
    return (
      <div className="flex items-center justify-between gap-2 rounded-md border border-stone-300 bg-white px-3 py-2 dark:border-stone-600 dark:bg-stone-800">
        <span className="text-stone-900 dark:text-stone-100">
          <span className="text-stone-500 dark:text-stone-400">
            {selected.issuerName}
          </span>{" "}
          — {selected.name}
        </span>
        <button
          type="button"
          onClick={clear}
          aria-label={t("certificationClear")}
          className="shrink-0 rounded px-2 text-lg leading-none text-stone-500 hover:text-stone-800 dark:text-stone-400 dark:hover:text-stone-100"
        >
          ×
        </button>
      </div>
    );
  }

  return (
    <div ref={containerRef} className="relative">
      <input
        type="text"
        role="combobox"
        aria-expanded={open}
        aria-controls={listboxId}
        aria-autocomplete="list"
        value={query}
        placeholder={t("certificationSearchPlaceholder")}
        onChange={(e) => {
          setQuery(e.target.value);
          setOpen(true);
          setHighlight(0);
        }}
        onFocus={() => setOpen(true)}
        onKeyDown={handleKeyDown}
        className="w-full rounded-md border border-stone-300 bg-white px-3 py-2 text-stone-900 dark:border-stone-600 dark:bg-stone-800 dark:text-stone-100"
      />

      {open && (
        <ul
          id={listboxId}
          role="listbox"
          className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md border border-stone-300 bg-white py-1 shadow-lg dark:border-stone-600 dark:bg-stone-800"
        >
          {filtered.length === 0 ? (
            <li className="px-3 py-2 text-sm text-stone-500 dark:text-stone-400">
              {t("certificationNoMatch")}
            </li>
          ) : (
            filtered.map((opt, i) => (
              <li
                key={opt.id}
                role="option"
                aria-selected={i === highlight}
                onMouseEnter={() => setHighlight(i)}
                onMouseDown={(e) => {
                  // mousedown (not click) so it fires before input blur closes the list
                  e.preventDefault();
                  choose(opt);
                }}
                className={`cursor-pointer px-3 py-2 text-sm ${
                  i === highlight
                    ? "bg-amber-100 dark:bg-amber-900/40"
                    : ""
                } text-stone-900 dark:text-stone-100`}
              >
                <span className="text-stone-500 dark:text-stone-400">
                  {opt.issuerName}
                </span>{" "}
                — {opt.name}
              </li>
            ))
          )}
        </ul>
      )}
    </div>
  );
}
