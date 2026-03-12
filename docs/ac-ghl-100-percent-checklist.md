# AC + GHL 100% Setup Checklist

Use this checklist to get form submissions flowing end-to-end: **ActiveCampaign** (contact + email automation) and **GoHighLevel** (contact + SMS workflow).

---

## 1. Vercel environment variables

- [ ] **ACTIVECAMPAIGN_URL** — Set in Vercel (e.g. `https://YOUR_ACCOUNT.api-us1.com`).
- [ ] **ACTIVECAMPAIGN_API_KEY** — Set in Vercel (from AC → Settings → Developer).
- [ ] **GHL_API_KEY** — Set in Vercel (GHL location API key / JWT).
- [ ] **GHL_LOCATION_ID** — Set in Vercel (your GHL location/sub-account ID).
- [ ] **GHL_WORKFLOW_ID** — Set in Vercel (workflow used for “LBTA Website – SMS”). See [how-to-get-ghl-workflow-id.md](./how-to-get-ghl-workflow-id.md).

After any env change, **redeploy production** (e.g. Vercel Dashboard → Deployments → Redeploy, or `vercel --prod` from the repo).

---

## 2. ActiveCampaign automation

- [ ] One automation **“LBTA Confirmations”** is created and **on**.
- [ ] Triggers: contact added to **List 4** OR contact receives **tag 82, 107, 108, or 33**.
- [ ] Step 1: Conditional email **to contact** (trial / JTT / scholarship / welcome by tag).
- [ ] Step 2: Email **to your team** (e.g. support@…) with signup summary.

Details: [activecampaign-setup-checklist.md](./activecampaign-setup-checklist.md).

---

## 3. GoHighLevel workflow

- [ ] Workflow created (e.g. **“LBTA Website – SMS”**) with trigger **Contact added to workflow**.
- [ ] At least one step sends **SMS** to the contact.
- [ ] Workflow is **on**.
- [ ] Workflow ID copied into Vercel as **GHL_WORKFLOW_ID** and production redeployed.

Details: [gohighlevel-setup-checklist.md](./gohighlevel-setup-checklist.md) and [how-to-get-ghl-workflow-id.md](./how-to-get-ghl-workflow-id.md).

---

## 4. Verification (no test contacts required for env check)

- [ ] Run **`npm run connection-check`** — all required AC vars show “set”; GHL vars show “set” if you want SMS.
- [ ] Run **`npm run connection-check -- --ping`** — AC and GHL report “OK” (read-only check). If GHL lists workflows, pick your workflow ID and ensure it’s in Vercel.
- [ ] Optional: **`npm run lead`** — same env summary.

---

## 5. End-to-end test (optional but recommended)

- [ ] Submit a **newsletter** or **trial** form on the live site (or a preview deploy with env vars).
- [ ] Confirm **ActiveCampaign**: contact on List 4, correct tag(s); client receives confirmation email; your team receives internal email.
- [ ] If GHL is configured: confirm **GoHighLevel** contact exists and is in the workflow; if the form included a phone number, confirm SMS was sent.

---

## Quick reference

| Goal | Doc or command |
|------|----------------|
| One-pager | [ac-ghl-connected-onepager.md](./ac-ghl-connected-onepager.md) |
| Env + ping check | `npm run connection-check` / `npm run connection-check -- --ping` |
| Get GHL workflow ID | [how-to-get-ghl-workflow-id.md](./how-to-get-ghl-workflow-id.md) |
| Lead Connector (GHL v2) | [lead-connector-setup.md](./lead-connector-setup.md) |
| AC automation | [activecampaign-setup-checklist.md](./activecampaign-setup-checklist.md) |
| GHL workflow | [gohighlevel-setup-checklist.md](./gohighlevel-setup-checklist.md) |
| Add env to Vercel via script | `scripts/vercel-env-add.js` (see script header) |
