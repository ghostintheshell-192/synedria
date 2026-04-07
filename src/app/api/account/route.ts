import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

export async function DELETE() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Check if user is sole referent of any open group
  const { data: referentGroups } = await supabase
    .from("group_members")
    .select("group_id, groups(status)")
    .eq("user_id", user.id)
    .eq("role", "referent");

  const openReferentGroups = referentGroups?.filter(
    (gm) => (gm.groups as unknown as { status: string })?.status === "open"
  );

  if (openReferentGroups && openReferentGroups.length > 0) {
    return NextResponse.json(
      { error: "referent_of_open_groups" },
      { status: 409 }
    );
  }

  // Delete user via Admin API — cascades handle the rest
  const admin = createAdminClient();
  const { error } = await admin.auth.admin.deleteUser(user.id);

  if (error) {
    return NextResponse.json(
      { error: "deletion_failed" },
      { status: 500 }
    );
  }

  return NextResponse.json({ success: true });
}
