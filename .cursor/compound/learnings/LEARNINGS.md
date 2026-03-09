# Compound Engineering — Learnings (March 2026)

Extracted from the Code Review Summary (12-agent parallel review). Use these for future implementation and review.

---

## CORRECTIONS (what was wrong → what to do instead)

| Original | Correction |
|----------|------------|
| Duplicate hardcoded program lists in TrialBookingModal and app/book/page.tsx | Derive trial program options from a single source: `lib/programs-data` or a dedicated data file; remove unused list on book page. |
| Hardcoded prices in PricingComparison.tsx ($50, $546, $1,292, $42/session, $50/session) | Move tier definitions and all prices to `/data/*.json` (e.g. pricing-supplemental.json or new pricing-comparison.json); load in component. |
| activecampaign-webhook error path returns 200 with `success: false` | Return 500 for processing failures: `NextResponse.json({ success: false, error: '...' }, { status: 500 })`. |
| TrialBookingModal closes without restoring focus to trigger | Store previously focused element (or trigger ref) before opening; call `previousFocus?.focus()` in handleClose and in effect cleanup when isOpen becomes false. |
| ChatWidget send button icon-only with no accessible name | Add `aria-label="Send message"` (or equivalent) to the send button. |
| ChatWidget calls POST /api/chat but route does not exist | Implement `/api/chat` with validation and rate limiting, or remove/disable the ChatWidget. |
| AC_WEBHOOK_SECRET unset allows unauthenticated webhook calls | Require and enforce the secret in production; reject requests when secret is missing in prod. |
| VideoTestimonials: isMobile state and resize effect never used | Remove isMobile, setIsMobile, and the resize useEffect. |
| VideoTestimonials: containerRef attached but .current never read | Remove containerRef and ref={containerRef}. |
| API routes return 500 on request.json() parse failure | Treat JSON parse failure as client error: return 400 "Invalid request format" (see newsletter/route.ts). |

---

## PATTERNS (name — when to use — example)

| Pattern | When to use | Example |
|---------|-------------|---------|
| Single source for dropdown options | Any modal or page that shows a list of programs/options used elsewhere | TrialBookingModal and book page both need trial program list → one helper or data file, both import. |
| Prices only in data | Any component that displays pricing (tiers, sessions, membership) | PricingComparison, LeaguesSection → read from /data/*.json or lib/programs-data. |
| Modal focus restore | Any modal/dialog that traps focus | On open: save document.activeElement; on close: restore focus in close handler and effect cleanup. |
| Icon-only button a11y | Any button that has only an icon (no visible text) | Add aria-label describing the action (e.g. "Send message", "Close"). |
| Webhook error status | API route that processes webhooks | On catch/processing failure return 500, not 200; require secret in production. |
| Reduced motion for animated sections | Section that uses Framer Motion whileInView or entrance animation | useReducedMotion(); when true render plain element with no motion props. |
| Next/Image for logos and partner images | Any img that is not a tracking pixel or noscript fallback | ChatWidget logo, PartnershipSection logos → Next/Image with width/height and descriptive alt. |

---

## STANDARDS (rule — enforcement level)

| Rule | Level |
|------|--------|
| No hardcoded prices in components; all pricing from /data/*.json or lib/programs-data | Must |
| No duplicate lists for the same domain concept (e.g. trial programs); single source | Must |
| API error responses must use correct status (500 for server failure, 400 for bad request) | Must |
| Modals must restore focus to trigger on close | Must |
| Icon-only buttons must have aria-label (or visible text) | Must |
| Webhooks must require auth secret in production | Must |
| Remove unused state and refs (isMobile, containerRef) before merge | Should |
| Throttle resize listeners when only used for layout (e.g. 150–200ms) | Should |
| Use DarkSection for bottom CTA on program pages (consistency) | Should |
| JSDoc or short comment for non-obvious behavior (handleClose reset, auto-advance, reduced-motion Wrapper) | Should |
| Prefer brand-* tokens for error states; avoid raw text-red-* when touching files | Should |
| New code prefers brand-* over lbta-* (backwards compat lbta-* acceptable when not touching) | Should |

---

## Quality bars (from review)

- **Data integrity:** No hardcoded program lists or prices; single source in data/ or lib.
- **API:** 400 for invalid JSON/body; 500 for processing errors; webhook secret required in prod.
- **A11y:** Focus restore on modal close; aria-label on icon-only buttons; useReducedMotion for motion.
- **Simplicity:** No unused state or refs; YAGNI for optional props. HorizonDivider always renders `<hr>`; no `as` prop.

---

## Session

- **Source:** Compound Review (12 agents), March 2026
- **Scope:** LBTA website uncommitted changes (TrialBookingModal, VideoTestimonials, DarkSection, HorizonDivider, layout, app pages)
- **Overall score:** 72/100 — Needs fixes (critical issues addressed above)

---

## Post-fix session (March 2026)

- **Fixes applied:** Single source trial programs (lib/programs-data + TrialBookingModal + book page); TrialBookingModal focus restore; PricingComparison from data/pricing-supplemental.json; activecampaign-webhook 500 on error + 503 when AC_WEBHOOK_SECRET missing in production; ChatWidget aria-label + type="button"; VideoTestimonials dead code removed; **/api/chat stub** added (POST, Zod chatSchema, rate limit, friendly reply).
- **New pattern:** Stub API with validation + rate limit + friendly reply when no backend yet (see patterns.json `stub-api-friendly-reply`).

---

## Session 2026-03-08 (Review + Validate + Learn)

- **Source:** Code Review (13 agents) + Validation (5 agents), then learning extraction.
- **Scores:** Review 82/100, Validation 90/100. No critical issues; warnings only.
- **Scope:** API parseJsonBody/400, register-year/webhook safety, site-stats single source, Footer Contact, ExitIntentPopup/FAQSection a11y, CTA conventions, tests for parseJsonBody and chat/webhook.

### New corrections (added to corrections.jsonl)

- Modal success timeout: clear in useEffect cleanup; restore focus when timeout fires before closing.
- All JSON routes: use parseJsonBody (webhook included); no inline request.json() try/catch.
- Primary CTAs: black/white per .cursorrules; Sunset Cliff accent only.
- LuxuryYearModal: show result.error when present.
- FAQ/accordion: add ARIA and useReducedMotion; close buttons 48×48px.

### New patterns (added to patterns.json)

- **parseJsonBody-then-validateRequest** — Every JSON route uses shared helper.
- **modal-timeout-cleanup** — Clear setTimeout in useEffect cleanup and close().
- **restore-focus-on-auto-close** — Timeout callback restores focus then closes.
- **trust-stats-from-site-stats** — Single source data/site-stats.json for trust numbers.

### New anti-patterns (added to anti-patterns.json)

- Inline request.json() when parseJsonBody exists.
- Modal timeout not cleared on unmount.
- Modal auto-close without focus restore.
- Primary CTA orange (Sunset Cliff as primary fill).

### New quality bars (added to quality-bars.json)

- parseJsonBodyAllRoutes (should), modalTimeoutCleanup (must), modalFocusOnAutoClose (must), primaryCtaBlackWhite (should), faqAriaReducedMotion (should), closeButton48px (must).

Full extraction: `.cursor/compound/learnings/2026-03-08-extraction.md`.

---

## 2026-03-09 — Brand guide review → validate → deploy

**Trigger:** `/compound:learn` after review (6 agents), validate, deploy (production live).

### New corrections (corrections.jsonl)

- Parallax without reduced-motion → gate with matchMedia; disable when true (e.g. About like HomeHero).
- Inline blockquote with solid border → use PullQuote or .section-quote for Brand Guide gradient.
- Decorative SVG in links/buttons → add aria-hidden="true" to svg.
- Tailwind class not in config (e.g. lbta-tan) → use lbta-beige or brand-sandstone; check config.

### New patterns (patterns.json)

- **pull-quote-section-quote** — Use PullQuote or .section-quote for all pull quotes.
- **parallax-reduced-motion-gate** — Gate parallax/scroll motion with prefers-reduced-motion.
- **decorative-svg-aria-hidden** — aria-hidden="true" on decorative SVGs in links/buttons.

### New anti-patterns (anti-patterns.json)

- parallax-without-reduced-motion, inline-blockquote-instead-of-section-quote, decorative-svg-without-aria-hidden, undefined-tailwind-color.

### New quality bars (quality-bars.json)

- parallaxReducedMotion (should), pullQuoteSectionQuote (should), decorativeSvgAriaHidden (should), tailwindColorDefined (should).

Source: `plans/2026-03-09-compound-review-validate-deploy-summary.md` and `plans/COMPOUND_LEARN.md` learn run log.
