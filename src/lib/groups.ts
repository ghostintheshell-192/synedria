/**
 * A group's displayed title is derived, never stored (FR-10a): the custom
 * `name` when set, otherwise the linked certification's name — read live from
 * the catalog, so a certification rename propagates automatically with no
 * stored copy to diverge.
 *
 * The DB CHECK constraint (`name IS NOT NULL OR certification_id IS NOT NULL`)
 * guarantees at least one is present; the empty-string fallback only covers the
 * type-impossible "neither" case, keeping the return type a plain string.
 */
export function deriveGroupTitle(group: {
  name: string | null;
  certification?: { name: string } | null;
}): string {
  return group.name ?? group.certification?.name ?? "";
}
