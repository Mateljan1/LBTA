# ActiveCampaign Setup Checklist — Confirmation Emails

**Purpose:** One-time setup in ActiveCampaign so contacts receive confirmation emails when they sign up, request a trial, register for JTT, or submit a scholarship application. The website adds contacts to List 4 and applies tags; **you** create the automations in AC that send the emails.

**Reference:** Flow details and IDs are in `docs/registration-flows-and-ops.md` and `lib/activecampaign.ts`.

---

## IDs (from code)

| Item | ID | Notes |
|------|-----|--------|
| **LBTA Master List** | **4** | All signups go here. |
| **Tag: Trial Request** | **82** | Applied when someone books a trial. |
| **Tag: JTT Spring 2026** | **107** | Applied when someone registers for JTT. |
| **Tag: Scholarship** | **108** | Applied when someone submits a scholarship application (if AC env is set). |

---

## Checklist — Do in ActiveCampaign

1. **List 4 — Welcome / confirmation**
   - [ ] In AC: **Automations** → create (or edit) an automation.
   - [ ] **Trigger:** Contact is added to list **ID 4** (LBTA master list).
   - [ ] **Action:** Send email — welcome / “you’re on our list” / general confirmation.
   - [ ] Save and turn on.

2. **Trial request — Trial confirmation**
   - [ ] In AC: **Automations** → create (or edit) an automation.
   - [ ] **Trigger:** Contact receives tag **ID 82** (“Trial Request” / `trial_request`).
   - [ ] **Action:** Send email — “We received your trial request; we’ll contact you within 24 hours” (or your wording).
   - [ ] Save and turn on.

3. **JTT Spring 2026 — JTT confirmation**
   - [ ] In AC: **Automations** → create (or edit) an automation.
   - [ ] **Trigger:** Contact receives tag **ID 107** (“JTT Spring 2026” / `jtt_spring_2026`).
   - [ ] **Action:** Send email — JTT registration confirmation with next steps.
   - [ ] Save and turn on.

4. **Scholarship — Application received**
   - [ ] In AC: Create tag **“Scholarship”** if it doesn’t exist; note its ID (code uses **108** — update `lib/activecampaign.ts` `CAMPAIGN_TAGS.scholarship` if your tag ID is different).
   - [ ] **Automations** → create (or edit) an automation.
   - [ ] **Trigger:** Contact receives tag **ID 108** (“Scholarship”).
   - [ ] **Action:** Send email — “We received your scholarship application and will review it shortly.”
   - [ ] Save and turn on.

---

## After setup

- New trial requests, program/year signups, newsletter signups, and (if configured) scholarship applications will be in List 4 with the right tags.
- Confirmation emails will send automatically once these automations are on.
- To change copy or timing, edit the automation or email in AC; no code change needed.
