// Generate a one-time login link for a local test user (dev only).
//
// Uses the Supabase admin API to mint a magic-link token, then builds a URL to
// the app's /auth/confirm route. That route uses verifyOtp, which needs no
// browser-side PKCE verifier — so a link generated out-of-band (here, by this
// script) works, whereas the OAuth /auth/callback code exchange would not.
// Open the printed URL in the browser to sign in as that user. No login form is
// added to the app; the front-end stays identical to production.
//
// The token is single-use and short-lived: re-run this to get a fresh link.
//
// Usage (from the repo root):
//   node --env-file=.env.development.local scripts/dev-login.mjs [email] [locale]
//   defaults: email=aurora@test.local  locale=it

import { createClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const secretKey = process.env.SUPABASE_SECRET_KEY;
const appUrl = process.env.APP_URL ?? "http://localhost:3000";

if (!url || !secretKey) {
  console.error(
    "Missing env. Run with: node --env-file=.env.development.local scripts/dev-login.mjs [email] [locale]"
  );
  process.exit(1);
}

// Same safety gate as the seed script: only ever touch a local Supabase.
if (!/^https?:\/\/(127\.0\.0\.1|localhost)(:|\/|$)/.test(url)) {
  console.error(`Refusing to run against a non-local URL: ${url}\nThis script is local-only by design.`);
  process.exit(1);
}

const email = process.argv[2] ?? "aurora@test.local";
const locale = process.argv[3] ?? "it";

const admin = createClient(url, secretKey, {
  auth: { autoRefreshToken: false, persistSession: false },
});

const { data, error } = await admin.auth.admin.generateLink({ type: "magiclink", email });

if (error) {
  console.error(`Could not generate a link for ${email}: ${error.message}`);
  process.exit(1);
}

const tokenHash = data.properties?.hashed_token;
if (!tokenHash) {
  console.error("No hashed_token in the response — cannot build the login link.");
  process.exit(1);
}

const loginUrl = `${appUrl}/${locale}/auth/confirm?token_hash=${tokenHash}&type=magiclink`;

console.log(`\nLogin as ${email} — open this URL in your browser:\n\n${loginUrl}\n`);
