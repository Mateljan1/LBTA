# Homepage Full Overhaul — Implementation Plan

**Scope:** Layout/UX, copy, and imagery in one plan, broken into phases for implementation and review.  
**Sources:** Screenshot critique, `assets/Programming- Info` (parent layer, fun-first, progression, LBTA brand), Andrew Mateljan bio (see `assets/Programming- Info/Andrew_Mateljan_LBTA_Bio.docx` — copy to be aligned with bio; key facts also on `/coaches/andrew-mateljan`), .cursorrules, LBTA messaging skill.

---

## Overview

Transform the LBTA homepage from a long scroll with potential overlay clutter and generic copy into a clear, benefit-driven, visually coherent experience: hero-first, one primary CTA, section-specific imagery, and copy that reflects Movement. Craft. Community. and the founder’s voice without hype.

---

## Problem Statement

1. **Hero / first screen** — Any stacked form overlays (e.g. exit-intent + bottom CTA form) read as two blocks; hero should own the fold with tagline + single primary CTA. No form in hero.
2. **Copy** — Some lines are generic (“unlock your full potential”); CTAs (“Join Now”) are vague. Need LBTA-specific, benefit-led copy and clear actions (Book a Trial, View Programs, See Schedules).
3. **Imagery** — Section images are sometimes generic. Need a clear brief per section so you can choose or shoot the right assets (adult groups, juniors having fun, coach instructing, facilities, tournaments, footer).
4. **Flow** — One primary path: see value → trust founder → see programs → act (Book Trial / View Schedules). Layout and order should support that.

---

## Proposed Solution (High Level)

- **Layout/UX:** Keep hero minimal (video, tagline, “Book a Trial” only). Ensure exit-intent does not open on load; bottom “Get Started” stays one form, not two stacked. Consider shortening or reordering sections so “Programs” and “Get Started” feel closer to the fold for intent users. Sticky CTA remains.
- **Copy:** Replace generic lines with specific, calm, confident LBTA voice; add a short benefit-led subline under the hero tagline; make all CTAs action-specific; align founder/results copy with verifiable bio and current player info (e.g. Karue Sell ranking per research).
- **Imagery:** Define a **section-by-section image/video brief** (what to show, aspect ratio, alt text). You supply assets; we wire paths and alt. Optional: add a **media checklist** file you can tick as assets are ready.

Phases below are ordered so layout and copy can ship first; imagery can follow as assets become available.

---

## Implementation Steps

### Phase 1: Layout & UX (Hero + CTAs, No New Components)

- [x] **1.1** **Hero only** — Confirm hero has no inline form. Only: video, “Tennis, as it should be taught.”, “Movement. Craft. Community.”, single “Book a Trial” button, scroll cue. If any component injects a form into the hero, remove or relocate it.
- [x] **1.2** **ExitIntentPopup** — Ensure it never shows on initial load (e.g. exit-intent or scroll threshold only). If it can show on load in any build, add a guard (e.g. `!hasShown && (scrollY > X || exitIntent)`).
- [x] **1.3** **Bottom CTA** — Keep one form in “Get Started” (HomeCTAForm). Ensure it’s not duplicated and doesn’t appear as a second “stacked” block in the hero. Label the section clearly (“Get Started” or “Start with a Trial”) and keep one primary button label (e.g. “Request a Trial” or “Join Now” → align with copy phase).
- [x] **1.4** **Sticky CTA** — Keep StickyCTA; ensure z-index and placement don’t clash with header or any new elements. Text can stay “Book Trial” or match Phase 2 CTA language.
- [x] **1.5** **Mobile** — Confirm hero video and text stack correctly at 320px and 375px; no horizontal scroll; touch targets ≥48px for hero CTA and scroll cue.

### Phase 2: Copy Overhaul (Voice, CTAs, Founder, Results)

- [x] **2.1** **Single source for homepage copy** — Create `data/homepage-copy.json` (or extend an existing data file) with: hero tagline, hero subline, section headings, section sublines, CTA labels, founder quote, results line (e.g. Karue). Page and components import from it. Enables one-place copy updates and consistency.
- [x] **2.2** **Hero** — Add a short benefit-led subline under “Movement. Craft. Community.” (e.g. “Premier tennis in Laguna Beach — from first swings to college pathway. Free trial.”). Keep tagline as is unless you request a change. Primary CTA label: “Book a Trial” (no “Join Now” in hero).
- [x] **2.3** **Founder section** — Keep “Founded in Laguna Beach by Andrew Mateljan” and the quote. Align bullet facts with bio/coaches page (Ojai, Redlands, international coaching, 25 years). Remove or soften any claim that conflicts with research (e.g. “ATP #262” for Karue → update to current or “ATP Tour” if you prefer to avoid rank).
- [x] **2.4** **Results section** — Headline and Karue line: use current ranking or neutral wording (“ATP Tour player coached by Andrew Mateljan”). Avoid “unlock your full potential”; replace with a line that reflects structure, repetition, trust (per research) or a specific outcome.
- [x] **2.5** **Philosophy / Programs / Community** — Replace generic phrasing with LBTA-specific lines (e.g. “From red ball to college prep” stays; “unlock your full potential” → e.g. “Build your game on movement, structure, and community.”). All section sublines: calm, specific, no exclamation points.
- [x] **2.6** **CTAs sitewide** — Primary: “Book a Trial” (hero, sticky). Secondary: “View Programs”, “See Schedules”, “Read Andrew’s Story”, “Watch His Journey”. Bottom form submit: “Request a Trial” or “Get Started” (one clear label). No “Join Now” as primary hero CTA.
- [x] **2.7** **Forbidden words** — Ensure no “maximize,” “boost,” “elite,” “world-class,” “mastery,” “Sign up now!,” “Don’t miss out!” (per .cursorrules). LBTA messaging: confident, human, aspirational, calm, cinematic.

### Phase 3: Imagery Brief & Asset Wiring

- [x] **3.1** **Image/Video brief document** — Add `docs/homepage-media-brief.md` (or `plans/homepage-media-brief.md`) that lists each homepage section and for each: purpose, what to show, aspect ratio, suggested alt text, and current path (e.g. `/images/hero/laguna-horizon.webp`). You use this to pick or shoot assets; we only change paths and alt when you provide new files.
- [x] **3.2** **Section-by-section brief (content)** — Populate the brief with the following. Existing paths stay until you replace assets.

| Section | Purpose | What to show | Aspect | Current path | Alt (example) |
|--------|---------|--------------|--------|--------------|----------------|
| Hero | Set tone, Laguna + tennis | Energetic training or play; courts; optional ocean hint | 16:9 or 21:9 | Video + poster | “LBTA training on court at Laguna Beach” |
| Founder | Trust, human | Andrew portrait, approachable | 4:5 or 3:4 | `/images/founder/andrew-portrait.webp` | “Andrew Mateljan, founder and head coach” |
| Results | Proof | Karue (or one pro) in focused training | 16:9 crop | `/images/results/karue-training.webp` | “ATP player in training session” |
| Philosophy (×3) | Movement, Craft, Community | Movement: footwork/drill; Craft: structure/technique; Community: group/team | 1:1 | `/images/philosophy/*.webp` | “[Pillar name] — [short description]” |
| Programs (×3) | Junior, Adult, Private | Juniors: kids + coach or group; Adults: adults in lesson/social; Private: one-on-one focus | 4:3 | `/images/programs/*.webp` | “Junior pathway at LBTA” etc. |
| Destination | Place, aspiration | Courts + horizon or Laguna context | 16:9 | `/images/hero/laguna-horizon.webp` | “Laguna Beach tennis courts with ocean view” |
| Community | Belonging | Real players/families, variety of ages | 4:3 | `/images/community/community-*.webp` | “LBTA community member” |
| Video | Trust, coach voice | Andrew (or coach) speaking to camera, concise | 16:9 | (VideoTestimonials) | “Andrew Mateljan on LBTA philosophy” |
| Footer CTA | Close, action | Courts at sunset or inviting courts | 16:9 | `/images/cta/cta-background.webp` | “Laguna Beach tennis courts at sunset” |

- [x] **3.3** **Optional: Asset checklist** — Add a short checklist (in the same doc or `data/homepage-assets.json`) that lists each slot and a “ready” flag so you can mark when each asset is chosen and dropped into `public/images/` or `public/videos/`.
- [x] **3.4** **Implementation** — No hardcoding of new image paths until you provide files. Code changes in this phase: (1) add the brief and optional checklist, (2) ensure all existing `<Image>` and `<video>` use `alt`/`aria-label` and `sizes` per .cursorrules.

### Phase 4: Polish & Accessibility

- [x] **4.1** **Focus and contrast** — Hero CTA: solid bg (e.g. white on dark) for 7:1; all CTAs min-h 48px; focus ring visible. Footer and dark sections: text at least text-white/50.
- [x] **4.2** **Reduced motion** — Any scroll-triggered or animated behavior (e.g. HomeHero parallax, AnimatedSection) respects `prefers-reduced-motion` (existing patterns in codebase).
- [x] **4.3** **HomeCTAForm** — Labels (sr-only or visible) and live region for submit error/success per existing a11y audit.

---

## Files to Create / Modify

| File | Action | Purpose |
|------|--------|---------|
| `data/homepage-copy.json` | Create (or extend `data/`) | Single source for hero, sections, CTAs. |
| `app/page.tsx` | Modify | Use copy from data; optional section order tweak. |
| `components/HomeHero.tsx` | Modify | Add subline from data; ensure no form. |
| `components/HomeCTAForm.tsx` | Modify | Button label from data; a11y if needed. |
| `components/ExitIntentPopup.tsx` | Modify | Guard so it never shows on initial load. |
| `docs/homepage-media-brief.md` or `plans/homepage-media-brief.md` | Create | Section-by-section image/video brief and optional checklist. |
| `app/coaches/andrew-mateljan/page.tsx` | Modify | Align player ranks and bio with research/bio doc if desired (can be separate small pass). |
| Section components that render copy | Modify | Pull from homepage-copy data where applicable. |

---

## Success Criteria

- [x] Hero: one tagline, one subline, one “Book a Trial” CTA; no form in hero; no overlay on load.
- [x] Exit intent: does not show on first paint; only on exit intent or after scroll.
- [x] Copy: no generic “unlock your full potential”; CTAs are action-specific; tone calm and on-brand.
- [x] Founder/results: aligned with bio and current player info (rankings updated or neutral).
- [x] Imagery: brief document exists; all current images have appropriate alt and sizes; you have a clear list of what to supply.
- [x] Accessibility: 7:1 where required; 48px targets; reduced motion respected.
- [x] Data: homepage strings in one place (homepage-copy or equivalent); no hardcoded copy in hero/CTA.

---

## Research & Context

- **Screenshot critique** — Hero overlays, copy clarity, CTA specificity, section imagery.
- **assets/Programming- Info** — Parent layer (development visibility, mastery climate), fun-first mandate, Laguna Beach as brand, Aman test, flywheel; retention and progression research (informs tone and claims, not backend build).
- **Andrew_Mateljan_LBTA_Bio.docx** — Authoritative source for founder copy; use for “Playing Career” and “Coaching Career” bullets. (Doc is binary; extract key lines in a session or provide a .txt/.md export.)
- **Project Dynasty / research notes** — Use for fact-checking only (e.g. Karue current rank, GPTCA, European years); do not expose internal research on the public site.
- **.cursorrules** — Typography (Cormorant, DM Sans), color tokens, no forbidden words, 48px targets, contrast.
- **LBTA messaging skill** — Tagline “Tennis, as it should be taught.”; pillars Movement, Craft, Community; voice: confident, human, aspirational, calm, cinematic.

---

## Relevant Learnings (Compound / .cursorrules)

- Single source for copy → `data/homepage-copy.json` (or similar).
- Hero CTA on dark: solid background for contrast (bg-white text-black or equivalent).
- Footer/dark sections: text-white/50 or higher.
- No “elite,” “world-class,” “maximize,” “Sign up now!” in user-facing copy.
- Images: `next/image`, required `alt` and `sizes`; WebP preferred; no stock if avoidable.

---

## Risks & Mitigations

| Risk | Mitigation |
|------|------------|
| Bio doc not machine-readable | Copy for founder section can be taken from current coaches page + your manual edits from the bio. |
| New imagery not ready | Brief and checklist still ship; we only swap paths when you add files. |
| ExitIntent logic breaks | Guard with a simple condition (e.g. hasScrolledPastX or exitIntent only); test on dev. |
| Copy feels same | Use LBTA messaging and forbidden-word list; keep sublines short and specific. |

---

## What You Need to Provide (Imagery)

Once the brief is in place, you’ll know exactly what to supply:

1. **Hero** — Video (or keep current) + poster image; energetic, on-brand.
2. **Founder** — One strong portrait of Andrew (current path can stay until you replace).
3. **Results** — One key image (e.g. Karue or pro in training).
4. **Philosophy** — Three images: movement (footwork/drill), craft (structure/technique), community (group/team).
5. **Programs** — Three: juniors (kids + coach/group), adults (adults in lesson/social), private (one-on-one).
6. **Destination** — Courts + horizon or Laguna context (current laguna-horizon can stay).
7. **Community** — 6 slots: variety of ages, real players/families.
8. **Video** — Andrew (or coach) speaking to camera; keep concise.
9. **Footer CTA** — Courts at sunset or inviting courts.

Formats: WebP for images where possible; video WebM/MP4 as per current setup. No need to send assets in one go; we can wire them as you add files to `public/images/` and `public/videos/`.

---

## Next Step

After you approve this plan, implementation can proceed in order: **Phase 1 (layout/UX)** → **Phase 2 (copy)** → **Phase 3 (brief + wiring)** → **Phase 4 (a11y polish)**. Each phase can be reviewed and merged separately. If you want to prioritize only hero + copy first, we can do Phase 1 + 2 and defer 3–4.
