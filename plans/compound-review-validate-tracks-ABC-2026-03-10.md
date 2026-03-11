# Compound Review + Validate — Tracks A, B, C (March 10, 2026)

**Scope:** All three tracks from `plans/optional-polish-and-homepage-master-plan.md` (schedules polish, homepage overhaul, registration flow & operations). Review and validate to confirm everything is done and as intended.

---

## Build & Lint

| Check | Result |
|-------|--------|
| `npm run build` | Pass (Next.js 16.1.1, 45 routes) |
| `npm run lint` | Pass (no errors) |

---

## Code Review Summary (5 agents)

### Overall: **PASS** with minor warnings (non-blocking)

| Agent | Status | Summary |
|-------|--------|--------|
| **Security Sentinel** | PASS | No auth/injection/secrets issues. One low note: 400 responses return detailed Zod errors (existing pattern); optional to genericize in production. |
| **Performance Oracle** | PASS | Observer/listener cleanup correct; no layout thrash; optional micro-optimization: guard `setActiveSectionId` when value unchanged. |
| **Accessibility (frontend races)** | WARNINGS → FIXED | Footer and HomeCTAForm met. **Fixed:** NewsletterForm description was `text-white/50` on deep-water; changed to `text-white/70` for WCAG 7:1. |
| **Pattern Recognition** | WARNINGS | Track A/C aligned. Footer copy is hardcoded (not from `homepage-copy.json`); acceptable for now, optional to refactor later. |
| **Code Simplicity** | WARNINGS | Track B/C minimal. Track A has two state vars (activeSectionId + reduceMotion) for a11y; acceptable. Optional: thank-you Step 2 uses `text-blue-600`; could use brand token. |

### Critical issues

- **None.**

### Warnings (addressed or optional)

1. **NewsletterForm contrast** — Addressed: `text-white/50` → `text-white/70` in `components/NewsletterForm.tsx`.
2. **Footer copy not from JSON** — Optional: Footer tagline/pillars could be sourced from `data/homepage-copy.json` for single source; current hardcode is acceptable.
3. **Thank-you Step 2 color** — Optional: use brand token instead of `text-blue-600` for consistency.
4. **400 validation messages** — Optional: return generic "Invalid request" in production and log detail server-side (existing pattern across form APIs).

---

## Validation Summary (runtime / behavior)

| Check | Result |
|-------|--------|
| **Track A — Schedules** | SchedulesAnchorNav: IntersectionObserver, activeSectionId, aria-current, 48px links, focus ring, reduced-motion. Phase 4 and Success Criteria ticked in plan. |
| **Track B — Homepage** | Hero (no form), ExitIntent (scroll threshold), HomeCTAForm (error id, aria-describedby), Footer (text-white/70). Copy from data where specified. |
| **Track C — Registration** | Thank-you: searchParams.type → trial/program/year/scholarship; COPY_BY_TYPE; getThankYouType. Scholarship: storeLead + optional AC (upsertContact, addToList, addTag 108). Modals redirect to thank-you?type=program|year. docs/registration-flows-and-ops.md with flow table and AC checklist. |
| **Functional** | Trial/book → /thank-you (trial). Program modal → success → "View next steps" → /thank-you?type=program. Year modal → /thank-you?type=year. Scholarship → /thank-you?type=scholarship. All types render correct headline/firstLine. |
| **APIs** | book, register-program, register-year, newsletter, scholarship, register unchanged contracts; scholarship adds optional AC path when env set. |

---

## Track completion checklist (master plan)

### Track A — Schedules optional polish

- [x] A.1.1–A.1.5 Active section highlighting (IntersectionObserver, activeSectionId, aria-current, style, reduced-motion).
- [x] A.2.1–A.2.2 Schedules plan Success Criteria and Phase 4 ticked (Lighthouse left to verify).
- [x] Build/lint pass; no new a11y regressions.

### Track B — Homepage full overhaul

- [x] B.1 Layout & UX (hero no form, exit-intent guard, one CTA form, Sticky CTA, mobile/48px).
- [x] B.2 Copy (homepage-copy.json single source; CTAs and voice).
- [x] B.3 Imagery (media brief; alt/sizes on existing images).
- [x] B.4 Polish & a11y (hero CTA, 48px, focus, reduced-motion, HomeCTAForm a11y; Footer + NewsletterForm contrast).
- [x] Build/lint pass.

### Track C — Registration flow & operations

- [x] C.1 Thank-you page: searchParams.type → trial|program|year|scholarship; COPY_BY_TYPE; getThankYouType.
- [x] C.2 docs/registration-flows-and-ops.md (flow table, where to look).
- [x] C.3 ActiveCampaign confirmation checklist (in ops doc).
- [x] C.4 Optional: Scholarship → AC (upsertContact, addToList, addTag CAMPAIGN_TAGS.scholarship).
- [x] C.5 Optional: LuxuryYearModal and LuxuryRegistrationModal redirect to thank-you?type=year|program.
- [x] Build/lint pass.

---

## Decision

- **Ready to ship:** Yes. All tracks are implemented; review found no critical issues; one a11y fix applied (NewsletterForm contrast). Optional items (Footer copy from JSON, thank-you Step 2 brand color, generic 400 messages) can be done later.
- **Recommendation:** Run a quick manual pass: /schedules (scroll and confirm active nav), / (hero + CTA + footer), /thank-you?type=trial|program|year|scholarship, and one trial + one program registration to confirm redirects. Then deploy if desired.

---

## Files changed in this session (review fix)

- `components/NewsletterForm.tsx` — `text-white/50` → `text-white/70` for footer newsletter description (WCAG 7:1 on deep-water).
