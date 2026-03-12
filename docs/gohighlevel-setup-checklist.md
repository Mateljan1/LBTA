# GoHighLevel (GHL) Setup — SMS After Signup

**Purpose:** When GHL is configured, every form submission (trial, program, year, newsletter, scholarship, JTT) creates a contact in GoHighLevel and adds them to a workflow. Use that workflow to send an automated **SMS** so the client gets both an email (from ActiveCampaign) and a text.

**Code:** `lib/gohighlevel.ts`. No code changes needed for setup — only configure GHL and set env vars.

---

## Prerequisites

- GoHighLevel location/sub-account with API access.
- A workflow in that location that will send the SMS (e.g. “LBTA Website – SMS”).

---

## 1. Get API key and IDs

1. In GHL, go to **Settings → API Keys** (or your location’s API/key section).
2. Create or copy an **API key** (Location API Key) for the sub-account you use for LBTA.
3. Note your **Location ID** (sub-account ID). It’s often in the URL or under Settings → Business Info.
4. Create a **workflow** (or use an existing one) that:
   - Has a trigger that can be “Contact added to workflow” (we add the contact via API).
   - Includes an **SMS** step (e.g. “Send SMS to contact”) with your message.
5. Copy the **Workflow ID** (from the workflow URL or workflow settings).

---

## 2. Set environment variables

In Vercel (or `.env.local`), set:

| Variable | Description |
|----------|-------------|
| `GHL_API_KEY` | Your GHL API key (Bearer token). |
| `GHL_LOCATION_ID` | The location/sub-account ID. |
| `GHL_WORKFLOW_ID` | The workflow ID that sends the SMS. |

All three must be set for GHL to run. If any are missing, the site skips GHL and only uses ActiveCampaign (and optional Supabase).

---

## 3. Workflow suggestion: “LBTA Website – SMS”

- **Name:** e.g. “LBTA Website – SMS”.
- **Trigger:** “Contact added to workflow” (the API adds the contact to this workflow).
- **Step 1:** Send SMS to the contact’s phone (if present). Example: “Thanks for reaching out to Laguna Beach Tennis Academy. We’ll be in touch within 24 hours.”
- Optionally add a step to add the contact to a GHL list or update a custom field.

When the website sends a submission, it will:

1. Create a contact in GHL (API may return an error if the contact already exists; we log and skip adding to workflow in that case).
2. Add that contact to this workflow.
3. Your workflow runs and sends the SMS.

---

## 4. Behavior and limits

- **Optional:** If `GHL_API_KEY`, `GHL_LOCATION_ID`, or `GHL_WORKFLOW_ID` is not set, GHL is skipped; form submissions still go to ActiveCampaign and optional Supabase.
- **Non-blocking:** If GHL fails (e.g. rate limit, invalid ID), the error is logged and the API still returns success. The user’s submission is not failed because of GHL.
- **Data sent:** Email (required), first name, last name, phone when available. Newsletter signups often have only email.

---

## 5. Checklist

- [ ] GHL location has an API key and you have the **Location ID**.
- [ ] Workflow created with an **SMS** step and **Workflow ID** copied.
- [ ] `GHL_API_KEY`, `GHL_LOCATION_ID`, and `GHL_WORKFLOW_ID` set in Vercel (or .env.local).
- [ ] Test: submit a trial or newsletter form and confirm the contact appears in GHL and receives the workflow SMS (if phone is present).

---

## Reference

- **API base:** `https://rest.gohighlevel.com/v1` (v1 REST).
- **Create contact:** `POST /contacts/` (body: `locationId`, `email`, `firstName`, `lastName`, `phone`).
- **Add to workflow:** `POST /contacts/:contactId/workflow/:workflowId`.
- **Code:** `lib/gohighlevel.ts` — `sendToGHL()` is called from book, register-program, register-year, newsletter, scholarship, and jtt-registration APIs after ActiveCampaign success.
