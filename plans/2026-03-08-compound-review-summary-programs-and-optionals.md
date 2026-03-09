# Compound Engineering Review Summary — 2026-03-08 (Programs + Optionals)

**Scope:** Programs page redesign (image-led cards, ProgramOverviewCard, getProgramsOverview image paths), ActiveCampaign webhook Zod validation, ExitIntentPopup brand tokens + site-stats.json, single FAQ source (data/faq.json), and related changes.

**Agents run:** Security Sentinel, Performance Oracle, Code Simplicity, Pattern Recognition, Architecture Strategist, Data Integrity Guardian, Julik Frontend Races (a11y), Kieran TypeScript.

---

## Overall Score: 82/100

| Category           | Score | Status   |
|--------------------|-------|----------|
| Security           | 88    | ⚠️ Warnings |
| Performance        | 88    | ⚠️ Warnings |
| Simplicity         | 95    | ✅ Pass  |
| Pattern            | 85    | ⚠️ Warnings |
| Architecture       | 90    | ⚠️ Notes  |
| Data Integrity     | 75    | ⚠️ Warnings |
| Accessibility      | 70    | ⚠️ Warnings |
| TypeScript         | 82    | ⚠️ Warnings |

---

## Critical Issues (Must Fix)

None. No blocking security or correctness issues; all findings are warnings or optional improvements.

---

## Warnings (Should Fix)

### 1. Accessibility — ExitIntentPopup (High impact)
- **Focus trap:** When modal opens, focus is not moved into the dialog and not confined; Tab can leave the modal.
- **Escape key:** No Escape handler to close the modal; keyboard users must tab to the close button.
- **Success timeout:** `setTimeout(..., 3000)` on success is never cleared; if user closes before 3s, setState-on-unmounted and stray timer.
- **Close button:** Effective size ~36px; should be at least 48×48px touch target.

**Recommendation:** Add focus trap (move focus into dialog on open, cycle Tab within dialog); add Escape key handler; store timeout id and clear it on close/unmount; give close button `min-w-[48px] min-h-[48px]`.

### 2. Reduced motion — ProgramOverviewCard & FAQSection (Medium)
- Framer Motion (`initial`/`whileInView`, AnimatePresence) is not gated by `prefers-reduced-motion`; globals.css only affects CSS. JS-driven motion still runs.
- **Recommendation:** Use `useReducedMotion()` from Framer Motion; when true, render without motion (e.g. static div, or `initial={{ opacity: 1, y: 0 }}` and `transition: { duration: 0 }`).

### 3. Pattern / .cursorrules — Programs CTA & ExitIntentPopup text (Medium)
- **Programs DarkSection:** "View Schedules" uses `bg-brand-sunset-cliff`. .cursorrules: primary CTAs are black/white only; Sunset Cliff for hover/accent only.
- **ExitIntentPopup:** Two spots still use `text-lbta-slate` (success message, subhead). Should use `text-brand-pacific-dusk/80` or similar for consistency.

**Recommendation:** Change programs CTA to black/white; replace remaining `text-lbta-slate` in ExitIntentPopup with brand-pacific-dusk opacity.

### 4. Data integrity — Trust stats not single-sourced (Medium)
- **Header.tsx:** "500+" hardcoded.
- **success-stories/page.tsx:** "500+", "5.0", "25+" years, "47 Google reviews" hardcoded; "25+" conflicts with site-stats.json "15+".
- **app/page.tsx:** aggregateRating "5.0" and "47" hardcoded.
- **SEOSchemas.tsx (ReviewSchema):** ratingValue "5.0" and reviewCount "47" hardcoded.

**Recommendation:** Use `data/site-stats.json` everywhere for playersCount, yearsExperience, rating; add `reviewCount` to site-stats if desired. Decide canonical "years" (15+ vs 25+) and use one value.

### 5. Security — Webhook (Low)
- **contactId:** Zod allows string | number; coerce to positive integer before using in AC URLs to avoid path injection if secret were compromised.
- **400 response:** Returning full `validation.error` exposes schema details; in production return generic "Invalid payload" and log details server-side.
- **Catch block:** Avoid logging `error.response?.data` in production (can leak AC response/PII).

### 6. TypeScript — Webhook & FAQ (Low)
- **activecampaign-webhook:** Replace `any` in callbacks (FieldValue, ContactTag, etc.) and in catch (`error: unknown` + guard).
- **FAQSection / SEOSchemas:** Replace bare `as Array<...>` with shared type + Zod or type guard so faq.json shape is validated.

### 7. FAQ accordion — ARIA (Medium, a11y)
- **FAQSection:** Buttons have `aria-expanded` but no `aria-controls`; panels have no `id`. Add `id`/`aria-controls`/`aria-labelledby` so screen readers associate button and panel.

---

## Suggestions (Nice to Have)

| Item | Location | Suggestion |
|------|----------|------------|
| fromPrice check | ProgramOverviewCard | Type already has fromPrice; simplify to `program.fromPrice != null` or drop check. |
| FAQ schema helper | FAQSection + SEOSchemas | Optional: extract `faqToSchema(items)` to avoid duplicating JSON-LD structure. |
| FAQ sources | Architecture | Document that faq.json = homepage/schema; FAQInteractive = dedicated /faq "honest" set. |
| CTA offset | Programs DarkSection | `focus:ring-offset-brand-deep-water` is good for contrast. |

---

## Decision

- **Ready to merge:** Yes, with no critical issues. Recommended before or soon after merge: address **high-impact a11y** (ExitIntentPopup focus trap, Escape, timeout cleanup, 48px close button) and **reduced motion** (ProgramOverviewCard, FAQSection).
- **Optional follow-up:** Trust stats single-source (Header, success-stories, app/page, SEOSchemas); webhook hardening (contactId integer, generic 400, no AC data in logs); TypeScript (webhook `any`, FAQ type guard); programs CTA to black/white; remaining lbta-slate → brand tokens.

---

## Summary Table by Agent

| Agent | Status | Critical | Warnings |
|-------|--------|----------|----------|
| Security Sentinel | ⚠️ | 0 | 3 (contactId, 400 body, catch log) |
| Performance Oracle | ⚠️ | 0 | 2 (reduced motion on motion components) |
| Simplicity Reviewer | ✅ | 0 | 0 (optional fromPrice/FAQ DRY) |
| Pattern Recognizer | ⚠️ | 0 | 2 (CTA color, lbta-slate) |
| Architecture Strategist | ⚠️ | 0 | 1 (document two FAQ sources) |
| Data Integrity Guardian | ⚠️ | 0 | 5 (trust stats single-source, 15+ vs 25+) |
| Frontend/A11y (Julik) | ⚠️ | 0 | 4 high/medium (focus trap, Escape, timeout, 48px, reduced motion, FAQ aria) |
| TypeScript (Kieran) | ⚠️ | 0 | 4 (webhook any, FAQ cast, fromPrice guard) |
