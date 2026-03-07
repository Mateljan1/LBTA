# Compound-Engineering Learnings — LBTA

**Source:** Code Review V2 (94→98/100) + Validation V2 (95→98/100) — March 6, 2026  
**Workspace:** LBTA_WEBSITE_DRAFT_3:5:26

---

## CORRECTIONS (what was wrong → what to do instead)

| Original | Correction |
|----------|------------|
| Using `next lint` in package.json | Next 16 has no `next lint`. Use `./node_modules/.bin/eslint . --ext .js,.jsx,.ts,.tsx` (or `npx eslint ...`) so lint runs reliably. |
| Using `next build` in package.json when `next` not in PATH | Use `npx next build` or `./node_modules/.bin/next build` in the build script. |
| Using `vitest run` in package.json when `vitest` not in PATH | Use `npx vitest run` in the test script so it works in CI and fresh clones. |
| Hardcoding prices in page components | Source all pricing from `data/*.json` or `data/pricing-supplemental.json` via lib modules. |
| Hardcoding promotional prices ($50 early bird) in multiple pages | Centralize in `data/pricing-supplemental.json` under `promotions` key and import everywhere. |
| Schema.tsx with hardcoded priceRange and course prices | Add `schema` key to `data/pricing-supplemental.json` and import in schema.tsx. |
| PERS_ layout using Playfair Display + Work Sans | Use Cormorant + DM Sans only; no Playfair, Work Sans, Inter, Roboto in any served layout. |
| API routes using `Request` instead of `NextRequest` | Use `NextRequest` in all API routes for consistency and Next.js typing. |
| API routes without rate limiting or Zod | Every form/registration endpoint must have rate limiting and Zod validation. |
| ActiveCampaign webhook without signature verification | Verify `AC_WEBHOOK_SECRET` header; skip gracefully if env var not set (dev only). |
| Hero images referencing non-existent paths | Always verify image paths exist in public/. Use `public/images/programs/` for program heroes. |
| Hero images using JPG instead of WebP | Prefer WebP format (e.g. `/images/programs/juniors.webp`). |
| Hero images without `sizes` attribute | Add `sizes="100vw"` for fill/priority images. |
| "Elite" in user-facing copy | Use "High Performance", "Advanced", "Intensive", or "Professional" instead. |
| Raw `green-*` Tailwind classes | Use `brand-tide-pool` token exclusively for success/positive UI. |
| Raw `orange-*` Tailwind classes for warnings | Use `brand-sunset-cliff` token for warning/low-capacity states. |
| Hardcoded hex `#FAF8F3` in components | Use `bg-brand-morning-light` from tailwind config. |
| Rate limit key collision (register vs register-program) | Use unique prefixes per route: `book:`, `register:`, `register-program:`, etc. |
| PII (name, email) in console.log | Log only timestamps, program types, non-PII identifiers. |
| Error messages leaking `error.message` to client | Return generic error messages; log details server-side only. |
| Newsletter catch returning 400 for all errors | Return 400 for validation/syntax errors, 500 for server/network errors. |
| No metadataBase in root layout | Set `metadataBase: new URL('https://lagunabeachtennisacademy.com')` for OG images. |
| Dead route files not cleaned up | Remove files when redirects exist in next.config.js; don't leave orphan pages. |
| Framer Motion delay in ms instead of seconds | Framer Motion `transition.delay` expects SECONDS. When accepting `delay` prop in ms (100, 200), divide by 1000: `delay: delay / 1000`. Without this, `delay={100}` = 100 second wait = invisible content. |
| Large 1100+ line page file | Extract into focused components under a subdirectory (e.g. `components/schedules/`). Page becomes composition layer (296 lines). |
| Undocumented PERS_* legacy files | Create a README documenting what they are and that they're not served in production. |

---

## PATTERNS (name — when to use — example)

| Pattern | When to use | Example |
|---------|-------------|---------|
| Single source of truth for pricing | Any program/schedule/pricing display | Import from `data/winter2026.json`, `data/pricing-supplemental.json`, or `lib/*-data.ts` |
| Supplemental pricing file | Campaign/landing page prices outside main schedules | `data/pricing-supplemental.json` with keys per page: `beginnerProgram`, `matchPlay`, `racquetRescue`, `promotions`, `leagues`, `schema` |
| API route contract | All app/api routes | NextRequest, Zod validation, rate limiting, `{ success, message?, error? }` response |
| Brand tokens only | All UI colors | `brand-tide-pool` (success), `brand-sunset-cliff` (warning), `brand-morning-light` (background), `brand-pacific-dusk` (primary) |
| Script resilience | package.json scripts | Use `npx <tool>` for build, test, lint scripts |
| Dev-gate debug components | Any debug/analytics UI | `{process.env.NODE_ENV === 'development' && <DebugComponent />}` |
| Webhook secret verification | External service webhooks | Check env-based secret with graceful skip for dev |
| PII-safe logging | All API routes | Log action types and timestamps, never names/emails/phones |
| Unique rate limit keys | Multiple similar API endpoints | Prefix with route name: `register-program:${ip}` not `register:${ip}` |
| Page composition pattern | Large pages (500+ lines) | Extract sections into `components/<page-name>/` directory; page imports and composes them. Data stays in page, flows down as props. |
| Component barrel exports | Multi-component directories | Add `index.ts` with named exports for clean imports: `import { Hero, Tabs } from '@/components/schedules'` |
| Test pyramid | lib → API → E2E | Unit tests for schemas/utilities, contract tests for API routes, E2E for critical flows |
| Legacy file documentation | Orphan/A/B test files | Create a README next to legacy files explaining their origin, status, and cleanup timeline |

---

## STANDARDS (rule — enforcement level)

| Rule | Level |
|------|--------|
| No hardcoded prices outside `data/` or shared modules | Must |
| No hardcoded promotional prices — centralize in data/pricing-supplemental.json | Must |
| All form/registration API routes must have rate limiting + Zod validation | Must |
| All API routes use NextRequest/NextResponse and consistent JSON shape | Must |
| No PII in console.log statements | Must |
| No forbidden fonts (Playfair, Work Sans, Inter, Roboto) in any served layout | Must |
| No forbidden copy ("elite", "world-class", "maximize", "boost") in user-facing text | Must |
| No raw green-*/orange-*/red-* (except semantic error states) | Must |
| No hardcoded hex colors — use tailwind brand tokens | Must |
| metadataBase set to production URL | Must |
| Webhook endpoints verify authenticity | Must |
| Rate limit keys unique per endpoint | Must |
| Image paths must reference files that exist in public/ | Must |
| Hero/priority images: WebP preferred, `sizes` set | Must |
| Debug components gated by NODE_ENV | Must |
| Pages > 500 lines should be extracted into component directories | Should |
| README and docs match current routes, fonts, colors, tagline | Should |
| Unit tests for all lib validation schemas | Must |
| API contract tests (route exports + schema validation) | Should |
| Legacy/PERS_* files documented with README | Should |
| API integration tests | Should (when CI is set up) |

---

## ANTI-PATTERNS (avoid)

- Duplicating program or pricing data in page components instead of importing from `data/`
- Hardcoding promotional discounts ($50 early bird) inline instead of centralizing
- Adding API routes without rate limiting and Zod
- Logging PII (name, email, phone, income) in any API route
- Using `<img>` where Next.js `<Image />` is available
- Referencing image paths that don't exist in public/
- Serving PERS_* or legacy layouts with forbidden fonts
- Using raw Tailwind color classes (green-*, orange-*) instead of brand tokens
- Hardcoding hex colors in component classNames
- Rate limit key collisions between similar endpoints
- Leaking `error.message` in client-facing API responses
- Leaving dead route files when redirects already handle the URL
- Letting page files grow past 500 lines without extraction
- Leaving undocumented legacy/A/B test files in the repo

---

## QUALITY BARS (for next review/validate)

- **Review score >= 98**, no critical or warning issues
- **Validation score >= 98**, Data Integrity >= 95
- **Tests:** 106+ tests passing; all validation schemas + API contracts covered
- **Build:** `npm run build` and `npm run test` succeed on fresh clone
- **Deploy:** Vercel production build succeeds with 0 errors
- **Lint:** Zero errors
- **Page size:** No page file > 500 lines (composition pattern)
- **Zero hardcoded prices** in any .tsx file (all from data/)
- **Zero raw color classes** (green-*, orange-*) in components or app
- **Zero forbidden copy** in user-facing text

---

## METRICS (before → after)

| Metric | Before (V1) | After Fixes 1-9 | After Final Pass |
|--------|-------------|------------------|------------------|
| Review Score | 82/100 | 94/100 | ~98/100 |
| Validation Score | 81/100 | 95/100 | ~98/100 |
| Tests | 0 | 53 | 106 |
| Hardcoded prices | 30+ instances | ~10 remaining | 0 (all in data/) |
| Raw color classes | 47+ green-*, 6+ orange-* | 0 green-*, 6 orange-* | 0 |
| Forbidden copy | 5+ "elite" | 1 in PERS data | 0 |
| Schedules page lines | 1,124 | 1,124 | 296 (8 components) |
| Dead route files | 5 | 0 | 0 |

---

## Learn run log

| Date | Trigger | Actions |
|------|---------|--------|
| 2026-03-06 | `/compound:learn` after Fixes 1-9 | Initial learnings from review (82/100) and validation (81/100). |
| 2026-03-06 | `/compound:full` 100/100 pass | Complete rework: 13 corrections, 9 patterns, 16 standards. Review → 94/100, validation → 95/100. |
| 2026-03-06 | `/compound:learn` final pass | Fixed all remaining non-blocking: centralized promo prices ($50 early bird, leagues, schema), hero image WebP, schedules extraction (1124→296 lines, 8 components), 53 new API contract tests (106 total), thank-you orange tokens, PERS docs, PERS data "elite" fix. Added 5 new corrections, 4 new patterns, 5 new standards. All categories approaching 98-100/100. |
| 2026-03-06 | `/compound:learn` animation bug | **CRITICAL BUG FOUND:** `components/ui/AnimatedSection.tsx` passed `delay` (in ms: 100, 200, 300) directly to Framer Motion's `transition.delay` which expects seconds. Result: text elements with delay > 0 waited 100+ seconds to appear, making them invisible. Fix: `delay: delay / 1000`. **New correction added:** Always verify Framer Motion delay units are in seconds, not milliseconds. |
