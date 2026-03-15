# Recurring Workflows — When to Run What

**Purpose:** One place that defines *when* to run compound-engineering commands, quality gates, and fact-checks so quality and learnings compound on a cadence.

See also: [power-stack.md](./power-stack.md), [quality-gate.md](./quality-gate.md), [plans/compound-engineering-power-up-plan.md](../plans/compound-engineering-power-up-plan.md).

---

## Cadence at a glance

| When | What to run | Why |
|------|-------------|-----|
| **Every PR** | CI runs `quality-gate` (build + lint) | Block merge if build or lint fails. |
| **Before merging a PR** | Optional: run `/compound:review` on changed files | Catch issues before merge. |
| **After merging to main** | Optional: `npm run smoke:lead`; consider `/compound:learn` if changes were significant | Verify lead pipeline; capture learnings. |
| **After deploy** | Smoke test production; run `/compound:learn` if deploy revealed env or ops findings | Learnings compound; rollback notes stay current. |
| **Weekly** | Full quality gate (Lighthouse + responsive + forbidden copy); update `docs/quality-gate.md`; `npm run fact-check` | Baseline and fact alignment. |
| **Monthly** | `/compound:retrospective` (if available); review COMPOUND_LEARN and learnings for stale entries | Keep corrections and patterns relevant. |

---

## Daily (optional)

- If you touched code: run `npm run quality-gate` locally before pushing.
- No formal automation required.

---

## On every PR

- **Automated (CI):** `.github/workflows/quality-gate.yml` runs `npm run quality-gate` (build + lint). PR cannot merge if the check fails (when branch protection is enabled).
- **Optional (manual):** "Run compound:review on this PR" before merge for larger or riskier changes.

---

## After merging to main

- **Optional:** Run `npm run smoke:lead` (or hit production forms) to confirm lead pipeline still works.
- **If the merge completed a plan or had review findings:** Run `/compound:learn` and update `plans/COMPOUND_LEARN.md` and `.cursor/compound/learnings/`.

---

## After deploy

- Run deploy checklist (see [power-stack.md](./power-stack.md) or deploy checklist doc): push to GitHub, `vercel --prod`, smoke test critical URLs.
- **Then:** Run `/compound:learn` to capture any deploy findings (env, smoke, rollback); update COMPOUND_LEARN if new patterns or corrections emerged.

---

## Weekly

- **Full quality gate:** Run Lighthouse (home, schedules, one program page); responsive check (320–1440px); forbidden-copy grep. Record results in [quality-gate.md](./quality-gate.md).
- **Fact-check:** Run `npm run fact-check` (forbidden copy, optional price/docs checks). Fix violations and align docs or code.
- **Optional:** Run compound:review on recently changed files; run compound:validate if you shipped big features.

---

## Monthly

- **Retrospective:** Run `/compound:retrospective` if available (compound-engineering skill). Use it to tune agents and workflow.
- **Learnings hygiene:** Review `plans/COMPOUND_LEARN.md` and `.cursor/compound/learnings/` for stale or duplicate entries; archive or update.

---

## Compound triggers (when to run learn / review)

| Trigger | Action |
|---------|--------|
| **After completing a plan** | Run `/compound:learn`; update COMPOUND_LEARN and `.cursor/compound/learnings/`. |
| **After running the 13-agent review** | If critical issues: fix, re-run review, then run `/compound:validate` before deploy. |
| **After deploy** | Run `/compound:learn` to capture deploy findings. |
| **When adding a new API or integration** | Run `/compound:review` on the new code; run `/compound:learn` after merge. |

---

## Quick reference

- **CI:** [.github/workflows/quality-gate.yml](../.github/workflows/quality-gate.yml) (when present).
- **Quality gate:** [quality-gate.md](./quality-gate.md).
- **Power stack (commands, agents, scripts):** [power-stack.md](./power-stack.md).
- **Power-up plan (automations, fact-check, hooks):** [compound-engineering-power-up-plan.md](../plans/compound-engineering-power-up-plan.md).
