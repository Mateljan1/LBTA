#!/usr/bin/env bash
# LBTA brochure pipeline: build content → pre-flight check → render PDFs.
# Run from repo root.

set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT"

echo "[1/3] Build content.json from data/*.json"
python3 scripts/build_brochure_content.py

echo
echo "[2/3] Render PDFs (Playwright)"
python3 scripts/render_brochure.py

echo
echo "[3/3] Pre-flight QA (post-render)"
SKIP_NETWORK="${SKIP_NETWORK:-0}"
if [[ "$SKIP_NETWORK" == "1" ]]; then
  python3 scripts/check_brochure.py --skip-network
else
  python3 scripts/check_brochure.py
fi

echo
echo "✓ Done. PDFs in brochures/out/"
ls -lh brochures/out/*.pdf 2>/dev/null || true
