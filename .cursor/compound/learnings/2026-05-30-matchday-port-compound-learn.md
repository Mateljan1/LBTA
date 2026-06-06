# Session — Match Day port into the LBTA site (2026-05-30)

## What shipped
Ported the standalone Netlify "LBTA Match Day" round-robin runner into the Next.js site at
**`/coach-hub/matchday`** (reused the existing `proxy.ts` Coach Hub auth gate — no new auth layer).
Did NOT rebuild from scratch; treated the reference `lbta_matchplay_app.html` as the spec and
re-implemented it on-system.

New files:
- `lib/matchday-config.ts` — pure model + Berger round-robin + stable `matchKey` + `levelFromUtr` +
  standings + **format-aware score evaluation** (single set vs best-of-N + match-tiebreak decider). 17 unit tests.
- `lib/matchday-roster.ts` — quick-batches pulled from the integrated Supabase UTR tracker
  (`getAllPlayers`) with a seeded Week-7 fallback when Supabase is unconfigured.
- `lib/notion-match-results.ts` — port of the reference `sync.js`, upserts to Notion Match Results
  via `@notionhq/client` (keyed on the `Match` title). No-op when unconfigured.
- `lib/matchday-export.ts` — markdown "Copy summary" fallback.
- `app/api/coach-hub/matchday/sync/route.ts` — token-gated sync (capability token `MATCHDAY_SYNC_TOKEN`,
  constant-time compare, rate-limited, zod-validated). Replaces the reference's open POST.
- `components/coach-hub/matchday/` — `useMatchDay` hook (localStorage + debounced sync + offline
  replay queue), `ScoreCounter` (the +/- tap-counter upgrade Andrew asked for), `MatchDayApp`
  (Today/Add/Notes/How + tabs), `MatchDayDraws` (court map + round-by-round + standings).
- Page + Coach Hub header link ("Match Day →").

## Decisions made (the spec's 5 open questions)
1. IA → `/coach-hub/matchday` (reuses existing auth gate + IA).
2. Auth → existing Coach Hub password gate for the page; capability token for the sync API.
3. UTR client → no live UTR Sports API exists in the repo; used the Supabase UTR tracker as the roster source.
4. Historic backfill (Weeks 1/3/6) → deferred, out of scope.
5. Scoring docs → none available; built a format-aware tap counter instead (single set + best-of-N + MTB).

## Upgrades over the reference
- Tap-counter scoring (fixes the "typed 11 meaning 5-1" ambiguity from live Week-7 use) with auto winner detection.
- Auth on sync; offline replay queue; consolidated redundant Today/Draws scoring; dropped the hardcoded
  PII contact list (privacy) in favor of live roster + standings.
- Full LBTA design-system styling (brand tokens, no hardcoded hex) — passes strict `tokens:check`.

## Env to set on Vercel for live sync (optional; app works local-only without them)
`NOTION_MATCH_RESULTS_DB_ID`, `NOTION_MATCH_RESULTS_TOKEN` (or reuse `NOTION_API_KEY`), `MATCHDAY_SYNC_TOKEN`.
The Notion integration must be added to the Match Results database (⋯ → Connections).

## Verification
`npx vitest run` → 256/256 pass · `next build` ✓ · `npm run lint` clean · strict brand check ✓.
Not yet committed/pushed (Andrew to review). No live browser smoke test (page is behind the auth gate).

## Follow-ups (from spec §10, deferred)
Andrew live `/live` dashboard reading Notion · Players relation sync · historic backfill ·
sister-pair avoid-pairing flag · per-coach pod assignment · PWA manifest/icons.
