#!/usr/bin/env bash
# Rollback script for the April 16, 2026 SEO bundle (phone placeholders,
# robots.txt, canonicals, noindex, hero eyebrow test).
#
# Safe to run anytime — re-applies the pre-bundle HEAD (02e5765) via revert
# chain rather than hard reset, so remote history stays linear.
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/../.." && pwd)"
cd "$ROOT"

echo "==> Current HEAD: $(git rev-parse HEAD)"
echo "==> Pre-bundle HEAD: 02e5765"
echo ""

echo "==> Commits that will be reverted (newest first):"
git log --oneline 02e5765..HEAD

echo ""
read -p "Proceed with revert? [y/N] " answer
[[ "$answer" =~ ^[Yy]$ ]] || { echo "Aborted."; exit 0; }

git revert --no-edit \
  9d8fa69 \
  2793c58 \
  117682b \
  0382a0d \
  9e7ae08 \
  689ac0b \
  b7330ba

echo ""
echo "==> Rollback commits created. To ship rollback to production:"
echo "    git push origin main"
echo "    # Vercel will auto-deploy the revert bundle"
