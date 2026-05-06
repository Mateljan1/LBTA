# Leads Pipeline Next Moves — Implementation Plan

**Date:** 2026-05-06
**Status:** PLANNED → WORK
**Source:** Compound loop after `d5631a9` (server-side dedup + double-submit guard shipped). Followed founder ask: "lets review all the next moves and Do the full compound loop so everything is done and locked in."

## Overview

Three independent tracks that build on the leads pipeline foundation. Sequenced from low-risk-fast to higher-effort, so we can stop cleanly between phases if needed.

## Problem Statement

After shipping the dedup fix, three known gaps remain:

1. **Tree is dirty** with the May 4 founder corrections (LiveBall NTRP band 2.5+ → 3.0+, Saturday Adult Intermediate is interchangeable not separately priced, `minPlayersToRun: 5`). The corrections were applied to JSON + ProgramsTabView + coach-hub mirror but never committed. Production already shipped these because Vercel built them, but the repo doesn't reflect reality. (Source: `2026-05-04-bot-faq-knowledge-base-compound-learn.md`, pattern `founder-correction-cross-surface-sweep`.)
2. **Meta lead-ad leads bypass Supabase.** 165 of 251 leads (66%) live only in Notion because Meta lead forms write directly via Zapier. Supabase isn't a complete record, which makes any future dashboard / CRM / reporting misleading. (Source: this morning's audit; gap detail in `2026-05-06-leads-pipeline-dedup-compound-learn.md`.)
3. **No in-browser lead view.** Founder relies on a Desktop CSV. We can give them the same data behind the existing coach-hub auth wall, in the browser, with filters + CSV download.

## Proposed Solution

Three phases, each independently shippable and reversible.

### Phase 1 — Commit the May 4 founder corrections sweep

Just stage, commit, push the existing dirty diff. Production is already running this code; the repo just needs to catch up.

Files (already modified, just need to commit):

- `data/winter2026.json`, `data/spring-summer-2026.json`, `data/fall2026.json` — LiveBall band, `minPlayersToRun`, descriptions
- `data/coach-hub/hub-data.json` — Saturday note removed
- `components/programs/ProgramsTabView.tsx` — hardcoded LiveBall card NTRP band corrected
- `components/ProgramCard.tsx` — JSDoc comment updated

### Phase 2 — Notion → Supabase mirror (Meta lead ads)

A daily Vercel cron that pulls Meta lead-ad leads from Notion into Supabase, idempotent by Notion page ID.

**Architecture:**

```
Vercel Cron (daily 03:00 PT)
    └─→ POST /api/cron/mirror-meta-leads (auth: Authorization: Bearer ${CRON_SECRET})
            └─→ mirrorMetaLeadsToSupabase({ sinceMs })
                    ├─ Query Notion DB created_time > since
                    ├─ Filter: page has Meta-channel signal (campaign_name | ad_name | form_name | platform)
                    ├─ For each:
                    │     ├─ Skip if notion_page_id exists in leads
                    │     └─ Insert: source='meta-lead-ad', notion_page_id=<page id>, payload={campaign, ad, form, platform, ...}
                    └─ Return { scanned, skipped, inserted, errors }
```

**Schema change:** Add `notion_page_id text` column to `leads` (nullable, unique partial index where not null).

**Why daily not hourly:** Founder reviews leads ~daily. Daily cron is free on Vercel Hobby. Can move to hourly later if needed.

### Phase 3 — `/coach-hub/leads` admin view

Server-rendered table behind the existing coach-hub auth wall (so we don't add new auth surface). Reads Supabase only (which is now complete after Phase 2 mirror runs).

**Why under `/coach-hub/`:** The `proxy.ts` already gates `/coach-hub/*` with `COACH_HUB_SECRET`. Putting leads there inherits auth for free. Cookie path is `/coach-hub` so a separate `/admin/leads` would need its own auth setup — unnecessary complexity.

**UI:**

- Header: "Leads" + count + Channel filter dropdown (All / Trial / Private / Newsletter / Meta Ad / etc.)
- Table: Date | Name | Email | Phone | Channel | Class | Details
- Brand tokens (Pacific Dusk text, Sandstone backgrounds), 48px touch targets, focus rings
- "Download CSV" button → `/api/coach-hub/leads/export?channel=...`

## Implementation Steps

### Phase 1: Founder-correction sweep commit (~5 min)

- [ ] Step 1.1: Stage only the Phase-1 files (no `.cursor/compound/learnings/*` since those are auto-managed and partly mine from this session)
- [ ] Step 1.2: Commit with descriptive message referencing the May 4 cross-surface sweep
- [ ] Step 1.3: Push and verify Vercel build picks up (no functional change since prod already runs this; just repo catching up)

### Phase 2: Notion → Supabase mirror (~30 min)

- [ ] Step 2.1: Add Supabase migration `supabase/migrations/20260506000000_add_leads_notion_page_id.sql`
  - `alter table public.leads add column if not exists notion_page_id text;`
  - `create unique index if not exists idx_leads_notion_page_id on public.leads (notion_page_id) where notion_page_id is not null;`
- [ ] Step 2.2: Apply migration (`supabase db push`)
- [ ] Step 2.3: Update `lib/leads-store.ts` `StoreLeadParams` to accept optional `notionPageId` and pass through to insert
- [ ] Step 2.4: Create `lib/meta-leads-mirror.ts` with `mirrorMetaLeadsToSupabase({ sinceMs })`
- [ ] Step 2.5: Create `app/api/cron/mirror-meta-leads/route.ts` — `Authorization: Bearer ${CRON_SECRET}` check, calls mirror, returns JSON summary
- [ ] Step 2.6: Add `CRON_SECRET` to Vercel env (production only, generated random)
- [ ] Step 2.7: Update `vercel.json` `crons` array with daily schedule
- [ ] Step 2.8: Add unit tests for mirror lib in `lib/meta-leads-mirror.test.ts` (mock Supabase client; test filter logic, dedup logic, payload mapping)
- [ ] Step 2.9: Manual smoke: `curl -X POST -H "Authorization: Bearer $CRON_SECRET" https://lagunabeachtennisacademy.com/api/cron/mirror-meta-leads` and confirm summary JSON

### Phase 3: `/coach-hub/leads` admin view (~45 min)

- [ ] Step 3.1: Create `lib/leads-query.ts` with `getAllLeads(opts: { channel?: string }): Promise<LeadRow[]>` — server-only, uses service role key
- [ ] Step 3.2: Create `app/coach-hub/leads/page.tsx` — async server component, awaits `searchParams`, renders table
- [ ] Step 3.3: Create `components/coach-hub/LeadsTable.tsx` — client component for the filter dropdown only (rest is server)
- [ ] Step 3.4: Create `app/api/coach-hub/leads/export/route.ts` — GETs filter from query, returns text/csv with attachment header. Reuses `lib/leads-query.ts`
- [ ] Step 3.5: Add a "Leads" link to the coach-hub nav (find existing nav, add entry)

## Files to Create/Modify

| File | Action | Purpose | Phase |
|------|--------|---------|-------|
| `data/winter2026.json` | Modify (already dirty) | LiveBall NTRP band, minPlayersToRun, descriptions | 1 |
| `data/spring-summer-2026.json` | Modify (already dirty) | Same | 1 |
| `data/fall2026.json` | Modify (already dirty) | Same | 1 |
| `data/coach-hub/hub-data.json` | Modify (already dirty) | Saturday note removed | 1 |
| `components/programs/ProgramsTabView.tsx` | Modify (already dirty) | LiveBall hardcoded card NTRP band | 1 |
| `components/ProgramCard.tsx` | Modify (already dirty) | JSDoc comment | 1 |
| `supabase/migrations/20260506000000_add_leads_notion_page_id.sql` | Create | Add column + unique partial index | 2 |
| `lib/leads-store.ts` | Modify | Accept optional notionPageId | 2 |
| `lib/meta-leads-mirror.ts` | Create | Mirror function | 2 |
| `lib/meta-leads-mirror.test.ts` | Create | Unit tests | 2 |
| `app/api/cron/mirror-meta-leads/route.ts` | Create | Cron endpoint | 2 |
| `vercel.json` | Modify | Add cron schedule | 2 |
| `lib/leads-query.ts` | Create | Server-side leads getter | 3 |
| `app/coach-hub/leads/page.tsx` | Create | Server-rendered table | 3 |
| `components/coach-hub/LeadsTable.tsx` | Create | Client filter island | 3 |
| `app/api/coach-hub/leads/export/route.ts` | Create | CSV download | 3 |

## Out of scope (this plan)

- Real-time leads (cron is daily, not webhook-driven)
- Notion two-way sync (this is one-way: Notion → Supabase)
- Lead status tracking / pipeline stages (just a read view)
- Bulk operations (delete, update) on leads
- Email notifications when new leads arrive (already exist via existing `notify*` functions)
- Auth surface change for `/coach-hub/leads` (reuses existing coach-hub gate)

## Success Criteria

- [ ] **Phase 1:** Tree clean of May 4 corrections; commit pushed; Vercel rebuild succeeds (no functional change)
- [ ] **Phase 2:** Migration applied; cron route returns 200 with `{scanned,skipped,inserted,errors}`; manual run inserts ≥1 Meta lead from Notion; subsequent run skips duplicates (idempotent)
- [ ] **Phase 3:** `/coach-hub/leads` requires login (returns redirect to `/coach-hub/login` when unauth); shows current Supabase leads with channel filter; CSV download works; no console errors
- [ ] All 166+ existing tests still pass
- [ ] `npm run lint` clean
- [ ] `next build` clean
- [ ] Deployed to Vercel production with SHA verified

## Acceptance checklist

- [ ] **Phase 1 commit pushed** → Check: `git log -1 origin/main` includes the founder-correction commit; Vercel deployment ready and aliased
- [ ] **Migration applied** → Check: `npx supabase db push` succeeds; `select column_name from information_schema.columns where table_name='leads'` includes `notion_page_id`
- [ ] **Mirror inserts Meta leads** → Check: Curl cron route with valid CRON_SECRET; assert `inserted >= 1` after first run; assert `inserted === 0` after second run within same window
- [ ] **/coach-hub/leads renders** → Check: Curl with valid coach-hub cookie returns 200 + HTML containing `<table>`; without cookie returns 307 redirect
- [ ] **CSV export** → Check: GET `/api/coach-hub/leads/export` with cookie returns `Content-Type: text/csv` and rows
- [ ] **Tests pass** → Check: `./node_modules/.bin/vitest run` exits 0 with new mirror tests included
- [ ] **Build clean** → Check: `npm run build` exits 0

## Research Sources

- `lib/leads-store.ts` — existing storeLead pattern; matches the new mirror's insert shape
- `lib/notion-leads.ts` — Notion client setup pattern (auth via NOTION_API_KEY, db ID from NOTION_DATABASE_ID)
- `proxy.ts` — coach-hub auth gate matcher (extends to `/coach-hub/leads` for free)
- `lib/coach-hub-auth.ts` + `lib/coach-hub-auth-server.ts` — auth model (HMAC SHA-256, 7d cookie, Path=/coach-hub)
- `vercel.json` — existing crons array (currently empty `[]`)
- Notion API: Created-time filter: `{filter: {timestamp: 'created_time', created_time: {after: '2026-05-05T00:00:00.000Z'}}}`
- Vercel cron docs: schedule string is cron expression; cron auto-includes `Authorization: Bearer ${CRON_SECRET}` header (Pro plan only). On Hobby, manual trigger needed; we still set CRON_SECRET so the route is auth-gated.

## Relevant Learnings

- `lib-level-form-pipeline-dedup` (patterns) — Phase 2 reuses this principle: idempotency via `notion_page_id` unique constraint at DB layer, not per-mirror-run logic
- `multi-storage-lead-audit` (patterns) — Phase 2 directly addresses: collapse Notion + Supabase into single source
- `dirty-tree-isolated-commit` (patterns from earlier) — Phase 1 follows: only commit the May 4 sweep files, leave my compound-learn additions for later or in a separate commit
- `founder-correction-cross-surface-sweep` (patterns) — already validated: Phase 1's diff demonstrates the sweep was applied correctly to all 6 surfaces
- `webhook-secret-timing-safe` (patterns) — Phase 2 cron auth uses `crypto.timingSafeEqual` for `Authorization: Bearer` check
- `parseJsonBody-then-validateRequest` (patterns) — Phase 2 cron uses parseJsonBody for any body params (none in v1, but pattern stays)

## Risks & Mitigations

| Risk | Mitigation |
|------|------------|
| Phase 1 commit accidentally bundles compound-learn files | Stage explicitly: `git add data/ components/ProgramCard.tsx components/programs/ProgramsTabView.tsx`; verify with `git status --short` before commit |
| Migration breaks existing leads inserts | Column is nullable with default null; existing inserts that don't pass notionPageId still work |
| Vercel Hobby plan doesn't run crons | Add CRON_SECRET so the endpoint can be hit manually or by an external cron (cron-job.org) if Hobby; document this in plan |
| Mirror inserts Notion-only entries that already exist in Supabase via website (different write paths) | Match by email + source first (existing); only insert if neither match. Or: trust notion_page_id only — accept that a website lead and a Meta lead with same email are separate records (correct behavior) |
| `/coach-hub/leads` exposes service role key path | Server component only; service role never reaches client. CSV export is a server route (no client fetch) |
| Adding `/coach-hub/leads` matcher missed in proxy.ts | proxy.ts already has `/coach-hub/:path*` — `/coach-hub/leads` matches automatically |

## Confidence & uncertainty

- **Phase 1 confidence:** High. Just commit existing dirty files. Production already runs this code.
- **Phase 2 confidence:** Medium-high. Migration + cron + lib pattern is well-trodden. Risk is Notion field naming variance (the audit showed two schemas overlaid in the same DB).
- **Phase 3 confidence:** Medium. Server-component table is straightforward, but auth gating + CSV export route has more moving parts. Will design conservatively (server-rendered, minimal client code).

**Uncertainty to verify in Work:**

- Phase 2: Notion query's `filter` param exact shape for `created_time` timestamp filter (verify via direct curl during work)
- Phase 3: Coach-hub login redirect carries `?next=` properly through to `/coach-hub/leads` (test in browser)

## Step dependencies

- Phase 1 is independent of 2 and 3.
- Phase 3 depends on Phase 2 (so Supabase has Meta leads to display) — but ships gracefully without Phase 2 (table just shows website-only leads until first cron run).
- Phase 2's Step 2.3 (`leads-store.ts` update) is independent of 2.4–2.7 and can ship alone.
