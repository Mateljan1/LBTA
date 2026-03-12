# Registration Flows & Operations

**Purpose:** Single reference for where each form's data goes and what the user sees. Use this when tracking leads, setting up automations, or debugging registration.

---

## Flow overview

| Form / entry point | API | Notion | ActiveCampaign | GoHighLevel (SMS) | Supabase (leads) | User sees |
|--------------------|-----|--------|---------------|-------------------|------------------|-----------|
| Trial / Book (modal, adult-trial, junior-trial, contact, HomeCTA, beginner) | `/api/book` | — | List 4 + tags (trial, program) | Yes (if GHL env set) | — | Redirect `/thank-you` (default trial copy) |
| Program registration (LuxuryRegistrationModal) | `/api/register-program` | Yes | List 4 + class tag | Yes (if GHL env set) | — | Success in modal → redirect `/thank-you?type=program` |
| Year / camps / JTT (LuxuryYearModal) | `/api/register-year` | Yes | List 4 + season/camp/JTT tags | Yes (if GHL env set) | — | Success in modal → redirect `/thank-you?type=year` |
| Newsletter, Exit intent | `/api/newsletter` | — | List 4 | Yes (if GHL env set) | — | Inline success |
| Scholarship | `/api/scholarship` | — | List 4 + Scholarship tag (if AC env set) | Yes (if GHL env set) | Yes (if env set) | Redirect `/thank-you?type=scholarship` |
| JTT registration | `/api/jtt-registration` | — | List 4 + JTT tag | Yes (if GHL env set) | — | Redirect / thank-you as configured |
| Generic register | `/api/register` | — | — | — | Yes (if env set) | (No UI caller in codebase) |

---

## Where to look

- **Notion** — Program and year-round registrations (camps, JTT, seasonal). Source of truth for “who signed up for what” for classes/camps.
- **ActiveCampaign** — All contacts who get email. List 4 = LBTA master list. Tags segment by trial, program, JTT, scholarship, etc. Confirmation emails and **internal team notification emails** are sent by AC automations (see `docs/activecampaign-setup-checklist.md`).
- **GoHighLevel** — When `GHL_API_KEY`, `GHL_LOCATION_ID`, and `GHL_WORKFLOW_ID` are set, form submissions create/find a contact and add them to a workflow. Use that workflow to send **SMS** to the client. See `docs/gohighlevel-setup-checklist.md`.
- **Supabase** — Optional lead backup. When `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` are set, form submissions are also stored in the `leads` table. Use for scholarship backup and lead history if not using AC for scholarship.

---

## Thank-you page

- **URL:** `/thank-you`. Optional query: `?type=trial|program|year|scholarship`.
- **Behavior:** Headline and first line change by type; “What Happens Now” and contact sections stay the same.
- **Defaults:** Missing or invalid `type` is treated as `trial`.

---

## ActiveCampaign confirmation checklist

**Step-by-step setup:** See **`docs/activecampaign-setup-checklist.md`** for a checklist you can follow in the AC UI.

Confirmation emails are **not** sent by the website. They are sent by ActiveCampaign automations. Set these up in AC so users get a confirmation after each action.

| Trigger | What to set in AC | Purpose |
|---------|-------------------|--------|
| **Contact added to List 4** | Automation: When contact is added to list ID **4** → send welcome/confirmation email | General confirmation for any new signup |
| **Tag: Trial Request** | Automation: When contact receives tag ID **82** (`trial_request`) → send trial confirmation | Trial / book requests |
| **Tag: JTT Spring 2026** | Automation: When contact receives tag ID **107** (`jtt_spring_2026`) → send JTT confirmation | JTT registrations |
| **Tag: Scholarship** | Automation: When contact receives tag ID **108** (`scholarship`) → send “we received your application” | Scholarship applications (if scholarship → AC is enabled) |

**Code reference:** List ID and tag IDs are in `lib/activecampaign.ts`: `LBTA_LIST_ID`, `CAMPAIGN_TAGS`, `CLASS_TAGS`. Create the “Scholarship” tag in AC if it doesn’t exist; if the ID is not 108, update `CAMPAIGN_TAGS.scholarship` in that file.

---

## Environment

- **ActiveCampaign:** `ACTIVECAMPAIGN_URL`, `ACTIVECAMPAIGN_API_KEY` — required for book, register-program, register-year, newsletter; optional for scholarship (when set, scholarship adds contact + Scholarship tag).
- **Notion:** `NOTION_API_KEY`, `NOTION_DATABASE_ID` — required for register-program and register-year.
- **GoHighLevel:** `GHL_API_KEY`, `GHL_LOCATION_ID`, `GHL_WORKFLOW_ID` — optional; when all three are set, form submissions also sync to GHL and the contact is added to the given workflow (e.g. for SMS). See `docs/gohighlevel-setup-checklist.md`.
- **Supabase:** `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY` — optional; when set, leads (including scholarship) are stored in `leads` table.
