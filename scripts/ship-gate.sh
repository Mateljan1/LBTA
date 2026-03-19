#!/usr/bin/env bash
# LBTA ship gate: run before claiming "done" / "deployed" / "shipped".
# Fails if build, lint, tests fail, or if tracked files have uncommitted changes.
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

echo "==> quality-gate (build + lint)"
npm run quality-gate

echo "==> tests"
npm test

if ! git diff --quiet || ! git diff --cached --quiet; then
  echo ""
  echo "SHIP GATE FAILED: Tracked files have uncommitted changes."
  echo "Commit (or intentionally stash) before claiming shipped. Untracked files are ignored."
  git status --short
  exit 1
fi

echo ""
echo "Ship gate OK: build, lint, tests passed; no uncommitted changes to tracked files."
echo "Next: git push origin main (if not already), then confirm Vercel production = this commit SHA."
