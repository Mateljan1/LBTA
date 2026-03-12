# Connecting AC + GHL — Using MCPs and Tools

**Purpose:** Use Cursor’s Vercel and GoHighLevel MCPs (and docs) to audit and complete the connection. ActiveCampaign has no MCP — use the AC UI and checklists.

---

## Connect Vercel MCP (one-time)

This project includes `.cursor/mcp.json` pointing at Vercel’s official MCP (`https://mcp.vercel.com`). To connect:

1. **Reload Cursor** (or reopen the project) so it picks up the MCP.
2. In Cursor, when you see **“Needs login”** or a Vercel MCP auth prompt, **click it** and complete the browser sign-in to authorize Cursor for your Vercel account.
3. After that, the agent can list projects, list/create env vars, and manage deployments for this project.

If you use a different MCP config (e.g. global), ensure the Vercel server URL is `https://mcp.vercel.com` and that you’ve completed the OAuth login in Cursor.

**If the UI shows "Vercel connected" but the agent still gets 403:** The token may not be passed to this session. Try starting a **new chat** or **restarting Cursor**, then ask the agent to list Vercel projects or env vars again. If it still fails, add env vars manually in [Vercel Dashboard → Project → Settings → Environment Variables](https://vercel.com/dashboard).

**CLI with token:** This project can use a Vercel API token from `.env.vercel` (file is gitignored). To run Vercel CLI with it: `export $(grep -v '^#' .env.vercel | xargs)` then `npx vercel whoami` or `npm run check:vercel`. The agent can use the same for list projects, env vars, and deploy.

---

## Connection status (from MCP checks)

| System | MCP | Status | What you can do |
|--------|-----|--------|------------------|
| **Vercel** | `vercel` | Connect via “Needs login” in Cursor (OAuth to mcp.vercel.com). | Once connected: list projects, list/create env vars, deploy. |
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
