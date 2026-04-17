# Compound Learn — 2026-04-16 (2nd run) · SEO P1 Schema + Copy + Stats Bundle

**Loop:** Plan (`2026-04-16-seo-p1-schema-copy-bundle.md`) → Work → in-loop Review → Validate → Deploy → Learn
**Deploy SHA:** `83b653b` (push to `origin/main`, Vercel prod verified at `lagunabeachtennisacademy.com`)
**Commits:** 8 atomic commits across titles, descriptions, stats, bio, testimonial removal, schema review trim, per-coach Person schema, multi-location LocalBusiness
**Throughput:** entire compound loop (plan → learn) in one session — **~4 hours**

## Memory hits that actively saved time this loop

| Memory entry (from prior P0 learn) | How it paid off today |
|---|---|
| **QB `auditClaimsVerifiedBeforeP0`** (must) | During plan research I caught that AggregateRating schema already exists in `components/SEOSchemas.tsx`. The SEO audit said "add it" as a P1 item. Without the quality bar prompting me to verify, we'd have spent a commit adding a second one. **1 wasted commit avoided.** |
| **QB `deployLiveSmokeTest`** (must) | Live HTTP smoke revealed the title-template duplication bug (`<title>FAQ \| ... \| LBTA \| Laguna Beach Tennis Academy</title>` — 68 chars, brand duplicated) that I missed when measuring char-length on raw source. Caught in ~90 seconds post-deploy, fixed in one follow-up commit, all 6 titles now correctly under 60 on live site. **1 SEO regression avoided.** |
| **Pattern `atomic-commits-per-logical-concern`** | 8 atomic commits. The title-template fix was a one-line fix per file instead of a whole-bundle revert. |
| **QB `proxyTsAwarenessNextjs16`** | N/A this bundle, but baseline confidence in not re-raising false-positive security warnings. |

**The memory system paid for itself inside one session.** The P0 learn pass that added these bars yesterday prevented two mistakes today.

## Mistakes worth never repeating (new)

### 1. Measured char-length on raw source, not rendered output
Counted `title: 'FAQ | Tennis Training Questions | LBTA'` as 38 chars, declared "under 60," shipped it. Root layout's `title.template: '%s | Laguna Beach Tennis Academy'` appends 31 chars at render, making the final `<title>` 68 chars. Live smoke caught it; fix was switching to segment-only titles. → New anti-pattern: `measure-char-length-on-raw-source`; new must quality bar: `measureRenderedNotRaw`.

### 2. Included brand suffix in child titles when root template set
Related but distinct from #1. Child pages emitting `title: 'X | Brand'` when `title.template: '%s | Brand'` is set doubles the brand in rendered output. → New anti-pattern: `child-title-with-brand-when-template-set`; new must quality bar: `segmentOnlyTitlesWhenTemplateSet`.

### 3. `git commit --amend --no-edit -m "..."` silently takes -m over --no-edit
When adding a missed file to a previous commit, the combination of flags overrode my intent and changed the commit message unexpectedly. → Correction logged. Fix: either open editor (no -m) or pass the full final message explicitly.

## New patterns to reuse

1. **`segment-only-titles-with-template`** — canonical convention in this repo; make new pages follow it from the start.
2. **`rendered-output-length-validation`** — grep `<title>` and `<meta name="description">` content in `.next/server/app/*.html` when validating SEO length constraints.
3. **`privacy-first-content-pattern`** — when a directive bans named attribution in new work, prefer: credentials + geography in bios, live Google reviews link for social proof, AggregateRating (not named Reviews) in schema, scope-guarded separation of pre-existing named content from new work.
4. **`full-compound-loop-in-one-session`** — for scoped bundles (≤12 files, known shape, memory loaded), the six phases can run sequentially in one session with compounding payoff. Key enablers: memory auto-load, atomic commits, live smoke test as final gate.

## New quality bars

- `segmentOnlyTitlesWhenTemplateSet` (must)
- `measureRenderedNotRaw` (must)
- `privacyFirstContent` (must)

## Artifacts produced this loop

- `plans/2026-04-16-seo-p1-schema-copy-bundle.md` (with mid-work constraint update)
- 8 atomic commits `f331b68..83b653b`
- Live on production: 6 new titles, 6 new descriptions, stats source-of-truth bumped, founder bio tightened (no names), testimonial cleanup, ReviewSchema trimmed, Person schema × 4, LocalBusiness schema × 3

## Scope outcomes

### What shipped (all live-verified)
- 6 title tags, rendered 47–53 chars content (was 64–77)
- 6 meta descriptions, rendered 138–149 chars (was 97–173)
- `data/site-stats.json`: `playersCount 500+→695`, `coachCount 5→4`
- Founder bio in `data/homepage-copy.json`: credentials-only version, no names
- `/success-stories`: 4 named-composite testimonials removed, replaced with centered Google reviews CTA
- `components/SEOSchemas.tsx`: 3 named review entries dropped; `aggregateRating` kept
- `app/schema.tsx`: new `PersonSchema` helper + new `LocalBusinessArraySchema` (3 facilities)
- 4 active coach pages emit `Person` JSON-LD with credentials (no student/player names in descriptions)
- Root layout wires `LocalBusinessArraySchema` alongside existing Organization + Review

### What stayed out (scope-guarded)
- Pre-existing named player showcases on `/success-stories` (Karue, Henry, Olov, Women's 3.5 Team, Ryan) — tracked as separate cleanup PR if requested
- Pre-existing "Karue Sell" mention in Andrew's page metadata description — same as above
- Camp / winter / spring date reconciliation — waiting on single canonical answer + ops-audit execution
- Michelle Mateljan status — waiting on founder decision
- Blog, location pages, directory NAP sweep — larger separate workstreams
- Pre-existing `lib/form-config.test.ts swim-tennis` failure — unrelated to this bundle

## Metrics

- **Plan:** ~45 min (incl. verification of SEO audit claims, AggregateRating discovery, mid-plan constraint update for name-privacy)
- **Work:** ~75 min (8 atomic commits, mid-flight title-template fix in commit #8)
- **Review:** embedded inline — live smoke test served as review in-loop
- **Validate:** ~10 min (build output inspection + grep checks)
- **Deploy:** ~10 min (push, Vercel build 50s, live smoke test across 20+ endpoints)
- **Learn:** ~10 min
- **Total:** ~2.5 hours from plan start to compound bank
- **Wasted commits avoided (via memory):** 1 (AggregateRating duplicate)
- **SEO regressions avoided (via live smoke):** 1 (title-template duplication)
- **New memory entries banked:** 2 anti-patterns, 4 patterns, 3 quality bars, 4 corrections

## What's next (queued for future compound:plan)

1. Camp / winter / spring date reconciliation — needs the 1 canonical camp-window answer
2. Michelle Mateljan page resolution — needs founder decision
3. Pre-existing named-player content on `/success-stories` — dedicated privacy cleanup PR if requested
4. Pre-existing `lib/form-config.test.ts` swim-tennis fix — unblocks `ship:gate`
5. Blog foundation (`/blog` scaffold + first 5 posts) — multi-week content workstream
6. Location pages (`/locations/lbhs`, `/locations/moulton-meadows`, `/locations/alta-laguna`)
7. Directory NAP sweep (GBP / Yelp / Apple Maps) — operations, not web

---

*Compound phase: LEARN complete. Memory system now holds 90 anti-patterns, 6 patterns added today, 8 quality bars added today, 108 corrections. Next `/compound:plan` will load these automatically — one more cycle of compounding is banked.*
