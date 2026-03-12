# LBTA Website — ActiveCampaign & GoHighLevel Connected

**Purpose:** Single reference to get form submissions flowing end-to-end: contact in ActiveCampaign (client + internal email) and optionally in GoHighLevel (SMS). Use this when connecting or reconnecting the two systems.

---

## 1. Vercel environment variables

In **Vercel** → LBTA project → **Settings → Environment Variables**, set:

| Variable | Required | Where to get it |
|----------|----------|------------------|
| `ACTIVECAMPAIGN_URL` | Yes | AC → Settings → Developer (e.g. `https://YOUR_ACCOUNT.api-us1.com`) |
| `ACTIVECAMPAIGN_API_KEY` | Yes | AC → Settings → Developer |
| `GHL_API_KEY` | Optional* | GHL → Settings → API Keys (location key) |
| `GHL_LOCATION_ID` | Optional* | GHL location/sub-account ID |
| `GHL_WORKFLOW_ID` | Optional* | GHL workflow used for “LBTA Website – SMS” (see below) |

\* All three GHL vars must be set for SMS to run. If any is missing, forms still go to AC only.

After adding or changing variables, **redeploy** production (or trigger a new deploy).

**Optional — add via script:** From the repo, run `node scripts/vercel-env-add.js` with `ACTIVECAMPAIGN_URL` and `ACTIVECAMPAIGN_API_KEY` (and optionally `GHL_WORKFLOW_ID`) in your environment; the script uses `VERCEL_TOKEN` from `.env.vercel` and the Vercel API. See the script header for usage.

---

## 2. ActiveCampaign — one automation

**Full steps:** [activecampaign-setup-checklist.md](./activecampaign-setup-checklist.md)

- **Automation name:** “LBTA Confirmations”
- **Triggers:** Contact added to **List 4** OR contact receives **tag 82, 107, 108, or 33**
- **Step 1:** Conditional email **to contact** — Trial (82), JTT (107), Scholarship (108), or Welcome/Newsletter (else)
- **Step 2:** Email **to your team** (e.g. support@…) with signup summary

List and tag IDs are fixed in code (`lib/activecampaign.ts`). Create the four client emails in AC if needed; save and turn the automation **on**.

---

## 3. GoHighLevel — one workflow (optional)

**Full steps:** [gohighlevel-setup-checklist.md](./gohighlevel-setup-checklist.md)

- **Workflow name:** e.g. “LBTA Website – SMS”
- **Trigger:** Contact added to workflow (the site adds contacts via API)
- **Step 1:** Send SMS to contact (e.g. “Thanks for reaching out to Laguna Beach Tennis Academy…”)

Copy the workflow **ID** into Vercel as `GHL_WORKFLOW_ID` (with `GHL_API_KEY` and `GHL_LOCATION_ID`), then redeploy.

---

## 4. Final verification

- **Env and reachability:** Run `npm run connection-check` for env status. Run `npm run connection-check -- --ping` to verify AC and GHL are reachable (read-only; no test contacts created). If GHL returns workflow list, use one of those IDs as `GHL_WORKFLOW_ID` — see [how-to-get-ghl-workflow-id.md](./how-to-get-ghl-workflow-id.md).
- **100% checklist:** Use [ac-ghl-100-percent-checklist.md](./ac-ghl-100-percent-checklist.md) for a single end-to-end checklist (Vercel env → AC automation → GHL workflow → verify).

After adding or changing any env var in Vercel, **redeploy production** so the app uses the new values.

---

## 5. Verification checklist (manual test)

| Test | ActiveCampaign | GoHighLevel (if set) |
|------|----------------|----------------------|
| **Newsletter** — submit email on site | Contact on List 4, tag 33; client gets welcome email; you get internal email | Contact in GHL; in workflow (SMS if phone present) |
| **Trial / Book** — submit trial request | Contact on List 4, tag 82; client gets trial confirmation; you get internal email | Contact in GHL; in workflow; SMS if phone provided |

Optional: repeat for JTT and Scholarship forms; same idea — correct AC list/tag, client + internal email, GHL contact + workflow.

---

## Related docs

| Doc | Use when |
|-----|----------|
| [ac-ghl-100-percent-checklist.md](./ac-ghl-100-percent-checklist.md) | Single checklist to get AC + GHL 100% set up and verified |
| [lead-connector-setup.md](./lead-connector-setup.md) | Lead Connector (GHL API v2) setup and env vars |
| [how-to-get-ghl-workflow-id.md](./how-to-get-ghl-workflow-id.md) | Creating the GHL workflow and copying its ID into Vercel |
| [activecampaign-setup-checklist.md](./activecampaign-setup-checklist.md) | Building the “LBTA Confirmations” automation and client/internal emails |
| [gohighlevel-setup-checklist.md](./gohighlevel-setup-checklist.md) | Creating the GHL workflow and getting API key + IDs |
| [registration-flows-and-ops.md](./registration-flows-and-ops.md) | Seeing which form hits which API and where data goes |
| [ac-ghl-connection-via-mcps.md](./ac-ghl-connection-via-mcps.md) | Using Vercel and GoHighLevel MCPs to audit env vars and test GHL |

**Commands:** `npm run connection-check` (env); `npm run connection-check -- --ping` (env + AC/GHL reachability). **Plan:** `plans/ac-ghl-full-setup-verification-plan.md`
