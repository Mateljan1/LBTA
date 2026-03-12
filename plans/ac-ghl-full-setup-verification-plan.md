# AC + GHL Full Setup and Verification Plan

## Overview

Get ActiveCampaign and GoHighLevel fully configured and verifiable so form submissions flow 100%: AC (required) for contact + email automation, GHL (optional) for contact + SMS workflow.

## Problem Statement

- AC and GHL env vars are partially in Vercel (AC URL/key and GHL key/location are set; GHL_WORKFLOW_ID is still required for SMS).
- There is no single “connection check” that verifies env and optionally pings AC/GHL without creating test data.
- Getting the GHL workflow ID from the UI is not documented in one place.

## Current State

| System    | Vercel env                                      | Code path                    |
|-----------|--------------------------------------------------|------------------------------|
| AC        | ACTIVECAMPAIGN_URL, ACTIVECAMPAIGN_API_KEY       | lib/activecampaign.ts; all form APIs |
| GHL       | GHL_API_KEY, GHL_LOCATION_ID set; GHL_WORKFLOW_ID missing | lib/gohighlevel.ts; book, register-*, newsletter, scholarship, jtt |

GHL only runs when all three GHL_* vars are set. Until GHL_WORKFLOW_ID is set, forms still go to AC (and optional Supabase); GHL is skipped.

## Implementation Steps

### Phase 1: Verification tooling
- [x] Add `scripts/connection-check.js`: env check + optional `--ping` to verify AC (read-only, e.g. GET lists) and GHL (read-only; if API supports list workflows, print workflow IDs for the location).
- [x] Add npm script `connection-check` (or reuse/extend `check:env`).
- [x] Never print secret values; exit 0 only if AC required vars are set (and optionally if ping succeeds).

### Phase 2: Documentation
- [x] Add `docs/how-to-get-ghl-workflow-id.md`: steps to create “LBTA Website – SMS” workflow in GHL UI and where to copy the workflow ID; optional: how to get it via API if we add list-workflows.
- [x] Update `docs/ac-ghl-connected-onepager.md`: add “Final verification” section and link to `npm run connection-check` (or lead + connection-check).
- [x] Ensure `docs/gohighlevel-setup-checklist.md` and `docs/activecampaign-setup-checklist.md` are linked from the onepager.

### Phase 3: One “100% checklist” and redeploy
- [x] Add a short “100% setup checklist” section to the onepager or a dedicated `docs/ac-ghl-100-percent-checklist.md`: (1) Vercel env set, (2) AC automation on, (3) GHL workflow created and ID in Vercel, (4) run connection-check, (5) submit test form and confirm AC + GHL.
- [x] Note in docs: after adding GHL_WORKFLOW_ID (or any env change), redeploy production so new vars are used.

## Files to Create/Modify

| File | Action | Purpose |
|------|--------|---------|
| `scripts/connection-check.js` | Create | Env + optional AC/GHL read-only ping; list GHL workflow IDs if API allows |
| `docs/how-to-get-ghl-workflow-id.md` | Create | GHL UI (and optional API) steps to get workflow ID |
| `docs/ac-ghl-100-percent-checklist.md` | Create | Single “100% done” checklist |
| `docs/ac-ghl-connected-onepager.md` | Modify | Add verification section + link to check script and 100% checklist |
| `package.json` | Modify | Add `connection-check` script |

## Success Criteria

- [ ] Running `npm run connection-check` (and optionally `--ping`) shows env status and, when vars are set, confirms AC and GHL reachable without creating contacts.
- [ ] Docs give a clear path to set GHL_WORKFLOW_ID and to verify end-to-end (form → AC + GHL).
- [ ] No secrets printed; script safe for CI/local.
- [ ] After user adds GHL_WORKFLOW_ID and redeploys, forms create AC contact + GHL contact and add to workflow (SMS when phone present).

## Relevant Learnings

- GHL requires all three vars (GHL_API_KEY, GHL_LOCATION_ID, GHL_WORKFLOW_ID) for SMS; otherwise GHL is skipped (lib/gohighlevel.ts).
- Vercel env: use Dashboard or `scripts/vercel-env-add.js` with values in env; redeploy after changes.
- Lead CLI: `npm run lead` for env check; setup: docs/ac-ghl-connected-onepager.md.
