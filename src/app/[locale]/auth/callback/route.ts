import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const locale = request.nextUrl.pathname.split("/")[1];

  let redirectLocale = locale;

  if (code) {
    const supabase = await createClient();
    await supabase.auth.exchangeCodeForSession(code);

    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      const { data: profile } = await supabase
        .from("profiles")
        .select("preferred_locale")
        .eq("id", user.id)
        .single();

      if (profile?.preferred_locale) {
        redirectLocale = profile.preferred_locale;
      }
    }
  }

  return NextResponse.redirect(`${origin}/${redirectLocale}`);
}