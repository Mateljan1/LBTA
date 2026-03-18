# LBTA — Deploy Runbook

**Purpose:** Ordered steps for deploying the LBTA site so every deploy uses the same checks and rollback path. Use with `/compound:deploy` or manually.

See also: [quality-gate.md](./quality-gate.md), [compound-handoff-and-gates.md](./compound-handoff-and-gates.md), [recurring-workflows.md](./recurring-workflows.md).

---

## Pre-deploy (gates)

1. **Review gate:** `/compound:review` was run; decision is "ready" and no critical issues. (If structured output exists: `review-summary.json` → `decision === "ready"`, `criticalCount === 0`.)
2. **Validate gate:** `/compound:validate` was run; no blockers; score ≥ 70. (If structured: `validation-summary.json` → `blockers.length === 0`, `overallScore >= 70`.)
3. **Tests:** `npm run quality-gate` (build + lint) passes.
4. **Git:** No uncommitted changes; branch up to date with remote (or intentional).

---

## Deploy steps

1. **Pre-deploy checks:** Build, env vars for target (Vercel), no pending migrations, no critical vulnerabilities.
2. **Environment:** Platform (Vercel) authenticated; services healthy; SSL/DNS valid.
3. **Rollback ready:** Record current version (e.g. commit or Vercel deployment ID). Prepare rollback commands; optionally write `scripts/rollback-YYYYMMDD-HHMM.sh`.
4. **Deploy:** Push to GitHub and let Vercel deploy, or run `vercel --prod` from repo root.
5. **Smoke test:** Hit critical paths (e.g. `/`, `/schedules`, `/book`); confirm APIs and static assets.
6. **Monitor:** First 60s: response times, error rate, logs.

---

## Rollback

- **Vercel:** `vercel rollback` or redeploy previous deployment from Vercel dashboard.
- If Rollback Guardian produced a script: run `./scripts/rollback-YYYYMMDD-HHMM.sh` (or the commands it documents).

---

## Post-deploy

- **Recommended:** Run `/compound:learn` to capture deploy and validation learnings.
- Update [quality-gate.md](./quality-gate.md) if you ran Lighthouse or responsive checks.
