# 2026-05-06 — Leads Pipeline Next Moves (Full Compound Loop)

**Trigger:** Founder ask: "lets review all the next moves and Do the full compound loop so everything is done and locked in." Followed `/learn` first then full Plan → Work → Review → Validate → Deploy → Compound.

## Tracks shipped

### Phase 1 — Founder-correction sweep commit (`d546b3e`)
The May 4 LiveBall NTRP corrections + Saturday Adult Intermediate interchangeable + `minPlayersToRun: 5` had been applied to JSON + ProgramsTabView + coach-hub mirror but never committed. Production was already running this code via Vercel build; the repo just caught up. 6 files, 25 insertions / 26 deletions.

### Phase 2 — Notion → Supabase mirror (`8ec86dc`)
- Supabase migration adds `notion_page_id` text + unique partial index for mirror idempotency
- `lib/meta-leads-mirror.ts` queries Notion DB created-time filter, detects Meta-channel pages (campaign_name | ad_name | form_name | platform | form_id | campaign_id present), maps to StoreLeadParams with `notionPageId`
- `lib/leads-store.ts` updated: when `notionPageId` is set, dedup is keyed on it (DB-enforced + lookup-and-skip); when not set, falls back to existing 120s (email, source) window
- Vercel cron daily @ 03:00 PT calls `/api/cron/mirror-meta-leads` with `Authorization: Bearer ${CRON_SECRET}` (Pro plan auto-injects; Hobby can use external scheduler)
- 10 unit tests for detection + mapping logic
- Smoke-imported **139 Meta leads** into Supabase (86 → 225 total). Idempotent re-run inserted 0 new rows.

### Phase 3 — `/coach-hub/leads` admin view (`04366d3`)
- Server-rendered table at `/coach-hub/leads` with channel filter chips (All / Trial / Private / Program / Newsletter / Scholarship / Meta Lead Ad / Chatbot) and per-channel counts
- Reuses existing `proxy.ts` auth gate at `/coach-hub/:path*` — no new auth surface needed
- `lib/leads-query.ts` is the single source for both the page and the CSV export route (`channelLabel`, `programLabel`, `leadMatchesChannel`, `leadsToCsv`)
- `/api/coach-hub/leads/export` route returns text/csv with attachment header. Defense-in-depth cookie check at handler entry since `proxy.ts` has a passthrough for `/api/coach-hub/*` paths
- "Leads →" link added to coach-hub header for discoverability
- Brand tokens, 48px touch targets, focus-visible rings, robots noindex, force-dynamic

### Phase 4 — Ops fix (`fda872d`)
First Phase 2/3 deploy failed with `CRON_SECRET environment variable contains leading or trailing whitespace, which is not allowed in HTTP header values`. Root cause: I had used `echo "$SECRET" | npx vercel env add ...` which appended a trailing newline. Fix: `printf '%s' "$SECRET" | npx vercel env add ...` (no trailing newline). Empty commit re-triggered the build → ✓ Ready.

## Verification chain

| Gate | Result |
|------|--------|
| Tests | 176/176 pass |
| Lint | clean |
| Build | clean (`Compiled successfully in 3.0s`) |
| Migration | `notion_page_id` column queryable on Supabase |
| Smoke local — cron no auth | 401 Unauthorized ✓ |
| Smoke local — cron with auth | 200, mirrored 139 Meta leads ✓ |
| Smoke local — cron rerun | 200, idempotent (0 new rows) ✓ |
| Smoke local — `/coach-hub/leads` no cookie | 307 → `/coach-hub/login` ✓ |
| Smoke local — export no cookie | 401 ✓ |
| Vercel prod build | ✓ Ready (51s) |
| Smoke prod — `/coach-hub/leads` | 307 redirect ✓ |
| Smoke prod — cron with auth | 200 JSON ✓ |
| Live HTTP | 200 |

## Compound delta

This loop produced **4 commits, 11 files, ~1000 lines** but unlocked:

- Single-source-of-truth for leads in Supabase (was 34% complete; now 100%+ as Meta leads continue to mirror daily)
- An in-browser admin view that founder/team can use without running CSV scripts
- A per-channel filter that segments the funnel (trial vs private vs Meta ad vs newsletter — instantly visible)
- A reusable cron + mirror pattern (notion-supabase-mirror-cron) that applies to any future external-system → Supabase mirror

5 new patterns + 2 new anti-patterns + 4 corrections compound into future work.

## New patterns (patterns.json)

- `notion-supabase-mirror-cron` — Vercel cron + storeLead with notionPageId for idempotent multi-storage mirror
- `auth-gated-admin-route-under-existing-prefix` — Put new internal views under `/coach-hub/...` to inherit proxy.ts auth + cookie path
- `csv-export-shared-lib-server-only` — One `leads-query.ts` lib serves both the page and the export route
- `vercel-env-add-no-newline` — `printf '%s' "$SECRET" | vercel env add` to avoid trailing-newline bug
- `supabase-unique-partial-index-for-mirror-idempotency` — Unique partial index on optional source-id column lets website rows + mirrored rows coexist

## New anti-patterns (anti-patterns.json)

- `echo-pipe-secret-to-vercel-env` — echo trailing newline corrupts HTTP-header secrets
- `skip-multi-storage-cron-when-channels-fragment` — leaving leads fragmented compounds future reporting pain

## New corrections (corrections.jsonl)

- vercel env add via echo captures trailing newline → use printf %s
- dev server with `npm run dev` in backgrounded shell missed PATH to local `next` binary → use `./node_modules/.bin/next dev` directly

## Files changed (this loop, beyond `d5631a9`)

| Phase | File | Action |
|-------|------|--------|
| 1 | `data/{winter,spring-summer,fall}2026.json`, `data/coach-hub/hub-data.json`, `components/programs/ProgramsTabView.tsx`, `components/ProgramCard.tsx` | Modify (commit existing dirty diff) |
| 2 | `supabase/migrations/20260506000000_add_leads_notion_page_id.sql` | Create |
| 2 | `lib/leads-store.ts` | Modify (notionPageId support) |
| 2 | `lib/meta-leads-mirror.ts` | Create |
| 2 | `lib/meta-leads-mirror.test.ts` | Create |
| 2 | `app/api/cron/mirror-meta-leads/route.ts` | Create |
| 2 | `vercel.json` | Modify (cron schedule) |
| 3 | `lib/leads-query.ts` | Create |
| 3 | `app/coach-hub/leads/page.tsx` | Create |
| 3 | `app/api/coach-hub/leads/export/route.ts` | Create |
| 3 | `components/coach-hub/CoachHubClient.tsx` | Modify (Leads link in header) |

## Commits

- `d546b3e` `[programs] Apply May 4 founder corrections sweep across data + UI`
- `8ec86dc` `[leads] Notion → Supabase mirror for Meta lead-ad rows`
- `04366d3` `[coach-hub] Add /coach-hub/leads admin view + CSV export`
- `fda872d` `[ops] Trigger redeploy after CRON_SECRET fix (no whitespace in env var)`

## What this enables next

- **Daily mirror** keeps Supabase complete without manual work
- **Single dashboard** at `/coach-hub/leads` for founder + admins
- **CSV download** anytime from the dashboard with channel filter applied
- **Future agent tools** can query Supabase `leads` directly (was incomplete before)
- **Attribution / reporting** can now segment by `source = 'meta-lead-ad'` vs website channels

## Deferred (intentionally out of scope this loop)

- Real-time webhook from Notion / Zapier (cron is daily; sufficient for current cadence)
- Notion two-way sync (write back from Supabase to Notion)
- Lead status / pipeline stage tracking
- Bulk operations (delete, update) on leads
- Email notifications when new leads arrive (already in place via existing `notify*` integrations)
