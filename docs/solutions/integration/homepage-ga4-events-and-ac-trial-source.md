---
title: Homepage GA4 event map and ActiveCampaign trial source (field 11)
slug: homepage-ga4-events-and-ac-trial-source
category: integration
problem_type: analytics_crm_routing
component: homepage
status: solved
date: 2026-03-27
severity: low
related_files:
  - lib/analytics.ts
  - lib/validations.ts
  - app/api/book/route.ts
  - components/HomeHero.tsx
  - components/HomeCTAForm.tsx
  - components/home/HomeProgramCardLink.tsx
  - components/analytics/TrackedPhoneLink.tsx
  - components/VideoTestimonials.tsx
  - components/StickyCTA.tsx
  - components/layout/Header.tsx
  - components/layout/Footer.tsx
  - app/page.tsx
related_docs:
  - docs/solutions/integration/postmark-email-integration.md
  - plans/homepage-premium-audit-plan-2026-03.md
tags:
  - ga4
  - gtag
  - analytics
  - activecampaign
  - homepage
  - conversion
  - lbta
---

# Homepage GA4 event map and ActiveCampaign trial source (field 11)

## Problem summary

**Symptoms**

- Stakeholders could not attribute homepage engagement (hero CTAs, program cards, phone taps, bottom trial form, video tiles) in GA4 with consistent names and parameters.
- The homepage CTA form posted `source: 'homepage-cta'` to `/api/book`, but **`bookingSchema` did not declare `source`**, so Zod could strip it before the API ran—ops could not rely on ActiveCampaign custom field routing for that funnel.
- Trial requests needed a **distinct AC field 11 value** for “came from homepage embedded form” vs generic website trials.

**Non-issue clarified**

- This was not a production outage; it was **missing instrumentation and schema alignment** for measurement and CRM segmentation.

---

## Root cause

| Gap | Cause |
|-----|--------|
| No structured homepage events | `lib/analytics.ts` had helpers but many surfaces did not call `trackEvent` / `events.*`. |
| `source` dropped | `bookingSchema` lacked optional `source`; validated body excluded unknown keys. |
| AC field 11 always `website` | `/api/book` trial path hard-coded field `11` to `website` with no branch on submission source. |

---

## Solution (verified)

### 1. GA4 — extend `events` and wire UI

**Module:** `lib/analytics.ts` (uses existing `window.gtag` from `app/layout.tsx`).

**New or reused event helpers**

| Helper | GA4 event (concept) | Where wired |
|--------|---------------------|-------------|
| `heroCta` | `hero_cta_click` | `HomeHero` primary/secondary `Link` `onClick` |
| `programCardClick` | `program_card_click` | `HomeProgramCardLink` |
| `phoneClick` | `phone_click` | `Header` (mobile bar + drawer), `TrackedPhoneLink` in `Footer`, `StickyCTA` phone |
| `bookTraining` | `book_training_click` | Header desktop + mobile drawer Book links |
| `homepageTrialFormStart` | `homepage_trial_form_start` | `HomeCTAForm` `onFocusCapture` (once per mount) |
| `formSubmit` | `form_submission` | Successful homepage trial submit |
| `trackEvent('form_submission_error', …)` | `form_submission_error` | Failed submit / network error |
| `videoTestimonialEmbed` | `video_testimonial_embed` | Vimeo iframe `onLoad` (featured three only) |
| `moreStoriesClick` | `more_stories_click` | “More stories” link |
| `stickyCta` | `sticky_cta_click` | Sticky primary, secondary, phone |

**Implementation notes**

- **Program grid:** `app/page.tsx` is a Server Component; tracking lives in client `HomeProgramCardLink` with `program_section`: `coaching` vs `play` from `group.tier` (`secondary` → `play`).
- **Footer phone:** Server `Footer` uses client `TrackedPhoneLink` for one `tel:` link.
- **Vimeo:** `onLoad` measures **embed load**, not user “play” (true play would need Vimeo Player API).

### 2. API + CRM — `source` and field 11

**Schema:** `lib/validations.ts` — `bookingSchema` adds optional `source` (`z.string().max(120).optional()`).

**API:** `app/api/book/route.ts` — trial path computes:

```text
signupSourceField11 = trialBody.source === 'homepage-cta'
  ? 'website-homepage-cta'
  : 'website'
```

and passes `{ field: '11', value: signupSourceField11 }` to `upsertContact`.

**Client:** `components/HomeCTAForm.tsx` continues to send `source: 'homepage-cta'` in the JSON body (now retained after validation).

### 3. Ops follow-up (outside repo)

- In ActiveCampaign, ensure **automations / segments** that filter on **custom field 11** account for the new value **`website-homepage-cta`** alongside **`website`**.
- No new tag IDs were required for this slice; existing trial tags still apply from `lib/activecampaign.ts` usage in the same route.

---

## Prevention and maintenance

1. **New booking sources:** Add optional enum or documented string union for `source` in schema + a single mapping table in `app/api/book/route.ts` (or `lib/form-config.ts`) so field 11 does not sprawl with magic strings.
2. **New tracked CTAs:** Prefer `events.*` from `lib/analytics.ts` over ad-hoc `trackEvent` names so GA4 stays consistent.
3. **Server Components:** Keep analytics in small `'use client'` wrappers (`TrackedPhoneLink`, `HomeProgramCardLink`) rather than marking entire pages client-only.
4. **Privacy:** Do not send unnecessary PII in GA4 params; current helpers use titles, locations, and paths—keep that bar when adding fields.

---

## Verification

- `npm run ship:gate` (build, lint, tests) passed before merge.
- Manual: use GA4 DebugView or tag assistant on staging/prod to confirm events fire on the listed interactions.
- API: POST `/api/book` with `source: 'homepage-cta'` and inspect AC contact field 11 (or dev logs when AC env present).

---

## Related documentation

- [Postmark email integration](./postmark-email-integration.md) — same `/api/book` surface; emails unchanged by this work.
- [Homepage premium audit plan](../../../plans/homepage-premium-audit-plan-2026-03.md) — Phase 5 checklist context.

---

## Phase 3 — documentation review (integration & simplicity)

| Check | Result |
|-------|--------|
| **Integration** | AC field 11 mapping is explicit and single-path for trials; new schema field is optional—backward compatible. |
| **Security** | No secrets in client analytics; rate limiting unchanged on `/api/book`. |
| **Simplicity** | Thin client wrappers avoid bloating `page.tsx`; `TrackedPhoneLink` is minimal and reusable. |

**Optional follow-ups (not required for this doc):** extend automated tests for `bookingSchema` with `source` variants; add Playwright smoke for one GA4 `dataLayer` assertion only if the project standardizes E2E analytics.

---

## Changelog reference

Implementation shipped as a single focused commit on `main` (message prefix `[analytics]`). For exact file list, see `related_files` in frontmatter above.
