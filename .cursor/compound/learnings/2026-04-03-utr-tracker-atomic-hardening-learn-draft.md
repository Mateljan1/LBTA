# Learning Draft (Pending Approval)

## Batch
- id: `2026-04-03-utr-tracker-atomic-hardening`
- status: `pending_approval`
- needs_verification: `false`

## Task Outcome
- Goal: close UTR tracker review blockers (atomic player writes, duplicate normalized-name guard, Color Ball badge dedupe) and re-validate.
- Outcome: implemented and validated in code + runtime.

## Evidence (direct)
- `npm run lint` passed.
- `npm run test` passed (`158/158`).
- `npm run build` passed.
- Runtime checks passed:
  - `/utr-tracker` -> `200`
  - admin login -> `200`
  - unauthorized players write -> `401`
  - duplicate normalized names -> `409`
  - valid players write -> `200`
  - color-ball duplicate badges payload path -> `200`
- Supabase migration reconciliation succeeded with latest CLI:
  - `npx supabase@latest migration repair --status reverted 20260403`
  - `npx supabase@latest db push`

## Extraction

### 1) Atomic roster writes
- problem: split `upsert` + `insert` in player save path can partially apply data on mid-flight failure.
- solution_pattern: use single RPC (`upsert_players_batch`) for all rows in one DB transaction boundary.
- anti_pattern: multi-step write for one logical save operation without transactional boundary.
- quality_rule: admin bulk player writes must use one atomic server-side operation.
- confidence: `0.91`

### 2) Normalized-name collision prevention
- problem: duplicate normalized names can be persisted and later break name-based resolution/import flows.
- solution_pattern: validate normalized-name uniqueness both within payload and against existing roster before write.
- anti_pattern: validating only IDs while allowing ambiguous human identifiers.
- quality_rule: roster writes must reject normalized duplicate names with `409`.
- confidence: `0.89`

### 3) Color Ball badge dedupe hardening
- problem: duplicate badge ids in a single request can trigger collision/unstable write behavior.
- solution_pattern: dedupe badges in API layer and enforce `SELECT DISTINCT` in DB function.
- anti_pattern: trusting raw badge arrays from client input.
- quality_rule: badge writes must be idempotent for duplicated badge tokens in one payload.
- confidence: `0.88`

### 4) Supabase migration repair workflow
- problem: mixed migration-version drift and temp-role auth instability causes repeated `db push` failures.
- solution_pattern: use latest CLI, run targeted `migration repair`, then `db push` once.
- anti_pattern: repeated `db push` retries without first reconciling migration history/version mismatch.
- quality_rule: on `Remote migration versions not found`, perform repair-first workflow before push retries.
- confidence: `0.86`

## Recommendation
- Stage as memory updates only; do not auto-apply.

