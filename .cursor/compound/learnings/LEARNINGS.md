# Compound Engineering — Learnings (March 2026)

Extracted from the Code Review Summary (12-agent parallel review). Use these for future implementation and review.

**Recent:** 2026-05-06 (full compound loop) — Leads pipeline next moves: 4 commits shipped (`d546b3e`, `8ec86dc`, `04366d3`, `fda872d`). Phase 1: founder corrections sweep from May 4 (LiveBall NTRP 2.5+ → 3.0+, minPlayersToRun: 5, Adult Intermediate Saturday interchangeable). Phase 2: Notion → Supabase mirror — migration adds `notion_page_id` text + unique partial index; daily Vercel cron at 03:00 PT pulls Meta lead-ad rows from Notion (idempotent). Smoke-imported **139 Meta leads** into Supabase (86 → 225 total). Phase 3: `/coach-hub/leads` admin view — server-rendered table with channel filter chips, defense-in-depth auth (proxy.ts + cookie check), CSV export at `/api/coach-hub/leads/export`. New patterns: `notion-supabase-mirror-cron`, `auth-gated-admin-route-under-existing-prefix`, `csv-export-shared-lib-server-only`, `vercel-env-add-no-newline`, `supabase-unique-partial-index-for-mirror-idempotency`. New anti-patterns: `echo-pipe-secret-to-vercel-env`, `skip-multi-storage-cron-when-channels-fragment`. Learn doc: `2026-05-06-leads-pipeline-next-moves-compound-learn.md`.

**Previous:** 2026-05-06 — Leads pipeline hardening (lead-pipeline-server-side-dedup + double-submit guard): added 120s server-side dedup window in `lib/leads-store.ts` (single fix protects 7 form routes), added synchronous `useRef` double-submit guard to `TrialBookingModal` (highest-volume form, 56% of submissions); shipped as commit `d5631a9`. Audit found **86 leads in Supabase** but **251 in Notion** — 165 came from Meta lead-ad forms via Zapier, bypassing the website code path entirely. Patterns: `lib-level-form-pipeline-dedup`, `useref-synchronous-double-submit-guard`, `multi-storage-lead-audit`, `vercel-deploy-verify-via-timing`, `lead-export-csv-with-channel-classification`. Anti-patterns: `relying-only-on-disabled-for-double-submit`, `single-storage-assumption-without-audit`, `deprecated-route-edit-without-read`, `bundle-unrelated-dirty-files-in-focused-commit`. Quality bars: `formPipelineServerSideDedup` (must), `multiStorageLeadAuditBeforeClaim` (must), `deprecatedRouteReadBeforeEdit` (must), `formPipelineClientSyncGuard` (should). See `2026-05-06-leads-pipeline-dedup-compound-learn.md`.

**Previous:** 2026-05-04 — Bot FAQ knowledge base (full year 2026): created `gpt/03-KNOWLEDGE-BRAIN/23-bot-knowledge-base-2026.md` (70 Q&As covering Winter/Spring/Summer/Fall + camps + leagues + privates + restringing + scholarships + escalation), grounded in `/data/*.json` with 49-assertion Python validator. Founder corrections applied mid-loop: LiveBall Intermediate is NTRP 3.0–4.0 (not 2.5+), LiveBall minimum 5 players to run, Saturday Adult Intermediate is included in regular package (not separately priced). Cross-surface sweep updated 3 season JSONs + coach-hub mirror + ProgramsTabView + brain doc 02. Patterns: `bot-fact-source-of-truth-hierarchy`, `acceptance-script-as-validator`, `founder-correction-cross-surface-sweep`, `bot-kb-q-and-a-structure-2026`, `season-aware-pricing-quote`. Anti-patterns: `sms-implied-policy-as-codified-fact`, `ntrp-band-mixed-truth-in-record`, `bot-kb-quote-without-source-line`. Quality bars: `botKnowledgeBaseSourceLine` (must), `founderCorrectionCrossSurfaceSweep` (must), `numericalFactValidationScript` (should). See `2026-05-04-bot-faq-knowledge-base-compound-learn.md`.

**Previous:** 2026-03-28 — UTR Match Play full redesign (spec-driven data + UI) + contact form pipeline fix: `message` must be on `bookingSchema` or Zod strips it; `source=contact-page` branches AC/Notion/GHL/confirmation away from trial path; `sendContactFormConfirmationEmail` + `category: Contact` in email template; `UtrDropInSchedule` anchor uses `<a>` not undefined `Link`. Patterns: `api-schema-field-parity`, `booking-route-multi-intent`. See `2026-03-28-utr-redesign-contact-book-pipeline-compound-learn.md`.

**Previous:** 2026-04-02 — UTR tracker engagement UX: added leaderboard movement + weekly delta pairing, momentum modules, around-you context, GF pace chips, stage-aware Color Ball milestone copy, and keyboard-safe custom tooltip behavior. Tests upgraded to deterministic exact-value fixtures for positive/negative/zero weekly delta. Patterns: `leaderboard-movement-delta-pairing`, `around-you-context-window`, `deterministic-scoring-fixtures`, `gf-pace-chip-communication`. See `2026-04-02-utr-tracker-engagement-ux-compound-learn.md`.

**Previous:** 2026-04-03 — UTR tracker ship-complete hardening + production rollout: write-safety defaulted to replace-scope mode (`week+division+date`), expanded points/color-ball/API tests, production deploy verified, and Supabase migration history reconciled to canonical versions (`20260401`, `20260402`, `2026040301`, `2026040302`). Patterns: `utr-admin-write-mode-default-replace`, `supabase-migration-history-reconcile`, `dirty-tree-isolated-commit`. See `2026-04-03-utr-tracker-ship-complete-compound-learn.md`.

**Previous:** 2026-03-27 — Player Success carousel: Cloudinary hero URLs (`f_auto,q_auto`), `imageFit: "contain"` on all slides to avoid head crop; `verify-image-paths` skips `https://` refs. Review note: align Ryan slide `imageAlt` with image when Ryan-only asset ships. Patterns: `player-success-hero-contain-no-crop`, `cloudinary-next-image-delivery`. Anti-pattern: `slide-image-alt-mismatch`. See `2026-03-27-player-success-cloudinary-compound-learn.md`.

**Previous:** 2026-03-23 — UTR Match Play standalone page: lib/utr-match-play.ts as single source for season, divisions, modal payload from leagues-2026.json; LuxuryYearModal wired as primary CTA; form-config duration derived via getUtrCircuitFormDuration(); AC division tags use data.division; getUtrDivisionTag normalizes en-dash; leagues schema extended with ntrpToUtr. See `2026-03-23-utr-match-play-compound-learn.md`.

**Previous:** 2026-03-23 — Homepage hero video + Player Success carousel verification (see `2026-03-23-photo-carousel-facility-imagery-compound-learn.md`).

**Previous:** 2026-03-20 — ActiveCampaign test email fix: see `2026-03-20-activecampaign-test-email-compound-learn.md`. v3 POST /campaigns/{id}/test returns 405 → use legacy campaign_send with campaignid + messageid. Correction + pattern added.

**Previous:** 2026-03-17 — Mobile Phase 1 audit compound:learn: see `2026-03-17-mobile-audit-compound-learn.md`. Audit baseline for mobile (320/375/768px): horizontal scroll, 48px touch targets, 16px+ form inputs, scroll-anchor, modals. **Learn run:** Corrections (button min-width overflow, form input 16px on mobile), pattern (mobile-audit-baseline), quality bars (mobileChecklist, formInput16pxMobile), anti-patterns (button-min-width-overflow, form-input-font-below-16-mobile). Deliverable: `plans/mobile-audit-phase1-checklist.md`.

**Previous:** 2026-03-16 — Green Dot schedule review + work-phase fixes: see `2026-03-16-green-dot-schedule-compound-learn.md`. Schedule slot venue consistency (LB High School not LBHS), form-config location aligned with season data (Youth Development → LBHS), program descriptions lean and date-free.

**Previous:** 2026-03-14 — Validation 89→100 + compound learn: see `2026-03-14-validation-100-learn.md`. Site copy centralization, LeaguesData/Year2026 single type, ChatWidget/Chatbot a11y (48px + focus ring), pricing-supplemental Zod, form-config vs registrationModalPricing test, API/docs notes, turbopack.root.

**Previous:** 2026-03-12 — Schedule sync + compound review: see `2026-03-12-schedule-sync-compound-learn.md` and `plans/compound-review-2026-schedule-sync.md`. Corrections, patterns, anti-patterns, and quality bars updated in this folder and in `COMPOUND_LEARN.md`.

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
- **A11y:** Focus restore on modal close; aria-label on icon-only buttons; useReducedMotion for motion; **all interactive buttons** min 48px touch target + visible focus-visible ring (interactiveButton48pxFocusRing).
- **Simplicity:** No unused state or refs; YAGNI for optional props. HorizonDivider always renders `<hr>`; no `as` prop.
- **Server–client boundary:** Single type from Zod schema; no `as unknown as T` (singleTypeFromZodBoundary). API body/response shape documented where non-obvious (apiDocsBodyAndResponse).

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

---

## 2026-05-11 — Email brand audit Round 2 + cleanup (5 commits, 2 review rounds)

**Trigger:** `/compound-engineering work plan 2` → `/compound-engineering review` → "Option B" cleanup → `/compound-engineering learn`.
**Result:** 5 atomic commits shipped + verified live. Brand checker now strict-enforces 9 categories across React + email domains. Score: Round 1 78/100 → Round 2 89/100 → final ~91.

### New corrections (corrections.jsonl, 12 entries)

- Source-grep contract tests are brittle → write behavior tests via exported scanner API + synthetic fixtures.
- `getEditedFiles()` scoped to wrong domain when extending checker → audit ALL input pipelines (full-scan + edited-files).
- HTML email files routed through React-side font scanner → flagged Helvetica/Arial false positives → domain-aware routing at dispatch layer.
- Silent error swallowing in legal-compliance code (`catch { return [] }` in CAN-SPAM check) → fail-loud + filesystem-walk fallback.
- `scanEmailTemplate` mutated state → return `{ forbiddenHex, missingPostalAddress }` for consistency with sibling scanners.
- `Hit.line: number` overloaded with magic value 0 → narrow to `number | null`, render null as "(file)".
- Cargo-cult `.replace('#', '#')` no-op → delete; if metachars need escaping, write the actual escape.
- BRAND COLOR POLICY rationale technically false ("Outlook renders inconsistently") → state real reason (visual hierarchy + email convention) + back-link to escape-hatch playbook.
- Premature exports of `Hit` and `ReportData` types → don't export until a consumer asks.
- Hardcoded "9 strict categories" magic number → compute via `Object.keys(totals).length`.
- Config-pinning tests in disguise (`expect(constant).toBe(...)`) → behavior tests #1-#6 implicitly cover config; delete redundant.
- Skipped `health:prod` proof in commit body → required by `.cursorrules` Part 15 §4 for auditability.

### New patterns (patterns.json, 8 entries)

- **separate-domain-scanners-over-scanroots-extension** — different file types deserve separate scanners with own constants/exemptions.
- **compose-paths-from-single-root-constant** — `\`${root}/sub\`` over hardcoded paths.
- **cli-library-dual-mode-isMainModule-guard** — `if (process.argv[1].endsWith('script.ts')) main()` lets same file be CLI + library.
- **precompile-regex-outside-per-line-loops** — costs nothing at small N, scales correctly.
- **three-layer-exception-documentation** — JSON config + JSDoc + framework back-link.
- **plan-aware-reviewer-agents** — pass plan + acceptance + out-of-scope to every agent.
- **round-N-review-with-prior-findings** — agents verify fixes for THEIR own previous findings; tracks resolution rate.
- **fix-forward-vs-revert-decision-rule** — STRICT green + acceptance met → fix-forward; otherwise → revert/amend.

### New anti-patterns (anti-patterns.json, 6 entries)

- source-grep-contract-tests, silent-skip-in-legal-compliance-checks, magic-zero-for-file-level-findings, cargo-cult-defensive-no-op, bolting-new-domain-onto-existing-scanroots, config-pinning-tests-disguised-as-behavior-tests.

### New quality bars (quality-bars.json, 6 entries)

- emailForbiddenHexConsolidation (must), emailCanSpamPostalAddress (must), brandCheckerSeparateScannersPerDomain (must), testsBehaviorOverContract (should), legalComplianceFailLoud (must), shipGateProofInCommitBody (must).

### Project state at end of session

- Brand checker: 9 strict categories, all green
- Tests: 17/17 passing (was 10 — net +7 behavior tests after consolidation)
- Commits live in prod: bb017b7, e88206f, 325ba29, 0cf42a4, d51e9ed
- All 6 reviewers in Round 2: "ready"

Full extraction: `.cursor/compound/learnings/2026-05-11-email-brand-audit-r2-cleanup-compound-learn.md`.
