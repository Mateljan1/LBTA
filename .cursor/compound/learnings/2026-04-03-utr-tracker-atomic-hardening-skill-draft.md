# Skill Draft (Pending Approval)

## Batch
- id: `2026-04-03-utr-tracker-atomic-hardening`
- status: `pending_approval`

## Candidate Guardrail Additions

### A) UTR roster write contract
- trigger: edits to `app/api/utr-tracker/players/route.ts` or `lib/utr-tracker-supabase.ts`
- checks:
  1. enforce normalized-name uniqueness in payload and against existing roster.
  2. enforce atomic server-side write path (single RPC call) for batch save.
  3. return `409` for duplicate-name conflicts.

### B) Color Ball idempotent badge writes
- trigger: edits to `app/api/utr-tracker/color-ball/route.ts` or related SQL migration.
- checks:
  1. dedupe badge list per player in API layer.
  2. dedupe again in SQL (`SELECT DISTINCT`) to defend against malformed payloads.
  3. validate response remains `200` for duplicate badge tokens in a single valid payload.

### C) Supabase migration reconciliation playbook
- trigger: `supabase db push` error contains `Remote migration versions not found`.
- checks:
  1. use latest CLI (`npx supabase@latest ...`).
  2. run targeted `migration repair` for missing version.
  3. run `db push` after repair; avoid repeated push loops before reconciliation.

## Why this should become a skill
- These failures repeated across multiple work/validate/review loops.
- A deterministic preflight checklist would have prevented rework and migration dead-ends.

