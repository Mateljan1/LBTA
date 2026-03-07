# Accessibility Auditor Review
**WCAG 2.1 AAA — LBTA Website**

**Status**: ⚠️ WARNINGS

---

## Findings

| Severity | Location | Issue | Recommendation |
|----------|----------|--------|----------------|
| **Medium** | `HomeCTAForm.tsx` | Form inputs use placeholder-only labels; no associated `<label>` or `aria-label`. Fails WCAG 1.3.1 (Info and Relationships) and 3.3.2 (Labels or Instructions). | Add visible or `sr-only` `<label>` with `htmlFor` matching each input `id`, or add `aria-label` to each input. Ensure labels are descriptive. |
| **Medium** | `HomeCTAForm.tsx` | No status/error announcement on submit failure (e.g. network error). Screen reader users get no feedback. | Add a live region (e.g. `role="alert"` or `aria-live="assertive"`) that displays error text on catch, and optionally `aria-busy="true"` on the form/button while submitting. |
| **Low** | `HomeHero.tsx` | “Scroll to content” button has no explicit minimum size; clickable area is effectively icon + padding and may be under 48px (project standard). | Add `min-h-[48px] min-w-[48px]` and ensure padding (e.g. `p-3`) so the touch target meets 48×48px. |
| **Low** | `Header.tsx` (desktop) | Programs trigger and nav links use `py-2` / `px-3`; computed height can be under 48px. WCAG 2.5.5 (Target Size) AAA allows 44px minimum; project standard is 48px. | Consider increasing tap/click area (e.g. `py-3` or `min-h-[48px]`) for desktop nav to align with project standard. |
| **Low** | `NewsletterForm.tsx` | Submit button does not expose loading state to assistive tech. | Add `aria-busy="true"` when `status === 'loading'` and `aria-busy="false"` otherwise. |
| **Low** | `NewsletterForm.tsx` | Status messages (success: `text-brand-tide-pool`, error: `text-red-400`) sit on dark footer background; contrast should be verified for 7:1 AAA. | Measure contrast of `#3A8B6E` and `#EF4444` (or actual red-400) on footer background; if below 7:1, use a lighter tint or ensure background is light enough. |
| **Info** | `StickyCTA.tsx` | Ping animation on urgency dot. | Confirmed `globals.css` applies `prefers-reduced-motion: reduce` to animations site-wide, so this is already respected. |

---

## Summary by Component

### Header.tsx — ✅ PASS (with one low warning)
- **Focus trap (mobile)**: Tab / Shift+Tab constrained to menu panel; first focusable focused on open; focus returned to menu button on close.
- **Programs dropdown**: Arrow Down/Up, Home, End implemented; first menuitem focused when panel opens; Escape closes; `role="menu"`, `role="menuitem"`, `aria-expanded`, `aria-controls"programs-panel"` present.
- **Focus management**: Global `:focus-visible` 2px outline; mobile controls use `min-w-[48px] min-h-[48px]`.
- **Warning**: Desktop nav links/Programs trigger may be below 48px height (see table).

### NewsletterForm.tsx — ✅ PASS (with low recommendations)
- **Aria-live**: Form has `aria-live="polite"` and `aria-atomic="true"`; success has `role="status"`, error has `role="alert"`.
- **Labels**: Email has `<label htmlFor="footer-newsletter-email" className="sr-only">`.
- **Recommendations**: Add `aria-busy` on submit button when loading; verify 7:1 contrast for status text on footer (see table).

### StickyCTA.tsx — ✅ PASS
- Touch targets: main CTA `min-h-[48px]`; call link `w-14 h-14` (56px).
- `aria-label="Call us"` on phone link; focus styles from global `:focus-visible`.
- Reduced motion handled globally.

### HomeHero.tsx — ⚠️ One fix needed
- Video has `aria-label`; scroll button has `aria-label="Scroll to content"`; primary CTA has `min-h-[48px]`.
- **Fix**: Ensure scroll-to-content button has ≥48×48px touch target (see table).

### HomeCTAForm.tsx — ❌ ISSUES
- **Missing labels**: Inputs use placeholders only; no `<label>` or `aria-label`.
- **No error/status announcement**: Failed submit (e.g. network) has no live region or `role="alert"`.
- Button has `min-h-[48px]`; inputs use `input-dark` (focus styles in globals).

### programs/adult page — ✅ PASS
- Semantic structure (`section`, `h1`, `h2`, `h3`, `Link`); no JSON-LD required on this page.
- Links and hierarchy are appropriate.

### League pages (usta-adult-league, utr-match-play, leagues) + JSON-LD — ✅ PASS
- `LeagueEventSchema` outputs valid Event JSON-LD with `name`, `description`, `startDate`, `endDate`, `organizer`, optional `location`.
- Semantic sections and headings; UTR table uses `scope="col"` on `<th>`.
- CTAs use shared button classes with global focus styles.

### Global / layout
- **Focus**: `*:focus-visible` and `button/a/input/select/textarea:focus-visible` use 2px outline; dark context uses white outline.
- **Reduced motion**: `@media (prefers-reduced-motion: reduce)` in `globals.css` shortens animations/transitions and sets `scroll-behavior: auto`.
- **Skip link**: “Skip to main content” present in layout with visible focus styles.

---

## Summary

Header (focus trap, Programs arrow-key nav, focus management) and NewsletterForm (aria-live, status/alert roles) meet the intended behavior. Two fixes are required for full compliance: **HomeCTAForm** must add proper labels and a live error/status region, and **HomeHero**’s scroll button must meet the 48px minimum touch target. Addressing the remaining low-severity items (desktop nav height, NewsletterForm `aria-busy` and contrast) will align the site with WCAG 2.1 AAA and project standards.
