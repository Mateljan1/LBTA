# Site-Wide Polish and Upgrades — Implementation Plan

**Purpose:** One compound-engineering plan for polishes and upgrades across the LBTA site to make it better. Based on plans audit, design-alignment leftovers, compound learnings, and .cursorrules testing checklist.  
**Created:** March 2026

---

## Overview

The site is in good shape: schedules UX, brand guide, coaches, optional polish (Tracks A/B/C), and registration flow are done. This plan addresses **verification gaps**, **missing assets**, **micro-polish**, **performance/SEO**, and **optional enhancements** so the site meets the full quality bar and feels consistently polished everywhere.

---

## Problem Statement

1. **Verification not systematized** — Lighthouse ≥90, responsive at 320/375/768/1024/1440, forbidden-copy pass, and a11y checks are in .cursorrules and design-alignment but not run and recorded in one place. We don’t have a baseline or a repeatable “polish gate.”
2. **Missing assets** — Why Choose section expects two images (`why-choose-1.webp`, `why-choose-2.webp`) that don’t exist; section may show broken or fallback.
3. **Micro-polish** — A few placeholders (e.g. junior-trial form), stale comments (PartnershipSection “placeholder” though logos exist), and optional skip-to-main for a11y.
4. **Performance & SEO** — No automated Lighthouse run; hero video is WebM only (Safari may benefit from MP4); key pages should be audited for unique meta title/description.
5. **Optional upgrades** — Blur placeholders for lazy images, optional dark band, logo audit doc — only if we want to go beyond “shipped.”

---

## Proposed Solution

Five tracks. **Tracks 1–2 are recommended** (verification + missing assets). **Tracks 3–4** are polish and performance/SEO. **Track 5** is optional enhancements.

| Track | Scope | Effort | Priority |
|-------|--------|--------|----------|
| **1. Verification & quality gate** | Lighthouse, responsive, forbidden copy, a11y, build/lint | Small | High |
| **2. Missing assets** | Why Choose images (create folder + fallback or doc) | Small | High |
| **3. Micro-polish** | Placeholders, comments, skip-to-main | Small | Medium |
| **4. Performance & SEO** | Hero MP4, meta audit, Lighthouse script/doc | Small | Medium |
| **5. Optional enhancements** | Blur placeholders, logo audit doc, dark band | Optional | Low |

Tracks 1 and 2 can run in parallel. Track 3 can follow 1. Track 4 can follow 2. Track 5 is pick-and-choose.

---

## Why these are upgrades

| Track | Why it’s an upgrade |
|-------|----------------------|
| **1. Verification & quality gate** | **Trust and consistency.** Best brands don’t guess—they measure. A recorded Lighthouse baseline, responsive pass, and forbidden-copy check turn “we think it’s good” into “we know it meets the bar.” That reduces risk on every future change and aligns with how top companies ship: quality gates, not hope. |
| **2. Missing assets** | **No broken experience.** A single 404 or missing image in a key section (Why Choose) undermines perceived quality. Fixing it (fallback + doc) means every visitor sees a complete, intentional experience—the standard luxury and premium sites hold themselves to. |
| **3. Micro-polish** | **Detail = premium.** Skip-to-main is expected by accessibility standards and power users; neutral placeholders and accurate comments signal “we care about every pixel and word.” Small touches compound into a feeling that the site is maintained and professional. |
| **4. Performance & SEO** | **Reach and speed.** Safari users get a working hero (MP4); unique meta helps every key page rank and preview correctly. Performance is a conversion lever (every second of delay can cost ~7% conversions); SEO is how new families find you. Both are table stakes for best-in-class sites. |
| **5. Optional** | **Beyond shipped.** Blur placeholders and logo audit are “nice to have” that push the site toward the polish level of top design-led brands. |

---

## Is this plan 10/10?

**Short answer: No—and that’s by design.**

- **What this plan is:** A **foundation** plan. It closes gaps (verification, missing assets, a11y, performance/SEO) and gets the site to a **reliable, measurable quality bar**. That’s exactly what you need before layering on “world-class” features.
- **What would make it 10/10 for “best in the world”?** The current plan does not yet include:
  - **Emotional and conversion design** (trust stack, social proof placement, risk reversal)
  - **Experience** (personalization, journey-based content, “boutique” feel)
  - **Marketing and selling** (lead magnets, clear value props by segment, retention touchpoints)
  - **Modern tech** (optional personalization, dynamic content, or measurable conversion loops)

So: **as a polish-and-verification plan, it’s strong (8/10).** It’s not 10/10 for “designing, selling, marketing, and experiencing like the best companies in the world” until we add the next-level layer below.

---

## Implementation Steps

### Track 1: Verification & quality gate

**Goal:** Run and record the checks from .cursorrules Part 16 and design-alignment verification so we have a baseline and a repeatable process.

- [x] **1.1** **Lighthouse** — Run Lighthouse (homepage + schedules + one program page) for Performance, Accessibility, Best Practices, SEO. Record scores in `docs/lighthouse-baseline.md` (or `plans/`). Fix any score &lt; 90 if feasible (e.g. image `sizes`, LCP).
- [ ] **1.2** **Responsive** — Test 320px, 375px, 768px, 1024px, 1440px on homepage, schedules, contact, book. Fix horizontal scroll or overflow. Record “Responsive check passed” and date in same doc.
- [x] **1.3** **Forbidden copy** — Grep for forbidden words/phrases (maximize, boost, elite, world-class, mastery, “Sign up now!”, “Don’t miss out!”). Replace or document exception. Add to doc: “Forbidden copy pass: clean (date).”
- [x] **1.4** **Accessibility** — Spot-check: 7:1 contrast (footer/dark sections text-white/50+), hero CTA solid bg, keyboard nav, focus states, 48px touch targets. Optionally run axe or Lighthouse a11y. Record in doc.
- [x] **1.5** **Build and lint** — `npm run build` and `npm run lint` clean. Document in README or `docs/quality-gate.md` that “Every PR: build + lint; periodically: Lighthouse + responsive + forbidden copy.”

**Files to create/modify**

| File | Action | Purpose |
|------|--------|---------|
| `docs/lighthouse-baseline.md` or `docs/quality-gate.md` | Create | Record Lighthouse scores, responsive pass, forbidden copy, a11y, build/lint. |
| `README.md` | Modify (optional) | Add “Quality gate” subsection linking to doc and checklist. |
| Any page/component | Modify | Only if Lighthouse or a11y findings require code fixes. |

**Success criteria**

- [ ] One doc exists with baseline Lighthouse (or “see last run”), responsive pass, forbidden copy pass, a11y note, build/lint.
- [ ] No horizontal scroll at required breakpoints; no forbidden copy in user-facing strings.
- [ ] Build and lint pass.

---

### Track 2: Missing assets (Why Choose)

**Goal:** Why Choose section has two image paths that don’t exist. Either add fallbacks so the section never breaks, or create the folder and document expected files.

- [x] **2.1** **Create folder** — `public/images/why-choose/`. Add `.gitkeep` or leave empty if assets supplied later.
- [x] **2.2** **Fallback in code** — In `app/page.tsx` (or component that renders Why Choose), if image paths are from `homepage-copy.json`, ensure missing images don’t throw: use existing placeholder (e.g. `laguna-horizon.webp` or `community-1.webp`) as fallback when file doesn’t exist, or render a neutral block. Option: use `require()` with try/catch or Next.js `onError` for Image; or keep current paths and add two real files once supplied.
- [x] **2.3** **Document** — In `plans/homepage-media-brief.md` or asset list (Desktop copy), state that `why-choose-1.webp` and `why-choose-2.webp` are required for full design; fallback is X. If you already added the two images, skip 2.2 and just document.

**Files to create/modify**

| File | Action | Purpose |
|------|--------|---------|
| `public/images/why-choose/` | Create | Folder for two images. |
| `app/page.tsx` or Why Choose block | Modify | Fallback image or safe handling when files missing. |
| `plans/homepage-media-brief.md` or asset list | Modify | Note Why Choose images and fallback. |

**Success criteria**

- [ ] Why Choose section never breaks (no 404 images or uncaught errors).
- [ ] Either two WebP files present or fallback documented and implemented.

---

### Track 3: Micro-polish

**Goal:** Small UX and copy cleanups: placeholders, stale comments, skip-to-main.

- [x] **3.1** **Junior-trial form placeholders** — In `app/junior-trial/page.tsx`, change placeholder text from “Jane Smith”, “jane@example.com”, “(949) 123-4567” to neutral “Your name”, “Email”, “Phone” (or keep as-is if you prefer example format). Ensure labels/aria remain correct.
- [x] **3.2** **PartnershipSection comment** — Remove or update the comment “Using placeholder text until PNGs are uploaded” if logos are in place; or leave and add “Logos in `/public/logos/`.”
- [x] **3.3** **Skip-to-main link** — Add a “Skip to main content” link at the top of the document (visible on focus, e.g. first Tab). Links to `#main-content` or main landmark. Layout or Header: one focusable link, styled for focus ring; main content has `id="main-content"` or equivalent. Check `app/layout.tsx` and `components/layout/Header.tsx`.

**Files to create/modify**

| File | Action | Purpose |
|------|--------|---------|
| `app/junior-trial/page.tsx` | Modify | Placeholder text (optional). |
| `components/ui/PartnershipSection.tsx` | Modify | Comment only. |
| `app/layout.tsx` or `Header.tsx` | Modify | Skip-to-main link; ensure main has id. |

**Success criteria**

- [ ] No misleading “placeholder” comment if assets exist.
- [ ] Skip-to-main: first Tab shows link; activating it moves focus to main content.
- [ ] Junior-trial placeholders consistent with intent (example vs neutral).

---

### Track 4: Performance & SEO

**Goal:** Improve Safari hero experience, document performance baseline, and ensure key pages have unique meta.

- [x] **4.1** **Hero video MP4 (optional)** — Add an MP4 source for the hero video (e.g. `LBTA-Home-Hero.mp4`) alongside WebM for Safari. In `HomeHero.tsx`, add `<source src="/videos/LBTA-Home-Hero.mp4" type="video/mp4" />`. You supply the MP4; we wire path. If no MP4, leave WebM only and document.
- [x] **4.2** **Lighthouse / performance script** — Add a short script or npm script (e.g. `npm run lighthouse`) that runs Lighthouse CLI on homepage (and optionally schedules) and outputs to `docs/lighthouse-baseline.md` or a timestamped file. Optional: add to README “Run `npm run lighthouse` to refresh baseline.”
- [x] **4.3** **Meta audit** — Audit key pages (home, schedules, programs, about, contact, book, coaches, camps, faq) for `metadata` or `generateMetadata`: unique `title` and `description` per page. Fix any missing or duplicate. No code change if already unique.

**Files to create/modify**

| File | Action | Purpose |
|------|--------|---------|
| `components/HomeHero.tsx` | Modify | Add MP4 source if file provided. |
| `public/videos/LBTA-Home-Hero.mp4` | Add (you supply) | Safari fallback. |
| `package.json` + script or `scripts/` | Modify / Create | `lighthouse` script and/or doc. |
| `app/**/layout.tsx` or `page.tsx` | Modify | Meta only where missing or duplicate. |

**Success criteria**

- [ ] Hero: WebM + MP4 (if you add MP4) or doc says WebM-only by choice.
- [ ] Lighthouse runnable via script or doc; baseline or “last run” recorded.
- [ ] Key pages have distinct title and description.

---

### Track 5: Optional enhancements

Only if you want to go beyond “shipped”:

- [ ] **5.1** **Blur placeholders** — Add `placeholder="blur"` and `blurDataURL` for below-fold images where it improves perceived performance (optional; can increase bundle if not careful).
- [ ] **5.2** **Logo audit doc** — One-page list: Header, Footer, PartnershipSection (each partner), trial pages, chatbot — path + alt. No code change unless something is wrong.
- [ ] **5.3** **Dark band** — Only if design specifies: thin dark band between hero and founder with “MORE → LESSONS, CAMPS & CLINICS” (design-alignment deferred).
- [ ] **5.4** **PhotoVideoGallery asset size** — Comment in code says 13–27MB each; ensure `public/photos/` files used by gallery are optimized (e.g. WebP, &lt; 500KB) or document that high-res is intentional for gallery quality.

**Success criteria**

- Per item: done only if you choose to implement; no blocking.

---

## Files to Create/Modify (summary)

| File | Action | Track |
|------|--------|--------|
| `docs/quality-gate.md` or `docs/lighthouse-baseline.md` | Create | 1 |
| `README.md` | Optional | 1 |
| `public/images/why-choose/` | Create | 2 |
| `app/page.tsx` or Why Choose block | Modify | 2 |
| `plans/homepage-media-brief.md` or asset list | Modify | 2 |
| `app/junior-trial/page.tsx` | Modify | 3 |
| `components/ui/PartnershipSection.tsx` | Modify | 3 |
| `app/layout.tsx` or `Header.tsx` | Modify | 3 |
| `components/HomeHero.tsx` | Modify | 4 |
| `package.json` / `scripts/` | Modify / Create | 4 |
| Key `layout.tsx` / `page.tsx` | Modify | 4 |

---

## Success Criteria (overall)

- [ ] Verification doc exists; Lighthouse (or “last run”), responsive, forbidden copy, a11y, build/lint recorded.
- [ ] Why Choose section safe (images or fallback); folder and/or doc updated.
- [ ] Micro-polish: skip-to-main in place; placeholders/comments aligned with reality.
- [ ] Performance/SEO: hero MP4 optional; Lighthouse runnable; key pages have unique meta.
- [ ] Build and lint pass; no regressions.

---

## Research Sources

- `plans/PLANS-AUDIT-2026-03-11.md` — What’s done and optional.
- `plans/design-alignment-whats-left.md` — Verification and optional items.
- `COMPOUND_LEARN.md` — Corrections, patterns, standards.
- `.cursorrules` Part 16 — Testing checklist (Lighthouse, LCP, CLS, a11y, responsive, brand).
- `plans/optional-polish-and-homepage-master-plan.md` — Tracks A/B/C (all done).
- Desktop `LBTA-ASSET-LIST-ALL-PHOTOS-AND-VIDEOS.md` — Why Choose images listed as missing.

---

## Relevant Learnings

- **Data single source:** All schedule/copy from data; no hardcoded prices or duplicate content.
- **A11y:** 48px touch targets, focus ring, labels + live region on forms, footer/dark text ≥ text-white/50.
- **Images:** One `priority` per page; `sizes` on fill/priority; WebP preferred; alt required.
- **Brand:** No forbidden copy; calm, confident voice; black/white primary CTAs.

---

## Risks & Mitigations

| Risk | Mitigation |
|------|------------|
| Lighthouse score &lt; 90 on slow network | Document baseline; optimize LCP (hero image/video, sizes); accept “best effort” for 3G. |
| Why Choose fallback looks generic | Use one existing LBTA image (e.g. laguna-horizon or community) until real assets supplied. |
| Skip-to-main duplicates focusable element | Single link at top of body; hide visually until focus; main has one clear id. |

---

## World-class / modern roadmap (next-level ideas)

Ideas below are how the **best companies** design, sell, market, and deliver experience in 2024–2026. They go beyond the current plan and can be phased in after Tracks 1–4.

### Design (like Aman, Four Seasons, luxury sport brands)

- **Whitespace and pacing** — Already in .cursorrules (40%+ white space). Audit key pages so sections breathe; avoid dense blocks. Luxury converts with “guidance, not push.”
- **Story-led navigation** — Navigation as “where you are in the journey” (Discover → Programs → Trial → Community) rather than only functional labels. Optional: subtle progress or journey cues on trial/booking pages.
- **Consistent motion language** — One system for entrances, hovers, and transitions (e.g. 200–300ms, one easing). Feels intentional, not random.
- **High-res, lifestyle imagery** — You’re already briefed (homepage-media-brief, asset list). Best brands pair hero + section images with short, benefit-led captions or pull quotes.

### Selling (value-first, low friction, trust stack)

- **Three-layer trust stack** — (1) **Social proof**: specific testimonials with names/roles/outcomes (you have success-stories; ensure they’re near CTAs and pricing). (2) **Authority**: certifications, partnerships, “As seen in” or press. (3) **Risk reversal**: your “30-Day Money-Back Guarantee” and “No Long-Term Commitment” surfaced on book/trial and pricing—not buried.
- **One primary CTA per section** — You already do “Book a Trial” as hero. Extend: each major section has one clear next step (e.g. Programs → “See schedules”; Founder → “Read Andrew’s story”). Reduces decision fatigue.
- **Trial as “experience,” not “signup”** — Copy that frames the trial as “your first session” or “see how we coach” (movement, craft) rather than generic “book now.” Aligns with luxury CRO: desire and aspiration first.
- **Pricing clarity** — Schedules as single source is right. Optional: a one-page “What it costs” (ranges by program type) for parents who want the big picture before diving into schedules.

### Marketing (discovery, retention, authority)

- **SEO and meta** — Track 4’s meta audit is the base. Add: FAQ schema where you have FAQ; local business / organization schema; program/event schema for key offerings. Helps rich results and “near me” discovery.
- **Lead magnet** — Optional: one high-value free resource (e.g. “Pathway guide: red ball to college” or “First lesson checklist”) in exchange for email. Used by top academies (e.g. Red5’s “Level Up Guide”) to grow list and show expertise.
- **Content and authority** — Optional: a small “Insights” or “Coaching” section (even 3–5 posts) on movement, progression, or parent FAQs. Positions LBTA as the voice and supports long-tail SEO.
- **Retention and community** — Newsletter is in place. Optional: post-signup sequence (e.g. in ActiveCampaign) that reinforces “what happens next,” introduces the coach, and links back to schedules/community. First-party data and personalization start here.

### Experience (speed, clarity, personalization)

- **Speed as standard** — Track 1 (Lighthouse) and Track 4 (hero MP4, meta) support this. Best brands treat every second of delay as conversion loss; keep LCP &lt; 2.5s and INP &lt; 200ms.
- **Accessibility as default** — Skip-to-main (Track 3), 48px targets, contrast, and focus states are part of this. Optional: short “Accessibility” line in footer (“We’re committed to an inclusive experience”) and link to a simple accessibility page or contact.
- **Path-based hints** — Optional: on junior-trial vs adult-trial, show one sentence that adapts (“For players 3–18” vs “For adults of any level”). Light personalization without heavy tech.
- **Mobile-first and thumb-friendly** — CTAs and key links in thumb reach on mobile; no horizontal scroll. You already test 320/375; treat mobile as the first canvas, not an afterthought.

### Practical order (if you adopt “world-class”)

1. **Do Tracks 1–4 first** — Verification, assets, micro-polish, performance/SEO. This is the floor.
2. **Trust stack** — Surface guarantee + no long-term commitment on book/trial and near pricing; tighten testimonial placement. High impact, low effort.
3. **Trust + authority** — Add or clarify certifications/partnerships (e.g. GPTCA, Fit4Tennis) where parents look.
4. **SEO and discovery** — Meta + schema (FAQ, local, events); optional lead magnet and 3–5 authority pieces.
5. **Experience polish** — Path-based copy (junior vs adult), optional accessibility statement, then any deeper personalization if you add tech later.

---

## How to run

- **Track 1 only:** “Execute Track 1 of site-polish-and-upgrades-plan” or “Run verification and quality gate.”
- **Track 2 only:** “Execute Track 2 of site-polish-and-upgrades-plan” or “Fix Why Choose images and fallback.”
- **Tracks 1 + 2 in parallel:** “Do Track 1 and Track 2 of site-polish-and-upgrades-plan.”
- **Full polish (1–4):** “Execute Tracks 1 through 4 of site-polish-and-upgrades-plan.”
- **Track 5:** Pick items; e.g. “Do 5.2 logo audit doc only.”

After execution: run build/lint, update this plan’s checkboxes, and optionally run compound review → validate → deploy (you choose).
