# Connecting AC + GHL — Using MCPs and Tools

**Purpose:** Use Cursor’s Vercel and GoHighLevel MCPs (and docs) to audit and complete the connection. ActiveCampaign has no MCP — use the AC UI and checklists.

---

## Connection status (from MCP checks)

| System | MCP | Status | What you can do |
|--------|-----|--------|------------------|
| **Vercel** | `user-vercel` | 403 on list projects — token invalid or not authorized | Re-auth the Vercel integration or add a valid token so you can list projects and env vars, and optionally create env vars from Cursor. |
| **GoHighLevel** | `user-gohighlevel` | Connected | List pipelines, create/search contacts, send SMS from Cursor. Pipelines listed (e.g. “LBTA Lead to Member”, “New Leads Pipeline”) are **opportunity pipelines**. Website SMS uses an **Automation Workflow** — create that in GHL UI and set its ID as `GHL_WORKFLOW_ID` in Vercel. |
| **ActiveCampaign** | — | No MCP | Use [activecampaign-setup-checklist.md](./activecampaign-setup-checklist.md) and AC UI. Add `ACTIVECAMPAIGN_URL` and `ACTIVECAMPAIGN_API_KEY` in Vercel. |

---

## 1. Vercel MCP — env vars (once token is valid)

With a valid Vercel token, you can:

1. **List projects**  
   `vercel_list_projects` → find the LBTA project and note its `id` (or name).

2. **Audit env vars**  
   `vercel_list_env_vars` with `projectId` = that project → see which of `ACTIVECAMPAIGN_URL`, `ACTIVECAMPAIGN_API_KEY`, `GHL_API_KEY`, `GHL_LOCATION_ID`, `GHL_WORKFLOW_ID` are set.

3. **Create env vars (if you have values)**  
   `vercel_create_env_var` with `projectId`, `key`, `value`, `target` (e.g. `["production"]`).  
   **Security:** Prefer adding secrets in the Vercel Dashboard; use MCP only if you supply values in a secure way (e.g. env var in your shell, not pasted in chat).

4. **Redeploy**  
   After changing env vars, trigger a new production deploy (Dashboard or `vercel --prod` from repo).

---

## 2. GoHighLevel MCP — what’s available

Your GHL MCP is connected. You can use it from Cursor for:

- **ghl_list_pipelines** — Lists opportunity pipelines (e.g. LBTA Lead to Member, New Leads). Not the same as Automation Workflows.
- **ghl_create_contact** — Create a contact (firstName required; email, phone, lastName, tags optional). Useful to test that GHL is reachable.
- **ghl_search_contacts** / **ghl_get_contact** — Find contacts.
- **ghl_send_sms** — Send an SMS (for testing or one-off use).

The **website** needs an **Automation Workflow** (trigger: contact added to workflow; action: send SMS). That workflow is created in the GHL UI; the MCP does not expose “list workflows” or “create workflow.” After you create it, copy the workflow ID into Vercel as `GHL_WORKFLOW_ID`.

---

## 3. ActiveCampaign — no MCP

- Build the **“LBTA Confirmations”** automation in the AC UI using [activecampaign-setup-checklist.md](./activecampaign-setup-checklist.md).
- Get **API URL** and **API key** from AC → Settings → Developer.
- Add `ACTIVECAMPAIGN_URL` and `ACTIVECAMPAIGN_API_KEY` in Vercel (Dashboard or Vercel MCP once token works).

---

## 4. End-to-end flow (all connected)

1. **Vercel:** `ACTIVECAMPAIGN_URL` + `ACTIVECAMPAIGN_API_KEY` set → forms sync to AC.  
   Optional: `GHL_API_KEY` + `GHL_LOCATION_ID` + `GHL_WORKFLOW_ID` set → forms also create GHL contact and add to workflow (SMS).

2. **ActiveCampaign:** One automation “LBTA Confirmations” (List 4 + tags 82, 107, 108, 33) → client email + internal email.

3. **GoHighLevel:** One Automation Workflow “LBTA Website – SMS” (contact added → send SMS) → workflow ID in `GHL_WORKFLOW_ID`.

4. **Verify:** Submit newsletter and trial on the site; confirm contact in AC (and GHL if configured), emails received, and SMS if phone provided.

---

## 5. Quick reference

| Goal | Where |
|------|--------|
| One-pager for connecting | [ac-ghl-connected-onepager.md](./ac-ghl-connected-onepager.md) |
| AC automation steps | [activecampaign-setup-checklist.md](./activecampaign-setup-checklist.md) |
| GHL workflow + env | [gohighlevel-setup-checklist.md](./gohighlevel-setup-checklist.md) |
| Form → API → systems | [registration-flows-and-ops.md](./registration-flows-and-ops.md) |
| Phased implementation plan | `plans/activecampaign-ghl-connect-plan.md` |
