# LBTA Accessibility Audit — March 8, 2026

**Scope:** ExitIntentPopup, FAQSection, keyboard navigation, contrast, touch targets.  
**Standard:** WCAG 2.1 AAA where noted (7:1 contrast, 48px touch targets, focus, reduced motion).

---

## Status: **WARNINGS**

Overall the codebase meets most a11y requirements. A few components need small fixes; one alternate FAQ page lacks ARIA and reduced motion.

---

## Findings Table

| # | Severity | Component / Area | Finding | Recommendation |
|---|----------|------------------|--------|----------------|
| 1 | **Pass** | ExitIntentPopup | Focus trap | Implemented: Tab cycles within dialog, first focusable focused on open. |
| 2 | **Pass** | ExitIntentPopup | Escape key | `Escape` closes dialog and restores focus. |
| 3 | **Pass** | ExitIntentPopup | Close button size | `min-w-[48px] min-h-[48px]` — meets 48×48px. |
| 4 | **Pass** | ExitIntentPopup | Focus restore | `previousActiveRef.current?.focus()` on close; cleanup also restores. |
| 5 | **Pass** | ExitIntentPopup | Dialog semantics | `role="dialog"`, `aria-modal="true"`, `aria-labelledby="exit-popup-title"`. |
| 6 | **Pass** | FAQSection | aria-controls / id | `aria-controls={panelId}`, `id={buttonId}`, panel `id={panelId}`; correct relationship. |
| 7 | **Pass** | FAQSection | Reduced motion | `useReducedMotion()`; when true, non-animated `div` with same `id`/`role="region"`/`aria-labelledby`. |
| 8 | **Warn** | FAQSection | FAQ button touch target | Button uses `py-5` (40px vertical). Relied on globals.css `min-height: 48px` for buttons on mobile; consider explicit `min-h-[48px]` for consistency. |
| 9 | **Issue** | app/faq/FAQInteractive.tsx | No ARIA / no reduced motion | Buttons lack `aria-expanded`, `aria-controls`, `id`; panels lack `id`; no `useReducedMotion()`; Framer/AnimatedSection not gated. | Add `aria-expanded`, `aria-controls`, panel `id`, `aria-labelledby`; gate animations with `useReducedMotion()`. |
| 10 | **Warn** | LuxuryRegistrationModal | Close button size | Close uses `w-10 h-10` (40×40px). | Use `min-w-[48px] min-h-[48px]` (or equivalent) for close button. |
| 11 | **Pass** | Keyboard nav | Header / modals | Header nav has `aria-expanded`, `aria-haspopup`, `aria-controls`, `role="menu"`/`menuitem`; modals have focus trap + Escape. |
| 12 | **Pass** | Focus visibility | Global | Buttons/links use `focus:outline-none focus-visible:ring-2` (or `focus:ring-2`) with brand/victoria-cove or white/black rings. |
| 13 | **Warn** | Contrast | Footer / dark sections | `text-white/25`, `text-white/30`, `text-white/40` on deep-water may fall below 7:1 for AAA. | Verify with WebAIM or DevTools; consider raising to white/50+ for body text. |
| 14 | **Pass** | Contrast | Light sections | `text-brand-pacific-dusk` on morning-light/sandstone meets contrast; `/80`, `/70` used for secondary text (review for 4.5:1 AA). |
| 15 | **Pass** | Touch targets | globals.css | `@media (max-width: 768px)` enforces `min-height: 48px` and `min-width: 48px` for buttons and 48px for inputs. |
| 16 | **Pass** | Touch targets | Header / Footer / CTAs | Header logo, nav items, phone, menu; Footer links; Hero CTA; ExitIntentPopup close — all use 48px or globals override. |
| 17 | **Pass** | Reduced motion | globals.css | `@media (prefers-reduced-motion: reduce)` sets animations/transitions to 0.01ms, scroll-behavior: auto. |
| 18 | **Warn** | Reduced motion | JS-driven motion | Framer Motion (e.g. FAQSection, LuxuryRegistrationModal) is gated in FAQSection only; other Framer usage may still animate. | Prefer `useReducedMotion()` and conditional animation props site-wide. |

---

## Summary

- **ExitIntentPopup:** Compliant for focus trap, Escape, 48px close, dialog semantics, and focus restore.
- **FAQSection:** Compliant for aria-controls, id, and reduced motion; optional hardening for button min-height.
- **FAQInteractive (faq page):** Needs ARIA (aria-expanded, aria-controls, panel id) and reduced-motion handling.
- **Keyboard:** Modals and header support keyboard use; focus visible via ring utilities.
- **Contrast:** Light UI is in good shape; dark footer/secondary text should be verified for 7:1.
- **Touch targets:** Global 48px rule plus component-level 48px on key controls; LuxuryRegistrationModal close is the only clear undersized control (40px).

---

## Score: **88 / 100**

| Category | Weight | Score (0–100) | Notes |
|----------|--------|---------------|--------|
| ExitIntentPopup (trap, Escape, 48px) | 20 | 100 | All criteria met. |
| FAQSection (aria-controls, id, reduced motion) | 20 | 95 | Minor: explicit 48px on trigger. |
| FAQInteractive / other FAQ UIs | 10 | 40 | Missing ARIA and reduced motion. |
| Keyboard nav & focus | 20 | 95 | Solid; focus visible. |
| Contrast | 15 | 85 | Light OK; dark/secondary needs check. |
| Touch targets | 15 | 90 | One modal close &lt; 48px; globals help. |

**Weighted:** (20×100 + 20×95 + 10×40 + 20×95 + 15×85 + 15×90) / 100 = **88**.

---

## Recommended Actions (priority order)

1. **FAQInteractive.tsx:** Add `aria-expanded`, `aria-controls`, panel `id`, and `useReducedMotion()` with non-animated fallback for accordion content.
2. **LuxuryRegistrationModal:** Change close button from `w-10 h-10` to `min-w-[48px] min-h-[48px]`.
3. **Contrast:** Measure Footer and dark-section text (e.g. white/25, white/30) and increase opacity if below 7:1.
4. **FAQSection:** Add `min-h-[48px]` to the FAQ trigger button for consistency.
5. **Framer Motion:** Where possible, gate animation with `useReducedMotion()` and reduce or disable motion when true.
