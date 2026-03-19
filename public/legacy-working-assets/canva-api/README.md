# Canva API Quick Start

This toolkit lets you:
- generate an OAuth authorization URL
- exchange an authorization code for new Canva tokens
- fetch a first-pass Canva inventory (profile, folders, designs)

## 1) Required environment variables

```bash
export CANVA_CLIENT_ID="your_client_id"
export CANVA_CLIENT_SECRET="your_client_secret"
export CANVA_REDIRECT_URI="http://localhost:53682/callback"
```

Optional:

```bash
export CANVA_API_BASE_URL="https://api.canva.com/rest/v1"
export CANVA_SCOPES="profile:read folder:read design:meta:read design:content:read asset:read"
```

## 2) Generate auth URL

```bash
./canva-api/canva_oauth.sh url
```

Open the printed URL in your browser, approve access, then copy the `code=` value from the redirect URL.

## 3) Exchange code for tokens

```bash
./canva-api/canva_oauth.sh exchange "<AUTHORIZATION_CODE>"
```

This writes:
- `canva-api/.secrets/tokens.json`
- `canva-api/.secrets/env.export`

## 4) Load token and fetch inventory

```bash
source canva-api/.secrets/env.export
./canva-api/canva_inventory.sh
```

This writes JSON outputs to:
- `canva-api/output/profile.json`
- `canva-api/output/folders.json`
- `canva-api/output/designs.json`

## Notes

- The Canva refresh token can rotate on refresh. Keep the newest token output.
- Never commit `.secrets/` to git.
