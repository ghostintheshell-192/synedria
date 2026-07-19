import { getTranslations } from "next-intl/server";

export type CertificationBadgeData = {
  name: string;
  issuerName: string;
  logoUrl?: string | null;
};

/**
 * Shows a group's linked certification (FR-11): certification name + issuer,
 * with the curated issuer logo where available (a graduation glyph stands in
 * until issuer logos are curated, increment #2). Two variants: `prominent` for
 * the group page header, `compact` for search/list cards.
 */
export default async function CertificationBadge({
  cert,
  variant = "compact",
  titleDerived = false,
}: {
  cert: CertificationBadgeData;
  variant?: "prominent" | "compact";
  /**
   * When the group title is already the certification name (FR-10a derived
   * title), the badge shows only the issuer to avoid repeating the name; the
   * full name still reaches assistive tech via aria-label.
   */
  titleDerived?: boolean;
}) {
  const t = await getTranslations("groups");
  const label = t("certification");
  const ariaLabel = `${label}: ${cert.name} — ${cert.issuerName}`;

  if (variant === "prominent") {
    return (
      <div
        className="inline-flex items-center gap-3 rounded-lg border border-amber-300 bg-amber-50 px-4 py-2 dark:border-amber-800/60 dark:bg-amber-950/30"
        aria-label={ariaLabel}
      >
        {cert.logoUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={cert.logoUrl}
            alt={cert.issuerName}
            className="h-10 w-10 shrink-0 object-contain"
          />
        ) : (
          <span aria-hidden className="text-2xl">
            🎓
          </span>
        )}
        <span className="min-w-0">
          {titleDerived ? (
            <span className="block font-medium text-stone-900 dark:text-stone-100">
              {cert.issuerName}
            </span>
          ) : (
            <>
              <span className="block font-medium text-stone-900 dark:text-stone-100">
                {cert.name}
              </span>
              <span className="block text-sm text-stone-600 dark:text-stone-400">
                {cert.issuerName}
              </span>
            </>
          )}
        </span>
      </div>
    );
  }

  return (
    <span
      className="inline-flex items-center gap-1.5 text-sm text-stone-600 dark:text-stone-400"
      aria-label={ariaLabel}
    >
      {cert.logoUrl ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={cert.logoUrl}
          alt={cert.issuerName}
          className="h-4 w-4 shrink-0 object-contain"
        />
      ) : (
        <span aria-hidden>🎓</span>
      )}
      <span className="truncate">
        {titleDerived ? cert.issuerName : `${cert.name} · ${cert.issuerName}`}
      </span>
    </span>
  );
}
