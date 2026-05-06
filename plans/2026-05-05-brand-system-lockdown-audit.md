# Brand System Lockdown & Audit — Implementation Plan

**Created:** 2026-05-05
**Status:** Awaiting approval
**Curve:** Mostly Curve 1 (mechanical audit + fixes) with a Curve 2 polish pass on visual hierarchy

---

## Overview

Audit every surface of the LBTA website against the Brand Kit + Brand Guide v2.1, fix the drift we already know about (32+ confirmed violations), build a single visual showcase route that proves the system is locked in, then upgrade the guardrails so future drift can't sneak in. End state: one brand source of truth → one set of tokens → every component uses them → CI blocks regressions.

## Problem Statement

The brand system is **architected well but enforced softly**, and there is real drift in production code:

- **Token pipeline exists** (`tokens/lbta-web-tokens.json` → `generated/tokens.{tailwind.json,css}`), wired through `tailwind.config.ts` and `app/globals.css`, with `npm run quality-gate` running `tokens:build` + `tokens:check` before build/lint.
- **Brand Guide v2.1 already integrated** (`--horizon`, `.section-quote`, `.section-horizon`, `HorizonDivider`) — see completed `plans/apply-brand-guide-to-website-plan.md`.
- **But:** The guardrail (`scripts/check-brand-usage.ts`) runs in **warning mode** (only `STRICT_BRAND_CHECK=1` blocks), and the live `--all` scan finds:
  - **18 forbidden `text-white/40` errors** (RegistrationModal: 13, ProgramPathwayCard: 4, schedules/ProgramCard: 1) — fails WCAG 7:1 on `bg-brand-deep-water`.
  - **14 raw hex warnings** (MethodSection, ProgramPathwayCard, schedules/ProgramCard) — bypassing the token system.
  - **~21 additional `text-white/(10..35)` hits** not yet on the forbidden list but worth scrutinizing on dark surfaces.
  - **Inline `style={{ background: 'linear-gradient(#…,#…)' }}`** instead of `var(--horizon)`.
  - **`bg-[#0a1628]` arbitrary Tailwind values** instead of `bg-brand-deep-water` (or a defined deep-card token).
- **No visual showcase** to verify the system holistically; no screenshot regression; no type-safe brand enum at the component layer.

The user's goal: **"Got it locked in! Polished, beautiful!"** Translation: every component uses the system, the system is visually proven, and the system can't drift.

## Proposed Solution

Five-phase lockdown: **(1) Inventory & baseline report → (2) Tighten guardrails → (3) Fix all known drift → (4) Build a `/brand` showcase route → (5) Lock it in (strict CI + docs + tests)**.

Architecture decisions:

- **Single source of truth stays put** — `tokens/lbta-web-tokens.json` remains the only place hexes live. (Source: existing `docs/brand-token-system.md`, COMPOUND_LEARN.)
- **Add a typed brand-token module** (`lib/brand-tokens.ts`) that re-exports the same JSON as TS constants so component logic (e.g. `getAccentColor`) can reference `BRAND.victoriaCove` instead of `'#2E8B8B'`. (Source: Best Practices Researcher — pattern from Vercel, Stripe design systems.)
- **Replace inline gradients with CSS variables** — `var(--horizon)` and a new `--deep-card` token for the cinematic dark card surface, both already conceptually defined in `globals.css`.
- **Block, don't warn** — set `STRICT_BRAND_CHECK=1` in `quality-gate` once known drift is fixed; expand the checker to flag arbitrary Tailwind colors (`bg-[#…]`, `text-[#…]`) and forbidden font names (`Inter`, `Roboto`, `Arial`, `Space Grotesk`, `Playfair`, `Work Sans`, `Helvetica`).
- **`/brand` showcase route** — internal-facing page (linked from footer in dev, hidden in production via env flag, or just discoverable) that renders every token, font scale, button, card, accent, and horizon treatment. This is the deliverable the user can look at and say "yes, locked in."
- **Vitest snapshot of the audit report** — small test that runs the checker programmatically and snapshots the violation count at zero, so a new violation breaks CI.

No change to data sources (`/data/*.json`), no duplicate content, no hardcoded prices.

## Implementation Steps

### Phase 1 — Inventory & baseline report (audit deliverable)

- [ ] 1.1: Run `npm run tokens:check -- --all` and capture the full output to `docs/brand-audit-2026-05-05.md` as a baseline.
- [ ] 1.2: Extend `scripts/check-brand-usage.ts` with three new scans (no failure yet, just collection):
  - Arbitrary Tailwind hex values: `bg-\[#…\]`, `text-\[#…\]`, `border-\[#…\]`, `from-\[#…\]`, `to-\[#…\]`, `via-\[#…\]`.
  - Forbidden font families in source: `Inter`, `Roboto`, `Arial`, `Space Grotesk`, `Playfair`, `Work Sans`, `Helvetica` (skip `lib/email.ts` — emails legitimately fall back).
  - Inline `style={{ background: 'linear-gradient(...)' }}` containing a `#` literal (signal for un-tokenized gradients).
- [ ] 1.3: Add `--report` flag that emits `docs/brand-audit-2026-05-05.md` with: counts by category, files-by-violation table, and a "first 10 lines per file" snippet for fast triage.
- [ ] 1.4: Inventory pass: walk every `app/**/page.tsx` (45 pages) + every dark-section component (`bg-brand-deep-water`, `bg-black`, `.utr-cinematic-shell`) and list each in the audit report under "✅ on-system / ⚠ minor drift / ❌ violations" using the script output as ground truth. (Mostly a script-driven view — no per-page manual edits in this phase.)

### Phase 2 — Tighten guardrails (prevent new drift)

- [ ] 2.1: Add `lib/brand-tokens.ts` that imports `tokens/lbta-web-tokens.json` and exports typed constants:
  ```ts
  export const BRAND = { pacificDusk: '#1B3A5C', deepWater: '#0F2237', … } as const
  export type BrandToken = keyof typeof BRAND
  ```
  Add to `scripts/build-tokens.ts` so it stays generated alongside CSS/Tailwind outputs (single source of truth preserved).
- [ ] 2.2: Add `--deep-card: #0A1628` (or alias `--deep-card: var(--brand-deep-water)` if visually identical) to `tokens/lbta-web-tokens.json` and re-run `tokens:build`. Add `bg-brand-deep-card` to Tailwind via the generated tokens.
- [ ] 2.3: Document `BRAND` import pattern in `docs/brand-token-system.md`: "When you need a hex in TS logic (e.g. computed accent), import from `lib/brand-tokens.ts`. Never hardcode."

### Phase 3 — Fix all known drift

- [ ] 3.1: **`components/schedules/ProgramCard.tsx`**:
  - Replace `getAccentColor` hardcoded hexes (lines 61-66) with `BRAND.victoriaCove`, `BRAND.thousandSteps`, `BRAND.sunsetCliff`, `BRAND.tidePool` from `lib/brand-tokens.ts`.
  - Replace `bg-[#0a1628]` (lines 120, 231, 239) with `bg-brand-deep-card`.
  - Replace inline `style={{ background: 'linear-gradient(to bottom, #2E8B8B, #E8834A, #C4963C)' }}` (line 113) with `className="… bg-[var(--horizon)]"` (vertical variant: add `--horizon-vertical` token if needed).
  - Replace the single `text-white/40` (line 202) with `text-white/55` or `text-white/60`.
- [ ] 3.2: **`components/programs/ProgramPathwayCard.tsx`**:
  - Replace inline horizon gradient hexes (line 113) with `var(--horizon)` via a CSS class (use `bg-[var(--horizon)]` Tailwind arbitrary or add `.horizon-bar-vertical` utility).
  - Replace 4× `text-white/40` (lines 133, 146, 158, 172) with `text-white/55` (eyebrow labels) or `text-white/65` (secondary text).
- [ ] 3.3: **`components/programs/MethodSection.tsx`**: Replace `#0F2237` literal with `BRAND.deepWater` (TS) or `var(--brand-deep-water)` (CSS-in-JS).
- [ ] 3.4: **`components/RegistrationModal.tsx`** (largest contrast violation — 13 hits): Audit each `text-white/40` in context. Eyebrow labels → `text-white/60`, body copy → `text-white/75`, helper/footnote → `text-white/55`. Verify in browser MCP that all text remains readable on the modal's dark backdrop.
- [ ] 3.5: Sweep other `text-white/(10|15|20|25|30|35)` hits in: `HomeHero.tsx`, `utr-tracker/UtrLeaderboard.tsx`. Decide per-instance: decorative dividers may stay low-opacity; any text content moves to `≥/55`.
- [ ] 3.6: Run `scripts/fix-deprecated-tokens.ts` once to mop up any lingering `lbta-primary | lbta-coral | lbta-coral-dark | lbta-bone` from recently-modified files.
- [ ] 3.7: Re-run `npm run tokens:check -- --all`; confirm zero `ERROR` lines and decide which `WARN` lines are acceptable (e.g. legitimate gradient fallbacks).

### Phase 4 — `/brand` visual showcase route

- [ ] 4.1: Create `app/brand/page.tsx` — internal brand showcase. Sections:
  - **Color tokens** — swatch grid for all 11 `brand-*` colors, each with name + hex + Tailwind class + CSS var. Render contrast-against-white and contrast-against-deep-water badges.
  - **Typography** — every scale (`text-display-xl` → `text-eyebrow-sm`) with sample text, font family label, weight, line-height.
  - **Buttons** — `.btn-primary`, `.btn-accent`, `.btn-secondary`, `.btn-ghost`, `.btn-cove`, `.btn-pill-primary`, `.btn-pill-secondary`, `.btn-horizon` with all states (hover via screenshot note).
  - **Cards** — `.card`, `.card-flat`, `ProgramCard`, `ProgramOverviewCard`, `CoachCard` (light + dark surface).
  - **Accents** — `HorizonDivider`, `.section-quote`, `.section-horizon`, `.divider`, `.divider-gold`, `--horizon` line in 3 thicknesses.
  - **Surfaces** — `bg-brand-morning-light`, `bg-brand-sandstone`, `bg-brand-deep-water`, `bg-brand-deep-card`, `.utr-cinematic-shell`.
- [ ] 4.2: Add a sticky "Brand Compliance" header at the top of `/brand` with three live-rendered badges: token errors (from JSON-output scan), token warnings, last-audited date. Pulls from `docs/brand-audit-2026-05-05.md` metadata or runs the checker on demand in dev.
- [ ] 4.3: Add `noindex` meta + only render in dev/preview unless `?show=1` (so it stays internal but reachable).
- [ ] 4.4: Verify with browser MCP at 320 / 768 / 1440 — every section renders without horizontal scroll, contrast is right, fonts loaded.

### Phase 5 — Lock it in (CI + tests + docs)

- [ ] 5.1: After Phase 3 confirms zero errors, change `npm run quality-gate` to set `STRICT_BRAND_CHECK=1` so any future `text-white/(25|40)` (and any new forbidden classes added later) blocks build.
- [ ] 5.2: Add `__tests__/brand-system.test.ts` (Vitest):
  - Imports `lib/brand-tokens.ts` and asserts every `BRAND.*` value matches `tokens/lbta-web-tokens.json` (drift detector between TS + JSON).
  - Runs `scripts/check-brand-usage.ts` programmatically with `--all` and asserts `forbiddenHits.length === 0`.
- [ ] 5.3: Update `docs/brand-token-system.md` with: the new strict mode behavior, the `BRAND` TS import pattern, the `/brand` showcase route, and the audit report path.
- [ ] 5.4: Update `.cursorrules` Part 7 (Color Tokens) and Part 14 (Forbidden Patterns) to add: "All hex values in TS must come from `lib/brand-tokens.ts`. Arbitrary Tailwind colors (`bg-[#…]`) are forbidden — extend the token system instead."
- [ ] 5.5: Capture learnings in `.cursor/compound/learnings/` (compound:learn afterwards).

## Files to Create/Modify

| File | Action | Purpose |
|------|--------|---------|
| `tokens/lbta-web-tokens.json` | Modify | Add `--deep-card` (and any vertical-horizon variant if used) |
| `scripts/build-tokens.ts` | Modify | Also emit `lib/brand-tokens.ts` typed constants |
| `scripts/check-brand-usage.ts` | Modify | Add scans for arbitrary Tailwind colors, forbidden fonts, inline-gradient hexes; add `--report` flag |
| `lib/brand-tokens.ts` | Create | Generated TS constants for component logic |
| `docs/brand-audit-2026-05-05.md` | Create | Baseline + final audit report |
| `docs/brand-token-system.md` | Modify | Document strict mode, TS pattern, showcase route |
| `.cursorrules` | Modify | Forbid arbitrary `bg-[#…]`; require `lib/brand-tokens.ts` |
| `app/brand/page.tsx` | Create | Visual showcase / compliance dashboard |
| `app/brand/BrandShowcase.tsx` | Create | Client component for showcase sections |
| `components/schedules/ProgramCard.tsx` | Modify | Replace 14+ hex literals + 1 forbidden contrast |
| `components/programs/ProgramPathwayCard.tsx` | Modify | Replace 3 hex literals + 4 forbidden contrast |
| `components/programs/MethodSection.tsx` | Modify | Replace 1 hex literal |
| `components/RegistrationModal.tsx` | Modify | Replace 13 forbidden contrast violations |
| `components/HomeHero.tsx`, `components/utr-tracker/UtrLeaderboard.tsx` | Modify (audit only) | Triage `text-white/(10..35)` per-instance |
| `app/globals.css` | Modify (small) | Optional `.horizon-bar-vertical` and/or `--horizon-vertical` if Phase 3.1 needs it |
| `package.json` | Modify | Set `STRICT_BRAND_CHECK=1` in `quality-gate` script |
| `__tests__/brand-system.test.ts` | Create | Vitest guardrail test |

```yaml
create:
  - lib/brand-tokens.ts
  - docs/brand-audit-2026-05-05.md
  - app/brand/page.tsx
  - app/brand/BrandShowcase.tsx
  - __tests__/brand-system.test.ts
modify:
  - tokens/lbta-web-tokens.json
  - scripts/build-tokens.ts
  - scripts/check-brand-usage.ts
  - docs/brand-token-system.md
  - .cursorrules
  - components/schedules/ProgramCard.tsx
  - components/programs/ProgramPathwayCard.tsx
  - components/programs/MethodSection.tsx
  - components/RegistrationModal.tsx
  - components/HomeHero.tsx
  - components/utr-tracker/UtrLeaderboard.tsx
  - app/globals.css
  - package.json
```

## Out of scope (this plan)

- **No copy/voice changes** — that's the lbta-messaging skill's job, not this audit.
- **No layout/spacing redesign** — we're auditing brand fidelity, not redesigning components.
- **No new component creation** beyond `app/brand/*` (the showcase). If audit reveals a missing component primitive, add to a follow-up.
- **No font swaps** — Cormorant + DM Sans stay.
- **No image/asset audit** — separate `/assets` audit lives in another plan.
- **No email template changes** — emails have their own brand rules and live in `assets/emails/` (lib/email.ts is intentionally outside the strict scan).
- **No `STRICT_BRAND_CHECK` flip until Phase 3 is green** — flipping early would break unrelated work.

## Success Criteria

- [ ] `npm run tokens:check -- --all` reports **zero `ERROR` lines** and **zero raw-hex warnings** in `app/**` and `components/**` (gradient SVG `data:` URIs and `globals.css` excluded).
- [ ] Every TS hex literal that drives logic now imports from `lib/brand-tokens.ts`; no `'#XXXXXX'` strings in component logic.
- [ ] `bg-[#…]` and `text-[#…]` count is zero in `app/` + `components/`.
- [ ] `/brand` showcase route renders all 11 colors, all type scales, all button variants, all card variants, all horizon treatments — verified visually at 320/768/1440.
- [ ] `npm run quality-gate` runs in **strict mode** (`STRICT_BRAND_CHECK=1`) and passes.
- [ ] `__tests__/brand-system.test.ts` passes (TS-vs-JSON drift detector + zero-violations assertion).
- [ ] `docs/brand-audit-2026-05-05.md` exists with before/after counts.
- [ ] `npm run build` and `npm run lint` pass.

## Acceptance checklist

| Criterion | Check |
|---|---|
| Zero error/raw-hex violations | `npm run tokens:check -- --all` exits 0; output has no `ERROR` lines and no `Raw hex usage found` block |
| TS hex literals removed | `rg "'#[0-9a-fA-F]{6}'" components/ app/` returns no matches outside `lib/brand-tokens.ts` |
| No arbitrary Tailwind colors | `rg "(bg|text|border|from|to|via)-\[#" components/ app/` returns no matches |
| `/brand` route loads | Browser MCP: navigate `/brand`, screenshot at 1440, confirm 11 swatches + 8 type rows + 8 button variants render |
| Strict CI is on | `package.json` `quality-gate` includes `STRICT_BRAND_CHECK=1`; intentionally adding `text-white/40` to a test file fails the gate |
| Vitest passes | `npm test` includes brand-system test and it passes |
| Audit report committed | `docs/brand-audit-2026-05-05.md` exists with before counts (32+ violations) and after counts (0) |
| `.cursorrules` updated | Part 14 mentions arbitrary Tailwind color ban + `lib/brand-tokens.ts` pattern |

## Research Sources

- `tokens/lbta-web-tokens.json`, `generated/tokens.{tailwind.json,css}`, `scripts/{build-tokens,check-brand-usage,fix-deprecated-tokens}.ts`
- `app/globals.css` (lines 1-200 for tokens; 273-480 for buttons; 942-1087 for accents/horizon)
- `tailwind.config.ts` (full font/spacing/shadow/animation scale)
- `docs/brand-token-system.md`, `docs/archive/BRAND_AUDIT.md`
- `plans/apply-brand-guide-to-website-plan.md` (✅ completed predecessor — Brand Guide v2.1 already integrated)
- `.cursorrules` Parts 6–10 (design tokens, typography, components), Part 14 (forbidden patterns)
- Live `npm run tokens:check -- --all` output (2026-05-05): 18 forbidden contrast errors + 14 raw-hex warnings
- Best practices: design-system patterns from Stripe (`@stripe/macaron`), Vercel Geist (typed token re-export), Material UI palette enums

## Relevant Learnings

- **Token pipeline already exists** — don't rebuild it; extend it (add TS export, expand the checker).
- **Brand Guide v2.1 already integrated** (horizon, section-quote, section-horizon) — this plan does not re-do that; it audits compliance with what's already built.
- **`text-white/40` and `/25` already forbidden** — that policy is in `.cursorrules` Part 14 + `check-brand-usage.ts`. We just need to enforce it (move from WARN → ERROR via `STRICT_BRAND_CHECK=1`).
- **Footer/dark contrast learning** — `text-white/50+` minimum for body on `bg-brand-deep-water` (from `.cursorrules` Part 14). Use `/55–/75` range when fixing.
- **Don't change brand color hex values** — palette is locked; only add new tokens, never edit existing ones.
- **`lib/email.ts` legitimately uses fallback fonts** (Inter, Arial, Helvetica) for email-client compatibility — the font scan must skip it.

## Research conflicts & resolution

- **Conflict:** Should `--horizon` (currently horizontal gradient) gain a `--horizon-vertical` variant, or should we add a `.horizon-bar-vertical` utility class that uses a separately-defined gradient?
- **Resolution:** Add **`--horizon-vertical`** as a new token in `tokens/lbta-web-tokens.json` (and emit to `tokens.css`). Keeps the "all hexes live in JSON" rule intact; one variable per directional variant is clearer than a utility class hiding the gradient. Update `globals.css` to use it where vertical horizon bars appear (ProgramPathwayCard, schedules/ProgramCard).

## Confidence & uncertainty

- **Plan confidence: 🟢 high.** Ground truth (the script output) confirms exact violation counts; fix sites are localized to ~5 components; the token pipeline already enforces the architecture we want.
- **Uncertainty:** Step 3.4 (RegistrationModal — 13 sites) requires per-instance contrast judgment. Likely all `/40 → /60` or `/40 → /75`, but a few may need different treatment. Verify each in browser MCP before marking step complete.
- **Minor uncertainty:** Whether `bg-[#0a1628]` in ProgramCard is visually identical to `bg-brand-deep-water` (#0F2237). If not, that's a real new token (`brand-deep-card`); if yes, just re-point to `brand-deep-water`. Decide via screenshot diff in Phase 3.1.

## Risks & Mitigations

| Risk | Mitigation |
|------|------------|
| Flipping `STRICT_BRAND_CHECK=1` blocks unrelated PRs in flight | Don't flip until Phase 3 is fully green; coordinate with any in-flight branches; flip in its own commit after the green audit. |
| Contrast fixes in RegistrationModal change visual hierarchy | Verify each change at 320/768/1440 with browser MCP before commit; if a label genuinely needs to look "muted," use `/55` not `/40`. |
| `--deep-card` token vs reusing `--brand-deep-water` | Phase 3.1 first compares both visually; only add a new token if there is a real perceptual difference. Prefer reuse. |
| Showcase route ships to production accidentally | Add `noindex`, exclude from sitemap, gate behind env flag or `?show=1`; document the route in `docs/brand-token-system.md` as internal. |
| Vitest brand test becomes flaky on CI (file walk timing) | Pre-build tokens in `beforeAll`; cap walk to `app/` + `components/`; run with `--reporter=verbose` to surface any stragglers. |
| Scope creep into "polish UI hierarchy" (Curve 2) | Out-of-scope section explicitly excludes layout/spacing/copy. If audit reveals a Curve 2 issue, log it for a follow-up plan, don't fix here. |

**Gate:** Before flipping strict mode in Phase 5.1, the user must confirm Phase 3 acceptance items pass (avoid breaking active feature branches).

## Compound loop hooks

- After this plan ships → `/compound:learn` to capture: (a) the move from WARN-to-ERROR pattern (add to `quality-bars.json`), (b) the `lib/brand-tokens.ts` typed-export pattern (add to `patterns.json`), (c) the inline-hex anti-pattern (add to `anti-patterns.json`).
- The `/brand` showcase becomes the visual checkpoint for future brand work — every subsequent brand change should be added there too.

---

**Estimated effort:** ~1 focused day for Phases 1–3, ~half day for Phase 4 (showcase quality matters), ~2 hours for Phase 5. Total ~1.5 days.

**Recommended next command after approval:** `/compound:work plans/2026-05-05-brand-system-lockdown-audit.md`
