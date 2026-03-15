# Vercel Env + Connections — Compound Plan

**Objective:** Add ACTIVECAMPAIGN_URL, ACTIVECAMPAIGN_API_KEY, and (optional) GHL_WORKFLOW_ID to Vercel production so the site’s lead pipeline works end-to-end. Use MCP, API, and CLI to audit and verify.

**Status:** Plan created; audit done. Env vars must be added (values from you), then verify.

---

## Audit (done)

| Tool | Result |
|------|--------|
| **Vercel CLI** (`vercel env ls production` with token from `.env.vercel`) | **No Environment Variables** for `andrew-mateljans-projects/lbta-website`. AC and GHL cannot work in production until vars are set. |
| **GHL MCP** (`ghl_list_pipelines`) | Connected. Pipelines: LBTA Lead to Member, New Leads Pipeline, Member Retention, Seasonal Enrollment. GHL_WORKFLOW_ID is for an **Automation Workflow** (SMS), not a pipeline — create that in GHL UI and add its ID to Vercel. |
| **Lead CLI** (`npm run lead`) | Local only; shows AC/GHL env set/missing. Production env is empty so production forms do not sync to AC/GHL. |

---

## Implementation steps

### Phase 1: Add required env vars to Vercel

- [ ] **1.1** Get **ACTIVECAMPAIGN_URL** and **ACTIVECAMPAIGN_API_KEY** from ActiveCampaign: Settings → Developer. (e.g. URL: `https://YOUR_ACCOUNT.api-us1.com`.)
- [ ] **1.2** Add to Vercel using **one** of:
  - **Option A (Dashboard):** [Vercel → lbta-website → Settings → Environment Variables](https://vercel.com/andrew-mateljans-projects/lbta-website/settings/environment-variables). Add `ACTIVECAMPAIGN_URL` and `ACTIVECAMPAIGN_API_KEY` for **Production** (and Preview if you use previews).
  - **Option B (CLI script):** Run `node scripts/vercel-env-add.js` with values in env (see script comment). Script uses `VERCEL_TOKEN` from `.env.vercel` and POSTs to Vercel API.
- [ ] **1.3** (Optional) For SMS: In GHL create an **Automation Workflow** (e.g. “LBTA Website – SMS”, trigger: contact added to workflow; step: Send SMS). Copy the **Workflow ID** and add `GHL_WORKFLOW_ID` to Vercel (Dashboard or script). Ensure `GHL_API_KEY` and `GHL_LOCATION_ID` are also set in Vercel.

### Phase 2: Redeploy and verify

- [ ] **2.1** Trigger a production redeploy so new env vars are used: from repo run `npx vercel --prod --yes` (with `VERCEL_TOKEN` from `.env.vercel`), or push a commit if Vercel is connected to Git.
- [ ] **2.2** **Verify with tools:**
  - **Vercel CLI:** `export $(grep -v '^#' .env.vercel | xargs)` then `vercel env ls production` — should list ACTIVECAMPAIGN_URL, ACTIVECAMPAIGN_API_KEY, and optionally GHL_*.
  - **Lead CLI:** `npm run lead` shows local env only; for production use `vercel env ls production` or dashboard.
  - **GHL MCP:** Already verified via `ghl_list_pipelines` (LBTA Lead to Member, New Leads Pipeline, etc.). Optional: `ghl_create_contact` or `ghl_search_contacts` to confirm writes.
- [ ] **2.3** **Smoke test:** Submit the newsletter or trial form on **production** (https://lbta-website.vercel.app). Check ActiveCampaign for the new contact and (if GHL configured) GHL for the contact and workflow.

### Phase 3: Documentation and compound

- [ ] **3.1** One-pager and checklists are up to date: [docs/ac-ghl-connected-onepager.md](../docs/ac-ghl-connected-onepager.md), [docs/activecampaign-setup-checklist.md](../docs/activecampaign-setup-checklist.md), [docs/gohighlevel-setup-checklist.md](../docs/gohighlevel-setup-checklist.md).
- [ ] **3.2** Run `/compound:learn` after verification to log “Vercel env added; AC/GHL production verified.”

---

## Files to create/modify

| File | Action | Purpose |
|------|--------|---------|
| `scripts/vercel-env-add.js` | Create | Add env vars to Vercel via API using VERCEL_TOKEN and values from process.env. |
| `plans/vercel-env-and-connections-plan.md` | Create | This plan. |
| `docs/ac-ghl-connected-onepager.md` | Optional | Add one-line: “Or run `node scripts/vercel-env-add.js` with env set (see script).” |

---

## Success criteria

- [ ] ACTIVECAMPAIGN_URL and ACTIVECAMPAIGN_API_KEY set for production on Vercel.
- [ ] (Optional) GHL_WORKFLOW_ID (and GHL_API_KEY, GHL_LOCATION_ID) set if SMS is desired.
- [ ] Production redeploy completed.
- [ ] `vercel env ls production` shows the new vars.
- [ ] One production form submission creates a contact in ActiveCampaign (and in GHL if configured).

---

## Relevant learnings

- **Deploy = git push + vercel --prod** (compound pattern).
- **Env checker no values:** Scripts never print secret values; only set/missing (scripts/lead.js, check-ac-ghl-env.js).
- **Optional dual write:** GHL and storeLead run after AC; failures do not change API response.

---

## Risks and mitigations

| Risk | Mitigation |
|------|------------|
| Token or API key pasted in chat or committed | Values only in Vercel Dashboard or in process.env when running script; .env.vercel is gitignored. |
| Wrong project or team | Script uses project name `lbta-website` and team slug `andrew-mateljans-projects`; adjust if your project/team differ. |
