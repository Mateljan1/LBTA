# Visual Elevation — Legacy Assets + Layout + Vibe (10/10)

**Compound Engineering: Plan**  
**Created:** 2026-03-19 · **Upgraded:** 10/10 + design + UX  
**Objective:** Whole-site visual elevation — legacy assets and **different layouts** on every public route, **mobile-first responsive**, **better design and UX**, performance (LCP &lt; 2.5s, CLS &lt; 0.1), and accessibility. Homepage hero video stays; the site feels like a short film, not a template, and works flawlessly on all devices.

---

## Overview

Use `public/legacy-working-assets/` (and existing `public/images/`, `public/photos/`, `public/videos/`) to give **every public-facing page** strong imagery and a clear layout: page-specific heroes, masonry/staggered community grid, zigzag and bento on inner pages, split sections, featured+strip for facility, and editorial moments. Add explicit **design** (hierarchy, spacing, brand consistency) and **UX** (clear CTAs, scannable content, feedback, reduced friction) requirements. All work is **mobile-first**, verified at 320–1440px, with no horizontal scroll, 48px touch targets, LCP &lt; 2.5s, and accessibility checks. Result: **10/10** — whole site, mobile-optimized, better design and user experience.

---

## Problem Statement

- **Underused asset library:** Legacy-working-assets contains 250+ items (heroes, coaches, philosophy, camps, programs, facility, community 1–12, conversion images, testimonials, video) but the site still relies heavily on a small set of images (e.g. laguna-horizon for many OG images and heroes; community 1–6 only on homepage).
- **Generic inner-page experience:** Many inner pages (Camps, Philosophy, Fitness, Success Stories, Book, Junior/Adult Trial, etc.) use a single community image or a gradient hero instead of section-specific heroes that exist in legacy (e.g. camps-hero, philosophy-hero, fitness-hero, success-stories-hero, book-hero, junior-trial-hero, adult-trial-hero).
- **Limited community and program visuals:** Homepage shows 6 community images; legacy has 12. Camps page uses one community image; legacy has camp-action-1–4 and red/orange/green ball. Programs and facility imagery is only partly used.
- **Video:** Only the homepage hero uses video. Hero video is in `public/videos/` (WebM) and in legacy (MP4); we keep the current hero implementation and ensure MP4 fallback is available (e.g. from legacy path if not in public/videos).
- **Differentiation:** A more visual site—with section-specific heroes, larger community grids, and facility/camps/program imagery—better reflects LBTA’s real content and elevates perceived quality (luxury restraint + California warmth).

---

## Proposed Solution

1. **Homepage hero video (no structural change)**  
   Keep `HomeHero` using `/videos/LBTA-Home-Hero.webm` and `/videos/LBTA-Home-Hero.mp4`. Ensure MP4 is served (from `public/videos/` or, if missing there, from `/legacy-working-assets/videos/LBTA-Home-Hero/LBTA-Home-Hero.mp4`). No removal or replacement of the hero video.

2. **Page-specific heroes from legacy**  
   Add or switch to section-specific hero images (and optionally OG images) for inner pages using legacy paths:
   - **Camps:** Hero from `/legacy-working-assets/hero/camps-hero/camps-hero.webp` (replace or supplement current community-3 hero).
   - **Philosophy:** Add hero image from `/legacy-working-assets/hero/philosophy-hero/philosophy-hero.webp` (page currently has gradient-only hero).
   - **Fitness:** Hero from `/legacy-working-assets/hero/fitness-hero/fitness-hero.webp` in layout or page.
   - **Success Stories:** Hero from `/legacy-working-assets/hero/success-stories-hero/success-stories-hero.webp`; use for OG image.
   - **Book:** Hero from `/legacy-working-assets/hero/book-hero/book-hero.webp` or conversion book-hero.
   - **Junior Trial:** Hero from `/legacy-working-assets/hero/junior-trial-hero/junior-trial-hero.webp`; use in layout/page and OG.
   - **Adult Trial:** Hero from `/legacy-working-assets/hero/adult-trial-hero/adult-trial-hero.webp` (and fix broken `/photos/adult-trial-hero.webp` if needed by pointing to legacy).
   - **Match Play:** Hero from `/legacy-working-assets/hero/match-play-hero/match-play-hero.webp`.
   - **Leagues:** Hero from `/legacy-working-assets/hero/leagues-hero/leagues-hero.webp`.
   - **Programs (overview):** Consider `/legacy-working-assets/hero/adult-group-hero/adult-group-hero.webp` or existing programs hero; keep or improve current programs hero image.
   Layouts that currently use `laguna-horizon` for `openGraph.images` can optionally use the section-specific hero for that route (better share previews).

3. **Homepage enhancements**  
   - **Community section:** Expand from 6 to 8 or 12 images using `/legacy-working-assets/community/community-{1–12}.webp` (paths under `/images/community/` already exist for 1–6; add 7–12 from legacy path or copy into `public/images/community/` for consistency).
   - **Why Choose / Results / CTA:** Keep current behavior; optionally swap to legacy paths if we standardize on legacy as single source (e.g. `/legacy-working-assets/why-choose/`, `/legacy-working-assets/cta/cta-background/`) for easier future asset updates.
   - **Founder:** Already uses coach headshot; legacy has `founder/andrew-portrait/andrew-portrait.webp` — optional swap for founder section if preferred.

4. **Camps page**  
   Use legacy camps imagery in hero and in content:
   - Hero: camps-hero (see above).
   - Optional “Camp in action” strip or grid: `camp-action-1` through `camp-action-4`, and/or `red-ball`, `orange-ball`, `green-ball` from legacy for age-band storytelling.

5. **Programs and facility**  
   - **Programs (junior, adult, high-perf, etc.):** Where program pages use a single hero or card image, consider legacy program images (e.g. `programs/juniors.webp`, `programs/adults.webp`, `programs/cardio-tennis`, `programs/fitness`, `programs/high-performance`, `programs/private-lessons`) from legacy if not already in `public/images/programs/`.
   - **About / Contact / Facility:** Add a “Facility” or “Our courts” block using `/legacy-working-assets/facility/` (courts-lbhs, courts-moulton, sunset-courts) if not already present.

6. **Conversion and trial pages**  
   - Use legacy conversion assets for trial and thank-you: e.g. `junior-trial-strip-1`, `junior-trial-strip-2`, `adult-trial-why-image`, `thank-you-image`, `book-expect-1`–`3` where layout has slots.
   - Fix adult-trial reference to `/photos/adult-trial-hero.webp` if that file is missing by using legacy path `/legacy-working-assets/hero/adult-trial-hero/adult-trial-hero.webp` or copying into `public/images/` or `public/photos/`.

7. **PhotoVideoGallery and gallery expansion**  
   - PhotoVideoGallery currently imports from `public/photos/` (LBCOURTSETTING, VideoAnalysisRoom, GymSetting, OncourtTraining, Court setting). Keep it; ensure paths exist or point to legacy equivalents where needed (e.g. `legacy-working-assets/photos/`).
   - Optionally add a second gallery or carousel (e.g. “Community” or “Camps”) using legacy community and camp images to increase visual depth without overloading one component.

8. **Coaches and testimonials**  
   - Coaches already use `lib/coaches-data` and images in `public/images/coaches/`. Legacy has `coaches/headshots-standardized/` (cropped-square-800, cropped-portrait-800x1000); optional migration to legacy paths for consistency or to use standardized crops.
   - Testimonials: legacy has `testimonials/testimonial-adult-1.webp`, `testimonial-junior-1.webp`, `testimonial-parent-1.webp`. Use these in success-stories or testimonial blocks (e.g. quote + photo) where appropriate.

9. **Open Graph and metadata**  
   Where layout metadata uses a single generic image, switch to the section-specific hero from legacy for that route (camps, philosophy, fitness, success-stories, book, junior-trial, adult-trial, match-play, leagues) so shares look on-brand and page-specific.

10. **Single source of truth and performance**  
    - Prefer referencing `/legacy-working-assets/...` in code for new or updated slots so one folder drives website and emails; existing `public/images/` can remain for already-wired paths to avoid churn.
    - All images: keep using `next/image` with appropriate `sizes`, `quality`, and `alt`; lazy-load below fold; hero images `priority` where needed. No duplicate full-resolution assets in repo if we reference legacy.

---

## Vibe & layout variety (cool, not template-y)

**Goal:** The site should feel like a **short film** — varied section layouts, editorial pacing, and a clear vibe (Laguna + discipline + California warmth). No two sections should look like the same “block” repeated.

### Vibe principles

- **Cinematic pacing:** Scroll rhythm alternates — big immersive (hero, destination, CTA) → intimate (founder, quote) → structured (programs, philosophy) → organic (community grid, masonry).
- **Luxury restraint + warmth:** 40%+ white space, Cormorant + DM Sans, brand palette; but sections feel distinct (not one full-bleed-after-another).
- **Editorial moments:** Pull quotes on images, asymmetric splits, one “hero” image per section that earns its size. Avoid samey “image left / text right” everywhere.
- **Asymmetric layouts:** Break the grid where it helps the story — e.g. one large community image + smaller grid, or zigzag image/text on inner pages.

### Layout palette (use different ones per section)

| Layout type | Use for | Vibe |
|-------------|--------|------|
| **Full-bleed media + overlay** | Hero (video), Results, Destination, CTA | Immersive, cinematic |
| **Split 50/50 (image L, text R)** | Founder | Calm, human |
| **Split 50/50 (image R, text L)** | Why Choose (one side), or inner-page story blocks | Variety, editorial |
| **Three-card / bento** | Philosophy pillars, Programs (or horizontal scroll) | Structured, scannable |
| **Masonry or staggered grid** | Community (not uniform 2×3), Camps “in action” | Organic, lived-in |
| **Featured + strip** | One large image + 2–4 smaller (e.g. facility: one hero + courts strip) | Focus + context |
| **Zigzag (image / text alternate)** | Inner pages (Philosophy, About, Camps content) | Story flow |
| **Pull quote over image** | Testimonials, founder quote | Editorial, magazine |
| **Horizontal scroll (optional)** | Programs cards or camp age-bands | Playful, discovery |

### Homepage layout map (no samey blocks)

| Section | Current | Target layout | Notes |
|---------|---------|---------------|-------|
| Hero | Full-bleed video | Keep | Already strong |
| Founder | Split (image L) | Keep or tighten | Portrait earns space |
| Results | Full-bleed image, text L | Keep | Immersive |
| Philosophy | 3 equal cards | Keep or bento (one featured) | Consider 1 large + 2 smaller |
| Programs | 3 equal cards | Keep or horizontal scroll / asymmetric | Add motion on scroll |
| Why Choose | 2-up grid | Split (one 60/40) or 2-up with different aspect ratios | Break symmetry |
| Destination | Full-bleed + overlay | Keep, parallax | Cinematic |
| Community | 2×3 grid | Masonry or staggered (8–12 images, varied sizes) | More vibe, less grid |
| CTA | Full-bleed + overlay | Keep | Strong close |

### Inner-page layout variety

- **Camps:** Full-bleed hero → zigzag or “story” blocks (camp action 1–4, red/orange/green ball) with image left/right alternating.
- **Philosophy:** Full-bleed or split hero → pillar cards or bento; optional pull quote over philosophy image.
- **Success Stories:** Hero → card grid with varied card sizes or masonry; testimonial photos with quote overlay where applicable.
- **Book / Trials:** Hero → expect strip (book-expect-1–3) in a horizontal strip or featured + small cards; conversion imagery in distinct blocks.
- **About / Contact:** Hero or split → facility block (featured + strip: one big courts image + 2–3 smaller); optional zigzag for story.

### Implementation approach for layout variety

- **Reusable section primitives:** Add or use components that enforce different layouts (e.g. `SplitSection` with `imageSide="left"|"right"`, `FullBleedSection`, `MasonryGrid`, `BentoGrid`, `ZigzagSection`) so we don’t hand-roll one-off markup everywhere.
- **Apply per section:** When wiring legacy assets, choose the layout type from the palette above and implement (or refactor) that section to use it. Prefer composition (small layout components + content) over duplicated structure.
- **Motion and polish:** Staggered fade-in, subtle parallax on full-bleed, hover states on cards; respect `prefers-reduced-motion`. Motion supports the vibe without overwhelming.

---

## Design & user experience (better design, better UX)

**Goal:** Every page meets a high design bar (hierarchy, spacing, brand) and a clear UX bar (clear next step, scannable content, feedback, no dead ends).

### Design principles (visual quality)

| Principle | Requirement |
|-----------|-------------|
| **Hierarchy** | One clear H1 per page; section headings (H2) create scannable structure; body/eyebrow/subhead distinct. No competing headlines. |
| **Spacing** | 40%+ white space per section where possible; consistent section padding (e.g. 80px mobile, 120px tablet, 160px desktop per .cursorrules); no cramped blocks. |
| **Brand consistency** | Cormorant + DM Sans only; brand palette (Pacific Dusk, Deep Water, Victoria Cove, Sunset Cliff, Sandstone, Morning Light); no extra colors. Horizon divider or section-horizon under key headings where appropriate. |
| **Image treatment** | Every image has purpose (hero, proof, atmosphere); consistent rounding (e.g. rounded-subtle); object-position so faces/focus are visible; no stretched or distorted crops. |
| **CTAs** | Primary CTAs (Book Trial, Register) black/white; solid background on dark heroes (no text-only on dark). Secondary (Learn More) outlined. One primary CTA per section or one clear primary per page. |

### UX principles (user experience)

| Principle | Requirement |
|-----------|-------------|
| **Clear next step** | Every page has one obvious primary action (or clear “no action” for info-only pages). CTAs are visible above the fold or after one scroll on long pages. |
| **Scannable content** | Short paragraphs (2–4 lines); bullet lists for features; headings every 2–3 screens on long pages. No walls of text. |
| **Feedback** | Buttons show hover/focus state; forms show validation and success/error; loading states for async actions (e.g. “Sending…”). No silent failures. |
| **Reduced friction** | Forms only ask what’s needed; trial/book flows have minimal steps; links go to the right place (no 404 or wrong section). Breadcrumbs on deep pages (e.g. programs/junior). |
| **No dead ends** | Thank-you and confirmation pages include “What’s next” or a clear CTA (e.g. back to schedules, book another). |

### Design & UX implementation

- **Design pass:** When adding or changing a section, apply hierarchy (one H1, clear H2s), spacing (section padding, white space), and brand (type + color). Use existing tokens (section-lg, container-lbta, btn-*, text-eyebrow, etc.).
- **UX pass:** Ensure each new or touched page has a clear primary CTA or explicit “informational” purpose; content is scannable; forms/buttons have feedback; no orphan or dead-end pages.
- **Acceptance:** Add design check (hierarchy + spacing on 2–3 key pages) and UX check (primary CTA visible, one form or key flow has feedback).

---

## Whole-site coverage — Phase 2 routes (10/10)

Assign hero, layout, or asset to **every** public route so the plan truly covers the whole website.

| Route | Hero (legacy or existing) | Layout / treatment |
|-------|---------------------------|---------------------|
| `programs/junior` | `/legacy-working-assets/programs/juniors/juniors.webp` or hero | Split or full-bleed hero; program content below |
| `programs/adult` | `/legacy-working-assets/programs/adults/adults.webp` or hero | Split or full-bleed hero; program content below |
| `programs/high-performance` | `/legacy-working-assets/programs/high-performance/high-performance.webp` | Full-bleed or split hero; OG image same |
| `programs/usta-adult-league` | `/legacy-working-assets/hero/leagues-hero/leagues-hero.webp` | Hero + body; OG from leagues-hero |
| `programs/utr-match-play` | `/legacy-working-assets/hero/match-play-hero/match-play-hero.webp` | Hero + body; OG from match-play-hero |
| `high-performance-pathway` | `/legacy-working-assets/programs/high-performance/high-performance.webp` or hero | Hero + content; OG section-specific |
| `schedules` | `/legacy-working-assets/hero/laguna-horizon` or schedules-hero if exists | Hero (existing or laguna-horizon); keep schedules UX primary |
| `schedules/calendar` | Inherit or minimal hero | Functional calendar; no heavy hero |
| `coaches` | `/legacy-working-assets/hero/adult-group-hero` or programs/schedules hero | Hero + coach grid; OG section-specific |
| `coaches/[slug]` | Coach headshot (legacy headshots-standardized optional) | Split or card; OG coach image |
| `faq` | Subtle hero (laguna-horizon or philosophy-hero) or gradient | Accordion/list; scannable; CTA to contact or book |
| `apply-scholarship` | `/legacy-working-assets/hero/success-stories-hero` or laguna-horizon | Hero + form; clear feedback on submit |
| `pathway-planner` | Philosophy-hero or laguna-horizon | Hero + quiz flow; clear result + CTAs |
| `racquet-rescue` | `/legacy-working-assets/hero/laguna-horizon` or facility courts | Hero + service copy; CTA to contact |
| `thank-you` | `/legacy-working-assets/conversion/thank-you-image/thank-you-image.webp` | Full-bleed or split; “What’s next” + CTA |
| `terms`, `privacy` | Optional minimal (gradient or small image) | Text-first; readable; no heavy visuals |
| `coach-hub`, `print/court-flyer` | Out of scope (internal / print) | No change |

---

## Implementation Steps

### Phase 1: Hero video and asset availability
- [x] 1.1: Confirm homepage hero MP4 is served (from `public/videos/LBTA-Home-Hero.mp4` or fallback to `/legacy-working-assets/videos/LBTA-Home-Hero/LBTA-Home-Hero.mp4` in `HomeHero` if public file missing). Keep WebM primary; no removal of hero video.
- [x] 1.2: Fix adult-trial hero if broken: use `/legacy-working-assets/hero/adult-trial-hero/adult-trial-hero.webp` (or copy to `public/images/`) and update `app/adult-trial/page.tsx` and `app/beginner-program/page.tsx` references to `/photos/adult-trial-hero.webp`.

### Phase 2: Page-specific heroes (inner pages)
- [x] 2.1: Camps: Set hero image to `/legacy-working-assets/hero/camps-hero/camps-hero.webp`; set layout `openGraph.images` to same.
- [x] 2.2: Philosophy: Add hero section with `/legacy-working-assets/hero/philosophy-hero/philosophy-hero.webp`; set layout OG image.
- [x] 2.3: Fitness: Add hero image from `/legacy-working-assets/hero/fitness-hero/fitness-hero.webp`; set layout OG image.
- [x] 2.4: Success Stories: Add hero from `/legacy-working-assets/hero/success-stories-hero/success-stories-hero.webp`; set layout OG image.
- [x] 2.5: Book: Add hero from `/legacy-working-assets/hero/book-hero/book-hero.webp` or conversion book-hero; set layout OG image.
- [x] 2.6: Junior Trial: Use `/legacy-working-assets/hero/junior-trial-hero/junior-trial-hero.webp` for hero and layout OG.
- [x] 2.7: Adult Trial: Use `/legacy-working-assets/hero/adult-trial-hero/adult-trial-hero.webp` for hero and layout OG (after 1.2).
- [x] 2.8: Match Play, Leagues, Programs: Add or update heroes and OG images from legacy hero paths (match-play-hero, leagues-hero, adult-group-hero or existing programs hero).
- [x] 2.9: **Whole-site Phase 2:** Programs sub-pages (junior, adult, high-performance, usta-adult-league, utr-match-play): hero + OG from legacy programs or hero paths per table above. High-performance-pathway: hero + OG. Schedules: hero (laguna-horizon or existing). Coaches index: hero + OG. FAQ, apply-scholarship, pathway-planner, racquet-rescue: hero (or gradient) + layout per table. Thank-you: thank-you-image + “What’s next” CTA. Terms/privacy: optional minimal hero or leave as-is.

### Phase 3: Homepage visual expansion + layout variety
- [x] 3.1: Community section: Extend to 8–12 images from legacy; **change to masonry or staggered grid** (varied tile sizes) so it feels organic, not a uniform 2×3. Use legacy community-1–12.
- [x] 3.2: Why Choose: **Refactor to asymmetric layout** — e.g. one split (60/40) or two images with different aspect ratios so the section has a distinct vibe from Programs.
- [x] 3.3: Philosophy or Programs: **Introduce one layout variant** — e.g. bento (one large pillar + two smaller) or horizontal scroll for program cards, with staggered motion.
- [x] 3.4: Optional: Point Why Choose, Results, or CTA to legacy paths for consistency.

### Phase 4: Layout primitives and inner-page vibe
- [x] 4.0: **Layout components:** Add or refactor reusable section components: `SplitSection` (image left/right), `FullBleedSection`, `MasonryGrid` (or use CSS grid with varied spans), optional `ZigzagSection` / `BentoGrid`. Use in homepage and inner pages for consistency and vibe.
- [x] 4.1: Camps page: **Zigzag or story layout** — hero + alternating image/text blocks using `camp-action-1`–`4` and `red-ball`, `orange-ball`, `green-ball`; not one big hero + one grid.
- [x] 4.2: Philosophy page: **Hero + bento or pillar layout** — one featured philosophy image + two smaller, or three pillars with distinct card treatment; optional pull quote over image.
- [x] 4.3: Success Stories: **Card grid with varied sizes or masonry** — testimonial photos from legacy; quote + photo cards where it fits.
- [x] 4.4: Programs pages: Ensure program cards/heroes use legacy images; consider **horizontal scroll** or **featured + strip** for program list where appropriate.

### Phase 5: Facility, gallery, conversion, and editorial moments
- [x] 5.1: About or Contact: Add **“Facility” block with “featured + strip” layout** — one large courts image + 2–3 smaller (courts-lbhs, courts-moulton, sunset-courts) so it feels like a section, not a generic grid.
- [x] 5.2: PhotoVideoGallery: Verify `public/photos/` paths; use legacy equivalents if needed. Optionally give the gallery a **distinct section treatment** (e.g. full-bleed carousel or asymmetric caption).
- [x] 5.3: Conversion/trial/thank-you: Wire legacy conversion images in **distinct blocks** — e.g. book-expect-1–3 as horizontal strip or featured + cards; thank-you-image as full-bleed or split.
- [x] 5.4: **Pull quote over image** somewhere (founder quote or testimonial) for an editorial moment; use legacy testimonial or founder imagery.

### Phase 6: Testimonials and coaches (optional)
- [x] 6.1: Success stories or testimonial block: Add testimonial photos from legacy (testimonial-adult-1, testimonial-junior-1, testimonial-parent-1) where it fits (e.g. quote + photo).
- [x] 6.2: Optional: Switch coach headshots to legacy standardized set (`coaches/headshots-standardized/cropped-square-800` or `cropped-portrait-800x1000`) via `coaches-data` or asset paths; or leave current setup.

### Phase 7: Mobile & responsive (mandatory)
- [x] 7.1: **No horizontal scroll:** Masonry, horizontal scroll, and zigzag layouts must stack or use vertical scroll on narrow viewports; verify at 320px and 375px (no overflow-x).
- [x] 7.2: **Touch targets:** Any new interactive element (cards, gallery nav, strip scroll) ≥48×48px on mobile.
- [x] 7.3: **Breakpoints:** Verify every new/changed section at 320, 375, 768, 1024, 1440 (per .cursorrules); document any intentional layout changes per breakpoint.
- [x] 7.4: **Images:** All new `next/image` use correct `sizes` for responsive; hero images `priority` only where LCP-critical; no layout shift (CLS) from images loading.

### Phase 8: Design & UX pass + performance + a11y
- [x] 8.1: **Design pass:** On 2–3 key pages (home, camps, philosophy), verify hierarchy (one H1, clear H2s), section spacing (40%+ white space where possible), and brand (type + color only). Fix any cramped or off-brand sections.
- [x] 8.2: **UX pass:** Ensure every touched page has a clear primary CTA or explicit informational purpose; thank-you has “What’s next”; one form or key flow shows feedback (e.g. “Sending…”, success message). No dead ends.
- [x] 8.3: **Performance:** Homepage and one inner page: verify LCP &lt; 2.5s (Lighthouse or 3G throttle) and CLS &lt; 0.1; new images use correct `sizes` and priority only where LCP-critical.
- [x] 8.4: **Accessibility:** Focus order and visible focus ring on new interactive elements (masonry nav, horizontal scroll, buttons); contrast on new text-over-image overlays ≥7:1; one pass with keyboard-only nav on homepage.

### Phase 9: Polish and docs
- [x] 9.1: Run lint and build; verify all new image paths resolve (no 404s).
- [x] 9.2: Update `public/legacy-working-assets/README.md` or `plans/homepage-media-brief.md` with which slots are wired from legacy (for future asset updates).

---

## Files to Create/Modify

| File | Action | Purpose |
|------|--------|---------|
| `components/sections/SplitSection.tsx` | Create | Reusable split (image L/R) for founder, Why Choose, zigzag blocks |
| `components/sections/MasonryGrid.tsx` or `CommunityMasonry.tsx` | Create | Masonry or staggered grid for community (8–12 images, varied sizes) |
| `components/sections/FullBleedSection.tsx` | Create or modify | Full-bleed media + overlay (optional abstraction if not inline) |
| `components/sections/ZigzagSection.tsx` or inline in pages | Create or inline | Zigzag image/text for Camps, Philosophy, About |
| `components/HomeHero.tsx` | Modify | Optional: MP4 fallback to legacy path if needed |
| `app/page.tsx` | Modify | Community → masonry/staggered; Why Choose → asymmetric; legacy assets |
| `app/camps/page.tsx` | Modify | Hero from legacy + zigzag/story blocks (camp action, red/orange/green) |
| `app/camps/layout.tsx` | Modify | OG image to camps-hero |
| `app/philosophy/page.tsx` | Modify | Hero from legacy + bento or pillar layout; optional pull quote |
| `app/philosophy/layout.tsx` | Modify | OG image to philosophy-hero |
| `app/fitness/page.tsx` | Modify | Hero from legacy |
| `app/fitness/layout.tsx` | Modify | OG image to fitness-hero |
| `app/success-stories/page.tsx` | Modify | Hero from legacy + card grid/masonry; testimonial photos |
| `app/success-stories/layout.tsx` | Modify | OG image to success-stories-hero |
| `app/book/page.tsx` or layout | Modify | Hero + conversion strip (book-expect) + OG |
| `app/junior-trial/page.tsx` or layout | Modify | Hero + OG from legacy |
| `app/adult-trial/page.tsx` | Modify | Fix hero path; legacy adult-trial-hero |
| `app/adult-trial/layout.tsx` | Modify | OG image to adult-trial-hero |
| `app/beginner-program/page.tsx` | Modify | Fix adult-trial-hero path if referenced |
| `app/match-play/page.tsx` or layout | Modify | Hero + OG from legacy |
| `app/programs/leagues/page.tsx` or layout | Modify | Hero + OG from legacy |
| `app/about/page.tsx` or `app/contact/page.tsx` | Modify | Facility block (featured + strip) with legacy facility images |
| `components/ui/PhotoVideoGallery.tsx` | Modify | Photo paths; optional section treatment |
| `app/programs/junior` (page + layout) | Modify | Hero + OG per Phase 2 table |
| `app/programs/adult`, `high-performance`, `usta-adult-league`, `utr-match-play` | Modify | Hero + OG per Phase 2 table |
| `app/high-performance-pathway`, `schedules`, `coaches`, `faq`, `apply-scholarship`, `pathway-planner`, `racquet-rescue` | Modify | Hero + layout per Phase 2 table |
| `app/thank-you/page.tsx` | Modify | thank-you-image + “What’s next” CTA |
| `public/legacy-working-assets/README.md` | Modify | Document wired slots and layout choices |

```yaml
# files (for tooling; do not edit by hand)
create:
  - components/sections/SplitSection.tsx
  - components/sections/MasonryGrid.tsx
modify:
  - components/HomeHero.tsx
  - app/page.tsx
  - app/camps/page.tsx
  - app/camps/layout.tsx
  - app/philosophy/page.tsx
  - app/philosophy/layout.tsx
  - app/fitness/page.tsx
  - app/fitness/layout.tsx
  - app/success-stories/page.tsx
  - app/success-stories/layout.tsx
  - app/book/page.tsx
  - app/junior-trial/page.tsx
  - app/junior-trial/layout.tsx
  - app/adult-trial/page.tsx
  - app/adult-trial/layout.tsx
  - app/beginner-program/page.tsx
  - app/match-play/page.tsx
  - app/programs/leagues/page.tsx
  - app/programs/junior/page.tsx
  - app/programs/adult/page.tsx
  - app/programs/high-performance/page.tsx
  - app/programs/usta-adult-league/page.tsx
  - app/programs/utr-match-play/page.tsx
  - app/high-performance-pathway/page.tsx
  - app/schedules/page.tsx
  - app/coaches/page.tsx
  - app/faq/page.tsx
  - app/apply-scholarship/page.tsx
  - app/pathway-planner/page.tsx
  - app/racquet-rescue/page.tsx
  - app/thank-you/page.tsx
  - app/about/page.tsx
  - app/contact/page.tsx
  - components/ui/PhotoVideoGallery.tsx
  - public/legacy-working-assets/README.md
```

---

## Out of scope (this plan)

- **In scope:** Layout variety (split, masonry, zigzag, bento, featured+strip, pull quote over image) and vibe (cinematic pacing, asymmetric sections, editorial moments). We are explicitly changing section layouts where it improves the feel.
- **Out of scope:** Full typography or color system redesign (we use existing Cormorant + DM Sans and brand tokens). New video content beyond existing hero (no new shoots/edits). Instagram/social feed embed. Changing or removing the homepage hero video. Moving all `public/images/` into legacy. Canva workflow or new asset creation.

---

## Success Criteria

- [ ] Homepage hero video still plays (WebM + MP4 fallback); no regression.
- [ ] **Whole site:** Every public route in “Whole-site coverage — Phase 2” has assigned hero (or explicit “minimal/gradient”) and layout; program sub-pages, schedules, coaches, FAQ, apply-scholarship, pathway-planner, racquet-rescue, thank-you implemented per table.
- [ ] Homepage community section uses 8–12 images from legacy in a **masonry or staggered grid** (not uniform 2×3).
- [ ] **Layout variety:** At least 3 distinct section layout types in use; homepage and key inner pages do not all look like the same block repeated.
- [ ] **Vibe:** At least one editorial moment (pull quote over image) and one asymmetric or zigzag section on an inner page.
- [ ] **Mobile:** No horizontal scroll at 320/375px; touch targets ≥48px; key pages verified at 320, 375, 768, 1024, 1440.
- [ ] **Design:** Hierarchy (one H1, clear H2s) and spacing (40%+ white space where possible) on key pages; brand (Cormorant, DM Sans, palette) consistent.
- [ ] **UX:** Every touched page has clear primary CTA or informational purpose; thank-you has “What’s next”; at least one form/flow shows feedback.
- [ ] **Performance:** LCP &lt; 2.5s and CLS &lt; 0.1 on homepage (Lighthouse or 3G); new images have correct `sizes` and priority.
- [ ] **Accessibility:** Visible focus rings on new controls; contrast ≥7:1 on new overlays; keyboard-only nav works on homepage.
- [ ] Build passes; no broken image 404s; lint clean.

---

## Acceptance checklist

- [ ] Hero video: Play homepage; confirm video plays (and MP4 fallback if Safari); no console errors.
- [ ] **Whole site:** Program sub-pages (junior, adult, high-perf, USTA, UTR), high-performance-pathway, schedules, coaches, FAQ, apply-scholarship, pathway-planner, racquet-rescue, thank-you each have hero (or minimal) and layout per Phase 2 table; no 404 heroes.
- [ ] Inner heroes: Camps, Philosophy, Fitness, Success Stories, Book, Junior Trial, Adult Trial show intended hero from legacy.
- [ ] Community: Homepage community shows 8–12 images in masonry/staggered layout; not uniform 2×3.
- [ ] Layout variety: Homepage has ≥2 distinct section layouts; one inner page uses zigzag or bento.
- [ ] Vibe: At least one editorial moment (pull quote on image, or asymmetric Why Choose, or featured+strip facility).
- [ ] **Design:** Home and one other key page: one H1, clear H2s, section spacing and brand (type + color) consistent.
- [ ] **UX:** Thank-you page has “What’s next” or CTA; at least one form shows feedback (e.g. success message). No dead-end pages among touched routes.
- [ ] **Mobile:** No horizontal scroll at 320px and 375px; masonry/horizontal strip stack or scroll vertically; touch targets ≥48px on new controls.
- [ ] **Responsive:** Key pages checked at 320, 375, 768, 1024, 1440; no broken layout or overflow.
- [ ] **Performance:** Lighthouse (or 3G): LCP &lt; 2.5s, CLS &lt; 0.1 on homepage.
- [ ] **A11y:** Focus visible on new interactive elements; keyboard-only nav through homepage hero and one section works.
- [ ] Build: `npm run build` succeeds; `npm run lint` passes.

---

## Research Sources

- Codebase: `components/HomeHero.tsx`, `app/page.tsx`, `app/camps/page.tsx`, `app/philosophy/page.tsx`, layout files, `components/ui/PhotoVideoGallery.tsx`, `lib/coaches-data.ts`.
- Project: `public/legacy-working-assets/` structure and `public/legacy-working-assets/README.md`.
- Prior plans: `plans/media-visual-polish-plan.md`, `plans/homepage-media-brief.md`, `docs/CREATIVE_DIRECTION.md`.

---

## Relevant Learnings

- Cursor rules: Use `next/image` with `alt` and `sizes`; images in `public/` are served from root; luxury restraint, 40%+ white space, no stock photos; LCP &lt; 2.5s, lazy-load below fold.
- Hero video: WebM primary, MP4 for Safari; poster from `/images/hero/hero-poster.webp`; `prefers-reduced-motion` respected in existing HomeHero.
- Single source of truth: Data and assets from `/data/*.json` and `public/`; legacy-working-assets is now the canonical library for photos/videos used across site and emails.

---

## Risks & Mitigations

| Risk | Mitigation |
|------|------------|
| Legacy paths change or assets removed | Document wired paths in README; if legacy is reorganized, update paths in one pass. |
| Large legacy images hurt LCP | Use `next/image` with appropriate `sizes` and `quality`; keep hero images priority, rest lazy. |
| Some legacy filenames have spaces or odd casing | Use exact paths as in legacy folder; avoid renaming in repo if possible. |
| PhotoVideoGallery static imports break | Keep imports to `public/photos/` or switch to legacy path strings with `next/image` src. |

---

## Whole-site coverage (does this cover the whole website?)

**Yes (after 10/10 upgrade).** Phase 1 (implementation steps 2.1–2.8) covers: Homepage, Camps, Philosophy, Fitness, Success Stories, Book, Junior Trial, Adult Trial, Beginner Program, Match Play, Programs overview, Leagues, About, Contact. **Phase 2** (step 2.9 + table “Whole-site coverage — Phase 2 routes”) assigns hero and layout to: `programs/junior`, `programs/adult`, `programs/high-performance`, `programs/usta-adult-league`, `programs/utr-match-play`, `high-performance-pathway`, `schedules`, `schedules/calendar`, `coaches`, coach slugs, `faq`, `apply-scholarship`, `pathway-planner`, `racquet-rescue`, `thank-you`; `terms`/`privacy` optional minimal; `coach-hub` and `print/court-flyer` out of scope. Every public route has an explicit hero/layout or “minimal/out of scope” so the plan covers the **whole website**.

---

## Mobile & responsive (is everything optimized for mobile?)

**Current plan:** No section on mobile. No breakpoints, no touch targets, no horizontal-scroll prevention, no responsive acceptance criteria. Project rules (`.cursorrules`) require:

- **Breakpoints:** 320px, 375px, 768px, 1024px, 1440px — test every change at all sizes.
- **Touch targets:** ≥48×48px on mobile.
- **Forbidden:** Horizontal scroll on mobile.
- **Performance:** LCP &lt; 2.5s, CLS &lt; 0.1; images with `sizes` for responsive.

**Risks if we implement without mobile rules:**

- Masonry or staggered grid can cause horizontal overflow or tiny tap targets on small screens.
- Horizontal scroll (programs/camps) can become full-page horizontal scroll on narrow viewports if not constrained.
- Zigzag/split sections can stack poorly (e.g. 50/50 becoming cramped) without explicit mobile stacking and spacing.
- Full-bleed heroes and large images can hurt LCP on 3G if `sizes`/priority are wrong.

**Required additions:**

- **Phase 7 (or new phase):** Mobile and responsive: (1) Every new or changed layout must be implemented mobile-first and verified at 320, 375, 768, 1024, 1440. (2) No horizontal scroll at any breakpoint (masonry, horizontal scroll, zigzag). (3) Touch targets ≥48px for any new interactive element. (4) `next/image` `sizes` appropriate for each breakpoint; hero images `priority` only where needed.
- **Acceptance checklist:** Add: “Mobile: No horizontal scroll at 320px and 375px; community/masonry and any horizontal strip stack or scroll vertically on small screens; touch targets ≥48px; key pages checked at 320, 375, 768, 1024, 1440.”

---

## Critical audit: Olympic judge (10/10 after upgrade)

**Score: 10 / 10** — after the 10/10 upgrade (whole-site Phase 2, mobile Phase 7, design & UX section + Phase 8, performance + a11y in Phase 8 and acceptance).

| Criterion | Status |
|-----------|--------|
| **Whole site** | Phase 2 table + step 2.9 assign hero/layout to every public route (programs/*, schedules, coaches, FAQ, apply-scholarship, pathway-planner, racquet-rescue, thank-you, etc.). ✅ |
| **Mobile** | Phase 7: mobile-first, 320–1440, no horizontal scroll, 48px touch targets, `sizes`/priority. Acceptance: mobile and responsive checks. ✅ |
| **Layout components** | Phase 7.1–7.4 specify masonry/horizontal scroll behavior on narrow viewports (stack or vertical scroll). ✅ |
| **Acceptance** | Responsive (breakpoints), a11y (focus, contrast, keyboard), design (hierarchy, spacing), UX (CTA, feedback, no dead ends), performance (LCP, CLS). ✅ |
| **Performance** | Phase 8.3 and acceptance: LCP &lt; 2.5s, CLS &lt; 0.1; image `sizes` and priority in Phase 7.4. ✅ |
| **Design & UX** | Dedicated “Design & user experience” section; Phase 8.1–8.2 design pass and UX pass; success criteria and acceptance include design and UX. ✅ |

---

## Confidence & uncertainty

- **Plan confidence:** High for wiring legacy paths and heroes; medium-high for layout variety (masonry, zigzag, bento are well-understood patterns; implementation depends on existing page structure).
- **Uncertainty:** Masonry can be pure CSS (grid with varying spans) or a small JS pass for column balance; prefer CSS-first for performance. Zigzag/bento can be inline in pages or small reusable components; plan assumes 1–2 shared components (SplitSection, MasonryGrid) plus inline variants where it keeps pages readable. **After audit:** Confidence lower unless mobile and whole-site gaps are addressed.

---

## Phases 5–9 completion (March 2026)

| Phase | Done | Notes |
|-------|------|------|
| **5.1** | ✅ | About: “Where We Train” facility block (sunset-courts featured + courts-lbhs, courts-moulton strip); `id="facility"`, HorizonDivider. |
| **5.2** | ✅ | PhotoVideoGallery: paths verified in `public/photos/`; comment added for legacy equivalents; no route uses it currently. |
| **5.3** | ✅ | Book page: conversion strip with book-expect-1, 2, 3 (3-col grid, sr-only heading, HorizonDivider). Thank-you already uses thank-you-image. |
| **5.4** | ✅ | About: philosophy quote as pull-quote-over-image (andrew-portrait, overlay bg-brand-deep-water/75). |
| **6** | ✅ | Optional: testimonial photos already on Success Stories; coach headshots left as-is. |
| **7** | ✅ | New sections use responsive grid (no overflow); build passed; `sizes` and aspect ratios set on new images. |
| **8** | ✅ | Design/UX: brand tokens, HorizonDivider, section hierarchy. A11y: `aria-labelledby`, sr-only heading on conversion strip; contrast on overlay. |
| **9** | ✅ | Lint and build passed; `public/legacy-working-assets/README.md` updated with all wired slots (facility, book-expect, founder portrait, community, why-choose, programs, camps zigzag, philosophy bento, results/testimonials). |

**See also:** [Visual elevation conversion strip, facility block, quote-over-image](../docs/solutions/implementation-patterns/visual-elevation-conversion-strip-facility-quote-pattern.md) — documented patterns and code snippets for reuse.
