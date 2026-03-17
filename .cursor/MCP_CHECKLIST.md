# Get both MCPs working (Vercel + ActiveCampaign)

Do these steps **in order**. After each step, check **Settings → Tools & MCP** (Cmd+Shift+J).

---

## Step 1: Only one config, no duplicate servers

- Your project has **one** MCP config: **`.cursor/mcp.json`** (in this repo; file is gitignored so your token isn’t committed).
- It defines **two** servers: **vercel** and **activecampaign**.

**Do this:**

1. Open **Cursor Settings** → **Tools & MCP**.
2. If you see **two** “ActiveCampaign” or **two** “Vercel” entries, one may be from the Marketplace.
3. **Remove** any server that was added via **“Add to Cursor”** / Marketplace. Keep only the ones that come from **this project’s** `.cursor/mcp.json`.
4. You should see exactly: **vercel** and **activecampaign** (each once).

---

## Step 2: Vercel

- **vercel** uses `url: https://mcp.vercel.com` (no token in file).
- It uses **OAuth** in the browser.

**Do this:**

1. In the list, find **vercel**. If it says **“Needs login”** or shows an error, click it and complete the **browser sign-in** for Vercel.
2. After logging in, **vercel** should show as connected (no red error).

---

## Step 3: ActiveCampaign

- **activecampaign** is a **local** MCP server (Node script) that talks to the ActiveCampaign REST API. In **`.cursor/mcp.json`** it is configured with `command`, `args`, and `env` (no remote URL). We do **not** use the Marketplace “Add to Cursor” for ActiveCampaign (that causes a 422 redirect URI error).

**Do this:**

1. Make sure there is **no** separate “ActiveCampaign” entry from the Marketplace (see Step 1).
2. In **`.cursor/mcp.json`**, the **activecampaign** entry should look like:
   - `"command": "node"`
   - `"args": [".cursor/scripts/ac-mcp-server.mjs"]`
   - `"env"` with **AC_API_URL** (e.g. `https://tennisbeast.api-us1.com`) and **AC_API_TOKEN** (your API key from ActiveCampaign → Settings → Developer).
3. If **activecampaign** shows a **red error** in Settings → Tools & MCP:
   - Open **MCP Logs** (Cmd+Shift+U → MCP). If you see “Cannot find module” or spawn errors, ensure you’re in the project root and the file `.cursor/scripts/ac-mcp-server.mjs` exists.
   - If you see **401** or “AC API” errors from the script, your **AC_API_TOKEN** is wrong or expired: copy the **API Key** from ActiveCampaign → Settings → Developer and set it in `mcp.json` → `activecampaign` → `env` → **AC_API_TOKEN**. Save, then quit Cursor (Cmd+Q) and reopen.

---

## Step 4: Restart Cursor

1. **Quit Cursor completely** (Cmd+Q on Mac).
2. Reopen Cursor and open **this project**.
3. Go to **Settings → Tools & MCP** again. You should see:
   - **vercel** – connected (green / no error) if you did Step 2.
   - **activecampaign** – connected (no red error) if no Marketplace duplicate and token is valid.

---

## If something still fails

- **Vercel:** Start a **new chat** and ask the agent to list Vercel projects or env vars. If you get 403, log in again via “Needs login” or re-add the server from Marketplace once and complete OAuth.
- **ActiveCampaign:** Send the **exact** error line for **activecampaign** from **MCP Logs** (Cmd+Shift+U → MCP). Spawn/module errors → check path and Node; “AC API 401” → fix **AC_API_TOKEN** in `mcp.json` env.
