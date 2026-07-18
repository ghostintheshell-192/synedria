import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: NextRequest) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const { action, requestId, groupId } = body;

  // Verify user is referent of this group
  const { data: membership } = await supabase
    .from("group_members")
    .select("role")
    .eq("group_id", groupId)
    .eq("user_id", user.id)
    .single();

  if (!membership || membership.role !== "referent") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  if (action === "approve") {
    // Get the request
    const { data: joinRequest } = await supabase
      .from("join_requests")
      .select("applicant_id, personal_objective")
      .eq("id", requestId)
      .eq("group_id", groupId)
      .eq("status", "pending")
      .single();

    if (!joinRequest) {
      return NextResponse.json({ error: "Request not found" }, { status: 404 });
    }

    // Check member limit
    const { count } = await supabase
      .from("group_members")
      .select("*", { count: "exact", head: true })
      .eq("group_id", groupId);

    if ((count ?? 0) >= 8) {
      return NextResponse.json({ error: "Group is full" }, { status: 400 });
    }

    // Add as member
    await supabase.from("group_members").insert({
      group_id: groupId,
      user_id: joinRequest.applicant_id,
      role: "member",
      personal_objective: joinRequest.personal_objective,
    });

    // Update request status
    await supabase
      .from("join_requests")
      .update({
        status: "approved",
        resolved_at: new Date().toISOString(),
        resolved_by: user.id,
      })
      .eq("id", requestId)
      .eq("group_id", groupId);

    return NextResponse.json({ success: true });
  }

  if (action === "reject") {
    await supabase
      .from("join_requests")
      .update({
        status: "rejected",
        resolved_at: new Date().toISOString(),
        resolved_by: user.id,
      })
      .eq("id", requestId)
      .eq("group_id", groupId);

    return NextResponse.json({ success: true });
  }

  return NextResponse.json({ error: "Invalid action" }, { status: 400 });
}
