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
| Schema component defined but not rendered on target page | Import and render the schema in the page or layout that needs it (e.g. FAQSchema in `app/faq/page.tsx`). |
| Footer or nav links with small tap targets | Use `inline-flex items-center min-h-[48px]` (or equivalent) so every interactive link meets 48px touch target. |
| Duplicate JSON-LD schema (server + client same id) | Use a single schema source per page. If the page already renders a schema component (e.g. `<FAQSchema />`), remove any client `useEffect` that injects a script with the same id; duplicate id is invalid HTML and cleanup can remove the server-rendered script. |
| Using Tailwind classes not defined in config | Use only font/display tokens that exist in tailwind.config (e.g. `text-display-xl` not `text-display-lg` unless `display-lg` is defined). Check config before adding custom text-* or font-* classes. |
| Trust/marketing stats (e.g. "500+ players") hardcoded in components | Single source in `data/site-stats.json`; components import and display. Update numbers in one place so they stay accurate. |
| Raw black or lbta-slate in trust/footer sections | Use brand tokens only (e.g. `text-brand-pacific-dusk/70` for secondary text, `bg-brand-pacific-dusk/15` for dividers). |
| Footer text on deep-water at low opacity (text-white/40, /25) | Use text-white/50 or higher for tagline and secondary text to meet WCAG 7:1. |
| Hero CTA with only text color on dark gradient | Use solid background (e.g. bg-white text-black) so contrast meets WCAG. |
| Webhook using payload ID in URLs/bodies without validation | Normalize to positive integer; return 400 if invalid; use only validated number. |
| Webhook secret compared with === | Use crypto.timingSafeEqual with same-length buffers. |
| Parallax or scroll-driven animation without reduced-motion check | Gate with `matchMedia('(prefers-reduced-motion: reduce)')`; disable or use `transform: none` when true (e.g. About hero like HomeHero). |
| Inline blockquote with solid border instead of Brand Guide pull-quote | Use `<PullQuote>` or class `section-quote` for gradient left edge (Victoria Cove → Sunset Cliff); keeps single source for quote styling. |
| Decorative inline SVG (e.g. arrow icons in links) without aria-hidden | Add `aria-hidden="true"` so screen readers don’t announce them. |
| Using Tailwind classes not in config (e.g. lbta-tan) | Use only defined tokens: `lbta-beige` or `brand-sandstone` for warm backgrounds; grep tailwind.config before adding custom color classes. |
| Error/required text using raw red (text-red-400, text-red-500, text-red-800) | Use `text-lbta-red` for error messages and required indicators (asterisks) so error state matches brand palette. |
| HorizonDivider with optional `as` prop | Component always renders `<hr>`; use `variant` and `className` only. No `as` prop (YAGNI). |
| Framer Motion entrance without reduced-motion gate | AnimatedSection (and any component using motion initial/whileInView) runs JS-driven animation; `globals.css` reduced-motion only affects CSS. | Use Framer’s `useReducedMotion()`; when true render a plain `<div>` (or motion with `duration: 0` / no motion) so entrance respects user preference. |
| Hardcoded section paragraphs when data exists | FounderSection (or any section) with fixed `<p>` text while a data field (e.g. `founder.bio`) holds the same content. | Drive copy from data: e.g. `founder.bio.split(/(?<=\.)\s+/).filter(Boolean).map(...)` or `bioParagraphs` in JSON; single source of truth. |
| Full client page when only some parts need client | Page with `'use client'` so schema and all sections run on client; only hero, nav, StickyCTA need interactivity. | Make page a Server Component; render JSON-LD (and static shell) on server; wrap interactive parts in one client component (e.g. CoachesPageClient). |
| Schema builder assuming required fields | getCoachesForSchema() (or any JSON-LD builder) using `coach.image` or `coach.schemaDescription` without guard. | Guard optional fields: only add `image` when present; use `description: coach.schemaDescription ?? coach.bio ?? ''`; use `process.env.NEXT_PUBLIC_SITE_URL` with fallback for base URL. |
| List key by name only | `key={coach.name}` when slug or order is available; names can duplicate or one coach has null slug. | Use stable, unique key: `key={coach.slug ?? \`order-${coach.order}\`}` (or slug-only when guaranteed unique). |
| New code using lbta-slate for secondary text | FounderSection, CoachCard using `text-lbta-slate`; .cursorrules say new code should use brand-*. | Use `text-brand-pacific-dusk/70` (or appropriate opacity) for secondary text and pills. |
| CTA focus ring too weak on dark | `focus:ring-white/30` on dark section; may fail focus-indicator contrast. | Use `focus:ring-white` or `focus:ring-white/60` so focus meets 3:1 (or rely on global focus-visible). |
| Anchor sections without scroll-margin | Sticky in-page nav; sections with id=#leadership, #team, #book; scroll lands with heading under nav. | Add `scroll-mt-28` (or equivalent) to section roots that are anchor targets; consistent with SchedulesAnchorNav. |
| Stopping at preview deploy when user said "deploy" | Compound deploy or user says "deploy" / "push and deploy" | Always: 1) git add/commit, 2) git push to GitHub, 3) vercel --prod. Deploy = GitHub + Vercel production; do not stop at vercel (preview only). |
| Hero with bottom-pinned content and min-h-[70vh] on mobile | Top of headline gets clipped (e.g. "Tennis, as it" missing) when content block is taller than section; overflow-hidden clips it. | Use min-h-screen so section is always full viewport height; full headline stays visible. |

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
| Env + smoke check documentation | After adding env vars or deploy steps | Add .env.example with comments; add a short README section (e.g. Environment variables, Post-deploy smoke check) so onboarding and deploys are repeatable. |
| Run compound:learn after a plan | When a plan is completed or after review/validate | Update `plans/COMPOUND_LEARN.md` (log + any new corrections/patterns); keeps future work from repeating mistakes. See README "When to run compound:learn". |
| Deploy = GitHub + Vercel production | Whenever user or compound workflow says "deploy" or "review then validate then deploy" | 1) Commit changes. 2) git push origin (current branch). 3) vercel --prod. Do not stop at preview deploy (vercel without --prod). This is in quality-bars and patterns so agents do not require repeating. |
| Hero bottom-content no-clip | Hero with bottom-pinned content (absolute bottom-0) and overflow-hidden | Use min-h-screen so section height is always ≥ viewport; content block never extends above section and gets clipped (avoids first line of headline cut off). |
| Single schema source per page | When adding JSON-LD (FAQ, Organization, etc.) to a page | Render schema only on the server (e.g. in page or layout); do not inject a second script with the same id in a client component. Prevents duplicate id and wrong script removed on unmount. |
| Webhook body validation | External webhook routes (e.g. ActiveCampaign) | Validate webhook request body with Zod (or existing schema); return 400 for malformed payloads instead of 500. |
| Single source for trust/marketing stats | Any "500+ players", "15+ years", "5.0 rating" style copy | Keep in `data/site-stats.json`; components (e.g. ExitIntentPopup) import and display. Update numbers in one place so they stay accurate. |
| Single FAQ data source | Homepage FAQSection and FAQ schema (SEOSchemas) | Use `data/faq.json` as canonical list; FAQSection and SEOSchemas import from it. SEOSchemas may override private/scholarship answers with dynamic data. /faq page (FAQInteractive) can keep its own high-performance FAQ set. |
| Webhook ID validate then use | Webhook payload ID used in URLs or request bodies | Normalize to positive integer; return 400 if invalid; use only validated number in URLs and bodies. |
| Webhook secret timing-safe | Verifying webhook authenticity | Buffer.from both; same length; crypto.timingSafeEqual; reject on mismatch. |
| Hero CTA on dark solid bg | Primary CTA on dark hero/gradient | Use bg-white text-black (or bg-black text-white); avoid text-only on dark for contrast. |
| JS scrollIntoView(behavior: 'smooth') without reduced-motion check | Any anchor nav or "scroll to section" that uses scrollIntoView | Gate smooth scroll: `const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches`; use `behavior: prefersReducedMotion ? 'auto' : 'smooth'`. Per .cursorrules and WCAG. |

---

## PATTERNS (continued — Schedules UX Overhaul March 2026)

| Pattern | When to use | Example |
|---------|-------------|---------|
| In-page anchor nav (long schedules/pricing) | Single long page with multiple sections (programs, private, camps, leagues) | Sticky nav with anchor links; section ids + scroll-mt-* so heading isn’t under nav; aria-label="Jump to section"; min-h-[48px] links; smooth scroll gated by prefers-reduced-motion (SchedulesAnchorNav). |
| Pull quotes use section-quote | Any blockquote or “section quote” that should match Brand Guide | Use `<PullQuote>` or apply class `section-quote` (gradient left border); avoid inline `border-l-2 border-brand-pacific-dusk/30` so one source drives quote styling. |
| Parallax / scroll animation gate | Any page or component with parallax or scroll-driven motion | Check `prefers-reduced-motion` (e.g. `matchMedia`) and disable parallax or use static fallback when true; same pattern as HomeHero. |
| Decorative SVG in links/buttons | Icons (arrows, chevrons) that are purely visual | Add `aria-hidden="true"` to the `<svg>` so assistive tech skips them. |
| Error/required text | Form error messages and required field indicators | Use `text-lbta-red`; error boxes use `bg-lbta-red/5 border-lbta-red/20` (no raw red-50/red-200). |
| HorizonDivider | Section divider per Brand Guide | Always renders `<hr>`; use `variant="thin"` (or default) and `className`; no `as` prop. |
| AnimatedSection useReducedMotion | Any Framer Motion entrance (initial/whileInView) in a shared component | Call `useReducedMotion()`; when true render `<div className={...}>{children}</div>` with no motion so CSS reduced-motion isn’t enough (motion is JS). |
| Server Component + client island for JSON-LD | Page that needs JSON-LD in initial HTML and interactive sections | Server page: call getSchema(), render `<script type="application/ld+json">`; render single client wrapper (e.g. PageClient) that contains nav, hero, sections, StickyCTA. |
| Section copy from data | Section with narrative/paragraphs that exist in a data field | Use data (e.g. `founder.bio`) and split/format in component; avoid hardcoded paragraphs that duplicate or drift from data. |
| Schema builder defensive + env | Building JSON-LD (Person, ItemList, etc.) from app data | Guard optional fields (image, url); description fallback (schemaDescription ?? bio ?? ''); base URL from process.env.NEXT_PUBLIC_SITE_URL with fallback. |
| Stable list keys | Mapping over list items that have slug or order | Use `key={item.slug ?? \`order-${item.order}\`}` (or slug when unique) so keys are stable and unique. |
| Anchor section scroll-margin | In-page anchor nav with sticky bar; sections have id for #hash links | Add `scroll-mt-28` (or match nav height) to section roots so scroll-to-section doesn’t hide heading under nav. |

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
| After completing a plan: run /compound:learn | Should (update COMPOUND_LEARN.md so learnings compound) |
| Only use Tailwind tokens defined in tailwind.config | Should (avoids undefined classes like text-display-lg when only display-xl exists) |
| Webhook routes validate request body with Zod | Should (return 400 for malformed payloads) |
| Footer text on deep-water: text-white/50+ for WCAG 7:1 | Must |
| Webhook payload IDs validated as positive integer before use | Must |
| Webhook secret comparison timing-safe (crypto.timingSafeEqual) | Must |
| Hero CTAs on dark backgrounds: solid background for contrast | Must |
| Parallax / scroll-driven motion must respect prefers-reduced-motion | Should |
| Pull quotes must use PullQuote or .section-quote (Brand Guide) | Should |
| Decorative SVGs (icons in links/buttons) must have aria-hidden="true" | Should |
| Only use Tailwind color classes defined in config (no lbta-tan, etc.) | Should |
| Error/required text: use text-lbta-red (not raw text-red-*) | Should |
| Verify error text contrast for WCAG AAA (7:1) when using lbta-red on light backgrounds | Should — use WebAIM Contrast Checker; lbta-red #F04E23 on morning-light #FAF8F4 may be below 7:1; add a darker semantic error token if needed. |
| Framer Motion entrance (AnimatedSection, etc.) must respect useReducedMotion() | Must — JS-driven motion is not gated by CSS prefers-reduced-motion; use useReducedMotion() and render static when true. |
| JSON-LD rendered on server when page can be Server Component | Should — schema in initial HTML; smaller client bundle; run getSchema() on server. |
| Schema builders guard optional fields (image, description) and use env for base URL | Should — avoid runtime throw; description fallback; NEXT_PUBLIC_SITE_URL with fallback. |
| Anchor sections (targets of in-page nav) have scroll-margin-top so heading isn’t under sticky nav | Should — add scroll-mt-28 (or equivalent) to section roots. |

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
- Injecting a client-side script with the same id as a server-rendered schema (duplicate id; unmount cleanup can remove the wrong script)
- Using Tailwind classes not defined in tailwind.config (e.g. text-display-lg when only display, display-sm, display-xl exist)
- Using raw black or generic slate/gray (e.g. text-lbta-slate) in trust blocks or footer; use brand tokens (text-brand-pacific-dusk with opacity) instead
- Footer text at text-white/40 or /25 on deep-water (fails WCAG 7:1); use /50 or higher
- Hero primary button with only text color on dark gradient (no solid background)
- Using webhook payload ID in URLs or request bodies without validating as positive integer
- Comparing webhook secret with === (use crypto.timingSafeEqual with same-length buffers)
- Parallax or scroll-driven animation without checking prefers-reduced-motion (gate like HomeHero)
- Inline blockquote with solid border instead of PullQuote or .section-quote (Brand Guide gradient)
- Decorative SVG (arrow, icon) inside link/button without aria-hidden="true"
- Using Tailwind color classes not in config (e.g. lbta-tan); use lbta-beige or brand-sandstone
- Error/required text with raw text-red-*; use text-lbta-red and brand error box (bg-lbta-red/5 border-lbta-red/20)
- HorizonDivider with `as` prop; component always renders `<hr>`, no `as` prop
- AnimatedSection (or any Framer Motion entrance) without useReducedMotion() — JS motion not gated by CSS reduced-motion
- Hardcoded section paragraphs when the same content exists in data (e.g. founder.bio); breaks single source of truth
- Full client page when only hero/nav/StickyCTA need client; schema and static sections should be server-rendered
- Schema builder using coach.image or optional fields without guard (throws if missing); use fallbacks and env for base URL
- List key by name only when slug or order is available (use slug ?? `order-${order}` for stable unique keys)
- New components using text-lbta-slate; use text-brand-pacific-dusk/70 for secondary text (brand-* in new code)
- CTA focus ring too weak on dark (ring-white/30); use ring-white or ring-white/60 for focus contrast
- Anchor section targets (#leadership, #team, #book) without scroll-mt-* so sticky nav hides heading

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
| 2026-03-08 | `/compound:learn` after product improvements A1–A5 | Plan executed: .env.example, FAQ schema on /faq, Footer 48px touch targets, image discipline in .cursorrules, post-deploy smoke check in README. New: wire schema components to the page that needs them; document env and smoke check so deploys are repeatable; run learn after completing a plan (see README "When to run compound:learn"). |
| 2026-03-08 | `/compound:learn` after review + validate | Review (8 agents): fixed duplicate FAQ schema (removed client useEffect in FAQInteractive), Footer Privacy/Terms 48px + mailto aria-label, text-display-lg → text-display-xl. Validation (5 agents): 92/100, no blockers; functional 98, data integrity 95. New corrections: single schema source per page (no client duplicate id); use only Tailwind tokens defined in config. New patterns: single schema source per page; webhook body validation. New standards: Tailwind tokens from config; webhook Zod validation. New anti-patterns: duplicate schema id; undefined Tailwind classes. |
| 2026-03-08 | Optional follow-up: webhook Zod, ExitIntentPopup, single FAQ | **Done:** (1) activecampaign-webhook validates body with `webhookPayloadSchema`; returns 400 on invalid JSON or validation failure. (2) ExitIntentPopup: no raw black/slate — privacy line and labels use `text-brand-pacific-dusk/70` and `text-brand-pacific-dusk/80`; dividers use `bg-brand-pacific-dusk/15`. Trust stats (500+, 15+, 5.0) now from `data/site-stats.json` (single source; update there for accuracy). (3) Single FAQ source: `data/faq.json` added; FAQSection and SEOSchemas use it; SEOSchemas overrides private + adds scholarship answer dynamically. **Learnings:** Trust stats and marketing numbers from data; no raw black/slate in trust sections (brand tokens only); single FAQ source for homepage + schema. |
| 2026-03-08 | `/compound:learn` after review → validate → deploy | Fixes: Footer contrast (text-white/50+ on deep-water); About/Contact primary CTAs black/white; Contact hero CTA solid bg; activecampaign-webhook contactId validated as positive int + 400 if invalid; webhook secret with crypto.timingSafeEqual. Deploy: production 100/100. **Learnings:** 4 corrections, 4 anti-patterns, 3 quality bars, 3 patterns (footer contrast, hero CTA on dark, webhook ID validation, webhook timing-safe secret). |
| 2026-03-09 | `/compound:learn` after review → validate → deploy (brand guide) | Scope: Apply Brand Guide (--horizon, .section-quote, .section-horizon, HorizonDivider). Review: 6 agents, PASS + warnings. Deploy: production https://lbta-website.vercel.app. **Learnings:** 4 corrections (parallax reduced-motion, pull quote use section-quote, decorative SVG aria-hidden, no undefined Tailwind e.g. lbta-tan); 3 patterns (pull quote section-quote, parallax gate, decorative SVG aria-hidden); 4 standards; 4 anti-patterns. Optional follow-up: About parallax gate, homepage/high-perf blockquotes → PullQuote, lbta-tan → brand-sandstone, SVG aria-hidden on homepage CTAs. |
| 2026-03-09 | Compound work: error text + contrast + HorizonDivider docs | **Contrast:** lbta-red (#F04E23) on morning-light (#FAF8F4) may be below WCAG AAA 7:1 — verify with WebAIM; add darker error token if needed. **Standardized:** NewsletterForm, TrialBookingModal, LuxuryYearModal use text-lbta-red for error/required; error boxes use bg-lbta-red/5 border-lbta-red/20. **HorizonDivider:** Docs updated — always renders `<hr>`, no `as` prop (YAGNI). |
| 2026-03-09 | `/compound:learn` (full run) | **Extraction:** From compound work (error text, contrast, HorizonDivider). **corrections.jsonl:** +4 (error/required → text-lbta-red; error box tokens; HorizonDivider no as; lbta-red contrast verify). **anti-patterns.json:** +2 (error-text-raw-red, horizon-divider-as-prop). quality-bars.json and patterns.json already updated in same session. |
| 2026-03-09 | Optional: internal tools lbta-red + `/compound:learn` | **Work:** AnalyticsDashboard and ComprehensiveFormTester — all raw red (text-red-600, bg-red-50, border-red-200, etc.) replaced with text-lbta-red, bg-lbta-red/5, border-lbta-red/20, bg-lbta-red/10. **Learn:** corrections.jsonl +1 (internal tools use lbta-red for error/destructive UI for brand consistency). |
| 2026-03-09 | `/compound:learn` after coaches overhaul review + fixes | **Scope:** Coaches page overhaul (data/coaches.json, lib/coaches-data.ts, components/coaches/*, app/coaches). **Review:** 78/100; 1 critical (AnimatedSection not gated by reduced motion), 8 warnings. **Fixes applied:** AnimatedSection useReducedMotion(); FounderSection from founder.bio + brand tokens; Server Component page + CoachesPageClient island; getCoachesForSchema guards + SITE_URL env; stable list keys; CTA focus ring; scroll-mt-28 on anchor sections; CoachCard brand tokens. **Learnings:** 9 corrections (Framer Motion entrance useReducedMotion; hardcoded section copy → data; full client → server + island; schema builder guards + env; stable list keys; lbta-slate → brand-*; CTA focus on dark; anchor scroll-margin). 6 patterns (AnimatedSection useReducedMotion; Server Component + client island for JSON-LD; section copy from data; schema defensive + env; stable list keys; anchor scroll-margin). 5 standards; 9 anti-patterns. quality-bars and .cursor/compound/learnings/*.json updated. |
| 2026-03-11 | `/compound:learn` hero headline clip + deploy convention | **Hero fix:** Homepage "Tennis, as it should be taught" was cut off at top — hero had min-h-[70vh] on mobile; bottom-aligned content block extended above section and was clipped by overflow-hidden. Fix: min-h-screen so section is always full viewport. **Learnings:** 1 correction (hero bottom-content + short min-height → min-h-screen); 1 pattern (hero-bottom-content-no-clip); 1 quality bar (heroFullHeadlineVisible); 1 anti-pattern (hero-short-min-height-with-bottom-content). Deploy convention (git push + vercel --prod) was already in patterns/quality-bars/COMPOUND_LEARN from prior session. |
