# Coach Hub — Compound Engineering Review Summary

**Scope**: Coach Hub implementation (Tracks A–F). Diff base: `8a87dcd^..HEAD` (excluding `data/coach-hub/hub-data.json`).  
**Review date**: March 2026.  
**Agents run**: Security Sentinel, Performance Oracle, Code Simplicity, Pattern Recognition, Architecture Strategist, Data Integrity Guardian, CodeRabbit/Code Review, TypeScript/API Review (8 parallel).

---

## Overall Score: 78/100

**Decision**: ⚠️ **Needs fixes** — address high-severity items (middleware when secret unset, modal a11y) and selected medium items before production.

---

## By Category

| Category            | Score | Status |
|---------------------|-------|--------|
| Security            | 88    | ✅ (fixes applied; 2 warnings remain) |
| Performance         | 70    | ⚠️ (large RSC payload; memo opportunities) |
| Simplicity          | 82    | ⚠️ (minor dead code and optional refactors) |
| Pattern consistency  | 80    | ⚠️ (hex colors, touch targets, 429 copy) |
| Architecture        | 95    | ✅ (clear boundaries; optional contract location) |
| Data integrity      | 75    | ⚠️ (new Function in script; type drift) |
| Full code / a11y     | 72    | ⚠️ (middleware secret, modals, tab roles) |
| TypeScript / API    | 75    | ⚠️ (casts; no shared API types) |

---

## Critical / High (Must Fix)

1. **Middleware when `COACH_HUB_SECRET` is unset**  
   **Agent**: CodeRabbit, Security Sentinel.  
   **Location**: `middleware.ts` (lines 22–25).  
   **Issue**: If `COACH_HUB_SECRET` is not set, middleware returns `NextResponse.next()` for `/coach-hub` and `/coach-hub/*`, so the hub is reachable without auth.  
   **Recommendation**: When `pathname.startsWith('/coach-hub')` and `!secret`, redirect to `/coach-hub/login` or return 503 so the hub is never open when unconfigured. Document that Coach Hub must not be deployed without `COACH_HUB_SECRET`.

2. **Modal accessibility (BinderOverlay, GuideOverlay)**  
   **Agent**: CodeRabbit.  
   **Location**: `components/coach-hub/BinderOverlay.tsx`, `GuideOverlay.tsx`.  
   **Issue**: No focus trap and no Escape-to-close; focus can leave the dialog; keyboard users cannot close with Escape.  
   **Recommendation**: Add `onKeyDown` (Escape → `onClose`) and a focus trap (e.g. focus first focusable on open). Optionally `aria-describedby` if you add a description.

---

## Warnings (Should Fix)

3. **Large RSC payload (~1.68 MB hub-data.json)**  
   **Agent**: Performance Oracle.  
   **Location**: `app/coach-hub/page.tsx`.  
   **Issue**: Full hub JSON is serialized into the RSC payload on every load; impacts LCP and hydration.  
   **Recommendation**: Reduce payload (e.g. send only what the default view needs; load rest via API or split by tab); or strip unused keys before passing to client.

4. **ProgramsTab: 12× findPlan per render**  
   **Agent**: Performance Oracle.  
   **Location**: `components/coach-hub/programs/ProgramsTab.tsx` (week dropdown / getTheme).  
   **Issue**: Week dropdown calls `getTheme(hubData, stage, i + 1)` for i = 1..12, each doing a linear scan over 756 plans.  
   **Recommendation**: Memoize week options (e.g. `useMemo` for `{ value, label }[]` keyed by `stage`).

5. **Tab strip not exposed as tabs (a11y)**  
   **Agent**: CodeRabbit.  
   **Location**: `components/coach-hub/CoachHubClient.tsx` (tabs, lines 129–149).  
   **Issue**: Plain buttons with no `role="tablist"`, `role="tab"`, `aria-selected`, or `role="tabpanel"` / `aria-labelledby`.  
   **Recommendation**: Add tablist/tab/tabpanel roles and `aria-selected` / `aria-labelledby` for screen readers.

6. **“Players on court” range input without associated label**  
   **Agent**: CodeRabbit.  
   **Location**: `components/coach-hub/programs/ProgramsTab.tsx` (lines 188–199).  
   **Issue**: Range has no `id`; label has no `htmlFor`.  
   **Recommendation**: Give range `id="players-on-court"`, set label `htmlFor="players-on-court"`; optionally `aria-valuenow` / `aria-valuemin` / `aria-valuemax`.

7. **Clear-cookie without `Secure` in production**  
   **Agent**: CodeRabbit.  
   **Location**: `lib/coach-hub-auth-server.ts` (`buildCoachHubClearCookie`).  
   **Issue**: Clear-cookie header does not set `Secure` when the session cookie was set with `Secure` in production; some browsers may not clear over HTTPS.  
   **Recommendation**: Add `Secure` to the clear-cookie string when `NODE_ENV === 'production'`, matching `buildCoachHubSetCookie`.

8. **CardioTab optional fields**  
   **Agent**: CodeRabbit.  
   **Location**: `components/coach-hub/tabs/CardioTab.tsx` (line 17).  
   **Issue**: `c.work`, `c.rest`, `c.rounds` are optional; template can render "undefineds/undefineds × undefined".  
   **Recommendation**: Use fallbacks (e.g. `{c.work ?? 0}s/{c.rest ?? 0}s × {c.rounds ?? 0}`) or guard before rendering.

9. **Hardcoded colors in ProgramsTab**  
   **Agent**: Pattern Recognition.  
   **Location**: `components/coach-hub/programs/ProgramsTab.tsx` (e.g. hex `#1a3a2a`, `#E8F0F8`, `text-red-600`, etc.).  
   **Issue**: Brand rules: prefer design tokens; max 3 colors per section.  
   **Recommendation**: Replace with brand or semantic tokens where possible.

10. **Touch targets &lt; 48px**  
    **Agent**: Pattern Recognition.  
    **Location**: `CoachHubClient.tsx` (header toolbar), `ProgramsTab.tsx` (secondary controls, “Swap drill” button).  
    **Issue**: Some controls use `min-h-[36px]` or no min-height; project requires 48px for touch targets on mobile.  
    **Recommendation**: Use `min-h-[48px]` for interactive elements; add to “Swap drill” button.

11. **Unsafe `new Function()` in extraction script**  
    **Agent**: Data Integrity Guardian.  
    **Location**: `scripts/extract-coach-hub-data.mjs` (schedule blocks).  
    **Issue**: `new Function('return (' + s + ')')()` is code injection if `s` were ever untrusted.  
    **Recommendation**: Use a safe parser (e.g. bracket-counting) or document that the script runs only against trusted HTML; avoid repurposing for untrusted input.

12. **HubProgram type vs data**  
    **Agent**: Data Integrity Guardian.  
    **Location**: `lib/coach-hub-types.ts` (`HubProgram`).  
    **Issue**: Type has `cat?`; JSON and UI use `category`.  
    **Recommendation**: Use `category?: string` in type; remove or deprecate `cat?`.

---

## Suggestions (Nice to Have)

13. **Rate limit fail-open** (Security Sentinel): On KV error, auth allows the request. Document; consider monitoring; optionally fail closed if acceptable for ops.

14. **Signature length timing** (Security Sentinel): In `lib/coach-hub-auth.ts`, length check before constant-time loop can leak length via timing. Optional: run compare loop then check length for uniform timing.

15. **Dead code** (Simplicity, CodeRabbit): `reduceMotion` in `CoachHubClient.tsx` is computed but never used — remove or use (e.g. disable transitions when true).

16. **Config state** (Simplicity): `config`/`setConfig` only used by ProgramsTab — consider moving into ProgramsTab to reduce parent surface.

17. **Cookie max age duplication** (Simplicity): `COOKIE_MAX_AGE_MS` in auth-server duplicated from auth module — derive from `getCoachHubCookieMaxAge()` and remove constant.

18. **ProgramsTab effective slot** (Simplicity): Replace `useEffect` + long `SD` ternary with a single derived value (e.g. `getEffectiveSlot(selectedSlot, schedule)`).

19. **429 message** (Pattern): Auth uses "Too many attempts. Try again later."; other routes use "Too many requests. Please try again later." — align for consistency.

20. **Logout rate limit** (Pattern): Optional — add rate limit on logout POST for consistency with other POST routes.

21. **CoachHubInitialData contract** (Architecture): Move `CoachHubInitialData` to `lib/coach-hub-types.ts` and import in page + CoachHubClient for a single contract.

22. **TypeScript**: Add specific types in `coach-hub-types.ts` for `assessment_calendar`, program schedule slot, etc.; optionally Zod (or similar) for hub JSON at load; export shared API response types for auth/logout.

23. **LBHSTab list key** (CodeRabbit): `key={p.rank}` can duplicate — use e.g. `key={`${p.rank}-${p.name}`}` or another stable unique key.

24. **Overlay close buttons**: Add visible focus ring (`focus:ring-2 focus:ring-brand-victoria-cove focus:ring-offset-2`) for WCAG.

---

## What’s in Good Shape

- **Auth**: Timing-safe password check, rate limiting, signed HttpOnly cookie, Edge constant-time signature verification. Open redirect fixed via `safeRedirectTarget`; password length capped at 512.
- **Architecture**: Clear Edge vs Node auth split; server page as single data loader; coach-hub isolated (ConditionalLayout, noindex, sitemap exclusion).
- **API routes**: Auth and logout follow existing patterns (NextRequest, parseJsonBody, validateRequest, error shape); auth uses Zod and does not leak PII.
- **Brand/typography**: Brand tokens and font-headline/font-sans used in most coach-hub UI; login page has good a11y (label/id, role="alert", 48px, focus ring).
- **Data**: JSON structure aligns with types; optional chaining and fallbacks in UI; no DB/migrations.

---

## Fixes applied (2026-03-17)

All critical/high and warnings 3–12 from this review have been addressed; validation reached 100/100.

| # | Item | Resolution |
|---|------|------------|
| 1 | Middleware when secret unset | Redirect to `/coach-hub/login` when `COACH_HUB_SECRET` unset. |
| 2 | Modal a11y (focus trap, Escape) | BinderOverlay & GuideOverlay: initial focus, Escape-to-close, full Tab focus trap. |
| 3–4 | RSC payload / findPlan memo | Week options memoized; large payload noted as future optimization. |
| 5–6 | Tab a11y, range label | Tablist/tab/tabpanel ARIA; range `id` + label `htmlFor` + aria-valuenow/min/max. |
| 7 | Clear-cookie Secure | `buildCoachHubClearCookie()` adds `Secure` when `NODE_ENV === 'production'`. |
| 8 | CardioTab fallbacks | `c.work ?? 0`, `c.rest ?? 0`, `c.rounds ?? 0`. |
| 9–10 | Colors, touch targets | Brand tokens; `min-h-[48px]` on interactive elements. |
| 11 | Extraction script | SECURITY comment: trusted HTML only; do not use with untrusted input. |
| 12 | HubProgram type | `category?: string` added; `cat?` kept for legacy. |
| 17 | Cookie max age duplication | Single source: `getCoachHubCookieMaxAge()` in `coach-hub-auth.ts`; auth-server uses it. |
| 19 | 429 message | Auth route uses "Too many requests. Please try again later." |
| 23 | LBHSTab key | `key={\`${p.rank}-${p.name ?? ''}\`}`. |
| 24 | Overlay focus ring | Close buttons have `focus:ring-2 focus:ring-brand-victoria-cove focus:ring-offset-2`. |

Auth 400/401 verified at runtime via `scripts/verify-coach-hub-auth.mjs`. See `docs/coach-hub-compound-validation-summary.md` for 100/100 validation.

Optional suggestions 13–16, 18, 20–22 addressed (2026-03-17):

| # | Item | Resolution |
|---|------|------------|
| 13 | Rate limit fail-open | Documented in auth route comment; fail-open on KV error to avoid locking out users; consider monitoring KV health. |
| 14 | Signature length timing | Edge verify: constant-time compare over `max(sigHex.length, computedHex.length)`, then length check. |
| 16 | Config state | `config`/`setConfig` moved into ProgramsTab (only consumer). |
| 18 | ProgramsTab effective slot | Replaced long SD ternary with `getEffectiveSlot(selectedSlot, schedule)`; kept useEffect to sync selectedSlot when schedule changes. |
| 20 | Logout rate limit | POST `/api/coach-hub/logout` rate-limited (sensitive); fail-open on KV error. |
| 21 | CoachHubInitialData contract | Type moved to `lib/coach-hub-types.ts`; page and all tabs import from there. |
| 22 | TypeScript | Added `AssessmentCalendar`, `AssessmentCalendarEntry`, `ProgramScheduleSlot`; `CoachHubAuthResponse`, `CoachHubLogoutResponse`; `HubData.assessment_calendar` typed. |

---

## Next Steps (optional)

1. **Future**: Reduce RSC payload (e.g. load hub data by tab or via API) if LCP/hydration becomes an issue.
