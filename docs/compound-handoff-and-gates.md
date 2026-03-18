# Compound Engineering — Handoffs and Gates

**Purpose:** Single reference for what each phase passes to the next and how gates are evaluated. Aligns with the full workflow power-up (see `plans/compound-engineering-full-workflow-power-up.md`).

---

## Handoff matrix

| From → To | What to pass |
|-----------|--------------|
| **Plan → Work** | Plan file path; Files to Create/Modify (table + optional YAML); Implementation steps; **Out of scope**; **Acceptance checklist**. |
| **Work → Review** | Plan path; commit list or diff range; **Out of scope + Acceptance checklist + Files** from plan. |
| **Review → Validate** | Review decision + critical list; plan's **Acceptance checklist**; optional validation manifest path. |
| **Validate → Deploy** | Validation result (prose + optional **validation-summary.json**); acceptance pass/fail; environment validated. |
| **Deploy → Compound** | Deploy summary; rollback script path (if created); post-deploy monitor result. |
| **Compound → Plan** | Updated memory (corrections, patterns, quality-bars); project learnings (e.g. COMPOUND_LEARN.md, .cursor/compound/learnings/). |

---

## Gate summary

| Gate | When | Inputs | Pass condition (example) |
|------|------|--------|---------------------------|
| **Work complete** | End of Work | Plan acceptance checklist | All acceptance items pass or are documented as deferred. |
| **Review gate** | Before Validate | Review synthesis (or review-summary.json) | `decision === "ready"` and `criticalCount === 0`. |
| **Validate gate** | Before Deploy | Validate synthesis (or validation-summary.json) | `blockers.length === 0` and `overallScore >= 70`. |
| **Deploy gate** | Before deploy execution | All above + pre-deploy agents | Pre-deploy pass; rollback script/commands ready. |

---

## Structured outputs (for gates)

When Review and Validate produce structured output, Deploy gate can use:

- **review-summary.json** (or fenced JSON): `overallScore`, `byCategory`, `criticalCount`, `warningCount`, `decision`, `criticalFindings`.
- **validation-summary.json** (or fenced JSON): `overallScore`, `byValidator`, `blockers`, `warnings`, `acceptanceResults`, `decision`.

Thresholds (e.g. review score ≥ 70, validation score ≥ 70) are documented in this file and in `docs/quality-gate.md` where applicable.

---

## Related

- `docs/quality-gate.md` — Lighthouse, responsive, forbidden copy, build/lint.
- `docs/recurring-workflows.md` — When to run compound commands and learn.
- `plans/compound-engineering-full-workflow-power-up.md` — Full workflow power-up spec.
