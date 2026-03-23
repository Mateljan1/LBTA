# Vercel Environment Variable Setup: AGENT_SECRET

**Purpose:** Configure `AGENT_SECRET` in Vercel so agent tools can authenticate when calling production APIs.

---

## Steps

1. **Get your secret value:**
   ```bash
   # From your local .env.local
   grep "^AGENT_SECRET=" .env.local
   # Or generate a new one for production:
   node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
   ```

2. **Add to Vercel:**
   - Go to your Vercel project dashboard
   - Settings → Environment Variables
   - Add:
     - **Name:** `AGENT_SECRET`
     - **Value:** (paste the secret from step 1)
     - **Environments:** Production (and Preview if you test agent tools there)

3. **Redeploy:**
   - After adding the variable, trigger a new deployment (or wait for next push)
   - The variable will be available to all API routes via `process.env.AGENT_SECRET`

---

## Security Notes

- **Never commit** `AGENT_SECRET` to git (already in `.gitignore` via `.env*.local`)
- **Use different secrets** for production vs. preview/staging if you want isolation
- **Rotate periodically** if compromised or for security best practices
- Agent tools **require** this secret to call APIs; without it, tools will fail authentication

---

## Testing

After deployment, test an agent tool against production:

```bash
export AGENT_SECRET="your-production-secret"
export LBTA_API_URL="https://lagunabeachtennisacademy.com"
./node_modules/.bin/tsx scripts/agent-tools/newsletter.ts --email "test@example.com"
```

---

*See `scripts/agent-tools/README.md` for tool usage and `docs/solutions/architecture/agent-tools-action-parity-implementation.md` for implementation details.*
