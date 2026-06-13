# Mobile UX Remediation Plan — Review Report

**Plan reviewed:** `plans/2026-05-13-mobile-ux-remediation-plan.md` (untracked at review time, dated 2026-05-13).
**Review run:** 2026-05-13 (Compound REVIEW phase, plan-document mode — no code reviewed; no code changed).
**Reviewers (11 personas, in-thread):** Scope Compliance · Architecture Strategist (Token Design) · Pattern Recognizer (Migration Rhythm) · Simplicity · Accessibility · Memory Compliance · Regression Hunter · Performance / CLS · Risk & Pre-mortem · Documentation · Verifiability.
**Independent verification performed:** WCAG contrast math (Node script, full sRGB→linear→relative-luminance pipeline) for `#4A5568` and 6 alternates against `#FAF8F4` / `#F5F0E5` / `#FFFFFF`; raw `lighthouse/contact.report.json` `layout-shifts` + `cls-culprits-insight` audits; raw `axe/summary.json`; `package.json` script existence; `scripts/check-brand-usage.ts` shape and strict-mode contract; `lib/brand-tokens.test.ts` existence and shape; `tokens/lbta-web-tokens.json` v1.2.0 schema; `components/ui/SeasonBanner.tsx`, `components/layout/{Footer,ConditionalLayout}.tsx`, `components/NewsletterForm.tsx`, `components/contact/FacilitiesSection.tsx`, `app/pathway-planner/page.tsx`, `app/contact/page.tsx`.

---

## Headline

**Overall score: 76/100**
**Decision: ⚠️ Needs revisions before `/compound:work`.**

The plan is well-structured, decision-lens-aware, and honest about its own uncertainty. Memory compliance and pattern-rhythm match v1.3/v1.4 contracts. **Two findings, both rooted in independent verification, are blockers** and must be resolved in a plan revision before execution:

1. **The chosen hex value `#4A5568` does not pass WCAG AAA on `bg-brand-sandstone` (#F5F0E5).** Verified contrast ratio is **6.62:1**, not the plan's claimed `~8.4:1`. Sandstone is the surface of the inactive season-tab text — the single most-cited C-3 contrast use case in the audit. The plan's central architectural deliverable would ship a token that fails its own success criterion.
2. **The `/contact` CLS hypothesis (SeasonBanner mount) explains 0.097 of the 0.499 score; the unique 0.402 shift is not addressed.** Cross-route lighthouse `layout-shifts` data shows the 0.097 shift is universal (every audited route except `/junior-trial` has it; `/junior-trial` is excluded from the shared `<SeasonBanner>` layout per `ConditionalLayout.tsx:21`). The 0.402 shift is unique to `/contact` and footer-attributed, but the proposed fix would only neutralize the universal 0.097 component. **Acceptance Criterion 3 (`/contact` CLS < 0.1) would not be met by the plan as written.**

Everything else is fixable in execution. With these two corrections, the plan is sound and ready to ship.

---

## By-persona table

| # | Persona | Score | Status | Top concern |
|---|---|---:|---|---|
| 1 | Scope Compliance | 88 | 🟢 Pass | Phase 4.1 copy depends on Andrew sign-off; the plan acknowledges but does not gate Work-phase on receiving it. |
| 2 | Architecture Strategist (Token Design) | 60 | 🔴 Fail | `#4A5568` fails AAA on sandstone (verified 6.62:1, not 8.4:1). Token-design fork (Option B) is correct in principle; **hex value is wrong**. |
| 3 | Pattern Recognizer (Migration Rhythm) | 84 | 🟢 Pass | 17 commits matches v1.3 `introduce-cleanup-enforce`. Phase 2's 5 commits are arguably over-split. |
| 4 | Simplicity | 78 | 🟡 Watch | 17 commits is on the high end. Phase 4.3 strict promotion could land in a follow-up PR. |
| 5 | Accessibility (Pattern Correctness) | 88 | 🟢 Pass | Heading-order, landmark, htmlFor/id, aria-label patterns are correct. Junior-trial select fix prefers `aria-label`; an `<label htmlFor>` with `sr-only` would be the gold standard. |
| 6 | Memory Compliance | 92 | 🟢 Pass | Cites all relevant learnings (v1.1, v1.3, v1.4, aman-standards 2026-04-16, mobile-audit 2026-03-17). Inherits `introduce-cleanup-enforce`, `dry-run-default-migrator`, `one-shot-tool-delete`, `fixture-tests-before-strict-promotion`. |
| 7 | Regression Hunter | 80 | 🟡 Watch | Codemod regex `\btext-brand-pacific-dusk\/(30\|40\|50\|60\|65\|70)\b` is **not surface-scoped**; will flag legitimate dark-surface uses (e.g. on `bg-brand-deep-water`). Plan acknowledges but proposes no automated guard. |
| 8 | Performance / CLS | 55 | 🔴 Fail | SeasonBanner hypothesis explains 0.097 of 0.499. The 0.402 shift on `/contact` is uninvestigated and not addressed by the proposed fix. |
| 9 | Risk & Pre-mortem | 75 | 🟡 Watch | Risks A–E are reasonable; rollback for the codemod is implicit (git revert) rather than named. Pre-mortem #2 acknowledges the CLS hypothesis risk but the proposed fix would still ship un-met. |
| 10 | Documentation | 82 | 🟢 Pass | All cited commands exist (`tokens:check`, `tokens:build`, `ship:gate`, `health:prod`, `lighthouse`). Minor: strict-mode requires `STRICT_BRAND_CHECK=1` env var (which the plan only mentions implicitly via `ship:gate`/`quality-gate` chains). |
| 11 | Verifiability | 75 | 🟡 Watch | Most success criteria are tool-tied. Criterion 3 (`/contact` CLS < 0.1) is at risk per Performance findings. Criterion 1 (axe critical = 0) is gameable if a new violation is introduced anywhere unflagged. |

**Aggregate: 76 / 100.** Two fail-bar personas (Architecture Strategist, Performance / CLS) push the verdict to **needs-revisions**.

---

## Deduplicated findings

| Severity | Persona(s) | Plan section | Issue | Recommendation |
|---|---|---|---|---|
| 🔴 Critical | Architecture Strategist | §3 Phase 1, §4, §10 (Resolution: Option B; Resolution: hex value), §12 Risk A | `#4A5568` claimed AAA on `morning-light` (~9.0:1) and `sandstone` (~8.4:1). Independently verified ratios: morning-light **7.09:1** (AAA pass, but only by 0.09), sandstone **6.62:1** (**fails AAA**, AA only). The C-3 finding the token is supposed to fix specifically targets sandstone surfaces (`#season-tab-{winter,summer,fall}` per `axe/schedules.json` 49 nodes). Plan ships a token that fails its own success criterion on the highest-volume use case. | Change the hex to one that clears AAA on sandstone with margin. Recommended: **`#3D4658`** (8.94 / 8.34 / 9.48 — best margin). Alternates: `#3F4A5E` (8.42 / 7.85 / 8.93), `#404C5E` (8.20 / 7.66 / 8.70). Document the WCAG ratios in the commit body and in a comment in `tokens/lbta-web-tokens.json`. Rationale: WCAG calculations have anti-aliasing and rendering variance; AAA targets should clear by ≥10% margin (so `#4A5568` at 6.62 on sandstone is **decisively fail-AAA**, not "borderline"). |
| 🔴 Critical | Performance / CLS, Risk & Pre-mortem, Verifiability | §3 Phase 3.1, §4 Files (CLS row), §6 Criterion 3, §11 (medium-confidence row), §13 Gate 4, §14 Pre-mortem #2 | The plan's hypothesis (`SeasonBanner` post-hydration mount = `/contact` CLS root cause) explains only the **0.097** shift component. Cross-route `lighthouse/*.report.json` `layout-shifts` data shows 0.097 is universal (every shared-layout page has it; `/junior-trial` has CLS 0 because `ConditionalLayout` excludes the SeasonBanner+Header+Footer block per `ConditionalLayout.tsx:17–22`). `/contact` uniquely shows an extra **0.402** shift, also footer-attributed but ~4× larger than a 50px banner can plausibly cause. Even after the proposed SSR-placeholder fix, `/contact` would still ship at ~0.402, **failing Acceptance Criterion 3** (CLS < 0.1). | Two corrections: (a) Strengthen Gate 4 in §13 from "read the trace before fixing" to a hard prerequisite: Work-phase must produce a Markdown note in the PR description listing the **specific elements named in `layout-shifts.details.items[]`** for `/contact`, and the proposed fix must address **both** the 0.402 and 0.097 components. (b) Add a likely-suspects table to §3 Phase 3.1 for the 0.402 shift: `components/contact/FacilitiesSection.tsx` (3-card grid that may re-layout if `f.streetLine` / `f.programsLine` / `f.parkingLine` are conditionally rendered or grow with images), the `<form id="contact-form">` (state-driven `errors{}` map can grow the form mid-paint), the GHL ChatWidget injection (`scorecard.md` §10 notes 4s defer + first-scroll), or font-display swap of Cormorant headings on a font-heavy page. Rank by likelihood and produce a separate fix per the actual finding. The SeasonBanner SSR-placeholder fix can ship anyway (it cleans up the universal 0.097 across **every** page) but it is not the `/contact` CLS fix. |
| 🟡 Warning | Architecture Strategist, Regression Hunter | §3 Phase 1 (scanner regex), §11 (item 1 of "Honesty"), §12 Risk A | Codemod regex `\btext-brand-pacific-dusk\/(30\|40\|50\|60\|65\|70)\b` matches **all** light-opacity text classes regardless of surface. A class like `text-brand-pacific-dusk/65` legitimately used on `bg-brand-deep-water` (or any dark `<DarkSection>` body) would be over-matched and visually broken when codemodded to `text-brand-pacific-dusk-soft`. Plan acknowledges this in §11 but ships no automated guard — relies on dry-run human review of 30+ sites. | (a) Tighten the codemod to exclude any line whose surrounding ~3 lines contain `bg-brand-deep-water`, `bg-brand-deep-card`, or `<DarkSection`. (b) For the scanner rule, do the same surface-context heuristic. (c) Run `rg "text-brand-pacific-dusk/(30\|40\|50\|60\|65\|70)" -B 5 -A 1 app components` and **manually classify each hit** as light-surface or dark-surface before codemodding. Per `mass-migration-needs-context-heuristics` learning (`2026-05-06-brand-system-v14`), shape-based regex without context routes is the exact failure mode v1.3 made and v1.4 corrected. |
| 🟡 Warning | Architecture Strategist | §3 Phase 1, §10 Resolution | The plan also wants to flag bare `text-brand-victoria-cove` body text (audit C-3: 3.82:1, fails both AA and AAA). Suggested heuristic: "occurs without `underline` or `font-medium` adjacent." This heuristic is fragile — the contact page phone/email links DO have underline-on-hover (`underline decoration-brand-victoria-cove/30 underline-offset-2`) which would suppress the flag, but they're still 3.82:1. WCAG does allow lower contrast for hyperlinks if the link is distinguishable by underline, but the LBTA bar (`.cursorrules` Part 6) is AAA 7:1 universally. Either the underline-link exception needs to be explicit in the rule or victoria-cove body usages need migration too. | Decide explicitly: either (a) keep `text-brand-victoria-cove` for underlined hyperlinks only (acceptable per WCAG 1.4.1 underline-as-distinguisher), and codemod non-link victoria-cove text to `pacific-dusk-soft`; OR (b) treat victoria-cove on light surfaces as universally forbidden for text and remap to `pacific-dusk-soft`. Option (a) preserves brand-color signal in links; option (b) is simpler. Plan currently sits between. Recommendation: **Option (a)** — explicit allow-list for the link patterns (`underline.*decoration-brand-victoria-cove`) in the scanner. |
| 🟡 Warning | Pattern Recognizer, Simplicity | §3 Phase 4.3, §13 Risk E | Phase 4.3 (strict-mode promotion) sits in the same PR as Phase 4.2 codemod. Per the v1.3 `introduce-cleanup-enforce` learning, this is acceptable when (1) Phase 4.2 dry-run shows zero remaining hits and (2) fixture tests pass. Risk: any single codemod miss, false-positive, or unintended exception in Phase 4.2 gets locked behind strict mode in the same PR — surfacing as a CI failure on the *next* PR by an unrelated developer. v1.4 learning F (postreview-fixes) explicitly warns "Don't ship guardrails that pass-but-don't-actually-enforce" — but it's also true that "don't ship strict-mode promotion in the same commit as the cleanup" if there's any doubt. | Either (a) move Phase 4.3 (strict promotion) to a follow-up PR after Phase 4.2 lands and one merge cycle confirms no surprise hits — explicit `introduce-cleanup-enforce` three-PR sequence; OR (b) keep in same PR but require Phase 4.3 to be the **final** commit and require the PR description to call out "if next PR fails on `forbiddenTextOpacityOnLight`, revert this commit before fixing." (a) is safer per `quality-bars.json` `mass migrations need parallel review`; (b) is the plan as written. Recommend (a). |
| 🟡 Warning | Documentation | §3 Phase 4.5, §6 Criterion 5, §7 (− [ ] Criterion 5) | The plan invokes `npm run tokens:check -- --all` to verify strict mode passes, but the existing `quality-gate` script in `package.json` shows the canonical strict invocation is `STRICT_BRAND_CHECK=1 npm run tokens:check -- --all`. Without the env var, `tokens:check --all` runs in default mode (warnings, not blocking). The plan's verification step would silently pass on warnings if the new category was wired only as a warning. | Use `npm run quality-gate` (which sets `STRICT_BRAND_CHECK=1` per `package.json:21`) as the canonical strict-mode check, OR explicitly write `STRICT_BRAND_CHECK=1 npm run tokens:check -- --all` in the plan. Tighter still: have Phase 4.3 also extend `lib/brand-tokens.test.ts` with a behavior test that calls a future `scanForbiddenTextOpacityOnLight()` exported function with known-bad fixtures and asserts it fails strict mode — analogous to the existing `scanEmailTemplate` export pattern in `scripts/check-brand-usage.ts:257`. |
| 🟡 Warning | Pattern Recognizer | §3 Phase 2 (5 commits), §Appendix A | Phase 2's 5 commits all address the same logical concern (a11y critical fixes that share a common review story). Compare to v1.3 eyebrow migration, which kept its mass-migration as one commit because it was one logical concern. Splitting helps incremental review but bloats the PR's commit graph. | Acceptable as-is for review-incrementality; leave the choice to Andrew. Note: 17 commits across 1.5–2 engineer days is a high commit/day rate; if any commit fails CI, the rebase cost compounds. |
| 🟢 Note | Architecture Strategist | §3 Phase 1, §10 Fork: token-rename vs add-new-token | Adding `pacific-dusk-soft` as a 13th BRAND token is correct in principle — preserves the v1.4 contract, opens the `-soft` suffix as a new convention. Risk to flag for future: every other surface-tuned variant (`sandstone-soft` for off-white text on white?) would inherit this naming, potentially leading to suffix sprawl. | Document in the commit body: "`-soft` is reserved for AAA-tuned secondary text variants of brand colors; do not use for non-text or non-AAA-driven variants." If `victoria-cove-soft` or `sunset-cliff-soft` are needed in future audits, they follow the same WCAG-driven justification. |
| 🟢 Note | Accessibility | §3 Phase 2.3 (junior-trial selects 299, 317) | Plan picks `aria-label="Choose program"` / `aria-label="Select schedule"` because the visible `<h3>` is a section heading, not a field label. This is correct and matches WAI-ARIA pattern (https://www.w3.org/WAI/tutorials/forms/labels/#hiding-the-label-element). A mildly-better alternative is `<label htmlFor="..." className="sr-only">…</label>` + `id` on the select — visible-when-needed (Lighthouse / dev tools surface it more obviously), but functionally equivalent for screen-readers. | Either is acceptable. Plan's `aria-label` choice is fine; flag in commit body so future audits know this was deliberate vs. an oversight. |
| 🟢 Note | Accessibility, Verifiability | §6 Criterion 7 (manual reduced-motion verify) | Manual reduced-motion verification is fine for a Tier-1 PR but defers to Andrew's manual pass. The plan's pre-mortem #3 already acknowledges that axe-passes ≠ real-user-AT-good-experience. | Recommend Work-phase capture a 30-second screen recording with OS Reduce Motion enabled, exercising TrialBookingModal open/close + StickyCTA scroll-in + BackToTop click + Header drawer open. Save to `docs/audits/2026-05/post-remediation/motion-verification.mov` (or PNG sequence). One-time investment, settles the question. |
| 🟢 Note | Memory Compliance, Pattern Recognizer | §9 (citations) | The plan cites all relevant learnings. One un-cited adjacent learning: `2026-03-15-mobile-review-single-expand-compound-learn.md` (single-expand pattern across StickyCTA + BackToTop + ChatWidget stacking) — relevant because Phase 3 reduces motion for two of those three components and could break the single-expand contract if the CSS variable height-reporting (`--lbta-sticky-cta-h`) interacts with the new motion gate. | Verify in Work-phase that StickyCTA's reported height to `--lbta-sticky-cta-h` is independent of the slide-up animation (CSS height vs. transform-translateY). If the CSS var is read inside a `useEffect` that fires post-animation, the gate change could shift the read timing. Spot-check on `/schedules` mobile after Phase 3. |
| 🟢 Note | Verifiability | §6 Criterion 1 (axe critical = 0 on 9 routes) | The plan's 9-route list does not include `/coaches` (only `/coaches/andrew-mateljan`). Both are in the audit's `axe/` corpus. Lighthouse audits also include `/adult-trial` separately. Verify the 9-route post-remediation re-run matches the baseline-9 set; if a 10th route is in the baseline but not the post-rerun, the comparison is asymmetric. | Make the route list explicit in `docs/audits/2026-05/post-remediation/delta-report.md`'s header: list the 9 routes audited, list any baseline-route NOT re-audited, justify omission. |
| 🟢 Note | Risk & Pre-mortem | §12 Risk A, B, E | Rollback paths for the codemod (Risk A) and CLS fix (Risk B) are not named. Per `quality-bars.json`'s ship-gate ethos, every risk should have a rollback. | Add to §12: "**Rollback for codemod (Risk A):** the Phase 4.2 commit is single-purpose; `git revert <SHA>` reverses cleanly because the codemod sites are unrelated to other commits in the PR. **Rollback for CLS fix (Risk B):** Phase 3.1 commit is single-file (`components/ui/SeasonBanner.tsx`); `git revert` reverses the SSR placeholder. Both rollbacks preserve the rest of the PR." |

---

## Top 5 must-fix-before-Work

1. **Recompute and replace the hex value for `pacific-dusk-soft`.** `#4A5568` fails AAA on `bg-brand-sandstone` (verified 6.62:1, AA only). Pick `#3D4658` (8.94 / 8.34 / 9.48 verified). Update §3 Phase 1, §4 (Human table + Machine YAML `value: "#3D4658"`), §10 (Resolution: hex value, both ratios), §11 (Confidence row "Token-layer contrast fix"). **Plan §3 Phase 1, §10 Resolution: hex value for pacific-dusk-soft.**
2. **Re-write Phase 3.1 to address both `/contact` CLS components, not just SeasonBanner.** Add a likely-suspects table for the 0.402 shift; require Work-phase to produce a Markdown note documenting the actual `layout-shifts.details.items[]` selectors before implementing any fix; explicitly note that the SSR-placeholder fix alone will not get `/contact` below the 0.1 bar. **Plan §3 Phase 3.1, §6 Criterion 3, §13 Gate 4, §14 Pre-mortem #2.**
3. **Tighten the codemod regex (or add a manual classification step) to avoid false-positives on dark surfaces.** `text-brand-pacific-dusk/{30,40,50,60,65,70}` is legitimately used on dark surfaces (e.g. `bg-brand-deep-water` body text) where it does not fail contrast and should not be migrated. Per the v1.4 `mass-migration-needs-context-heuristics` learning, a shape-only regex is the exact failure mode v1.4 corrected. **Plan §3 Phase 1 (scanner regex), §3 Phase 4.2 (codemod), §11 item 1, §12 Risk A.**
4. **Decide and document the `text-brand-victoria-cove` policy explicitly.** The plan's "occurs without `underline` or `font-medium` adjacent" heuristic is too fragile to ship — recommended: allow `text-brand-victoria-cove` for underlined hyperlink patterns only (matching `underline.*decoration-brand-victoria-cove`), forbid for body text. Codemod non-link victoria-cove → `pacific-dusk-soft`. **Plan §3 Phase 1 (scanner heuristic), §3 Phase 4.2.**
5. **Use the canonical strict-mode invocation in verification.** Replace `npm run tokens:check -- --all` with `npm run quality-gate` (which sets `STRICT_BRAND_CHECK=1`) OR write the env var explicitly. Without it, the verification step silently runs in non-strict mode. **Plan §3 Phase 4.5, §6 Criterion 5, §7 Acceptance.**

---

## Top 5 should-fix-before-Work

6. **Move Phase 4.3 (strict-mode promotion) to a follow-up PR.** Per the v1.3 `introduce-cleanup-enforce` three-PR sequence; ships safer and avoids the "next PR fails on a missed codemod hit and the new dev doesn't know why" scenario. Keeping it in the same PR is acceptable if the Work-phase verifies info-only mode shows zero hits before flipping; making it a follow-up is the higher-confidence path.
7. **Name explicit rollback steps for Risk A (codemod) and Risk B (CLS fix) in §12.** "git revert <SHA>" — both commits are atomic and reversible without affecting the rest of the PR.
8. **Add reduced-motion screen recording artifact to Acceptance Criterion 7.** A 30-second recording with OS Reduce Motion enabled, exercising TrialBookingModal + StickyCTA + BackToTop + Header drawer. Save to `docs/audits/2026-05/post-remediation/motion-verification.mov`. One-time investment, settles the question manual-verification can't otherwise.
9. **Make the route list explicit in `delta-report.md`.** The plan's "9 audited pages" does not include `/coaches` (the index, separate from `/coaches/andrew-mateljan`). Verify the post-remediation re-run uses the same baseline route list; document the route set in the delta-report header.
10. **Document the `-soft` naming convention in the commit body.** `pacific-dusk-soft` opens `-soft` as a new naming suffix. Document in the commit body: "`-soft` is reserved for AAA-tuned secondary-text variants of brand colors; do not use for non-text or non-AAA-driven variants." Prevents future suffix sprawl.

---

## Architectural verdict on the token-design fork

**Option B (add `pacific-dusk-soft`) is correct in principle but ships with the wrong hex.**

- **Option A (rename opacity utilities to canonical secondary-text token):** Correctly rejected. The plan's rationale — preserve v1.4's "size-utility-no-baked-weight" principle (semantic role + presentational layer separable) — is the right read. Renaming `pacific-dusk/50` to `text-secondary` would collapse role and value, exactly what the v1.4 brand-system explicitly rejected. **Confirmed: A is wrong.**
- **Option B (add new BRAND token + scanner rule):** Correct in principle. Aligns with `introduce-cleanup-enforce` rhythm. Preserves opacity utilities for legitimate dark-surface usage. Reversible. **Hex value is wrong**, must be `#3D4658` (or alternate from the verified table) instead of `#4A5568`.
- **Option C (consider): Re-tune `lbta-slate` (#6B6B6B → darker) instead of adding a 13th BRAND color.** `lbta-slate` is already the documented "neutral secondary text" utility (`tokens/lbta-web-tokens.json:46`). Currently 5.02 / 4.69 / 5.33 (AA only on light surfaces). Re-tuning it to `#3D4658` would make it AAA on all light surfaces in one move and avoid adding a 13th brand color. **Cost:** `lbta-slate` is the LBTA_UTIL token, not a brand color — re-tuning shifts its semantic role from "neutral gray" to "tuned dark slate" which conflates utility with brand. **Verdict:** Option B remains the right call (brand-tuned variant, not utility re-tune); just fix the hex.

**Final verdict: option-b-with-corrected-hex.** Proceed with `pacific-dusk-soft` as the 13th BRAND color, hex `#3D4658`, with the codemod-regex tightening from must-fix #3 above.

---

## Decision lenses

### Curve check

The plan's "~90% Curve 1, ~10% Curve 2 (drawer copy line)" framing is **too optimistic on the Curve 2 share.** The CLS investigation (Phase 3.1) is more Curve 2 than the plan implies — diagnosing the actual `/contact` 0.402 shift requires reading the trace, hypothesizing causes, possibly spelunking through three or four candidate components (FacilitiesSection, contact form, ChatWidget injection, font-display), then picking a fix. That is judgment, not grunt. Realistic split: **80% Curve 1, 20% Curve 2 (CLS diagnosis + drawer copy + token-system implications of `-soft` naming).** This shifts the budget but doesn't change the verdict — Tier 1 is still the right shape.

### Survivorship gap

The plan picks the heritage-stat copy swap (Aman pattern) and explicitly defers bottom-sheet, hero-trim, editorial StickyCTA suppression to Tier 2 — the right call. **What the plan still misses:**

- **Production Lighthouse re-run as the source-of-truth bar.** `scorecard.md` §1 explicitly flags dev-mode numbers as diagnostic. The Tier-1 PR will re-run dev-mode Lighthouse, claim "A11y ≥95 on 9 routes" — but if Andrew runs production Lighthouse (`npm run health:prod` + a real `lagunabeachtennisacademy.com` PageSpeed Insights pass) and gets different numbers, the audit's Pass-A 85 target is unverified. Add to Acceptance Criterion 2: "and Andrew runs `npm run health:prod` against production after merge to confirm A11y ≥ 95 in production."
- **Real-device iOS Safari pass on the modal contrast + reduced-motion fix.** The plan's reduced-motion verification is OS-toggle-on-emulator. iOS Safari has documented divergence from desktop Chrome on `prefers-reduced-motion` matchMedia behavior in some iframe / WebView contexts. Punt to Andrew's manual pass per `scorecard.md` §12, but flag it.
- **Heritage-stat A/B against current "(N) players trained."** The plan ships the Aman-pattern swap but assumes (per `2026-04-16-aman-standards-compound-learn.md`) that Andrew's voice approves the change. The 2026-04-16 learning was on `/success-stories` and `/beginner-program` — already shipped — so the precedent is solid. But the drawer is a different surface (always-visible mobile context) where "(N) players trained" might pull more conversion weight than a heritage stat. The plan acknowledges this is Andrew's call but doesn't propose a way to measure post-ship.

### Pre-mortem — top 3 ways this remediation lands and feels like nothing changed

1. **CLS doesn't drop below 0.1 on `/contact` because the SeasonBanner SSR-placeholder fix only addresses 0.097 of the 0.499 score.** The 0.402 shift was uninvestigated, the audit's "0.499 → <0.1" claim becomes "0.499 → 0.402" — visible regression to anyone who looked at the audit. **Mitigation = must-fix #2 above.** The plan's Pre-mortem #2 acknowledges the hypothesis risk but does not prevent it.
2. **The new `pacific-dusk-soft` token gets shipped, the codemod runs cleanly, axe passes — and the inactive season tabs on `/schedules` (the most visible C-3 use case) still measure 6.62:1 and fail AAA.** The audit re-run shows "no critical violations" because axe's `color-contrast` rule defaults to AA threshold (4.5:1), not AAA. The 6.62:1 ratio passes AA, so axe doesn't flag it — but the `.cursorrules` Part 6 bar (AAA 7:1) is unmet on the most-cited surface. Audit re-run looks green; LBTA's chosen brand-quality bar isn't. **Mitigation = must-fix #1 above.**
3. **The codemod over-matches `text-brand-pacific-dusk/65` on a `bg-brand-deep-water` footer subtext and breaks the visual.** Reviewer doesn't notice because the dark-surface diff is subtle and screenshot-sweep at the 7 breakpoints doesn't hit the affected page in a way that surfaces the change. Footer body text suddenly reads at a different brightness on every page. **Mitigation = must-fix #3 above.**

---

## Blockers requiring Andrew's input (that the plan didn't surface)

The plan flagged one Andrew-handoff (drawer heritage-stat copy line, Phase 4.1). Two more should be surfaced before Work-phase begins:

- **Token hex value confirmation.** If the must-fix #1 hex change to `#3D4658` (or alternate) is accepted, Andrew should sign off — this is a brand-color decision (the 13th brand token), not just an engineering one. The hex affects the visual feel of every secondary-text surface in the entire site.
- **Victoria-cove text policy.** Must-fix #4 forces a choice between (a) link-only victoria-cove vs. (b) forbid victoria-cove for any text. This is a brand decision (does victoria-cove keep its "wayfinding accent" role?). One-line answer; should not block Work but needs to be answered before Phase 4.2 codemod.

---

## Suggested next step

**Plan revision pass first**, then `/compound:work`. The two critical findings (token hex + CLS hypothesis) require plan-document edits, not Work-phase improvisation. Specifically:

1. Andrew (15 min): confirm hex value (`#3D4658` recommended) + confirm victoria-cove policy.
2. Plan author (60 min): edit §3 Phase 1 / Phase 3.1, §4 tables, §6 Criteria, §10 Resolution, §11 Confidence, §12 Risks, §13 Gates per must-fixes 1–5.
3. Re-submit for `/compound:review` (lightweight delta-only review on the revised sections, ~15 min).
4. **Then** `/compound:work`.

Total revision overhead: ~90 min before execution. Saves the much larger cost of shipping a plan whose central architectural deliverable doesn't meet its own success criterion, or a CLS fix that doesn't move the score it was designed to move.

If Andrew prefers to proceed with `/compound:work` immediately, the only safe path is to instruct the Work-phase agent to (a) re-verify the hex contrast math against the `tokens/lbta-web-tokens.json` value before committing, and (b) read the actual `lighthouse/contact.report.json` `layout-shifts` data and propose a fix specifically targeted at the 0.402 component before applying anything else from Phase 3.1. Both are extra Work-phase responsibilities the plan should explicitly call out.

---

## Machine-readable summary

```json
{
  "overallScore": 76,
  "byPersona": {
    "scopeCompliance": 88,
    "architectureStrategist": 60,
    "patternRecognizer": 84,
    "simplicity": 78,
    "accessibility": 88,
    "memoryCompliance": 92,
    "regressionHunter": 80,
    "performanceCls": 55,
    "riskPremortem": 75,
    "documentation": 82,
    "verifiability": 75
  },
  "criticalCount": 2,
  "warningCount": 6,
  "noteCount": 5,
  "decision": "needs-revisions",
  "topMustFix": [
    "Replace pacific-dusk-soft hex #4A5568 (fails AAA on sandstone, verified 6.62:1) with #3D4658 (AAA on all light surfaces with margin)",
    "Rewrite Phase 3.1 to address both /contact CLS components (0.402 + 0.097); SeasonBanner-only fix would leave /contact at ~0.402, failing Acceptance Criterion 3",
    "Tighten codemod regex / add manual surface classification to avoid false-positives on dark-surface text-brand-pacific-dusk/{30-70} usages",
    "Decide explicit text-brand-victoria-cove policy (link-only vs. forbid for body); the 'underline-or-font-medium-adjacent' heuristic is too fragile",
    "Use STRICT_BRAND_CHECK=1 npm run tokens:check -- --all (or npm run quality-gate) for verification — without env var, runs non-strict and silently passes warnings"
  ],
  "topShouldFix": [
    "Move Phase 4.3 strict-mode promotion to a follow-up PR (cleaner introduce-cleanup-enforce three-PR sequence per v1.3 learning)",
    "Name explicit rollback steps for Risk A (codemod) and Risk B (CLS) in §12 — both commits are single-purpose and git-revert-able",
    "Add reduced-motion screen recording artifact (motion-verification.mov) to Acceptance Criterion 7",
    "Make the 9-route post-remediation list explicit in delta-report.md header; account for any baseline route omitted",
    "Document the -soft naming convention in the Phase 1 commit body to prevent future suffix sprawl"
  ],
  "tokenForkVerdict": "option-b-confirmed-with-corrected-hex",
  "verifiedHexAlternates": {
    "current_plan_4A5568": { "morning_light": 7.09, "sandstone": 6.62, "salt_air": 7.53, "verdict": "FAILS AAA on sandstone" },
    "recommended_3D4658": { "morning_light": 8.94, "sandstone": 8.34, "salt_air": 9.48, "verdict": "AAA on all (best margin)" },
    "alternate_404C5E": { "morning_light": 8.20, "sandstone": 7.66, "salt_air": 8.70, "verdict": "AAA on all (good margin)" },
    "alternate_3F4A5E": { "morning_light": 8.42, "sandstone": 7.85, "salt_air": 8.93, "verdict": "AAA on all (balanced)" }
  },
  "clsCrossRouteEvidence": {
    "home": { "cls": 0.097, "topShiftSelector": "section#hero" },
    "schedules": { "cls": 0.097, "topShiftSelector": "main#main-content" },
    "book": { "cls": 0.097, "topShiftSelector": "main#main-content" },
    "junior_trial": { "cls": 0.000, "note": "excluded from ConditionalLayout shared block" },
    "contact": { "cls": 0.499, "shifts": [{"score": 0.402, "selector": "footer.bg-brand-deep-water"}, {"score": 0.097, "selector": "footer.bg-brand-deep-water"}], "note": "0.097 is the universal SeasonBanner-attributable shift; 0.402 is unique to /contact and uninvestigated" },
    "about": { "cls": 0.097, "topShiftSelector": "main#main-content" },
    "pathway_planner": { "cls": 0.097, "topShiftSelector": "main#main-content" },
    "thank_you": { "cls": 0.097, "topShiftSelector": "main#main-content" },
    "coaches_andrew_mateljan": { "cls": 0.097, "topShiftSelector": "main#main-content" }
  },
  "blockersForAndrew": [
    "Confirm pacific-dusk-soft hex value (recommended #3D4658) — brand-color decision",
    "Confirm victoria-cove text policy (link-only vs. forbid for body)",
    "Drawer heritage-stat copy line (already flagged in plan §3 Phase 4.1)"
  ]
}
```

---

*Review run by Compound REVIEW phase, 2026-05-13, 11 in-thread personas. Independent verification: WCAG contrast math (Node sRGB→linear pipeline), raw lighthouse JSON parsing across 9 audited routes, package.json script existence, scanner shape, file existence (lib/brand-tokens.test.ts, components/contact/FacilitiesSection.tsx, ConditionalLayout.tsx). No code modified; no plan edits. Output artifact: this document.*
