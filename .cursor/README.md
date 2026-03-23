# Cursor config (this project)

- **MCP config:** `.cursor/mcp.json` — defines **vercel** (Bearer token in `headers`) and **activecampaign** (local Node server). File is **gitignored** (secrets not committed).
- **Template:** `.cursor/mcp.json.example` — safe to commit; copy to `mcp.json` and fill in tokens.
- **Vercel plugin:** `.cursor/settings.json` enables the **Vercel** plugin (deploy + React/Next best-practices skills).
- **Get both working:** Follow **[.cursor/MCP_CHECKLIST.md](.cursor/MCP_CHECKLIST.md)** step by step (remove Marketplace duplicates, Vercel token or OAuth, ActiveCampaign token, then restart Cursor).
- **Compound learnings:** `.cursor/compound/` — see that folder’s README.
