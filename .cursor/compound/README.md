# Compound Engineering — LBTA

This folder holds outputs from the compound-engineering workflow (plan → work → review → validate → deploy → compound).

## Contents

- **review/** — Review context and 12-agent summary (see parent `.cursor/compound-review-*.md` or review output).
- **learnings/** — Captured learnings from the last review:
  - `LEARNINGS.md` — Human-readable CORRECTIONS, PATTERNS, STANDARDS.
  - `corrections.jsonl` — Past mistakes and corrections (one JSON object per line).
  - `anti-patterns.json` — Patterns to avoid.
  - `quality-bars.json` — Must/should standards.
  - `patterns.json` — Patterns to reuse.

## Use

- **Decision lenses:** For plan → review → compound work, follow **`.cursor/rules/decision-lenses.mdc`** (survivorship/absent evidence, loss-function loops, CORE feedback, time horizons, identity, decision OS). Full reference: **`docs/decision-making-frameworks.md`**. Referenced from `.cursorrules` Part 19.
- Before implementing or reviewing, load **learnings/** (especially `anti-patterns.json` and `quality-bars.json`) to avoid repeating past issues.
- **When to run /compound:learn** (so you don’t have to remember):
  1. **After completing a plan** — e.g. right after `/compound:work` on a plan is done.
  2. **After a review or validation pass** — after `/compound:review` or `/compound:validate`.
  3. **End of a significant session** — before closing a long work session.
- Main learnings doc: `plans/COMPOUND_LEARN.md`. Update it (and optionally this folder) when you run learn.

**Full power stack:** For MCPs, all 13 review + 5 validation + 5 deploy agents, skills to invoke, and scripts, see **`docs/power-stack.md`**.
