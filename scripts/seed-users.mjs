// Seed local test users via the Supabase admin API (service role).
//
// LOCAL DEVELOPMENT ONLY. Creates confirmed email/password accounts so we can
// log in locally without OAuth — email/password is a dev tool, never a prod
// login method. A hard guard below refuses to run against anything but a
// loopback Supabase URL, so this can never seed fake users into production.
//
// Usage (from the repo root):
//   node --env-file=.env.development.local scripts/seed-users.mjs
//
// Idempotent: re-running skips users that already exist. The password is shared
// and intentionally trivial — it only ever protects a local throwaway database.

import { createClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const secretKey = process.env.SUPABASE_SECRET_KEY;

if (!url || !secretKey) {
  console.error(
    "Missing env. Run with: node --env-file=.env.development.local scripts/seed-users.mjs"
  );
  process.exit(1);
}

// Safety gate: only ever touch a local Supabase. This is what makes it safe to
// create pre-confirmed email/password users at all.
if (!/^https?:\/\/(127\.0\.0\.1|localhost)(:|\/|$)/.test(url)) {
  console.error(
    `Refusing to seed users against a non-local URL: ${url}\n` +
      "This script is local-only by design."
  );
  process.exit(1);
}

const DEV_PASSWORD = "synedria-dev";

// Milan/Lombardy launch area, in_person preference — realistic enough to
// exercise the group flows (referent + members are assigned at group level).
const TEST_USERS = [
  { email: "aurora@test.local", fullName: "Aurora Bianchi", city: "Milano", format: "in_person" },
  { email: "diego@test.local",  fullName: "Diego Ferrari",  city: "Milano", format: "in_person" },
  { email: "sofia@test.local",  fullName: "Sofia Greco",    city: "Monza",  format: "hybrid" },
  { email: "luca@test.local",   fullName: "Luca Rinaldi",   city: "Milano", format: "in_person" },
  { email: "giada@test.local",  fullName: "Giada Moretti",  city: "Bergamo", format: "online" },
];

const admin = createClient(url, secretKey, {
  auth: { autoRefreshToken: false, persistSession: false },
});

let created = 0;
let skipped = 0;

for (const u of TEST_USERS) {
  const { data, error } = await admin.auth.admin.createUser({
    email: u.email,
    password: DEV_PASSWORD,
    email_confirm: true,
    user_metadata: { full_name: u.fullName },
  });

  if (error) {
    // Supabase reports an existing email with a stable code; treat as skip.
    if (error.code === "email_exists" || /already been registered/i.test(error.message)) {
      console.log(`skip   ${u.email} (already exists)`);
      skipped++;
      continue;
    }
    console.error(`ERROR  ${u.email}: ${error.message}`);
    process.exitCode = 1;
    continue;
  }

  // handle_new_user() already inserted the profiles row (id + display_name);
  // enrich it with fields the trigger doesn't set.
  const { error: profileError } = await admin
    .from("profiles")
    .update({ city: u.city, preferred_format: u.format, preferred_locale: "it" })
    .eq("id", data.user.id);

  if (profileError) {
    console.error(`WARN   ${u.email}: profile enrich failed — ${profileError.message}`);
  }

  console.log(`create ${u.email}  (${u.fullName})`);
  created++;
}

console.log(`\nDone. created=${created} skipped=${skipped} password="${DEV_PASSWORD}"`);
