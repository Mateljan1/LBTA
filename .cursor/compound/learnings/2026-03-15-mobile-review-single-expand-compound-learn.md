# Compound Learn — Mobile Review Fixes + Single-Expand (2026-03-15)

**Scope:** Optional warnings from compound-review-summary-mobile-2026-03-15; ProgramCard multiple fixed bars; ScheduleCalendarView; deploy.

---

## CORRECTIONS (what was wrong → what to do instead)

| Original | Correction |
|----------|------------|
| Contact 5s success timeout with no cleanup | Store timeout id in a ref; in useEffect cleanup run `clearTimeout(ref.current)` so setState never runs after unmount. |
| Console.log in submit path (LuxuryYearModal) | Guard with `if (process.env.NODE_ENV === 'development')` or remove; never log in production submit path. |
| getWebsiteSignupsListId() returning 0 when env is "0" | After parsing: `Number.isNaN(n) \|\| n <= 0 ? null : n` so only positive integers are returned as list ID. |
| preferredDays array unbounded (DoS surface) | In Zod: `z.array(z.string().max(50)).max(31).optional().default([])` in all schemas that use preferredDays. |
| Focus trap refs stale when step/success changes (LuxuryRegistrationModal) | Add `step` and `isSuccess` to effect deps; re-query focusables from modal ref on each Tab key; when isSuccess, don’t focus first element so success CTA can receive focus. |
| Success focus and focus trap race | Run success focus in separate effect; use `queueMicrotask(() => successPrimaryRef.current?.focus())` so it runs after trap updates. |
| locationsToShow new array every render (ScheduleCalendarView) | Wrap in `useMemo(() => ..., [locationFilter, scheduleByLocationByDay])` so useMemo deps are stable. |
| Multiple ProgramCards expanded → multiple fixed bars | Parent owns `expandedProgramId: string \| null`; pass `isExpanded={expandedProgramId === program.id}` and `onToggle={() => setExpandedProgramId(prev => prev === program.id ? null : program.id)}`; only one sticky bar in DOM. |
| Anchor section controls under fixed header | Use `scroll-mt-32` (or match nav height) on section so when navigating to #hash the controls sit below the header. |

---

## PATTERNS (name — when to use — example)

| Pattern | When to use | Example |
|--------|-------------|---------|
| **Single-expand cards in list** | Page shows multiple expandable cards (e.g. ProgramCard) with a sticky/fixed bar when expanded | Parent state: `expandedProgramId: string \| null`. Each card: `isExpanded={expandedProgramId === program.id}`, `onToggle={() => setExpandedProgramId(prev => prev === program.id ? null : program.id)}`. Only one card expanded → one sticky bar. |
| **Controlled expand optional** | Reusable card/accordion used both standalone and in a list | Component accepts optional `isExpanded` + `onToggle`; when both provided use them (controlled); else use internal `useState` (uncontrolled). |
| **Success timeout ref cleanup** | Any component (page or modal) that runs setTimeout then setState (e.g. clear form after 5s) | Store timeout id in `useRef`; in useEffect cleanup: `return () => { if (ref.current) clearTimeout(ref.current); }`. Prevents setState after unmount. |

---

## STANDARDS (already in quality-bars; reinforced)

- Close buttons and error-dismiss buttons: `min-w-[48px] min-h-[48px]` (closeButton48px, interactiveButton48pxFocusRing).
- Plan/option buttons in modals: explicit `min-h-[48px]`.
- Mobile sticky CTA: Register button `min-w-[140px]` when next to another link so 320px doesn’t cramp.
- Expanded content above fixed bar: `pb-20 md:pb-7` so last line isn’t covered.
- Schedule list keys: stable and unique (e.g. `${slot.day}-${slot.time}-${index}`), not `key={index}` only.
- Hero CTA on dark: solid background; apply-scholarship hero “Apply” link: `aria-label` for screen readers.
- preferredDays in Zod: `.max(31)` on array and `.max(50)` on each string.

---

## ARTIFACTS

- **Review summary:** `plans/compound-review-summary-mobile-2026-03-15.md`
- **Validation summary:** `plans/compound-validate-summary-2026-03-15-single-expand.md`
- **Code:** ProgramCard (controlled expand), ProgramsSection (List | Cards, single-expand), contact ref cleanup, LuxuryYearModal guard, TrialBookingModal/LuxuryRegistrationModal 48px and focus, ProgramCard min-w/padding/keys, activecampaign n>0, apply-scholarship aria-label, validations preferredDays, ScheduleCalendarView useMemo + syntax fix.
