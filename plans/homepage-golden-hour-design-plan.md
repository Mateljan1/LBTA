# Homepage Golden Hour Design — Implementation Plan

**Scope:** Adopt the design concept from `LBTA_Golden_Hour_Example.html` on the existing homepage. Keep all current content (homepage-copy.json, sections, CTAs); change visual language and layout feel only.

**Reference:** `/Users/andrew-mac-studio/Desktop/LBTA_UTR_circuit/circuit_polished_ready/LBTA_Golden_Hour_Example.html`

---

## Overview

The Golden Hour example is an editorial, cinematic one-pager: warm paper texture, hero with content bottom-left and golden-hour gradient overlay, animated horizon lines, court-line corner brackets on photos, scroll-reveal animations, full-bleed photo with caption, dark “changeover” stat strip, 50/50 editorial split, and quiet CTA buttons. This plan ports that **design system** (not the copy or structure) onto the current LBTA homepage so it feels like the same brand world while preserving existing sections and content.

---

## Problem Statement

- The current homepage is functional and on-brand but does not yet use the Golden Hour visual language (warm texture, horizon animations, bracket accents, bottom-anchored hero, changeover stat band, editorial splits).
- We want one cohesive “golden hour” feel: warmer background, more editorial typography and spacing, subtle motion (horizon, reveal), and refined CTAs—without rewriting copy or removing sections.

---

## Design Concepts to Port (from Golden Hour Example)

| Concept | Example implementation | Homepage application |
|--------|-------------------------|------------------------|
| **Warm paper texture** | `body::before` radial gradient (sandstone tint) | Add optional warm overlay on body or main wrapper for homepage only (or global if approved). |
| **Hero: content bottom-left** | `.hero-content` at bottom, `justify-content: flex-end`, max-width 600px, left-aligned | HomeHero: move content block to bottom-left, left-align text, reduce max-width of text block. |
| **Golden hour overlay** | Gradient: deep water (top) → sandstone (mid) → deep water (bottom) | Replace or augment hero overlay with warm mid-tone (sandstone/thousand-steps hint) between dark top and bottom. |
| **Scroll indicator** | Line + “Scroll” label, subtle pulse animation | Add scroll line + label below hero CTA; respect `prefers-reduced-motion`. |
| **Animated horizon line** | `.horizon` scaleX(0)→1 on scroll into view | Reuse or extend HorizonDivider; add scroll-triggered scale animation (CSS or Framer Motion). |
| **Court-line brackets** | `.bracket` ::before/::after corner L-shapes (teal) | Optional: add bracket wrapper to 1–2 key images (e.g. founder, one full-bleed). |
| **Scroll reveal** | `.reveal` opacity + translateY, IntersectionObserver | Already have AnimatedSection; ensure timing/easing feels editorial (e.g. 0.8s ease). |
| **Full-bleed photo + caption** | Edge-to-edge image, gradient caption at bottom | One section (e.g. results or destination) as full-bleed with optional caption overlay. |
| **Changeover stat strip** | Dark bg (deep-water), centered stats, bordered cells, Cormorant numbers | Add a stat strip (e.g. “25+ years”, “ATP players”, “D1 placements”) between two sections; use site stats or homepage-copy. |
| **Editorial split** | 50/50 grid, photo left (optional bracket), text right, vertically centered | Founder section already 50/50; optionally add bracket to founder image and tighten typography to match. |
| **Quiet CTA** | `btn-horizon`: border, gradient underline on hover | Add `.btn-horizon` variant: uppercase, letter-spacing, border, gradient line animates in on hover. |
| **Section typography** | Eyebrow (small caps, letter-spacing), Cormorant title, soft body | Align section eyebrows and titles with Golden Hour sizes/weights (already Cormorant + DM Sans). |

---

## Proposed Solution

1. **CSS / globals**
   - Add Golden Hour utility classes to `globals.css` (or a homepage-scoped module): warm overlay optional, `.horizon-animate`, `.bracket`, `.btn-horizon`, gradient overlay vars for hero.
   - Reuse existing tokens: `--deep-water`, `--morning-light`, `--sandstone`, `--pacific-dusk`, `--horizon`. Add optional `--warmwhite` alias for `--morning-light` if used in new classes.
   - All animations respect `prefers-reduced-motion` (existing pattern).

2. **HomeHero**
   - Content: bottom-left alignment, `justify-end`, left-aligned text, max-width ~600px; keep existing copy (eyebrow, tagline, pillars, subline, CTA).
   - Overlay: golden-hour style gradient (deep water top, warm mid, deep water bottom).
   - Scroll cue: add scroll line + “Scroll” text below CTA; link to `#founder` or first section.

3. **HorizonDivider**
   - Optional: animate horizon line on scroll into view (scaleX 0→1), 1.4s ease; only when not `prefers-reduced-motion`.

4. **Sections (founder, results, philosophy, programs, etc.)**
   - Keep all sections and content.
   - Apply editorial spacing and typography tweaks (section-narrow where appropriate, eyebrow/title/body hierarchy).
   - Optionally: one full-bleed image block with gradient caption; one “changeover” stat strip using `site-stats` or new homepage stats.
   - Optional: add `.bracket` to founder image container.

5. **CTA buttons**
   - Add secondary style `.btn-horizon`: bordered, gradient underline on hover; use for “Read Andrew’s Story”, “View Programs”, etc., where appropriate.
   - Keep primary CTA (Book a Trial) as solid per .cursorrules.

6. **No content changes**
   - Do not add or remove sections; do not change copy in `homepage-copy.json` except if a small stat strip label is added there.

---

## Implementation Steps

### Phase 1: CSS and design tokens

- [ ] **1.1** In `app/globals.css`, add optional warm overlay (e.g. `.home-golden-hour body::before` or a wrapper class) radial gradient (sandstone tint, low opacity). Make it scoped to homepage only (e.g. body class from layout or page wrapper).
- [ ] **1.2** Add utility classes: `.horizon-animate` (for scroll-triggered scaleX), `.bracket` (corner L-shapes using Victoria Cove or teal), `.btn-horizon` (border + gradient underline on hover). Ensure they use existing brand tokens and respect reduced motion.
- [ ] **1.3** Document hero overlay gradient: define a “golden hour” overlay (e.g. CSS custom property or Tailwind-compatible gradient) that goes deep-water → sandstone/warm → deep-water for use in HomeHero.

### Phase 2: Hero (HomeHero)

- [ ] **2.1** Change hero content layout to bottom-left: flex `justify-end`, content aligned to start (left), max-width ~600px, padding consistent with example (e.g. 48px sides, 80px bottom).
- [ ] **2.2** Replace or layer hero overlay with golden-hour gradient (top dark, mid warm, bottom dark).
- [ ] **2.3** Add scroll indicator: vertical line + “Scroll” label below primary CTA; scroll target `#founder`; respect reduced motion (no pulse or subtle static).
- [ ] **2.4** Keep video (or poster if video not used), existing copy, and primary “Book a Trial” CTA; ensure contrast (solid CTA background) per .cursorrules.

### Phase 3: Horizon and section rhythm

- [ ] **3.1** HorizonDivider: add optional scroll-in animation (scaleX 0→1) when section enters viewport; gate on `prefers-reduced-motion`.
- [ ] **3.2** Tighten section spacing/typography on homepage to feel editorial: section-narrow where appropriate, consistent eyebrow/title/body from Golden Hour example (sizes/weights already aligned with Cormorant + DM Sans).

### Phase 4: Stat strip and full-bleed (optional)

- [ ] **4.1** Add a “changeover” stat strip section: dark background (deep-water), 3–4 stats (e.g. from site-stats or homepage-copy), Cormorant numbers, small caps labels, bordered cells. Place between two existing sections (e.g. after founder, before results).
- [ ] **4.2** Optionally convert one section (e.g. results or destination) to full-bleed image with bottom gradient caption; keep existing headline/subline in caption or overlay.

### Phase 5: Bracket and CTA refinements

- [ ] **5.1** Optionally add `.bracket` wrapper to founder image on homepage (corner accents).
- [ ] **5.2** Introduce `.btn-horizon` and use for secondary CTAs (e.g. “Read Andrew’s Story”, “View All Programs”) where it fits; keep primary CTAs solid.

### Phase 6: Validation and polish

- [ ] **6.1** Test at 320px, 375px, 768px, 1024px, 1440px; no horizontal scroll; touch targets ≥48px.
- [ ] **6.2** Verify reduced motion: horizon animation and scroll pulse disabled when `prefers-reduced-motion: reduce`.
- [ ] **6.3** Contrast: hero CTA and all text on dark areas meet 7:1 where required; footer/dark sections use text-white/50+.

---

## Files to Create/Modify

| File | Action | Purpose |
|------|--------|---------|
| `app/globals.css` | Modify | Golden Hour utilities: warm overlay, .horizon-animate, .bracket, .btn-horizon; reduced-motion gates. |
| `components/HomeHero.tsx` | Modify | Bottom-left content, golden hour overlay, scroll indicator. |
| `components/ui/HorizonDivider.tsx` | Modify | Optional scroll-triggered scaleX animation. |
| `app/page.tsx` | Modify | Optional: add stat strip section; add bracket to founder image; apply btn-horizon to secondary CTAs; optional body/wrapper class for warm overlay. |
| `data/homepage-copy.json` | Modify (optional) | Only if adding stat strip labels. |
| `data/site-stats.json` | Read | Source for stat strip numbers. |

---

## Success Criteria

- [ ] Homepage visually reflects Golden Hour concept: warm feel, hero content bottom-left, horizon and optional bracket accents, editorial spacing.
- [ ] All existing homepage content and sections remain; no copy removed or replaced except optional stat labels.
- [ ] Primary CTA remains solid (e.g. white on dark) per .cursorrules; secondary CTAs can use btn-horizon.
- [ ] Reduced motion respected for all new animations.
- [ ] Responsive and accessible (contrast, focus, touch targets); no horizontal scroll.
- [ ] Build and lint pass.

---

## Research Sources

- LBTA Golden Hour Example: `Desktop/LBTA_UTR_circuit/circuit_polished_ready/LBTA_Golden_Hour_Example.html`
- Project: `.cursorrules` (typography, color tokens, accessibility, CTA rules)
- Existing: `app/globals.css` (--horizon, .section-horizon, .section-quote), `components/HomeHero.tsx`, `components/ui/HorizonDivider.tsx`

---

## Relevant Learnings

- **Brand:** Primary CTAs black/white; no orange/red primary buttons; Sunset Cliff for hover/accent only. Hero CTA on dark must have solid background for 7:1.
- **Motion:** All animations must respect `prefers-reduced-motion` (AnimatedSection, parallax patterns already in codebase).
- **Data:** Single source of truth for copy in `data/homepage-copy.json`; do not hardcode new copy in components.
- **Sections:** Section spacing and container patterns in .cursorrules (padding, container-lbta, section-lg).

---

## Risks & Mitigations

| Risk | Mitigation |
|------|------------|
| Warm overlay affects other pages | Scope overlay to homepage (body class or layout wrapper for home route only). |
| Horizon animation conflicts with existing HorizonDivider | Implement as optional modifier class (e.g. `horizon-animate`) so existing usage unchanged. |
| Stat strip duplicates site-stats | Use site-stats or one new optional block in homepage-copy; keep one source. |

---

## Out of Scope

- Changing coaches page or any other page.
- Rewriting homepage copy (only design and layout).
- Adding new sections beyond one optional stat strip.
- Replacing video hero with image unless product decision.
