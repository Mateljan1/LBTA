#!/usr/bin/env bash
# Push STRIPE_SECRET_KEY + STRIPE_WEBHOOK_SECRET to Vercel Production for the linked project.
# Usage (recommended — values stay in your shell, not committed):
#   export STRIPE_SECRET_KEY='sk_live_...'
#   export STRIPE_WEBHOOK_SECRET='whsec_...'
#   ./scripts/sync-stripe-env-to-vercel.sh
#
# Requires: vercel login, vercel link (repo has .vercel/project.json).

set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

if [[ -z "${STRIPE_SECRET_KEY:-}" || -z "${STRIPE_WEBHOOK_SECRET:-}" ]]; then
  echo "Missing STRIPE_SECRET_KEY or STRIPE_WEBHOOK_SECRET in environment." >&2
  echo "Export both (from Stripe Dashboard), then re-run this script." >&2
  exit 1
fi

upsert() {
  local name="$1"
  local val="$2"
  if vercel env add "$name" production --sensitive --yes --value "$val" 2>/dev/null; then
    echo "Added $name (production)."
  else
    vercel env update "$name" production --sensitive --yes --value "$val"
    echo "Updated $name (production)."
  fi
}

upsert STRIPE_SECRET_KEY "$STRIPE_SECRET_KEY"
upsert STRIPE_WEBHOOK_SECRET "$STRIPE_WEBHOOK_SECRET"

echo ""
echo "Done. Redeploy Production in Vercel so new env is picked up, or: vercel --prod"
