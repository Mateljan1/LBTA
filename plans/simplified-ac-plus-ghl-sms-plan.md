# Simplified AC + GHL SMS — One System, Client Email + Internal Email + Text

**Purpose:** (1) Simplify ActiveCampaign into one clear setup that sends **automated email to the client** and **automated email to you internally**; (2) add GoHighLevel so contacts also get a **text message**. Everything stays seamless and nothing breaks.

---

## Overview

- **ActiveCampaign (simplified):** One list (List 4), same tags the code already uses. One automation that sends the right **client** confirmation email (trial / JTT / scholarship / welcome) and a second step that sends an **internal** email to your team (e.g. support@ or leads@) so you’re notified on every signup.
- **GoHighLevel:** Optional. When configured, the site also sends the contact to GHL; a GHL workflow sends an **SMS** to the contact. Result: **client gets email (AC) + text (GHL); you get internal email (AC).**
- **No breaking changes:** We do **not** change list ID or tag IDs in code. We only simplify how you build automations in AC and add optional GHL dual-write.

---

## Problem Statement

- Current AC setup is four separate automations; you want one clear system.
- You want **internal** notification (email to you) on every signup, not just client email.
- You want clients to get **both** an email and an SMS; today they only get email (when AC automations are set).

---

## Current Behavior (Preserved)

| Form | AC: List | AC: Tags | Notion |
|------|----------|----------|--------|
| Trial / Book | 4 | trial_request (82), website_registration (33), optional class | — |
| Program registration | 4 | class tag (e.g. 49, 38, …) | Yes |
| Year / camps / JTT | 4 | jtt_spring_2026 (107), season/camp, class tags | Yes |
| Newsletter | 4 | website_registration (33) | — |
| Scholarship | 4 | scholarship (108) | — |

All of the above stay exactly as-is in code. List **4** and tag IDs **82, 107, 108, 33** (and class tags) remain the single source of truth in `lib/activecampaign.ts`.

---

## Part 1: Simplified ActiveCampaign (Client + Internal Email)

### 1.1 One “LBTA Confirmations” automation (client emails)

- **Trigger (any of):**
  - Contact is added to list **4**, or  
  - Contact receives tag **82** (Trial), **107** (JTT), **108** (Scholarship), or **33** (Website/Newsletter).
- **Actions (conditions):**
  - If contact has tag **82** → send **Trial confirmation** email to contact.
  - Else if tag **107** → send **JTT confirmation** email to contact.
  - Else if tag **108** → send **Scholarship received** email to contact.
  - Else (list add or tag **33** only) → send **Welcome / Newsletter** email to contact.

So one automation handles all client-facing confirmation emails. No code change; same list and tags.

### 1.2 Internal notification (email to you)

- **Option A — Same automation, second action:**  
  In the same “LBTA Confirmations” automation, add a second action after the conditional send: **“Send email”** to a fixed internal address (e.g. `support@lagunabeachtennisacademy.com` or `leads@…`). Use a simple template: “New signup: {{contact.email}}, Name: {{contact.firstName}} {{contact.lastName}}, Tags: …” (or “New trial / JTT / scholarship / newsletter” based on the same conditions). One automation, two emails (client + internal).
- **Option B — Second automation:**  
  Trigger: Contact added to list **4**. Action: Send one “New LBTA lead” email to your internal address with contact details and tags. Simpler to set up; you get one internal email per new contact.

Recommendation: **Option A** so one automation owns both client and internal email.

### 1.3 Docs update

- Rewrite **`docs/activecampaign-setup-checklist.md`** to describe:
  - **One** automation: “LBTA Confirmations.”
  - Triggers: List 4 add + tags 82, 107, 108, 33.
  - Step 1: Conditional send to **contact** (trial / JTT / scholarship / welcome).
  - Step 2: Send to **internal** email (your chosen address) with a short summary.
- Keep the **IDs table** (List 4, tags 82, 107, 108, 33) and reference to `lib/activecampaign.ts`.
- No code or env changes for AC.

---

## Part 2: GoHighLevel for SMS (Dual-Write)

### 2.1 GHL integration in the app

- **New file:** `lib/gohighlevel.ts`
  - **Create or find contact** by email (GHL API: create contact or search by email).
  - **Add contact to a workflow** by workflow ID (GHL: “Add contact to workflow”). That workflow will send the SMS.
  - Use env: `GHL_API_KEY`, `GHL_LOCATION_ID`. Optional: `GHL_WORKFLOW_ID` (if you have one workflow that sends a single “We got your request” SMS for all types) or per-type workflow IDs later.
- **Env:** Add to `.env.example`: `GHL_API_KEY`, `GHL_LOCATION_ID`, optional `GHL_WORKFLOW_ID`. In `lib/env.ts` (or a small helper), only call GHL when these are set.
- **Dual-write:** In each form API that already writes to AC — **after** AC succeeds — if GHL env is set, call `lib/gohighline.ts` to create/find contact and add to workflow. Routes: `book`, `register-program`, `register-year`, `newsletter`, `scholarship`, `jtt-registration`. If GHL fails, log and do **not** fail the request (AC is source of record; GHL is additive for SMS).

### 2.2 GHL workflow (your setup in GHL UI)

- **One workflow:** “LBTA Website – SMS.”
  - **Trigger:** Contact is added to workflow (the app will add contacts via API).
  - **Action:** Send SMS to contact (e.g. “Thanks for reaching out to Laguna Beach Tennis Academy. We’ll be in touch within 24 hours.”). You can later add branches by tag/source if GHL supports it.
- **Docs:** **`docs/gohighlevel-setup-checklist.md`** with:
  - Create workflow “LBTA Website – SMS.”
  - Add “Send SMS” step; note the workflow ID.
  - Put `GHL_WORKFLOW_ID` in `.env` (and in Vercel). Optional: document creating a contact custom field or tag in GHL if you want to segment later.

### 2.3 Registration flows doc

- Update **`docs/registration-flows-and-ops.md`**:
  - Add a column or row for **GHL** (optional): “Contact added to workflow → SMS to client.”
  - In “Where to look”: GHL = contacts and SMS delivery; internal email = your inbox (from AC).

---

## Part 3: Safety and Rollback

- **No AC ID changes:** List 4 and all tag IDs stay in `lib/activecampaign.ts`. Existing automations (if any) can stay until you replace them with the one new automation.
- **GHL optional:** If `GHL_API_KEY` or `GHL_LOCATION_ID` is missing, skip GHL; behavior is unchanged from today.
- **Failure handling:** On GHL API errors, log and return success to the user (AC already succeeded). Optionally add a small retry or queue later.
- **Testing:** After implementation: submit one trial, one newsletter, one scholarship; confirm client email (AC), internal email (AC), and client SMS (GHL) when GHL is configured.

---

## Implementation Steps

### Phase 1: Docs only (AC simplified setup)

- [ ] **1.1** Rewrite **`docs/activecampaign-setup-checklist.md`** around one “LBTA Confirmations” automation: triggers (List 4 + tags 82, 107, 108, 33), conditional client emails, then internal email to your chosen address. Keep IDs table.
- [ ] **1.2** Add a short “Internal notification” section: what to put in the internal email (contact email, name, signup type/tags) and where to set the “Send to” address.

### Phase 2: GHL module and dual-write

- [ ] **2.1** Create **`lib/gohighlevel.ts`**: `createOrGetContact({ email, firstName?, lastName?, phone? })`, `addContactToWorkflow(contactId, workflowId)`. Use GHL API (create contact, add to workflow). Read `GHL_API_KEY`, `GHL_LOCATION_ID`, `GHL_WORKFLOW_ID` from env; no-op or throw clear error if missing.
- [ ] **2.2** Add **`lib/env.ts`** (or equivalent) checks for `GHL_API_KEY` and `GHL_LOCATION_ID` so routes can decide whether to call GHL.
- [ ] **2.3** In **`app/api/book/route.ts`**: after AC success, if GHL env set, call GHL create/find + add to workflow. Same for **register-program**, **register-year**, **newsletter**, **scholarship**, **jtt-registration**. On GHL failure: log, do not change response (return success).
- [ ] **2.4** Add **`.env.example`** entries: `GHL_API_KEY`, `GHL_LOCATION_ID`, `GHL_WORKFLOW_ID` (optional). Update **README** and **`docs/registration-flows-and-ops.md`** to mention GHL and internal email.

### Phase 3: GHL setup doc and flows doc

- [ ] **3.1** Create **`docs/gohighlevel-setup-checklist.md`**: Create workflow “LBTA Website – SMS”, add SMS step, note workflow ID, set env vars. Optional: phone number collection (if you want to ensure SMS only when phone exists).
- [ ] **3.2** Update **`docs/registration-flows-and-ops.md`**: GHL column (optional); “Where to look” includes GHL for SMS and internal inbox for internal email.

### Phase 4: Validate and deploy

- [ ] **4.1** Build and lint. Test with GHL env unset (no regression). Test with GHL env set: one form submission, confirm contact in GHL and workflow triggered (and SMS if phone present).
- [ ] **4.2** Deploy; set `GHL_*` in Vercel when ready. Leave unset until GHL workflow is built.

---

## Files to Create/Modify

| File | Action | Purpose |
|------|--------|---------|
| `docs/activecampaign-setup-checklist.md` | Modify | One automation (client + internal email); IDs table unchanged. |
| `lib/gohighlevel.ts` | Create | Create/find contact, add to workflow; env-based. |
| `lib/env.ts` (or existing env helper) | Modify | Optional: `hasGhlEnv()` or similar for routes. |
| `app/api/book/route.ts` | Modify | After AC, optional GHL dual-write. |
| `app/api/register-program/route.ts` | Modify | After AC, optional GHL dual-write. |
| `app/api/register-year/route.ts` | Modify | After AC, optional GHL dual-write. |
| `app/api/newsletter/route.ts` | Modify | After AC, optional GHL dual-write. |
| `app/api/scholarship/route.ts` | Modify | After AC, optional GHL dual-write. |
| `app/api/jtt-registration/route.ts` | Modify | After AC, optional GHL dual-write. |
| `.env.example` | Modify | Add GHL_API_KEY, GHL_LOCATION_ID, GHL_WORKFLOW_ID. |
| `docs/gohighlevel-setup-checklist.md` | Create | GHL workflow + SMS setup; workflow ID. |
| `docs/registration-flows-and-ops.md` | Modify | GHL in flow table; internal email in “Where to look”. |
| `README.md` | Modify | Mention GHL (optional) and internal email. |

---

## Success Criteria

- [ ] **AC:** One automation in AC sends the correct **client** email (trial / JTT / scholarship / welcome) and one **internal** email to your chosen address. Docs describe it; no code change to AC IDs.
- [ ] **GHL:** When GHL env is set, form submissions create/find contact in GHL and add to workflow; workflow sends **SMS** to contact. When GHL env is unset, behavior is unchanged.
- [ ] **Safety:** No change to List 4 or tag IDs; GHL failures do not fail the API response; build and lint pass.

---

## Research / References

- ActiveCampaign: triggers (list add, tag applied), conditions (if tag), send email to contact vs. to another address.
- GoHighLevel API: create contact, add contact to workflow — [marketplace.gohighlevel.com](https://marketplace.gohighlevel.com/docs).
- Repo: `lib/activecampaign.ts`, `docs/activecampaign-setup-checklist.md`, `docs/registration-flows-and-ops.md`, form API routes.

---

## Next Step

Execute **Phase 1** first (docs only) so you can set up the simplified AC automation and internal email in the AC UI. Then implement **Phase 2–4** (GHL module, dual-write, GHL checklist, deploy). Say “execute Phase 1” or “execute full plan” to run the steps.
