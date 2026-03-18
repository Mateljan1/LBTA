# Compound Engineering — Plan Phase Power-Up

**Purpose:** Make the PLAN phase (Phase 1) more powerful and reliable so plans are better researched, easier to execute, and feed Work/Review/Validate more effectively.

**Created:** March 2026  
**Status:** Proposal for skill + workflow updates.

---

## Overview

The current plan phase: User Request → 4 parallel research agents → single synthesis into `plan.md`. This doc proposes **richer research**, **stronger synthesis**, **machine-friendly handoff**, and **optional confidence/scope control** so plans compound in quality and execution speed.

---

## Gaps Today

| Gap | Impact |
|-----|--------|
| Research outputs are freeform | Synthesis depends on one agent correctly merging 4 reports; conflicts or omissions slip through. |
| No explicit “what we’re not doing” | Scope creep; Work phase implements extras. |
| File list is prose/markdown only | Hard to auto-check “did we touch the right files?” in Review/Validate. |
| No dependency order in steps | Work executes linearly or ad hoc; parallelizable steps not obvious. |
| Success criteria not testable | “All tests pass” is generic; no acceptance checklist tied to criteria. |
| Risks are passive | No “gate: if X, do Y before Phase 2” or confidence score. |
| Memory/learnings applied implicitly | Plan may ignore or misapply COMPOUND_LEARN / quality-bars. |
| No 5th research lens (e.g. regression) | Regressions and “what could break?” often appear only in Review. |

---

## Proposed Improvements

### 1. Research Phase

**1.1 Structured research output (contract)**  
Each research agent returns a **fixed JSON shape** (in addition to or instead of prose) so synthesis can merge programmatically:

- **Codebase Researcher:** `{ similarImplementations: [], recommendedPaths: [], conventions: [], utilities: [] }`
- **Git History Analyzer:** `{ relevantCommits: [], patternsEvolved: [], owners: [] }`
- **Best Practices Researcher:** `{ docs: [], practices: [], security: [], performance: [] }`
- **Memory Researcher:** `{ corrections: [], patterns: [], antiPatterns: [], qualityBars: [] }`

Optional 5th agent:

- **Regression / Impact Researcher:** “What could break? What depends on this area? What’s the blast radius?” → `{ touchpoints: [], dependents: [], risks: [] }`

**1.2 Conflict resolution**  
If research agents disagree (e.g. “put feature in `lib/`” vs “put in `app/api/`”), synthesis section **Research conflicts** lists them and states **resolution** (with rationale). Plan template gets a short “Conflicts & resolution” block.

**1.3 Research sources as citations**  
Every “Proposed solution” or “Implementation step” that relies on external or memory input should reference it (e.g. “per Best Practices Researcher: [link]” or “per COMPOUND_LEARN: single-source pricing”). Template: “Research Sources” plus inline `(Source: …)` where relevant.

---

### 2. Synthesis Phase (plan.md)

**2.1 Explicit out-of-scope**  
Add a **Out of scope (this plan)** subsection:

- “We are not doing X, Y, Z in this plan.”
- Reduces scope creep and gives Review a clear “did we stay in scope?” check.

**2.2 Machine-friendly file list**  
Keep the human table; add a **machine-readable** block (e.g. YAML or JSON) so scripts or Review agents can verify “all listed files were considered”:

```yaml
# files (for tooling; do not edit by hand)
create: [lib/calendar-schedule.ts, components/schedules/ScheduleCalendarView.tsx]
modify: [app/schedules/page.tsx, app/globals.css]
```

**2.3 Step dependencies and parallelism**  
In Implementation Steps, optionally tag steps so Work (or a future “plan executor”) can run in order or in parallel:

- “Step 2.1 depends on: 1.1, 1.2”
- “Steps 2.2 and 2.3 can run in parallel after 2.1”

**2.4 Acceptance checklist tied to success criteria**  
For each Success Criterion, add one or more **acceptance checks** (concrete, testable):

- Criterion: “Players can download via Print → Save as PDF.”
- Acceptance: “[ ] Calendar view prints without nav/footer; [ ] Print preview shows title and dates.”

Review/Validate can then use the same list.

**2.5 Risks with gates**  
Extend Risks & Mitigations:

- **Gate:** “If we add a new API route, run Security Sentinel before Phase 3.”
- **Confidence (optional):** “Plan confidence: high/medium/low” and “Uncertainty: [list]” so Work and Review know where to double-check.

---

### 3. Handoff to Work and Review

**3.1 Plan → Work**  
- Work phase reads **Files to Create/Modify** (and optional machine block) and checks off only those files when making changes.
- Implementation steps stay as the single checklist; “parallelizable” tags can drive parallel subagents in a future executor.

**3.2 Plan → Review**  
- Review agents receive: “Scope: [Objective]. Out of scope: [list]. Success criteria and acceptance: [checklist]. Files: [list].”
- Enables “scope compliance” and “acceptance verification” as explicit review dimensions.

**3.3 Plan → Validate**  
- Validate phase uses the **acceptance checklist** as the minimal set of runtime checks (in addition to existing functional/API/UI validators).

---

### 4. Skill and Template Updates

**4.1 Plan template (in SKILL.md)**  
Add to the template:

- **Out of scope (this plan)**  
- **Research conflicts & resolution** (optional)  
- **Acceptance checklist** (per success criterion)  
- **Confidence & uncertainty** (optional)  
- **Step dependencies** (optional; e.g. “2.2, 2.3 parallel after 2.1”)  
- **Files (machine)** block (YAML/JSON)

**4.2 Research agent descriptors**  
- Add **structured output** section to each research agent (codebase, git-history, best-practices, memory) with the JSON shape above.
- Add optional **Regression / Impact Researcher** agent and wire it into the planning workflow.

**4.3 Synthesis instructions**  
- “Merge research using the structured outputs; resolve conflicts explicitly; cite sources in the plan; produce Out of scope, Acceptance checklist, and optional Confidence.”

---

## Implementation Steps (meta-plan)

| Step | Action |
|------|--------|
| 1 | Update SKILL.md plan template with new sections (out of scope, acceptance, confidence, step deps, files machine). |
| 2 | Add structured-output contracts to the 4 research agent .md files. |
| 3 | Add Regression/Impact Researcher agent (optional) and document when to use it. |
| 4 | Document “Research conflicts & resolution” and “Synthesis instructions” in the skill (plan phase workflow). |
| 5 | In Work/Review/Validate command or agent prompts, reference “scope + acceptance + files” from the plan where applicable. |

---

## Success Criteria

- [ ] Every new plan includes Out of scope and Acceptance checklist.
- [ ] At least one research agent (e.g. Memory) emits structured output used in synthesis.
- [ ] Review can assert “scope compliance” and “acceptance” when a plan is provided.
- [ ] No regression in plan readability or speed of production (template remains one plan.md).

---

## Risks & Mitigations

| Risk | Mitigation |
|------|------------|
| Overhead: plans take longer to write | Make confidence, step deps, and machine files optional; only Out of scope + Acceptance required. |
| Structured research output not used | Synthesis step must explicitly “merge from structured outputs”; add one example in skill. |
| Too many research agents (5) | Regression/Impact is optional; run only for larger or riskier changes. |

---

## Relevant Learnings

- **COMPOUND_LEARN.md**: Single source of truth (e.g. files, data); plan should cite learnings and quality-bars.
- **compound-engineering-power-up-plan**: Recurring workflows and fact-based verification; plan phase improvements should align with quality-gate and recurring doc.
