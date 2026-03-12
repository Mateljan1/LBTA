# ActiveCampaign + GoHighLevel — Connect and Working

**Purpose:** One implementation plan to hook up ActiveCampaign and GoHighLevel so every form submission is connected end-to-end: contact in AC (with correct list/tags), client confirmation email + internal team email from AC, and optional contact in GHL with SMS from a workflow.

---

## Overview

The **code** already supports both systems: form APIs dual-write to ActiveCampaign (when `ACTIVECAMPAIGN_URL` + `ACTIVECAMPAIGN_API_KEY` are set) and to GoHighLevel (when `GHL_API_KEY`, `GHL_LOCATION_ID`, and `GHL_WORKFLOW_ID` are set). This plan covers **configuration only** — env vars in Vercel, one AC automation, and one GHL workflow — so that in production everything is connected and working.

---

## Problem Statement

- Forms (book, register-program, register-year, newsletter, scholarship, JTT) are live but may not be fully connected: AC and/or GHL might be missing env vars or automations.
- You want: (1) every signup in ActiveCampaign with the right list and tags; (2) one AC automation that sends the right **client** email and an **internal** email to your team; (3) optional GHL so contacts also get an **SMS** via a workflow.
- Goal: “Hooked up and working” = env set in production, AC automation on, GHL workflow on (if using GHL), and a quick verification that a test submission reaches both.

---

## Proposed Solution

1. **Vercel environment** — Set all required/optional env vars for production (and optionally preview) so the site can call AC and GHL.
2. **ActiveCampaign** — One “LBTA Confirmations” automation: triggers (List 4 add + tags 82, 107, 108, 33), Step 1 = conditional client email, Step 2 = internal email to your team. No code or ID changes.
3. **GoHighLevel (optional)** — One workflow (e.g. “LBTA Website – SMS”): trigger = contact added to workflow; Step 1 = send SMS. All three GHL env vars set in Vercel.
4. **Verification** — Submit one test per form type (e.g. newsletter, trial) and confirm: contact in AC with correct tags, client email received, internal email received, and (if GHL set) contact in GHL and SMS received.

---

## Implementation Steps

### Phase 1: Vercel environment variables

- [ ] **1.1** Log in to [Vercel](https://vercel.com) → LBTA project → **Settings → Environment Variables**.
- [ ] **1.2** Add **ActiveCampaign** (required for form flows):
  - `ACTIVECAMPAIGN_URL` — e.g. `https://YOUR_ACCOUNT.api-us1.com` (from AC Settings → Developer).
  - `ACTIVECAMPAIGN_API_KEY` — from AC Settings → Developer.
- [ ] **1.3** Add **GoHighLevel** (optional; all three must be set for GHL to run):
  - `GHL_API_KEY` — Location API key from GHL.
  - `GHL_LOCATION_ID` — Sub-account / location ID.
  - `GHL_WORKFLOW_ID` — Workflow ID for the “LBTA Website – SMS” workflow (create in Phase 3 if needed).
- [ ] **1.4** (Optional) Add `AC_WEBHOOK_SECRET` if you use the ActiveCampaign webhook route; required in production for that route.
- [ ] **1.5** Save and **redeploy** the production deployment so new env vars are picked up (or trigger a new deploy from the Vercel dashboard).

**Reference:** `.env.example`, `lib/env.ts`, `docs/registration-flows-and-ops.md`.

---

### Phase 2: ActiveCampaign — one “LBTA Confirmations” automation

- [ ] **2.1** In ActiveCampaign, confirm **List ID 4** exists and is the LBTA master list. Confirm tags exist with these IDs (create in AC if missing):
  - **82** — Trial Request  
  - **33** — Website/Newsletter  
  - **107** — JTT Spring 2026  
  - **108** — Scholarship  
- [ ] **2.2** Create one automation named **“LBTA Confirmations”**.
- [ ] **2.3** Add **triggers** (any of):
  - Contact is **added to list ID 4**, or  
  - Contact **receives tag** 82, 107, 108, or 33.
- [ ] **2.4** Add **Step 1 — Client email (conditional):**
  - If contact has tag **82** → send **Trial confirmation** email to contact.  
  - Else if tag **107** → send **JTT confirmation** email.  
  - Else if tag **108** → send **Scholarship received** email.  
  - Else → send **Welcome / Newsletter** email.
- [ ] **2.5** Add **Step 2 — Internal notification:**  
  Send email to your internal address (e.g. `support@lagunabeachtennisacademy.com`) with subject/body summarizing the signup (e.g. “New LBTA signup: {{contact.email}}”, contact name, type).
- [ ] **2.6** Create the four emails in AC if not already created (Trial, JTT, Scholarship, Welcome/Newsletter).
- [ ] **2.7** Save and turn the automation **on**.

**Reference:** `docs/activecampaign-setup-checklist.md`, `lib/activecampaign.ts` (IDs: `LBTA_LIST_ID`, `CAMPAIGN_TAGS`).

---

### Phase 3: GoHighLevel — workflow and env (optional)

- [ ] **3.1** In GoHighLevel, open the **location/sub-account** used for LBTA.
- [ ] **3.2** Create a workflow (e.g. **“LBTA Website – SMS”**):
  - **Trigger:** Contact added to workflow (the API will add contacts to this workflow).
  - **Step 1:** Send SMS to contact (e.g. “Thanks for reaching out to Laguna Beach Tennis Academy. We’ll be in touch within 24 hours.”). Use contact’s phone if present.
- [ ] **3.3** Copy the **Workflow ID** (from workflow URL or settings).
- [ ] **3.4** Ensure **Phase 1** env vars `GHL_API_KEY`, `GHL_LOCATION_ID`, and `GHL_WORKFLOW_ID` are set in Vercel (add `GHL_WORKFLOW_ID` in 1.3 if you created the workflow after Phase 1).
- [ ] **3.5** Redeploy if you added or changed GHL env vars.

**Reference:** `docs/gohighlevel-setup-checklist.md`, `lib/gohighlevel.ts`.

---

### Phase 4: Verification (success criteria)

- [ ] **4.1** **Newsletter:** Submit a test email via the site’s newsletter form. Confirm:
  - Contact appears in AC on List 4 with tag 33 (Website/Newsletter).
  - Client receives Welcome/Newsletter email (from AC automation).
  - Internal team receives the internal notification email.
  - If GHL is set: contact appears in GHL and is added to the workflow; if phone was collected elsewhere, SMS step can be verified with a form that sends phone (e.g. trial/book).
- [ ] **4.2** **Trial / Book:** Submit a test trial request (e.g. from Book Trial or contact form). Confirm:
  - Contact in AC with tag 82 (Trial Request) and List 4.
  - Client receives Trial confirmation email.
  - Internal email received.
  - If GHL set: contact in GHL and in workflow (SMS if phone provided).
- [ ] **4.3** (Optional) One test each for **JTT** and **Scholarship** if those forms are in use — same checks: AC list + correct tag, client email, internal email, GHL if configured.

---

## Files to Create/Modify

| File | Action | Purpose |
|------|--------|---------|
| `plans/activecampaign-ghl-connect-plan.md` | Create | This plan (done). |
| `docs/activecampaign-setup-checklist.md` | No change | Already describes one automation; use as step-by-step. |
| `docs/gohighlevel-setup-checklist.md` | No change | Already describes GHL workflow and env; use as step-by-step. |
| `docs/registration-flows-and-ops.md` | No change | Single reference for flows and env. |

No application code changes are required; all integration is already implemented.

---

## Success Criteria

- [ ] Vercel production has `ACTIVECAMPAIGN_URL` and `ACTIVECAMPAIGN_API_KEY` set; production deploy has been run after setting them.
- [ ] ActiveCampaign “LBTA Confirmations” automation is on; triggers are List 4 + tags 82, 107, 108, 33; client and internal emails send correctly.
- [ ] If using GHL: `GHL_API_KEY`, `GHL_LOCATION_ID`, and `GHL_WORKFLOW_ID` are set in Vercel; workflow sends SMS when contact is added.
- [ ] At least one live test per form type (e.g. newsletter, trial) shows: contact in AC with correct tags, client email received, internal email received, and (if GHL set) contact in GHL and SMS received.

---

## Research Sources

- `docs/activecampaign-setup-checklist.md` — AC one-automation setup.
- `docs/gohighlevel-setup-checklist.md` — GHL workflow and env.
- `docs/registration-flows-and-ops.md` — Flow overview and env summary.
- `lib/activecampaign.ts` — List and tag IDs (single source of truth).
- `lib/gohighlevel.ts` — GHL create contact + add to workflow.
- `.env.example` — Env var names and comments.

---

## Relevant Learnings

- **Dual-write order:** AC (or Notion then AC) → GHL → storeLead; form routes return 200 even if AC or GHL fails (log only). (Compound learnings, pattern: optional-dual-write-after-primary.)
- **External API errors:** Do not log full response bodies in production; log status or truncated message. (Quality bar: externalApiErrorLogSafe.)
- **Env gates:** Newsletter (and other form routes) use `hasEnvVar('ACTIVECAMPAIGN_URL') && hasEnvVar('ACTIVECAMPAIGN_API_KEY')` so when AC is not set, the route still returns 200 and runs GHL/storeLead if configured.

---

## Risks & Mitigations

| Risk | Mitigation |
|------|------------|
| AC or GHL API keys wrong or expired | Verify in AC/GHL developer settings; re-save in Vercel and redeploy. |
| Tag or list IDs don’t match AC | Compare `lib/activecampaign.ts` (LBTA_LIST_ID, CAMPAIGN_TAGS) to AC UI; create tags in AC if missing and update code only if ID differs. |
| GHL workflow doesn’t trigger | Ensure trigger is “Contact added to workflow”; ensure all three GHL env vars are set and deployment was after setting them. |
| Internal email not received | Check AC automation Step 2 recipient; check spam; confirm automation is on and has been triggered by a test contact. |

---

## Optional: One-pager for “connected and working”

If you want a single doc to hand to someone doing the setup:

- **Title:** “LBTA website — ActiveCampaign & GoHighLevel connected”
- **Sections:** (1) Vercel env vars (table from Phase 1); (2) AC: one automation “LBTA Confirmations” (link to `docs/activecampaign-setup-checklist.md`); (3) GHL: one workflow + env (link to `docs/gohighlevel-setup-checklist.md`); (4) Verification checklist (Phase 4).
- **Location:** e.g. `docs/ac-ghl-connected-onepager.md` (create only if desired).

This plan does not create that file; it can be added in a follow-up.
