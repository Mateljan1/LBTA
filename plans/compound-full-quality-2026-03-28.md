# Compound full — quality & Lighthouse alignment (2026-03-28)

## Overview

Run the compound loop (plan → work → review → validate → deploy → learn) against the repo **engineering gates** and **documented performance targets**, not an impossible universal “100/100 Lighthouse on mobile with zero tradeoffs.”

## Problem statement

- `ship:gate` requires clean tree + build + lint + tests.
- `.cursorrules` targets **Lighthouse ≥ 90** and **LCP &lt; 2.5s** — not literal 100 on every category when using autoplay hero video + analytics.
- Saved prod Lighthouse mobile showed **Best Practices ~59** partly due to **third-party cookies (Vimeo)** and **Facebook script deprecations** — not fully controllable without removing vendors.

## Proposed solution

1. **Defer Vimeo iframes** until the block is near viewport (featured grid) or **only mount the active slide** (carousel) to cut initial third-party weight and cookie audits.
2. Keep Meta Pixel / GA on `afterInteractive` / established pattern unless marketing requests `lazyOnload` (conversion risk).
3. **Commit** all audit + compound learnings so `ship:gate` passes.
4. **Validate**: `npm run ship:gate` after commit.
5. **Deploy**: human confirms `git push` + Vercel prod SHA (per `.cursorrules`).

## Implementation steps

- [x] Plan doc (this file)
- [x] `VideoTestimonials`: deferred / single-slide iframe loading
- [x] Run lint, tests, build
- [x] Git commit tracked changes
- [x] `ship:gate` green

## Files to create/modify

| File | Action |
|------|--------|
| `components/VideoTestimonials.tsx` | Modify — deferred Vimeo |
| `plans/compound-full-quality-2026-03-28.md` | Create |

```yaml
create: [plans/compound-full-quality-2026-03-28.md]
modify: [components/VideoTestimonials.tsx]
```

## Out of scope

- Removing Meta Pixel or GA (marketing / attribution).
- Replacing hero autoplay video with static image (brand decision; would help LCP most).
- Renaming `middleware.ts` → `proxy.ts` without a dedicated migration + QA for Coach Hub.

## Success criteria

- [ ] `npm run build` && `npm run lint` && `npm test` pass
- [ ] `npm run ship:gate` passes (clean tracked tree after commit)
- [ ] No regression: testimonials still play when visible / selected

## Acceptance checklist

| Criterion | Check |
|-----------|--------|
| Build/lint/test | `npm run quality-gate` && `npm test` |
| Ship gate | `npm run ship:gate` after `git add` + `git commit` |
| Featured videos | Scroll to section → iframes load; below-fold delayed on mobile |
| Carousel | Only active slide requests Vimeo |

## Relevant learnings

- `.cursor/compound/learnings/patterns.json` — `cloudinary-next-image-delivery`, hero poster preload
- Quality bar: third-party scripts affect Lighthouse Best Practices

## Risks & mitigations

| Risk | Mitigation |
|------|------------|
| User expects video immediately | `rootMargin` prefetch before enter; carousel active slide always loads |

## Confidence

**Medium** on Lighthouse BP numeric jump (third-party deprecations may remain). **High** on engineering gate green after commit.
