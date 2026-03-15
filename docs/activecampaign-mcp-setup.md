# ActiveCampaign MCP — Setup and Compound-Engineering Workflows

**Purpose:** Use the ActiveCampaign MCP in Cursor to manage contacts, campaigns, automations, and lists—and to automate workflows as part of compound-engineering (plan → work → review → validate → deploy → compound).

---

## 1. Configuration

### MCP URL (already set)

In `.cursor/mcp.json`:

```json
"activecampaign": {
  "url": "https://tennisbeast.activehosted.com/api/agents/mcp/http"
}
```

- **Account:** tennisbeast (LBTA)
- **API base (for site forms):** `https://tennisbeast.api-us1.com` — used by `ACTIVECAMPAIGN_URL` in Vercel and `lib/activecampaign.ts`.

### First-time connection

1. **Reload Cursor** (or reopen the project) so it loads the `activecampaign` MCP.
2. If Cursor shows **“Needs login”** or an ActiveCampaign auth prompt for the MCP, complete sign-in in the browser (AC may use the same account as tennisbeast.activehosted.com).
3. After that, the agent can call ActiveCampaign tools when you ask about contacts, lists, campaigns, automations, or deals.

---

## 2. What the MCP provides

Typical tool categories (names may vary by AC MCP version):

- **Contact management** — Create, retrieve, update contacts; add tags and custom fields.
- **Campaign operations** — Manage email campaigns and marketing sequences.
- **Automation** — Configure and trigger automation rules.
- **Deal pipeline** — Track deals and pipeline stages.
- **List management** — Create and manage contact lists and segments.
- **Custom fields** — Manage extended contact data.

Use Cursor’s **Tools & MCP** sidebar to see the exact tools exposed by the `activecampaign` server and toggle them as needed.

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

---

## 5. Quick reference

| Item | Value |
|------|--------|
| MCP server name | `activecampaign` |
| MCP URL | `https://tennisbeast.activehosted.com/api/agents/mcp/http` |
| AC UI / login | [tennisbeast.activehosted.com](https://tennisbeast.activehosted.com) |
| API base (env) | `https://tennisbeast.api-us1.com` |
| List/lag IDs in code | `lib/activecampaign.ts` (`LBTA_LIST_ID`, `CAMPAIGN_TAGS`, `CLASS_TAGS`) |
| AC automation checklist | [activecampaign-setup-checklist.md](./activecampaign-setup-checklist.md) |
| AC + GHL connection | [ac-ghl-connection-via-mcps.md](./ac-ghl-connection-via-mcps.md) |

---

## 6. Troubleshooting

- **MCP not listed:** Ensure `.cursor/mcp.json` has the `activecampaign` entry and reload Cursor.
- **Auth / “Needs login”:** Complete the in-browser sign-in for the ActiveCampaign MCP when Cursor prompts.
- **Site forms not syncing:** That uses Vercel env vars and the REST API, not the MCP. Check `ACTIVECAMPAIGN_URL` and `ACTIVECAMPAIGN_API_KEY` in Vercel and [activecampaign-setup-checklist.md](./activecampaign-setup-checklist.md).
