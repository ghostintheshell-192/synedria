import { NextRequest } from "next/server";
import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";
import { updateSession } from "./lib/supabase/middleware";

const intlMiddleware = createMiddleware(routing);

export async function proxy(request: NextRequest) {
  const response = await updateSession(request);
  const intlResponse = intlMiddleware(request);

  // Carry the whole cookie across, not just name and value: dropping the
  // options turned refreshed session cookies into session-scoped ones (losing
  // maxAge, secure and sameSite), and — because Supabase chunks large tokens —
  // turned the `maxAge: 0` that removes a leftover chunk into a plain write,
  // leaving an orphan chunk that corrupts the reassembled token.
  response.cookies.getAll().forEach((cookie) => {
    intlResponse.cookies.set(cookie);
  });

  return intlResponse;
}

export const config = {
  matcher: ["/", "/(it|en)/:path*"],
};
