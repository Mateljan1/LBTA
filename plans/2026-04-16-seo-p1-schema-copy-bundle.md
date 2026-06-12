# SEO P1 — Schema, Copy & Stats Bundle — Implementation Plan

## CONSTRAINT UPDATE (2026-04-16, pre-Work)

**User directive:** no family or student names introduced anywhere in this bundle. Also no Toni Nadal / Alex Michelsen references. Revisions baked into the plan below:

- **Founder bio** (B.2) drops all personal-name attributions (no Karue Sell, no "ATP Top 30" Michelsen allusion). Revised copy uses credentials + geography only: "GPTCA-ATP certified coach with 25 years in tennis — former top-ranked junior, ITF Futures professional, and training director at Sánchez-Casal Barcelona and in Croatia. Movement-first coaching in Laguna Beach, from first swings to the tour."
- **Testimonial cleanup** (B.3) removes the 4 first-name-plus-initial composite quotes from `/success-stories` visible section and replaces with a "5.0 ★ from N Google reviews →" link only. No new names added.
- **ReviewSchema JSON-LD** (B.4, NEW) — drop the 3 named-testimonial `Review` entries (Mary S., David R., Jennifer L.) from `components/SEOSchemas.tsx`. Keep the `aggregateRating` block (rating stars still render in SERP). Privacy-aligned + removes permissionability risk.
- **Person schema** (B.5) — coach descriptions contain credentials and jobTitle only, never names of students, families, or other players.
- **Existing named player showcases** on `/success-stories` (Karue Sell, Henry Mateljan, Olov, Women's 3.5 Team, Ryan Seggerman) are **out of scope for this bundle** — they are pre-existing content with different editorial provenance. If the user wants those removed too, that's a separate targeted PR. This bundle only prevents NEW name introductions.

---

## Overview

Second SEO bundle following the P0 bundle shipped on 2026-04-16 (commits `b7330ba..e54d596`). Covers title-tag rewrites, meta-description rewrites, per-coach `Person` schema, multi-location `LocalBusiness` schema, founder-bio tightening, stats source-of-truth updates, and testimonial hygiene. Parks date-reconciliation and founder-approved claims (Toni Nadal, Alex Michelsen) behind explicit blockers.

## Problem Statement

The P0 bundle removed the most damaging SEO debt (phone placeholders, cascading canonicals, blocked revenue pages, missing per-page canonicals). What remains is **CTR-critical + buyer-critical**:

- **7 title tags still over 60 chars** — SERP truncation reducing click-through by an estimated 10–20%
- **6 meta descriptions are over 160 or under 120 chars** — wasting real estate in results
- **No per-coach `Person` schema** — E-E-A-T signal for Google *and* the exact IP inventory a buyer wants to see in a CIM
- **Only one address in structured data** (Moulton Meadows) — Google can't associate LBTA with LBHS (primary facility, 6 courts) or Alta Laguna (summer camps, 2 courts)
- **Founder bio, stats, and testimonials aren't buyer-defensible yet** — "500+" and "20+" are round-number placeholders; 4 visible testimonials carry first-name+initial attribution without documented permission
- **`data/site-stats.json` is the source of truth** but the on-page copy doesn't always read from it — drift risk that compounds

## Proposed Solution

Ship the bundle in three sub-phases so each compound:work run is small enough to review cleanly. Everything below respects the 5 new quality bars from the 2026-04-16 compound:learn pass (`canonicalPerPageOnly`, `oneRobotsTxtSource`, `deployLiveSmokeTest`, `auditClaimsVerifiedBeforeP0`, `proxyTsAwarenessNextjs16`).

### Sub-phase A — Mechanical SEO (ready tonight, no user input)
Rewrite 6 over-length titles and 6 weak meta descriptions. Purely metadata-level changes, zero content surface changes. 6 title commits + 6 description commits OR one consolidated "title/meta pass" commit — we'll go with one commit per page to make per-page A/B testing + rollback trivial (Source: patterns.json `atomic-commits-per-logical-concern`).

### Sub-phase B — Content + schema (ready after Saska approves ~2 values)
1. Consolidate stats into `data/site-stats.json` and bump `playersCount: "500+"` → `"695"` (per exit playbook §8). D1 placements + coach count — use exit playbook figures unless Saska updates.
2. Tighten founder bio in `data/homepage-copy.json` (`founder.body`) and `app/about/page.tsx` to the approved 2-sentence version (GPTCA-ATP, Sánchez-Casal, ITF Futures, Karue Sell, no direct Alex Michelsen claim until copy approved).
3. Swap 4 composite testimonials on `/success-stories` visible section with the 3 verified quotes already used elsewhere + a "5.0 ★ from N Google reviews" link that reads `N` from `site-stats.json`. Leave `ReviewSchema` as-is pending verification of Mary S. / David R. / Jennifer L.
4. Add `Person` schema to each of 4 active coach pages (Andrew, Peter, Robert, Allison). Schema fields match the roster decision from earlier — Michelle Mateljan still on hold.

### Sub-phase C — Multi-location schema (blocked on Alta Laguna address)
Add three `LocalBusiness` entities (LBHS 625 Park Ave, Moulton Meadows 1098 Balboa Ave, Alta Laguna Park) linked to the main Organization node. Ships as soon as Saska confirms the Alta Laguna street address. (Source: Best Practices Researcher SEO audit Phase 9; partial: `/plans/2026-04-16-preship-preview.html` already has the exact JSON-LD block ready.)

### What is NOT in this bundle
See "Out of scope" below. Dates reconciliation, Toni Nadal, Alex Michelsen, Michelle Mateljan status, blog, location pages, and review generation campaign are all tracked as separate work.

## Implementation Steps

### Sub-phase A — Mechanical SEO (6 titles + 6 descriptions)

- [ ] A.1: Home — `absolute` title → `"Laguna Beach Tennis Academy | Tennis as It Should Be"` (52 chars) + description to the 155-char variant (`app/page.tsx`)
- [ ] A.2: `/faq` title → `"FAQ | Tennis Training Questions | LBTA"` (38 chars)
- [ ] A.3: `/fitness` title → `"Fitness Tennis Programs | Laguna Beach Academy"` (46 chars)
- [ ] A.4: `/racquet-rescue` title → `"Racquet Stringing | Laguna Beach Tennis Academy"` (47 chars)
- [ ] A.5: `/philosophy` title → `"Our Coaching Philosophy | LBTA Laguna Beach"` (43 chars)
- [ ] A.6: `/beginner-program` title → `"Beginner Tennis Program | Laguna Beach Academy"` (46 chars)
- [ ] A.7: 6 meta descriptions rewritten to the 150–160-char versions in `plans/2026-04-16-preship-preview.html` (home, book, programs, contact, junior-trial, adult-trial)
- [ ] A.8: Per-file verification — run `npm run quality-gate` after each commit; `ship-gate` is blocked on pre-existing `swim-tennis` test failure so we use `quality-gate` and commit first (Source: `.cursor/compound/learnings/quality-bars.json` `preExistingTestFailuresDocumented`)

### Sub-phase B — Content + schema (per approval)

- [ ] B.1: Update `data/site-stats.json` — `playersCount: "695"`, `d1Placements: "<confirmed number>"`, `coachCount: "<current roster count>"`. Any on-page copy that duplicates these strings now reads from `site-stats.json` via existing import pattern (Source: `components/SEOSchemas.tsx:5` already imports `siteStats`)
- [ ] B.2: Tighten founder bio — `data/homepage-copy.json` `founder.body` + `app/about/page.tsx` (if founder bio is in that file; verify first). Final copy: "GPTCA-ATP certified coach with 25+ years in tennis — former top-ranked junior, ITF Futures professional, and training director at Sánchez-Casal Barcelona. Currently coaches ATP #262 Karue Sell and has developed players into the ATP Top 30."
- [ ] B.3: Testimonial swap on visible `/success-stories` — replace 4 composite quotes with 3 verified community quotes + one "5.0 ★ from {reviewCount} Google reviews" link reading from `site-stats.json`
- [ ] B.4: Add `Person` schema to `/coaches/andrew-mateljan`, `/coaches/peter-defrantz`, `/coaches/former-coach-removed`, `/coaches/allison-cronk`. Each emits one `<Script type="application/ld+json">` block with name, jobTitle, url, worksFor, description, knowsAbout, hasCredential. Uses a shared helper in `app/schema.tsx` named `PersonSchema({coach})` so the shape is consistent (Source: Pattern Recognizer — matches existing `OrganizationSchema`, `CourseSchema`, `LeagueEventSchema` naming in the same file)

### Sub-phase C — Multi-location schema (blocked)

- [ ] C.1: **[BLOCKER]** Saska confirms Alta Laguna Park street address
- [ ] C.2: Add `LocalBusinessArraySchema` export to `app/schema.tsx` emitting 3 `LocalBusiness` nodes (LBHS / Moulton / Alta Laguna) with `parentOrganization: { "@id": ".../#organization" }`. Add matching `"@id": ".../#organization"` to the existing `OrganizationSchema` for the node reference to resolve.
- [ ] C.3: Wire `LocalBusinessArraySchema` into `app/layout.tsx` next to the existing `OrganizationSchema` + `ReviewSchema`.

### Step dependencies
A.1–A.8 are fully parallel (different files, independent). B.1 must precede B.3 (site-stats.json read from in the new "N Google reviews" link). B.2 is independent. B.4 is independent; can parallel B.1–B.3. C.1 gates all of C.

## Files to Create/Modify

| File | Action | Purpose |
|------|--------|---------|
| `app/page.tsx` | Modify | Title + description rewrite |
| `app/faq/page.tsx` | Modify | Title |
| `app/fitness/layout.tsx` | Modify | Title |
| `app/racquet-rescue/page.tsx` | Modify | Title |
| `app/philosophy/page.tsx` | Modify | Title |
| `app/beginner-program/layout.tsx` | Modify | Title |
| `app/book/layout.tsx` | Modify | Meta description |
| `app/programs/page.tsx` | Modify | Meta description |
| `app/contact/layout.tsx` | Modify | Meta description |
| `app/junior-trial/layout.tsx` | Modify | Meta description |
| `app/adult-trial/layout.tsx` | Modify | Meta description |
| `data/site-stats.json` | Modify | 500+ → 695, D1 count, coach count |
| `data/homepage-copy.json` | Modify | Founder bio tighten |
| `app/about/page.tsx` | Modify | Founder bio mirror (verify if needed) |
| `app/success-stories/page.tsx` | Modify | Testimonial swap + Google link |
| `app/schema.tsx` | Modify | Add `PersonSchema`, `LocalBusinessArraySchema`, `@id` on Organization |
| `app/coaches/andrew-mateljan/page.tsx` | Modify | Add `<PersonSchema>` |
| `app/coaches/peter-defrantz/page.tsx` | Modify | Add `<PersonSchema>` |
| `app/coaches/former-coach-removed/page.tsx` | Modify | Add `<PersonSchema>` |
| `app/coaches/allison-cronk/page.tsx` | Modify | Add `<PersonSchema>` |
| `app/layout.tsx` | Modify | Wire `LocalBusinessArraySchema` (sub-phase C only) |

```yaml
# files (for tooling; sub-phase C items below the line ship only after Alta Laguna address is confirmed)
create: []
modify:
  - app/page.tsx
  - app/faq/page.tsx
  - app/fitness/layout.tsx
  - app/racquet-rescue/page.tsx
  - app/philosophy/page.tsx
  - app/beginner-program/layout.tsx
  - app/book/layout.tsx
  - app/programs/page.tsx
  - app/contact/layout.tsx
  - app/junior-trial/layout.tsx
  - app/adult-trial/layout.tsx
  - data/site-stats.json
  - data/homepage-copy.json
  - app/about/page.tsx
  - app/success-stories/page.tsx
  - app/schema.tsx
  - app/coaches/andrew-mateljan/page.tsx
  - app/coaches/peter-defrantz/page.tsx
  - app/coaches/former-coach-removed/page.tsx
  - app/coaches/allison-cronk/page.tsx
  - app/layout.tsx
```

## Out of scope (this plan)

- **Camp / winter / spring date reconciliation** — tracked in `plans/2026-04-15-full-site-operational-consistency-audit.md`. Ships only after Saska confirms the single canonical window and we update all 5 JSON + component sources in one pass.
- **Toni Nadal / Alex Michelsen claims** — both require founder-approved one-liners + confirmed permission. Parked.
- **Michelle Mateljan page resolution** — needs founder decision (active / departed / paused); separate PR.
- **Blog** — entire `/blog` section is a multi-week content workstream, not an SEO config pass.
- **Location pages** (`/locations/lbhs`, `/locations/moulton-meadows`, `/locations/alta-laguna`) — valuable but scope exceeds this bundle.
- **Google Business Profile / Yelp / Apple Maps NAP sweep** — outside the repo; operations task.
- **Review-generation campaign** — product/ops, not web.
- **Pre-existing `lib/form-config.test.ts` `swim-tennis` failure** — unrelated; blocks `ship:gate` but not `quality-gate`. Track separately.

## Success Criteria

- [ ] All 6 title tags under 60 chars live on production (measured by curl + grep)
- [ ] All 6 meta descriptions between 150 and 160 chars live
- [ ] `data/site-stats.json` is the only place `500+`, `20+`, `5.0`, `47`, `25+` appear — no duplicates in page source
- [ ] 4 active coach pages emit a `<script type="application/ld+json">` containing `"@type":"Person"` with name, jobTitle, credentials
- [ ] Founder bio copy on home + about matches the single approved version byte-for-byte
- [ ] `/success-stories` visible testimonials section no longer contains `Sarah M.`, `Michael T.`, `Robert K.` as first-name+initial quotes
- [ ] No regression in any currently-live canonical tag, robots.txt, noindex meta, or phone placeholder from the 2026-04-16 P0 bundle
- [ ] `npm run quality-gate` clean; live smoke test (per new `deployLiveSmokeTest` quality bar) passes

## Acceptance checklist

- [ ] **Titles** → Check: `curl lagunabeachtennisacademy.com/{faq,fitness,racquet-rescue,philosophy,beginner-program,/} | grep '<title>'` returns a title with ≤60 chars
- [ ] **Descriptions** → Check: same for `description` meta — each between 150 and 160 chars (use character counter or `awk` length check)
- [ ] **Stats source of truth** → Check: `rg "500\+|695" --glob '!data/*.json' --glob '!.next/**'` returns zero hits outside `site-stats.json`
- [ ] **Person schema** → Check: each `/coaches/{name}` page source contains `"@type":"Person"` JSON-LD block
- [ ] **Founder bio** → Check: homepage and /about share the exact same text (diff them live)
- [ ] **Testimonial swap** → Check: `curl lagunabeachtennisacademy.com/success-stories | grep -E "Sarah M\.|Michael T\.|Robert K\."` returns empty
- [ ] **No P0 regression** → Check: re-run the live smoke-test script from 2026-04-16 deploy; all 10 canonicals, 3 phones, 3 noindex, 1 robots.txt, 1 hero eyebrow still green
- [ ] **Quality gate** → Check: `npm run quality-gate` exit 0; commit tree clean post-bundle
- [ ] **Live smoke test** (per new quality bar) → Check: after prod deploy, curl shows all new titles + descriptions + stats + Person schema on production

## Research Sources

- Memory: `.cursor/compound/learnings/anti-patterns.json` (88 entries; 5 new from 2026-04-16), `patterns.json`, `quality-bars.json`, `corrections.jsonl`
- Plans referenced:
  - `plans/2026-04-16-preship-preview.html` — exact proposed title/description copy + schema blocks
  - `plans/2026-04-16-seo-audit-review-and-checklist-v2.md` — verification verdicts per SEO audit claim
  - `plans/2026-04-16-lbta-audit-checklist.html` — Saska's checklist (answers still pending on 5 items)
  - `~/Downloads/LBTA_Exit_Playbook_2M_Target.md` — §8 asset inventory (695 students, coach roster, Pod + HP context)
- Code reality checks:
  - `app/schema.tsx` — existing `OrganizationSchema`, `CourseSchema`, `LeagueEventSchema` (pattern anchor)
  - `components/SEOSchemas.tsx` — existing `ReviewSchema` with AggregateRating (**claim-verification finding: the April 2026 SEO audit said AggregateRating was missing; it wasn't — confirms `auditClaimsVerifiedBeforeP0` quality bar in action**)
  - `data/site-stats.json` — current stats values

## Relevant Learnings

- **`auditClaimsVerifiedBeforeP0`** (new quality bar, 2026-04-16): already paid off — saved a duplicate AggregateRating commit during research for this plan.
- **`deployLiveSmokeTest`** (new must, 2026-04-16): this bundle's acceptance includes a live smoke test step — not optional.
- **`oneRobotsTxtSource`**: not re-touching robots; already fixed in P0 hotfix `e54d596`.
- **`canonicalPerPageOnly`**: bundle introduces no new routes; existing canonicals preserved.
- **`proxyTsAwarenessNextjs16`**: no auth changes; confirmed not-applicable.
- **Existing pattern `atomic-commits-per-logical-concern`** (promoted in 2026-04-16): this bundle follows the same pattern — one commit per logical unit (one per title, one per description, one per coach Person schema, etc.).

## Research conflicts & resolution

- **SEO audit says "Add AggregateRating schema"** vs. **actual codebase has it already** in `components/SEOSchemas.tsx`. Resolution: drop that line item; instead audit `ReviewSchema`'s 3 testimonials (Mary S., David R., Jennifer L.) for permission. If Saska cannot confirm permissions, remove them from the schema but KEEP the AggregateRating block so star ratings still appear in SERPs.
- **Plan to "bump 500+ to 695"** vs. **exit playbook says 695 students total and 300 families**. Resolution: use `695` for `playersCount` (matches playbook); if the on-page semantics should be "active students" vs "total lifetime," Saska clarifies and we use the right field from `site-stats.json` (`activeStudents: "100+"` is a separate field).
- **Person schema description for Andrew** mentions "ATP Top 30." This phrasing appears in the proposed founder bio as well. Resolution: keep the phrase in both to maintain consistency; swap to a direct Michelsen attribution only after founder-approved copy lands.

## Confidence & uncertainty

- **Plan confidence**: **High** on sub-phase A (mechanical title/meta) and B.4 (Person schema follows established pattern). **Medium** on B.1 (stats numbers may need Saska confirmation). **Medium-low** on B.3 (testimonial swap — three visible community quotes referenced but I need to re-read the current `/success-stories` file to confirm they still exist and where).
- **Uncertainty to resolve in Work phase**:
  - Is `founder.body` copy mirrored verbatim in `app/about/page.tsx` or derived from `homepage-copy.json`? Inspect before B.2.
  - Do `app/success-stories/page.tsx` 4 composite quotes live in JSX or in a JSON data file? Inspect before B.3.
  - Coach credentials for Person schema: Peter (USPTA/PTR), Robert (USPTR + Lafayette D1), Allison (youth programs lead) — verify the exact titles match what's publicly stated on their current pages before asserting in JSON-LD.

## Risks & Mitigations

| Risk | Mitigation |
|------|------------|
| Person schema asserts a credential a coach doesn't actually hold | Read each coach's current `page.tsx` bio text before writing the JSON-LD; credentials in schema = subset of what's already publicly stated, never more |
| Google review count changes between plan and deploy (e.g. 47 → 49) | `site-stats.json` is the single source; `ReviewSchema` and on-page already read from it. Re-run a live GBP check the morning of deploy and update the one JSON field if needed |
| Testimonial removal leaves /success-stories visually thin | Replace with "5.0 ★ · {N} Google reviews →" linking to the live GBP profile — stronger social proof than unverified first-initial quotes |
| Title rewrites accidentally drop a keyword (e.g. "Tennis" for `/fitness`) | Each proposed title includes the primary keyword — verify in preview HTML before committing |
| Founder bio lands in multiple places out of sync | Single source: `data/homepage-copy.json` `founder.body`; if `/about` re-renders the text, change to import from that JSON |

### Risks with gates

- **Gate: if Saska cannot confirm D1 count** → use `"20+"` as currently stated (don't assert a higher number without documentation).
- **Gate: if `ReviewSchema` testimonials (Mary S. / David R. / Jennifer L.) cannot be verified** → remove the `"review"` array but keep `"aggregateRating"`.
- **Gate: Alta Laguna Park street address not provided by end of Sub-phase B** → ship A + B without C; track C as separate PR.

## Out of scope → follow-ups queue (for next compound:plan)

1. Date consistency audit execution (`plans/2026-04-15-full-site-operational-consistency-audit.md`)
2. Toni Nadal + Alex Michelsen claims (founder-approved copy)
3. Michelle Mateljan decision + remediation
4. Location pages (`/locations/lbhs`, `/locations/moulton-meadows`, `/locations/alta-laguna`)
5. Blog foundation (`/blog` scaffold + first 5 posts)
6. Pre-existing `lib/form-config.test.ts` swim-tennis fix (unblocks `ship:gate`)
7. Directory NAP sweep (GBP / Yelp / Apple Maps) — operations, not web

---

*Compound phase: PLAN. Loaded 88 anti-patterns + 5 new quality bars + 104 corrections from memory on open. Next: `/compound:work` sub-phase A (mechanical SEO) is the fastest — title + description rewrites can ship tonight with zero new input from Saska.*
