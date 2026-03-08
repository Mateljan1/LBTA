# Compound Learnings — LBTA Lead Store (2026-03-06)

**Source:** Code review summary, validation summary, and applied fixes for optional Supabase lead store.

---

## CORRECTIONS (do not repeat)

1. **Awaiting optional side effects in request path** → Use fire-and-forget for non-critical writes (e.g. `void storeLead(...)`) so TTFB is not tied to Supabase latency.
2. **Reading env at module load** → Read Supabase env inside `getClient()` (or a small helper) so tests can mock and `getClient()` returns null when unset.
3. **No guard for empty email** → In `storeLead`, return early when `!email?.trim()` to avoid unnecessary DB round-trips and keep single responsibility in callers.
4. **`npm run test` failing with "vitest: command not found"** → Use explicit path in script: `"./node_modules/.bin/vitest run"` so CI and local shells without vitest on PATH still run tests.

---

## PATTERNS (reuse)

1. **Optional backend feature** — When a feature (e.g. lead store) depends on env and must not affect success path: check env in a getter, no-throw API, fire-and-forget from routes, document in .cursorrules and README.
2. **Migration rollback** — Add a short comment at top of SQL migrations with rollback command (e.g. `DROP TABLE IF EXISTS ...`) for safe rollback.
3. **Single source of truth** — Keep program/schedule/pricing in `/data/*.json` and reference from .cursorrules Part 12/13; add new lib files to Part 13 file tree.

---

## STANDARDS (enforcement)

1. **New API integrations** — Document in .cursorrules: tech stack (Part 5), data/source-of-truth (Part 12), file structure (Part 13). Level: required for project consistency.
2. **Test script** — Prefer `./node_modules/.bin/<cli> run` in package.json for dev tools (vitest, eslint, next) so `npm run test` / `npm run lint` / `npm run build` work without global installs. Level: recommended.

---

## ARTIFACTS

- `plans/CODE_REVIEW_SUMMARY_2026-03-06.md` — Review synthesis (82/100, ready to merge).
- `plans/VALIDATION_SUMMARY_2026-03-06.md` — Validation (88/100, ready to ship).
- `plans/DEPLOY_SUMMARY_2026-03-06.md` — Pre-deploy gate and rollback notes.
- `plans/COMPOUND_LEARNINGS_2026-03-06.md` — This file.
