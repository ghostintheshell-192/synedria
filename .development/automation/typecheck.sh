#!/bin/bash
# Standard automation entry point (ADR-012): static type checking.
# Contract: runs from repo root; no args; exit != 0 = type errors.
# Stack-specific (TypeScript, tsc --noEmit) knowledge lives HERE.
set -euo pipefail

cd "$(git rev-parse --show-toplevel)"

npm run typecheck

echo "typecheck: OK"
