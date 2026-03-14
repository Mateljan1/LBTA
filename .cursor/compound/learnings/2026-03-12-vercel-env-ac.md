# Extraction: Vercel env + AC production (2026-03-12)

## Source
- Plan: vercel-env-and-connections-plan.md (audit with Vercel CLI, GHL MCP; add AC/GHL vars to Vercel).
- Script: scripts/vercel-env-add.js — VERCEL_TOKEN from .env.vercel, ACTIVECAMPAIGN_URL + ACTIVECAMPAIGN_API_KEY from process.env; POST to Vercel API; upsert for production + preview.
- User provided AC URL and API key; script ran successfully; vercel env ls production showed both; redeploy completed. Production lead pipeline now uses ActiveCampaign.

## Extracted
- **Pattern (vercel-env-add-via-api):** When adding sensitive env vars to Vercel programmatically, use a script that reads VERCEL_TOKEN from a gitignored file and secret values from process.env at runtime; call Vercel API; never commit or log secret values.

## Files updated
- plans/COMPOUND_LEARN.md — log entry 2026-03-12 (Vercel env plan + AC vars added).
- .cursor/compound/learnings/patterns.json — +vercel-env-add-via-api.
