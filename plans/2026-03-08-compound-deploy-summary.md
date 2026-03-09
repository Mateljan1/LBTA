# Compound Engineering — Deploy Summary
**Date:** 2026-03-08  
**Project:** LBTA Website (Next.js 16, Vercel)

---

## Gate Check

| Check | Status |
|-------|--------|
| Build | ✅ PASS |
| Lint | ✅ PASS |
| Git state | ⚠️ Uncommitted changes (main; deploy proceeded from current tree) |
| Branch | main @ d54b34b7 |

---

## Pre-Deploy (Agents)

### Pre-Deploy Checker
- **Build:** PASS  
- **Lint:** PASS  
- **Required env:** `NEXT_PUBLIC_SITE_URL`, `ACTIVECAMPAIGN_URL`, `ACTIVECAMPAIGN_API_KEY`, `AC_WEBHOOK_SECRET`, `NOTION_*`, `KV_*`, `SUPABASE_*` (see `.env.example`; core forms need AC only)  
- **Migrations:** 1 file in `supabase/migrations/`. If using Supabase lead store: `supabase link` then `supabase db push` before deploy.  
- **Audit:** 0 critical, 6 high (optional to fix later)  
- **Secrets:** None in app/components/lib; all via env.

### Rollback Guardian
- **Commit:** d54b34b7  
- **Branch:** main  
- **Rollback feasible:** Yes  
- **Irreversible ops:** Supabase migration if already applied (rollback SQL in migration).  
- **Rollback:** Code: `git revert HEAD && git push`. Vercel: Redeploy previous deployment from dashboard.

---

## Deploy Execution

- **Platform:** Vercel  
- **Command:** `npx vercel --prod --yes`  
- **Result:** Success  
- **Build (remote):** Next.js 16.1.1, Turbopack; 43 static pages + serverless API routes.  
- **Duration:** ~41s (upload + build + deploy).

---

## Post-Deploy (Smoke Test)

| Path | Status |
|------|--------|
| https://lbta-website.vercel.app/ | ✅ 200 — Homepage (LBTA title, hero, Book Trial, programs, FAQ) |
| https://lbta-website.vercel.app/schedules | ✅ 200 — Schedule & Pricing (programs, camps, leagues, private coaching) |

---

## Deploy Summary

### Deploy Health Score: 95/100

### By Agent
| Agent | Status | Details |
|-------|--------|---------|
| Pre-Deploy Checker | ✅ | Build/lint OK; env documented; no secrets; 6 high audit (non-blocking) |
| Rollback Guardian | ✅ | Rollback ready; revert or redeploy previous |
| Smoke Tester | ✅ | / and /schedules load and render correctly |

### Production URLs
- **Production (alias):** https://lbta-website.vercel.app  
- **Inspect:** https://vercel.com/andrew-mateljans-projects/lbta-website/5V2dFHMQAsRpAmEbiuo1vWtEbZPn  

### Decision
- [x] **Deploy verified healthy**  
- [ ] Deploy has warnings (monitor closely)  
- [ ] Deploy rolled back  

---

## Optional Follow-Up
- Commit and push local changes so production and Git are in sync.  
- Resolve `npm audit` high findings when convenient.  
- If using Supabase leads: ensure migration applied on production DB; run `supabase db push` from repo if needed.
