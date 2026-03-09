# Product Improvements (A1–A5) Implementation Plan

**Compound Engineering · Plan phase**  
**Created:** 2026-03-08  
**Scope:** Next/Image + assets (A1), SEO & structured data (A2), Accessibility polish (A3), Mobile UX (A4), Resilience & env (A5)

---

## Overview

Single implementation plan covering five product improvement areas: image/asset discipline, SEO and structured data, accessibility polish, mobile UX refinements, and resilience (error handling + env documentation). The codebase already uses `next/image` everywhere in app and components; this plan focuses on audit, consistency, missing pieces (FAQ schema on FAQ page, .env.example), and small UX/accessibility wins.

---

## Problem Statement

- **A1:** Image usage is already on Next.js `Image`; we need a consistent audit for `alt`, `sizes`, and above-the-fold `priority`, plus documentation so future work stays disciplined.
- **A2:** FAQ page has no FAQPage schema (component exists in `SEOSchemas.tsx` but is not rendered on `/faq`). Some pages may have duplicate or weak meta descriptions.
- **A3:** Skip link and `:focus-visible` exist; we need a targeted pass for 48px touch targets and any missing focus styles on interactive elements.
- **A4:** Mobile menu already has backdrop blur and slide-in; we can add minor refinements (e.g. animation easing, optional swipe-to-close) and verify touch targets.
- **A5:** Root `error.tsx` exists; there is no `.env.example` for local/deploy, and forms/API could have clearer loading/error states.

---

## Proposed Solution

Execute in five workstreams (can be parallelized after Phase 1). Each workstream is small and scoped so compound:work can run step-by-step with atomic commits.

---

## Implementation Steps

### Phase 1: Foundation (shared)

- [x] **1.1** Create `.env.example` with placeholders: `NEXT_PUBLIC_SITE_URL`, `ACTIVECAMPAIGN_*`, `SUPABASE_*`, `SENDGRID_*`, `NEXT_PUBLIC_GA_ID`, etc. Add one-line comments. Do not commit real secrets.
- [x] **1.2** Add a short “Environment” section to README or `docs/` pointing to `.env.example` and required vars for run/build.

### Phase 2: A1 — Next/Image + image/asset discipline

- [x] **2.1** Audit all `next/image` usages in `app/` and `components/`: ensure every `<Image>` has meaningful `alt`, appropriate `sizes` (e.g. hero 100vw, cards 33vw/50vw), and `priority` on above-the-fold hero images only.
- [x] **2.2** Confirm key images under `public/` are WebP where possible and within size guidance (e.g. ≤350KB per .cursorrules). Document any exceptions.
- [x] **2.3** Add or update an “Images” subsection in `.cursorrules` or `docs/` with: use `next/image` only, alt required, sizes for responsive, priority only for LCP image(s).

### Phase 3: A2 — SEO & structured data

- [x] **3.1** Render `FAQSchema` on the FAQ page: in `app/faq/page.tsx` (or a minimal `app/faq/layout.tsx`), import and render `<FAQSchema />` in the document (e.g. wrap page in fragment and add schema script alongside content, or inject in layout head). Ensure FAQ data stays from existing `faqItems` / SEOSchemas.
- [x] **3.2** Audit metadata for all 30 routes: ensure each has a unique `title` and `description` (150–160 chars). Fix any generic or duplicate descriptions. Prefer layout-level metadata where a section shares one meta.
- [x] **3.3** Verify `sitemap.ts` includes all public routes (already ~25+ entries); add any missing pages. No code change if already complete.

### Phase 4: A3 — Accessibility polish

- [x] **4.1** Touch targets: audit Header (nav, mobile menu, CTAs), Footer (links, social), and key CTAs (Book Trial, form submit). Ensure every interactive element has `min-w-[48px] min-h-[48px]` or equivalent padding so tap area ≥48px.
- [x] **4.2** Focus visibility: spot-check buttons and links that might rely only on global `:focus-visible`; ensure no `outline: none` without a visible focus ring (2px ring per .cursorrules).
- [x] **4.3** Optional: add a single keyboard test pass (Tab through homepage, /schedules, /book) and fix any order or trap issues. *Done: Header has focus trap and return-focus; home/schedules/book follow DOM order; no fixes required.*

### Phase 5: A4 — Mobile UX

- [x] **5.1** Mobile menu: confirm animation (e.g. `slideInRight`) and backdrop blur are smooth; if needed, tune `transition`/`animation` for a slightly smoother feel (e.g. 300ms ease-out).
- [x] **5.2** Ensure mobile menu links and “Book Trial” have at least 48px tap height; already present in Header, verify no regressions.
- [x] **5.3** Optional: document “swipe to close” as a future enhancement (no implementation in this plan unless time permits). *Documented under Future enhancements below.*

### Phase 6: A5 — Resilience & env

- [x] **6.1** Keep root `app/error.tsx` as-is (already on-brand with reset + home link). Optionally add `app/not-found` enhancement if not already sufficient.
- [x] **6.2** Identify 1–2 critical forms (e.g. contact, book trial) and ensure they show loading state (disabled button + “Sending…”) and inline error message on submit failure; add minimal UI if missing.
- [x] **6.3** Optional: add `loading.tsx` for heavy routes (e.g. `/schedules`) for skeleton or spinner while data loads. *Added `app/schedules/loading.tsx`.*

---

## Files to Create/Modify

| File | Action | Purpose |
|------|--------|---------|
| `.env.example` | Create | Document required env vars (no secrets) |
| `README.md` or `docs/` | Modify | Link to .env.example and env setup |
| `app/faq/page.tsx` or `app/faq/layout.tsx` | Modify | Render FAQSchema on FAQ page |
| `app/**/layout.tsx` or `app/**/page.tsx` | Modify | Metadata audit (unique title/description) |
| `app/sitemap.ts` | Modify | Add any missing routes (if needed) |
| `components/layout/Header.tsx` | Modify | Touch target / focus / animation tweaks if needed |
| `components/layout/Footer.tsx` | Modify | Touch target / focus tweaks if needed |
| Key form components (e.g. contact, book) | Modify | Loading + error state UI |
| `.cursorrules` or `docs/` | Modify | Image/asset discipline notes |
| `app/globals.css` | Modify | Only if focus or animation tweaks required |

---

## Success Criteria

- [ ] `.env.example` exists and README (or docs) references it.
- [ ] FAQ page returns FAQPage JSON-LD (validate via rich results test or view-source).
- [ ] All public pages have unique meta title and description.
- [ ] No interactive element with smaller than 48px touch target on key flows; focus visible on all interactive elements.
- [ ] Mobile menu remains usable and smooth; touch targets verified.
- [ ] At least one critical form shows loading and error state.
- [ ] Image audit documented; .cursorrules or docs updated for image standards.
- [ ] `npm run build` and `npm run lint` pass.

---

## Research Sources

- Next.js 14 Image: https://nextjs.org/docs/app/api-reference/components/image
- WCAG 2.1 Target Size (2.5.5): 44×44 CSS pixels minimum (48px recommended).
- Schema.org FAQPage: https://schema.org/FAQPage
- Project: `.cursorrules` (image, a11y, brand), `docs/archive/REFINEMENT_OPPORTUNITIES.md`

---

## Relevant Learnings

- App and components already use `next/image`; no raw `<img>` in app/components. A1 is audit + documentation.
- `FAQSchema` and `faqItems` exist in `components/SEOSchemas.tsx`; only wiring to FAQ page is needed.
- Skip link and `:focus-visible` are in `app/layout.tsx` and `app/globals.css`. Header has focus trap and 48px targets; audit will confirm rest of site.
- Root `error.tsx` exists; no `.env.example` in repo.

---

## Risks & Mitigations

| Risk | Mitigation |
|------|------------|
| FAQ schema might need to be in layout to be in `<head>` | In Next.js App Router, add FAQ layout for `/faq` that injects schema, or use a fragment in page and ensure script is in document (layout preferred for head). |
| Metadata audit touches many files | Do in one pass; use checklist by route; prefer layout-level metadata where possible to reduce duplication. |
| Scope creep on A4 (swipe-to-close) | Mark as optional; skip unless time permits. |

---

## Execution Order (for /compound:work)

1. Phase 1 (foundation) first — `.env.example` and README/docs.
2. Then run A2 (FAQ schema + metadata audit) and A1 (image audit + docs) in parallel or sequence.
3. Then A3 (a11y touch + focus) and A4 (mobile menu verify/tweak).
4. Then A5 (form states + optional loading.tsx).
5. Final: lint, build, quick smoke test of FAQ rich result and one form.

---

## Smoke check (post-deploy)

A **Post-deploy smoke check** checklist is in the main README (see “Post-deploy smoke check”). Use it after each deploy: Rich Results Test on `/faq`, one contact form submit, optional Book Trial submit, and a quick click-through of critical pages.

---

## Future enhancements (out of scope for this plan)

- **Mobile menu: swipe to close** — Optional UX improvement: allow users to swipe the mobile menu closed (e.g. gesture on the drawer). Prioritise when scheduling next UX pass.

---

## Next Step

Run **`/compound:work`** with this plan (e.g. `plans/2026-03-08-product-improvements-a1-a5-plan.md`) to execute steps with atomic commits, or run phases manually and mark checkboxes as you go.
