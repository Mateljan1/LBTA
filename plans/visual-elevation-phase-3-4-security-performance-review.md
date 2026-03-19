# Visual Elevation Phase 3 & 4 — Security & Performance Review

**Scope:** New section components (`SplitSection`, `MasonryGrid`, `ZigzagSection`) and updates to homepage, camps, philosophy, success-stories pages. All use `next/image` with legacy asset paths under `/legacy-working-assets/`. No new API routes or user input. No auth changes.

---

### Security & Performance Review
**Status**: ⚠️ WARNINGS

---

#### Findings

| Severity | Location | Issue | Recommendation |
|----------|----------|--------|----------------|
| **High** | `next.config.js` | `images.localPatterns` does not include `/legacy-working-assets/**`. With localPatterns set, Next.js rejects unlisted local paths and returns **400 INVALID_IMAGE_OPTIMIZE_REQUEST** in production. | Add `{ pathname: '/legacy-working-assets/**' }` to `images.localPatterns` so hero, ZigzagSection, MasonryGrid, and all legacy-asset images optimize and load in prod. |
| Low | `components/sections/SplitSection.tsx` | Image has no explicit `quality` prop (defaults to 75). | Add `quality={90}` for consistency with MasonryGrid, ZigzagSection, and page-level Images. |
| Low | `app/philosophy/page.tsx` | Hero and bento Images have no `quality` prop. | Add `quality={90}` for consistency and visual parity. |
| Low | `app/success-stories/page.tsx` | Hero and story Images lack explicit `quality`. | Add `quality={90}` for consistency. |
| Info | `app/page.tsx`, `app/success-stories/page.tsx` | `dangerouslySetInnerHTML` used with `JSON.stringify(schema)` for JSON-LD. | Confirmed safe: data is static (localBusinessSchema, successStoriesSchema). No user input. |
| Info | Philosophy & success-stories heroes | Hero images use `alt=""`. | Acceptable for decorative full-bleed backgrounds; ensure they are not meaningful content. |

---

#### Security Summary

- **No XSS:** Image `src`/`alt` and all section props are from static literals, in-page constants, or JSON data files (e.g. `homepage-copy.json`). No user-controlled input reaches `dangerouslySetInnerHTML` or image attributes.
- **No path traversal:** All asset paths are static (e.g. `/legacy-working-assets/community/community-1.webp`). No user input used to build paths.
- **No secrets:** No hardcoded secrets; no new env or API surface.
- **Injection:** `WhyChooseImage` and section components pass through props to `next/image`; call sites supply only static or JSON-driven values.

#### Performance Summary

- **Layout:** MasonryGrid uses CSS Grid with `gridAutoFlow: 'dense'` and fixed row min-height; ZigzagSection and bento use CSS grid. No JS-driven layout or layout thrash.
- **Images:** `next/image` is used throughout with appropriate `sizes` (e.g. `(max-width: 768px) 100vw, 50vw`). Priority is set only on LCP heroes (camps, philosophy, success-stories). Below-fold content relies on default lazy loading.
- **N+1 / data:** No new data fetching; all content is static or from JSON. No N+1 concern.
- **Fix required:** Add `/legacy-working-assets/**` to `localPatterns` so legacy-asset images are allowed by the image optimizer in production; optional: set `quality={90}` on SplitSection and on philosophy/success-stories Images for consistency.

---

#### Summary

Security is sound: no user input in new code, no injection or path traversal, and JSON-LD is built from static data. Performance patterns are good (CSS grid, sensible `sizes`, priority only on heroes). One blocking issue: **`next.config.js` must allow `/legacy-working-assets/**` in `images.localPatterns`** or all Phase 3 & 4 legacy-asset images will return 400 in production. Minor follow-ups: add `quality={90}` where missing for consistency.
