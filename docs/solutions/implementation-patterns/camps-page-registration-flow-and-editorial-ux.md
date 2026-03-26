---
title: Camps page — registration flow, schedules integration, editorial UX, and a11y patterns
slug: camps-page-registration-flow-and-editorial-ux
category: implementation-patterns
tags:
  - camps
  - registration
  - LuxuryYearModal
  - schedules
  - buildCampModalRegistration
  - CampListingCard
  - year2026
  - accessibility
  - prefers-reduced-motion
  - lbta-brand
severity: low
status: solved
date: 2026-03-26
related_files:
  - app/camps/page.tsx
  - components/camps/CampListingCard.tsx
  - components/camps/CampFAQAccordion.tsx
  - components/camps/index.ts
  - components/schedules/SchedulesPageClient.tsx
  - components/schedules/CampsSection.tsx
  - components/schedules/CampRow.tsx
  - components/LuxuryYearModal.tsx
  - lib/camp-modal-data.ts
  - lib/camp-date-bounds.ts
  - lib/camps-data.ts
  - data/year2026.json
related_docs:
  - docs/solutions/implementation-patterns/visual-elevation-conversion-strip-facility-quote-pattern.md
---

# Camps page — registration flow, schedules integration, editorial UX, and a11y patterns

## Context summary

**Problem type:** UX, data wiring, and consistency across `/camps` and `/schedules` for camp registration.

**Symptoms (before):**

- Schedule & Pricing **Holiday Camps** section sent users to **Contact** instead of the camp registration modal.
- `/camps` used a **two-column card grid** with **scroll-heavy week pickers** and duplicated CTAs; flow felt busy and uneven versus other LBTA pages.
- Modal payload sometimes **derived `perDay` as `week.price / week.days`**, which is wrong for **half-day drop-in** pricing (should use `camp.perDay` / `dropInRate` from data).
- Registration needed to capture **week vs full session vs drop-in** and **drop-in day** where applicable (`LuxuryYearModal` + `getCampDropInDateBounds`).

**Outcome:** Single source of camp rows with weeks via `getCampsFromYear2026()`, shared modal payload via `buildCampModalRegistration()`, editorial single-column listing with week **table** + secondary “choose in form” CTA, FAQ accordion aligned with online registration, and review hardening for **filter semantics**, **reduced motion**, and **touch targets**.

---

## Root cause analysis

| Issue | Cause |
|-------|--------|
| Schedules camps dead-ended on contact | `CampsSection` received flat `year2026.camps` (no generated `weeks`) and `onRegister` pointed to `window.location.href = '/contact'`. |
| Wrong drop-in math in modal prefill | Manual modal object used `Math.round(week.price / week.days)` for `perDay` instead of JSON `perDay` / dedicated `dropInRate`. |
| Fragmented camp types | Inline `CampModalData` duplicated fields already modeled by `CampRegistrationData` + `buildCampModalRegistration`. |
| UX clutter | Multi-week camps used stacked buttons in a small scroll area; no scannable **week | dates | price | action** matrix. |

---

## Working solution

### 1. Shared modal payload (`lib/camp-modal-data.ts`)

Use **`buildCampModalRegistration(camp, selectedWeek?)`** for `/camps` and `/schedules`:

- Sets `perDay` and **`dropInRate: camp.perDay`** from year data — never derive drop-in from bundle ÷ days.
- Passes through **`weeks`** and optional **`selectedWeek`** so `LuxuryYearModal` can show week picker when no week is pre-selected.

### 2. Schedules page client

- Import **`getCampsFromYear2026()`** (full **`CampWithWeeks`** including generated weeks for summer / swim-tennis).
- **`onRegister`:** `setSelectedCamp(buildCampModalRegistration(camp))`, open **`LuxuryYearModal`** (`type="camp"`).

### 3. `LuxuryYearModal` (camp path)

- **`getPricingOptions`:** If camp has `weeks` and no active week, return **no options** until a week is chosen (forces explicit week).
- **Step 1:** Week list when needed; **half-day drop-in** shows **`<input type="date">`** bounded by **`getCampDropInDateBounds(campId, week)`**; **Continue** gated by **`canContinueStep1`** (week + option + drop-in date when required).
- **Step 2:** Human-readable summary via **`step2SelectionSummary()`** (not raw `full` / `day`).
- **`handleSubmit`:** Merge **`campWeek`**, **`campPricingOption`**, **`dropInDate`** into payload/notes for `/api/register-year`.

### 4. `/camps` page redesign

- **Hero:** Editorial left-aligned block; primary **Browse sessions** → `#camps`, secondary **Schedule & pricing** → `/schedules#camps`.
- **Sessions:** **`container-lbta`**, underline **season filter**, **single column** `max-w-[880px]` camp list.
- **`CampListingCard`:** Optional image strip per camp id; **table** for multi-week rows (Register per week) + **Register — choose week in form**; single-week block with price + Register.
- **Story:** Reduced zigzag count; **`section-quote`** for Movement / Craft / Community line.
- **Footer band:** UTR + contact, **`CampFAQAccordion`** (`<details>`), final CTA back to `#camps`.

### 5. Accessibility and motion (review follow-up)

- **Season filter:** Use **`role="group"`** + **`aria-label="Filter camps by season"`** and **`aria-pressed`** on buttons — not **`tablist`/`tab`** without **`tabpanel`** / **`aria-controls`**.
- **Card image hover scale:** Add **`motion-reduce:transition-none`** and **`motion-reduce:group-hover:scale-100`** (see `.cursorrules` reduced-motion).
- **Table Register:** **`min-h-[48px]`** for touch targets on mobile.

---

## Code references (patterns)

**Schedules — open modal with full camp data:**

```tsx
import { getCampsFromYear2026 } from '@/lib/camps-data'
import { buildCampModalRegistration } from '@/lib/camp-modal-data'

const scheduleCamps = getCampsFromYear2026()

<CampsSection
  camps={scheduleCamps}
  onRegister={(camp) => {
    setSelectedCamp(buildCampModalRegistration(camp))
    setIsCampModalOpen(true)
  }}
/>
```

**Camps page — same handler:**

```tsx
setSelectedCamp(buildCampModalRegistration(camp, camp.selectedWeek))
```

---

## Prevention and standards

1. **Never derive drop-in price** from `week.price / week.days`; use **`camp.perDay`** / **`dropInRate`** from **`buildCampModalRegistration`** or **`CampRegistrationData`**.
2. **Schedules camp list** must use **`getCampsFromYear2026()`** (or equivalent loader that attaches **`weeks`**) if registration depends on week selection.
3. **Filter controls** that are not true tabs: prefer **`role="group"`** + **`aria-pressed`** (or plain buttons with **`aria-label`** on container), unless you implement full **tablist/tab/tabpanel** wiring.
4. **Decorative card images** may use **`alt=""`** when the **heading** names the program; keep **hero** image descriptive **`alt`** for LCP SEO.
5. **Motion:** Any hover transform on images should respect **`prefers-reduced-motion`**.

### Suggested manual QA (acceptance)

- `/schedules` → Holiday Camps → **Register** opens modal with week selection for multi-week camps.
- `/camps` → filter seasons → table **Register** + bottom ghost CTA both open modal with expected prefill.
- Drop-in path: choose **day** pricing → date required → step 2 summary shows date → submit payload includes **`dropInDate`** and notes.
- Keyboard: season buttons toggle; FAQ **summary** receives focus ring; no trap issues inside modal (existing modal behavior).

---

## Cross-references

- **Data:** `data/year2026.json`, **`lib/camps-data.ts`** (`getCampsFromYear2026`, `CampWeek`, `CampWithWeeks`).
- **Modal:** `components/LuxuryYearModal.tsx`, **`lib/camp-date-bounds.ts`**, **`lib/camp-pricing-display.ts`** (session/drop-in labels).
- **API:** `app/api/register-year/route.ts` (payload fields for camp registration).
- **Related pattern doc:** [Visual elevation — conversion strip & quote patterns](./visual-elevation-conversion-strip-facility-quote-pattern.md) (brand sections, `section-quote`, imagery).

---

## Confidence

**High** for wiring and data rules; **medium** for subjective “10/10” UX — validate with real users on mobile (table horizontal scroll, sticky CTA).
