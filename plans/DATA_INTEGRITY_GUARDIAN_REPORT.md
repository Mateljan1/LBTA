# Data Integrity Guardian Report — LBTA

**Review date:** March 6, 2026  
**Scope:** Single source of truth, no hardcoded prices, data in `/data`; pathway-planner and partner content vs removed products; schedules as source for programs.  
**Reference:** `plans/REVIEW_SCOPE.md`, `.cursorrules` Part 12 (Data Management), Part 13 (File Structure).

---

## Status: ❌ ISSUES

Critical data-integrity issues exist: duplicate program/camp data and hardcoded prices in multiple pages. Pathway-planner and partnership content correctly avoid removed products; schedules remain the intended source for programs but several pages bypass `/data`.

---

## Findings

| Severity | Location | Issue | Recommendation |
|----------|----------|--------|----------------|
| 🔴 Critical | `app/junior-trial/page.tsx` | Full `programData` object (schedules + pricing for all age bands) is hardcoded in the file. Duplicates content that exists in `data/winter2026.json` (and related season data). | Source program list, schedules, and pricing from `/data` (e.g. `winter2026.json` / `fall2025.json`) or a shared module. Remove inline `programData` and align with schedules page. |
| 🔴 Critical | `app/camps/page.tsx` | `summerWeeks`, `swimTennisWeeks`, and full `camps` array (with prices) are hardcoded. `data/year2026.json` already defines camps with prices; camps page does not import it. | Import camp and week data from `data/year2026.json` (or a dedicated camps JSON). Use that as single source; remove duplicate inline camp/week and price definitions. |
| 🟡 Warning | `app/pathway-planner/page.tsx` | Investment ranges (monthly 140–200, 260–380, 400–650, 700–1200; annual derived) are hardcoded. Program names align with current data; no VYLO reference. | Move investment ranges to `/data` (e.g. `pricing-2026.json` or pathway-specific JSON) and consume in component. Keep program names in sync with schedules/data. |
| 🟡 Warning | `app/programs/page.tsx` | `programs` array includes hardcoded `fromPrice` (42, 55, 58, 31, 120, 50, 25). Page links to `/schedules` but “from” prices are not sourced from data. | Derive “from” prices from `/data` (e.g. min price per category from winter2026/year2026) or add a small programs-overview JSON in `/data` and import it. |
| 🟡 Warning | `app/fitness/page.tsx` | Fitness schedule and prices (e.g. `$546/qtr`, `$756/qtr`) are hardcoded in the component. | Move fitness schedule and pricing to `/data` (e.g. `schedule-2026.json` or `fitness-2026.json`) and import. |
| 🟡 Warning | `app/schema.tsx` | `priceRange` ("$120-$250") and all Course `offers.price` values (120, 756, 1437, 546) are hardcoded. | Derive from `/data` (e.g. min/max from winter2026 or pricing-2026) or a small schema-specific JSON; keep schema in sync with live program pricing. |
| 🟡 Warning | `app/programs/usta-adult-league/page.tsx` | Narrative copy contains hardcoded “Total season cost: $5,500” and “USTA membership ($48/year)”. League table uses `leagues2026` from `/data` correctly. | Move team season cost and USTA membership amount to `data/leagues-2026.json` (or shared copy) and reference in template so one source drives both copy and tables. |
| 🟢 Note | `app/racquet-rescue/page.tsx` | Service pricing ($25, $35, $50+, $10, string ranges) is hardcoded. This is non-LBTA program (equipment/stringing) pricing. | Acceptable as-is for non-program pricing; optionally move to a small `data/racquet-rescue.json` if you want all dollar values out of components. |
| 🟢 Note | `app/faq/FAQInteractive.tsx` | “$150,000-$300,000+” and “$1,500-$3,000/month” are informational 10-year pathway cost ranges, not product prices. | Low priority; could move to a copy/data file if you want zero dollar figures in components. |

---

## Positive checks

- **Pathway-planner:** No VYLO reference; elite recommendation says “explore High Performance programs”. Program names (Little Tennis Stars, Red Ball, Orange Ball, Green Dot, Youth Development, High Performance, Adult Programs) align with current offerings; no removed products.
- **PartnershipSection:** No VYLO or removed product; partner list is current (Fit4Tennis, Racket Rescue, RacquetIQ, GPTCA, Toroline, Tennis Beast, Laguna Beach High School).
- **Schedules as source:** `app/schedules/page.tsx` correctly uses `data/winter2026.json`, `data/fall2025.json`, `data/year2026.json` for programs, pricing, and camps. Single source of truth for the schedules page is respected.
- **Programs/junior:** `app/programs/junior/page.tsx` redirects to `/schedules#programs`; no duplicate program content.
- **Leagues:** `app/programs/utr-match-play/page.tsx` and `app/programs/usta-adult-league/page.tsx` use `data/leagues-2026.json` for divisions/leagues; UTR prices come from data.
- **VYLO redirects:** `next.config.js` correctly redirects `/vylo` and `/vylo-apply` to `/programs/high-performance` (no broken links to removed product).
- **Data directory:** `/data` contains `winter2026.json`, `fall2025.json`, `year2026.json`, `leagues-2026.json`, `schedule-2026.json`, `pricing-2026.json`; structure supports single source of truth where used.

---

## Summary

Pathway-planner and partner content do not reference removed products, and the schedules page correctly uses `/data` as the source for programs and pricing. However, **junior-trial** and **camps** duplicate program/camp and price data that already exists in `/data`, and **pathway-planner**, **programs overview**, **fitness**, **schema**, and **USTA narrative** use hardcoded prices or copy. Remediate the two critical duplicates first (junior-trial and camps), then move remaining prices and narrative amounts into `/data` so the site has a single source of truth and no hardcoded program pricing in components.
