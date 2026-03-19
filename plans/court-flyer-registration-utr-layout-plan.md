# Court Flyer — Registration Placement, Copy Clarity & UTR Circuit Block

## Overview

Improve the LBTA Master Court Flyer so (1) City vs Rec1 registration reads clearly and sits in a logical place in the story, and (2) **UTR Circuit / Saturday Matchplay** appears on the print + PDF flyer using **`data/leagues-2026.json`** as the single source of truth for dates, divisions, and pricing.

## Problem Statement

**Placement / comprehension:** The registration box (QR + Rec1 CTA) currently lives **inside `<header>`** in `CourtFlyer.tsx`, immediately after the hero title, tagline, and “FREE TRIAL” line (`components/print/CourtFlyer.tsx` ~L148–191). On paper this **interrupts the narrative** (certified team → *large registration module* → coach grid). Readers are unsure **what the QR does** vs **the black button** (City hub vs Rec1 tennis catalog).

**Missing UTR:** The flyer shows UTR only **inside schedule cells** and pricing rows (from program JSON). There is **no dedicated UTR Circuit block** tying together **Saturday Matchplay Series**, season dates, divisions, and **`/programs/utr-match-play`** — unlike `LeaguesSection`, camps page, and adult programs copy. Canonical structured data already exists at **`data/leagues-2026.json` → `utr`** (season label, divisions array with time/venue/price/drop-in).

## Proposed Solution

### A. Registration: move + clarify (web + PDF)

1. **Remove** the full `flyer-register-box` from the **header** after “FREE TRIAL” so the header ends with a **single, calm line** of intent (e.g. “Register online before your first session — see **What to do** below” *or* only FREE TRIAL + horizon, no box).
2. **Relocate** the QR + Rec1 module into the **“What to do”** section (`section-quote` ~L248–261), which already lists phones, email, and Rec1 link. That section is the natural **action cluster**; the QR then **reinforces** “City online registration” instead of competing with the coaching-team headline.
3. **Rename / structure** copy for scannability:
   - **Eyebrow or bold lead:** e.g. “Register for City programs”
   - **Sub-line 1:** QR → City classes & registration **website**
   - **Sub-line 2:** Button → **Rec1** tennis **catalog** (filter link already in `FLYER_CONTACT.registerUrl`)
   - Keep **`FLYER_CONTACT.cityClassesRegistrationUrl`** on the QR `<a>`; no URL duplication in prose beyond short labels.

**PDF parity:** Mirror the same HTML structure and CSS in `scripts/generate-court-flyer-pdf-standalone.ts` (city-register block currently ~L504+ and styles ~L480+).

### B. UTR Circuit: data-driven summary block

1. Add a **compact “UTR Circuit · Saturday Matchplay”** subsection on the flyer (suggested placement: **after Camps** and **before** or **within** the pricing tables area — see `CourtFlyer.tsx` camps ~L405+, pricing follows). Alternative: after **schedule intro** if you want rated play visible on page 2 earlier; **prefer after camps** to keep page-1 hero clean after registration move.
2. **Source of truth:** Read `utr.seasonLabel` and `utr.divisions[]` from **`data/leagues-2026.json`** (same as `lib/utr-circuit-modal-pricing.ts` pattern). **Do not hardcode** division prices or dates in TSX/HTML strings (per `.cursorrules` / data rules).
3. **Content shape (print-friendly):**
   - Eyebrow: `UTR CIRCUIT · SEASON 1` (match site tone from `LeaguesSection` / camps)
   - Title: `Saturday Matchplay Series`
   - One sentence: rated play, 8 Saturdays, matches count toward Universal Tennis Rating (calm copy; avoid hype words from forbidden list)
   - **Dates:** from `seasonLabel`
   - **Link:** `https://lagunabeachtennisacademy.com/programs/utr-match-play` or relative `/programs/utr-match-play` on web; absolute URL in PDF HTML
   - **Divisions:** Either a **small table** (name, time, venue, series price) mapped from JSON, or **2–3 lines** of summary + “Full divisions and registration on the site” if space is tight — decide in Work after print preview.

4. **Shared helper:** Add something like `lib/flyer-utr-circuit.ts` (or extend an existing leagues loader) that exports `{ seasonLabel, divisionsForFlyer, matchPlayPath }` so **CourtFlyer** (server or client props) and **PDF script** both consume the same shape.

## Implementation Steps

### Phase 1: Data + helper

- [ ] **1.1** Add `lib/flyer-utr-circuit.ts` (or equivalent) importing `leagues-2026.json`, validating minimal fields (`utr.seasonLabel`, `utr.divisions`), exporting typed rows for flyer table/bullets.
- [ ] **1.2** Add `FLYER_UTR_MATCH_PLAY_PATH` or reuse a single constant in `lib/flyer-config.ts` next to `FLYER_CONTACT.siteUrl` (path only; full URL built for PDF).

### Phase 2: React flyer (`CourtFlyer.tsx`)

- [ ] **2.1** Remove registration box from header; optionally add one short bridging line if needed for “register before first session.”
- [ ] **2.2** Rebuild “What to do” to include flex row: QR + copy + Rec1 button (reuse existing classes / tokens; maintain 48px touch targets on web).
- [ ] **2.3** Pass UTR summary props from `app/print/court-flyer/page.tsx` (or wherever CourtFlyer is fed) using the new helper.
- [ ] **2.4** Render UTR block with data from props; link to `/programs/utr-match-play`.

### Phase 3: PDF script

- [ ] **3.1** Move `city-register` HTML to align with new “What to do” layout (or equivalent section in generated HTML).
- [ ] **3.2** Inject UTR block using same helper or duplicated read of JSON in script (prefer **import from `lib/flyer-utr-circuit.ts`** if tsx can be pulled into script without Next-only deps).
- [ ] **3.3** Run `npm run build:court-flyer-pdf-standalone` and verify page breaks and QR still render.

### Phase 4: Docs & validation

- [ ] **4.1** Update `docs/data-sources.md` if a new consumer of `leagues-2026.json` is documented.
- [ ] **4.2** `npm run build` + `npm run lint`.
- [ ] **4.3** Visual check: `/print/court-flyer` + generated PDF (registration clarity + UTR present).

## Files to Create/Modify

| File | Action | Purpose |
|------|--------|---------|
| `lib/flyer-utr-circuit.ts` | Create | Flyer-safe UTR payload from `leagues-2026.json` |
| `lib/flyer-config.ts` | Modify | Optional path constant for UTR match play page |
| `components/print/CourtFlyer.tsx` | Modify | Header / What to do / UTR block |
| `app/print/court-flyer/page.tsx` | Modify | Load UTR data, pass props |
| `scripts/generate-court-flyer-pdf-standalone.ts` | Modify | HTML/CSS parity + UTR block |
| `docs/data-sources.md` | Modify (if needed) | Note flyer reads `utr` from leagues JSON |

```yaml
# files (for tooling; do not edit by hand)
create: [lib/flyer-utr-circuit.ts]
modify: [lib/flyer-config.ts, components/print/CourtFlyer.tsx, app/print/court-flyer/page.tsx, scripts/generate-court-flyer-pdf-standalone.ts, docs/data-sources.md]
```

## Out of scope (this plan)

- Redesigning entire flyer grid or schedule rendering.
- Changing Rec1 or City URLs (unless copy labels only).
- Full NTRP↔UTR table on flyer (JSON has `ntrpToUtr` — optional future iteration).
- UTR **account** signup flows or external Universal Tennis branding beyond factual “matches count toward your rating” style copy.

## Success Criteria

- [ ] Header reads as **identity + trial**, not a registration kiosk.
- [ ] **What to do** clearly separates **City website (QR)** vs **Rec1 catalog (button)**.
- [ ] Flyer and PDF both include a **UTR Circuit** section with **dates and divisions** from **`data/leagues-2026.json`** (no hardcoded prices/dates in components).
- [ ] `npm run build` and PDF script succeed; no new lint errors.

## Acceptance checklist

- [ ] Open `/print/court-flyer`: registration QR appears in **What to do**, not under main headline.
- [ ] Scan QR (or check `href`): opens `FLYER_CONTACT.cityClassesRegistrationUrl`.
- [ ] Rec1 button opens existing `registerUrl` tennis catalog filter.
- [ ] UTR block shows **season** string matching `leagues-2026.json` `utr.seasonLabel`.
- [ ] At least **division names + one of time/venue/price** visible per row (or approved condensed copy).
- [ ] `npm run build:court-flyer-pdf-standalone` output matches web intent for registration + UTR.

## Research Sources

- `components/print/CourtFlyer.tsx` — current header / What to do structure.
- `scripts/generate-court-flyer-pdf-standalone.ts` — PDF HTML for city-register.
- `lib/flyer-config.ts` — `FLYER_CONTACT`, QR path.
- `data/leagues-2026.json` — `utr` object (season + divisions).
- `lib/utr-circuit-modal-pricing.ts` — precedent for consuming `utr.divisions` without hardcoding.
- `components/schedules/LeaguesSection.tsx` — on-site UTR Circuit messaging reference.

## Relevant Learnings

- **Single source of truth:** Schedules/pricing/leagues live in `/data`; flyer must not duplicate prices (`.cursorrules` Part 12).
- **Brand copy:** Calm, specific; avoid forbidden hype; UTR is factual placement/rated play, not “elite” positioning.

## Research conflicts & resolution

- **Placement options:** User screenshots suggest **registration feels too prominent under hero**; **What to do** is the chosen default because it already holds Rec1 + phones. If print tests show **page-1 overflow**, fallback: slim QR-only strip in footer strip (document in Work).

## Confidence & uncertainty

- **Plan confidence:** High for data source and problem diagnosis; **medium** for exact UTR table density on 11″ PDF — may need one iteration to shorten copy or drop-in prices only.

## Risks & Mitigations

| Risk | Mitigation |
|------|------------|
| PDF page length grows | Shorter UTR copy; smaller type; allow break-inside rules |
| `flyer-utr-circuit` import from PDF script pulls Next-only code | Keep helper as pure JSON + path only; no `next/*` imports |
| Copy still confusing | A/B label test: “Scan: City registration site” / “Open: Tennis programs (Rec1)” |

---

**Next step:** `/compound:work` this plan (or implement Phase 1–2 first, then PDF).
