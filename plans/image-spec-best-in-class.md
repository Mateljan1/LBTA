# LBTA — Best-in-Class Image Spec (Master Inventory)

**Purpose:** Single reference for every image the site uses or could use. Use this to add new assets, replace placeholders, and hit best-in-class quality (LCP &lt; 2.5s, editorial feel, ≤350KB where possible).

**Designing in Canva?** See **plans/canva-image-setup.md** for canvas sizes, export settings, and WebP conversion so exports match this spec.

**Project rules:** WebP preferred; ≤350KB per image where possible; `next/image` with `alt` and `sizes`; `priority` only for LCP/hero.

**Breakpoints:** 320 | 375 | 768 | 1024 | 1440 px.

**Status key:** ✅ In codebase / required | ➕ Add for best-in-class | ☐ Optional (nice to have)

---

## 0. Master checklist (quick scan)

| Category | Count | In spec | Notes |
|----------|-------|---------|--------|
| Heroes & full-bleed | 5+ | §1 | Add page-specific heroes if you have them |
| Founder & coaches | 6 | §2 | One portrait per coach; founder 2 slots |
| Program cards | 10 | §3 | Philosophy ×3, programs ×7 |
| Results & community | 8+ | §4 | Karue + community 1–7 |
| Logos | 1 | §5 | LBTA primary |
| Partner logos | 7 | §5 | Fit4Tennis, Racket Rescue, etc. |
| Facility / gallery | 5 | §10 | Optimize from 13–27MB → ≤350KB |
| Page heroes (add) | 8+ | §9 | About, Contact, Book, Camps, Fitness, etc. |
| Camps / leagues / extras | 15+ | §9 | Optional; add as you have assets |

---

## 1. Hero & full-bleed (LCP candidates)

| Path | Role | Aspect | Recommended size (W×H) | Max file size | Format | Priority | Notes |
|------|------|--------|------------------------|---------------|--------|----------|--------|
| `/images/hero/laguna-horizon.webp` | Main hero (home, OG, many layouts) | 16∶9 | **1920×1080** (1x), **1280×720** (mid), **960×540** (mobile) | ≤350KB | WebP | Yes | Primary LCP; use `sizes="100vw"` |
| `/images/cta/cta-background.webp` | Bottom CTA block (home) | 16∶9 or 3∶1 | **1920×640** or 1920×1080 | ≤300KB | WebP | No | Full width, often cropped |
| `/images/programs/schedules-hero.webp` | Coaches page hero | 16∶9 | **1920×1080** | ≤350KB | WebP | Yes | CoachesHero |
| `/images/programs/hero.webp` | Programs overview hero | 16∶9 | **1920×1080** | ≤350KB | WebP | Yes | programs/page |
| `/photos/adult-trial-hero.webp` | Adult trial, beginner-program heroes | 16∶9 or 4∶3 | **1920×1080** or **1600×1200** | ≤350KB | WebP | Yes | Under `/photos/` |

---

## 2. Founder & coach portraits

| Path | Role | Aspect | Recommended size (W×H) | Max file size | Format | Notes |
|------|------|--------|------------------------|---------------|--------|--------|
| `/images/founder/andrew-portrait.webp` | Home founder block, high-perf page | **4∶5** or 3∶4 | **800×1000** or 960×1280 | ≤250KB | WebP | Single source for “Andrew portrait”; add if missing (home 404) |
| `/images/coaches/andrew-headshot.png` | Coaches listing (founder), data/coaches.json | 3∶4 | **600×800** | ≤200KB | WebP or PNG | Prefer WebP; used in FounderSection |
| `/images/coaches/robert-lebuhn.png` | Robert — listing + bio page | 3∶4 or 4∶5 | **800×1000** (bio), **600×800** (cards) | ≤250KB | WebP preferred | OG: 800×1000 |
| `/images/coaches/michelle.webp` | Michelle — listing only (on leave) | 3∶4 | **600×800** | ≤200KB | WebP | Replace placeholder when real photo ready |
| `/images/coaches/peter-defrantz.png` | Peter — listing + bio page | 3∶4 or 4∶5 | **800×1000** (bio), **600×800** (cards) | ≤250KB | WebP preferred | OG: 800×1000 |
| `/images/coaches/allison-cronk.png` | Allison — listing + bio page | 3∶4 or 4∶5 | **800×1000** (bio), **600×800** (cards) | ≤250KB | WebP preferred | OG: 800×1000 |

**Portrait rule:** One master at **800×1000** (4∶5) or **600×800** (3∶4); Next.js Image handles resize. Use same file for card and bio page when aspect matches.

---

## 3. Program cards & philosophy (grid / 33vw)

| Path | Role | Aspect | Recommended size (W×H) | Max file size | Format | sizes hint |
|------|------|--------|------------------------|---------------|--------|------------|
| `/images/programs/juniors.webp` | Junior pathway card, camps | 4∶3 or 3∶2 | **800×600** or **900×600** | ≤200KB | WebP | (max-width: 768px) 100vw, 33vw |
| `/images/programs/adults.webp` | Adult pathway card | 4∶3 or 3∶2 | **800×600** or **900×600** | ≤200KB | WebP | same |
| `/images/programs/private-lessons.webp` | Private coaching card | 4∶3 or 3∶2 | **800×600** or **900×600** | ≤200KB | WebP | same |
| `/images/programs/private-specialty.webp` | About, contact sections | 4∶3 or 16∶9 | **1000×563** or **800×600** | ≤250KB | WebP | 50vw / 33vw |
| `/images/programs/high-performance.webp` | HP card, HP pathway page | 4∶3 or 3∶2 | **800×600** or **900×600** | ≤200KB | WebP | same |
| `/images/programs/fitness.webp` | Fitness & community card | 4∶3 or 3∶2 | **800×600** | ≤200KB | WebP | same |
| `/images/programs/youth-dev-1.webp` | Youth development card | 4∶3 or 3∶2 | **800×600** | ≤200KB | WebP | same |
| `/images/philosophy/movement.webp` | Philosophy pillar 1 | 4∶3 or 1∶1 | **600×600** or **800×600** | ≤150KB | WebP | 33vw |
| `/images/philosophy/discipline.webp` | Philosophy pillar 2 | 4∶3 or 1∶1 | **600×600** or **800×600** | ≤150KB | WebP | 33vw |
| `/images/philosophy/belonging.webp` | Philosophy pillar 3, fitness page | 4∶3 or 1∶1 | **600×600** or **800×600** | ≤150KB | WebP | 33vw |

---

## 4. Results & community (social proof)

| Path | Role | Aspect | Recommended size (W×H) | Max file size | Format | Notes |
|------|------|--------|------------------------|---------------|--------|--------|
| `/images/results/karue-training.webp` | Player success (Karue Sell) | 16∶9 or 3∶2 | **1200×675** or **1000×667** | ≤300KB | WebP | Home + success-stories |
| `/images/community/community-1.webp` … `community-6.webp` | Community grid (home) | 1∶1 (square) | **600×600** or **800×800** | ≤120KB each | WebP | 6 images; success-stories uses 1,3,5 |
| `/images/community/community-7.webp` | Fitness page | 1∶1 or 4∶3 | **800×800** or **800×600** | ≤150KB | WebP | |

---

## 5. Logos

### Primary

| Path | Role | Recommended size (W×H) | Max file size | Format | Notes |
|------|------|------------------------|---------------|--------|--------|
| `/logos/LBTAblktext.png` | Header, footer (inverted on dark), trial pages, chatbot | **~240×48** (2x: 480×96) | ≤50KB | PNG (transparent) | Single asset; footer inverts via CSS |

### Partner logos (PartnershipSection)

| Path | Partner | Recommended size (W×H) | Max file size | Format | Status |
|------|---------|------------------------|---------------|--------|--------|
| `/logos/fit4tennis.png` | Fit4Tennis | **~160×80** or 320×160 (2x) | ≤40KB | PNG (transparent) | Upload to `public/logos/` |
| `/logos/racketrescue.png` | Racket Rescue | **~200×80** or as designed | ≤40KB | PNG/WebP | ✅ In use |
| `/logos/racquetiq.png` | RacquetIQ | **~160×80** | ≤40KB | PNG | Upload |
| `/logos/gptca.png` | GPTCA | **~160×80** | ≤40KB | PNG | Upload |
| `/logos/toroline.png` | Toroline | **~160×80** | ≤40KB | PNG | Upload |
| `/logos/tennisbeast.png` | Tennis Beast | **~160×80** | ≤40KB | PNG | Upload |
| `/logos/lbhs.png` | Laguna Beach High School | **~160×80** | ≤40KB | PNG | Upload |

Use one consistent height (e.g. 48–80px) so the partner row looks even; width can vary by logo shape.

---

## 6. Facility & gallery photos (`/photos/`)

Used in PhotoVideoGallery (About, facility showcase). **Important:** Current files are 13–27MB each; re-export to WebP at recommended sizes so the site stays fast.

| Path | Role | Aspect | Recommended size (W×H) | Max file size | Format | Status |
|------|------|--------|------------------------|---------------|--------|--------|
| `/photos/LBCOURTSETTING.webp` | Championship courts | 16∶9 or 4∶3 | **1920×1080** or **1200×900** | ≤350KB | WebP | ➕ Optimize (currently very large) |
| `/photos/VideoAnalysisRoom.webp` | Video analysis room | 4∶3 or 16∶9 | **1200×900** or **1920×1080** | ≤300KB | WebP | ➕ Optimize |
| `/photos/GymSetting.webp` | Performance center | 4∶3 or 16∶9 | **1200×900** or **1920×1080** | ≤300KB | WebP | ➕ Optimize |
| `/photos/OncourtTraining.webp` | On-court training | 16∶9 or 3∶2 | **1920×1080** or **1200×800** | ≤300KB | WebP | ➕ Optimize |
| `/photos/Court setting.webp` | Courts + ocean view | 16∶9 | **1920×1080** | ≤350KB | WebP | ➕ Optimize (note: space in filename; consider renaming to `court-setting.webp`) |
| `/photos/adult-trial-hero.webp` | Adult trial / beginner-program hero | 16∶9 or 4∶3 | **1920×1080** or **1600×1200** | ≤350KB | WebP | ✅ In use |

**Tip:** Export from your originals at 1920px wide (or 1200px for 4∶3), quality 80–85 in WebP; that usually lands under 350KB.

---

## 7. Responsive width targets (for export or srcset)

Use these as **export widths** if you generate multiple files; otherwise one “large” file per row and let Next.js Image resize.

| Context | 1x (mobile) | 2x (retina) | Max width (desktop) |
|---------|-------------|-------------|---------------------|
| Full-bleed hero | 960px | 1920px | 1920px |
| Half width (e.g. founder) | 600px | 1200px | 1200px |
| Third width (cards) | 400px | 800px | 800px |
| Square (community) | 400px | 800px | 800px |
| Portrait (coaches) | 600px | 800px | 800px |

---

## 8. Checklist per image

- [ ] **Format:** WebP for photos/imagery; PNG only where transparency needed (logos).
- [ ] **File size:** ≤350KB for heroes; ≤200KB for cards/portraits; ≤120KB for small grid.
- [ ] **Dimensions:** Match or exceed “Recommended size” in the table; same aspect ratio as used in layout.
- [ ] **Alt:** Descriptive, &lt;125 characters; no “image of” or “picture of.”
- [ ] **Code:** `next/image` with `sizes` and `quality={90}`; `priority` only on LCP hero(es).
- [ ] **Path:** Under `public/images/` or `public/logos/`; path in code matches exactly (case, extension).

---

## 9. Gaps / fixes from codebase

| Issue | Action |
|-------|--------|
| Home references `/images/founder/andrew-portrait.webp` | Add file or point homepage founder block to `/images/coaches/andrew-headshot.png` and use same asset. |
| Coach assets are PNG | Prefer WebP for new or re-exports (smaller, same quality). |
| `community-7.webp` | Ensure file exists if fitness page uses it. |
| `youth-dev-1.webp` | Ensure exists for program card. |

---

## 10. Recommended additional images (add as you have them)

Use this section when you add more images so the site stays best-in-class. For each slot: same rules (WebP, max KB, `next/image` with `sizes` and `alt`). Tick when the file is in place.

### Page-specific heroes (one per page = stronger LCP and relevance)

| Path | Page / use | Aspect | Size (W×H) | Max KB | ☐ Added |
|------|------------|--------|------------|--------|--------|
| `/images/hero/about-hero.webp` | About hero (optional alternate) | 16∶9 | 1920×1080 | ≤350 | ☐ |
| `/images/hero/contact-hero.webp` | Contact hero | 16∶9 | 1920×1080 | ≤350 | ☐ |
| `/images/hero/book-hero.webp` | Book / trial hero | 16∶9 | 1920×1080 | ≤350 | ☐ |
| `/images/hero/camps-hero.webp` | Camps page hero | 16∶9 | 1920×1080 | ≤350 | ☐ |
| `/images/hero/fitness-hero.webp` | Fitness page hero | 16∶9 | 1920×1080 | ≤350 | ☐ |
| `/images/hero/success-stories-hero.webp` | Success stories hero | 16∶9 | 1920×1080 | ≤350 | ☐ |
| `/images/hero/junior-trial-hero.webp` | Junior trial hero | 16∶9 | 1920×1080 | ≤350 | ☐ |
| `/images/hero/philosophy-hero.webp` | Philosophy page hero | 16∶9 | 1920×1080 | ≤350 | ☐ |

### Why Choose (homepage — two images)

| Path | Use | Aspect | Size (W×H) | Max KB | ☐ Added |
|------|-----|--------|------------|--------|--------|
| `/images/why-choose/why-choose-1.webp` | Why Choose section, left | 4∶3 | 800×600 | ≤200 | ☐ |
| `/images/why-choose/why-choose-2.webp` | Why Choose section, right | 4∶3 | 800×600 | ≤200 | ☐ |

Copy and image paths live in `data/homepage-copy.json` under `whyChoose`; add files to `public/images/why-choose/` when ready.

### Camps & programs (lifestyle and program-specific)

| Path | Use | Aspect | Size (W×H) | Max KB | ☐ Added |
|------|-----|--------|------------|--------|--------|
| `/images/camps/red-ball.webp` | Red ball / Little Tennis | 4∶3 | 800×600 | ≤200 | ☐ |
| `/images/camps/orange-ball.webp` | Orange ball program | 4∶3 | 800×600 | ≤200 | ☐ |
| `/images/camps/green-ball.webp` | Green dot / full court | 4∶3 | 800×600 | ≤200 | ☐ |
| `/images/camps/camp-action-1.webp` … `camp-action-4.webp` | Camps gallery / grid | 4∶3 or 1∶1 | 800×600 or 800×800 | ≤200 | ☐ |
| `/images/programs/leagues.webp` | Leagues card / USTA–UTR | 4∶3 | 800×600 | ≤200 | ☐ |
| `/images/programs/match-play.webp` | Match play / Friday match play | 4∶3 | 800×600 | ≤200 | ☐ |
| `/images/programs/cardio-tennis.webp` | Cardio Tennis | 4∶3 | 800×600 | ≤200 | ☐ |

### Success stories & testimonials

| Path | Use | Aspect | Size (W×H) | Max KB | ☐ Added |
|------|-----|--------|------------|--------|--------|
| `/images/results/karue-training.webp` | Karue Sell (ATP) — already in use | 16∶9 or 3∶2 | 1200×675 | ≤300 | ✅ |
| `/images/results/player-2.webp` … `player-N.webp` | Additional player success shots | 3∶2 or 1∶1 | 800×533 or 600×600 | ≤200 | ☐ |
| `/images/community/community-8.webp` … `community-12.webp` | Extra community grid (home, success stories) | 1∶1 | 800×800 | ≤120 | ☐ |

### Facility & “moment” shots (beyond the 5 gallery photos)

| Path | Use | Aspect | Size (W×H) | Max KB | ☐ Added |
|------|-----|--------|------------|--------|--------|
| `/images/facility/courts-moulton.webp` | Moulton courts | 16∶9 | 1920×1080 | ≤350 | ☐ |
| `/images/facility/courts-lbhs.webp` | LBHS courts | 16∶9 | 1920×1080 | ≤350 | ☐ |
| `/images/facility/sunset-courts.webp` | Courts at golden hour | 16∶9 | 1920×1080 | ≤350 | ☐ |
| `/images/facility/gym.webp` | Gym / performance center | 4∶3 | 1200×900 | ≤250 | ☐ |
| `/images/facility/video-room.webp` | Video analysis room | 4∶3 | 1200×900 | ≤250 | ☐ |

### Coach action shots (optional; for bios or about)

| Path | Use | Aspect | Size (W×H) | Max KB | ☐ Added |
|------|-----|--------|------------|--------|--------|
| `/images/coaches/andrew-action.webp` | Andrew on court | 3∶2 or 16∶9 | 1200×800 | ≤250 | ☐ |
| `/images/coaches/robert-action.webp` | Robert coaching | 3∶2 | 1200×800 | ≤250 | ☐ |
| (same pattern for other coaches) | Bio or team section | 3∶2 | 1200×800 | ≤250 | ☐ |

### Social & meta (optional)

| Path | Use | Aspect | Size (W×H) | Max KB | ☐ Added |
|------|-----|--------|------------|--------|--------|
| `/images/og/default-og.webp` | OG image when page has no hero (e.g. 1200×630) | 1.91∶1 | **1200×630** | ≤300 | ☐ |
| Same as hero | Most pages use `laguna-horizon` for OG | — | — | — | ✅ |

### How to add a new image

1. **Export** to WebP at the recommended size; keep under the max KB in the table.
2. **Save** to `public/images/` or `public/photos/` (or `public/logos/` for logos) with a clear, lowercase name (e.g. `camps-hero.webp`).
3. **Update code** to use the path (e.g. in the page or component).
4. **Add a row** to the right table in this doc (or tick ☐ Added) so the next person knows the asset exists and its spec.

---

## 11. Quick reference — by page

| Page/section | Key images | Priority |
|--------------|------------|----------|
| Home | laguna-horizon, andrew-portrait, karue-training, philosophy (×3), programs (×3), community (×6), cta-background | LCP: hero + founder |
| Coaches | schedules-hero, andrew-headshot, robert-lebuhn, michelle, peter-defrantz, allison-cronk | LCP: schedules-hero |
| Schedules | schedules-hero (CTA), laguna-horizon | — |
| Programs | hero.webp, then card images | LCP: hero.webp |
| About / Contact | laguna-horizon, private-specialty | — |
| Book / Trials | laguna-horizon (OG), adult-trial-hero, LBTAblktext | — |
| Coach bios | Single coach image per page (robert-lebuhn, peter-defrantz, allison-cronk) | — |

**Adding more images?** See **§10. Recommended additional images** for page heroes, camps, facility, success stories, and coach action shots — with the same size/format rules so everything stays best-in-class.

---

*Last updated: March 2026. Master inventory: current assets (§1–§7) + optional/add slots (§10). Aligns with .cursorrules (WebP, ≤350KB, LCP &lt; 2.5s, next/image with sizes and alt).*
