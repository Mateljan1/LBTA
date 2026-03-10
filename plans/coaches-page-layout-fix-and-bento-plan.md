# Coaches Page Layout Fix & Bento Layout — Implementation Plan

**Date:** 2026-03-10  
**Scope:** Fix Andrew’s headshot being cut off by the quote box; improve layout for all coaches with optional Bento grid; support 4+ coaches (including Michelle if she returns).

---

## Overview

The coaches listing page has two issues: (1) Andrew’s photo is overlapped by an absolutely positioned pull-quote box that cuts off his face, and (2) the mix of founder (image+overlay), featured lead card, and 2-col program cards is inconsistent and doesn’t scale cleanly. This plan fixes the overlap and proposes a clearer, scalable layout (Bento or unified grid).

---

## Problem Statement

1. **Andrew’s picture cut-off**  
   In `FounderSection.tsx`, a white pull-quote box is positioned with `absolute -bottom-6 -right-6 md:-bottom-8 md:-right-8` over the founder image. That overlay sits on top of the photo and can cut off the right side of Andrew’s face (and similar issues at different viewports).

2. **Inconsistent layout**  
   Founder block uses image + overlapping quote; Coaching Team uses one large “featured” card (Robert) and then 2-col grid (Peter, Allison). Different card sizes and the overlay make the page feel uneven and harder to extend to more coaches.

3. **Scalability**  
   Layout should support 4 coaches today and 5+ if Michelle or others are re-added, without redoing structure.

---

## Proposed Solution

### Part 1: Fix Andrew’s Photo (No Overlap)

- **Remove the quote overlay from the image.**  
  Do not position any content on top of the founder photo.
- **Show the quote in the text column** (right column on desktop, below the image on mobile), or as a dedicated block below the image.  
  Same content, no overlap. Andrew’s headshot stays fully visible at all breakpoints.

**Implementation:** In `FounderSection.tsx`, remove the absolutely positioned `div` that wraps `PullQuote` from the image column. Render the founder quote in the right column (e.g. after the specialization line or after the first paragraph of bio), or below the image in a simple stacked block. Keep `objectPosition` and image aspect ratio as-is so the face remains the focus.

### Part 2: Layout for All Coaches (Bento vs Alternatives)

**Option A — Bento-style grid (recommended)**

- **Single “Our Coaches” section** driven by one data source: `getCoaches()` (founder first, then lead, then program by `order`).
- **Grid structure (desktop):**
  - Row 1: Andrew spans 2 columns (large hero-style block: image left, name/title/quote/bio right; **no overlay on image**).
  - Row 2: Robert spans 2 columns (same pattern: image + text side-by-side, no overlay).
  - Row 3: Two columns — Peter (card) | Allison (card).  
  If a 5th coach (e.g. Michelle) is added, row 3 becomes 3 columns or row 4 adds one/two more cards.
- **Mobile:** Stack all blocks vertically (Andrew → Robert → Peter → Allison). Each block: image on top (full width), then text below.
- **Benefits:** No overlapping elements, consistent “image + text” pattern for founder/lead, smaller cards for program coaches, scales to 5+ by adding grid cells.

**Option B — Keep Founder + Team, no Bento**

- **FounderSection:** Same as Part 1 (no overlay; quote in text column or below image). Layout stays two columns (image | text).
- **CoachingTeamSection:** One consistent grid for all non-founder coaches (Robert, Peter, Allison). Either:
  - All 3 as same-size cards in a 3-col grid (md: 2 cols, lg: 3 cols), or
  - Robert featured (larger) + 2-col grid for Peter & Allison.
- **Benefits:** Minimal change to section structure; only FounderSection and optionally CoachCard/CoachingTeamSection need edits.

**Recommendation:** Option A (Bento-style) for a cleaner, more scalable “one section” feel and no overlap anywhere. Option B if you prefer to keep the current Founder vs Team split and only fix the overlap.

### Part 3: Michelle (and 5+ coaches)

- **Data:** Michelle is currently removed from `data/coaches.json` (not coaching). Do **not** re-add her to the data unless you decide she should be listed again.
- **Layout:** Whatever we build (Bento or unified grid) should **support 5+ coaches**: e.g. Bento row 3 with 3 cards, or an extra row. When/if Michelle is re-added, add her entry back to `coaches.json` with the correct `order`; the same layout will show her without code changes.
- **Plan note:** “Michelle should be on there too” is interpreted as: (a) layout must scale so she can be added back later, and (b) if you want her visible now, add her back to `data/coaches.json` and the new layout will include her automatically.

---

## Implementation Steps

### Phase 1: Fix Andrew’s Picture (No Overlap)

- [ ] **1.1** In `components/coaches/FounderSection.tsx`, remove the absolutely positioned pull-quote overlay from the image container (the `div` with `absolute -bottom-6 -right-6 ...` and `PullQuote` inside).
- [ ] **1.2** Add the founder quote to the text column: e.g. after the specialization line, or after the first bio paragraph, using the existing `PullQuote` component (variant `light`). Ensure it’s visible on mobile (below or after the image in DOM order).
- [ ] **1.3** Optionally add a subtle visual separator (e.g. `section-quote` border or spacing) so the quote is clearly distinct from the bio. Avoid any new overlay on the image.
- [ ] **1.4** Verify at 320px, 375px, 768px, 1024px, 1440px: Andrew’s full headshot is visible and nothing overlaps the face.

### Phase 2: Choose and Implement Layout (Bento vs Unified)

**If Option A (Bento-style):**

- [ ] **2.A.1** Add a new section (or refactor `CoachesPageClient`) to render one “Our Coaches” area using `getCoaches()`.
- [ ] **2.A.2** Implement a responsive CSS Grid:
  - Desktop: Row 1 — Andrew (grid-column span 2): image left, text right, no overlay. Row 2 — Robert (span 2): same. Row 3 — program coaches (Peter, Allison) in 2 cols; if 5 coaches, 3 cols or second row.
  - Tablet: Andrew and Robert each full width (image top, text bottom); program coaches 2-col.
  - Mobile: Single column stack for all.
- [ ] **2.A.3** Reuse or adapt `CoachCard` / founder block so image and text never overlap (no absolute quote on images). Use the same brand tokens (e.g. `container-lbta`, `section-spacing`, typography).
- [ ] **2.A.4** Remove or simplify the current `FounderSection` + `CoachingTeamSection` split if everything is now in one Bento section, or keep hero/anchors and feed both from the same grid.

**If Option B (Keep Founder + Team):**

- [ ] **2.B.1** Keep `FounderSection` (after Phase 1 fix) and `CoachingTeamSection`.
- [ ] **2.B.2** In `CoachingTeamSection`, make program coaches a uniform grid (e.g. `grid-cols-1 md:grid-cols-2 lg:grid-cols-3`) so Robert, Peter, Allison use the same card size, or keep Robert featured and ensure no overlay on any card image.
- [ ] **2.B.3** Ensure `CoachCard` never uses absolute positioning that overlaps the photo (currently it doesn’t; only FounderSection did).

### Phase 3: Responsive and Accessibility

- [ ] **3.1** Test all breakpoints (320, 375, 768, 1024, 1440). No horizontal scroll; no text over face.
- [ ] **3.2** Ensure focus order and headings (e.g. “Our Coaches”, coach names) work for screen readers; images have correct `alt` (already in place).
- [ ] **3.3** If adding new grid areas, use semantic layout (e.g. one `<section>` with `<article>` or card per coach) and avoid layout-only divs that confuse order.

### Phase 4: Data and Future Coaches (e.g. Michelle)

- [ ] **4.1** Confirm `data/coaches.json` remains the single source of truth; order is 1 (Andrew), 2 (Robert), 3 (Peter), 4 (Allison). No hardcoded coach count in layout.
- [ ] **4.2** If Michelle is to be listed again: add her object back to `coaches.json` with `role: "program"` and `order: 5` (or appropriate); no layout code change required if grid is dynamic.
- [ ] **4.3** Document in plan or README: “Coaches page layout supports 4+ coaches; add entries to `data/coaches.json` to show more.”

---

## Files to Create/Modify

| File | Action | Purpose |
|------|--------|---------|
| `components/coaches/FounderSection.tsx` | Modify | Remove quote overlay from image; move quote to text column (or below image). |
| `components/coaches/CoachingTeamSection.tsx` | Modify | If Option B: unify grid (same-size cards or keep featured + grid). If Option A: may be replaced or simplified by Bento section. |
| `components/coaches/CoachesPageClient.tsx` | Modify | If Option A: add single Bento-style section using `getCoaches()`; optional refactor of FounderSection/CoachingTeamSection. |
| `components/coaches/CoachCard.tsx` | Optional | If Option A: add or reuse a “large block” variant (image + text side-by-side, no overlay) for founder/lead. |
| `app/globals.css` | Optional | If Option A: add utility class for Bento grid (e.g. `.coaches-bento`) if not using inline Tailwind only. |
| `data/coaches.json` | No change for layout | Only add Michelle (or others) when they should be listed. |

---

## Success Criteria

- [ ] Andrew’s headshot is never cut off by a text box; quote appears beside or below the image, not on top.
- [ ] All coach photos are fully visible with no overlapping UI.
- [ ] Layout is consistent and works at 320px, 375px, 768px, 1024px, 1440px.
- [ ] Adding a 5th coach (e.g. Michelle) requires only a `coaches.json` update, no layout code change.
- [ ] Build and lint pass; no new a11y or contrast regressions.

---

## Risks & Mitigations

| Risk | Mitigation |
|------|------------|
| Bento grid too complex on small viewports | Use a single-column stack on mobile; only use multi-column grid from md up. |
| Founder “feels less prominent” without overlay | Keep his block largest (e.g. span 2, or first) and use typography/space to keep hierarchy. |
| Michelle re-added with wrong order | Document that new coaches need correct `order` and `role` in `coaches.json`. |

---

## Summary

1. **Fix Andrew:** Remove the absolute pull-quote from the image in `FounderSection`; show the quote in the text column or below the image.
2. **Layout:** Prefer a Bento-style grid (Option A) for one coherent section and easy scaling; otherwise keep Founder + Team and unify the team grid (Option B).
3. **Michelle:** Layout supports 5+ coaches; add her back to `data/coaches.json` when she should be listed again.
