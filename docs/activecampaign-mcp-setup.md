# ActiveCampaign MCP — Setup and Compound-Engineering Workflows

**Purpose:** Use the ActiveCampaign MCP in Cursor to manage contacts, campaigns, automations, and lists—and to automate workflows as part of compound-engineering (plan → work → review → validate → deploy → compound).

---

## 1. Configuration

### Local MCP server (recommended — works in Cursor)

The project ships a **local** ActiveCampaign MCP server in the repo (`.cursor/scripts/ac-mcp-server.mjs`) so Cursor gets access via stdio—no remote OAuth or 422 errors.

In `.cursor/mcp.json`:

```json
"activecampaign": {
  "command": "node",
  "args": [".cursor/scripts/ac-mcp-server.mjs"],
  "env": {
    "AC_API_URL": "https://tennisbeast.api-us1.com",
    "AC_API_TOKEN": "<your API key from AC Settings → Developer>"
  }
}
```

**Requirements:**
- **Node.js** (same as the project). Cursor runs from the project root so the script path is relative to that.
- **API credentials:** `AC_API_URL` and `AC_API_TOKEN` must match ActiveCampaign → Settings → Developer (API URL and API Key). Same credentials as `ACTIVECAMPAIGN_URL` and `ACTIVECAMPAIGN_API_KEY` in Vercel.

**First-time:** Reload Cursor (or reopen the project). The `activecampaign` server should appear under Tools & MCP without error. If you see spawn or “Cannot find module” errors, ensure `.cursor/scripts/ac-mcp-server.mjs` exists and you’re opening the project from the repo root.

---

## 2. What the MCP provides

The local server (`.cursor/scripts/ac-mcp-server.mjs`) exposes full ActiveCampaign capabilities:

**Contacts:** `ac_list_contacts`, `ac_get_contact`, `ac_create_contact`, `ac_update_contact`, `ac_add_contact_to_list`, `ac_add_tag_to_contact`

**Lists:** `ac_list_lists`, `ac_get_list`

**Tags:** `ac_list_tags`, `ac_create_tag`

**Segments:** `ac_list_segments`, `ac_get_segment`

**Campaigns:** `ac_list_campaigns`, `ac_get_campaign`, `ac_create_campaign`, `ac_edit_campaign`

**Messages (email content):** `ac_list_messages`, `ac_get_message`, `ac_create_message`, `ac_update_message`

**Automations:** `ac_list_automations`, `ac_get_automation`, `ac_add_contact_to_automation` (add a contact to a drip by ID)

**Custom fields:** `ac_list_fields`

Use Cursor’s **Tools & MCP** sidebar to see and invoke these tools.

---

## 3. Aligning MCP with site code

The **website** still uses the REST API via `lib/activecampaign.ts` and env vars in Vercel:

| Use | Where |
|-----|--------|
| Form submissions (newsletter, trial, register, scholarship) | `ACTIVECAMPAIGN_URL` + `ACTIVECAMPAIGN_API_KEY` in Vercel; `lib/activecampaign.ts` (list ID 4, tags in `CAMPAIGN_TAGS`, `CLASS_TAGS`) |
| Agent workflows from Cursor | ActiveCampaign MCP (`activecampaign` server) |

Keep list and tag IDs in `lib/activecampaign.ts` in sync with what you create or inspect via the MCP (e.g. List 4 = LBTA master list; tags 82, 107, 108, 33 for confirmations).

---

## 4. Compound-engineering workflows

Using the ActiveCampaign MCP inside the compound loop:

| Phase | How AC MCP helps |
|-------|-------------------|
| **Plan** | Research: list contacts, lists, and automations to confirm setup; verify tags/lists match `lib/activecampaign.ts`. |
| **Work** | Implement: create or update contacts, add to lists, apply tags; validate automations or campaign settings. |
| **Review** | No direct review of AC; use MCP to confirm state (e.g. “list contacts in list 4” after a form change). |
| **Validate** | Post-deploy: use MCP to confirm new contacts/tags after test form submissions; spot-check automations. |
| **Deploy** | Env vars (`ACTIVECAMPAIGN_URL`, `ACTIVECAMPAIGN_API_KEY`) stay in Vercel; MCP is for Cursor-only operations. |
| **Compound** | Document any new list/tag IDs or automation rules in `docs/activecampaign-setup-checklist.md` or this doc. |

### Example prompts (with MCP enabled)

- “List contacts in ActiveCampaign list 4 and show the last 5.”
- “Add a test contact to list 4 and tag with Trial Request (82).”
- “What automations exist in ActiveCampaign? Summarize triggers and actions.”
- “After the last deploy, check that new trial signups get tag 82 and are on list 4.”
- “Add contact 123 to automation 5” (use `ac_add_contact_to_automation` once the automation exists in AC).
- “Create a tag ‘Prospect’ in AC” (use `ac_create_tag`).

---

## 5. Quick reference

| Item | Value |
|------|--------|
| MCP server name | `activecampaign` |
| Type | Local (uvx ac-mcp-server) — no remote OAuth |
| AC_API_URL | `https://tennisbeast.api-us1.com` |
| AC UI / login | [tennisbeast.activehosted.com](https://tennisbeast.activehosted.com) |
| List/lag IDs in code | `lib/activecampaign.ts` (`LBTA_LIST_ID`, `CAMPAIGN_TAGS`, `CLASS_TAGS`) |
| AC automation checklist | [activecampaign-setup-checklist.md](./activecampaign-setup-checklist.md) |
| AC + GHL connection | [ac-ghl-connection-via-mcps.md](./ac-ghl-connection-via-mcps.md) |

---

## 6. Troubleshooting

### Fix “Error - Show Output” (MCP server errored)

**Important: Do not use Cursor Marketplace for ActiveCampaign.** The Marketplace plugin uses OAuth and sends redirect URI `cursor://anysphere.cursor-mcp/oauth/callback`. ActiveCampaign rejects this (422: “This value is not a valid URL” for `redirectUris[0]`) because it only accepts `https://` redirect URIs. You will see errors like “Invalid attribute … redirectUris[0]” in MCP logs. **Fix:** Remove the ActiveCampaign MCP if you added it via Marketplace (Settings → Tools & MCP → find ActiveCampaign → remove/disable), then use **only** the manual config below.

**Manual config in `.cursor/mcp.json` (use this only)**

The ActiveCampaign MCP uses a **Remote MCP URL** and a token. Use manual config only (no Marketplace):

1. **Get the exact URL and token from ActiveCampaign**
   - Log in at [tennisbeast.activehosted.com](https://tennisbeast.activehosted.com).
   - Go to **Settings** (gear) → **Developer**.
   - Copy the **entire** **Remote MCP URL** (the single string AC shows — it may include token or path).

2. **Update `.cursor/mcp.json`**
   - Set the `activecampaign` `url` to that exact value. If AC only shows a base URL, try appending `?token=YOUR_TOKEN` or use the `headers` block with `Authorization: Bearer YOUR_TOKEN` (see Cursor docs).

3. **Restart Cursor**
   - Fully quit Cursor (Cmd+Q on Mac) and reopen the project.

4. **If you see HTTP 422 “redirectUris[0] not a valid URL” in MCP logs**
   - You are using the **Marketplace/plugin** version of the ActiveCampaign MCP, which uses OAuth. ActiveCampaign does not accept Cursor’s `cursor://` redirect URI. **Remove** the ActiveCampaign server from Settings → Tools & MCP (remove the one that was “Added to Cursor” from Marketplace) and use **only** the entry in `.cursor/mcp.json` with the token in the URL or in `headers.Authorization`. Restart Cursor.

5. **If it still errors**
   - **MCP Logs:** `Cmd+Shift+U` → choose **MCP** in the dropdown. Check the `activecampaign` line (e.g. 401, 404, connection refused). Regenerate the token in AC Settings → Developer if needed.
   - **Known Cursor issue:** Some remote MCPs connect but tools don’t show or can’t be deselected; a fix is in progress. Workaround: use project rules to limit which tools the agent uses.
   - Ensure no firewall or proxy is blocking the MCP URL.

### Other issues

- **Local server (uvx):** If Cursor shows `spawn uvx ENOENT`, run `brew install uv` or set `command` in mcp.json to the full path of `uvx` (run `which uvx`). First run may take a few seconds while uvx installs the Python package.
- **Auth errors from ac-mcp-server:** The local server uses the **REST API** key from ActiveCampaign → Settings → Developer (same as “API Key” for the site). If you see 401 or auth errors, set `AC_API_TOKEN` in `.cursor/mcp.json` to that API Key (not the MCP “Remote MCP URL” token).
- **MCP not listed:** Ensure `.cursor/mcp.json` has the `activecampaign` entry and reload Cursor.
- **Auth / “Needs login”:** Complete the in-browser sign-in for the ActiveCampaign MCP when Cursor prompts.
- **Site forms not syncing:** That uses Vercel env vars and the REST API, not the MCP. Check `ACTIVECAMPAIGN_URL` and `ACTIVECAMPAIGN_API_KEY` in Vercel and [activecampaign-setup-checklist.md](./activecampaign-setup-checklist.md).
