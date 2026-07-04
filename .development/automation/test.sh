#!/bin/bash
# Standard automation entry point (ADR-012): run the test suite.
# Contract: runs from repo root; no args = all tests; exit != 0 = failures.
# "No tests configured" is a declared no-op (exit 0), not an error.
set -euo pipefail

cd "$(git rev-parse --show-toplevel)"

# No test runner wired yet (no "test" script in package.json). Declared no-op
# so hooks and CI stay green; replace the guard once a runner is added.
if ! node -e "process.exit(require('./package.json').scripts?.test ? 0 : 1)" 2>/dev/null; then
    echo "test: no test runner configured yet (no-op)"
    exit 0
fi

npm test
echo "test: OK"
