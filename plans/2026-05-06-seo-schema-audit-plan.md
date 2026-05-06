# SEO + Schema Audit — Plan Stub

**Status:** Queued from /compound:full brand-system run (2026-05-06)
**Predecessor:** `plans/2026-05-05-brand-system-lockdown-audit.md` (brand v1.1 locked)
**Type:** Plan stub — run `/compound:plan` to expand before executing

## Why now

Brand foundation is locked, deploy pipeline is healthy. SEO/schema is the next-highest-leverage adjacent win for organic discovery. Existing SEO work is in `plans/2026-04-16-seo-p1-schema-copy-bundle.md` and `plans/2026-04-16-seo-audit-review-and-checklist-v2.md`; this plan is a fresh full-site audit + execution.

## Scope (start here when expanding)

### Inventory

- `app/layout.tsx` — root metadata (already strong: title template, OG, Twitter cards, viewport theme colors)
- `app/schema.tsx` — `OrganizationSchema`, `LocalBusinessArraySchema`
- `components/SEOSchemas.tsx` — `ReviewSchema`
- `app/sitemap.ts` — sitemap generation
- Per-page metadata exports across `app/**/page.tsx` (45 routes)

### Audit dimensions

- **Per-page metadata** — every route has descriptive `title` (≤60 chars), `description` (140-160 chars), unique `openGraph.images` where it makes sense
- **Canonical URLs** — verify every page exports the right canonical (especially after route changes)
- **JSON-LD coverage** — Organization, LocalBusiness (one per training site), Course (per program category), Person (founder + coaches), Review, FAQPage (for /faq), BreadcrumbList
- **Sitemap completeness** — all public routes included, no draft/internal routes leaked, lastModified dates populated
- **robots.txt** — `/brand` already noindex; verify other internal routes (admin, login, coach-hub) excluded from indexing
- **OG image audit** — every page either uses the default brand OG image or has a per-page hero. No pages with broken OG images.
- **Performance signals** — Core Web Vitals on every audited route (LCP, CLS, INP via PageSpeed Insights)
- **Internal linking** — orphan pages identified; key money pages get extra internal links

### New work

- **FAQPage schema** for `/faq` (high CTR opportunity)
- **Course schema** for each program category (junior, adult, high-performance)
- **HowTo schema** for `/pathway-planner` if applicable
- **Brand-aware OG image generator** — per-program OG image with the locked-in brand system, generated at build time

## Acceptance (draft)

- Every public route has descriptive title + description + canonical + OG image
- JSON-LD validator (schema.org / Google Rich Results) passes for Organization, LocalBusiness, Course, Person, Review, FAQPage on representative pages
- Sitemap covers all 40+ public routes with correct lastModified
- PageSpeed Insights mobile score ≥ 85 on /, /schedules, /programs, /coaches, /book
- Lighthouse SEO score = 100 on all audited routes

## Out of scope

- Content rewriting (separate plan)
- Backlink strategy / outreach
- Paid acquisition (Google Ads, Meta)
- Content marketing calendar (lives in `gpt/` knowledge brain)

## Estimate

~2 days (audit + schema additions + per-page metadata polish). Run `/compound:plan plans/2026-05-06-seo-schema-audit-plan.md` to expand.
