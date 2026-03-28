# Compound learn — Lighthouse passes + Next.js 16 proxy (2026-03-28)

**Commit:** `a4e51f7` (main)  
**Trigger:** `/compound-engineering learn` after optional “higher Lighthouse” work (not chasing magic 100).

## What shipped

1. **Homepage hero LCP** — `next/image` `priority` + `fill` for `hero-poster.webp` in a `relative` wrapper; video `preload="none"`, deferred `load()`, opacity transition on `onPlaying`; no `<video poster>` when same asset as image; `prefers-reduced-motion: reduce` → image only.
2. **Root layout** — Removed global `<link rel="preload" as="image" href="...hero-poster...">` (non-home routes no longer pay for it). GA4 + Meta Pixel: `next/script` **`lazyOnload`**. Facebook: **`dns-prefetch`** for `connect.facebook.net` instead of **`preconnect`** to reduce early connection contention.
3. **Coach Hub** — **`middleware.ts` → `proxy.ts`** with `export function proxy` + same `matcher`; build shows `ƒ Proxy (Middleware)`.

## Patterns (see `patterns.json`)

- **`hero-video-poster-lcp`** — Updated: next/image owns LCP; defer video; avoid triple fetch.
- **`nextjs16-proxy-coach-hub`** — New: proxy file + matcher for protected paths.
- **`analytics-scripts-lazyOnload-lcp`** — New: defer third-party for LCP; document tradeoff.

## Anti-patterns (see `anti-patterns.json`)

- **`root-layout-preload-homepage-only-lcp`**
- **`hero-poster-triple-fetch`**

## Quality bars (see `quality-bars.json`)

- **`homepageHeroLcpPosterImage`** (should)
- **`thirdPartyScriptLoadStrategy`** (should)

## Tradeoff (explicit)

- **`lazyOnload`** for GA4/Pixel can delay the first pageview relative to **`afterInteractive`**. If marketing reports show attribution gaps, consider GA `afterInteractive` only, or a measured hybrid — document the decision.

## Verification

- `npm run ship:gate` passed before push.
- Post-deploy: confirm Vercel production SHA matches commit; smoke `/` (poster → video fade) and `/coach-hub` redirect when logged out.
