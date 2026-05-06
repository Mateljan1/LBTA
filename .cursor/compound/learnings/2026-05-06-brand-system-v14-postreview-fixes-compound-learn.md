# Brand System v1.4 — Post-Review Fixes

**Date:** 2026-05-06 PM
**Predecessor:** v1.3 (`2026-05-06-brand-system-v13-eyebrow-migration-compound-learn.md`)
**Trigger:** User asked "did you review and validate your work?" after I claimed v1.3 was complete with only a self-review.
**Result:** 5 parallel review agents found real issues; v1.4 fixes them. Brand system actually locked now.

## What this captured

The user called out that I had skipped formal Review on v1.2 and v1.3, doing only thin self-review and partial validate. They asked me to actually run the rigor. I launched 5 parallel review agents (correctness, project-standards, pattern, simplicity, maintainability) on the v1.2+v1.3 diff. They converged on 5 critical findings, several of which directly contradicted the v1.3 "locked in" claim.

This v1.4 commit fixes all the criticals.

## What the reviewers caught (and v1.4 fixed)

### 1. The eyebrow regex had 4 escape hatches → only some patterns were actually caught

The v1.3 regex required `class(?:Name)?=["'`]` prefix AND `tracking-[…]` arbitrary value. Real codebase patterns that escaped:
- `tracking-widest` / `tracking-wider` named utilities (~29 instances across coach pages, CoachCard, PrivateCoachingSection)
- Template-literal JSX expression form: `className={\`...\`}` (~10 instances)
- String literals in const declarations and ternaries (~3-5 instances)

**v1.4 fix:** Rewrote the scan to walk EVERY string literal (single, double, backtick) inside .tsx files and check if it contains all three eyebrow markers. Added `min-h-[48px]` button-context exclusion (touch target = button, not eyebrow label).

### 2. The eyebrow regex over-matched into buttons → 30+ CTAs silently became eyebrows

The v1.3 mass migration converted Book/Reserve/Register button labels to `text-eyebrow` because they shared the eyebrow shape (`text-[Npx] uppercase tracking-[Nem]`). The regex didn't distinguish "button label that happens to be uppercase tiny tight" from "section eyebrow above heading."

**v1.4 fix:** Introduced `text-button` (0.7rem, 0.18em, weight 500) and `text-button-sm` (0.65rem, 0.16em, weight 600) utilities in `tailwind.config.ts`. Migrated 39 button-context callsites from `text-eyebrow*` → `text-button*`. The new scan excludes button contexts via the `min-h-[48px]` heuristic so this can never recur.

### 3. `.text-eyebrow` font-weight contract was silently broken

The Tailwind utility had `fontWeight: 600` baked into the size config. Migration sites with `font-medium` actually rendered at 500 (utility wins via cascade), sites with `font-bold` rendered at 700, sites with no explicit weight class went 400 → 600. **Same component class, three different rendered weights.**

**v1.4 fix:** Removed `fontWeight` from the `text-eyebrow` and `text-eyebrow-sm` config entries. Callers must specify (`font-medium`/`font-semibold`/`font-bold` etc.). The v1.4 migration adds `font-semibold` to any newly-surfaced eyebrow that lacked an explicit weight, preserving the previous 600 default behavior.

### 4. `.text-eyebrow` was double-defined — cascade-flip footgun

`app/globals.css` had a components-layer `.text-eyebrow` setting color + uppercase. `tailwind.config.ts` had a utilities-layer version setting neither. Tailwind layers mean utilities win, so the components-layer block was dead code — but if anyone changed `@layer` order or imported globals.css differently, color would silently switch.

**v1.4 fix:** Deleted the components-layer block from `globals.css`. Single source of truth: `tailwind.config.ts`. Replaced with a comment pointing to the docs.

### 5. The audit doc contradicted itself

`docs/brand-page-audit-2026-05-06.md` had v1.2 per-page tables claiming 🟠/🔴 drift while the v1.3 headline said "Cleanup status: COMPLETE." Mixed "202" and "230" counts unreconciled. Listed `/` as 🟢 then admitted "Actually 🟡 — see below; listed here in error."

**v1.4 fix:** Rewrote the doc top-to-bottom from current state. All 39 routes now show 🟢 with notes. Reconciled count semantics ("230 textual replacements" vs "202 detected drift instances"). Added "Acknowledged visual changes" section flagging the tracking-standardization that v1.3's commit message glossed over.

### 6. ~430 LOC of dead/stale code/docs

Simplicity reviewer identified:
- `brandHex()` + `BRAND_BY_KEBAB` — zero callers
- `--report` flag with empty per-category sections (kept the writer but only emit sections with hits, ~80 LOC trimmed in practice via behavior change)
- `handRolledSectionPaddingRegex` — zero hits ever (pure YAGNI)
- Stale `docs/brand-page-audit-2026-05-06.md` (~130 lines)

**v1.4 fix:** Deleted `brandHex()` + `BRAND_BY_KEBAB` from `scripts/build-tokens.ts` (~47 LOC). Deleted `handRolledSectionPaddingRegex` (~10 LOC). Made the report writer emit only non-empty sections. Rewrote the audit doc.

## Patterns to repeat (lessons from this loop)

### A. "Did you review?" deserves data, not reassurance

When the user pushed back on whether I actually reviewed/validated v1.2 and v1.3, the right answer was to admit the gap, then fix it by actually running the rigor. Self-review on v1.1 was honest; skipping review on v1.2 and v1.3 was sloppy and I should have flagged it explicitly at the time.

**Pattern:** When you skip a step the prescribed workflow calls for, surface that decision IN the response. Don't quietly omit it. If it turns out to matter (it did here), the user catches it later and trusts you less.

### B. Mechanical migrations need conservative pattern boundaries, not maximal ones

The v1.3 eyebrow migration script matched on shape (text size + uppercase + tracking) without considering context (button vs label). The reviewers caught what testing didn't. The fix isn't smarter regex alone — it's adding context heuristics (`min-h-[48px]` for buttons) AND introducing a separate utility (`text-button`) for the legitimate use case the migration accidentally collapsed into the eyebrow utility.

**Pattern:** Before mass-migrating, ask: "is this pattern semantically uniform, or am I conflating two roles?" If two roles, introduce two utilities and migrate each separately.

### C. Strict-mode promotion needs the regex to be airtight, not just present

I promoted the eyebrow scan to strict in v1.3. The promotion was valid for the patterns the regex caught. But the regex had escape hatches (named tracking utilities, JSX template literals), so strict-mode was technically passing while real drift remained — the worst possible state because it falsely signaled completeness.

**Pattern:** Before promoting a guardrail to strict, write fixture tests that prove it catches the patterns it claims to catch. A small "known-bad" test file that the checker MUST flag would have caught the regex gaps in v1.3 before they shipped.

### D. Parallel review agents earn their cost on judgment-heavy diffs

I argued in v1.3 that the migration was Curve 1 mechanical and didn't need parallel review. **I was wrong.** The migration looked mechanical but had real design judgment baked in (button vs label, font-weight defaults, tracking standardization) that only a real review surfaced. The strict checker + tests + visual sample were necessary but not sufficient.

**Pattern:** Mass migrations involving design system primitives ALWAYS need parallel review, even when the transform is regex-driven. The judgment isn't in the regex — it's in deciding what "eyebrow" means and which patterns count.

### E. Showcase pages should pass their own strict checks

When I added the system-utility-color section to `/brand` in v1.2, my first version hardcoded the 4 hex values. The strict checker caught it immediately ("4 raw hex literals in app/brand/page.tsx"). The fix was to import `LBTA` constants. **The showcase IS the system's most-stakes example. If it can't follow its own rules, the rules are broken.** This was a v1.2 learning that should have prepared me to expect more of these in v1.3 — but didn't.

**Pattern:** Anytime you write/extend a showcase or canonical example page, it should pass the strictest version of every rule you're documenting. If it can't, the rule needs to flex.

## Anti-patterns

### F. Don't claim "deleted via git log" when the file was never committed

The v1.3 doc claimed `migrate-eyebrows.ts` was "discoverable via git log" — but the script was deleted in the same commit that used it without being committed first. So `git log` shows neither A nor D for the file. **The pattern doc lies.** Reviewers caught this.

**Pattern:** If you delete a one-shot tool in the same commit that uses it, either commit-then-delete it in two separate commits (so `git log` shows A→D) OR change the wording to "the script lived only during the migration; not preserved."

### G. Don't ship guardrails that pass-but-don't-actually-enforce

The v1.3 strict-mode promotion was passing builds while ~30 hand-rolled patterns existed in the codebase. Documentation said "STRICT CI ENFORCES all 8 categories." Code said "totalWarnings = rawHex + arbitraryTailwind + inlineGradient + handRolledEyebrow" (no `legacyLbta`, no `handRolledSectionPadding`). That's two categories silently informational while the docs claim they're enforced.

**Pattern:** Wire every category the docs claim into the strict tally. If a category should be informational-only, document it as such — don't sneak it past via incomplete summation.

## Corrections (for `corrections.jsonl`)

```jsonl
{"timestamp": "2026-05-06T22:00:00Z", "original": "Skipping formal Review/Validate phases on Curve 1 mechanical changes and not surfacing the decision", "correction": "Always state explicitly when you're using self-review instead of parallel agents. The user can then push back if they want the rigor (they often will, and they were right to).", "keywords": ["compound", "review", "validate", "process"], "project": "lbta-website"}
{"timestamp": "2026-05-06T22:00:00Z", "original": "Mass-migrate based on regex shape match without distinguishing semantic roles (button vs label)", "correction": "Before mass migration, list the semantic roles that share the surface shape. Introduce a separate utility per role. Add context heuristics to the matcher (e.g. min-h-[48px] = button context, exclude from eyebrow scan).", "keywords": ["migration", "tailwind", "design-system"], "project": "lbta-website"}
{"timestamp": "2026-05-06T22:00:00Z", "original": "Promote a CI guardrail to strict mode without fixture tests that prove the matcher catches what it claims", "correction": "Before flipping any new scan to strict, add fixture tests: 5+ known-bad patterns the matcher must flag, 5+ known-good patterns it must not flag. Catches regex escape hatches before they ship.", "keywords": ["ci", "guardrails", "testing"], "project": "lbta-website"}
{"timestamp": "2026-05-06T22:00:00Z", "original": "Bake font-weight into a Tailwind size utility, then mass-migrate ad-hoc patterns to that utility", "correction": "Size utilities should set size + line-height + letter-spacing only. Font-weight is semantic per callsite. Baking weight into the size silently overrides callers that don't add explicit weight, and silently loses to callers that do (depending on cascade order). Strip the baked weight; require explicit font-* at every callsite.", "keywords": ["tailwind", "design-system", "typography"], "project": "lbta-website"}
{"timestamp": "2026-05-06T22:00:00Z", "original": "Wire some scan categories into strict-mode totals but not others without documenting which are which", "correction": "Every category the docs claim is strict-enforced must be in the totalWarnings/totalErrors sum. If a category is intentionally info-only, document it explicitly in the rule docs as 'informational; does not block CI.'", "keywords": ["ci", "guardrails", "documentation"], "project": "lbta-website"}
```

## Patterns (for `patterns.json`)

- **two-utilities-per-shape** — When a CSS pattern (e.g. small uppercase tracked text) serves two semantic roles (e.g. label vs button), introduce two utilities (`text-eyebrow`, `text-button`) so the design system can distinguish them. The mass migration script then uses a context heuristic (e.g. `min-h-[48px]`) to route correctly.
- **fixture-tests-before-strict-promotion** — New CI guardrails get a fixture test suite (known-bad patterns must flag, known-good patterns must not) before being promoted to strict mode. Catches regex escape hatches before they ship as false-green.
- **size-utility-no-baked-weight** — Tailwind size utilities (`fontSize` config entries) should set size + line-height + letter-spacing, NOT font-weight. Weight is per-callsite semantic; baking it in causes silent regressions when callers don't add explicit weight.
- **string-literal-scan-not-attribute-scan** — When auditing CSS class patterns in JSX, scan EVERY string literal (single, double, backtick) — not just `class(?:Name)?=["'`]`. Catches template literals, const declarations, ternary branches.

## Standards (for `quality-bars.json`)

- **Mass migrations across design-system primitives:** Always trigger parallel review (5 agents minimum: correctness, project-standards, pattern, simplicity, maintainability) regardless of how mechanical the transform looks. The judgment is in the boundaries, not the transform.
- **Curve 1 vs Curve 2 self-classification:** When skipping a workflow step, state the decision and reasoning IN the response. The user gets to push back. Don't quietly omit.
- **Showcase pages:** Must pass the strictest version of every rule they document. If they can't, the rule needs to flex.
- **One-shot migration tools:** Either commit-then-delete in two separate commits (so `git log` shows A→D and the script is recoverable), OR document explicitly that the script was not preserved.

## Final brand audit state — v1.4 (verified)

```
✅ Forbidden contrast errors:        0
✅ Raw hex literals:                 0
✅ Arbitrary Tailwind colors:        0
✅ Inline gradient hex literals:     0
✅ Forbidden fonts (app code):       0
✅ Deprecated lbta-* classes:        0   (now strict-enforced; was warning-only in v1.3)
✅ Hand-rolled eyebrow patterns:     0   (regex tightened; ~30 previously-missed patterns migrated)

Strict CI: ENFORCES all 7 categories
Drift detector test: PASSING (3 tests)
Showcase route: LIVE at /brand with new utility-color section
New utility: text-button / text-button-sm for CTAs (replaces 39 button over-migrations)
```

## What's actually next

Brand system is now genuinely closed (v1.3 was premature; v1.4 is the real lockdown). Queued plans unchanged:

1. `plans/2026-05-06-mobile-responsive-sweep-plan.md`
2. `plans/2026-05-06-transaction-email-brand-audit-plan.md`
3. `plans/2026-05-06-seo-schema-audit-plan.md`

The maintainability reviewer also flagged 4 lower-urgency follow-ups not addressed in v1.4:
- Drift detector should also cover `generated/tokens.{tailwind.json,css}` (M-5)
- Document escape-hatch process for legitimate exceptions (M-6)
- Move deprecation list into `tokens/lbta-web-tokens.json` instead of 3 places (M-7)
- Split `LBTA` exports into `LBTA_UTIL` + `LBTA_LEGACY` with `@deprecated` JSDoc

These are real but non-blocking. Pick them up in a future maintenance session.
