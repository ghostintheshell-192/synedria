#!/bin/bash
# Standard automation entry point (ADR-012): apply auto-fixes.
# Contract: runs from repo root; no args = fix all sources; with args =
# fix only the given files. Backed by ESLint --fix (no separate formatter yet).
set -euo pipefail

cd "$(git rev-parse --show-toplevel)"

if [[ $# -gt 0 ]]; then
    CANDIDATES=()
    for file in "$@"; do
        [[ "$file" =~ \.(ts|tsx|js|jsx|mjs|cjs)$ ]] || continue
        [[ -f "$file" ]] || continue
        CANDIDATES+=("$file")
    done
    if [[ ${#CANDIDATES[@]} -eq 0 ]]; then
        echo "format-fix: no lint-relevant files, nothing to do (no-op)"
        exit 0
    fi
    npx eslint --fix "${CANDIDATES[@]}"
else
    npm run lint -- --fix
fi

echo "format-fix: done"
