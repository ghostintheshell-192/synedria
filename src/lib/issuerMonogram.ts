/**
 * Fallback tile identity for a certification issuer that has no curated logo
 * asset yet (increment #2). The badge renders a small square, so an issuer's
 * horizontal wordmark would be illegible at 16px; a short monogram on a
 * deterministic colored tile stays a recognizable brand anchor at every size.
 * This intentionally uses the issuer *name* (initials), never its logo, so it
 * carries no trademark-artwork concern for issuers we haven't cleared/sourced.
 */

const STOPWORDS = new Set(["the", "of", "and", "for", "a"]);

/**
 * Derive a 1–3 char monogram from an issuer display name. Multi-word names take
 * the initial of each significant word ("The Linux Foundation" → "LF");
 * single-word names take the first two letters ("Oracle" → "OR"), or up to
 * three when the name is already an acronym ("(ISC)²" → "ISC").
 */
export function issuerMonogram(name: string): string {
  const cleaned = name
    .replace(/\.(org|com|io|net)\b/gi, "") // drop TLDs: "Scrum.org" → "Scrum"
    .replace(/[^\p{L}\s]/gu, " "); // drop punctuation/superscripts: "(ISC)²" → "ISC"
  const words = cleaned
    .split(/\s+/)
    .filter((w) => w && !STOPWORDS.has(w.toLowerCase()));

  if (words.length === 0) return "?";
  if (words.length === 1) {
    const w = words[0];
    const isAcronym = w === w.toUpperCase();
    return w.slice(0, isAcronym ? 3 : 2).toUpperCase();
  }
  return words
    .slice(0, 3)
    .map((w) => w[0])
    .join("")
    .toUpperCase();
}

// Full literal class strings so Tailwind's JIT can see them; each pair is tuned
// for both light and dark. Amber is deliberately omitted — the prominent badge
// already sits on an amber background.
const TILE_COLORS = [
  "bg-sky-100 text-sky-800 dark:bg-sky-500/20 dark:text-sky-200",
  "bg-emerald-100 text-emerald-800 dark:bg-emerald-500/20 dark:text-emerald-200",
  "bg-violet-100 text-violet-800 dark:bg-violet-500/20 dark:text-violet-200",
  "bg-rose-100 text-rose-800 dark:bg-rose-500/20 dark:text-rose-200",
  "bg-teal-100 text-teal-800 dark:bg-teal-500/20 dark:text-teal-200",
  "bg-indigo-100 text-indigo-800 dark:bg-indigo-500/20 dark:text-indigo-200",
];

/**
 * Pick a stable tile color for an issuer, derived from its name so the same
 * issuer always gets the same color without any stored configuration.
 */
export function issuerTileColor(name: string): string {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = (hash * 31 + name.charCodeAt(i)) | 0;
  }
  return TILE_COLORS[Math.abs(hash) % TILE_COLORS.length];
}
