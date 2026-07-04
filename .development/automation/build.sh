#!/bin/bash
# Standard automation entry point (ADR-012): build the project.
# Contract: runs from repo root; no args = full build; exit != 0 = failure.
# All stack-specific knowledge (Next.js, npm) lives HERE, not in hooks/CI.
set -euo pipefail

cd "$(git rev-parse --show-toplevel)"

npm run build

echo "build: OK"
