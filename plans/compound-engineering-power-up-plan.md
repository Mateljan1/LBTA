# Compound Engineering Power-Up — Automations, Recurring Workflows & Fact-Based Capabilities

**Purpose:** Make compound-engineering even more powerful with automations, recurring workflows, and fact-based verification so quality and learnings compound without manual triggers.

**Created:** March 2026  
**Status:** Plan complete. CI, recurring doc, fact-check, compound triggers, deploy checklist, PR template, and optional Lighthouse scheduled workflow are in place.

---

## Overview

Today the loop is **manual**: you run `/compound:plan`, `work`, `review`, `validate`, `deploy`, `learn` when you remember. This plan adds **automations** (CI/scheduled), **recurring workflows** (when to run what, repeatably), and **fact-based capabilities** (docs and data as source of truth, verified automatically).

---

## Problem Statement

1. **No automated quality gate** — Build and lint only run when someone runs them; PRs can merge without `quality-gate` or Lighthouse.
2. **Recurring workflows are ad hoc** — "Run review every Friday" or "run learn after deploy" isn’t documented or triggerable in one place.
3. **Facts can drift** — Prices in `data/` vs docs, list/tag IDs in `lib/activecampaign.ts` vs checklists, COMPOUND_LEARN vs actual code patterns; no automated fact-check.
4. **Learn runs only when requested** — Valuable learnings are captured only if someone remembers `/compound:learn`.

---

## Proposed Solution

Four tracks:

| Track | Scope | Outcome |
|-------|--------|---------|
| **1. Automations (CI)** | GitHub Actions: quality-gate on PR, optional Lighthouse on schedule | Every PR runs build + lint; optionally weekly Lighthouse baseline. |
| **2. Recurring workflows** | Doc + prompts for "when to run what" and repeatable sequences | Clear schedule: daily/weekly/monthly and post-deploy triggers. |
| **3. Fact-based verification** | Script + checklist: data vs docs, AC IDs vs code, forbidden copy | Single command or agent prompt verifies facts and docs alignment. |
| **4. Compound triggers & hooks** | Reminders and lightweight hooks (e.g. PR comment, deploy checklist) | After deploy: "Run compound:learn?"; after plan: "Run compound:review?" |

---

## Implementation Steps

### Phase 1: Automations (CI)

**Goal:** Every PR runs the minimal quality gate; optionally run Lighthouse on a schedule.

- [x] **1.1** Create `.github/workflows/quality-gate.yml`:
  - **Trigger:** `pull_request` to `main` (or default branch).
  - **Jobs:** Install deps, `npm run quality-gate` (build + lint). Fail the check if either fails.
  - **Optional:** Run on `push` to `main` as well (so main never gets broken build).
- [x] **1.2** (Optional) Create `.github/workflows/lighthouse-scheduled.yml`:
  - **Trigger:** `schedule: cron('0 17 * * 1')` (Monday 9am PT) or `workflow_dispatch`.
  - **Jobs:** Run Lighthouse against production URL; upload HTML + JSON as artifact (retention 30 days).
- [x] **1.3** Document in README and [docs/quality-gate.md](../docs/quality-gate.md): "PRs run quality-gate via GitHub Actions; see `.github/workflows/quality-gate.yml`."

**Files to create/modify**

| File | Action | Purpose |
|------|--------|---------|
| `.github/workflows/quality-gate.yml` | Create | PR (and optionally push) runs build + lint. |
| `.github/workflows/lighthouse-scheduled.yml` | Create (optional) | Scheduled or manual Lighthouse run. |
| `docs/quality-gate.md` | Modify | Add "CI" section: link to workflow, what runs when. |
| `README.md` | Modify | Mention CI quality-gate in Quality gate section. |

**Success criteria**

- [ ] Every PR shows a status check for quality-gate (build + lint).
- [ ] (Optional) Lighthouse workflow runs on schedule or manual dispatch and produces a baseline artifact.

---

### Phase 2: Recurring Workflows (doc + prompts)

**Goal:** One place that defines *when* to run compound commands and recurring checks, so humans or agents can follow a cadence.

- [x] **2.1** Create `docs/recurring-workflows.md`:
  - **Daily (optional):** Quick check — `npm run quality-gate` if you touched code.
  - **On every PR:** Quality-gate (CI does this); optionally "run compound:review on this PR" before merge.
  - **After merging to main:** Optionally run `npm run smoke:lead` or smoke test against production; then consider "run compound:learn if significant changes."
  - **After deploy (manual or CI):** Run deploy checklist (from power-stack or compound deploy agents); then "run compound:learn to capture any deploy findings."
  - **Weekly:** Run full quality gate (Lighthouse + responsive + forbidden copy) and update `docs/quality-gate.md`; run compound:review on changed files if desired; run fact-check (Phase 3).
  - **Monthly:** Run `/compound:retrospective` (if available); review and update `plans/COMPOUND_LEARN.md` and `.cursor/compound/learnings/` for stale entries.
- [x] **2.2** Add a "Recurring" section to [docs/power-stack.md](../docs/power-stack.md) that links to `recurring-workflows.md` and summarizes: PR → quality-gate; post-merge → smoke + learn?; deploy → learn?; weekly → full gate + fact-check; monthly → retrospective.

**Files to create/modify**

| File | Action | Purpose |
|------|--------|---------|
| `docs/recurring-workflows.md` | Create | When to run what: daily, PR, post-merge, deploy, weekly, monthly. |
| `docs/power-stack.md` | Modify | Add Recurring section and link. |

**Success criteria**

- [ ] Recurring workflow doc exists and is linked from power-stack.
- [ ] Cadence is clear: PR (CI), post-merge, deploy, weekly, monthly.

---

### Phase 3: Fact-Based Verification

**Goal:** Verify that facts in code and data match docs and checklists; catch drift (prices, IDs, forbidden copy).

- [x] **3.1** Create `scripts/fact-check.js` (or `.ts` run via `npx ts-node` or build step):
  - **Data vs docs:** No hardcoded prices in `app/` or `components/` (grep for dollar amounts or key price patterns); program list IDs or tag IDs in `lib/activecampaign.ts` match comments or a small `docs/ac-list-tag-ids.json` if you want a single reference.
  - **Forbidden copy:** Grep user-facing dirs for forbidden words (maximize, boost, elite, world-class, mastery, "Sign up now!", "Don't miss out!") and exit non-zero if any found.
  - **Optional:** Check that `data/faq.json` is used by FAQ components; that `LBTA_LIST_ID` and key tag IDs are documented in `docs/activecampaign-setup-checklist.md` or similar.
  - Output: Pass/fail and list of violations (e.g. "Forbidden copy in app/junior-trial/page.tsx: 'elite'").
- [x] **3.2** Add npm script: `"fact-check": "node scripts/fact-check.js"` (or equivalent). Optionally run from CI (e.g. in quality-gate workflow) or only in weekly workflow.
- [x] **3.3** Document in [docs/quality-gate.md](../docs/quality-gate.md) and [docs/recurring-workflows.md](../docs/recurring-workflows.md): "Weekly: run `npm run fact-check`; fix any violations and update docs or code so facts match."

**Files to create/modify**

| File | Action | Purpose |
|------|--------|---------|
| `scripts/fact-check.js` | Create | Grep-based checks: no hardcoded prices in UI, no forbidden copy, optional AC ID vs docs. |
| `package.json` | Modify | Add `fact-check` script. |
| `docs/quality-gate.md` | Modify | Add fact-check to periodic checks. |
| `docs/recurring-workflows.md` | Modify | Weekly: run fact-check. |

**Success criteria**

- [ ] `npm run fact-check` runs and fails on forbidden copy or (if implemented) hardcoded price in UI.
- [ ] Fact-check is part of documented weekly recurring workflow.

---

### Phase 4: Compound Triggers & Hooks (reminders, deploy checklist)

**Goal:** Make it easy to run compound:learn and review at the right time, without relying on memory.

- [x] **4.1** Add to [docs/recurring-workflows.md](../docs/recurring-workflows.md) a **"Compound triggers"** section:
  - **After completing a plan:** "Run compound:learn and update plans/COMPOUND_LEARN.md and .cursor/compound/learnings/."
  - **After review (13 agents):** "If there are critical issues, fix then re-run review; then run compound:validate before deploy."
  - **After deploy:** "Run compound:learn to capture deploy findings (env, smoke, rollback); update COMPOUND_LEARN if new patterns or corrections."
  - **When adding a new API or integration:** "Run compound:review on the new code; run compound:learn after merge."
- [x] **4.2** Create or update a **deploy checklist** (in `docs/` or power-stack) that includes:
  - Pre-deploy: quality-gate, fact-check (optional), branch up to date.
  - Deploy: push to GitHub, `vercel --prod` (or Vercel dashboard).
  - Post-deploy: smoke test (critical URLs, forms); run compound:learn if changes were significant.
- [x] **4.3** (Optional) Add a PR template (`.github/PULL_REQUEST_TEMPLATE.md`) with checkboxes: "I ran `npm run quality-gate`"; "If this completes a plan, I will run compound:learn after merge"; "Facts/data match docs (or I updated docs)." This reinforces recurring behavior without automation.

**Files to create/modify**

| File | Action | Purpose |
|------|--------|---------|
| `docs/recurring-workflows.md` | Modify | Add Compound triggers subsection. |
| `docs/power-stack.md` or `docs/deploy-checklist.md` | Modify / Create | Deploy checklist with post-deploy learn. |
| `.github/PULL_REQUEST_TEMPLATE.md` | Create (optional) | PR checkboxes for quality-gate and compound:learn. |

**Success criteria**

- [ ] Compound triggers (when to run learn/review) are documented.
- [ ] Deploy checklist includes post-deploy learn.
- [ ] (Optional) PR template reminds to run quality-gate and compound:learn when relevant.

---

## Files to Create/Modify (summary)

| File | Action | Phase |
|------|--------|-------|
| `.github/workflows/quality-gate.yml` | Create | 1 |
| `.github/workflows/lighthouse-scheduled.yml` | Create (optional) | 1 |
| `docs/quality-gate.md` | Modify | 1, 3 |
| `README.md` | Modify | 1 |
| `docs/recurring-workflows.md` | Create | 2, 3, 4 |
| `docs/power-stack.md` | Modify | 2, 4 |
| `scripts/fact-check.js` | Create | 3 |
| `package.json` | Modify | 3 |
| `docs/deploy-checklist.md` | Create (optional) | 4 |
| `.github/PULL_REQUEST_TEMPLATE.md` | Create (optional) | 4 |

---

## Success Criteria (overall)

- [ ] CI runs quality-gate on every PR (build + lint).
- [ ] Recurring workflow doc exists and defines daily/PR/post-merge/deploy/weekly/monthly cadence.
- [ ] Fact-check script exists and runs; forbidden copy and (optionally) price/docs checks are in place.
- [ ] Compound triggers (when to run learn/review) and deploy checklist are documented.
- [ ] (Optional) Lighthouse scheduled workflow, PR template, and deploy checklist file are added.

---

## Research Sources

- [Compound Engineering SKILL](../../.claude/skills/compound-engineering/SKILL.md) — Loop, agents, learn.
- [docs/power-stack.md](../docs/power-stack.md) — Current MCPs, agents, scripts.
- [docs/quality-gate.md](../docs/quality-gate.md) — Current gate and recording.
- GitHub Actions: [Workflow syntax](https://docs.github.com/en/actions/using-workflows/workflow-syntax-for-github-actions), [scheduled workflows](https://docs.github.com/en/actions/using-workflows/events-that-trigger-workflows#schedule).

---

## Relevant Learnings

- From COMPOUND_LEARN: single source of truth for pricing in `data/`; no forbidden copy; API routes use NextRequest, Zod, rate limiting; deploy = push + vercel --prod.
- From quality-bars: ops flows should have CLI entry points; lead pipeline has smoke test; form handlers return 200 on valid payload.

---

## Risks & Mitigations

| Risk | Mitigation |
|------|------------|
| CI runs on every push and slows feedback | Keep quality-gate job minimal (install + build + lint); run Lighthouse only on schedule or manual. |
| Fact-check script has false positives | Start with forbidden-copy and simple price grep; refine allowlists (e.g. exclude comments/docs) and document. |
| Recurring doc is ignored | Link from README and power-stack; add PR template so "run learn after plan" is visible. |

---

## How to run

- **Phase 1 only:** "Execute Phase 1 of compound-engineering-power-up-plan" (CI workflows).
- **Phase 2 only:** "Execute Phase 2 of compound-engineering-power-up-plan" (recurring doc).
- **Phase 3 only:** "Execute Phase 3 of compound-engineering-power-up-plan" (fact-check script).
- **Phase 4 only:** "Execute Phase 4 of compound-engineering-power-up-plan" (triggers + deploy checklist).
- **Full plan:** "Execute the compound-engineering-power-up-plan Phases 1–4."

After execution: run `npm run quality-gate` and `npm run fact-check` (once script exists), update this plan's checkboxes, and run compound:review → validate → deploy as needed.
