#!/bin/bash
# Standard automation entry point (ADR-012): apply pending migrations to the
# hosted database.
# Contract: runs from repo root; no args; exit != 0 = migrations not applied.
# Stack-specific (Supabase CLI) knowledge lives HERE.
#
# Requires in the environment:
#   SUPABASE_ACCESS_TOKEN   personal access token (secret)
#   SUPABASE_DB_PASSWORD    database password, consumed by `link` and `push` (secret)
#   SUPABASE_PROJECT_REF    project ref, e.g. from the project URL (not secret)
#
# This is destructive-by-nature: it mutates the production schema. It prints the
# local-vs-remote migration table before doing anything, so a failed run leaves a
# log showing exactly what state the database was in. That diagnostic is the
# point — an unlogged schema change is what caused a silent production outage on
# 2026-07-20 (see .development/tech-debt/production-schema-untracked.md).
set -euo pipefail

cd "$(git rev-parse --show-toplevel)"

: "${SUPABASE_ACCESS_TOKEN:?missing SUPABASE_ACCESS_TOKEN}"
: "${SUPABASE_DB_PASSWORD:?missing SUPABASE_DB_PASSWORD}"
: "${SUPABASE_PROJECT_REF:?missing SUPABASE_PROJECT_REF}"

npx supabase link --project-ref "$SUPABASE_PROJECT_REF"

echo "--- migration state before push ---"
npx supabase migration list

echo "--- applying pending migrations ---"
npx supabase db push

echo "--- migration state after push ---"
npx supabase migration list

echo "db-push: OK"
