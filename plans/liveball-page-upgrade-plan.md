# LiveBall Offering — Page Upgrade Implementation Plan

## Overview

Align public-facing LiveBall content with **LBTA_LIVEBALL.pdf** (coach operations / player experience source of truth), replace vague copy on `/fitness`, and add a clear **“how it works”** story so intermediate and advanced players know what to expect before they book. Optional: dedicated `/liveball` route plus refreshed imagery from approved assets.

## Problem Statement

1. **`app/fitness/page.tsx`** describes LiveBall generically (“competition in motion,” “90–150 minutes”) and omits the mechanics players actually experience: **coach-fed balls, no serving, Champions/Challengers, first-ball rules,** and the **six 15-minute blocks**.
2. **Schedule/pricing** already live in `data/winter2026.json` (and loaders in `lib/programs-data.ts`) but **program `description` fields** are thin and do not reflect the PDF.
3. **Trust / “legit”**: Prospects comparing clubs expect transparency on format, intensity, and rotation—without publishing the full internal coach manual.

## Proposed Solution

**(Source: PDF extraction from `LBTA_LIVEBALL.pdf`; Source: existing patterns — `/data/*.json` single source of truth per `.cursorrules`.)**

1. **Add structured player-facing content** in `data/liveball.json` (new file):  
   - `sessionObjective` (1 short paragraph)  
   - `howItWorks`: bullets — coach-fed, no serve, doubles, Champions vs Challengers, 3-vs-2 scoring (player summary, not full rulebook)  
   - `firstBall` (short explainer + link to optional FAQ-style detail)  
   - `sessionStructure`: six blocks × 15 minutes = 90 minutes (labels only: Warm-Up → patterns → … — match PDF recap table)  
   - `whatToBring` / `communication` (one line each from PDF “Standard Coaching Reminders”)  
   - `levels`: map Int vs Adv to PDF “level adjustments” *marketing* lines (avoid over-promising exact NTRP mechanics on site if coaches tune in session)

2. **Expose content** via `lib/programs-data.ts` (e.g. `getLiveBallPageContent()`) or a tiny `lib/liveball-content.ts` that imports JSON — keep imports consistent with the rest of the repo.

3. **UI strategy (pick one; A recommended):**  
   - **A — Dedicated `/liveball` page** (`app/liveball/page.tsx` + `layout.tsx` metadata): Hero, “How it works,” session arc (visual timeline or stacked sections), level fit (Int vs Adv), CTA to `/book` and anchor to `/schedules#fitness`. **Trim** LiveBall block on `/fitness` to 2–3 sentences + “Learn how LiveBall works →” link.  
   - **B — Single long `/fitness` page**: Expand LiveBall section only with accordions (more scrolling; worse deep-linking).

4. **Imagery**: Copy optimized **WebP** assets into `public/images/fitness/` (or `public/images/liveball/`) from workspace assets:
   - `liveball-serve-*.png` → hero or “energy” slot  
   - `liveball-lifestyle-*.png` → lifestyle  
   - `liveball-doubles-*.png` → coaching / community (LBTA shirt visible — strong brand)  
   - `liveball-women-*.png` → patterns / movement  
   Follow project rules: `next/image`, `alt`, `sizes`, compress to ≤350KB where possible.

5. **Data consistency pass**: Update `winter2026.json` (and `fall2026.json` if LiveBall rows exist) **`duration`** and **`description`** for `liveball-intermediate` and `liveball-advanced` so they agree with PDF (**90 minutes** structured session) *unless* operations confirm some slots differ—in which case document exception in JSON `note` per slot.

6. **Sitemap & discovery**: Add `/liveball` to `app/sitemap.ts` (if route A). Optional: add LiveBall under Header “Programs” or Fitness dropdown if IA allows (minimal change).

## Implementation Steps

### Phase 1: Source of truth & copy
- [ ] **1.1** Finalize player-facing copy in `data/liveball.json` from PDF (no internal-only coach cues; calm, specific voice per brand rules).  
- [ ] **1.2** Reconcile **session length**: confirm all LiveBall slots are 90 minutes; align `duration` fields and remove “90–150” from any public copy.  
- [ ] **1.3** Cross-check pricing lines with `winter2026.json` ($150/mo, $50 drop-in — already in email templates).

### Phase 2: Code
- [ ] **2.1** Add loader + types for `data/liveball.json`.  
- [ ] **2.2** Implement **Route A**: `app/liveball/page.tsx` (server component) + sections/components (e.g. `LiveBallHero`, `LiveBallHowItWorks`, `LiveBallSessionArc`, `LiveBallLevels`) — reuse `HorizonDivider`, `DarkSection`, brand tokens.  
- [ ] **2.3** Update `app/fitness/page.tsx` LiveBall strip: shorter copy + link to `/liveball`.  
- [ ] **2.4** Add `app/liveball/layout.tsx` `metadata` (title/description).  
- [ ] **2.5** Update `app/sitemap.ts` for `/liveball`.

### Phase 3: Assets & QA
- [ ] **3.1** Optimize and place WebPs; update `alt` text (specific, &lt;125 chars).  
- [ ] **3.2** Responsive check: 320 / 375 / 768 / 1024 / 1440.  
- [ ] **3.3** `npm run ship:gate` (or `quality-gate` if tests skipped by policy).

## Files to Create/Modify

| File | Action | Purpose |
|------|--------|---------|
| `data/liveball.json` | Create | Player-facing LiveBall facts aligned to PDF |
| `lib/liveball-content.ts` *(or extend `programs-data.ts`)* | Create/Modify | Typed getters for page |
| `app/liveball/page.tsx` | Create | LiveBall “how it works” page |
| `app/liveball/layout.tsx` | Create | Metadata |
| `app/fitness/page.tsx` | Modify | Short LiveBall teaser + link |
| `data/winter2026.json` | Modify | Duration/description accuracy for LiveBall rows |
| `data/fall2026.json` | Modify | Same, if LiveBall entries exist |
| `app/sitemap.ts` | Modify | Include `/liveball` |
| `public/images/.../*.webp` | Create | Optimized imagery |

```yaml
# files (for tooling; keep in sync)
create:
  - data/liveball.json
  - lib/liveball-content.ts
  - app/liveball/page.tsx
  - app/liveball/layout.tsx
  - public/images/liveball/*.webp
modify:
  - app/fitness/page.tsx
  - data/winter2026.json
  - app/sitemap.ts
  - data/fall2026.json
```

## Out of scope (this plan)

- Full port of the 12-page PDF (every coaching cue) — **internal** doc; site gets **summary** only.  
- Changing ActiveCampaign tags or form IDs (unless booking labels must say “LiveBall”).  
- Coach Hub `LiveBallTab.tsx` content sync (separate workstream).  
- Video embeds unless you add them later.

## Success Criteria

- [ ] A new visitor can explain Champions/Challengers, coach-fed/no-serve, and first-ball concept without reading the PDF.  
- [ ] Session length and structure (90 min / six blocks) are consistent across page copy and JSON program data.  
- [ ] No forbidden marketing language per `.cursorrules`.  
- [ ] Lighthouse/a11y: semantic headings, contrast, focus states, `alt` on all images.  
- [ ] All tests pass; no lint errors.

## Acceptance checklist

- [ ] **PDF alignment** → Spot-check 5 facts: objective, no serve, 3 vs 2, first ball from baseline, 6×15 blocks.  
- [ ] **Schedule/pricing** → `/schedules#fitness` and `getFitnessClasses()` still match `winter2026.json`.  
- [ ] **Mobile** → No horizontal scroll; tap targets ≥48px.  
- [ ] **Build** → `npm run build` succeeds.

## Research Sources

- Internal: `LBTA_LIVEBALL.pdf` (Messages attachment — content extracted in session).  
- Internal: `app/fitness/page.tsx`, `data/winter2026.json`, `lib/programs-data.ts`.  
- Internal: `.cursorrules` (brand, data SOT, image rules).

## Relevant Learnings

- Schedules and pricing must remain in `/data/*.json`; narrative can live in dedicated JSON and be composed on pages.  
- Hero CTAs on dark backgrounds need solid fills (already satisfied on `/fitness` hero).

## Research conflicts & resolution

| Conflict | Resolution |
|----------|------------|
| PDF says **90 min**; `winter2026` Int duration **“1-1.5 hr”** | **Operations confirmation**: If all LiveBall sessions are 90 min, standardize JSON to `90 min` (or `1.5 hr` only if Adv is longer). Until confirmed, use PDF + per-slot `note` in JSON. |
| Marketing said **90–150 min** | **Remove**; replace with verified single range after confirmation. |

## Confidence & uncertainty

- **Plan confidence:** High for UX/architecture; **medium** for exact minute count per location until you confirm with staff.  
- **Uncertainty:** Whether music, whiteboard, or “4.5+ tournament” challenger rules are always used — phrase as “coaches may adjust by level.”

## Risks & Mitigations

| Risk | Mitigation |
|------|------------|
| Too much detail → wall of text | Use accordions or “At a glance” + “Details” for first-ball and blocks. |
| Copy drift from PDF | Version note in `liveball.json` comment field not allowed in JSON — add `lastReviewed` string key in JSON. |
| Image weight | WebP compression; lazy-load below fold. |
