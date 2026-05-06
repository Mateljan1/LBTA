# 2026-05-06 — Leads Pipeline Hardening (Compound Learn)

**Trigger:** `/learn` after Plan → Work → Review → Validate → Deploy on the leads-pipeline fix (commit `d5631a9`, deployed to production).

## What we built

1. **Audited** the lead capture pipeline against production data:
   - Supabase `leads` table: **86 leads** since 2026-03-09
   - Notion "LBTA Winter 2026 Registrations" DB: **251 leads** (165 of which never touched Supabase)
   - Gap explained: Meta/Facebook/Instagram **lead-ad forms** write directly to Notion via Zapier; they never hit the website code path.
2. **Added** 120s server-side dedup window in `lib/leads-store.ts` — `DEDUP_WINDOW_MS = 120_000`. Lookup recent `(email, source)` within window; skip insert + log if found; fail-open on lookup error. Single change protects all 7 form routes (`book`, `register`, `register-program`, `register-year`, `newsletter`, `scholarship`, `chat`).
3. **Added** synchronous `useRef` double-submit guard to `TrialBookingModal.tsx` (56% of website submissions). React state batching means rapid double-clicks beat `disabled={isSubmitting}`; production showed 14 duplicate `(email, source)` pairs within 25–95s windows.
4. **Updated** `lib/leads-store.test.ts` with a sanity assertion on `DEDUP_WINDOW_MS`.
5. **Generated** two CSVs on the founder's Desktop:
   - `lbta-leads-2026-05-05.csv` — Supabase only (86 leads)
   - `lbta-leads-ALL-2026-05-06.csv` — **292 leads** unified across Supabase + Notion, deduped by email + last-10-digit phone, with a `Channel` column classifying source (Trial Booking, Private Lesson Booking, Meta Lead Ad, Newsletter, Imported, etc.)

## Verification

- 166/166 tests pass (`./node_modules/.bin/vitest run`)
- ESLint clean
- `next build` clean (Compiled in 3.0s)
- Vercel deployment timing matched commit timing within 14s; ✓ Ready in 52s; aliased to `lagunabeachtennisacademy.com`; live HTTP 200.

## Why this is compounding work

- The 120s dedup window is **lib-level**, so every existing AND future form route inherits the protection without per-route changes.
- The CSV export script merges multiple storage systems with a single Channel column — re-runnable any time founder wants a fresh offline copy.
- The audit revealed Meta lead-ad leads as a separate channel that the codebase doesn't see. This unblocks a future "Notion → Supabase mirror" cron that would unify all 251+ leads under one source of truth.

## New corrections (corrections.jsonl)

- Always **read** an API route before suggesting integration edits — JTT was deprecated to 410 Gone, suggestion would have re-added dead code.
- Cross-check **all** lead storage targets before answering completeness questions — Supabase had 86; truth was 251 across Supabase + Notion.
- Don't trust `disabled={isSubmitting}` alone — useState batches async; add `useRef` synchronous guard.

## New patterns (patterns.json)

- `lib-level-form-pipeline-dedup` — 120s window in storeLead-equivalent function.
- `useref-synchronous-double-submit-guard` — submitRef.current synchronous lock + setIsSubmitting; release in finally.
- `multi-storage-lead-audit` — enumerate Supabase + Notion + AC + GHL + Zapier; dedupe; report union.
- `vercel-deploy-verify-via-timing` — when no VERCEL_TOKEN: timing match + ✓ Ready + alias + HTTP 200.
- `lead-export-csv-with-channel-classification` — Date/Time/Name/Email/Phone/Channel/Class/Details/Notion Page columns.

## New anti-patterns (anti-patterns.json)

- `relying-only-on-disabled-for-double-submit`
- `single-storage-assumption-without-audit`
- `deprecated-route-edit-without-read`
- `bundle-unrelated-dirty-files-in-focused-commit`

## New quality bars (quality-bars.json)

- `formPipelineServerSideDedup` (must) — server-side dedup window in storeLead-equivalent.
- `multiStorageLeadAuditBeforeClaim` (must) — query every storage target before claiming.
- `deprecatedRouteReadBeforeEdit` (must) — read source before proposing edits.
- `formPipelineClientSyncGuard` (should) — useRef alongside isSubmitting.

## Files changed

- `lib/leads-store.ts` — +34/-2 (DEDUP_WINDOW_MS, lookup, skip-and-log path)
- `lib/leads-store.test.ts` — +12/-1 (DEDUP_WINDOW_MS sanity test)
- `components/TrialBookingModal.tsx` — +9/-0 (submittingRef + guard + release in finally)

## Deferred / next moves

1. **Dirty tree cleanup** — `components/ProgramCard.tsx`, `components/programs/ProgramsTabView.tsx`, `data/winter2026.json`, `data/spring-summer-2026.json`, `data/fall2026.json`, `data/coach-hub/hub-data.json` are dirty with what looks like programs/coaches polish; not part of this scope.
2. **Notion → Supabase mirror cron** — n8n or Vercel cron that mirrors new Notion lead-ad rows into Supabase so the `leads` table becomes the unified source of truth (~30-min build).
3. **`/admin/leads` internal page** — merged Supabase + Notion view in-browser instead of CSV (~half-day build).

## Compound delta

This loop's PR was **3 files, 53 lines** but unlocked:
- Production-grade dedup across 7 routes
- A complete picture of the lead pipeline (and its gap)
- A reusable CSV export pattern
- 4 new must-level quality bars to enforce in future reviews

Each subsequent lead-pipeline change should be **easier**, not harder.
