# Compound Review: ActiveCampaign MCP Not Connecting

**Date:** 2026-03-15  
**Scope:** Why the ActiveCampaign MCP still shows "Error" in Cursor and how to fix it.

---

## Review summary

| Category        | Status | Notes |
|----------------|--------|------|
| Config format   | OK     | `mcp.json` structure and URL/headers are valid per Cursor docs. |
| Auth attempts   | Done   | Tried token-in-URL and Bearer header; config now has both. |
| Cursor behavior | Known  | Remote MCPs have known issues (tool list, misleading OAuth/404). |
| Recommended path| Change| Prefer **Cursor Marketplace → Add to Cursor** over manual URL. |

---

## Findings

### 1. Manual `mcp.json` config

- **Current:** `activecampaign` uses `url` with `?token=...` and `headers.Authorization: Bearer <token>`.
- **Verdict:** Format is correct. If the server still errors, the cause is likely server-side (token/URL format) or Cursor’s handling of this remote MCP, not a typo in our JSON.

### 2. Cursor + remote MCP (from forum/docs)

- **Known issue:** [Forum thread](https://forum.cursor.com/t/mcp-connecting-to-remote-server-with-oauth-partially-succeeds/148652): remote MCP can “connect” but tools don’t show or can’t be deselected; fix in progress.
- **Token/404:** Expired or invalid Bearer token can produce a misleading OAuth/404 (e.g. from `/register`) instead of a clear auth error.
- **Recommendation:** Use **one-click install** from Cursor Marketplace so Cursor manages the connection and auth (OAuth flow) instead of manual URL/token.

### 3. ActiveCampaign’s “Remote MCP URL”

- AC expects the **exact** URL from **Settings → Developer** (unique per account). It may be:
  - Base only: `https://tennisbeast.activehosted.com/api/agents/mcp/http`
  - Or a full URL with token/path — we don’t know the exact format AC returns.
- If AC’s copy gives one long URL, that entire string must be used as `url` in `mcp.json`; our token-in-URL and Bearer header are a best guess.

---

## Actions taken

1. **Config:** `.cursor/mcp.json` now has both token-in-URL and `Authorization: Bearer` so the server can accept either.
2. **Docs:** `docs/activecampaign-mcp-setup.md` updated:
   - **Option A (recommended):** Install via Cursor Marketplace (Tools & MCP → search ActiveCampaign → Add to Cursor).
   - **Option B:** Manual config + troubleshooting (MCP Logs, token regeneration, known Cursor remote-MCP issues).

---

## Root cause of HTTP 422 (from MCP logs)

**ActiveCampaign rejects Cursor’s OAuth redirect URI.** When the ActiveCampaign MCP is added via **Cursor Marketplace**, Cursor runs an OAuth flow and sends `redirectUris[0] = "cursor://anysphere.cursor-mcp/oauth/callback"`. ActiveCampaign returns **HTTP 422**: “This value is not a valid URL” for `data/attributes/redirectUris[0]` because it only accepts `https://` URLs. So the Marketplace integration cannot work until AC supports `cursor://` or Cursor uses an https redirect. **Fix:** Do not use Marketplace for ActiveCampaign. Remove the Marketplace-added ActiveCampaign MCP and use **only** the manual `.cursor/mcp.json` config (URL + token in query or header).

1. **Remove the Marketplace ActiveCampaign MCP (required)**  
   - Cursor → **Settings** → **Tools & MCP** → find **ActiveCampaign** (the one added via “Add to Cursor”) → **Remove** or **Disable**.  
   - This stops the OAuth flow that triggers the 422. After that, only the manual entry in `.cursor/mcp.json` (with token in URL or headers) is used.

2. **If you stay on manual config**  
   - In ActiveCampaign: **Settings → Developer** → copy the **entire** Remote MCP URL.  
   - Replace the `activecampaign.url` in `.cursor/mcp.json` with that exact string (and remove or keep headers as needed).  
   - Fully quit and restart Cursor.

3. **If it still errors**  
   - Open **MCP Logs** (`Cmd+Shift+U` → **MCP**), find the `activecampaign` error line, and note the message (e.g. 401, 404, connection refused).  
   - In AC, regenerate the API/MCP token in **Settings → Developer** and update the token in the URL or header.  
   - Check firewall/proxy for `tennisbeast.activehosted.com`.

---

## Success criteria

- [ ] ActiveCampaign MCP appears under Tools & MCP without a red “Error”.
- [ ] Agent can call at least one AC tool (e.g. list contacts or lists) when asked.
- [ ] If using manual config, the exact Remote MCP URL from AC is used in `mcp.json`.

---

## References

- [Cursor MCP docs](https://cursor.com/help/customization/mcp) — URL + headers format.
- [ActiveCampaign MCP (developers)](https://developers.activecampaign.com/page/mcp) — Get Connected.
- [ActiveCampaign Connect (lp)](https://www.activecampaign.com/lp/mcp) — Setup and prompts.
- [Cursor forum: Remote MCP OAuth partially succeeds](https://forum.cursor.com/t/mcp-connecting-to-remote-server-with-oauth-partially-succeeds/148652) — Known tool-list issue.
