# LBTA Custom GPTs — Operations

> How the six-GPT system runs day-to-day, week-to-week, and across the year. Owners, rituals, runbooks, and scripts.

---

## Folder layout

```
05-OPERATIONS/
├── README.md                      ← this file
├── eval/                          ← dogfooding & metrics
│   ├── dogfood-week-playbook.md
│   ├── dogfood-log-template.md
│   ├── weekly-metrics.csv
│   └── red-team-audit-template.md
├── runbooks/                      ← when something goes wrong
│   ├── hallucination-incident.md
│   ├── voice-drift.md
│   └── front-desk-incident.md
├── scripts/                       ← repeatable processes
│   ├── friday-compound-review.md
│   ├── monthly-knowledge-refresh.md
│   ├── quarterly-review.md
│   └── annual-strategy-review.md
└── ownership.md                   ← RACI: who owns what
```

## Cadence summary

| Cadence | Ritual | Owner | Time |
|---|---|---|---|
| **Daily** | Use the GPT, log time saved | Each user | inline |
| **Friday 4–4:30pm** | Compound Review (15 min/coach) | Andrew | 30–45 min total |
| **End of month** | Knowledge refresh + metrics roll-up | Andrew | 60 min |
| **End of quarter** | Quarterly Review (what shipped, what's next) | Andrew | 90 min |
| **End of Q1 each year** | Annual strategy review | Andrew | 2 hr |
| **Monthly** | Red team audit (Front Desk especially) | Andrew | 30 min |

See individual scripts for details.

## Owners (RACI)

See `ownership.md`.

## How to use this folder

- Something breaks → `runbooks/`.
- It's Friday → `scripts/friday-compound-review.md`.
- New month → `scripts/monthly-knowledge-refresh.md`.
- New quarter → `scripts/quarterly-review.md`.
- Day 1, Day 7, Day 28 → `eval/dogfood-week-playbook.md`.
- Day 28 + monthly → `eval/red-team-audit-template.md`.
