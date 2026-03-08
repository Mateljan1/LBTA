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

- Before implementing or reviewing, load **learnings/** (especially `anti-patterns.json` and `quality-bars.json`) to avoid repeating past issues.
- After a compound review, run **/compound:learn** to update these files from the latest review summary.
