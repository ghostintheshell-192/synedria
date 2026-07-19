import type { SupabaseClient } from "@supabase/supabase-js";
import type { CertOption } from "@/components/groups/CertificationCombobox";

/**
 * Active certifications from active issuers (FR-7, FR-15), shaped for the
 * CertificationCombobox and sorted by issuer then name. Shared by the group
 * creation form and the search filter so the query lives in one place.
 *
 * The nested issuer relation is typed as an array by supabase-js (the untyped
 * client, see tech-debt), so it is normalized with a cast here.
 */
export async function getActiveCertifications(
  supabase: SupabaseClient,
): Promise<CertOption[]> {
  const { data } = await supabase
    .from("certifications")
    .select("id, name, issuer:issuer_id!inner(name, is_active)")
    .eq("is_active", true)
    .eq("issuer.is_active", true)
    .order("name");

  return (
    (data ?? []) as unknown as {
      id: string;
      name: string;
      issuer: { name: string } | null;
    }[]
  )
    .map((c) => ({
      id: c.id,
      name: c.name,
      issuerName: c.issuer?.name ?? "",
    }))
    .sort(
      (a, b) =>
        a.issuerName.localeCompare(b.issuerName) || a.name.localeCompare(b.name),
    );
}
