# How to Get Your GHL Workflow ID

**Purpose:** The LBTA site needs `GHL_WORKFLOW_ID` in Vercel so that form submissions can add contacts to a GoHighLevel workflow (e.g. to send an automated SMS). This doc explains how to create the workflow and get its ID.

---

## 1. Create the workflow in GHL

1. Log in to GoHighLevel and open the **location** you use for LBTA (the one you set as `GHL_LOCATION_ID`).
2. Go to **Automations** (or **Workflows** / **Marketing** → **Automations**, depending on your GHL layout).
3. Create a **new workflow** (e.g. name: **LBTA Website – SMS**).
4. Set the **trigger** to **Contact added to workflow** (or Contact enters workflow). The website will add contacts to this workflow via the API.
5. Add a **step** that sends an **SMS** to the contact (e.g. thanks message).
6. Save and turn the workflow **on**.

---

## 2. Get the workflow ID

### Option A — From the workflow URL

1. Open the workflow you created.
2. Look at the browser URL. It often looks like: `.../location/LOCATION_ID/workflows/WORKFLOW_ID` or `.../automation/WORKFLOW_ID`.
3. The **WORKFLOW_ID** is the long string in that URL. Copy it.

### Option B — From workflow settings

1. Open the workflow.
2. Go to **Settings** or **Workflow settings** (gear icon).
3. Some GHL accounts show **Workflow ID** or **API ID** there. Copy that value.

### Option C — From the connection check script

If you run `npm run connection-check -- --ping` and the script lists workflows for your location, it will print workflow IDs and names. Use the ID of your LBTA Website SMS workflow.

---

## 3. Add the ID to Vercel

1. In **Vercel** → LBTA project → **Settings** → **Environment Variables**, add or edit **GHL_WORKFLOW_ID** with the workflow ID.
2. Scope to Production (and Preview if you use it).
3. **Redeploy** production so the new variable is used.

---

## 4. Verify

- Run `npm run connection-check` or `npm run lead` and confirm all three GHL vars are set.
- Submit a test form with a phone number; confirm the contact appears in GHL and is in the workflow and that the SMS is sent.

**Related:** [gohighlevel-setup-checklist.md](./gohighlevel-setup-checklist.md) | [ac-ghl-connected-onepager.md](./ac-ghl-connected-onepager.md)
