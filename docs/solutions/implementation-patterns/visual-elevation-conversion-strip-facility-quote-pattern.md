---
title: Visual elevation Phases 5–9 — conversion strip, facility block, quote-over-image
slug: visual-elevation-conversion-strip-facility-quote-pattern
category: implementation-patterns
tags:
  - visual-elevation
  - legacy-assets
  - horizon-divider
  - accessibility
  - book
  - about
  - facility
  - philosophy
status: completed
date: 2026-03-19
related_files:
  - plans/visual-elevation-legacy-assets-plan.md
  - app/book/page.tsx
  - app/about/page.tsx
  - components/ui/PhotoVideoGallery.tsx
  - public/legacy-working-assets/README.md
---

# Visual elevation Phases 5–9 — conversion strip, facility block, quote-over-image

## Overview

Phases 5–9 of the visual elevation plan required wiring legacy asset sections (Book conversion strip, About facility block, About philosophy quote-over-image) with consistent patterns: `next/image` with `sizes` and `quality`, accessible section landmarks (`aria-labelledby`, sr-only headings), brand tokens, and HorizonDivider. This doc captures the working patterns so future legacy sections stay consistent and discoverable.

---

## Solution

**Root cause / why this approach**  
Visual elevation needed predictable, high-quality imagery without scattering paths or duplicating patterns. Wiring **legacy-working-assets** as the single source gives stable paths (`/legacy-working-assets/{category}/{slot}/{slot}.webp`), so sections stay consistent and README/plan can list "wired" slots. Reusing the same patterns—**HorizonDivider** above/below sections, **aria-labelledby** + **sr-only** or visible headings, **next/image** with explicit `sizes` and `quality={90}`—keeps accessibility (screen readers, contrast), performance (LCP, CLS), and brand (luxury restraint, no inline styles).

**Working solution (step-by-step with snippets)**

1. **Conversion strip (Book page)**  
   Section with sr-only heading, HorizonDivider above/below, three legacy images in a responsive grid, each image in a wrapper with aspect and `next/image` (fill, sizes, quality).

```tsx
<HorizonDivider />
<section className="bg-brand-sandstone py-10 md:py-14" aria-labelledby="expect-strip-heading">
  <h2 id="expect-strip-heading" className="sr-only">What to expect when you book</h2>
  <div className="max-w-[1200px] mx-auto px-4 md:px-6">
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-6">
      {[
        { src: '/legacy-working-assets/conversion/book-expect-1/book-expect-1.webp', alt: 'Personalized conversation about your goals' },
        { src: '/legacy-working-assets/conversion/book-expect-2/book-expect-2.webp', alt: 'Free assessment with your coach' },
        { src: '/legacy-working-assets/conversion/book-expect-3/book-expect-3.webp', alt: 'Clear path forward and next steps' },
      ].map((img, i) => (
        <div key={i} className="relative aspect-[16/10] overflow-hidden rounded-subtle">
          <Image src={img.src} alt={img.alt} fill className="object-cover" sizes="(max-width: 640px) 100vw, 33vw" quality={90} />
        </div>
      ))}
    </div>
  </div>
</section>
<HorizonDivider />
```

2. **Facility section (About page)**  
   `id="facility"` for deep links; `aria-labelledby="facility-heading"`; one featured image (md:col-span-2, aspect 16/10 → 2/1) and two smaller 4/3 images in a nested grid.

```tsx
<section id="facility" className="bg-brand-morning-light py-20 md:py-28" aria-labelledby="facility-heading">
  <div className="max-w-[1400px] mx-auto px-6 md:px-16">
    <h2 id="facility-heading" className="font-headline text-[32px] md:text-[44px] ...">Where We Train</h2>
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
      <div className="md:col-span-2 relative aspect-[16/10] md:aspect-[2/1] overflow-hidden rounded-subtle">
        <Image src="/legacy-working-assets/facility/sunset-courts/sunset-courts.webp" alt="..." fill className="object-cover" sizes="(max-width: 768px) 100vw, 66vw" quality={90} />
      </div>
      <div className="grid grid-cols-2 md:grid-cols-1 gap-4 md:gap-6">
        <div className="relative aspect-[4/3] overflow-hidden rounded-subtle">
          <Image src="/legacy-working-assets/facility/courts-lbhs/courts-lbhs.webp" alt="..." fill className="object-cover" sizes="(max-width: 768px) 50vw, 33vw" quality={90} />
        </div>
        <div className="relative aspect-[4/3] overflow-hidden rounded-subtle">
          <Image src="/legacy-working-assets/facility/courts-moulton/courts-moulton.webp" alt="..." fill className="object-cover" sizes="(max-width: 768px) 50vw, 33vw" quality={90} />
        </div>
      </div>
    </div>
  </div>
</section>
```

3. **Philosophy quote-over-image (About page)**  
   Full-bleed background image (andrew-portrait), overlay for contrast, section labelled by the blockquote id; quote and attribution in white.

```tsx
<section className="relative py-24 md:py-32 overflow-hidden" aria-labelledby="philosophy-quote-heading">
  <div className="absolute inset-0">
    <Image src="/legacy-working-assets/founder/andrew-portrait/andrew-portrait.webp" alt="" fill className="object-cover" sizes="100vw" quality={90} />
    <div className="absolute inset-0 bg-brand-deep-water/75" />
  </div>
  <div className="relative z-10 max-w-[900px] mx-auto px-6 md:px-16 text-center">
    <blockquote id="philosophy-quote-heading" className="font-headline text-[28px] md:text-[40px] font-medium text-white ...">
      &ldquo;Structure creates confidence...&rdquo;
    </blockquote>
    <p className="font-sans text-[14px] text-white/80">— Andrew Mateljan, Founder</p>
  </div>
</section>
```

**Completion**  
README and plan updated with wired asset slots (e.g. conversion/book-expect-1–3, facility/sunset-courts, courts-lbhs, courts-moulton, founder/andrew-portrait) and completion notes so future phases can reuse the same legacy paths and section patterns.

---

## Related documentation and references

### Existing `docs/solutions` files

| File | Title |
|------|--------|
| `docs/solutions/ui-bugs/court-flyer-print-clipping-and-logo-balance.md` | Court flyer print clipping and header logo balance |
| `docs/solutions/ui-bugs/header-nav-low-contrast-over-hero.md` | Header nav low contrast over full-bleed hero |

### Plans and docs that reference this work

| Document | Reference |
|----------|------------|
| `plans/visual-elevation-legacy-assets-plan.md` | Main plan: legacy assets, layout/vibe, facility block, conversion strip, quote-over-image |
| `plans/visual-elevation-phase-3-4-security-performance-review.md` | Security/performance review; `legacy-working-assets` and `localPatterns` |
| `plans/homepage-media-brief.md` | Homepage media brief; wiring slots |
| `public/legacy-working-assets/README.md` | "Wired on site (visual elevation plan)" table |
| `components/sections/SplitSection.tsx`, `MasonryGrid.tsx`, `ZigzagSection.tsx` | Layout primitives used elsewhere with legacy paths |
| `next.config.js` | `images.localPatterns` includes `/legacy-working-assets/**` |

---

## Best practices / prevention

- **Images:** Use `next/image` only. Require `alt` (descriptive, &lt;125 chars), `sizes` (e.g. `(max-width: 768px) 100vw, 50vw`), and `quality={90}`. LCP/hero images use `priority`; below-fold use default lazy.
- **Image-only strips (e.g. Book conversion strip):** Provide an `sr-only` heading (e.g. "What to expect") and give the strip container `aria-labelledby` pointing to that heading so screen readers get context.
- **Section structure:** Use `HorizonDivider` or `.section-horizon` under key headings per Brand Guide. Keep pull quotes in `.section-quote` (gradient left edge).
- **Backgrounds:** Stick to brand surfaces: `bg-brand-sandstone`, `bg-brand-morning-light`, dark hero/overlays with `bg-brand-deep-water` (or overlay). Max 3 colors per section.
- **Legacy slots:** For every new legacy asset section, document the wired slot (path, purpose, source) in the legacy README (e.g. under `public/legacy-working-assets/README.md`) so future updates know what to replace.
- **Responsive:** Design for 320px and 375px first; avoid horizontal scroll. Use the project spacing scale (e.g. section padding 80px→120px→160px by breakpoint).

## Optional test cases / checks

- **Layout:** No horizontal scroll at 320px and 375px (manual or snapshot).
- **Build:** `npm run build` passes.
- **Lint:** `npm run lint` passes.
- **Assets:** All image paths used in new sections exist under `public/` (or `legacy-working-assets`); no 404s for strip/facility/philosophy images.
- **A11y:** Each image-only strip has a focusable or programmatically associated `sr-only` heading and correct `aria-labelledby`; one quick pass with axe or similar.
- **Brand:** New sections use only `brand-*` (or allowed `lbta-*`) tokens; no raw hex or extra palette colors.
