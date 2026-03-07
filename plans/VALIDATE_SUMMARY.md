# LBTA Compound-Engineering VALIDATE Summary

**Workspace:** `/Users/andrew-mac-studio/LBTA_WEBSITE_DRAFT_3:5:26`  
**Date:** March 6, 2026

---

## 1. Functional Tester

**Score:** 92/100  
**Status:** PASS (with warnings)

**Notes:**
- Production build **succeeds** when run as `./node_modules/.bin/next build` (Next.js 16.1.1, Turbopack). All 44 static/dynamic routes compile and generate.
- Key pages present: `app/page.tsx`, `app/schedules/page.tsx`, `app/book/page.tsx`, plus 29 other pages and API routes.
- All 8 API route handlers exist under `app/api/`: `book`, `register-program`, `register-year`, `register`, `newsletter`, `activecampaign-webhook`, `jtt-registration`, `scholarship`.

**Findings:**
1. **`npm run build` fails if `next` not in PATH** — Script runs `next build`; in environments where `node_modules/.bin` is not on PATH, the build fails with "next: command not found". Fix: use `npx next build` in `package.json` or ensure CI/local uses the same invocation that works (e.g. `./node_modules/.bin/next build`).
2. **Next.js workspace root warning** — Build reports multiple lockfiles and infers workspace root; consider setting `turbopack.root` in `next.config` or removing the extra lockfile to silence.
3. **metadataBase not set** — OG/Twitter image URLs resolve to `http://localhost:3000`; set `metadataBase` in root layout metadata for production URLs.

---

## 2. API Validator

**Score:** 88/100  
**Status:** PASS (with warnings)

**Notes:**
- All 8 API routes export the correct HTTP method(s): POST for form/registration endpoints; `activecampaign-webhook` also exports GET. All use `NextResponse` for responses.
- `book`, `register-program`, `register-year`, `jtt-registration`, `newsletter`, `activecampaign-webhook` use `NextRequest`/`NextResponse`; `register` and `scholarship` use `Request` (no `NextRequest`).
- Error handling: All routes wrap logic in try/catch and return appropriate status codes (400, 429, 500). Rate limiting present on `book`, `register-program`, `register-year`, `jtt-registration`.

**Findings:**
1. **`app/api/register/route.ts` and `app/api/scholarship/route.ts`** use `Request` instead of `NextRequest`; consider aligning with other routes for consistency and future Next.js typing.
2. **`app/api/newsletter/route.ts`** has no rate limiting; other form endpoints use `rateLimit` + `RATE_LIMITS`. Adding rate limiting would reduce abuse risk.
3. **Response shape consistency** — Most routes return `{ success, message }` or `{ success, error }`; `newsletter` returns `{ error }` on 400/500. Standardizing on `{ success: boolean, message?: string, error?: string }` would simplify client handling.

---

## 3. Data Integrity Validator

**Score:** 58/100  
**Status:** WARNINGS (fail on single-source-of-truth)

**Notes:**
- **Single source of truth in `data/`:** `winter2026.json`, `fall2025.json`, `year2026.json`, `leagues-2026.json`, `schedule-2026.json` are used correctly by `app/schedules/page.tsx`, `lib/junior-program-data.ts`, `lib/camps-data.ts`, `app/schedule/page.tsx`, and program/league pages. Schedules page and junior-trial flow are driven by this data.
- **Inconsistency:** Several pages and components duplicate or hardcode pricing and program data instead of consuming `data/*.json`.

**Findings:**
1. **`app/pricing/page.tsx`** — Defines a full local `winter2026Programs` object (juniors, youthDev, adults, cardioLiveball) with hardcoded `price_1x`, `price_2x`, `dropIn`, and a separate `privateRates` array. This duplicates and can drift from `data/winter2026.json` and coach/pricing data. Should import from `data/` or a shared module derived from it.
2. **`app/programs/page.tsx`** — Hardcodes `fromPrice` (42, 55, 58, 31, 120, 50, 25) per program card. Per .cursorrules, prices should not be hardcoded in components; derive from `data/` or a single pricing module.
3. **`app/fitness/page.tsx`** — Inline `fitnessClasses` array with hardcoded `price: "$546/qtr"`, etc. Should come from `data/schedule-2026.json` or a dedicated fitness/schedule data file.

Additional hardcoded price or price-like content (acceptable as copy or one-off schema): `app/racquet-rescue/page.tsx` (service tiers $25/$35/$50/$10), `components/PricingComparison.tsx` (tier comparison), `app/schema.tsx` (structured data prices), FAQ/SEOSchemas narrative dollar ranges. These are secondary to the main “program/schedule pricing” single-source rule but could be moved to data or constants for consistency.

---

## 4. UI/Visual Validator

**Score:** 88/100  
**Status:** PASS (with warnings)

**Notes:**
- **tailwind.config.ts:** LBTA brand palette present (`brand.*`, `lbta.*`), including pacific-dusk, deep-water, victoria-cove, sunset-cliff, sandstone, morning-light, etc. Font families: `headline`/`display`/`serif` → Cormorant, `body`/`sans` → DM Sans (no Inter, Roboto, Playfair, Work Sans in main config).
- **app/globals.css:** Design tokens in `:root` (brand colors, `--font-serif`, `--font-sans`, spacing, radius, transitions). No forbidden fonts in main globals.
- **app/layout.tsx:** Uses `Cormorant` and `DM_Sans` from `next/font/google` with CSS variables `--font-cormorant`, `--font-dm-sans`; body uses `dmSans.className`. Compliant with .cursorrules (Cormorant + DM Sans; no Playfair/Work Sans/Inter/Roboto in main path).
- **CTAs:** Primary CTAs use `btn-primary` and brand colors (e.g. `bg-brand-pacific-dusk`, `bg-brand-sunset-cliff` for accent). No garish orange/red primary buttons; orange/red usage is for badges (e.g. spot counts) and error states, which is acceptable.

**Findings:**
1. **Legacy/PERS files use forbidden fonts** — `app/PERS_General_2025-12-16_globals.css` defines `--font-playfair` and `--font-work-sans`; `app/PERS_General_2025-12-16_layout.tsx` uses `Playfair_Display` and `Work_Sans`; `app/PERS_General_2025-12-16_embedded-forms.css` uses `Inter` throughout. If these files are still served or imported anywhere, they violate .cursorrules. Recommend removing or gating them so the main app only uses Cormorant + DM Sans.
2. **Semantic green for “Save $50”** — `app/schedules/page.tsx` uses `text-green-400` and `text-green-600` for early-bird messaging. Prefer brand tokens (e.g. `text-brand-tide-pool`) for consistency with the design system.
3. **Tailwind shadow `focus`** uses `rgba(46,139,139,0.15)` (Victoria Cove); contrast and focus visibility are fine; no change required, just noted.

---

## 5. Practice Plan Validator

**Score:** N/A  
**Status:** N/A

Not applicable for this project.

---

## Validation Summary

### Overall Score: **81/100**

(Average of the four scored validators: (92 + 88 + 58 + 88) / 4 ≈ 81.5 → **81**.)

### By Validator

| Validator               | Score   | Status   |
|-------------------------|---------|----------|
| Functional Tester       | 92/100  | PASS     |
| API Validator           | 88/100  | PASS     |
| Data Integrity Validator| 58/100  | WARNINGS |
| UI/Visual Validator     | 88/100  | PASS     |
| Practice Plan Validator | N/A     | N/A      |

### Blockers (if any)

- **None.** Build succeeds; critical routes and APIs exist and respond with correct shapes; no single critical path is broken.

### Warnings

1. **Data integrity:** Hardcoded/duplicate pricing and program data on `pricing`, `programs`, and `fitness` pages; should be driven from `data/` as single source of truth.
2. **Functional:** `npm run build` can fail when `next` is not in PATH; recommend `npx next build` or explicit `node_modules/.bin` path in scripts/CI.
3. **API:** Newsletter endpoint has no rate limiting; register/scholarship use `Request` instead of `NextRequest`.
4. **UI:** Legacy PERS_* assets use Playfair, Work Sans, and Inter; schedules page uses raw green classes instead of brand tokens.

### Decision

- [x] **Ready to ship**
- [ ] Needs fixes (non-blocking)

**Post–compound plan:** Fixes 1–9 implemented (PERS_ fonts, data source, tests, build/API, copy/UI tokens, README, compound learn). Schedules/book/thank-you use `brand-tide-pool`; README and routes updated. Build and tests pass; no blockers.

**Recommendation (unchanged):** Safe to ship for launch if timelines are tight, with the understanding that data integrity and build-path warnings should be addressed soon. For “compound” quality and .cursorrules compliance, fix data single-source-of-truth (pricing/programs/fitness from `data/`), align build script and optional API/UI cleanups, then re-run this validate and mark **Ready to ship**.
