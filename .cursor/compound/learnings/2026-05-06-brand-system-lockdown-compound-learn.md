# Brand System Lockdown — Compound Learnings

**Date:** 2026-05-06
**Plan:** `plans/2026-05-05-brand-system-lockdown-audit.md`
**Commit:** `ddd76e6`
**Result:** 32+ violations → 0; strict CI on; visual showcase live

## What worked (patterns to repeat)

### 1. Scripted baseline before any code change

Captured the exact violation counts (`tokens:check --all`) into a dated audit report **before** writing the plan. The numbers (18 contrast errors + 14 hex warnings) made the plan concrete and the success criteria objective. Without that baseline, "audit the brand system" becomes vibes-driven; with it, every step has a measurable target.

**Pattern:** For any audit-style task, the first commit in the plan should be the baseline report. Writing it forces the checker to be sharp.

### 2. Generated TS constants alongside generated CSS/Tailwind

The token pipeline already emitted `generated/tokens.tailwind.json` and `generated/tokens.css`. Adding `lib/brand-tokens.ts` to the same `scripts/build-tokens.ts` script (with kebab-to-camelCase helper + JSDoc + `brandHex()` lookup) gave TS code a typed import path without creating a parallel source of truth. **One generator, three outputs, one truth.**

**Pattern:** When TS code needs to reference design tokens (charts, canvas, computed colors), don't import the JSON directly and don't hardcode hexes — extend the existing token generator to emit a typed module.

### 3. Showcase route doubles as visual regression test

`/brand` renders every token via Tailwind classes and CSS vars. If a token name changes in the JSON, the page won't compile. If a CSS var disappears, the page renders broken. The showcase IS a visual smoke test — no separate visual regression infra needed.

**Pattern:** Internal showcase routes (noindex, robots:false) provide more value than they cost. They onboard collaborators, expose drift visually, and turn the design system into a teachable artifact.

### 4. WARN→ERROR migration pattern (strict mode flip)

The checker shipped in WARN mode for months so unrelated PRs didn't break. Once Phase 3 fixed all known violations, flipping `STRICT_BRAND_CHECK=1` in `quality-gate` was a one-line change. Doing the flip AFTER the cleanup (not before) avoided breaking active feature branches.

**Pattern:** When introducing a new linter/guardrail to a live codebase: (1) ship in warn mode, (2) fix all known violations in a coordinated sweep, (3) flip to error mode in the same PR or immediately after. Never flip first — it blocks unrelated work and creates pressure to disable the check.

### 5. Two-test guardrail (drift + zero-violations)

`lib/brand-tokens.test.ts` has two distinct assertions:
- **Per-token equality** — every `BRAND.*` constant matches the JSON source. Catches stale generated files.
- **Zero-violations** — runs the full checker programmatically and asserts exit 0. Catches new drift the moment it's introduced.

Together they make it impossible for the system to silently drift between commits.

**Pattern:** Drift detectors should be thin (read source, read generated, assert equality). They're cheaper than reviewing every diff.

### 6. Tailwind arbitrary-value syntax for CSS-var backgrounds

`bg-[image:var(--horizon-vertical)]` and `bg-[linear-gradient(to_right,transparent_50%,var(--brand-deep-water)_100%)]` let us replace inline `style={{ background: ... }}` with className-based access to CSS vars. Underscores serve as spaces in arbitrary values. This kept the CSS in CSS while letting components stay declarative.

**Pattern:** When you'd reach for an inline `style={{ background: 'linear-gradient(...)' }}`, try `bg-[linear-gradient(...)]` with underscores first. Keeps the token system intact.

## What to avoid (anti-patterns)

### A. Inline gradient hex literals

`style={{ background: 'linear-gradient(to bottom, #2E8B8B, #E8834A, #C4963C)' }}` bypasses both the token system and any future palette change. Even when the colors are "the right" colors, hardcoding them disconnects the component from the source of truth.

**Always:** Use `var(--horizon)` / `var(--horizon-vertical)` / extend `tokens/lbta-web-tokens.json` and use a className with a CSS var.

### B. Arbitrary Tailwind colors as a "quick fix"

`bg-[#0a1628]` looks like a clever Tailwind shortcut but it's a token-system bypass. The fix in this case revealed a missing token (`brand-deep-card`) — adding it to the JSON solved the bypass AND surfaced a real semantic distinction (deeper-than-deep-water, used for elevated cards on light pages).

**Always:** When tempted to use `bg-[#…]`, ask "is this a missing token?" and add it to the JSON instead.

### C. `text-white/40` and `text-white/25` on dark surfaces

These fail WCAG 7:1 on `bg-brand-deep-water` (and most dark surfaces). They feel "subtle" in design but they're inaccessible for users with anything less than perfect vision in good lighting. Use `text-white/55` minimum for body, `/65–/75` for eyebrows, `/80–/90` for primary copy.

**Already in `.cursorrules` Part 14, now also enforced by CI in strict mode.**

### D. Gold-plating reviews on Curve 1 mechanical changes

This work was Curve 1 (deterministic, mechanically verifiable). I considered launching 4 parallel review agents, then stopped — `tokens:check`, the Vitest test, the strict build, and the visual smoke test had already proven correctness. Self-review against a structured rubric was the right call. **Saved ~30 min of agent latency for ~0 marginal information gain.**

**Decision lens:** For Curve 1 work where success is mechanically verifiable, prefer self-review against the standard rubric over parallel agent reviews. Reserve parallel reviews for changes where judgment-not-tests is the bottleneck (auth flows, API contracts, UX hierarchy).

## Corrections (for `corrections.jsonl`)

```jsonl
{"timestamp": "2026-05-06T19:00:00Z", "original": "Inline style with hex gradient (style={{ background: 'linear-gradient(... #...)' }})", "correction": "Use Tailwind arbitrary value bg-[image:var(--horizon-vertical)] or bg-[linear-gradient(...,var(--brand-...))], OR add a CSS class to globals.css that uses var(--horizon)", "keywords": ["brand", "horizon", "gradient", "tokens"], "project": "lbta-website"}
{"timestamp": "2026-05-06T19:00:00Z", "original": "Hardcoding '#XXXXXX' in TS logic (e.g. getAccentColor returning '#E8834A')", "correction": "Import { BRAND } from '@/lib/brand-tokens' and use BRAND.sunsetCliff. The TS module is generated from tokens/lbta-web-tokens.json by scripts/build-tokens.ts.", "keywords": ["brand", "tokens", "typescript", "hex"], "project": "lbta-website"}
{"timestamp": "2026-05-06T19:00:00Z", "original": "Arbitrary Tailwind color values like bg-[#0a1628]", "correction": "Add the color to tokens/lbta-web-tokens.json and use the generated brand-* class (e.g. bg-brand-deep-card). If the color is a one-off, ask whether it should be a token first.", "keywords": ["brand", "tailwind", "tokens"], "project": "lbta-website"}
```

## Patterns (for `patterns.json`)

- **token-pipeline-with-typed-emit** — Single generator script (`scripts/build-tokens.ts`) reads canonical JSON and emits Tailwind config + CSS vars + typed TS constants. Components consume whichever fits their context (className / inline style / TS logic) without creating parallel sources of truth.
- **showcase-as-visual-test** — Internal `/brand` (or equivalent) route renders every token, type scale, and component variant. Doubles as drift detector (won't compile if tokens move) and onboarding artifact.
- **warn-then-strict-flip** — Ship a new code-quality guardrail in WARN mode, fix all known violations in a coordinated sweep, then flip to ERROR mode in the same PR. Never the reverse.
- **drift-detector-test** — Vitest test that (1) reads source-of-truth and generated artifact, asserts equality, and (2) runs the project's quality checker programmatically and asserts exit 0. Cheap to write, prevents silent drift.

## Standards (for `quality-bars.json`)

- **Brand hex literals:** Forbidden in `app/` and `components/`. TS uses `BRAND` from `lib/brand-tokens.ts`; CSS uses `var(--brand-…)`; Tailwind uses generated `brand-*` classes.
- **Arbitrary Tailwind colors:** Forbidden (`bg-[#…]`, `text-[#…]`, etc.). Extend `tokens/lbta-web-tokens.json` instead.
- **Dark-surface text contrast:** Body ≥ `text-white/55`, eyebrows `/65–/75`, primary copy `/80–/90`. Never `/40` or `/25`.
- **Audit reports:** Date-stamped, before/after counts, runnable reproduction steps. `docs/brand-audit-YYYY-MM-DD.md`.
- **CI gates:** `quality-gate` script runs in strict mode; new guardrails should fail builds, not warn.

## Follow-ups queued

- **Mobile responsive sweep** — verify every fixed component (RegistrationModal, ProgramPathwayCard, schedules/ProgramCard, MethodSection) at 320/375/768/1024/1440. Likely small touch-target / wrap fixes.
- **Transaction email brand audit** — `assets/emails/*.html`, `lib/email.ts`. Audit color/font compliance with the brand system; the email runtime needs different rules (inline styles, fallback fonts) but the brand should still be consistent.
- **SEO/schema audit** — `app/schema.tsx`, `app/sitemap.ts`, every page's `metadata`. JSON-LD coverage, OpenGraph image audit, meta description quality, canonical URLs.

These were aspirational scope from the original `/compound:full` request. Each gets its own `/compound:plan` so they don't dilute the brand-system focus.
