# Compound learn: header logo + `next/image` + WCAG (2026-03-19)

**Commit (reference):** `a56fabf` — `[a11y] Solid header bar; next/image localPatterns /logos /photos; compound validate`

## What broke

1. **Logo:** `/_next/image?url=/logos/...` returned **400** (`INVALID_IMAGE_OPTIMIZE_REQUEST`) in production while direct `/logos/...` could still load — Next.js 16 `images.localPatterns` allowlist did not include `/logos/**`.
2. **Homepage nav:** Fixed header used semi-transparent `bg-brand-morning-light/90` over **HomeHero** video; composited bar read dark while links stayed `text-brand-pacific-dusk` → **contrast failure**.

## Root cause

- **localPatterns:** Any static path used by `next/image` must match an entry in `next.config.js` → `images.localPatterns`. Incomplete allowlist breaks the optimizer only (confusing: raw asset URL may still work).
- **Header:** Translucent light fill over dark full-bleed media is not a safe substitute for an opaque bar when nav text is dark.

## Fix

- **`next.config.js`:** `{ pathname: '/logos/**' }`, `{ pathname: '/photos/**' }` (in addition to `/images/**`).
- **`Header.tsx`:** Opaque `bg-brand-morning-light`, subtle `border-b border-brand-pacific-dusk/[0.08]`; long rationale in comment **above** `return`, not inside `className`.

## Verification

- `npm run build`, `npm run lint`.
- Smoke: `/`, `/_next/image` for logo and a `/photos/` image with valid `w` (e.g. from `imageSizes`).
- Production curls after deploy.

## Prevention

- **Grep:** `next/image` / `Image` + `src="/` → ensure each top-level `public/` prefix is in `localPatterns`.
- **Optional:** Playwright or scripted smoke for logo optimizer URL after deploy.
- **A11y:** If header is fixed over dark hero, default to opaque light bar **or** explicit inverse (light text) theme — not translucent “maybe light” bar.

## Cross-links

- `docs/solutions/ui-bugs/header-nav-low-contrast-over-hero.md`
- `plans/compound-review-summary-header-logo-a11y-2026-03.md`
- `plans/compound-validation-summary-header-logo-a11y-2026-03.md`
- `COMPOUND_LEARN.md` (section “Header + next/image localPatterns (2026-03-19)”)
