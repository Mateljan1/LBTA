# LBTA Design Alignment + Polish Implementation Plan

## Overview

Align the live LBTA site with the intended design and then run a full polish pass so the site is the best it can be: header wordmark and nav, hero/intro copy, program card labels, “Why Choose” section, footer “JOIN OUR COMMUNITY,” newsletter and CTA styling, correct logo usage site-wide, then performance, accessibility, images, and forms polish—all while respecting .cursorrules (single source of truth, brand tokens, no forbidden copy).

## Problem Statement

The current build diverges from the design in header (no “The Academy” wordmark, nav differs, CTA black/white vs orange), hero/intro (founder-first vs “THE LAGUNA BEACH TENNIS ACADEMY” + bullets), program cards (“Junior Pathway” vs “Junior Programs,” etc.), missing “Why Choose Laguna Beach Tennis Academy” with two images, destination band copy, footer (“Join the LBTA Community” only in newsletter strip vs “JOIN OUR COMMUNITY” above social/links), and CTA form (name+email+phone on sunset vs design’s name+email). Logos must be correct site-wide (paths, alt text, header/footer/partners). Resolving these will make the live site match design and ensure consistency for future work.

## Proposed Solution

- **Header:** Add “The Academy” wordmark next to logo; optionally add HOME link and CAMP (top-level or under Programs); decide CTA: keep black/white per .cursorrules or document exception for orange; standardize logo source (local `/logos/` preferred over external URL).
- **Copy:** Intro block “THE LAGUNA BEACH TENNIS ACADEMY” + body + bullets; dark band “MORE → LESSONS, CAMPS & CLINICS” (or retain current if approved); program cards: “Junior Programs,” “Adult Programs,” “Private Coaching”; add “Why Choose Laguna Beach Tennis Academy” section with two images; footer add “JOIN OUR COMMUNITY” above social/links.
- **Layout:** Implement “Why Choose” with two-image layout; confirm newsletter placement (sunset vs footer) and form fields (Name+Email vs email-only) per product decision.
- **Colors:** Use `brand-*` tokens from globals/.cursorrules; document CTA color decision in one place.
- **Logos:** Audit and fix all logo paths (header, footer, PartnershipSection); ensure descriptive alt text; prefer `public/logos/` filenames (e.g. LBTAblktext.png, LBTAwhttext.png, racketrescue.png).

Single source of truth for programs/pricing remains `/schedules` and `/data/*.json`; no hardcoded prices; no duplicate content across pages.

## Implementation Steps

### Phase 1: Foundation and decisions

- [ ] 1.1: Document CTA color decision (black/white vs orange) in .cursorrules or design doc and apply consistently to header CTA and key CTAs.
- [ ] 1.2: Audit all logo usage: Header, Footer, PartnershipSection, any other components; list current paths and alt text; confirm `public/logos/` filenames (LBTAblktext.png, LBTAwhttext.png, racketrescue.png, etc.).
- [ ] 1.3: Add “The Academy” wordmark to Header (next to logo); ensure logo uses local path (e.g. `/logos/LBTAblktext.png` or equivalent) unless external URL is required.
- [ ] 1.4: Add HOME link and CAMP to nav (CAMP top-level or under Programs per product decision).

### Phase 2: Home page copy and structure

- [ ] 2.1: Hero: Ensure tagline “tennis, as it should be taught.” (or approved variant); intro block: headline “THE LAGUNA BEACH TENNIS ACADEMY” + body copy + bullets as per design.
- [ ] 2.2: Dark band: Set copy to “MORE → LESSONS, CAMPS & CLINICS” or keep current; use brand background (e.g. deep-water).
- [ ] 2.3: Pathway cards: Rename to “Junior Programs,” “Adult Programs,” “Private Coaching”; keep links/destinations unchanged; preserve data-driven content where applicable.
- [ ] 2.4: Add “Why Choose Laguna Beach Tennis Academy” section with two images; copy and image paths from design or content source.
- [ ] 2.5: Destination band: Set to design copy or keep “Train where focus meets horizon.” per decision.
- [ ] 2.6: CTA on sunset: Align form fields with decision (Name + Email vs Name + Email + Phone); use HomeCTAForm; style per brand (black/white or sunset-cliff per CTA decision).

### Phase 3: Footer and newsletter

- [ ] 3.1: Add “JOIN OUR COMMUNITY” above footer social/links block (in addition to or replacing current newsletter strip headline as needed).
- [ ] 3.2: Newsletter: If design specifies Name + Email in footer, extend NewsletterForm to support name field; otherwise keep email-only and document.
- [ ] 3.3: Footer logo: Use `/logos/LBTAblktext.png` (or inverted asset) with correct alt text.

### Phase 4: Logos and polish

- [ ] 4.1: Replace any external logo URL in Header with local `/logos/` path and add fallback if needed.
- [ ] 4.2: PartnershipSection: Confirm `/logos/racketrescue.png` and any other partner logos; alt text descriptive (e.g. “Racquet Rescue”).
- [ ] 4.3: Run responsive check at 320, 375, 768, 1024, 1440; fix any layout or overflow issues.
- [ ] 4.4: Verify no forbidden copy (no “maximize,” “elite,” “Sign up now!,” etc.); contrast and focus states per .cursorrules.

### Phase 5: Polish and verification (best upgrade)

- [ ] 5.1: **Performance:** Lighthouse on homepage (target ≥90 all categories); LCP &lt; 2.5s, CLS &lt; 0.1; hero/above-fold images use `priority`, rest `loading="lazy"`; fix any critical issues.
- [ ] 5.2: **Accessibility:** 7:1 contrast on text; 48×48px min touch targets on mobile; keyboard nav and visible focus (2px ring); `prefers-reduced-motion` respected; alt &lt; 125 chars on all images.
- [ ] 5.3: **Images:** Hero/above-fold WebP with `sizes`; no image &gt; ~350KB without optimization; “Why Choose” and card images have descriptive alt.
- [ ] 5.4: **Forms:** CTA and newsletter forms have clear validation and success/error states; no jarring layout shift on submit.
- [ ] 5.5: **Copy pass:** One full sweep for forbidden words and tone; consistency with founder voice (calm, confident).
- [ ] 5.6: **Build and lint:** `npm run build` and `npm run lint` clean; no horizontal scroll at any breakpoint.

## Upgrades beyond design alignment (optional / post-launch)

- **Micro-interactions:** Subtle hover/focus on cards and buttons (already in .cursorrules); add only if time.
- **SEO/schema:** Confirm key pages have correct meta and JSON-LD (`app/schema.tsx`); no duplicate or thin content.
- **Error and empty states:** 404 and form error messages on-brand; no generic browser defaults where avoidable.
- **Loading states:** Skeleton or minimal loading for any async UI (e.g. modals) so CLS stays low.

## Files to Create/Modify

| File | Action | Purpose |
|------|--------|---------|
| `components/layout/Header.tsx` | Modify | Wordmark, logo path, nav (HOME, CAMP), CTA style |
| `components/layout/Footer.tsx` | Modify | “JOIN OUR COMMUNITY,” logo path, newsletter placement/headline |
| `components/HomeHero.tsx` | Modify | Tagline, intro block (headline + body + bullets) |
| `app/page.tsx` | Modify | Dark band copy, pathway card labels, add “Why Choose” section, destination band, CTA form section |
| `components/HomeCTAForm.tsx` | Modify | Optional: field set (name/email vs name/email/phone) per decision |
| `components/NewsletterForm.tsx` | Modify | Optional: add name field if footer design requires |
| New component (e.g. `WhyChooseSection.tsx`) | Create | “Why Choose Laguna Beach Tennis Academy” with two images |
| `app/globals.css` or design tokens | Modify | Only if CTA color or token change decided |
| `.cursorrules` | Modify | Optional: document CTA color and logo source decisions |

## Success Criteria

**Design alignment**

- [ ] Header shows “The Academy” wordmark and logo; nav includes agreed items (e.g. HOME, CAMP); CTA matches decided style.
- [ ] Hero and intro use design copy (“THE LAGUNA BEACH TENNIS ACADEMY” + bullets); dark band and destination band match design or documented choice.
- [ ] Pathway cards labeled “Junior Programs,” “Adult Programs,” “Private Coaching.”
- [ ] “Why Choose Laguna Beach Tennis Academy” section present with two images.
- [ ] Footer shows “JOIN OUR COMMUNITY” above social/links; footer logo correct.
- [ ] All logos from `public/logos/` with correct paths and descriptive alt text; no broken images.
- [ ] No hardcoded prices; no duplicate program content; single source of truth preserved.

**Polish and verification**

- [ ] Lighthouse ≥90 (Performance, Accessibility, Best Practices, SEO); LCP &lt; 2.5s, CLS &lt; 0.1.
- [ ] Contrast 7:1, touch targets ≥48px, keyboard/focus and reduced-motion respected.
- [ ] Forms have clear validation and success/error states; no forbidden copy in sweep.
- [ ] `npm run build` and `npm run lint` pass; no horizontal scroll at 320–1440px.

## Research Sources

- Conversation summary (design vs build gaps)
- Project `.cursorrules` (brand, typography, colors, forbidden copy, data rules)
- `app/globals.css` (brand tokens)
- `components/layout/Header.tsx`, `Footer.tsx`, `app/page.tsx` (current structure)

## Relevant Learnings

- Prefer `brand-*` over `lbta-*` for new code; CTAs black/white unless an exception is documented.
- Single source of truth: `/schedules` and `/data/*.json`; no prices in components.
- Typography: Cormorant + DM Sans; no Inter, Space Grotesk, etc.
- PartnershipSection already uses `/logos/racketrescue.png`; filename in repo is `racketrescue.png`.

## Risks & Mitigations

| Risk | Mitigation |
|------|------------|
| Orange CTA conflicts .cursorrules | Document explicit product decision; if orange, use `brand-sunset-cliff` and note in .cursorrules. |
| “Why Choose” images missing | Use placeholders or existing assets; add image paths to data or env if needed. |
| Nav bloat on mobile | Keep mobile nav compact; CAMP can live under Programs on small screens. |
| Logo path breaks (external → local) | Use same filename in `public/logos/`; verify build and dev serve. |

---

## Execution checklist (for `/compound:work`)

1. Resolve CTA color and document.
2. Logo audit and fix paths/alt.
3. Header: wordmark + nav + CTA.
4. Home: hero/intro, dark band, cards, “Why Choose,” destination, CTA form.
5. Footer: “JOIN OUR COMMUNITY,” logo, newsletter.
6. Responsive and a11y pass.
7. Build and lint.
