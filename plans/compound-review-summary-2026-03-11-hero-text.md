# Compound Review Summary — Hero Text / Left Alignment (2026-03-11)

**Scope:** Homepage hero at https://lagunabeachtennisacademy.com/ — user reported "the text on the left and how it is does not look good" and live site showed "Tennis, as it shouldbe taught." (missing space).

---

## Issues Identified

| # | Issue | Cause | Fix |
|---|--------|--------|-----|
| 1 | **"shouldbe" on live site** | Two spans "Tennis, as it should" + "be taught." rendered with no space between. | Use single source: `hero.tagline` from `homepage-copy.json` with `\n` for line break; render via `.split('\n').map(...)`. |
| 2 | **Hardcoded headline** | H1 was not using `hero.tagline`; violated single source of truth. | H1 now uses `(hero.tagline ?? fallback).split('\n')` with fallback. |
| 3 | **Hero headline size** | Min 2.5rem (40px) vs .cursorrules "Display: clamp(48px, 9vw, 84px) for hero". | Updated to `clamp(3rem,9vw,5.25rem)` (48px–84px). |

---

## Review Agents Run

| Agent | Status | Notes |
|-------|--------|--------|
| Code Simplicity | ✅ | Use hero.tagline + \n; optional \<br /\> alternative. |
| Pattern Recognition | ✅ | Single source of truth restored; layout matches Golden Hour. |
| Julik Frontend Races | ✅ | No races; a11y and touch targets good; tagline from JSON avoids spacing bugs. |

---

## Changes Applied

1. **`components/HomeHero.tsx`**
   - H1 uses `(hero.tagline ?? 'Tennis, as it should be taught.').split('\n').map((line, i) => <span key={i} className="block">{line}</span>)` so copy and line break come from data.
   - Safe fallback if `hero.tagline` is missing.
   - Headline size: `clamp(3rem,9vw,5.25rem)` to match .cursorrules hero display.

2. **`data/homepage-copy.json`**
   - Already has `hero.tagline`: `"Tennis, as it should\nbe taught."` — no change.

---

## Result

- **Copy:** Single source in `homepage-copy.json`; no "shouldbe"; two lines with correct spacing.
- **Layout:** Bottom-left, left-aligned, same as before.
- **Typography:** Hero headline in 48–84px range per rules.

---

## Decision

- [x] Ready to merge — hero text fixed and aligned with compound review.
- Run `/compound:learn` optionally to capture pattern: "Hero headline from JSON tagline with \\n for line break."
