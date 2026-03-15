# LBTA Deploy Checklist

**Purpose:** Repeatable pre-deploy, deploy, and post-deploy steps so every release is consistent and learnings compound. See also [recurring-workflows.md](./recurring-workflows.md), [power-stack.md](./power-stack.md).

---

## Pre-deploy

- [ ] **Quality gate** — `npm run quality-gate` (build + lint) passes.
- [ ] **Fact-check (optional)** — `npm run fact-check`; fix any forbidden copy or data/docs drift.
- [ ] **Branch up to date** — `git pull` (or rebase) from main so you’re not deploying stale code.
- [ ] **Env** — Production env vars (e.g. Vercel) are set for AC, webhook secret, etc. See [.env.example](../.env.example) and [activecampaign-setup-checklist.md](./activecampaign-setup-checklist.md).

---

## Deploy

1. **Commit and push to GitHub**
   ```bash
   git add .
   git status
   git commit -m "Your descriptive message"
   git push origin main
   ```

2. **Deploy to Vercel production**
   ```bash
   npx vercel --prod
   ```
   (Or use Vercel dashboard: Deployments → Promote latest preview to Production.)

Do not stop at a preview deploy when the intent is production. Per project convention: **deploy = push + `vercel --prod`**.

---

## Post-deploy

- [ ] **Smoke test** — Critical paths load: `/`, `/schedules`, `/contact`, `/book`. Forms submit (e.g. newsletter, trial).
- [ ] **Optional:** `npm run smoke:lead` (if `SMOKE_BASE_URL` points at production) to verify lead pipeline without creating contacts.
- [ ] **Compound learn** — If the deploy revealed env, rollback, or ops findings, run `/compound:learn` and update `plans/COMPOUND_LEARN.md` and `.cursor/compound/learnings/`.

---

## Quick reference

| Step        | Command or action                          |
|------------|---------------------------------------------|
| Pre-deploy | `npm run quality-gate`; optional `npm run fact-check` |
| Deploy     | `git push origin main` then `npx vercel --prod`     |
| Post-deploy | Smoke test key URLs/forms; optional `npm run smoke:lead`; run compound:learn if significant |

---

**Links:** [quality-gate.md](./quality-gate.md) · [recurring-workflows.md](./recurring-workflows.md) · [power-stack.md](./power-stack.md)
