# Compound Validate: ActiveCampaign MCP Setup

**Date:** 2026-03-15  
**Scope:** Validate that the ActiveCampaign MCP fix (manual config, no Marketplace, 422 redirect URI) is correct and actionable.

---

## Validation Summary

### Overall: PASS (config and docs) / CONDITIONAL (runtime)

| Validator        | Result | Details |
|------------------|--------|---------|
| Config           | PASS   | `.cursor/mcp.json` valid JSON; `mcpServers.activecampaign` has `url` and `headers.Authorization`. |
| Gitignore        | PASS   | `.cursor/mcp.json` listed in `.gitignore` (secrets not committed). |
| Documentation    | PASS   | `docs/activecampaign-mcp-setup.md` documents 422 cause, “Do not use Marketplace,” and manual-only steps. |
| Endpoint reach   | PASS   | `https://tennisbeast.activehosted.com/api/agents/mcp/http` responds (no connection/DNS errors). |
| Endpoint auth    | NOTE   | GET with token (query or Bearer) returns **401** (introspection/opaque token message). May be expected if AC only accepts in-app or POST MCP protocol; or token may need refresh. |

---

## Checks Performed

1. **Config**
   - Read `.cursor/mcp.json`: valid JSON, `activecampaign.url` includes token, `activecampaign.headers.Authorization` present.
   - Node parse of `.cursor/mcp.json`: no syntax error, `mcpServers.activecampaign.url` present.

2. **Secrets**
   - `.gitignore` contains `.cursor/mcp.json` → local token not committed.

3. **Docs**
   - Troubleshooting explains 422 and `redirectUris[0]`.
   - Explicit “Do not use Cursor Marketplace for ActiveCampaign” and “use only manual config.”
   - Step 4 covers “If you see HTTP 422 redirectUris” → remove Marketplace server, use only mcp.json.

4. **Runtime (curl)**
   - GET with token in query → HTTP **401**.
   - GET with `Authorization: Bearer <token>` → HTTP **401**, body: “Failed to introspect opaque token, HTTP error from introspection service.”
   - No **422** when calling the URL directly with token (422 only occurs when Cursor plugin does OAuth registration with `cursor://` redirect).

---

## Blockers

- **None.** Config and docs are correct for the manual-only, no-Marketplace fix.

---

## Warnings

- **401 from endpoint:** With the current token, the MCP endpoint returns 401. Possible reasons: (1) token expired or rotated, (2) endpoint expects MCP protocol (e.g. POST) or Cursor-specific flow, not plain GET. If in Cursor the `activecampaign` server still shows “Error” after removing the Marketplace plugin and restarting, regenerate the token in ActiveCampaign (Settings → Developer) and update `.cursor/mcp.json`.

---

## Decision

- **Ready for user verification:** Remove Marketplace ActiveCampaign MCP (if present), keep only manual `.cursor/mcp.json`, restart Cursor, then check Settings → Tools & MCP for `activecampaign` status. If still error, check MCP Logs and refresh token in AC.

---

## Success Criteria (user-facing)

- [ ] Marketplace ActiveCampaign MCP removed.
- [ ] Only one ActiveCampaign entry (from `.cursor/mcp.json`) in Tools & MCP.
- [ ] After restart, `activecampaign` does not show red “Error” (or MCP Logs no longer show 422 redirectUris).
- [ ] If 401 in logs, regenerate token in AC and update `mcp.json`, then restart again.
