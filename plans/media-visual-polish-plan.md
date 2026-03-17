# LBTA Media & Visual Polish — Implementation Plan

**Compound Engineering: Plan phase**  
**Objective:** Make the site visually best-in-class with pro player photos, adult/group content, stronger testimonials, and optional social/live elements so LBTA clearly differentiates from other academies.

**Canva asset list:** All photos and videos we need (by subject, age, level, and use) are in **`plans/canva-asset-brief.md`**. Use that doc in Canva to build/curate assets; export at the sizes listed there; we add them to the project and wire into the site.

---

## Overview

Audit the entire site for media gaps; add or wire hero/section imagery (including adult, pro, and group shots); improve testimonials and success stories with photo/video; surface the existing PhotoVideoGallery; and optionally add an Instagram/social or “latest from the courts” block. Use existing assets in `plans/LBTA_website_pics` and new assets from **Canva (per `plans/canva-asset-brief.md`)**; follow the project’s image spec (WebP, ≤350KB, `next/image` with `alt` and `sizes`).

---

## Problem Statement

- **Weak or missing visuals:** Philosophy, Book, FAQ, apply-scholarship, match-play, and leagues/USTA/UTR pages use gradient/text-only heroes. Adult and pro/group imagery is thin (adult-trial and beginner-program share one hero; no distinct adult group or pro visuals).
- **Unused or underused assets:** PhotoVideoGallery exists but is not used; 23 philosophy-pillar and 4 coastal-court assets in `plans/LBTA_website_pics` are not wired into the site.
- **Testimonials:** VideoTestimonials (Vimeo) and success-story cards are strong; the testimonial “wall” is text-only. TestimonialQuote and SocialProof components exist but are not used.
- **No live/social proof on site:** Footer links to Instagram/Facebook but there is no embedded feed or “latest from the courts” section to show real-time quality and community.
- **Differentiation:** Competitors and best practices (Tennis Tribe, 4Slam, Flockler, Testimonial Star) emphasize personalized facility/staff/player imagery, video testimonials, and UGC/social feeds to build trust and conversions. LBTA has the content; the site does not yet surface it to maximum effect.

---

## Proposed Solution

1. **Asset pipeline & heroes**
   - Copy/optimize coastal and philosophy assets from `plans/LBTA_website_pics` into `public/images/` per image-spec (WebP, sizes, alt).
   - Add page-specific heroes where missing: Philosophy, Success Stories, Book, Camps (optional alternate), Leagues/USTA/UTR, Match Play, FAQ (optional).
   - Introduce distinct **adult** and **adult group** imagery: e.g. adult-hero, adult-group-hero, leagues-hero (adults on court / league play).

2. **Pro player & results**
   - Keep/expand Karue and results section; add 1–2 more “pro/college” stills or short clips if available (e.g. D1 placements, high-performance).
   - Ensure results section is above the fold or in a clear “Proof” block on homepage and success-stories.

3. **Philosophy page**
   - Add a hero image (e.g. from philosophy-pillars or coastal set).
   - Add a visual “pillars” strip: 3 images (Movement, Craft, Community) from LBTA-Philosophy-Pillars-800x800, with short captions.

4. **Testimonials & social proof**
   - Use TestimonialQuote for a “quote + author” strip on homepage or success-stories (optional second block).
   - Add optional “quote + photo” for 2–3 key testimonials (author headshots or on-court) if assets exist.
   - Consider one more Vimeo slot (e.g. adult-focused) in VideoTestimonials if available.

5. **Gallery & facility**
   - Use PhotoVideoGallery on About (or a dedicated “Facility” subsection) once gallery assets are in `public/photos/` and optimized (≤350KB per image). Rename `Court setting.webp` → `court-setting.webp` if used.

6. **Social / “latest from the courts”**
   - **Option A (light):** “Latest from Instagram” block: 4–6 curated images linking to Instagram (manual update or simple JSON list of image URLs + links). No third-party embed to avoid layout/performance issues.
   - **Option B (embed):** Instagram embed (e.g. Flockler, or official Instagram embed) for a feed — document trade-offs (API changes, performance, moderation).
   - **Option C:** “Recent moments” section: 4–6 images from `public/images/` (e.g. community, camps, leagues) with captions and “Follow us @lagunabeachtennisacademy” CTA. No external dependency.

7. **Layout tweaks**
   - Success-stories: optional hero image (e.g. success-stories-hero.webp).
   - Leagues / USTA / UTR: add hero image + one “league play” or “adult group” image in body.
   - Book: optional hero (courts at golden hour) instead of dark-only.
   - Philosophy: hero + pillars strip as above.
   - Homepage: ensure “Why Choose” and “Community” use best-available assets (wire coastal/philosophy if better than current placeholders).

8. **Documentation**
   - Update `plans/homepage-media-brief.md` and `plans/image-spec-best-in-class.md` with new slots (adult-hero, adult-group, leagues-hero, philosophy-hero, success-stories-hero, optional Instagram/moments).
   - Add a short “Media checklist” in `docs/` for which pages have heroes and which still need assets.

---

## Canva workflow (you → project)

1. **Open** `plans/canva-asset-brief.md` — it lists every photo and video we need, broken down by:
   - **Subject:** Junior girl/boy, adult, adult group, coach, pro, facility.
   - **Age range:** e.g. 4–8 (red ball), 8–14 (juniors), 12–18 (HP), 25–60 (adults).
   - **Level:** Beginner, intermediate, advanced, pro.
   - **Activity:** Hitting, lesson, clinic, league, match play, celebration, etc.
   - **Where it goes:** Hero, program card, philosophy pillar, community grid, gallery, testimonial.
2. **In Canva:** Create or curate each asset at the **exact sizes** in the brief (heroes 1920×1080, cards 800×600, portraits 600×800, etc.).
3. **Export:** PNG/JPG is fine; we convert to WebP and compress. Video: MP4 1920×1080 for hero; testimonial videos → Vimeo, we embed.
4. **Hand off:** Drop files into the repo (e.g. `public/images/` or a folder you specify) or share paths; we’ll name per brief, convert, and wire into pages.

---

## Implementation Steps

### Phase 0: Gather assets (Canva + existing)

- [ ] **0.1** Work through `plans/canva-asset-brief.md` in Canva; export Tier 1 (heroes, adult, Why Choose, philosophy pillars, Karue) first.
- [ ] **0.2** Export Tier 2 (programs, camps, community, destination, CTA) and Tier 3 (gallery, coaches, testimonial photos, videos) as ready.
- [ ] **0.3** Add exported files to project (e.g. `public/images/` subfolders: hero, programs, philosophy, community, results, why-choose, coaches, photos) or provide paths for dev to copy.

### Phase 1: Asset pipeline & wiring existing assets

- [ ] **1.1** Copy coastal WebPs from `plans/LBTA_website_pics/.../webp/` into `public/images/` (e.g. hero, why-choose, or destination) per image-spec; ensure ≤350KB; add to image-spec doc.
- [ ] **1.2** Copy philosophy-pillar WebPs (e.g. 3 for Movement/Craft/Community) into `public/images/philosophy/`; ensure filenames match or update code (movement, discipline, belonging or equivalent). If using Canva outputs instead, use assets from Phase 0 per `canva-asset-brief.md` §5.
- [ ] **1.3** Add Canva-exported assets from Phase 0 into correct `public/images/` subfolders; convert to WebP and compress (heroes ≤350KB, cards ≤200KB); name per `canva-asset-brief.md`.
- [ ] **1.4** Add any missing community/results/programs assets referenced in code (or confirm fallbacks and document in image-spec §9).
- [ ] **1.5** Create placeholder or real paths for: adult-hero, adult-group-hero, leagues-hero, philosophy-hero, success-stories-hero, book-hero (optional). Document in image-spec §10.

### Phase 2: Page heroes & section imagery

- [ ] **2.1** Philosophy page: add hero image (e.g. `philosophy-hero.webp` or laguna-horizon); add 3-pillar image strip with captions (Movement, Craft, Community) using philosophy assets.
- [ ] **2.2** Success-stories: add optional hero image (success-stories-hero.webp or results/community).
- [ ] **2.3** Book page: add optional hero (book-hero.webp or laguna-horizon) so the section isn’t dark-only.
- [ ] **2.4** Leagues / USTA / UTR pages: add hero image + one in-body “league play” or adult group image; use leagues.webp or new leagues-hero when available.
- [ ] **2.5** Match-play and FAQ: add optional hero or keep gradient; document in media checklist.
- [ ] **2.6** Adult trial vs beginner-program: if distinct adult-hero exists, use it for one of the two to differentiate.

### Phase 3: Testimonials & social proof

- [ ] **3.1** Add TestimonialQuote block to homepage or success-stories (pick 2–3 strongest quotes; no photo required initially).
- [ ] **3.2** Optionally add “quote + photo” for 1–2 testimonials if author headshots or on-court shots are available (new slot in image-spec).
- [ ] **3.3** Evaluate adding one more VideoTestimonials entry (e.g. adult-focused) if a Vimeo ID is available.
- [ ] **3.4** Consider using SocialProof component on homepage (trust badges) if design matches; otherwise leave as-is.

### Phase 4: Gallery & facility

- [ ] **4.1** Ensure `public/photos/` has 5 gallery images (LBCOURTSETTING, VideoAnalysisRoom, GymSetting, OncourtTraining, court-setting); optimize to ≤350KB WebP; fix filename space in `Court setting.webp` → `court-setting.webp` in component.
- [ ] **4.2** Add PhotoVideoGallery to About page (e.g. “Facility” or “At the Academy” section) or create a small “Gallery” subsection.
- [ ] **4.3** If gallery is too heavy for About, add a “Gallery” or “Facility” link in nav/footer and a minimal gallery page that uses PhotoVideoGallery.

### Phase 5: Social / “latest from the courts”

- [ ] **5.1** Decide approach: Option A (curated list), B (Instagram embed), or C (recent moments from local images). Document in docs (e.g. docs/social-feed-options.md).
- [ ] **5.2** Option A or C: Add “Latest from the courts” or “Recent moments” section (homepage or dedicated section): 4–6 images + captions + “Follow @lagunabeachtennisacademy” CTA. Data source: JSON or static list in code.
- [ ] **5.3** Option B: Implement Instagram feed (e.g. Flockler or official embed); add to layout and document API/performance/cache in docs.
- [ ] **5.4** Ensure footer Instagram link remains; optional “See more on Instagram” link in the new section.

### Phase 6: Layout polish & copy

- [ ] **6.1** Review homepage “Why Choose” and “Community” images; swap in coastal/philosophy assets if they test better.
- [ ] **6.2** Ensure pro/results (Karue + D1) are prominent on homepage and success-stories (above fold or clearly visible).
- [ ] **6.3** Add or adjust captions for key images (alt text already required; optional visible captions for gallery and “recent moments”).
- [ ] **6.4** Run responsive pass (320–1440px) and LCP check (hero images priority, sizes correct).

### Phase 7: Documentation & handoff

- [ ] **7.1** Update `plans/homepage-media-brief.md` with new sections (adult, leagues, philosophy hero, social/moments).
- [ ] **7.2** Update `plans/image-spec-best-in-class.md` §9–§10 with new paths and checklist.
- [ ] **7.3** Add `docs/media-checklist.md` (or section in quality-gate): list pages, hero status, and “still need” assets for adult/pro/group.
- [ ] **7.4** If Option B (Instagram) chosen: add `docs/instagram-feed.md` with setup, limits, and cache/performance notes.

---

## Files to Create/Modify

| File | Action | Purpose |
|------|--------|---------|
| `app/philosophy/page.tsx` | Modify | Add hero image; add 3-pillar image strip with philosophy assets |
| `app/success-stories/page.tsx` | Modify | Optional hero; optional TestimonialQuote block |
| `app/about/page.tsx` | Modify | Add PhotoVideoGallery section (or link to gallery page) |
| `app/page.tsx` | Modify | Optional TestimonialQuote; optional “Latest from the courts” block; swap Why Choose/Community images if needed |
| `app/book/page.tsx` | Modify | Optional hero image |
| `app/programs/leagues/page.tsx` | Modify | Add hero + one league/adult group image |
| `app/programs/usta-adult-league/page.tsx` | Modify | Add hero if not shared with leagues |
| `app/programs/utr-match-play/page.tsx` | Modify | Add hero if desired |
| `app/match-play/page.tsx` | Modify | Optional hero |
| `components/ui/PhotoVideoGallery.tsx` | Modify | Use `court-setting.webp` (no space in filename); ensure paths point to `public/photos/` |
| `components/VideoTestimonials.tsx` | Modify | Optional: add one more Vimeo entry (adult) |
| `components/TestimonialQuote.tsx` | Use | Import and render on homepage or success-stories |
| `components/SocialProof.tsx` | Use (optional) | Import on homepage if design fits |
| New: `components/LatestFromCourts.tsx` or `InstagramCurated.tsx` | Create | Option A/C: curated images + CTA to Instagram |
| New: `data/courts-moments.json` or similar | Create | Optional: list of image paths + captions for “recent moments” |
| `public/images/` (various) | Add files | Heroes and section images from plans/LBTA_website_pics + new shoots |
| `public/photos/` | Add/optimize | Gallery WebPs ≤350KB; rename Court setting → court-setting |
| `plans/homepage-media-brief.md` | Modify | New sections for adult, leagues, philosophy, social |
| `plans/image-spec-best-in-class.md` | Modify | §9–§10 new paths and checklist |
| New: `docs/media-checklist.md` | Create | Page-by-page hero and “need” list |
| New: `docs/social-feed-options.md` | Create | If Option B: Instagram embed notes |
| `plans/canva-asset-brief.md` | Created | Full list of photos/videos by subject, age, level; Canva export specs; priority tiers |

---

## Success Criteria

- [ ] Every key page has a hero image or intentional gradient (no “missing” hero where a competitor would have one).
- [ ] Philosophy page has hero + 3-pillar visuals (Movement, Craft, Community).
- [ ] Adult and adult-group imagery appears on at least: adult-trial or beginner-program, and leagues or programs.
- [ ] Pro/results (Karue + D1) clearly visible on homepage and success-stories.
- [ ] PhotoVideoGallery is live (About or gallery page) with optimized assets.
- [ ] At least one of: TestimonialQuote block, “quote + photo” testimonials, or extra video testimonial is in place.
- [ ] At least one of: “Latest from the courts” (curated), “Recent moments,” or Instagram feed is on the site.
- [ ] Image spec and homepage-media-brief updated; media checklist doc exists.
- [ ] LCP ≤2.5s; no new images >350KB where spec says ≤350KB; all new images use `next/image` with `alt` and `sizes`.
- [ ] Build and lint pass; responsive 320–1440px checked.

---

## Research Sources

- Codebase: explore agent report (media usage, gaps, PhotoVideoGallery unused, TestimonialQuote/SocialProof unused).
- `plans/homepage-media-brief.md`, `plans/image-spec-best-in-class.md`, `docs/archive/PHOTOS_I_NEED.md`.
- Web: Tennis Tribe (personalized imagery, no stock); 4Slam (hero + trust); Flockler (UGC/social walls); Testimonial Star (video testimonials); Joshua Creek (sleek, performance-focused visuals).
- `plans/LBTA_website_pics`: LBTA-Coastal-Courts-1920x1080 (4 webp), LBTA-Philosophy-Pillars-800x800 (23 images).

---

## Relevant Learnings

- **Single source of truth:** Image paths and specs live in image-spec and homepage-media-brief; new assets get a row and checklist tick.
- **Performance:** WebP ≤350KB; `priority` only for LCP hero; `sizes` for all `next/image`.
- **Brand:** No stock; real courts, players, coaches. Luxury restraint; 40%+ white space; Cormorant + DM Sans.
- **Accessibility:** All images require descriptive `alt` (<125 chars); optional visible captions for gallery/moments.

---

## Risks & Mitigations

| Risk | Mitigation |
|------|------------|
| Philosophy/coastal assets not optimized | Re-export to WebP at spec sizes before copy to public. |
| Instagram API/embed breakage or layout shift | Prefer Option A or C (curated/local); if Option B, use robust embed and document cache/fallback. |
| Too many new images hurts LCP | Use `priority` only on 1–2 heroes per page; lazy-load below-fold gallery and “moments.” |
| Missing adult/pro photos | Document needed shots in media-checklist and image-spec; use placeholders (e.g. laguna-horizon or existing community) until real assets exist. |

---

## What Would Make LBTA Visually “The Best”

1. **Pro and results front and center** — Karue + D1 placements with strong imagery and optional short video.
2. **Adult and group parity** — Dedicated adult and adult-group heroes/sections so adults see themselves (leagues, clinics, social play).
3. **Philosophy with visuals** — Hero + Movement/Craft/Community pillars so the philosophy page feels as premium as the rest.
4. **Real facility and moments** — PhotoVideoGallery + “Latest from the courts” (or curated Instagram) so the site feels live and real, not static.
5. **Testimonials that build trust** — Video carousel (already strong) + quote strip and, where possible, face/name (photo) for key testimonials.
6. **Consistent heroes** — No “empty” text-only heroes on key conversion pages (philosophy, success-stories, book, leagues).
7. **One clear “see us live” hook** — Instagram link + optional feed or “Recent moments” so visitors can see ongoing quality and community.

---

---

## Summary: photos/videos we need (by type)

| Category | Count | Subject / level | Where |
|----------|-------|------------------|--------|
| **Heroes** | 10 | Mixed, adult, adult group, juniors, leagues, camps, match play, fitness, book, philosophy | Page heroes (16:9) |
| **Junior** | 9 | Red/orange/green ball, girl/boy hitting, camp action, HP, youth dev | Programs, camps, community |
| **Adult** | 7 | Beginners, intermediate, group clinic, leagues, match play, Cardio | Adult trial, beginner program, leagues |
| **Private / Why Choose** | 4 | Coach + player, facility | Homepage, About, Contact |
| **Philosophy pillars** | 3 | Movement, Craft, Community | Homepage + Philosophy page |
| **Results / pro** | 3 | Karue + 2 more (college/HP) | Homepage, Success Stories |
| **Community** | 6–12 | Variety of ages | Homepage grid, fitness, optional expansion |
| **Facility / gallery** | 5 | Courts, video room, gym, on-court | PhotoVideoGallery (About) |
| **Coach** | 9 | Portraits + action (Andrew, Robert, Peter, Allison) | Coaches, About |
| **Testimonial photos** | 0–3 | Parent, adult player (optional quote+photo) | TestimonialQuote block |
| **Videos** | 1–3 | Hero (15–30s), optional adult testimonial, optional coach | Hero + Vimeo |

Full breakdown with filenames, sizes, and Canva export specs: **`plans/canva-asset-brief.md`**.

---

*Plan created: March 2026. Canva brief added for asset production. Execute Phase 0 (gather/export from Canva) then Phase 1–2 and 4 for highest impact. Phase 5 (social/moments) and 3 (testimonials) can follow.*
