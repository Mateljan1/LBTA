# Pattern Recognizer Review — Coaches Overhaul

**Status:** ⚠️ WARNINGS

## Findings

| Severity | Location | Issue | Recommendation |
|----------|----------|-------|----------------|
| ⚠️ Warning | `components/coaches/FounderSection.tsx` | Uses `text-lbta-slate` (lines 53, 77). Rules prefer `brand-*` for new code. | Replace with `text-brand-pacific-dusk/70` to match schedules/secondary text pattern. |
| ⚠️ Warning | `components/coaches/CoachCard.tsx` | Uses `text-lbta-slate` in four places (lines 48, 63, 108, 123). | Replace with `text-brand-pacific-dusk/70` for secondary text and credential pills. |
| ⚠️ Warning | `components/coaches/FounderSection.tsx` | Founder bio is hardcoded (three `<p>` paragraphs) instead of using `founder.bio` from `data/coaches.json`. | Use `founder.bio` (or split/format from data) so content stays single source of truth. |
| ⚠️ Warning | `app/coaches/page.tsx` | JSON-LD schema is rendered in a client component via `getCoachesForSchema()`. Schema is emitted after hydration. | Optional: move schema to `app/coaches/layout.tsx` (server) and pass as prop or render inline for earlier crawl. |
| ℹ️ Info | `components/coaches/CoachesHero.tsx` | Hero has no `.section-horizon` under the headline. About page uses `section-horizon` in hero. | Consider adding `<div className="section-horizon mb-6 opacity-90" aria-hidden="true" />` for Brand Guide consistency. |
| ℹ️ Info | `components/coaches/CoachesCTA.tsx` | CTA buttons use `min-h-[52px]` and `tracking-[0.02em]` (not `min-h-[48px]` / `tracking-[2.5px]` uppercase). | Matches about page CTA style; schedules uses the stricter button spec. Acceptable; optional alignment to schedules later. |

## What Matches Patterns ✅

- **Data + lib:** `data/coaches.json` is single source; `lib/coaches-data.ts` mirrors `programs-data.ts` (JSON import, typed accessors, `getCoaches`, `getFounder`, `getLeadCoach`, `getProgramCoaches`, `getCoachBySlug`, `getCoachesForSchema`).
- **Section spacing:** `py-20 md:py-32` / `py-20 md:py-28`, `max-w-[1400px] mx-auto px-6 md:px-16` consistent with about/schedules.
- **HorizonDivider:** Used between CoachesHero, FounderSection, CoachingTeamSection, and CoachesCTA.
- **Buttons/links:** CoachesCTA uses luxury black/white on dark (bg-white primary, border white secondary); CoachesAnchorNav and CoachCard links use `min-h-[48px]` (or 52px CTA ≥ 48px).
- **Typography:** `font-headline` for headings, `font-sans` for body; eyebrow 11px uppercase; scale consistent.
- **next/image:** All coach and hero images have descriptive `alt` and appropriate `sizes`; hero uses `priority`.
- **StickyCTA:** Rendered at bottom of page with `text="Book Trial"` and `href="/book"`.

## Summary

The coaches overhaul is aligned with LBTA structure (data in `/data`, accessors in `lib`, section spacing, HorizonDivider, StickyCTA, next/image). Remaining items are use of `lbta-slate` in new coach components (prefer `brand-pacific-dusk/70`), hardcoded founder bio in FounderSection (prefer data-driven copy), and optional schema-in-server and hero `section-horizon` tweaks. Address the lbta-* and founder-bio items for full consistency; the rest are optional refinements.
