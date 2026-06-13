# LBTA Print Brochure System — V2 (Final) Implementation Plan

**Date:** 2026-05-06 · **Owner:** Andrew Mateljan · **Status:** Plan (awaiting approval before Work)
**Supersedes:** `~/Desktop/LBTA_Brochures_v1/` (V1 = test only, NOT a copy template)

---

## Overview

Replace the V1 brochure set on Desktop with a **print-ready, brand-locked V2 system of 8 deliverables** generated from the project's real data files (single source of truth: `data/*.json`, `lbta-brand` skill, `.cursorrules`). V1 was a fast test — content was partially fabricated, fonts and colors are explicitly banned by the locked brand kit, and several pricing/program/coach facts contradict the live website. V2 ships from project truth and is regeneratable.

## Problem Statement

The user shipped V1 as a "let's see what this looks like" pass. On audit, V1 contains substantive issues that block printing or distribution:

1. **Brand drift** — V1 uses `Playfair Display + Inter` (both explicitly banned in `.cursorrules` Part 14: Forbidden Patterns) and a custom navy/sand/clay palette (`#0B2E4F`, `#E8DCC0`, `#C8743C`) that does not appear in `tokens/lbta-web-tokens.json` or the `lbta-brand` skill. The signature **Horizon gradient** (the locked LBTA visual identity element) is absent from every V1 PDF.
2. **Fabricated coach copy** — V1 says Andrew "coached Alex Michelsen ages 12–13 (now ATP top 30)." The website (`data/coaches.json`, `data/homepage-copy.json`, `app/coaches/andrew-mateljan/page.tsx`) lists his actual current/past tour players: **Karue Sell (ATP #262), Max McKennon (ATP #458), Ryan Seggerman (ATP #63 doubles)**. Michelsen does not appear anywhere in current source. Peter is described as "Senior Coach"; real title is "Head Coach, Junior Development" with college tennis at Mt. San Jacinto. Allison's NCAA/NAIA history (Westcliff, Shepherd, B.A. History) is missing entirely.
3. **Wrong / missing programs** — V1 calls Little Tennis Stars pricing "JTT" pricing. Adult tier is collapsed to "Beginner 1/2" — missing **Adult Intermediate ($580/$1,105/$1,570)**, **Adult Advanced ($625/$1,250)**, **Cardio Tennis ($150/mo · $50 drop-in)**. **High Performance** is listed as UTR 5+; reality is **UTR 8+ required**. **UTR Match Play** (Color Ball $349, Singles/Doubles $399) and **USTA Adult Leagues** (4 leagues, $458/$393, Apr–Sep 2026) are entirely missing from V1's Local Restaurant and core variants.
4. **Pricing errors** — V1 lists private rates only for Andrew. `data/private-rates.json` shows three coaches with published rates (Andrew $250/$350; Peter & Allison $120/$165 each).
5. **Wrong contact info** — V1 says `hello@lagunabeachtennisacademy.com — confirm` and Andrew's phone "TBD." Real contact per `.cursorrules` Part 20: **support@lagunabeachtennisacademy.com · (949) 534-0457 · 1098 Balboa Ave, Laguna Beach, CA 92651**.
6. **Tagline confusion** — V1 leads with "Movement. Craft. Community." as the tagline. Real master tagline (per `data/homepage-copy.json` and `lbta-brand` skill): **"Tennis, as it should be taught."** with "Movement. Craft. Community." as the **pillar trio** underneath.
7. **The Pod** — V1 publishes "$11,000/mo · $8,333/mo" Pod pricing. The Pod does **not** appear on the live website or in any current `data/*.json` file. Internal evidence exists (`~/Desktop/AltaLaguna_Pod3_*.xlsx`) but it has not been published. **Cannot ship in printed brochures without Andrew's explicit approval and a pricing/policy doc to anchor it to.**
8. **Voice drift** — V1 uses "premium," "VIP," "premier private-coaching tier" — soft brand violations under `.cursorrules` Part 14 banned-word rules. Also contains generic AI-cadence phrasing ("Three taps") that would fail the `lbta-messaging` voice gate.

The result: V1 cannot be sent to a printer or handed to a hotel concierge. V2 fixes all of the above and adds a regeneration pipeline so future seasons (Summer 2026, Fall 2026) are a one-command refresh.

## Proposed Solution

Build V2 as **HTML+CSS templates rendered to print-ready PDF via Playwright** (`print_background: True`), the LBTA-blessed pipeline already used for practice cards (Source: `lbta-brand` skill → "Practice / Session Cards (PDF)"). Content is loaded at render time from `data/*.json` so brochures stay in sync with the website. All 8 deliverables share one tokens stylesheet, one shared header/footer partial, and one shared "trust block" partial — so a brand or stat change is one edit.

**Key architectural decisions** (Source: `lbta-brand`, `.cursorrules`, current data files):

- **Source of truth = the website.** No copy is invented; every claim traces to a project file. (Source: V1 fabrication audit)
- **Brand-locked.** Cormorant Garamond + DM Sans, the documented brand palette + horizon gradient. No exceptions, no per-variant overrides. (Source: `lbta-brand` SKILL.md, `tokens/lbta-web-tokens.json` v1.1.0)
- **HTML/CSS + Playwright print pipeline**, not ReportLab/PDFKit. Matches existing LBTA card pipeline; one stack to maintain. (Source: `lbta-brand` Practice Cards section)
- **Content is data-driven.** A single `brochures/content.json` is generated from `data/spring-summer-2026.json`, `data/coaches.json`, `data/private-rates.json`, `data/leagues-2026.json`, `data/site-stats.json` so every brochure pulls live facts. (Source: `.cursorrules` Part 12 — Single Source of Truth)
- **Two pricing display modes**: "published seasonal" (printed) and "drop-in only" (visitor-facing). Negotiated/family rates and unannounced programs are explicitly **excluded** from print. (Source: V1 has the right instinct on this — keep the rule)
- **Print specs honored**: bleed 0.125", trim marks, CMYK-safe palette check, 300 DPI raster assets, embedded fonts. (Source: industry standard; V1 had no bleed/marks → not printable as-is)

### Variant Manifest (V2 Final)

| # | File | Audience | Format | Real-world use |
|---|---|---|---|---|
| 01 | `01_TriFold_Core.pdf` | Universal | 8.5×11 tri-fold (6 panels) · landscape | Front-desk handout, event tabling |
| 02 | `02_A5Booklet_Core.pdf` | Universal | A5 saddle-stitched 8 pages | Welcome packet, member referral |
| 03 | `03_5x7_Postcard.pdf` | Universal | 5×7 front/back | Rack card, concierge counter |
| 04 | `04_Hotel_Concierge.pdf` | Visitor / concierge | Letter 2-page | Front-desk drop-off (Montage, Surf & Sand, Inn at Laguna, Pacific Edge, Ranch) |
| 05 | `05_Local_Family.pdf` | Local family / school | Letter 2-page | School pickup, Boys & Girls Club, library |
| 06 | `06_Email_Warm_Lead.pdf` | Warm lead follow-up | Letter, clickable | Attached to manual reply emails from Andrew |
| 07 | `07_Private_Coaching_OnePager.pdf` | Adult private prospect | Letter single page | "Why train privately with us" — replaces V1's "UHNW one-pager" framing |
| 08 | `08_Seasonal_Insert_Spring2026.pdf` | Insert card | 4×6 quarterly refresh | Tucked into 01–05; refreshed each season |

> **V1 → V2 rename**: `07_UHNW_OnePager.pdf` → `07_Private_Coaching_OnePager.pdf`. The "UHNW" framing assumed Pod pricing was published. Since Pod is not on the live site, this variant becomes a published-rate private coaching one-pager (Andrew, Peter, Allison rates + 10/20-pack savings + how to book). When/if Pod copy is approved separately, we add it as `09_Pod_Application_OnePager.pdf` — out of scope for V2 ship.

## Implementation Steps

### Phase 1: Foundation

- [ ] Step 1.1: Create `brochures/` workspace at repo root with subfolders `tokens/`, `partials/`, `templates/`, `data/`, `out/`, `assets/`.
- [ ] Step 1.2: Generate `brochures/data/content.json` from project source — coaches, programs, pricing, locations, leagues, UTR match play, stats, contact. Script: `scripts/build_brochure_content.py`. Validates every field against the source file it pulled from.
- [ ] Step 1.3: Build `brochures/tokens/print.css` from `tokens/lbta-web-tokens.json` + `lbta-brand` skill: brand palette as CSS vars, Cormorant + DM Sans `@font-face` (self-hosted in `assets/fonts/` for reliable PDF embedding), horizon gradient utility class, print-color-adjust rules.
- [ ] Step 1.4: Build shared partials — `partials/header.html` (logo mark + horizon bar), `partials/footer.html` (tagline, contact, City of Laguna Beach partner line, web URL, QR), `partials/trust-block.html` (stats from `site-stats.json`), `partials/horizon-bar.html` (5px gradient).
- [ ] Step 1.5: Drop real assets in `assets/` — local copies of LBTA logo (`/logos/LBTAblktext.png`), Cloudinary coach portraits (Andrew, Peter, Allison from `data/coaches.json`), 2–3 hero photos from canonical Cloudinary set. Embed as base64 or stage as files for Playwright to load.

### Phase 2: Content Doc & Voice Lock (parallel with 1.4 after 1.2)

- [ ] Step 2.1: Write **`brochures/00_MASTER_CONTENT_V2.md`** as the new source-of-truth doc. Replaces V1's master doc. Structure mirrors V1 but every fact has a source-file citation, banned-word list is pulled from `.cursorrules` Part 14 + `lbta-brand` skill, and the Pod section is marked **DO NOT PRINT — internal only**.
- [ ] Step 2.2: Write **CTA matrix** in V2 master doc — primary + secondary CTA per audience, all routing to a real URL on the live site (`/book`, `/schedules`, `/programs/utr-match-play`, `/programs/leagues`, etc.). Verify each URL returns 200 before printing.
- [ ] Step 2.3: Write **voice gate** — per-variant copy passes through the `lbta-messaging` skill banned-word check. Document the check in this section so Work phase can run it as a step.

### Phase 3: Universal Templates (01, 02, 03, 08)

- [ ] Step 3.1: `templates/01_trifold_core.html` — 6 panels: (cover) tagline + horizon + facility hero · (inside-1) the Pathway table · (inside-2) Junior programs grid · (inside-3) Adult programs grid · (back-1) Locations + coaches strip · (back-2) Trust block + CTA + QR. Must include 0.125" bleed and trim marks.
- [ ] Step 3.2: `templates/02_a5_booklet.html` — 8 pages: cover · founder + philosophy · pathway spine · juniors · adults · UTR & leagues · coaches · contact + CTA. Saddle-stitched (page order: 8|1, 2|7, 6|3, 4|5).
- [ ] Step 3.3: `templates/03_5x7_postcard.html` — front: hero photo + tagline + pillars + CTA · back: top 3 programs (juniors / adults / match play) + locations + QR + contact line.
- [ ] Step 3.4: `templates/08_seasonal_insert_spring2026.html` — 4×6 card: Spring 2026 dates ("April 6 – June 13, 2026 · skip May 25"), registration opens March 2, what's new this season, Spring Break Camp dates, early-bird discount.

### Phase 4: Audience Variants (04, 05, 06, 07)

- [ ] Step 4.1: `templates/04_hotel_concierge.html` — visitor-first framing. Drop-in clinic from $50, private from $250. Camp drop-in for traveling families. Includes "for your guest" voice (warm, not "VIP" or "premium"). Three-step "How your guest books" routes to `/book` not "City of Laguna Beach + PlayByPoint" (PlayByPoint is internal scheduling, not a guest-facing payment portal — verify with Andrew).
- [ ] Step 4.2: `templates/05_local_family.html` — local family framing. Pathway from age 3 (Little Tennis Stars · 5–6 Red Ball · 7–8 Orange Ball · 9–11 Green Dot · UTR/Junior Development · High Performance). Adult side: New to Tennis through Advanced. "Try a $50 LiveBall" as low-friction entry. Includes Cardio Tennis (V1 missed it).
- [ ] Step 4.3: `templates/06_email_warm_lead.html` — clickable PDF for warm leads. Letter-size single column. Personal opener from Andrew, real coach photos with bios, pathway, real CTA links to specific program pages, calendar of Spring 2026 sessions, 30-day money-back guarantee line (real per `homepage-copy.json` cta.guarantee).
- [ ] Step 4.4: `templates/07_private_coaching_onepager.html` — published-rate private coaching one-pager. Three coaches with rates from `data/private-rates.json` (Andrew $250/$350 · Peter & Allison $120/$165). 10-pack and 20-pack savings shown. 24-hour cancellation policy. CTA: book through `/book` or text Andrew direct (confirm number with Andrew before printing).

### Phase 5: Render Pipeline & QA

- [ ] Step 5.1: `scripts/render_brochure.py` — Playwright runner. For each `templates/*.html`: load template → inject `content.json` → set viewport to print size → `page.pdf(print_background=True, prefer_css_page_size=True, margin=0)` → write to `brochures/out/{name}.pdf`.
- [ ] Step 5.2: `scripts/check_brochure.py` — pre-flight QA. Asserts: (a) every CSS color in `print.css` is in `tokens/lbta-web-tokens.json` brand palette, (b) no banned font in `@font-face` (Inter, Roboto, Playfair Display, Space Grotesk, Work Sans, Arial), (c) no banned word in any rendered HTML (load `.cursorrules` Part 14 list + `lbta-messaging` prohibited list), (d) every URL in QR/CTA returns 200 against the live site, (e) every coach name and price matches `data/*.json` exactly.
- [ ] Step 5.3: `scripts/build_brochures.sh` — one command: `python build_brochure_content.py && python check_brochure.py && python render_brochure.py`. Exits non-zero on any check fail.
- [ ] Step 5.4: Visual QA — render all 8 PDFs, open each, confirm: horizon gradient on every cover, Cormorant headlines, DM Sans body, color contrast, bleed visible at 0.125", no overflowing text, photos crop cleanly. Capture before/after screenshots vs V1 for the Compound learning capture.
- [ ] Step 5.5: Print spec QA — open each PDF in Acrobat → check fonts embedded (file → properties → fonts), check page size (8.5×11 / A5 / 5×7 / Letter / 4×6), check bleed boxes present on print variants (01, 02, 03, 08).

### Phase 6: Distribution prep (out of scope to ship code, in scope to document)

- [ ] Step 6.1: Update `brochures/00_MASTER_CONTENT_V2.md` with a "How to print" section: print shop recommendations, paper stock per variant (100lb gloss for postcards, 80lb matte for tri-fold, etc.), quantities for first run, hotel concierge target list (Montage, Surf & Sand, Inn at Laguna, Pacific Edge, Ranch).
- [ ] Step 6.2: Move V1 PDFs from `~/Desktop/LBTA_Brochures_v1/` to `~/Desktop/LBTA_Brochures_v1_ARCHIVE/` so V2 is the only active set.

> Step dependencies: 1.1 → 1.2 → (1.3 ∥ 1.4 ∥ 1.5 ∥ 2.1) → (2.2 ∥ 2.3) → Phase 3 (3.1, 3.2, 3.3, 3.4 in parallel) → Phase 4 (4.1, 4.2, 4.3, 4.4 in parallel) → 5.1 → 5.2 → 5.3 → 5.4 → 5.5 → 6.1 → 6.2. Phases 3 and 4 are the heavy lift but each variant is independent inside its phase.

## Files to Create/Modify

| File | Action | Purpose |
|---|---|---|
| `brochures/00_MASTER_CONTENT_V2.md` | Create | New source-of-truth doc, replaces V1 |
| `brochures/tokens/print.css` | Create | Brand-locked print stylesheet |
| `brochures/partials/header.html` | Create | Shared header (logo + horizon bar) |
| `brochures/partials/footer.html` | Create | Shared footer (tagline, contact, QR) |
| `brochures/partials/trust-block.html` | Create | Stats from `site-stats.json` |
| `brochures/partials/horizon-bar.html` | Create | Reusable 5px gradient bar |
| `brochures/data/content.json` | Create (generated) | Compiled content from `data/*.json` |
| `brochures/templates/01_trifold_core.html` | Create | Tri-fold template |
| `brochures/templates/02_a5_booklet.html` | Create | A5 booklet template |
| `brochures/templates/03_5x7_postcard.html` | Create | 5×7 postcard template |
| `brochures/templates/04_hotel_concierge.html` | Create | Hotel concierge template |
| `brochures/templates/05_local_family.html` | Create | Local family template |
| `brochures/templates/06_email_warm_lead.html` | Create | Warm lead PDF template |
| `brochures/templates/07_private_coaching_onepager.html` | Create | Private coaching one-pager |
| `brochures/templates/08_seasonal_insert_spring2026.html` | Create | Spring 2026 insert card |
| `brochures/assets/fonts/*` | Create | Self-hosted Cormorant + DM Sans for reliable PDF embedding |
| `brochures/assets/logos/*` | Create | Local LBTA logo copies |
| `brochures/assets/photos/*` | Create | Local copies of canonical hero/coach images |
| `brochures/out/*.pdf` | Create | Final 8 brochures |
| `scripts/build_brochure_content.py` | Create | Compile content.json from `data/*.json` |
| `scripts/render_brochure.py` | Create | Playwright PDF renderer |
| `scripts/check_brochure.py` | Create | Pre-flight QA (colors, fonts, banned words, URLs) |
| `scripts/build_brochures.sh` | Create | One-shot build pipeline |

```yaml
# files (for tooling; do not edit by hand)
create:
  - brochures/00_MASTER_CONTENT_V2.md
  - brochures/tokens/print.css
  - brochures/partials/header.html
  - brochures/partials/footer.html
  - brochures/partials/trust-block.html
  - brochures/partials/horizon-bar.html
  - brochures/data/content.json
  - brochures/templates/01_trifold_core.html
  - brochures/templates/02_a5_booklet.html
  - brochures/templates/03_5x7_postcard.html
  - brochures/templates/04_hotel_concierge.html
  - brochures/templates/05_local_family.html
  - brochures/templates/06_email_warm_lead.html
  - brochures/templates/07_private_coaching_onepager.html
  - brochures/templates/08_seasonal_insert_spring2026.html
  - scripts/build_brochure_content.py
  - scripts/render_brochure.py
  - scripts/check_brochure.py
  - scripts/build_brochures.sh
modify: []
```

## Out of scope (this plan)

- **The Pod public copy.** No pricing, no name, no Pod block in any printed brochure. (Internal Pod3 spreadsheets exist; nothing on live site or in `data/*.json` to anchor a public claim.) If/when Andrew approves a Pod public sheet, it becomes a separate `09_Pod_Application_OnePager.pdf` plan.
- **Negotiated/family rates** for private coaching. Brochures show published rates only — matches `.cursorrules` Part 12 single-source-of-truth rule and V1's correct instinct here.
- **Direct phone/text numbers for coaches.** Confirm each personal mobile with the coach in writing before printing. V2 ships with `support@lagunabeachtennisacademy.com` and `(949) 534-0457` only unless Andrew approves otherwise.
- **Print fulfillment.** This plan ends at PDF + print spec doc. Vendor choice, paper stock, and quantities are documented but not executed.
- **Website changes.** No `app/` or `components/` edits. Brochures consume `data/*.json` read-only.
- **Summer/Fall 2026 inserts.** Spring 2026 only (`08_*`). Future seasons are a one-line content swap and re-render — documented for later, not built now.
- **Translations.** English only.
- **Saska / Michelle on brochures.** Saska is back-of-house (correctly excluded in V1 also). Michelle is `hidden: true` in `data/coaches.json` for 2026 — excluded from V2.

## Success Criteria

- [ ] All 8 V2 PDFs render from one `bash scripts/build_brochures.sh` command
- [ ] Every coach name, title, bio fragment, and credential matches `data/coaches.json` and `data/homepage-copy.json` exactly
- [ ] Every printed price matches `data/spring-summer-2026.json`, `data/private-rates.json`, `data/leagues-2026.json`, `data/pricing-supplemental.json`
- [ ] Every URL on every brochure returns HTTP 200 against the live site
- [ ] Brand QA passes: only brand-palette colors in CSS, only Cormorant + DM Sans in `@font-face`, horizon gradient appears on every cover, no banned word in any rendered HTML
- [ ] Print specs honored: 0.125" bleed on print variants (01, 02, 03, 08); embedded fonts; correct page sizes
- [ ] V1 PDFs archived; V2 is the only active set on Desktop
- [ ] All tests pass; no lint errors on Python scripts

## Acceptance checklist

- [ ] **Real coach copy** → Diff `brochures/out/*.pdf` text-extract against `data/coaches.json` bio fields. No "Alex Michelsen," no "Senior Coach," no "Top-12 nationally" without source.
- [ ] **Real pricing** → For each printed price, run `check_brochure.py` lookup in source JSON; assert exact match.
- [ ] **Real contact** → grep PDFs for "support@lagunabeachtennisacademy.com" + "(949) 534-0457" + "1098 Balboa Ave"; no "TBD," no "confirm," no `hello@`.
- [ ] **Real tagline + pillars** → "Tennis, as it should be taught." appears as primary tagline; "Movement. Craft. Community." appears as pillar trio (not as headline).
- [ ] **No Pod publish** → grep all 8 PDFs for "Pod," "$11,000," "$8,333" — must return 0 hits.
- [ ] **Brand fonts** → Acrobat → file properties → fonts: only Cormorant Garamond + DM Sans. Inter, Playfair, Roboto, Space Grotesk, Work Sans, Arial all absent.
- [ ] **Brand colors** → CSS lint: every `color:` and `background:` value either matches a hex in `tokens/lbta-web-tokens.json` brand palette or uses a defined CSS var. Zero arbitrary hex.
- [ ] **Horizon gradient** → Visual check on covers of 01–08: gradient bar present, correct stops (`#2E8B8B → #E8834A → #D4A853 → #E8834A → #2E8B8B`).
- [ ] **No banned words** → Run `.cursorrules` Part 14 + `lbta-messaging` Prohibited list against rendered HTML; 0 hits. Particular attention: "elite," "premier," "VIP," "premium," "world-class," "exclusive."
- [ ] **Pricing display modes honored** → Concierge variant shows drop-in + private only; family/email variants show seasonal pricing; private one-pager shows published packages only (no negotiated rate).
- [ ] **URLs live** → For each PDF, extract every URL, curl HEAD; all return 2xx.
- [ ] **Regeneration works** → Bump a price in `data/spring-summer-2026.json`, re-run `build_brochures.sh`, confirm PDF reflects change without manual edits.
- [ ] **Print proofs render** → Open at least 01 (tri-fold), 03 (postcard), 04 (concierge) at 100% zoom in Acrobat — visually clean, no overflow, photos sharp at expected DPI.

## Research Sources

- `~/Desktop/LBTA_Brochures_v1/00_MASTER_CONTENT_DOC.md` — V1 source-of-truth attempt (mostly inaccurate, kept as reference)
- `~/Desktop/LBTA_Brochures_v1/04_Hotel_Concierge.pdf` — V1 voice/structure reference
- `data/coaches.json`, `data/homepage-copy.json` — coach truth
- `data/spring-summer-2026.json` — program + schedule + pricing truth
- `data/private-rates.json` — private coaching rates (3 coaches)
- `data/leagues-2026.json` — USTA + UTR Match Play truth
- `data/site-stats.json` — trust stats (695 players · 25+ years · 5.0/47 reviews · 20+ D1 placements)
- `data/pricing-supplemental.json` — promo + comparison + camp truth
- `tokens/lbta-web-tokens.json` v1.1.0 — locked brand palette
- `~/.claude/skills/lbta-brand/SKILL.md` — brand system, typography, horizon gradient, channel patterns
- `~/.claude/skills/lbta-messaging/SKILL.md` — voice rules, prohibited language
- `.cursorrules` Parts 7, 8, 14, 20 — color tokens, typography, forbidden patterns, contact
- `app/about/layout.tsx`, `app/adult-trial/page.tsx`, `app/beginner-program/page.tsx` — verified "Official City of Laguna Beach Tennis Partner Since 2020" claim
- `app/success-stories/page.tsx` — verified Karue Sell, Henry Mateljan, Ryan Seggerman, Olov

## Relevant Learnings (extracted from prior LBTA work)

- **Single source of truth for prices** is non-negotiable (`.cursorrules` Part 12). V1 violated this by putting prices in a Markdown doc parallel to the JSON files; V2 generates content from the JSON every render.
- **Horizon gradient is the LBTA signature** (`lbta-brand` skill principle 2). V1 omitted it everywhere. V2 makes it a partial that every cover includes.
- **PDF generation pattern** for LBTA = HTML+CSS rendered by Playwright with `print_background: True` and `print-color-adjust: exact` on colored elements (`lbta-brand` skill, Practice Cards section). V1 used a different pipeline with no documented standard.
- **Voice gate is a build step, not a review step.** `lbta-messaging` lists prohibited words; `check_brochure.py` enforces this so no banned word can ship.
- **Founder voice is calm, specific, no hyperbole** (`.cursorrules` Part 4). V1 used "premium," "VIP," "Three taps" — all soft drift.

## Research conflicts & resolution

- **Pillars wording.** `lbta-brand` SKILL says **"Movement. Craft. Community."** (uses "Craft"); `lbta-messaging` SKILL says **"Movement. Discipline. Belonging."** Both say "Pillars."
  - Resolution: **Use "Movement. Craft. Community."** Sources for this version: `data/homepage-copy.json` (`hero.pillars: "Movement. Craft. Community."`), `.cursorrules` line 5 ("Movement. Craft. Community."), the live homepage. The `lbta-messaging` skill appears stale on this point. Flag for `/compound:learn` to update.
- **Founder bio shorthand.** Two valid versions exist: `data/homepage-copy.json` says "GPTCA-ATP certified · 25 years · former top-ranked junior · ITF Futures · training director at Sánchez-Casal Barcelona and in Croatia" while `data/coaches.json` says "Twenty years · Former #3 SoCal and #12 nationally · 7 years coaching internationally Spain/Croatia/Norway · ATP #262 Karue Sell, ATP #458 Max McKennon, ATP #63 doubles Ryan Seggerman."
  - Resolution: **Use the `coaches.json` long-form** for founder blocks (more specific, current tour roster); **use the `homepage-copy.json` short-form** for the cover/back-panel one-liner. Both are true; one is for the dense panel, the other for the byline.
- **PlayByPoint as guest-facing booking step.** V1 says "Pay through City of Laguna Beach + PlayByPoint." Project evidence: PlayByPoint hero render script exists; PlayByPoint mentioned in marketing emails but **not** in the actual `/book` flow per `.cursorrules` Part 13 (book flow is `app/book/page.tsx` + `app/api/book/route.ts`).
  - Resolution: **V2 routes guests to `lagunabeachtennisacademy.com/book`** (the real book page). Internal mention of "city programs · PlayByPoint backend" can stay in the master doc as background but does not appear in printed brochures unless Andrew confirms it's the right guest-facing CTA.

## Confidence & uncertainty

- **Plan confidence: HIGH** on the architecture, content sourcing, brand lock, and 7 of 8 variants.
- **Uncertainty:**
  - Pod public copy — explicitly out of scope, but if Andrew wants to publish Pod on the private one-pager, that needs a new mini-plan with confirmed pricing.
  - "City of Laguna Beach Tennis Partner Since 2020" line — verified on the live site; safe to use.
  - Andrew's direct text-line for UHNW/Pod prospects — V1 had `sms:+1[Andrew direct]` placeholder; V2 confirms the published phone `(949) 534-0457` is the only number until Andrew explicitly approves another.
  - Whether the print pipeline should also output CMYK PDFs (not just RGB-print). Default is RGB → print shop converts. Strict CMYK output requires `cairo` or post-process via `ghostscript`. Plan ships RGB-print first; CMYK is a stretch goal.

## Risks & Mitigations

| Risk | Mitigation |
|---|---|
| Brand drift creeps back during template authoring | `check_brochure.py` enforces palette and font allowlist; build fails on any banned color/font |
| Pricing changes mid-build | Content is generated from `data/*.json` per render — re-run pipeline; no manual hex/copy edits |
| Pod copy slips into a variant | Acceptance check explicitly greps for "Pod," "$11,000," "$8,333" — build fails if found |
| Coach personal info on print without consent | Default contact is `support@lagunabeachtennisacademy.com` + main line; per-coach contacts only with written consent |
| Concierge variant misroutes guests to wrong booking flow | URL check step curls every CTA destination; PlayByPoint vs `/book` decision recorded with Andrew before print |
| Photo rights / quality | Use only existing Cloudinary canonical assets the website already uses; same rights envelope |
| Font embedding fails in PDF | Self-host Cormorant + DM Sans woff2 in `assets/fonts/`; do not depend on Google Fonts CDN at render time |
| V1 PDFs get accidentally re-distributed | Step 6.2 archives V1 set; recommend renaming to `_DO_NOT_DISTRIBUTE_V1.pdf` if archive is kept |

> **Gate:** If Phase 4 introduces any audience-specific copy not present in `data/*.json` (e.g. concierge-specific framing, family-specific framing), that copy passes through `lbta-messaging` voice review before render. Document it in `00_MASTER_CONTENT_V2.md` so future regenerations preserve it.

---

## Decision lenses applied

- **Curve 1 vs Curve 2** — This is **Curve 1** (production grunt with capped payoff): build the print system once, regenerate cheaply forever. Ship at 85% in 30% of the time. Don't over-engineer the template DSL.
- **Survivorship gap** — V1 looks done. The gap is what's NOT in it: Cardio Tennis, USTA Leagues, UTR Match Play, real coach roster, real palette, real fonts, the horizon gradient, the real tagline. V2 closes those gaps explicitly.
- **18-month horizon** — Will this still be true in 18 months? Programs and prices will turn over (Summer, Fall, Winter, Spring 2027). The pipeline accommodates that with seasonal content swaps. The brand lock should hold for years.
- **Identity** — A printed brochure is a physical artifact of "tennis, as it should be taught." It needs to feel like the website, not like a stock template. The horizon gradient + Cormorant + sandstone palette are the identity carriers; they cannot drift.

---

## Next step (after approval)

Run `/compound:work plans/2026-05-06-lbta-print-brochure-system-v2-plan.md` to execute Phases 1–6. Estimated build time: ~2–3 hours of focused work; ~30 min for QA pass; ~15 min for print spec documentation.
