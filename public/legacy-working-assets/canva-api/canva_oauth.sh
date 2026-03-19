#!/usr/bin/env bash
set -euo pipefail

API_BASE_URL="${CANVA_API_BASE_URL:-https://api.canva.com/rest/v1}"
SCOPES="${CANVA_SCOPES:-profile:read folder:read design:meta:read design:content:read asset:read}"
REDIRECT_URI="${CANVA_REDIRECT_URI:-http://localhost:53682/callback}"

require_var() {
  local name="$1"
  if [[ -z "${!name:-}" ]]; then
    echo "Missing required env var: $name" >&2
    exit 1
  fi
}

require_var "CANVA_CLIENT_ID"
require_var "CANVA_CLIENT_SECRET"

mkdir -p "$(dirname "$0")/.secrets"

cmd="${1:-}"
case "$cmd" in
  url)
    state="$(openssl rand -hex 16)"
    export _CANVA_CLIENT_ID="$CANVA_CLIENT_ID"
    export _CANVA_REDIRECT_URI="$REDIRECT_URI"
    export _CANVA_SCOPES="$SCOPES"
    export _CANVA_STATE="$state"
    python3 - <<'PY'
import os
from urllib.parse import urlencode

params = {
    "response_type": "code",
    "client_id": os.environ["_CANVA_CLIENT_ID"],
    "redirect_uri": os.environ["_CANVA_REDIRECT_URI"],
    "scope": os.environ["_CANVA_SCOPES"],
    "state": os.environ["_CANVA_STATE"],
}
url = "https://www.canva.com/api/oauth/authorize?" + urlencode(params)
print("Open this URL in your browser:\n")
print(url)
print("\nAfter approval, copy the `code` query value from the redirect URL.")
print(f"State: {os.environ['_CANVA_STATE']}")
PY
    ;;

  exchange)
    code="${2:-}"
    if [[ -z "$code" ]]; then
      echo "Usage: $0 exchange <AUTHORIZATION_CODE>" >&2
      exit 1
    fi

    tokens_json="$(curl -sS -X POST "$API_BASE_URL/oauth/token" \
      -H "Content-Type: application/x-www-form-urlencoded" \
      --data-urlencode "grant_type=authorization_code" \
      --data-urlencode "code=$code" \
      --data-urlencode "redirect_uri=$REDIRECT_URI" \
      --data-urlencode "client_id=$CANVA_CLIENT_ID" \
      --data-urlencode "client_secret=$CANVA_CLIENT_SECRET")"

    if echo "$tokens_json" | rg -q '"error"'; then
      echo "Token exchange failed:" >&2
      echo "$tokens_json" >&2
      exit 1
    fi

    tokens_file="$(dirname "$0")/.secrets/tokens.json"
    env_file="$(dirname "$0")/.secrets/env.export"
    printf '%s\n' "$tokens_json" > "$tokens_file"

    access_token="$(printf '%s' "$tokens_json" | python3 -c 'import sys,json; print(json.load(sys.stdin).get("access_token",""))')"
    refresh_token="$(printf '%s' "$tokens_json" | python3 -c 'import sys,json; print(json.load(sys.stdin).get("refresh_token",""))')"

    {
      echo "export CANVA_ACCESS_TOKEN=\"$access_token\""
      echo "export CANVA_REFRESH_TOKEN=\"$refresh_token\""
      echo "export CANVA_API_BASE_URL=\"$API_BASE_URL\""
      echo "export CANVA_CLIENT_ID=\"$CANVA_CLIENT_ID\""
      echo "export CANVA_CLIENT_SECRET=\"$CANVA_CLIENT_SECRET\""
      echo "export CANVA_REDIRECT_URI=\"$REDIRECT_URI\""
      echo "export CANVA_SCOPES=\"$SCOPES\""
    } > "$env_file"

    echo "Wrote tokens to: $tokens_file"
    echo "Wrote env export file to: $env_file"
    echo "Next: source \"$env_file\" && ./canva-api/canva_inventory.sh"
    ;;

  *)
    echo "Usage:"
    echo "  $0 url"
    echo "  $0 exchange <AUTHORIZATION_CODE>"
    exit 1
    ;;
esac
