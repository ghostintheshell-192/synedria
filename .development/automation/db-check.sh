#!/bin/bash
# Standard automation entry point (ADR-012): verify the hosted database schema
# matches supabase/migrations/.
# Contract: runs from repo root; no args; exit != 0 = local and remote disagree.
# Stack-specific (Supabase CLI) knowledge lives HERE.
#
# Requires in the environment:
#   SUPABASE_ACCESS_TOKEN   personal access token (secret)
#   SUPABASE_DB_PASSWORD    database password, consumed by `link` (secret)
#   SUPABASE_PROJECT_REF    project ref, e.g. from the project URL (not secret)
#
# Read-only counterpart to db-push.sh: it inspects and reports, never mutates.
# The point is to fail a deploy *before* it ships against a schema that lacks the
# columns the code expects. That is the failure mode of 2026-07-20, when
# profiles.preferred_locale was missing in production and PostgREST rejected
# every profile save for weeks with nothing to show for it
# (see .development/tech-debt/production-schema-untracked.md).
set -euo pipefail

cd "$(git rev-parse --show-toplevel)"

: "${SUPABASE_ACCESS_TOKEN:?missing SUPABASE_ACCESS_TOKEN}"
: "${SUPABASE_DB_PASSWORD:?missing SUPABASE_DB_PASSWORD}"
: "${SUPABASE_PROJECT_REF:?missing SUPABASE_PROJECT_REF}"

npx supabase link --project-ref "$SUPABASE_PROJECT_REF"

echo "--- migration state ---"
# Captured as well as printed: the table is the diagnostic a failed run leaves
# behind, and it is also what we parse below.
migration_table=$(npx supabase migration list)
echo "$migration_table"

# `migration list` prints a three-column table: LOCAL | REMOTE | TIME. A version
# in one column but not the other is a gap. Both directions matter and they mean
# different things, so they are reported separately rather than as one count.
pending=$(
  echo "$migration_table" |
    awk -F'|' 'NF >= 3 {
      gsub(/[ \t]/, "", $1); gsub(/[ \t]/, "", $2)
      if ($1 ~ /^[0-9]+$/ && $2 == "") print $1
    }'
)

untracked=$(
  echo "$migration_table" |
    awk -F'|' 'NF >= 3 {
      gsub(/[ \t]/, "", $1); gsub(/[ \t]/, "", $2)
      if ($2 ~ /^[0-9]+$/ && $1 == "") print $2
    }'
)

status=0

if [ -n "$pending" ]; then
  echo
  echo "db-check: FAIL — migrations exist locally but are not applied remotely:"
  echo "$pending" | sed 's/^/  /'
  echo "  Deploying this commit would run code against a schema that lacks them."
  echo "  Apply them with .development/automation/db-push.sh"
  status=1
fi

if [ -n "$untracked" ]; then
  echo
  echo "db-check: FAIL — migrations are applied remotely but absent locally:"
  echo "$untracked" | sed 's/^/  /'
  echo "  The database has changes this repo cannot reproduce. Someone applied SQL"
  echo "  outside the CLI, or a migration file was deleted after being applied."
  status=1
fi

if [ "$status" -eq 0 ]; then
  echo
  echo "db-check: OK — local migrations and remote schema agree"
fi

exit "$status"
