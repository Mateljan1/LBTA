# UTR Tracker Ship-Complete — Compound Learn (2026-04-03)

## Context
- Scope: UTR-only execution (public tracker, admin workflows, tests, ops/deploy proof)
- Repo state: intentionally dirty outside UTR scope; UTR work committed in isolated commits
- Commits:
  - `0c4f7f7` feat(utr-tracker): ship tracker app with admin workflows and safety gates
  - `3aa5200` chore(utr-tracker): align migration files for remote history repair
  - `c8e036f` chore(utr-tracker): remove legacy 20260403 migration reference

## Results
- Quality gates:
  - `npm run lint` pass
  - `npm run test` pass (158 tests)
  - `npm run build` pass
- Production deploy:
  - `vercel --prod` pass
  - `/utr-tracker` and `/utr-tracker/admin/login` return 200 on production domain
- Supabase:
  - Migration history mismatch resolved with repair sequence
  - Remote ended aligned on canonical versions: `20260401`, `20260402`, `2026040301`, `2026040302`

## Corrections
- Local migration files with duplicate base version (`20260403` and `2026040301`) create repeat push failures.
  - Correction: keep one canonical sequence; use repair only to reconcile remote history once.
- Match import defaulting to append invites accidental duplicate standings.
  - Correction: default admin flow to replace-scope mode for `week + division + date`.
- Color Ball week writes split across multiple ops can leave partial state.
  - Correction: enforce atomic RPC path and keep fallback behavior explicit in ops doc.

## Reusable Patterns
- **utr-admin-write-mode-default-replace**
  - When bulk-importing structured match rows, default to replace scope and expose append as advanced mode.
- **supabase-migration-history-reconcile**
  - On `Remote migration versions not found`: `migration list` -> targeted `migration repair` -> verify -> `db push`.
- **dirty-tree-isolated-commit**
  - In mixed worktrees, stage only scoped files and commit value units without reverting unrelated user changes.

## Anti-patterns
- Running repeated `db push` while local/remote migration versions are ambiguous.
- Renaming migration versions mid-flight without updating runbook and committing the migration sequence changes.
- Treating deploy as complete before production-domain endpoint checks.

## Standards reinforced
- UTR imports must be idempotent-safe by default.
- Supabase migration versions are immutable once shared; reconcile via history repair, not ad-hoc version drift.
- Production verification must include live-domain route checks after deploy.

