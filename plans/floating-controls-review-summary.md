# Compound Review Summary — Floating Controls (Chat + Back-to-Top)

**Scope:** `components/ui/BackToTop.tsx`, `components/ChatWidget.tsx`, `lib/floating-controls.ts`, `docs/floating-controls-layout.md`

**Date:** 2026-03-15

---

## Overall Score: 78/100

| Category        | Score | Status   |
|----------------|-------|----------|
| Security       | 95    | ✅ PASS  |
| Performance    | 82    | ⚠️ One recommendation |
| Simplicity     | 72    | ⚠️ Unused lib, dead styles |
| Pattern        | 75    | ⚠️ Touch target, constants |
| Architecture   | 75    | ⚠️ Constants not wired |
| TypeScript/A11y| 70    | ⚠️ Dialog semantics, focus, DOM mutation |

---

## Critical / High (Must Fix)

| # | Agent | Location | Issue | Recommendation |
|---|-------|----------|--------|----------------|
| 1 | Pattern Recognizer | ChatWidget.tsx (header close button) | Close button is 32×32px; LBTA and WCAG require **min 48×48px** touch target. | Increase to min 48×48px and add `focus-visible:ring-2` for focus indicator. |

---

## Warnings (Should Fix)

| # | Agent | Location | Issue | Recommendation |
|---|-------|----------|--------|----------------|
| 1 | Simplicity, Architecture, Pattern | lib/floating-controls.ts | Constants are never imported; 24, 100, 60 are hardcoded in BackToTop and ChatWidget. | Either **use** constants in both components (single source of truth) or **remove** the file. |
| 2 | TypeScript Reviewer | ChatWidget.tsx (chat panel) | Panel has no `role="dialog"`, `aria-modal="true"`, or label; no focus trap; focus not returned to trigger on close. | Add dialog semantics, focus trap when open, return focus to button on close. |
| 3 | TypeScript Reviewer | ChatWidget.tsx | Direct DOM mutation: `onMouseEnter`/`onMouseLeave` set `e.currentTarget.style.transform`; close button sets opacity. | Use Tailwind (e.g. `hover:scale-110`) or React state instead of direct style mutation. |
| 4 | Simplicity, TypeScript | BackToTop.tsx | When rendered, `show` is always true (component returns null when !show). Inline `opacity`, `transform`, `pointerEvents` are redundant. | Remove the three redundant style properties; keep only `bottom`. |
| 5 | Performance Oracle | BackToTop.tsx | Scroll handler calls `setShow()` on every scroll event → many re-renders. | Throttle (~100ms) or only call `setShow` when the boolean value changes (e.g. ref). |

---

## Suggestions (Nice to Have)

| # | Agent | Location | Issue | Recommendation |
|---|-------|----------|--------|----------------|
| 1 | Simplicity | ChatWidget.tsx (hover label span) | `style={{ zIndex: 50 }}` redundant (parent already has zIndex 50). | Remove from span. |
| 2 | TypeScript | BackToTop.tsx | No `title` attribute for hover tooltip. | Add `title="Back to top"`. |
| 3 | TypeScript | ChatWidget.tsx (badge) | Decorative green dot has no `aria-hidden`. | Add `aria-hidden="true"`. |
| 4 | Pattern | ChatWidget.tsx | Input uses `onKeyPress`; React prefers `onKeyDown` for Enter. | Use `onKeyDown` for Enter-to-submit. |
| 5 | Pattern | ChatWidget send button | Uses `focus-visible:ring-[var(--sunset-cliff,...)]` instead of Tailwind `focus-visible:ring-brand-sunset-cliff`. | Use `focus-visible:ring-brand-sunset-cliff`. |

---

## Decision

- [ ] **Ready to merge** — No (one high: touch target; several medium: constants, a11y, DOM mutation).
- [x] **Needs fixes** — Address high and medium items above, then re-run review or validate.
- [ ] **Needs discussion** — Optional: whether to wire `lib/floating-controls.ts` now or in a follow-up.

---

## Agent Verdicts (Summary)

- **Security Sentinel:** PASS — No auth/injection/secrets; chat content escaped by React.
- **Performance Oracle:** Acceptable — Throttle BackToTop scroll handler recommended.
- **Code Simplicity:** Use or remove `lib/floating-controls.ts`; remove dead BackToTop styles; remove redundant zIndex on hover label.
- **Pattern Recognizer:** Use constants; fix close button 48px + focus ring; optional onKeyDown and ring class.
- **Architecture Strategist:** Wire components to `lib/floating-controls.ts` for single source of truth.
- **Kieran TypeScript:** Add dialog role/focus trap/return focus; replace direct DOM style with CSS/state; BackToTop redundant styles; badge aria-hidden.
