# Coaches Page Overhaul — Implementation Plan

## Overview

Make the LBTA coaches page more powerful, maintainable, and on-brand by introducing a single source of truth for coach data, extracting sections into reusable components, improving UX (anchor nav, animations, schema), and fixing existing bugs. The result is a scalable, luxury-aligned team page that matches compound learnings and brand guide.

## Problem Statement

- **Data**: Coach content (bios, credentials, images, slugs) is duplicated between the coaches listing page and individual bio pages; schema is hand-maintained. Adding or updating a coach requires edits in multiple places.
- **Maintainability**: The coaches page is a single ~430-line file with inline data. No `components/coaches/` or `data/coaches.json`; future growth (more coaches, filters, or sections) will bloat the file.
- **UX**: No in-page navigation for long content; hero parallax may not respect `prefers-reduced-motion`; Robert’s featured section still references `robert.webp` instead of `robert-lebuhn.png`.
- **Impact**: The page does not yet feel “much better and powerful” — it lacks a clear data story, entrance polish, and optional trust elements (e.g. combined experience, quick-scan specializations).

## Proposed Solution

1. **Single source of truth**: Add `data/coaches.json` (and optionally `lib/coaches-data.ts`) so the listing page, schema, and bio pages all consume the same coach records. No hardcoded arrays in the page.
2. **Component extraction**: Create `components/coaches/` with `CoachesHero`, `FounderSection`, `CoachingTeamSection`, `CoachCard`, `CoachesCTA`, and a barrel `index.ts`. Page becomes a composition layer.
3. **UX upgrades**: Optional in-page anchor nav (e.g. Leadership | Team | Book); AnimatedSection (or equivalent) on key blocks with reduced-motion gate; ensure hero parallax respects `prefers-reduced-motion`; fix Robert image path.
4. **Schema & SEO**: Derive JSON-LD from coach data; add `url` for each coach to bio page; keep ItemList + Person structure.
5. **Polish**: Consistent “View full bio” affordance (e.g. link with arrow, 48px touch target); optional trust line (“100+ years combined experience” from data); use `.section-quote` / PullQuote for any quote blocks per brand guide.

## Implementation Steps

### Phase 1: Data layer and bug fix

- [x] **1.1** Create `data/coaches.json` with one array of coaches. Each record: `slug`, `name`, `title`, `specialization`, `bio`, `quote`, `credentials[]`, `image`, `imagePosition`, `availability` (optional), `role` (`founder` | `lead` | `program`), `schemaDescription`, `order`. Include Andrew, Robert, Michelle, Peter, Allison. Match existing copy and image paths (use `robert-lebuhn.png` for Robert everywhere).
- [x] **1.2** Add `lib/coaches-data.ts`: `getCoaches()`, `getCoachBySlug(slug)`, `getCoachesForSchema()`. Export typed interfaces. No hardcoded coach arrays in components.
- [x] **1.3** Fix coaches page: In the Robert featured section, change `src="/images/coaches/robert.webp"` to `src="/images/coaches/robert-lebuhn.png"` so it matches the lead data and bio page.

### Phase 2: Component extraction

- [x] **2.1** Create `components/coaches/CoachesHero.tsx`: Hero with background image, parallax (gated by `prefers-reduced-motion`), eyebrow, headline, subline. Accept optional props or read from `homepage-copy.json` / coaches data if you add a “coaches” key.
- [x] **2.2** Create `components/coaches/FounderSection.tsx`: Founder block (image, quote overlay, name link, bio paragraphs, credentials). Data from `getCoaches()` filtered by `role: 'founder'`.
- [x] **2.3** Create `components/coaches/CoachCard.tsx`: Single coach card (image, title, name, specialization, availability, bio snippet, credentials, “View full bio” link when slug present). Used for both lead (Robert) and program grid.
- [x] **2.4** Create `components/coaches/CoachingTeamSection.tsx`: Section title (“Meet the Team”), one featured lead card (Robert), then grid of program coaches using `CoachCard`. Data from `getCoaches()`.
- [x] **2.5** Create `components/coaches/CoachesCTA.tsx`: DarkSection with “Train With Us”, copy, Book Trial + View Programs buttons. Reuse existing CTA block.
- [x] **2.6** Add `components/coaches/index.ts` with named exports for all of the above.
- [x] **2.7** Refactor `app/coaches/page.tsx`: Import schema from `getCoachesForSchema()`; render `<CoachesHero />`, `<HorizonDivider />`, `<FounderSection />`, `<HorizonDivider />`, `<CoachingTeamSection />`, `<HorizonDivider />`, `<CoachesCTA />`, `<StickyCTA />`. Remove inline coach arrays and section JSX. Target: page file &lt; 120 lines.

### Phase 3: Anchor nav and motion

- [x] **3.1** (Optional) Add `components/coaches/CoachesAnchorNav.tsx`: Sticky nav with links to `#leadership`, `#team`, `#book`; section ids and `scroll-mt-*`; `aria-label="Jump to section"`; smooth scroll gated by `prefers-reduced-motion`. Only render if sections have ids.
- [x] **3.2** In `CoachesHero`, gate parallax: `const prefersReducedMotion = typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches`; when true, do not apply `translateY` (or use 0). Align with COMPOUND_LEARN and .cursorrules.
- [x] **3.3** Wrap FounderSection and CoachingTeamSection content (or key blocks) in `AnimatedSection` where it improves perceived quality; ensure AnimatedSection respects reduced motion if it uses duration.

### Phase 4: Schema and SEO

- [x] **4.1** Generate JSON-LD in page (or a small `CoachesSchema` component) from `getCoachesForSchema()`. Include for each Person: `name`, `jobTitle`, `description`, `image` (absolute URL), `url` (e.g. `https://lagunabeachtennisacademy.com/coaches/robert-lebuhn`). Keep ItemList wrapper.
- [x] **4.2** Ensure metadata (title, description) for the coaches page remains strong; consider `metadataBase` for image URLs in schema.

### Phase 5: Polish and optional trust

- [ ] **5.1** “View full bio”: Use a proper link with visible focus ring, optional arrow icon (aria-hidden), and `min-h-[48px]` / padding so the card CTA meets touch target. Ensure decorative icons have `aria-hidden="true"` per quality-bars.
- [x] **5.2** (Optional) Add a short trust line above or below “Meet the Team”, e.g. “100+ years of combined coaching experience” — value derived from coach data or from `data/site-stats.json` if you add a `coaches` key. Single source; no hardcoded number in component.
- [x] **5.3** Any quote in FounderSection or CoachCard that is a blockquote use `PullQuote` or `.section-quote` per brand guide and COMPOUND_LEARN.

## Files to Create/Modify

| File | Action | Purpose |
|------|--------|---------|
| `data/coaches.json` | Create | Single source for all coach content and order |
| `lib/coaches-data.ts` | Create | getCoaches, getCoachBySlug, getCoachesForSchema; types |
| `components/coaches/CoachesHero.tsx` | Create | Hero with parallax (reduced-motion safe) |
| `components/coaches/FounderSection.tsx` | Create | Founder block driven by data |
| `components/coaches/CoachCard.tsx` | Create | Reusable coach card (lead + grid) |
| `components/coaches/CoachingTeamSection.tsx` | Create | Section + featured Robert + grid |
| `components/coaches/CoachesCTA.tsx` | Create | Dark CTA section |
| `components/coaches/CoachesAnchorNav.tsx` | Create | Optional in-page nav |
| `components/coaches/index.ts` | Create | Barrel exports |
| `app/coaches/page.tsx` | Modify | Compose components; use coaches-data; fix Robert image; schema from data |
| `app/coaches/[slug]/page.tsx` | Optional | Dynamic bio route using getCoachBySlug (if you want one dynamic page instead of four static bio pages) |

## Success Criteria

- [ ] All coach content and schema derive from `data/coaches.json` and `lib/coaches-data.ts`; no duplicate coach arrays in page or components.
- [ ] Coaches page builds and renders correctly; Robert’s image is `robert-lebuhn.png` everywhere it appears.
- [ ] Hero parallax is gated by `prefers-reduced-motion`; no motion when user prefers reduced motion.
- [ ] JSON-LD includes `url` for each coach; ItemList structure preserved.
- [ ] Page file is under ~120 lines; sections live in `components/coaches/`.
- [ ] Lint passes; no new violations of COMPOUND_LEARN (brand tokens, section-quote, aria-hidden, 48px targets).
- [ ] Optional: Anchor nav and trust line implemented if scope allows.

## Research Sources

- COMPOUND_LEARN.md: single source of truth, section-quote, parallax reduced-motion, decorative SVG aria-hidden, page composition pattern.
- .cursorrules: brand tokens, typography, HorizonDivider, PullQuote, 48px touch targets, luxury restraint.
- Quality-bars: dataIntegrity, parallaxReducedMotion, pullQuoteSectionQuote, decorativeSvgAriaHidden.
- Web: luxury sports academy team page best practices — hierarchy, credentials, clear CTAs, optional segmentation (e.g. anchor nav).

## Relevant Learnings

- **Single source**: Coach data in one JSON file; schema and UI both consume it.
- **Page composition**: Extract sections into `components/coaches/` with barrel export; page composes and stays thin.
- **Parallax**: Gate with `matchMedia('(prefers-reduced-motion: reduce)')`; disable or use static when true.
- **Pull quotes**: Use `PullQuote` or `.section-quote` for any blockquote.
- **Image paths**: Use consistent asset names (e.g. `robert-lebuhn.png`) across listing and bio.

## Risks & Mitigations

| Risk | Mitigation |
|------|------------|
| Breaking existing bio pages (andrew-mateljan, robert-lebuhn, etc.) | Keep static bio pages; they can later import from coaches-data for copy only, or migrate to one dynamic `[slug]` route in a follow-up. |
| data/coaches.json and individual bio content drift | Either keep bio page content in JSON (long bios in coaches.json) or document that bio pages are the detail source and listing is summary-only. |
| Anchor nav adds complexity | Make it optional; implement in Phase 3 only if time permits. |

---

**Next step**: Run `/compound:work` with this plan (or execute phases in order), then `/compound:review` and `/compound:validate` before deploy. After completion, run `/compound:learn` to capture any new corrections or patterns.
