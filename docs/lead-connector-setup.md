# Lead Connector (GoHighLevel API v2) — LBTA Setup

**Purpose:** The LBTA site uses the **Lead Connector API** (GoHighLevel API v2) at `https://services.leadconnectorhq.com` to create contacts and enroll them in your "LBTA Website – SMS" workflow. This doc describes the best-practice setup.

---

## How it works

1. **Form submission** (trial, newsletter, program, scholarship, JTT) is sent to the LBTA API.
2. The API sends the contact to **ActiveCampaign** (required) and optionally to **GoHighLevel**.
3. When GHL is configured, the site calls the **Lead Connector API**:
   - **POST** `https://services.leadconnectorhq.com/contacts/` — create (or update) the contact with `locationId`, email, name, phone.
   - **POST** `https://services.leadconnectorhq.com/contacts/{contactId}/workflow/{workflowId}` — add the contact to your workflow (e.g. LBTA Website – SMS).
4. Your workflow runs (e.g. sends the thank-you SMS). No code changes needed for the workflow itself.

---

## Required environment variables (Vercel)

| Variable | Description |
|----------|-------------|
| `GHL_API_KEY` | Your GHL/Lead Connector API key (e.g. location API key or private integration token). Used as `Authorization: Bearer <key>`. |
| `GHL_LOCATION_ID` | Your GHL location (sub-account) ID, e.g. `8ade6txYiQIoYglbSXVr`. |
| `GHL_WORKFLOW_ID` | The workflow ID that sends the SMS, e.g. `0a594eb1-742f-4484-b49c-289b907b950d`. |

All three must be set for GHL to run. If any is missing, the site skips GHL and only uses ActiveCampaign.

---

## Optional: API base URL

The app uses **Lead Connector** (`https://services.leadconnectorhq.com`) by default and sends the **Version: 2021-07-28** header required by the v2 API.

If you need to use the legacy REST API instead, set in Vercel:

- **`GHL_API_BASE`** = `https://rest.gohighlevel.com/v1`

Then the code will use that base URL and will not send the Version header. Only override if you have a specific reason (e.g. legacy account).

---

## Best-practice checklist

- [ ] **GHL_API_KEY**, **GHL_LOCATION_ID**, and **GHL_WORKFLOW_ID** are set in Vercel (production and preview if you use it).
- [ ] Workflow **"LBTA Website – SMS"** is **Published** in GHL, with trigger **Contact Created** (or Contact added to workflow) and action **Send SMS**.
- [ ] After changing env vars, **redeploy** production so the app uses them.
- [ ] Test: submit a trial or newsletter form with a phone number; confirm the contact appears in GHL and receives the workflow SMS.

---

## References

- **Workflow ID:** [how-to-get-ghl-workflow-id.md](./how-to-get-ghl-workflow-id.md)
- **Full GHL checklist:** [gohighlevel-setup-checklist.md](./gohighlevel-setup-checklist.md)
- **AC + GHL one-pager:** [ac-ghl-connected-onepager.md](./ac-ghl-connected-onepager.md)
- **Code:** `lib/gohighlevel.ts` — `sendToGHL()` is called from book, register-program, register-year, newsletter, scholarship, and jtt-registration APIs after ActiveCampaign success.
