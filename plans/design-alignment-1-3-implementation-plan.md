# Design Alignment Items 1–3 — Implementation Plan

## Overview

Execute the first three items from **design-alignment-whats-left.md**: (1) program card copy, (2) footer “JOIN OUR COMMUNITY” heading, (3) “Why Choose Laguna Beach Tennis Academy” section with two image slots.

## Implementation Steps

### Step 1: Copy — Program card labels
- [x] In `data/homepage-copy.json`, under `programs.items`, set:
  - `"Junior Pathway"` → `"Junior Programs"`
  - `"Adult Training"` → `"Adult Programs"`
  - Keep `"Private Coaching"` as-is.
- [x] No component changes; page already reads from JSON.

### Step 2: Footer — “JOIN OUR COMMUNITY”
- [x] In `components/layout/Footer.tsx`, between `<NewsletterForm />` and the main footer grid (`<div className="container-lbta py-16...">`), add a heading:
  - Semantic: `<h2 className="...">JOIN OUR COMMUNITY</h2>` with `className` for visual style (e.g. text-center, text-eyebrow or font-headline, text-white/80, padding).
  - Ensure the heading is inside the footer, before the grid that contains logo + nav.
- [x] Per .cursorrules: footer text on deep-water at least text-white/50; use text-white/80 for the heading.

### Step 3: Why Choose section
- [x] **Data:** In `data/homepage-copy.json`, add a `whyChoose` key:
  - `headline`: "Why Choose Laguna Beach Tennis Academy"
  - `subline`: Short body (calm, on-brand).
  - `image1`, `image2`: paths (placeholders until assets exist), e.g. `/images/why-choose/why-choose-1.webp`, `why-choose-2.webp`.
  - `image1Alt`, `image2Alt`: descriptive alt text.
- [x] **Page:** In `app/page.tsx`, add a new section (e.g. after Programs, before Destination) that:
  - Reads `homepageCopy.whyChoose`.
  - Renders headline, subline, and two images via `next/image` with `sizes` and `alt` from JSON.
  - Uses existing patterns (AnimatedSection, container-lbta, brand tokens).
- [x] **Image spec:** In `plans/image-spec-best-in-class.md`, add two rows under §10 or §4 for Why Choose images (aspect 4∶3 or 16∶9, ≤200–250KB WebP).

## Files to Create/Modify

| File | Action | Purpose |
|------|--------|---------|
| `data/homepage-copy.json` | Modify | Program labels; add `whyChoose` block |
| `components/layout/Footer.tsx` | Modify | Add “JOIN OUR COMMUNITY” heading |
| `app/page.tsx` | Modify | Add Why Choose section |
| `plans/image-spec-best-in-class.md` | Modify | Add two Why Choose image slots |

## Success Criteria

- [x] Program cards on homepage show “Junior Programs”, “Adult Programs”, “Private Coaching”.
- [x] Footer shows “JOIN OUR COMMUNITY” above the main footer block.
- [x] “Why Choose Laguna Beach Tennis Academy” section exists with headline, subline, two image placeholders (can 404 until assets added).
- [x] `npm run build` and `npm run lint` pass.
- [x] No hardcoded copy; Why Choose copy and image paths from JSON.

## Risks & Mitigations

| Risk | Mitigation |
|------|------------|
| Why Choose images 404 | Use placeholder paths in JSON; image spec documents required assets; user adds files later. |
| Section order | Place Why Choose after Programs, before Destination. |
