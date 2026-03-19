#!/usr/bin/env bash
set -euo pipefail

API_BASE_URL="${CANVA_API_BASE_URL:-https://api.canva.com/rest/v1}"

if [[ -z "${CANVA_ACCESS_TOKEN:-}" ]]; then
  echo "Missing CANVA_ACCESS_TOKEN. Source canva-api/.secrets/env.export first." >&2
  exit 1
fi

out_dir="$(dirname "$0")/output"
mkdir -p "$out_dir"

call_api() {
  local endpoint="$1"
  local out_file="$2"
  local url="${API_BASE_URL}${endpoint}"

  local body
  body="$(curl -sS -H "Authorization: Bearer $CANVA_ACCESS_TOKEN" "$url")"
  printf '%s\n' "$body" > "$out_file"

  if printf '%s' "$body" | rg -q '"code":"invalid_access_token"|"error":"invalid_grant"|^{"error"'; then
    echo "API call failed for $endpoint. See: $out_file" >&2
    return 1
  fi
}

call_api "/users/me" "$out_dir/profile.json"
call_api "/folders?limit=100" "$out_dir/folders.json"
call_api "/designs?limit=100" "$out_dir/designs.json"

echo "Canva inventory saved to: $out_dir"
echo "- profile.json"
echo "- folders.json"
echo "- designs.json"
