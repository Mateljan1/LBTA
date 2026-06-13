# GHL + 1Password + Vercel fix (2026-05-21)

## Root cause
- Vercel `GHL_API_KEY` was an expired 213-char JWT → 401 Invalid JWT.
- Vercel `GHL_API_BASE` pointed at legacy `https://rest.gohighlevel.com/v1` → location GET could pass (canary hardcodes leadconnectorhq) but `lib/gohighlevel.ts` contact create/search failed silently.
- Correct token: 1Password `Gohighlevel · Lbta · GHL_PIT_TOKEN` (item `oothbe3xmullcd3n2les23szha`), not Live-Env `GHL_API_KEY` (location-read only).
- `scripts/vercel-env-add.js` defaulted to wrong project `lbta-website`; use `laguna-beach-tennis-academy`.

## Fix
- Removed `GHL_API_BASE` from Vercel; hardcode Lead Connector base in `lib/gohighlevel.ts`.
- Set Vercel `GHL_API_KEY` / `GHL_PIT_TOKEN` to LBTA PIT via `vercel env add`.
- Backfill: 25/27 Apr–May website leads → GHL + workflow enrolled.

## Verify
- `GET /api/cron/leads-canary` → `ghl-token` ok.
- `GET /api/cron/backfill-ghl?probe=1` → `workflowEnrolled: true`.
- `npm run health:prod` → exit 0.

## Still open
- Postmark 401 on Vercel (staff alerts); GHL workflow owns customer SMS/email when `useGhlLeadDelivery()` is on.
