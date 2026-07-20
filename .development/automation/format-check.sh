#!/bin/bash
# Standard automation entry point (ADR-012): verify code formatting/linting.
# Contract: runs from repo root; no args = check all sources; with args =
# check only the given files (non-source files are ignored).
# Exit != 0 = at least one issue. This project gates on ESLint (no separate
# formatter yet — see coding-standards.md); wire Prettier here if adopted.
set -euo pipefail

cd "$(git rev-parse --show-toplevel)"

# Select candidate files: args if given, otherwise let eslint use its config.
if [[ $# -gt 0 ]]; then
    CANDIDATES=()
    for file in "$@"; do
        [[ "$file" =~ \.(ts|tsx|js|jsx|mjs|cjs)$ ]] || continue
        [[ -f "$file" ]] || continue
        CANDIDATES+=("$file")
    done
    # Nothing lint-relevant staged: declared no-op.
    if [[ ${#CANDIDATES[@]} -eq 0 ]]; then
        echo "format-check: no lint-relevant files, nothing to do (no-op)"
        exit 0
    fi
    npx eslint "${CANDIDATES[@]}"
else
    npm run lint
fi

echo "format-check: OK"
