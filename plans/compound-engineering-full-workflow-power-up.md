# Compound Engineering — Full Workflow Power-Up (All 6 Phases)

**Purpose:** Make every phase of the Compound Engineering loop more powerful, reliable, and connected so the whole workflow compounds in quality and speed.

**Created:** March 2026  
**Status:** Implemented (March 2026). Skill and repo docs updated; ready to use.  
**Related:** `compound-plan-phase-power-up.md` (Plan-phase detail).

---

## Overview

This doc proposes improvements for **all six phases** (Plan → Work → Review → Validate → Deploy → Compound) plus **cross-phase handoffs and gates**. Each section: gaps today → proposed improvements → optional “stretch” ideas.

---

## Phase 1: PLAN — Power-Ups

*(Full detail in `compound-plan-phase-power-up.md`; summary here.)*

| Gap | Improvement |
|-----|-------------|
| Research outputs freeform; conflicts slip through | **Structured research output** (JSON contract per agent) + **Conflict resolution** section in plan. |
| Scope creep | **Out of scope (this plan)** + optional **Confidence & uncertainty**. |
| File list not machine-usable | **Machine-readable files block** (YAML: `create:`, `modify:`). |
| Steps have no order/parallelism | **Step dependencies** (e.g. “2.2, 2.3 parallel after 2.1”). |
| Success criteria not testable | **Acceptance checklist** per criterion (feeds Validate). |
| Risks passive | **Risks with gates** (“If we add API route, run Security Sentinel before Phase 3”). |
| Regressions only in Review | Optional **5th agent: Regression/Impact Researcher**. |

**Synthesis instructions:** Merge from structured outputs; resolve conflicts; cite sources; always produce Out of scope + Acceptance checklist.

---

## Phase 2: WORK — Power-Ups

### Gaps Today

- Work “loads plan” but doesn’t enforce scope (file list) or acceptance.
- No explicit “step N failed → stop or retry?” policy.
- Browser MCP mentioned but not required per step type (UI vs API).
- Atomic commits are guidance only; no checklist per logical unit.

### Proposed Improvements

**2.1 Plan-aware execution**

- **Scope guard:** Before editing, load plan’s Files to Create/Modify (table or machine block). Work only in those paths unless plan is updated. If agent needs to touch an unlisted file, require “add to plan and note reason” or “out-of-scope exception logged.”
- **Acceptance as exit condition:** When all implementation steps are done, run through the plan’s **Acceptance checklist** (from Plan power-up). Treat unchecked acceptance items as “Work not complete”; fix or document why deferred.

**2.2 Step-level policy**

- **Per-step verification:** After each implementation step: run lint (and test if applicable) for the changed files; only then mark step complete.
- **Failure policy:** If a step fails (e.g. test red): (1) try fix once in-scope, (2) if still failing, mark step blocked and append to plan “Blockers: …” so Review/Validate see it.
- **UI vs non-UI:** For steps that touch UI, require “browser MCP snapshot or key flow” before marking complete (when MCP available). For API-only steps, allow “curl or test script” as verification.

**2.3 Atomic commits with labels**

- One commit per **logical unit** (e.g. “Add calendar data layer”, “Add ScheduleCalendarView component”). Commit message format: `[scope] Short description` (e.g. `[schedules] Add calendar by location data layer`).
- Optional: maintain a short **Work log** (e.g. in plan or separate file): “Commit 1: …; Commit 2: …” so Review has a clear change narrative.

**2.4 Handoff to Review**

- When Work completes, pass to Review: **plan path**, **list of commits (or diff range)**, **plan’s Out of scope + Acceptance checklist + Files**. Review can then do scope compliance and acceptance-aware review.

---

## Phase 3: REVIEW — Power-Ups

### Gaps Today

- Review agents don’t receive plan context (scope, acceptance, files); they only see code/diff.
- Synthesis is manual; no structured aggregate (e.g. JSON) for downstream gates.
- No “scope compliance” or “acceptance verification” lens.
- Review doesn’t know which files were *intended* to change (so “did we change only what we planned?” is hard).

### Proposed Improvements

**3.1 Plan-aware review**

- **Inputs to every review run:** (1) Code/diff to review, (2) **Plan summary:** objective, out of scope, acceptance checklist, files to create/modify. Optional: link to plan file.
- **Scope Compliance Reviewer (new or extended agent):** Checks: only planned files (or documented exceptions) changed; no major work in out-of-scope areas; acceptance checklist items are addressable by the current code. Output: PASS / WARN / FAIL with list of scope violations.

**3.2 Structured synthesis output**

- In addition to the human-readable “Code Review Summary”, produce a **machine-readable summary** (e.g. JSON): `{ overallScore, byCategory: { security: score, … }, criticalCount, warningCount, decision: "ready"|"fixes"|"discussion", criticalFindings: […] }`. Use this in **Gate check** (Deploy) and in **Compound** (e.g. “review score trend”).

**3.3 Review agent prompt enrichment**

- Each agent’s prompt template gets an optional **Context** block: “Plan objective: …. Out of scope: …. Files in scope: ….” so agents can flag “this change seems out of scope” or “this addresses acceptance item X.”

**3.4 Deduplication and prioritization**

- Synthesis step: **Deduplicate findings** (same line, same concern from two agents → one finding). **Prioritize** by (1) critical, (2) file in critical path or plan’s file list, (3) warning. Output “Top 5 must-fix” and “Top 5 should-fix” so Work has a clear fix order.

---

## Phase 4: VALIDATE — Power-Ups

### Gaps Today

- Validators don’t receive the plan’s **acceptance checklist**; they use generic flows.
- No single “validation manifest” (what to run where) so some paths get missed.
- Validation output is prose; no structured result for gates or Compound.

### Proposed Improvements

**4.1 Acceptance-driven validation**

- **Primary input:** Plan’s **Acceptance checklist** (from Plan power-up). Each acceptance item maps to one or more validation actions (e.g. “Calendar prints without nav” → Functional Tester: run print flow; UI/Visual: check print CSS).
- Validators receive: **Acceptance checklist** + (optionally) **list of critical user flows** from the plan. Functional Tester at minimum runs acceptance-related flows.

**4.2 Validation manifest**

- Define a **validation manifest** (per project or per plan): list of (description, type, target). E.g. `[ { "name": "Homepage load", "type": "functional", "target": "/" }, { "name": "Schedule calendar print", "type": "functional", "target": "/schedules/calendar" }, { "name": "Book API", "type": "api", "target": "POST /api/book" } ]`. Validators run manifest + acceptance-driven checks. Manifest can live in repo (`docs/validation-manifest.json`) or be generated from plan.

**4.3 Structured validation output**

- Validation synthesis produces **structured output** (JSON): `{ overallScore, byValidator: { functional: score, … }, blockers: [], warnings: [], acceptanceResults: [ { item: "...", status: "pass"|"fail"|"skip", note?: "..." } ] }`. Enables Gate check and Compound to use “validation score” and “acceptance pass rate.”

**4.4 Environment and coverage**

- **Environment:** Validate explicitly states which environment was used (e.g. `localhost:3000`, `staging`). Deploy phase can then compare “validated on X” vs “deploying to Y” and warn if different.
- **Coverage note:** Optional “Validation coverage” line: “Acceptance checklist: 8/8 exercised; Manifest: 12/12 passed.” So we know what was *not* validated (e.g. no Practice Plan Validator for this repo).

---

## Phase 5: DEPLOY — Power-Ups

### Gaps Today

- Gate check thresholds (e.g. “Review score >= 70”) are in prose; not machine-checkable from structured Review/Validate output.
- Rollback commands are “prepared” but not always executable as a single script.
- Post-deploy monitor is open-ended; no baseline vs current comparison.

### Proposed Improvements

**5.1 Gate check from structured outputs**

- **Inputs:** Structured Review summary (score, decision, criticalCount) + Structured Validate summary (score, blockers, acceptanceResults). Gate logic: e.g. `review.decision === "ready" && review.criticalCount === 0 && validate.blockers.length === 0 && validate.overallScore >= 70`. Document threshold in one place (e.g. `docs/quality-gate.md` or skill); agent or script reads structured outputs and passes/fails gate.

**5.2 Rollback as executable artifact**

- Rollback Guardian outputs **rollback script** (e.g. `scripts/rollback-YYYYMMDD-HHMM.sh` or a list of commands in a known format). One command to run: e.g. `./scripts/rollback-YYYYMMDD-HHMM.sh`. Reduces “what do I run?” ambiguity.

**5.3 Post-deploy baseline**

- Before deploy, record **baseline** (e.g. current version tag, or “last known good”). After deploy, Post-Deploy Monitor compares: error rate, p95 latency, key endpoints — vs baseline (or vs last 24h). Output: “Within baseline” / “Degraded” / “Critical.” Optional: auto-rollback trigger if “Critical” and threshold defined.

**5.4 Deploy checklist as runbook**

- One **deploy runbook** (e.g. `docs/deploy-runbook.md`): ordered steps (pre-deploy checks → deploy command → smoke → monitor), with “how to get structured Review/Validate output,” “where rollback script is,” “who to notify if rollback.” Deploy agents follow runbook; runbook is the single source of truth for “how we deploy.”

---

## Phase 6: COMPOUND — Power-Ups

### Gaps Today

- Learn runs only when requested; easy to forget after deploy.
- Extraction is prompt-based; no structured link from Review/Validate findings to learnings.
- Memory write locations are generic (~/.claude/memory/…); project-specific memory (e.g. COMPOUND_LEARN.md, .cursor/compound/learnings/) may not be updated in same pass.
- No “learning quality” check (e.g. duplicate or conflicting corrections).

### Proposed Improvements

**6.1 Triggers and reminders**

- **Post-deploy trigger:** After Deploy synthesis, append: “Recommended: run `/compound:learn` to capture deploy and validation learnings.” (Align with `compound-engineering-power-up-plan.md` recurring workflows.)
- **Post-review trigger:** Optionally: “Review had N critical findings. Consider `/compound:learn` to turn recurring findings into corrections or quality bars.”

**6.2 Structured inputs to learn**

- **Inputs to Learn:** (1) Plan (or link), (2) Review summary (structured + prose), (3) Validation summary (structured + prose), (4) Deploy summary (if applicable), (5) List of changes (commits or files). Extraction prompt uses these to generate: CORRECTIONS (with source: “Review – Security Sentinel”), PATTERNS (with source: “Validate – Functional”), STANDARDS (with source: “Review – Memory Compliance”).

**6.3 Project and global memory**

- **Project memory:** Always update project-specific artifacts when running in a repo: e.g. `COMPOUND_LEARN.md` or `.cursor/compound/learnings/<date>-<slug>.md` with same structure (Corrections, Patterns, Standards). Skill documents: “When in a repo with COMPOUND_LEARN.md or .cursor/compound/learnings/, append or merge there.”
- **Global memory:** Keep writing to ~/.claude/memory/… for corrections, anti-patterns, quality-bars, patterns. Optional: “Project learnings” are a subset that also get written to project files for team visibility.

**6.4 Learning quality**

- Before appending a new correction: **Check for duplicates** (same or very similar “original” or “correction” in corrections.jsonl). If duplicate, skip or merge.
- Before adding anti-pattern: **Check conflict** with existing patterns (e.g. “do X” in patterns vs “avoid X” in anti-patterns). Flag for human review if conflict.
- Optional: **Learning impact** line: “This session added N corrections, M patterns, K quality-bar updates” so we can track compound rate.

---

## Cross-Phase: Handoffs and Gates

### Handoff matrix

| From → To   | What to pass |
|-------------|--------------|
| Plan → Work | plan file path; Files to Create/Modify; Implementation steps; Acceptance checklist; Out of scope. |
| Work → Review | plan path; commit range or diff; Out of scope + Acceptance + Files from plan. |
| Review → Validate | Review decision + critical list; plan’s Acceptance checklist; Validation manifest (if any). |
| Validate → Deploy | Structured validation result; acceptance pass/fail; environment validated. |
| Deploy → Compound | Deploy summary; rollback script path; post-deploy monitor result. |
| Compound → Plan | Updated memory (corrections, patterns, quality-bars); project learnings file. |

### Gate summary

| Gate        | When        | Inputs | Pass condition (example) |
|------------|-------------|--------|---------------------------|
| Work complete | End of Work | Plan acceptance checklist | All acceptance items pass or documented. |
| Review gate   | Before Validate | Review synthesis (structured) | decision === "ready", criticalCount === 0. |
| Validate gate | Before Deploy | Validate synthesis (structured) | blockers.length === 0, overallScore >= 70. |
| Deploy gate   | Before deploy execution | All above + pre-deploy agents | Pre-deploy pass; rollback script ready. |

---

## Implementation Order (Suggested)

1. **Plan phase** — Template + optional structured research + Out of scope + Acceptance checklist (see `compound-plan-phase-power-up.md`).
2. **Work phase** — Scope guard (plan files); acceptance as exit condition; step-level verify-then-mark-done.
3. **Review phase** — Plan context in review; Scope Compliance; structured synthesis output.
4. **Validate phase** — Acceptance-driven validation; validation manifest; structured output.
5. **Deploy phase** — Gate check from structured Review/Validate; rollback script artifact; deploy runbook.
6. **Compound phase** — Triggers; project + global memory; structured inputs; duplicate/conflict check.

---

## Success Criteria (Full Workflow)

- [ ] Every phase has a defined **input** from the previous phase and **output** for the next (handoff matrix).
- [ ] At least **Review** and **Validate** produce structured output used by a gate or by Compound.
- [ ] **Plan** includes Out of scope and Acceptance checklist; **Work** and **Validate** use them.
- [ ] **Compound** updates both project learnings (e.g. COMPOUND_LEARN.md) and global memory; no duplicate corrections.
- [ ] **Deploy** gate is machine-checkable when structured outputs exist.

---

## Risks & Mitigations

| Risk | Mitigation |
|------|------------|
| Too much structure (JSON everywhere) | Keep prose summaries primary; structured output optional or minimal (score, decision, blockers). |
| Agents don’t receive handoff inputs | Document “required inputs” per phase in skill; /compound:work and /compound:review accept plan path. |
| Compound writes to wrong path | Skill lists project paths explicitly (COMPOUND_LEARN.md, .cursor/compound/learnings/); global paths in memory-integration. |
| Gate thresholds too strict or loose | Put thresholds in one doc (e.g. docs/quality-gate.md); review monthly. |

---

## Related Docs

- `compound-plan-phase-power-up.md` — Plan phase in detail.
- `compound-engineering-power-up-plan.md` — Automations, recurring workflows, fact-based verification.
- `docs/quality-gate.md` — Quality gate and CI (align gate thresholds here).
- `docs/recurring-workflows.md` — When to run compound commands and learn.
