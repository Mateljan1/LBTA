# Compound Validation — Header / logo / `localPatterns`

**Date:** 2026-03-19  
**Review ref:** `plans/compound-review-summary-header-logo-a11y-2026-03.md`

## Overall score: 96/100

## By validator

| Validator | Score | Status |
|-----------|-------|--------|
| Functional | 96 | ✅ |
| API | 100 | N/A |
| Data | 100 | N/A |
| UI/Visual | 94 | ✅ |
| Practice Plan | 100 | N/A |

## Acceptance checklist

| Item | Status | Note |
|------|--------|------|
| `npm run build` | pass | Completed |
| `npm run lint` | pass | No issues on changed files |
| Smoke `GET /` (next start) | pass | HTTP 200 |
| Smoke `/_next/image?url=%2Flogos%2FLBTAblktext.png&w=256&q=75` | pass | HTTP 200, image/png |
| Smoke `/_next/image` for `/photos/adult-trial-hero.webp` | pass | HTTP 200 with `w=384` (valid `imageSizes`) |
| Grep: all `Image` `src="/…"` under allowed prefixes | pass | `/images`, `/logos`, `/photos` only (partners `/logos`; coaches `/images`; trials `/photos`) |
| Header comment readability | pass | Moved to line above `<header>` |

## Regression audit (`next/image` local paths)

Static string paths found under `public/`:

- `/images/**` — covered
- `/logos/**` — covered
- `/photos/**` — **added** in this commit (adult-trial, beginner-program heroes)

Dynamic `coachImageSrc(...)`, JSON-driven paths resolve under `/images/` or partner `/logos/`.

## Blockers

None.

## Warnings

- Manual: quick visual pass on homepage + `/adult-trial` after deploy.
- Optional: add Playwright or CI check for `/_next/image` 200 on logo URL.

## Decision

**ready**

```json
{
  "overallScore": 96,
  "byValidator": { "functional": 96, "api": 100, "data": 100, "uiVisual": 94, "practicePlan": 100 },
  "blockers": [],
  "warnings": ["Manual visual pass post-deploy", "Optional Playwright for /_next/image"],
  "decision": "ready"
}
```
