---
title: UTR Match Play division cards — drop-in UX, imagery, contact prefill, modal division match
slug: utr-match-play-division-cards-drop-in-contact-prefill
category: integration
problem_type: ux_data_flow
component: utr-match-play
status: solved
date: 2026-03-28
severity: medium
related_files:
  - app/programs/utr-match-play/UTRMatchPlayDivisions.tsx
  - app/programs/utr-match-play/page.tsx
  - app/contact/page.tsx
  - components/LuxuryYearModal.tsx
  - lib/utr-match-play.ts
  - lib/utr-match-play.test.ts
  - data/leagues-2026.json
related_docs:
  - docs/solutions/ui-bugs/site-wide-image-404s-layout-consistency.md
  - docs/solutions/implementation-patterns/utr-match-play-color-ball-cbr-parent-guidance.md
tags:
  - utr-match-play
  - nextjs
  - contact-form
  - search-params
  - object-position
  - drop-in
  - luxury-year-modal
  - lbta
---

# UTR Match Play division cards — drop-in UX, imagery, contact prefill, modal division match

## Summary

Division cards on `/programs/utr-match-play` needed **drop-in-first** registration UX (price + date + CTA), **readable day badges** on photos, **better photo crops** in fixed-height strips, **contact form prefill** from query parameters, and **full-season modal** pre-selection of the division opened from the card. Data stays in `data/leagues-2026.json`; helpers live in `lib/utr-match-play.ts` with Vitest coverage for date options.

---

## Symptoms

1. **Imagery:** `object-cover` + `object-center` in short card headers cropped **faces** (heads cut off); some venue/day badges had **low contrast** on bright backgrounds.
2. **Conversion:** Season price dominated the card while **weekend drop-in** ($55–$65 reference) was buried; users wanted **pick a date → request** without sounding like instant checkout.
3. **Contact:** Deep-linking from cards needed to **prefill** interest + message; naive one-shot `useRef` blocked **second** navigation with different params.
4. **Full season:** Opening `LuxuryYearModal` from a card still required **re-picking** the same division unless the modal received the division name.

---

## Root cause

| Issue | Cause |
|-------|--------|
| Bad crops | Fixed height + `object-center` centers the crop on the image midline; tennis photos are often wide with subjects upper-weighted. |
| Weak pills | Semi-transparent brand fills + bright sun/court let the **Sunday/Saturday** label wash out. |
| Season-first UI | Original layout prioritized `d.price` (season) and generic Register / Contact. |
| Prefill stuck | Single `utrPrefillAppliedRef` short-circuited after first run; changing query string did not update message. |
| Modal division | Modal reset `selectedOption` on open but had no **initial division** prop from the card. |

---

## Solution (verified)

### 1. Photo crop and badges (cards)

- Replace default center with **top-weighted** `objectPosition` (e.g. `50% 24%`) and optional **`imageObjectPosition`** per division in `data/leagues-2026.json`.
- **Solid** `bg-brand-victoria-cove` / `bg-brand-sunset-cliff` pills, **shadow + ring**, plus a **top-right gradient scrim** so labels stay legible.
- Slightly **taller** image strip (`236px` / `252px` sm) where needed.

### 2. Drop-in-first + date select

- **`getUtrDropInDateOptions(matchDay)`** in `lib/utr-match-play.ts` returns `{ iso, label }[]` from **`getUtrRegularSeasonSaturdays()`** or **`getUtrRegularSeasonSundays()`** (single source with the schedule section).
- Labels use full **weekday + month + day + year** for dropdown clarity.
- Card: primary **$dropIn** + `<select>` + helper copy (“confirm after submit — not instant checkout”) + **Request drop-in** `Link` to `/contact?...`.
- Secondary **Full season** `button` opens modal; **`LuxuryYearModal`** accepts **`utrInitialDivision`** and applies it in the reset `useEffect` when `type === 'utr-circuit'`.

### 3. Contact prefill (keyed)

- `useSearchParams()` inside **`Suspense`** boundary (Next.js requirement).
- Build a stable key: `division|date|ref_price`; on each unique key, set `interestedIn` + `message`. **Clear** the key ref when `utr_drop_in !== '1'` so a later visit can prefill again.
- **`scroll-mt-*`** on `#contact-form` so `scrollIntoView` clears the fixed header.

### 4. Accessibility

- Date `<select>`: **`aria-describedby`** → hint paragraph id.
- **Request drop-in** link: **`aria-label`** including division + human-readable date.

### 5. Tests

- **`lib/utr-match-play.test.ts`**: eight Saturday/Sunday options, ISO format, default match day behavior.

---

## Code anchors (patterns)

**Drop-in href (concept):**

```ts
const p = new URLSearchParams({
  utr_drop_in: '1',
  division: d.name,
  date: selectedIso,
})
if (d.dropIn != null) p.set('ref_price', String(d.dropIn))
// → `/contact?${p.toString()}`
```

**Contact effect (concept):**

```ts
if (searchParams.get('utr_drop_in') !== '1') {
  utrPrefillKeyRef.current = null
  return
}
const key = `${division.trim()}|${dateIso.trim()}|${refPrice.trim()}`
if (utrPrefillKeyRef.current === key) return
utrPrefillKeyRef.current = key
// setFormData({ interestedIn: 'UTR Match Play — Drop-in', message: ... })
```

---

## Prevention / best practices

1. **Never** rely on `object-center` alone for variable aspect hero/card photos; expose **`imageObjectPosition`** in JSON for art-directed crops.
2. **Text on photos:** use **opaque** chip + **shadow** + optional **corner scrim** before shipping.
3. **Query-prefill:** use a **content key** (or hash of params), not a boolean “applied once” flag.
4. **Modal prefill:** pass **`utrInitialDivision`** (or equivalent) whenever the CTA is division-scoped.
5. **Run** `npm run ship:gate` before claiming shipped; extend **`lib/*.test.ts`** when adding data helpers.

---

## Related issues

- None filed as GitHub issues in-repo; commits on `main` circa **2026-03-28** (`fc095ff`, `c7f11f4`, `6d09475`, `c385b5c`).

---

## Acceptance checks (for future changes)

- [ ] Division dropdown dates match **`#schedule`** / JSON season (no hardcoded weekend lists in TSX).
- [ ] `/contact?utr_drop_in=1&division=…&date=YYYY-MM-DD` prefills and scrolls to form.
- [ ] Full season from a card opens modal with **that** division selected.
- [ ] `npm test` includes **`utr-match-play.test.ts`** passing.
