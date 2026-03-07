# LBTA Compound Engineering — Learnings

**Session**: LBTA Full Compound Execution (Waves 1–4, Review, Validate)  
**Date**: March 2026

Use this document when doing future compound work, plan verification, or 10/10 audits on the LBTA site.

---

## CORRECTIONS (what was wrong → what to do instead)

| Original | Correction |
|----------|------------|
| Homepage inline form with placeholder-only labels | Add visible or `sr-only` `<label>` with `htmlFor` and matching input `id`, or `aria-label` on each input. Add live region (`role="alert"`) for submit errors. |
| “Scroll to content” button without min size | Use `min-h-[48px] min-w-[48px]` (and padding) so touch target is ≥ 48×48px (WCAG 2.1). |
| VYLO layout blocking Google Fonts (Inter) | Remove external `<link>` for Inter. Use `next/font` (e.g. DM Sans) or design-system vars (Cormorant/DM Sans); .cursorrules forbid Inter. |
| Two `priority` images on one page (e.g. coaches) | Use `priority` only on the hero image; remove from secondary images to avoid competing LCP. |
| Hero `<Image fill priority>` without `sizes` | Always set `sizes` (e.g. `sizes="100vw"`) on fill/priority images for predictable LCP. |
| Junior-trial hero as JPG | Prefer WebP and update `src` for LCP/bandwidth per .cursorrules. |
| Hardcoded hex in modals | Use Brand Kit tokens only: `bg-lbta-black`, `bg-brand-sandstone`, `text-lbta-slate`, `border-lbta-stone`, `brand-tide-pool`, etc. |
| League pricing duplicated in usta-adult-league and utr-match-play | Single source: `data/leagues-2026.json`; both pages import from it. |
| Programs adult as redirect to /schedules | Implement full adult pathway page (progression, leagues, schedule/book CTAs); no redirect. |

---

## PATTERNS (name — when to use — example)

| Pattern | When to use | Example |
|--------|-------------|---------|
| **Server shell + client islands** | Pages with mostly static content and few interactive bits | Homepage: server `page.tsx`; `HomeHero`, `HomeCTAForm` as client components. |
| **Footer as server component** | Footer is static except one form | Footer.tsx no `'use client'`; `NewsletterForm` is client and handles state + submit. |
| **Focus trap in mobile menu** | Any overlay/drawer menu | On open: focus first focusable; Tab/Shift+Tab wrap within panel; on close: return focus to trigger. |
| **Programs dropdown keyboard nav** | Menu with multiple items | Arrow Down/Up, Home, End; focus first menuitem when panel opens; `role="menu"` / `role="menuitem"`. |
| **JSON-LD for program/event pages** | League or event-specific pages | `LeagueEventSchema` in schema.tsx; pass name, description, startDate, endDate, location. |
| **Data file per domain** | Schedules vs leagues vs pricing | `winter2026`/`fall2025` for programs; `leagues-2026.json` for USTA/UTR; no duplicate content. |
| **StickyCTA on key pages** | Conversion pages (e.g. homepage) | `<StickyCTA text="Book Trial" href="/book" showAfterScroll={600} />` before closing tag. |

---

## STANDARDS (rule — enforcement level)

| Rule | Level |
|------|--------|
| Zero hardcoded hex in active .tsx (excl. PERS_ legacy); use Brand Kit tokens only | Required |
| Newsletter status/error messages: `aria-live="polite"`, `role="status"` / `role="alert"` | Required |
| All interactive elements: visible focus (2px ring), keyboard reachable | Required |
| Touch targets ≥ 48×48px on mobile | Required |
| No render-blocking external fonts; use next/font or CSS vars | Required |
| `priority` only on one hero image per page | Required |
| Fill/priority images must have `sizes` | Required |
| .cursorrules Part 13 (file structure) must match code (e.g. adult pathway, no JTT route) | Recommended |
| Homepage form: proper labels + live region for errors | Required for WCAG 2.1 AAA |

---

## REVIEW ARTIFACTS TO REUSE

- **Accessibility**: HomeCTAForm labels + live error region; HomeHero 48px scroll button; NewsletterForm `aria-busy` when loading; contrast check on footer status text.
- **Architecture**: Document that `/programs/adult` is a full pathway (not redirect); clarify `/schedule` vs `/schedules` and their data sources.
- **Performance**: One `priority` per page; add `sizes` where missing; VYLO layout must not load Inter.
- **Regression**: After JTT removal, any external links to `/jtt` should point to `/programs/leagues` or `/schedules` where appropriate.

---

## SUCCESS CRITERIA (plan checklist)

- [ ] Zero hex in active app/ and components/ (excl. PERS_)
- [ ] Homepage server component, Brand Kit, StickyCTA
- [ ] Newsletter API → ActiveCampaign
- [ ] JTT removed; camps/links → /schedules
- [ ] Adult pathway page (no redirect)
- [ ] League data in leagues-2026.json; JSON-LD on league pages
- [ ] Focus trap + Programs arrow keys + aria-live on newsletter
- [ ] Build passes; no lint errors
