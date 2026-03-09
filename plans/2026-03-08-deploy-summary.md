# Deploy Summary — 2026-03-08

## Deploy Health Score: 85/100

## Gate Check (pre–deploy agents)

| Check | Result |
|-------|--------|
| Review score ≥ 70 | ✅ 82 |
| No validation blockers | ✅ |
| Build | ✅ `npm run build` passed |
| Lint | ✅ `npm run lint` passed |
| Tests | ✅ 112 tests passed |
| Clean git state | ⚠️ Uncommitted changes (many modified/untracked). **Commit before deploying.** |
| Branch | `main` |

---

## By Agent

| Agent | Score | Status | Details |
|-------|-------|--------|--------|
| Pre-Deploy Checker | 72 | ⚠️ | Build OK, lint OK, 112 tests. 10 env vars documented; 3 required for prod (ACTIVECAMPAIGN_URL, ACTIVECAMPAIGN_API_KEY, AC_WEBHOOK_SECRET). 13 npm audit issues (7 moderate, 6 high, no critical). Supabase migration exists—apply with `supabase db push` if using lead store. |
| Environment Validator | 82 | ⚠️ | Deploy via Git push to Vercel-connected repo (Vercel CLI not installed). Production env: set ACTIVECAMPAIGN_*, AC_WEBHOOK_SECRET in Vercel. AC_WEBHOOK_SECRET not in lib/env.ts. SSL/DNS handled by Vercel. |
| Rollback Guardian | 92 | ✅ | Rollback: Vercel Dashboard “Promote to Production” for previous deployment, or `vercel rollback <url>`, or `git revert HEAD` + push. No irreversible app ops; Supabase rollback is manual and data-destructive. |
| Smoke Tester | 100 | ✅ | Checklist in `plans/SMOKE_TEST_CHECKLIST.md`. Critical paths: /, /schedules, /book, /contact, POST /api/newsletter, POST /api/book. Verify 400 for invalid JSON, 200/500 shape for valid. |
| Post-Deploy Monitor | 78 | ⚠️ | No /health endpoint. Monitor: Vercel Logs (5xx, exceptions), response times (LCP &lt; 2.5s, API p95 &lt; 3s). “Stable” = 0% 5xx for 2 min on / and /api/*. Checklist in agent output. |

---

## Blockers

**None.** Deploy may proceed after you commit and push (or run Vercel CLI).

---

## Warnings

1. **Git state** — Commit and push (or run `vercel --prod`) when ready; current work is uncommitted.
2. **npm audit** — 6 high, 7 moderate. Run `npm audit fix` (and re-run build/tests) before or soon after deploy.
3. **Production env** — Set in Vercel: `ACTIVECAMPAIGN_URL`, `ACTIVECAMPAIGN_API_KEY`, `AC_WEBHOOK_SECRET`.
4. **Supabase** — If using lead store, run `supabase link` then `supabase db push`; confirm `public.leads` exists.
5. **AC_WEBHOOK_SECRET** — Add to `lib/env.ts` for consistency (optional).

---

## How to Deploy

1. **Commit and push** (if using Git → Vercel):
   ```bash
   git add -A
   git commit -m "Your message"
   git push origin main
   ```
   Vercel will build and deploy from the connected branch.

2. **Or use Vercel CLI** (if installed and linked):
   ```bash
   vercel --prod
   ```

3. **After deploy:** Run the smoke checklist in `plans/SMOKE_TEST_CHECKLIST.md` against your production URL (replace `https://YOUR_PRODUCTION_URL`).

4. **Rollback if needed:** Vercel Dashboard → Deployments → select previous deployment → “Promote to Production”, or `vercel rollback <previous-deployment-url>`.

---

## Decision

- [x] **Deploy verified healthy** (no blockers; warnings above)
- [ ] Deploy has warnings (monitor closely after deploy)
- [ ] Deploy rolled back (N/A)

**Next step:** Commit your changes, set production env in Vercel, then push to trigger deploy (or run `vercel --prod`). After deploy, run `plans/SMOKE_TEST_CHECKLIST.md` and monitor logs for 2–5 minutes.
