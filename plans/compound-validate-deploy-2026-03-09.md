# Compound: Validate → Deploy (2026-03-09)

**Scope:** Design alignment 1–3 and review fix (program labels, footer “JOIN OUR COMMUNITY”, Why Choose section, single `whyChoose` variable).

---

## 1. Validation Summary

### Overall: PASS

| Validator | Score | Status | Notes |
|-----------|-------|--------|--------|
| **Functional** | 100 | ✅ | Build succeeds; homepage `/` and `/schedules` return 200 under dev server. |
| **Build / Lint** | 100 | ✅ | `npm run build` and `npm run lint` pass; 46 static pages generated. |
| **Data integrity** | 100 | ✅ | `data/homepage-copy.json` has `whyChoose`, `programs.items` labels correct; all keys consumed by `app/page.tsx`. |
| **UI / design** | — | ✅ | No layout or token changes beyond planned (Footer heading, Why Choose section). |
| **Practice plans** | — | ➖ | N/A (LBTA; not RacquetIQ). |

### Blockers

None.

### Warnings

None.

### Decision

- [x] **Ready to ship** — No validation blockers.

---

## 2. Deploy Summary

### Deploy health: READY

| Agent | Status | Details |
|-------|--------|---------|
| **Pre-deploy** | ✅ | Build OK; lint OK; no new env vars for this change; no migrations. |
| **Environment** | ➖ | Deploy via Git push to Vercel; ensure `ACTIVECAMPAIGN_*` and `AC_WEBHOOK_SECRET` set in Vercel prod if forms/APIs used. |
| **Smoke test** | ☐ | Run after deploy: see **plans/SMOKE_TEST_CHECKLIST.md** (/, /schedules, /book, /contact). |
| **Rollback** | ✅ | Revert commit and push, or in Vercel Dashboard promote previous deployment. No DB or irreversible ops. |
| **Post-deploy** | ☐ | After push: check Vercel build logs and run smoke checklist. |

### Gate check

- [x] Build passes  
- [x] Lint passes  
- [x] No validation blockers  
- [ ] Uncommitted changes — commit and push when ready  

### How to deploy

1. **Commit and push** (Vercel builds from `main`):

   ```bash
   cd /Users/andrew-mac-studio/LBTA_WEBSITE_DRAFT_3:5:26
   git add app/page.tsx components/layout/Footer.tsx data/homepage-copy.json plans/
   git status
   git commit -m "Design alignment 1-3: program labels, JOIN OUR COMMUNITY, Why Choose; review fix"
   git push origin main
   ```

2. **After deploy**
   - Open **plans/SMOKE_TEST_CHECKLIST.md** and verify: `/`, `/schedules`, `/book`, `/contact` (200, content loads).
   - Confirm homepage: “Junior Programs”, “Adult Programs”, “Private Coaching”; footer “JOIN OUR COMMUNITY”; Why Choose section present (images may 404 until you add `public/images/why-choose/why-choose-1.webp` and `why-choose-2.webp`).

### Rollback

- **Vercel:** Deployments → select previous deployment → “Promote to Production”.
- **Git:** `git revert HEAD && git push origin main` (then re-deploy).

---

## 3. Decision

- [x] **Validate:** Pass  
- [x] **Deploy gate:** Ready — no blockers  
- [ ] **Deploy:** Execute when you commit and push  
