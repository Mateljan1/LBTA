# LBTA Remaining Fixes + VYLO Removal — Implementation Plan

**Compound Engineering Phase: PLAN**  
**Date**: March 6, 2026  
**Source**: COMPOUND_LEARN.md, user request (remove VYLO; fix all remaining issues)

---

## Overview

Remove the discontinued VYLO product from the codebase and fix all remaining issues from the compound learnings: accessibility (HomeCTAForm labels + live region, HomeHero 48px scroll button), performance (single priority per page, sizes on hero images, junior-trial WebP), and documentation (.cursorrules file structure). No new features; cleanup and compliance only.

---

## Problem Statement

- **VYLO**: Product no longer exists; `/vylo` and `/vylo-apply` routes, nav/layout logic, coach copy, partnership section, and redirects should be removed or updated so the site no longer references VYLO.
- **Remaining issues**: From COMPOUND_LEARN.md and review: (1) HomeCTAForm has placeholder-only labels and no live region for submit errors; (2) HomeHero scroll button is below 48×48px touch target; (3) Coaches page has two `priority` images (hero + founder); (4) not-found and racquet-rescue hero images use `priority`/`fill` without `sizes`; (5) junior-trial hero is JPG instead of WebP; (6) .cursorrules Part 13 still lists jtt, adult redirect, and does not reflect VYLO removal.

---

## Proposed Solution

1. **VYLO removal**: Delete `app/vylo/` and `app/vylo-apply/`, delete `app/api/vylo-apply/`. Remove or replace all references (ConditionalLayout, coaches Andrew page VYLO block, PartnershipSection, pathway-planner recommendation, next.config redirects/rewrites). Redirect `/vylo` and `/vylo-apply` to `/programs/high-performance` so old links do not 404. Optionally keep `vylo-orange` in Tailwind for legacy/andrew page styling only if needed; otherwise remove after coach page copy change.
2. **A11y**: Add proper `<label>` (visible or `sr-only`) + `id`/`htmlFor` and a live region (`role="alert"`) for submit errors in HomeCTAForm. Ensure HomeHero scroll button has `min-h-[48px] min-w-[48px]` and padding.
3. **Performance**: One `priority` per page on coaches (remove from founder portrait). Add `sizes="100vw"` to not-found and racquet-rescue hero Images. Junior-trial: use WebP asset if available or add note to convert later and keep JPG for now (or convert path to .webp when asset exists).
4. **Docs**: Update .cursorrules Part 13 to remove jtt, state adult as full pathway, remove vylo from file structure.

---

## Implementation Steps

### Phase 1: VYLO Removal

- [ ] **1.1** Delete `app/vylo/` directory (page.tsx, layout.tsx, useVYLOAnimations.ts, vylo.css).
- [ ] **1.2** Delete `app/vylo-apply/` directory (page.tsx, layout.tsx).
- [ ] **1.3** Delete `app/api/vylo-apply/` directory (route.ts).
- [ ] **1.4** In `next.config.js`: (a) Change `/pro-training` and `/pro-training/` redirect destination from `/vylo` to `/programs/high-performance`. (b) Change "Hide VYLO" redirects so `/vylo` and `/vylo/` redirect to `/programs/high-performance` (permanent: true). (c) Add redirects for `/vylo-apply` and `/vylo-apply/` to `/programs/high-performance`.
- [ ] **1.5** In `components/layout/ConditionalLayout.tsx`: Remove `isVYLO` and any layout branch that depends on it (use pathname only for beginner/junior landings if needed).
- [ ] **1.6** In `app/coaches/andrew-mateljan/page.tsx`: Remove the "Fit4Tennis & VYLO" section block (or replace with Fit4Tennis-only copy and remove VYLO CTA/link).
- [ ] **1.7** In `components/ui/PartnershipSection.tsx`: Remove the VYLO entry from the partners array.
- [ ] **1.8** In `app/pathway-planner/page.tsx`: Change recommendation text that mentions "consider VYLO" to something else (e.g. high-performance program or /programs/high-performance).
- [ ] **1.9** In `tailwind.config.ts`: Remove `vylo` color entry under `extend.colors` (or leave for legacy if andrew page keeps styling; prefer remove and restyle andrew section).
- [ ] **1.10** Grep for any remaining `vylo`/`VYLO` in `app/`, `components/`, `next.config.js` and fix (docs/archive and README/GA4/VYLO_LANDING_PAGE_SETUP.md can stay as historical or be updated in a follow-up).

### Phase 2: Accessibility Fixes

- [ ] **2.1** **HomeCTAForm**: Add `<label>` for each input (visible or `sr-only`) with `htmlFor` and matching input `id` (e.g. `id="home-cta-name"`). Add a live region for submit errors: e.g. `<div role="alert" aria-live="assertive" className="sr-only or visible text-red-600">` and set state on submit failure; announce error to screen readers.
- [ ] **2.2** **HomeHero**: On the scroll-to-content button, add `min-h-[48px] min-w-[48px]` and ensure padding so the touch target is at least 48×48px (WCAG 2.1).

### Phase 3: Performance / Images

- [ ] **3.1** **Coaches page**: Remove `priority` from the founder portrait Image (andrew-portrait.webp); keep `priority` only on the hero Image (schedules-hero.webp).
- [ ] **3.2** **not-found.tsx**: Add `sizes="100vw"` to the hero `<Image>` (fill + priority).
- [ ] **3.3** **racquet-rescue/page.tsx**: Add `sizes="100vw"` to the hero `<Image>` (fill + priority).
- [ ] **3.4** **junior-trial**: If a WebP version of `junior-program-hero.jpg` exists (e.g. in public), switch `src` to it and keep `sizes="100vw"`. If not, add a short comment that hero should be WebP when asset is available, or leave as-is and document in COMPOUND_LEARN.

### Phase 4: Documentation

- [ ] **4.1** **.cursorrules Part 13**: Update file structure: remove `jtt/page.tsx`; change `programs/adult/page.tsx` description to full pathway (not "Redirects to /schedules"); remove any vylo references from the app tree; add `programs/leagues` or clarify as needed to match current routes.

### Phase 5: Verification

- [ ] **5.1** Run `npm run build` and fix any broken imports or references.
- [ ] **5.2** Run `npm run lint`.
- [ ] **5.3** Grep for `vylo`/`VYLO` in app/, components/, next.config.js and ensure no remaining references (except optional tailwind token if kept).
- [ ] **5.4** Spot-check: homepage (form labels, scroll button), coaches (one priority), not-found and racquet-rescue (hero loads), /vylo and /vylo-apply redirect to /programs/high-performance.

---

## Files to Create/Modify

| File | Action | Purpose |
|------|--------|---------|
| `app/vylo/*` | Delete | Remove VYLO route and assets |
| `app/vylo-apply/*` | Delete | Remove VYLO apply route |
| `app/api/vylo-apply/*` | Delete | Remove VYLO apply API |
| `next.config.js` | Modify | Pro-training → high-performance; vylo/vylo-apply redirects |
| `components/layout/ConditionalLayout.tsx` | Modify | Remove isVYLO branch |
| `app/coaches/andrew-mateljan/page.tsx` | Modify | Remove or replace VYLO section |
| `components/ui/PartnershipSection.tsx` | Modify | Remove VYLO partner |
| `app/pathway-planner/page.tsx` | Modify | Remove "consider VYLO" text |
| `tailwind.config.ts` | Modify | Remove vylo color (or keep and document) |
| `components/HomeCTAForm.tsx` | Modify | Labels + live region for errors |
| `components/HomeHero.tsx` | Modify | 48×48px scroll button |
| `app/coaches/page.tsx` | Modify | Remove priority from founder image |
| `app/not-found.tsx` | Modify | Add sizes to hero Image |
| `app/racquet-rescue/page.tsx` | Modify | Add sizes to hero Image |
| `app/junior-trial/page.tsx` | Modify | WebP hero if asset exists; else comment |
| `.cursorrules` | Modify | Part 13 file structure |

---

## Success Criteria

- [ ] No `/vylo` or `/vylo-apply` routes; both redirect to `/programs/high-performance`.
- [ ] No VYLO references in layout, coaches Andrew page, partnership section, pathway-planner.
- [ ] HomeCTAForm has proper labels and live region for submit errors.
- [ ] HomeHero scroll button has ≥48×48px touch target.
- [ ] Coaches page has exactly one `priority` image (hero only).
- [ ] not-found and racquet-rescue hero Images have `sizes="100vw"`.
- [ ] junior-trial hero WebP if available; otherwise documented.
- [ ] .cursorrules Part 13 matches current app structure (no jtt, adult as pathway, no vylo).
- [ ] `npm run build` and `npm run lint` pass.

---

## Research Sources

- COMPOUND_LEARN.md (project root)
- .cursorrules (Part 8 typography, Part 10 buttons, Part 13 file structure)
- WCAG 2.1 AAA touch target 48×48px, form labels, live regions

---

## Relevant Learnings (from COMPOUND_LEARN.md)

- Homepage form: visible or sr-only `<label>` with `htmlFor`/`id`; live region (`role="alert"`) for submit errors.
- Scroll/CTA: `min-h-[48px] min-w-[48px]` for touch targets.
- One `priority` per page; hero only.
- Fill/priority images: always set `sizes` (e.g. `sizes="100vw"`).
- Junior-trial hero: prefer WebP per .cursorrules.
- .cursorrules Part 13 must match code (adult pathway, no JTT, no vylo).

---

## Risks & Mitigations

| Risk | Mitigation |
|------|------------|
| External links to /vylo or /vylo-apply | Redirect both to /programs/high-performance so bookmarks and old links still work. |
| Andrew coach page looks empty after VYLO block removal | Replace with Fit4Tennis-only or "High Performance" CTA to /programs/high-performance. |
| tailwind vylo-orange used elsewhere | Grep; if only andrew page, remove token and use lbta-orange or brand token; else keep. |

---

## Optional Follow-up (not in scope)

- Update README.md, GA4_INTEGRATION_PLAN.md, VYLO_LANDING_PAGE_SETUP.md to remove or archive VYLO references.
- Add WebP hero for junior-trial when asset is ready (or convert with script).
