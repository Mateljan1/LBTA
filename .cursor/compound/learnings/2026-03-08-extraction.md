# Learning Extraction — 2026-03-08

From: Code Review Summary (13 agents) + Validation Summary (5 agents).  
Scores: Review 82/100, Validation 90/100. No critical issues; warnings only.

---

## CORRECTIONS (what was wrong → what to do instead)

| Original | Correction |
|----------|------------|
| API route uses inline `request.json()` try/catch when `parseJsonBody` exists | Use shared `parseJsonBody(request)` from lib/validations; return 400 when `!parsed.ok`. |
| Modal/dialog with success timeout (e.g. 3s) never clears timeout on unmount | Clear timeout in useEffect cleanup (e.g. `return () => { if (successTimeoutRef.current) clearTimeout(successTimeoutRef.current); }`). |
| Modal auto-closes via timeout but focus is never restored | When timeout fires, call `previousActiveRef.current?.focus()` before `setIsVisible(false)` (same as manual close). |
| Primary CTA on page hero uses `bg-brand-sunset-cliff` | Per .cursorrules: primary CTAs black/white or `btn-primary`; use Sunset Cliff for hover/accent only. |
| FAQ accordion (e.g. FAQInteractive) with no ARIA or reduced motion | Add `aria-expanded`, `aria-controls`, panel `id`, `aria-labelledby`; use `useReducedMotion()` and static panel when true. |
| Modal close button smaller than 48px | Use `min-w-[48px] min-h-[48px]` for close (WCAG touch target). |
| Form-config or modal copy holds pricing strings separate from /data | Document as second source or derive from same /data as schedules to avoid drift. |
| LuxuryYearModal shows only `result.message` on error | Also show `result.error` when present so server validation message is visible. |
| Dead export (e.g. SEOSchemas.OrganizationSchema) never imported | Remove or use; avoid dead code. |

---

## PATTERNS (name — when to use — example)

| Pattern | When to use | Example |
|---------|--------------|---------|
| parseJsonBody for all JSON routes | Any API route that accepts JSON body | `const parsed = await parseJsonBody(request); if (!parsed.ok) return parsed.response;` then `validateRequest(schema, parsed.data)`. |
| Clear timeout/interval in modal cleanup | Modal that uses setTimeout/setInterval (e.g. success message then close) | Store id in ref; in useEffect cleanup run `clearTimeout(ref.current)`. |
| Restore focus on both manual and auto-close | Dialog that can close by button or by timeout | In close(): restore focus; in timeout callback: restore focus then setVisible(false). |
| Single source for trust stats | Any component showing players trained, years, rating, review count | Import `site-stats.json` trustStats; no hardcoded numbers in Header, ExitIntentPopup, success-stories, schema. |
| Primary CTA black/white | Hero or primary section CTA | Use `.btn-primary` or `bg-black text-white`; Sunset Cliff only for secondary/hover. |

---

## STANDARDS (rule — enforcement level)

| Rule | Level |
|------|--------|
| All JSON-consuming API routes use `parseJsonBody` then `validateRequest` (no inline request.json() try/catch) | Should |
| Modals with delayed close (setTimeout) clear the timeout on unmount and restore focus when auto-close runs | Must |
| Primary CTAs (Book Trial, main page hero) use black/white per .cursorrules; Sunset Cliff for accent/hover only | Should |
| New FAQ/accordion components have aria-controls, id, aria-expanded, and useReducedMotion() | Should |
| Close buttons on modals/dialogs at least 48×48px | Must |
| Display error from API when form shows result (e.g. result.error alongside result.message) | Should |
| No dead exports; remove or use (e.g. duplicate OrganizationSchema) | Should |

---

## Quality bars (add/update)

- **apiParseJsonBody:** All POST routes that accept JSON use `parseJsonBody(request)`; return 400 when `!parsed.ok`. (should)
- **modalTimeoutCleanup:** Any modal using setTimeout/setInterval clears it in useEffect cleanup. (must)
- **modalFocusOnAutoClose:** When a modal closes via timeout, restore focus before hiding. (must)
- **primaryCtaBlackWhite:** Primary CTAs follow .cursorrules: black/white or btn-primary; Sunset Cliff only for accent. (should)
- **faqAriaReducedMotion:** FAQ/accordion has aria-controls, id, aria-expanded; useReducedMotion() with static fallback. (should)
- **touchTargetClose:** Close buttons on modals/dialogs min 48×48px. (must)
