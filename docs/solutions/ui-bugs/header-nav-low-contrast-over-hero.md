---
title: Header nav low contrast over full-bleed hero
slug: header-nav-low-contrast-over-hero
category: ui-bugs
tags:
  - nextjs
  - accessibility
  - header
  - wcag
  - tailwind
severity: medium
status: resolved
date: 2026-03-19
related_files:
  - components/layout/Header.tsx
  - components/HomeHero.tsx
---

# Header nav low contrast over full-bleed hero

## Symptom

On the homepage (and any page with a dark full-viewport hero under the fixed header), the main nav looked like a **dark bar** with **hard-to-read** Programs / Schedule / Coaches links. Alt text for the logo appeared prominent next to a broken image (separate fix: `next.config.js` `images.localPatterns` must include `/logos/**` for `next/image`).

## Root cause

`Header` used **semi-transparent** backgrounds (`bg-brand-morning-light/90` and `/98`) with `backdrop-blur`. The fixed header sits **above** `HomeHero`’s dark video + overlay, so the composited background was **much darker** than morning light. Nav text stayed **`text-brand-pacific-dusk`** (dark blue on darkened bar) → **contrast below WCAG 7:1** targets from `.cursorrules`.

## Fix

Use a **fully opaque** header surface so links always sit on `#FAF8F4` (morning light):

- Replaced `bg-brand-morning-light/90` and `bg-brand-morning-light/98 backdrop-blur-*` with **`bg-brand-morning-light`** (no alpha).
- Added a subtle **`border-b border-brand-pacific-dusk/[0.08]`** so the bar separates from the hero without relying on transparency.

## Code reference

```tsx
// components/layout/Header.tsx — header root className (conceptual)
className={`... border-b border-brand-pacific-dusk/[0.08] ${
  scrolled
    ? 'bg-brand-morning-light shadow-lg ...'
    : 'bg-brand-morning-light py-4 md:py-5'
}`}
```

## Prevention

- For **fixed headers over dark media**, avoid low-opacity light fills unless you switch to **light-on-dark** nav tokens for that mode.
- After changing `next.config.js` **`images.localPatterns`**, include every static prefix used by `next/image`: **`/images/**`, `/logos/**`, `/photos/**`** (trial landings use `/photos/…`), or the optimizer returns **400** and images break in production.

## Verification

- Homepage at top of scroll: nav links readable; ratio of pacific dusk on morning light meets ~7:1 for body-sized text.
- Scroll: shadow + border still read clearly.
