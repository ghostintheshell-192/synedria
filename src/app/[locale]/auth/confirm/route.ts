import { NextRequest, NextResponse } from "next/server";
import { type EmailOtpType } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/server";

// Confirms an email OTP / magic-link token and establishes the session.
//
// Unlike /auth/callback (OAuth PKCE code exchange, which needs the browser-side
// verifier from the login it started), verifyOtp validates a self-contained
// token_hash and needs no verifier. That makes it the right path for links
// minted server-side: the local dev fast-login script today, and — should we
// add them — email confirmation / password recovery in production. No UI.
export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);
  const tokenHash = searchParams.get("token_hash");
  const type = searchParams.get("type") as EmailOtpType | null;
  const locale = request.nextUrl.pathname.split("/")[1];

  if (tokenHash && type) {
    const supabase = await createClient();
    const { error } = await supabase.auth.verifyOtp({ type, token_hash: tokenHash });
    if (!error) {
      return NextResponse.redirect(`${origin}/${locale}`);
    }
  }

  return NextResponse.redirect(`${origin}/${locale}`);
}
