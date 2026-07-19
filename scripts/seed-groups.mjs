// Seed local test groups linked to catalog certifications (dev only).
//
// Exercises the three FR-10a title-derivation cases (custom name only; custom
// name + certification; certification only → derived title) so the logged-in
// area and group pages can be tested visually before the group-creation form
// (increment #4) exists. Local-only, gated by a loopback-URL check. Idempotent
// by slug.
//
// Prereqs: run seed-users.mjs first (referents come from those accounts) and
// have the certification catalog seeded (migration + seed).
//
// Usage (from the repo root):
//   node --env-file=.env.development.local scripts/seed-groups.mjs

import { createClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const secretKey = process.env.SUPABASE_SECRET_KEY;

if (!url || !secretKey) {
  console.error("Missing env. Run with: node --env-file=.env.development.local scripts/seed-groups.mjs");
  process.exit(1);
}

if (!/^https?:\/\/(127\.0\.0\.1|localhost)(:|\/|$)/.test(url)) {
  console.error(`Refusing to run against a non-local URL: ${url}\nThis script is local-only by design.`);
  process.exit(1);
}

// Each entry covers a title-derivation case (FR-10a). name=null relies on the
// linked certification for the displayed title; the DB CHECK constraint
// (name OR certification_id) makes name=null legal only when a cert is set.
const GROUPS = [
  {
    slug: "rust-serale-milano",
    name: "Rust serale a Milano",
    cert: null, // case 1: custom name only
    referent: "aurora@test.local",
    skill_tag: "rust",
    city: "Milano",
    preferred_format: "in_person",
    entry_mode: "open",
    objective: "Impariamo Rust la sera, di persona, un capitolo alla volta.",
  },
  {
    slug: "aws-saa-milano",
    name: "Prepariamo l'AWS SAA",
    cert: "aws-solutions-architect-associate", // case 2: custom name + cert
    referent: "diego@test.local",
    skill_tag: "aws",
    city: "Milano",
    preferred_format: "hybrid",
    entry_mode: "approval",
    objective: "Gruppo di studio per il Solutions Architect – Associate.",
  },
  {
    slug: "comptia-security-plus",
    name: null, // case 3: certification only → derived title
    cert: "comptia-security-plus",
    referent: "sofia@test.local",
    skill_tag: "security",
    city: "Monza",
    preferred_format: "in_person",
    entry_mode: "open",
    objective: "Prepariamo la Security+ insieme, con quiz settimanali.",
  },
  {
    slug: "claude-developer-foundations",
    name: null, // case 3 again → derived title
    cert: "claude-certified-developer-foundations",
    referent: "luca@test.local",
    skill_tag: "claude",
    city: "Milano",
    preferred_format: "in_person",
    entry_mode: "open",
    objective: "Studio della Claude Certified Developer – Foundations.",
  },
];

const admin = createClient(url, secretKey, {
  auth: { autoRefreshToken: false, persistSession: false },
});

// Resolve referents (email → id) and certifications (slug → id).
const { data: userList, error: userErr } = await admin.auth.admin.listUsers();
if (userErr) {
  console.error(`Could not list users: ${userErr.message}`);
  process.exit(1);
}
const idByEmail = new Map(userList.users.map((u) => [u.email, u.id]));

const { data: certs, error: certErr } = await admin.from("certifications").select("id, slug");
if (certErr) {
  console.error(`Could not read certifications: ${certErr.message}`);
  process.exit(1);
}
const idBySlug = new Map((certs ?? []).map((c) => [c.slug, c.id]));

// Existing slugs → idempotency.
const { data: existing } = await admin.from("groups").select("slug");
const existingSlugs = new Set((existing ?? []).map((g) => g.slug));

let created = 0;
let skipped = 0;

for (const g of GROUPS) {
  if (existingSlugs.has(g.slug)) {
    console.log(`skip   ${g.slug} (already exists)`);
    skipped++;
    continue;
  }

  const createdBy = idByEmail.get(g.referent);
  if (!createdBy) {
    console.error(`ERROR  ${g.slug}: referent ${g.referent} not found — run seed-users.mjs first`);
    process.exitCode = 1;
    continue;
  }

  const certId = g.cert ? idBySlug.get(g.cert) : null;
  if (g.cert && !certId) {
    console.error(`ERROR  ${g.slug}: certification "${g.cert}" not in catalog`);
    process.exitCode = 1;
    continue;
  }

  const { data: inserted, error: gErr } = await admin
    .from("groups")
    .insert({
      name: g.name,
      slug: g.slug,
      skill_tag: g.skill_tag,
      objective: g.objective,
      city: g.city,
      preferred_format: g.preferred_format,
      entry_mode: g.entry_mode,
      status: "open",
      progress_mode: "accumulation",
      is_indexable: true,
      created_by: createdBy,
      certification_id: certId,
    })
    .select("id")
    .single();

  if (gErr) {
    console.error(`ERROR  ${g.slug}: ${gErr.message}`);
    process.exitCode = 1;
    continue;
  }

  // Seat the creator as referent, so the group is complete for the join flow.
  const { error: mErr } = await admin
    .from("group_members")
    .insert({ group_id: inserted.id, user_id: createdBy, role: "referent" });
  if (mErr) {
    console.error(`WARN   ${g.slug}: referent membership failed — ${mErr.message}`);
  }

  console.log(`create ${g.slug}  → title: "${g.name ?? "(derived from certification)"}"`);
  created++;
}

console.log(`\nDone. created=${created} skipped=${skipped}`);
