# Learnings: Photos & Videos Optimization (2026-03-13)

## What we did

- **Plan:** `plans/photos-videos-optimization-plan.md` — map LBTA pack to public paths.
- **Work:** Copied 10 pack WebPs into `public/images/` (hero, philosophy×3, programs×3, why-choose×2, cta). Added `scripts/generate-hero-poster.js` and small `hero-poster.webp` for LCP; poster/preload point to it.
- **Review:** Security PASS; Performance — hero poster was 1.53 MB raw (not optimized by Next) → fixed with dedicated small poster; Pattern — OK.
- **Validate:** Functional PASS.
- **Deploy:** Committed, pushed, Vercel prod.

## Corrections

- **Video poster = LCP:** The `poster` attribute and preload link request the **raw** file from `public/`; Next.js Image Optimization does **not** apply. So the poster must be a small file (< 200KB) or LCP suffers. Use a dedicated `hero-poster.webp` and generate it from the full hero image when the hero changes.

## Patterns added

- **hero-video-poster-lcp:** When hero is autoplay video, use small dedicated poster file + preload; full hero image for destination/OG; script to generate poster from full hero.

## Quality bar

- Hero poster (and any preloaded LCP image not going through `next/image`) must be < 200KB. Document in `docs/hero-video-optimization.md` and enforce via script or manual check.
