# UTR Match Play — Mockup Layout, Photography & 10/10 Polish

## Overview

Bring `/programs/utr-match-play` in line with the approved **layout and palette** in `UTR_MatchPlay_Page_Mockup (1).html`: full-bleed hero with photo + left gradient, top accent bar, date strip, light **2×2 division cards** with photo headers, weekend schedule table, points/tiers, Grand Finals block, venues, FAQ, and closing CTA—while keeping **one source of truth** in `data/leagues-2026.json` and LBTA design tokens (Cormorant + DM Sans, brand colors, accessibility).

## Problem Statement

The live page evolved as a **dark “dashboard” hero** with three stat cards; the stakeholder mockup is a **lighter, editorial** flow (photo hero → navy strip → white division grid) with **Saturday/Sunday** split and **June 6** Grand Finals. Photography must match **real divisions and venues** (no wrong crops or placeholders). A **10/10** bar means responsive polish, WCAG contrast, correct `next/image` usage, and copy that does not contradict data.

## Proposed Solution

1. **Layout parity (not pixel-perfect HTML port)**  
   Rebuild the page shell to mirror mockup **regions** in React: `UtrSeriesHero` (or split into `UtrMatchPlayHero` + `UtrDateStrip`), divisions section, schedule, points/tiers, Grand Finals, venues, FAQ, footer CTA. Use Tailwind + existing `container-lbta` / section spacing patterns; map mockup hex values to **brand tokens** where possible (`brand-deep-water` `#0F2237`, `brand-victoria-cove`, `brand-sunset-cliff`, `brand-thousand-steps` for gold accents).

2. **Photography**  
   - **Hero + divisions:** Continue paths under `public/images/programs/utr-match-play/` (`utr-match-play-hero.webp`, `color-ball.webp`, `utr-2-4.webp`, `utr-5-7.webp`, `doubles.webp`). Add optional `utr-3-5.webp` if a merged band uses a distinct asset.  
   - **Per-image tuning:** Use `imageObjectPosition` in JSON + `object-cover` / `object-contain` as appropriate so faces and court context read at **~220px-tall** card headers (mockup `dc-photo` height).  
   - **Venues:** Prefer **local WebP** in `public/images/` for stability and performance; if Cloudinary masters are canonical, `next/image` already allows `res.cloudinary.com`—document chosen URLs in data or a small `venues` constant.

3. **Data model**  
   Extend `data/leagues-2026.json` `utr` only as needed: e.g. optional `regularSeasonSundays`, `grandFinalsDate`, division fields for `dayLabel` (`Saturday` | `Sunday`), `dayVariant` (teal vs sunset CTA), merged division copy. Update `lib/schedule-schemas.ts` + `lib/utr-match-play.ts` helpers so the **date strip**, **schedule table**, and **hero stats** are derived from JSON (no duplicated dates in TSX).

4. **Content gate**  
   Resolve **mockup inconsistency**: hero says “5 Divisions” but the HTML shows **four** cards (merged UTR bands). **Decision required before ship:** either update hero to “Four Divisions” or restore five cards with JSON-backed list.

## Implementation Steps

### Phase 1: Foundation & content authority

- [ ] **1.1** Confirm with stakeholder: **Grand Finals date** (mock: June 6, 2026), **8 weekends** with **Sat + Sun** columns, **division list** (4 vs 5), and **prices** vs current JSON.  
- [ ] **1.2** Update `data/leagues-2026.json` to match the approved schedule and divisions; run schema validation (`parseLeagues`).  
- [ ] **1.3** Extend Zod schema only for fields the UI needs (`regularSeasonSundays`, optional `grandFinalsVenue`, etc.).

### Phase 2: Layout — hero, strip, divisions

- [ ] **2.1** Replace or refactor `UtrSeriesHero` to match mockup: **background image** (`next/image` `fill` + `priority`), **linear gradient overlay** (~100deg, deep navy), **5px top bar** (gradient teal → sunset → thousand-steps), headline in **Cormorant** with accent line in Victoria Cove, body **DM Sans**, **four-stat row**, primary CTA teal / secondary ghost (contrast on dark: solid fills per `.cursorrules`).  
- [ ] **2.2** Add **`UtrDateStrip`** (or section in hero file): flex row, responsive wrap, labels + values; Saturday value in teal, Sunday in sunset, Grand Finals in gold.  
- [ ] **2.3** Refactor **`UTRMatchPlayDivisions`** (and/or page layout) to **light** section: `bg-white` / `bg-brand-morning-light`, **2-column grid** `md:grid-cols-2`, card = image area + gradient bottom overlay + **day pill**, body with color-ball row or info grid, footer price row + Register / Drop-in actions wired to existing modals.

### Phase 3: Schedule, points, Grand Finals, venues, FAQ, CTA

- [ ] **3.1** **`UtrDropInSchedule`**: match mockup table — columns **Week | Saturday | Sunday | action**; highlight Grand Finals row; dates from JSON arrays; register links to `#divisions` or modal triggers.  
- [ ] **3.2** Points & tiers: two-column layout on large screens; reuse copy from mockup where it matches policy; no forbidden marketing words (`.cursorrules`).  
- [ ] **3.3** Grand Finals: dark section (`brand-deep-water`), **4-up** timeline cards, optional **Karué** row with `next/image` and alt text.  
- [ ] **3.4** Venues: two cards with local or Cloudinary images, addresses, day lines; ensure alt text describes location, not generic “tennis.”  
- [ ] **3.5** FAQ: semantic `<dl>` or heading+region pattern, keyboard-friendly if any accordion is used.  
- [ ] **3.6** Bottom CTA: centered, teal + ghost buttons, contact line; match footer contrast (text-white/50+ on dark).

### Phase 4: Polish & verification

- [ ] **4.1** Responsive: 320 / 375 / 768 / 1024 / 1440 — no horizontal scroll; touch targets ≥48px.  
- [ ] **4.2** `prefers-reduced-motion` for any new motion.  
- [ ] **4.3** Meta / JSON-LD on `page.tsx` if title/description should reflect new season copy.  
- [ ] **4.4** Run `npm run lint`, `npm run build`, and targeted Playwright or manual smoke on `/programs/utr-match-play`.

## Files to Create/Modify

| File | Action | Purpose |
|------|--------|---------|
| `data/leagues-2026.json` | Modify | Sundays, Grand Finals, division merge, image paths |
| `lib/schedule-schemas.ts` | Modify | Optional `utr` fields for schedule + division day |
| `lib/utr-match-play.ts` | Modify | Helpers: season range, strip labels, week rows, GF copy |
| `components/programs/UtrSeriesHero.tsx` | Modify (or replace) | Mockup hero + stats + CTAs |
| `components/programs/UtrDateStrip.tsx` | Create | Navy date/venue strip (optional if folded into hero) |
| `app/programs/utr-match-play/UTRMatchPlayDivisions.tsx` | Modify | Light cards, 2×2 grid, day badges |
| `app/programs/utr-match-play/UtrDropInSchedule.tsx` | Modify | Sat/Sun/GF table |
| `app/programs/utr-match-play/page.tsx` | Modify | Section order, new blocks, compose components |
| `public/images/programs/utr-match-play/*.webp` | Add/replace | Correct crops per division; optimize ≤350KB where possible |
| `public/images/venues/*` or Cloudinary | Add / reference | Venue card art |

```yaml
# files (for tooling; keep in sync with table)
create:
  - components/programs/UtrDateStrip.tsx
modify:
  - data/leagues-2026.json
  - lib/schedule-schemas.ts
  - lib/utr-match-play.ts
  - components/programs/UtrSeriesHero.tsx
  - app/programs/utr-match-play/UTRMatchPlayDivisions.tsx
  - app/programs/utr-match-play/UtrDropInSchedule.tsx
  - app/programs/utr-match-play/page.tsx
```

## Out of scope (this plan)

- Changing ActiveCampaign / registration backend flows beyond existing modal links.  
- New payment or checkout.  
- Non-UTR program pages.  
- Importing the mockup’s **Cormorant Garamond** font — use project **Cormorant** (headline) per `.cursorrules`.  
- Pixel-perfect clone of mockup **border-radius 16px** vs 8px unless trivially aligned with existing card tokens.

## Success Criteria

- [ ] Visual hierarchy matches mockup **regions** (hero → strip → divisions → schedule → points → GF → venues → FAQ → CTA).  
- [ ] All dates, venues, division names, and prices come from **`data/leagues-2026.json`** (single source of truth).  
- [ ] Division and hero images are correct assets with descriptive **alt** and sensible **sizes** / **quality**.  
- [ ] Lighthouse accessibility: no regressions; contrast on dark sections meets project bar.  
- [ ] `npm run build` and `npm run lint` pass.

## Acceptance checklist

- [ ] Hero shows **photo + gradient + top accent bar**; H1 readable at mobile width.  
- [ ] Date strip shows **season range**, **Saturday venue**, **Sunday venue**, **Grand Finals** from data.  
- [ ] Division grid is **2×2** on desktop, stacks on mobile; each card shows **correct image** and **Saturday/Sunday** pill from data.  
- [ ] Schedule table lists **8 weekend rows** + **Grand Finals** row; weekend dates match JSON.  
- [ ] Grand Finals section date/venue match JSON.  
- [ ] No **external** images without `remotePatterns` or without local copies (if policy is local-only).  
- [ ] Register / Drop-in still open correct modals or anchors.  
- [ ] **Division count** in hero matches number of cards (resolved inconsistency).

## Research Sources

- Stakeholder mockup: `~/Downloads/UTR_MatchPlay_Page_Mockup (1).html` (layout + palette reference).  
- Project rules: `.cursorrules` (typography, colors, hero CTA contrast, single source `/data`).  
- Existing types: `lib/schedule-schemas.ts` (`utr` block).  
- [Next.js Image](https://nextjs.org/docs/app/api-reference/components/image) — `fill`, `sizes`, `priority`.

## Relevant Learnings

- **COMPOUND / LBTA:** Prices and schedules live in **`/data/*.json`**, not hardcoded in components.  
- **Images:** Use `next/image` only; WebP; hero may use `priority`; editorial quality 95+ where specified in `lib/image-quality.ts`.  
- **Contrast:** On `brand-deep-water`, secondary text **text-white/50** or higher.

## Research conflicts & resolution

| Conflict | Resolution |
|----------|------------|
| Mockup “5 divisions” vs 4 cards | Stakeholder picks one; update JSON + hero + GF copy (“all **N** divisions”). |
| Mockup uses **Cormorant Garamond** | Use repo **Cormorant** stack for brand consistency. |
| Prior session: “JSON is authority” vs mockup June 6 / Sun column | **Approved business data** updates JSON first; UI reads JSON. |

## Confidence & uncertainty

- **Plan confidence:** Medium until division count and final prices are confirmed.  
- **Uncertainty:** Whether `utr-3-5.webp` is still needed after band merge; exact Cloudinary vs local policy for venue photos.

## Risks & Mitigations

| Risk | Mitigation |
|------|------------|
| Schema change breaks other consumers of `leagues-2026.json` | Grep for `utr` usage; extend fields optionally with `.optional()`. |
| Large hero image hurts LCP | Preload only hero; compress WebP; appropriate `sizes`. |
| Cloudinary URL drift | Prefer committed WebP under `public/images/` for long-lived pages. |

**Gate:** After JSON shape changes, run `parseLeagues` / build and fix any type errors before UI polish.

---

**Recommended next command:** `/compound:work ./plans/utr-match-play-mockup-10-polish.md` after stakeholder signs off on division count and dates.
