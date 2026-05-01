# LBTA Master Court Flyer — Implementation Plan

**Status:** Draft plan. Ready for approval and Work phase.  
**Context:** Final print flyer to hang on City of Laguna Beach tennis courts. Draft reference: `Desktop/LBTA Coach Bios & Court Flyers/LBTA_Master_Flyer.pdf`. Four coach photos provided by user (see Photo mapping below).

---

## Overview

Produce the **final** LBTA Master Court Flyer as a print-ready asset: data-driven content, LBTA brand, and the four provided coach photos. The deliverable is a single master flyer (one or two pages) that can be printed to PDF and hung on courts at Moulton Meadows, Alta Laguna, and LBHS. Implementation uses a **print-optimized Next.js route** plus optional PDF export script; all content pulls from existing `/data` where possible.

---

## Problem Statement

- **Need:** A professional, on-brand court flyer that players see at City of Laguna Beach courts: certified coaching team, FREE TRIAL CTA, private lesson rates, program schedules by location, camps, program pricing, and registration/contact.
- **Current state:** A draft PDF exists with the right structure and copy but no coach photos and no single-source-of-truth link to the website data. Photos are provided separately (four images).
- **Constraint:** Flyer must be the “final version” — production-ready, not a placeholder. It will be printed and posted; design and data must be correct and maintainable.

---

## Proposed Solution

1. **Print route:** Add a dedicated route (e.g. `/print/court-flyer`) that renders the master flyer as a full-width, print-optimized page. No site chrome (header/footer); only flyer content. Uses Tailwind, Cormorant + DM Sans, and brand tokens. Content is loaded from:
   - `data/coaches.json` (names, order; flyer-specific titles/bios from a small override or inline constants derived from draft).
   - `data/private-rates.json` (private lesson table).
   - `data/spring-summer-2026.json` (season dates, programs, schedules, camps, pricing).
   - Contact/registration from `.cursorrules` or a single config (phone, email, register URL).
2. **Coach photos:** Copy the four user-provided images into the project (e.g. `public/images/print/coach-andrew.jpg`, `coach-former-removed.jpg`, `coach-allison.jpg`, `coach-peter.jpg`) and reference them in the flyer. **Photo-to-coach mapping** (see below) must be confirmed with the user.
3. **Layout:** One primary layout matching the draft structure: header (“CERTIFIED CITY OF LAGUNA BEACH COACHING TEAM”), FREE TRIAL CTA, “Your Certified Coaching Team” with four coach cards (photo + name + title + short bio), private lessons table, contact/register block, “LBTA RESERVED COURTS” and addresses, schedule grids by location (MM, LBHS, Alta Laguna), camps summary, program pricing tables, footer with tagline and season. Design for **11×17 (tabloid)** first so it reads well on court; support **8.5×11** via print CSS (e.g. scale or two-page break) if needed.
4. **Print workflow:** User opens `/print/court-flyer` in browser, uses **Print → Save as PDF** (or Print to printer). Optional: add a Node script using Puppeteer to generate `public/print/LBTA_Master_Flyer.pdf` for distribution.
5. **Single source of truth:** No hardcoded prices or schedule rows in the flyer component; all numbers and program names come from JSON (or a small flyer-specific JSON that extends coaches for flyer titles/bios). (Source: COMPOUND_LEARN, data management rules.)

---

## Photo Mapping (user-provided images → coaches) — CONFIRMED

The four images are saved in the project (Cursor assets folder). **Confirmed mapping:**

| Coach (draft order) | Image | Source file |
|--------------------|-------|-------------|
| Andrew Mateljan    | **4** | `assets/4-ddcec2f1-159c-4c0b-9a71-d882afa2090c.png` → `public/images/print/coach-andrew.png` |
| Former coach (removed) | **2** | `assets/2-48306354-7696-4ef7-b961-64c67d50bbf2.png` → `public/images/print/coach-former-removed.png` |
| Allison Cronk      | **3** | `assets/3-b8412297-4628-4f11-b38a-32445428a316.png` → `public/images/print/coach-allison.png` |
| Peter DeFrantz     | **1** | `assets/1-9f3bf562-0b55-43fd-b062-cb04e5dfb156.png` → `public/images/print/coach-peter.png` |

Copy assets into `public/images/print/` with the canonical names above for use in the flyer.

---

## Implementation Steps

### Phase 1: Assets and data prep

- [x] **1.1** Copy the four coach images into `public/images/print/` with canonical names (mapping confirmed: 1=Peter, 2=former coach removed, 3=Allison, 4=Andrew): `assets/1-*.png` → `coach-peter.png`, `assets/2-*.png` → `coach-former-removed.png`, `assets/3-*.png` → `coach-allison.png`, `assets/4-*.png` → `coach-andrew.png`.
- [x] **1.2** Add flyer-specific copy (titles and short bios) so the flyer matches the draft without hardcoding in the component. Options: (A) New file `data/flyer-coach-bios.json` with keys by coach slug and fields `flyerTitle`, `flyerBio` (2–3 lines); or (B) extend `data/coaches.json` with optional `flyerTitle` and `flyerBio`. Draft text:
  - **Andrew:** Title: “Founder & Academy Director”. Bio: “ATP Coach · ITF Professional · LBHS Head Coach … Competed professionally on the ITF Futures circuit. Seven years coaching in Europe. GPTCA-ATP certified. Has coached 5 ATP/WTA-ranked players including Alex Michelsen. Founder of Fit4Tennis (100K+ followers).”
  - **Former coach (removed):** Archived bio retained for historical draft context only.
  - **Allison:** Title: “Director of Youth Development”. Bio: “NCAA & NAIA Tennis · B.A. History, Education Minor … Westcliff University (NAIA) and Shepherd University (NCAA). Dean's List. Coaching across five academies. Specializes in youth development from beginners to competitive juniors.”
  - **Peter:** Title: “Head Coach”. Bio: “USPTA + PTR Dual Certified · #1 SoCal Collegiate Team … Mt. San Jacinto College (#1 SoCal). Dual USPTA/PTR certified. Over eight years professional coaching across juniors, adults, and competitive training.”
- [x] **1.3** Add a small config or constants for flyer contact/CTA (phone, email, register URL, season label “Spring 2026 · April 6 – June 13”) if not already derivable from `data/spring-summer-2026.json` and .cursorrules. Use one place so updates don’t require editing the component.

### Phase 2: Print route and layout

- [x] **2.1** Create `app/print/court-flyer/page.tsx` (server component): load coaches (with flyer titles/bios), private rates, spring season dates, programs, schedule-by-location data, and camps from existing lib + data. Pass to a client or server flyer component that renders the full layout.
- [x] **2.2** Implement the flyer UI (single component or a few subcomponents):
  - **Header:** “CERTIFIED CITY OF LAGUNA BEACH COACHING TEAM” + “Only LBTA coaches are authorized to teach at City of Laguna Beach tennis courts.” + “FREE TRIAL — Try Any Group Class”.
  - **Coach section:** “Your Certified Coaching Team” — four cards in draft order (Andrew, former coach removed, Allison, Peter): photo (`next/image` or `<img>` with stable paths), name, flyer title, flyer bio (short).
  - **Private lessons:** Table from `data/private-rates.json` (COACH, 60 MIN, 90 MIN, 10-PACK, 20-PACK).
  - **CTA block:** FREE TRIAL (phone), EMAIL, REGISTER (City phone/URL) — from config.
  - **Reserved courts:** Moulton Meadows Park (Court 2, address), Alta Laguna Park (Courts 1 & 2, address), Laguna Beach High School (Courts 1 & 2, address). Optional: Sat 1–3 PM USTA League note.
  - **Schedule grids:** By location (MM, LBHS, AL) — time × day grids derived from `getScheduleByLocationByDay('spring')` or equivalent from `lib/` (reuse calendar data layer where possible). Compact table layout as in draft.
  - **Camps:** Spring Break, Summer, Thanksgiving (dates, ages, price from `data/spring-summer-2026.json` / `data/year2026.json`). UTR Circuit line if applicable.
  - **Program pricing:** Junior & Competitive table (program, 1x/wk, 2x/wk, drop-in); Adult & Fitness table. Data from spring-summer programs + pricing. Discount line: “$50 off early bird · 10% second child · …”.
  - **Footer:** Register (phone), FREE TRIAL & QUESTIONS (phone), email, lagunabeachtennisacademy.com, “Movement. Craft. Community.”, “OFFICIAL CITY PARTNER”, “Laguna Beach Tennis Academy”, “Spring 2026 · April 6 – June 13 · 10 Weeks”.
- [x] **2.3** Apply LBTA brand: Cormorant for headlines, DM Sans for body; brand tokens only (e.g. `brand-pacific-dusk`, `brand-deep-water`, `brand-sandstone`, `brand-morning-light`). No hardcoded hex. (Source: .cursorrules Part 7, COMPOUND_LEARN.)
- [x] **2.4** Add print-only CSS: hide any nav/footer/chrome; set root background for print; ensure flyer uses full width; page size 11×17 or 8.5×11 with appropriate margins; avoid break-inside on key blocks (e.g. coach cards, tables). Test “Print → Save as PDF” and actual print.

### Phase 3: Schedule and pricing data wiring

- [x] **3.1** Derive schedule grids (time × day per location) from existing calendar/schedule data (e.g. `lib/calendar-schedule.ts` or `lib/programs-data.ts`) for Spring 2026 so the flyer shows the same data as the website. If calendar data is by program, aggregate into location × day × time slots for display.
- [x] **3.2** Map program pricing (1x/wk, 2x/wk, drop-in) from `data/spring-summer-2026.json` programs and any pricing supplement so the flyer tables match the schedules page. Use same rounding/formatting (e.g. $120/mo vs $420) as draft.

### Phase 4: PDF export (optional)

- [ ] **4.1** (Optional) Add script `scripts/generate-court-flyer-pdf.mjs`: use Puppeteer to open `http://localhost:3000/print/court-flyer` (or build a production URL), wait for load, print to PDF with 11×17 (or 8.5×11) and save to `public/print/LBTA_Master_Flyer.pdf`. Document in README or `docs/` so you can regenerate when data or copy changes.
- [ ] **4.2** If 4.1 is skipped, document in plan: “Final PDF: open /print/court-flyer in browser → Print → Save as PDF.”

---

## Files to Create / Modify

| File | Action | Purpose |
|------|--------|---------|
| `public/images/print/coach-andrew.png` | Create (copy) | Coach photo for Andrew (from assets, per mapping). |
| `public/images/print/coach-former-removed.png` | Create (copy) | Archived coach photo placeholder for historical draft parity. |
| `public/images/print/coach-allison.png` | Create (copy) | Coach photo for Allison. |
| `public/images/print/coach-peter.png` | Create (copy) | Coach photo for Peter. |
| `data/flyer-coach-bios.json` or extend `data/coaches.json` | Create or Modify | Flyer-specific titles and short bios. |
| `app/print/court-flyer/page.tsx` | Create | Server page that loads data and renders flyer. |
| `components/print/CourtFlyer.tsx` (or inline in page) | Create | Flyer layout: header, coaches, tables, schedules, footer. |
| `app/print/court-flyer/print.css` or `globals.css` @media print | Create or Modify | Print-only styles for court flyer route. |
| `app/print/layout.tsx` | Create | Minimal layout (no header/footer) for /print/*. |
| `scripts/generate-court-flyer-pdf.mjs` | Create (optional) | Puppeteer script to generate PDF. |
| `docs/print-assets.md` or README section | Create or Modify | How to regenerate the court flyer PDF. |

```yaml
# files (for tooling; do not edit by hand)
create:
  - public/images/print/coach-andrew.png
  - public/images/print/coach-former-removed.png
  - public/images/print/coach-allison.png
  - public/images/print/coach-peter.png
  - data/flyer-coach-bios.json
  - app/print/court-flyer/page.tsx
  - components/print/CourtFlyer.tsx
  - app/print/layout.tsx
  - app/print/court-flyer/print.css
modify:
  - app/globals.css
create_optional:
  - scripts/generate-court-flyer-pdf.mjs
  - docs/print-assets.md
```

---

## Out of scope (this plan)

- Designing or editing the flyer in Canva/Figma (we produce the final version in code).
- Other court signage (e.g. separate “FREE TRIAL” only posters).
- Changes to the main website UI beyond adding the `/print/court-flyer` route.
- Automatic sync of the PDF to a CMS or external print vendor (manual export is enough for now).

---

## Success Criteria

- [ ] Visiting `/print/court-flyer` shows the full master flyer with all sections and the four coach photos.
- [ ] All prices, program names, and schedule data come from `/data` (or flyer-coach-bios); no hardcoded numbers in the component.
- [ ] “Print → Save as PDF” produces a clean, readable PDF suitable for 11×17 (or 8.5×11) posting on courts.
- [ ] Typography and colors use LBTA brand (Cormorant, DM Sans, brand tokens only).
- [ ] Contact info (phone, email, register) and season dates are correct and maintained in one place.

---

## Acceptance checklist

- [ ] [Photos] Four coach photos appear in the correct order (Andrew, former coach removed, Allison, Peter): Andrew=image 4, former coach removed=image 2, Allison=image 3, Peter=image 1.
- [ ] [Data] Private lesson table matches `data/private-rates.json`; program pricing and schedule grids match spring 2026 data.
- [ ] [Print] PDF exported from the route has no site chrome, readable text, and no horizontal overflow.
- [ ] [Brand] No hardcoded hex; fonts are Cormorant (headlines) and DM Sans (body).
- [ ] [Single source] Changing a price in JSON updates the flyer after refresh/rebuild.

---

## Research sources

- Draft content and structure: `Desktop/LBTA Coach Bios & Court Flyers/LBTA_Master_Flyer.pdf`.
- Project data: `data/coaches.json`, `data/private-rates.json`, `data/spring-summer-2026.json`, `data/year2026.json`.
- Brand and typography: `.cursorrules` Parts 7–8, `tailwind.config.ts`.
- Print/calendar pattern: `plans/schedule-calendar-by-location-plan.md` (print styles, optional PDF).

---

## Relevant learnings

- **Single source of truth:** Program/pricing data lives in `/data`; no hardcoded prices in components (COMPOUND_LEARN, .cursorrules Part 12).
- **Brand:** Use brand tokens only; no hardcoded hex (COMPOUND_LEARN, .cursorrules Part 7).
- **Print:** Print-friendly route with no chrome and @media print CSS is the established pattern for schedule calendar; same approach for court flyer.

---

## Risks & mitigations

| Risk | Mitigation |
|------|------------|
| Draft has more copy than in JSON (e.g. USTA Sat note, Thanksgiving camp) | Include flyer-specific strings in `data/flyer-coach-bios.json` or a small `data/flyer-copy.json` for one-off lines. |
| Schedule grid format differs from calendar data shape | Add a small adapter in lib or in the flyer component to turn location-by-day slots into the compact time×day grid used on the draft. |
| 11×17 vs 8.5×11 | Design for 11×17 first; add print CSS to scale or split to two 8.5×11 pages if needed. |

---

## Next step

1. Run **Work** phase: implement Phase 1 (copy photos per mapping: 1=Peter, 2=former coach removed, 3=Allison, 4=Andrew; add flyer bios/config), Phase 2 (print route + layout + print CSS), Phase 3 (data wiring), then optionally Phase 4 (PDF script).
2. **Validate:** Open `/print/court-flyer`, print to PDF, and verify against the acceptance checklist.
