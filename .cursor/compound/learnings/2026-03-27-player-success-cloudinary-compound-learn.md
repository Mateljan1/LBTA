# Compound Learn: Player Success hero — Cloudinary + contain fit

**Date:** 2026-03-27  
**Commit:** `9283fde` — `fix(home): Player Success carousel Cloudinary heroes with contain fit`  
**Scope:** `data/homepage-copy.json` (`results.slides` for Karue, Ryan, Henry, Olov)

## Problem

Homepage Player Success carousel used local WebP heroes; Karue’s slide was **badly cropped** (head cut off) under `object-cover` in a wide, short band.

## Solution

1. **Remote art on Cloudinary** — Per-slide `image` URLs: `https://res.cloudinary.com/dv033eo0x/image/upload/f_auto,q_auto/v…/public_id.jpg` (delivery optimization via `f_auto,q_auto`).
2. **`imageFit: "contain"`** on all four slides — Full photo visible inside the band; `PlayerSuccessCarousel` already letterboxes with `bg-brand-deep-water` when `contain` is set (see component comment: tall portraits/squares that `cover` would amputate).
3. **`next.config.js`** — `res.cloudinary.com` already in `images.remotePatterns`; no config change required.

## Review / validation notes

- **`npm run verify:images`** — Script only collects `image: '/…'` style paths; `https://` URLs are skipped, so no false “missing under public/”.
- **Compound review warning:** Ryan and Olov temporarily share the same Cloudinary file (`olov_hero_yiuwtr.jpg` per stakeholder links); **`imageAlt` for Ryan may not match visible subject** until a Ryan-only asset exists — fix alt or URL.
- **Tradeoff:** `contain` prioritizes “no crop” over edge-to-edge full bleed; for full bleed again, use reframed assets + `cover` + per-slide `objectPosition` (see pattern `object-position-top-weighted-hero`).

## Patterns captured

| ID | Summary |
|----|---------|
| `player-success-hero-contain-no-crop` | Use `imageFit: "contain"` in `homepage-copy.json` when the band must not crop people; accept letterboxing. |
| `cloudinary-next-image-delivery` | Cloudinary URLs with `f_auto,q_auto`; confirm `remotePatterns` includes host. |

## Anti-patterns captured

| ID | Summary |
|----|---------|
| `slide-image-alt-mismatch` | Slide `imageAlt` names a person while `image` shows another (shared or wrong asset). |

## Corrections captured

1. **Cover + center alone** — Not sufficient for all player heroes; use **contain**, **top-weighted objectPosition**, or **better-framed source art**.
2. **Stakeholder duplicate URLs** — When two slides share one file, align copy/alt or supply a second asset.

## Ship

- `npm run ship:gate` passed after commit.
- `git push origin main` + `npx vercel --prod` completed; production alias includes `lbta-website.vercel.app`.

## Related docs / code

- `components/home/PlayerSuccessCarousel.tsx` — `imageFit`, `objectPosition`, prefetch `img.src = slides[next].image` (works for HTTPS).
- Prior: `2026-03-23-photo-carousel-facility-imagery-compound-learn.md` (local paths; superseded for these slides by Cloudinary URLs until re-localized).
