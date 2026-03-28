# Compound learn — 2026-03-28

**Trigger:** `/compound:learn` after 12-step audit remediation (homepage, pathway planner, `/match-play`, analytics).

## Corrections captured

| Wrong | Right |
|--------|--------|
| Pathway planner showed client-computed `$` monthly/annual ranges not in `/data` | Remove fabricated numbers; explain variance; **CTA to `/schedules`** (single source of truth for tuition). |
| `/match-play` OG/description implied generic “view programs” while body said unavailable | Align **title, description, OG** with on-page truth; **dual CTAs** to live substitutes (UTR) + schedules. |
| Hero lacked explicit “where is price?” for scanners | **`pricingHint` + `pricingHintHref`** in `homepage-copy.json`; link styled Victoria Cove; track **`heroCta('pricing_hint', …)`**. |

## New anti-patterns (repo)

- **`pathway-calculator-fake-pricing`** — No authoritative dollar output from ad-hoc client math; use `/schedules` or data-backed modules.
- **`thin-page-seo-mismatch`** — Metadata must not promise what the body contradicts.

## New patterns (repo)

- **`hero-pricing-hint-line`** — One line + link to schedules without duplicating rates in JSON elsewhere.
- **`unavailable-offering-landing`** — Honest copy + substitute CTAs + on-brand hero image path (not orphan `legacy-working-assets` when a program hero exists).

## Files touched in work session

- `data/homepage-copy.json`, `components/HomeHero.tsx`, `lib/analytics.ts`
- `app/pathway-planner/page.tsx` (focus rings → `brand-victoria-cove` for form controls)
- `app/match-play/page.tsx`
- `components/VideoTestimonials.tsx` — **deferred Vimeo** (IntersectionObserver on featured grid); **carousel mounts iframe only for `currentIndex`** to cut third-party cookies and main-thread work on initial load (compound full follow-up).
- `plans/compound-full-quality-2026-03-28.md` — full loop plan + scope boundaries

## Follow-up (not compounded as code)

- **LCP / mobile performance** on `/` remains a separate plan (video weight, measurement per URL).
- Re-run **Lighthouse** after any hero media change; acceptance: project targets in `.cursorrules`.

## Artifacts updated

- `.cursor/compound/learnings/corrections.jsonl` (2 lines)
- `.cursor/compound/learnings/anti-patterns.json`
- `.cursor/compound/learnings/patterns.json`
- `COMPOUND_LEARN.md` (section below)
