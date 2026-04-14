# Photo Upgrade Plan — LBTA Website

## Overview
Swap in 30+ fresh, labeled 2026 photos from the curated asset library into the live website, replacing generic/older images across key pages. Every swap uses properly named, program-labeled photos that are already optimized as WebP under 350KB.

## Problem Statement
The site currently uses generically named images (`adult-advanced.webp`, `camps-hero.webp`) while **242 labeled, categorized photos** sit unused in the `LBTA_Website_Assets` library — including 49 high-quality 2026 shots. The newer photos are better labeled, more descriptive, and map directly to specific programs. Using them improves visual freshness and photo relevance.

## Proposed Solution
Copy the best-fit 2026 and select 2023/2025 photos into `public/images/` under organized subdirectories, then update page `src` references. Prioritize:
1. **2026 photos first** (newest, most relevant to current programs)
2. **High-res images** (2400px, 1200px) for heroes and banners
3. **800x800 images** for program cards and section photos
4. Pages with the most visual impact: fitness, camps, adult-trial, about, homepage community

## Out of Scope (this plan)
- Cloudinary migration (external URLs stay as-is for now)
- Re-exporting original masters at new resolutions
- Logo or video changes
- Coach headshot replacements (those are specific portrait sessions)
- Homepage hero video/poster swap
- Creating new CSS or layout changes — photo-only swaps

---

## Implementation Steps

### Phase 1: Copy Assets to Public Directory

- [ ] **1.1** Create target directories if needed:
  - `public/images/fitness/2026/`
  - `public/images/programs/2026/`
  - `public/images/community/2026/`
  - `public/images/about/2026/`
  - `public/images/camps/2026/`
  - `public/images/coaches/2026/`
  - `public/images/junior/2026/`

- [ ] **1.2** Copy high-res fitness photos (heroes/banners — 2400px wide):
  - `lbta-2026-woman-meditating-on-tennis-court.webp` → `public/images/fitness/2026/`
  - `lbta-2026-female-athlete-stretching-tennis-court.webp` → `public/images/fitness/2026/`
  - `lbta-2026-woman-exercising-core-on-tennis-court.webp` → `public/images/fitness/2026/`
  - `lbta-2026-woman-side-plank-tennis-court.webp` → `public/images/fitness/2026/`
  - `lbta-2026-woman-doing-side-plank-tennis-court.webp` → `public/images/fitness/2026/`
  - `lbta-2026-tennis-single-leg-reaction-training.webp` → `public/images/fitness/2026/`

- [ ] **1.3** Copy program-specific 2026 photos (800x800 cards + 1200px wide):
  - `lbta-2026-cardio-tennis-adult-group-ready-formation.webp` → `public/images/fitness/2026/`
  - `lbta-2026-liveball-intermediate-night-group-ready-position.webp` → `public/images/fitness/2026/`
  - `lbta-2026-high-performance-karue-sell-backhand-andrew-observing.webp` → `public/images/programs/2026/`
  - `lbta-2026-high-performance-player-serve-dark-court.webp` → `public/images/programs/2026/`
  - `lbta-2026-high-performance-player-overhead-white-shirt.webp` → `public/images/programs/2026/`
  - `lbta-2026-high-performance-female-player-backhand-white-dress.webp` → `public/images/programs/2026/`
  - `lbta-2026-adult-advanced-player-forehand-blue-shirt.webp` → `public/images/programs/2026/`
  - `lbta-2026-adult-intermediate-player-forehand-coral-shirt.webp` → `public/images/programs/2026/`
  - `lbta-2026-adult-18-over-night-three-men-portrait.webp` → `public/images/programs/2026/`
  - `lbta-2026-doubles-round-robin-coach-led-group-play.webp` → `public/images/programs/2026/`
  - `lbta-2026-utr-3-0-5-0-player-serve-blue-court.webp` → `public/images/programs/2026/`
  - `lbta-2026-utr-5-0-7-0-player-serve-follow-through-blue-court.webp` → `public/images/programs/2026/`
  - `lbta-2026-friday-womens-league-team-photo.webp` → `public/images/programs/2026/`

- [ ] **1.4** Copy junior/youth/camp photos:
  - `lbta-2026-orange-ball-junior-boy-celebration-closeup.webp` → `public/images/junior/2026/`
  - `lbta-2026-orange-ball-junior-boy-celebration.webp` → `public/images/junior/2026/`
  - `lbta-2026-orange-ball-junior-boy-smile-racket.webp` → `public/images/junior/2026/`
  - `lbta-2026-green-dot-junior-boy-lunge-forehand.webp` → `public/images/junior/2026/`
  - `lbta-2026-little-tennis-stars-coach-ball-cart-junior-boy.webp` → `public/images/junior/2026/`
  - `lbta-2026-youth-development-group-photo-coaches-juniors.webp` → `public/images/junior/2026/`
  - `lbta-2026-youth-development-teen-boy-backhand-sunset.webp` → `public/images/junior/2026/`
  - `lbta-2026-youth-development-teen-boy-two-handed-preparation.webp` → `public/images/junior/2026/`
  - `lbta-2026-winter-tennis-camp.webp` → `public/images/camps/2026/`

- [ ] **1.5** Copy community/about/coaching photos:
  - `lbta-2026-two-people-posing-on-tennis-court.webp` → `public/images/community/2026/`
  - `lbta-2026-andrew-private-lesson-junior-girl-instruction-blue-court.webp` → `public/images/coaches/2026/`
  - `lbta-2026-andrew-private-lesson-serve-demonstration-adult-player.webp` → `public/images/coaches/2026/`
  - `lbta-2026-andrew-private-lesson-female-athlete-ball-cart.webp` → `public/images/coaches/2026/`
  - `lbta-2026-allison-private-lessons-ball-cart-sunset.webp` → `public/images/coaches/2026/`

---

### Phase 2: Fitness Page — Full Photo Upgrade

**Current images → New images:**

- [ ] **2.1** Hero: `/images/fitness/fitness-hero.webp` → `/images/fitness/2026/lbta-2026-woman-meditating-on-tennis-court.webp`
  - 2400x1920, 340KB — stunning contemplative shot, perfect hero
  - Alt: `Woman meditating on a tennis court at LBTA — movement and wellness`

- [ ] **2.2** Cardio Tennis section: `/images/fitness/cardio-tennis.webp` → `/images/fitness/2026/lbta-2026-cardio-tennis-adult-group-ready-formation.webp`
  - 800x800 — actual cardio tennis group in formation
  - Alt: `Adult group in ready formation during a Cardio Tennis session at LBTA`

- [ ] **2.3** LiveBall section: `/images/fitness/liveball.webp` → `/images/fitness/2026/lbta-2026-liveball-intermediate-night-group-ready-position.webp`
  - 800x800 — actual liveball group under lights
  - Alt: `Intermediate LiveBall group in ready position under court lights at LBTA`

---

### Phase 3: Camps Page — Add Fresh Camp Imagery

- [ ] **3.1** Dark CTA band: `/images/camps/camp-action-4.webp` → `/images/camps/2026/lbta-2026-winter-tennis-camp.webp`
  - 1545x2000 — actual camp shot, replaces generic action photo
  - Alt: `Junior players during winter tennis camp at LBTA`

---

### Phase 4: About Page — Add 2026 Community Photos

- [ ] **4.1** Add new community image to about page or swap "Our Story" section photo:
  - `/images/about/our-story.webp` → `/images/coaches/2026/lbta-2026-andrew-private-lesson-junior-girl-instruction-blue-court.webp`
  - Alt: `Coach Andrew giving instruction to a junior player on a blue court at LBTA`

---

### Phase 5: Homepage — Upgrade Program Cards & Community Gallery

- [ ] **5.1** Update `data/homepage-copy.json` program card images:
  - High Performance card: swap image to `/images/programs/2026/lbta-2026-high-performance-karue-sell-backhand-andrew-observing.webp`
  - Adult Programs card: swap to `/images/programs/2026/lbta-2026-adult-advanced-player-forehand-blue-shirt.webp`
  - Junior Programs card: swap to `/images/junior/2026/lbta-2026-youth-development-group-photo-coaches-juniors.webp`

- [ ] **5.2** Update community gallery tiles in `data/homepage-copy.json` with select 2026 community shots:
  - Add `/images/community/2026/lbta-2026-two-people-posing-on-tennis-court.webp`
  - Add `/images/junior/2026/lbta-2026-orange-ball-junior-boy-celebration-closeup.webp`
  - Add `/images/fitness/2026/lbta-2026-female-athlete-stretching-tennis-court.webp`

---

### Phase 6: Adult Trial Page — Better Hero

- [ ] **6.1** Hero: `/legacy-working-assets/hero/adult-trial-hero/adult-trial-hero.webp` → `/images/programs/2026/lbta-2026-adult-advanced-player-forehand-blue-shirt.webp` (or keep current — evaluate quality)

---

### Phase 7: UTR Match Play Page — Program-Specific Photos

- [ ] **7.1** Add 2026 UTR division photos to the page if not already using Cloudinary shots:
  - UTR 3.0-5.0 section: `/images/programs/2026/lbta-2026-utr-3-0-5-0-player-serve-blue-court.webp`
  - UTR 5.0-7.0 section: `/images/programs/2026/lbta-2026-utr-5-0-7-0-player-serve-follow-through-blue-court.webp`

---

### Phase 8: Leagues Page — Add League-Specific Photo

- [ ] **8.1** Leagues hero or featured section: add `/images/programs/2026/lbta-2026-friday-womens-league-team-photo.webp`
  - Alt: `Friday Women's League team photo at LBTA`

---

### Phase 9: High Performance Pathway Page — Upgrade

- [ ] **9.1** Hero: `/legacy-working-assets/programs/high-performance/high-performance.webp` → `/images/programs/2026/lbta-2026-high-performance-player-serve-dark-court.webp`
  - Alt: `High performance player serving on a dark court at LBTA`

---

## Files to Create/Modify

| File | Action | Purpose |
|------|--------|---------|
| `public/images/fitness/2026/*.webp` | Create (copy) | 8 fitness photos |
| `public/images/programs/2026/*.webp` | Create (copy) | 13 program photos |
| `public/images/junior/2026/*.webp` | Create (copy) | 8 junior/youth photos |
| `public/images/camps/2026/*.webp` | Create (copy) | 1 camp photo |
| `public/images/community/2026/*.webp` | Create (copy) | 1 community photo |
| `public/images/coaches/2026/*.webp` | Create (copy) | 4 coaching photos |
| `app/fitness/page.tsx` | Modify | Update 3 image src paths + alts |
| `app/camps/page.tsx` | Modify | Update 1 CTA background image |
| `app/about/page.tsx` | Modify | Update 1 section image |
| `app/high-performance-pathway/page.tsx` | Modify | Update hero image |
| `app/programs/leagues/page.tsx` | Modify | Add league photo |
| `data/homepage-copy.json` | Modify | Update program card + community gallery images |

```yaml
# files (for tooling)
create:
  - public/images/fitness/2026/
  - public/images/programs/2026/
  - public/images/junior/2026/
  - public/images/camps/2026/
  - public/images/community/2026/
  - public/images/coaches/2026/
modify:
  - app/fitness/page.tsx
  - app/camps/page.tsx
  - app/about/page.tsx
  - app/high-performance-pathway/page.tsx
  - app/programs/leagues/page.tsx
  - data/homepage-copy.json
```

## Success Criteria
- [ ] 30+ new 2026 photos copied into `public/images/` under organized subdirectories
- [ ] Fitness page uses 3 new 2026 photos (hero + cardio + liveball)
- [ ] Homepage program cards use 2026 photos for at least 3 programs
- [ ] Community gallery includes at least 2 new 2026 shots
- [ ] No broken image references (all paths resolve)
- [ ] All images have descriptive alt text
- [ ] No image exceeds 350KB (all pre-optimized)
- [ ] `npm run build` passes with no errors
- [ ] Site renders correctly at 375px, 768px, 1440px

## Acceptance Checklist
- [ ] Success 1 → `find public/images/*/2026/ -name "*.webp" | wc -l` returns 30+
- [ ] Success 2 → Fitness page at localhost:3000/fitness shows 3 new images
- [ ] Success 3 → Homepage program cards show 2026 photos (visual check)
- [ ] Success 4 → Community gallery has 2026 photos visible
- [ ] Success 5 → No 404s for image paths in browser console
- [ ] Success 6 → Every `<Image>` has non-empty `alt` attribute
- [ ] Success 7 → `find public/images/*/2026/ -size +350k | wc -l` returns 0 (or flag any exceptions)
- [ ] Success 8 → `npm run build` exits 0
- [ ] Success 9 → Browser check at 375px, 768px, 1440px — no layout breaks

## Relevant Learnings
- (Source: Codebase) Homepage images are driven by `data/homepage-copy.json` — program cards, philosophy pillars, community gallery all reference paths in JSON, not hardcoded in TSX
- (Source: Codebase) Coach images use `coachImageSrc()` wrapper from `lib/coaches-data.ts` that appends `?v=13` cache buster
- (Source: Codebase) Legacy images live under `/legacy-working-assets/` — adult-trial, junior-trial, philosophy heroes
- (Source: Asset Library) All 2026 photos are already optimized WebP, quality-approved (score 9.0), under 350KB
- (Source: Asset Library) 800x800 images are fine for cards but too small for heroes
- (Source: Asset Library) High-res fitness set (2400px wide) is the strongest hero candidate pool
- (Source: LBTA Design System) Images require `alt`, `sizes`, use `next/image`, `priority` only for LCP

## Research Sources
- `LBTA_All_Photos_By_Category_2026-03-22/inventory/category-summary.csv`
- `LBTA_Media_Packs_2026-03-29/support-hero-slots.csv`
- `LBTA_Media_Packs_2026-03-29/support-program-cards.csv`
- Codebase research: full page-by-page image audit (13 pages + 5 components)

## Confidence & Uncertainty
- **Plan confidence: high** — all source images verified to exist, all target pages identified
- **Uncertainty:** Homepage `data/homepage-copy.json` structure needs careful reading before modifying (community gallery format, program card image fields)
- **Uncertainty:** The 800x800 2026 photos may look slightly soft on retina at hero scale — only use 1200px+ for heroes

## Risks & Mitigations
| Risk | Mitigation |
|------|------------|
| 800x800 image too small for hero slot | Only use 1200px+ images for heroes; 800x800 for cards only |
| Breaking homepage layout by editing JSON wrong | Read `homepage-copy.json` structure first; only modify image paths |
| CLS from different image aspect ratios | Keep same `width`/`height` attributes or adjust to match new aspect ratio |
| File size exceeds 350KB limit | Pre-checked: only `lbta-2026-two-people-posing-on-tennis-court.webp` (590KB) and `lbta-2026-woman-meditating` (340KB) are close; compress the 590KB one before copying |
