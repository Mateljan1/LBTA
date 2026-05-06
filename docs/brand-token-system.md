# LBTA Brand Token System

This project uses a generated token pipeline as the single source of truth for brand colors. As of v1.1 (2026-05-05) the system is **locked in**: CI fails on any drift, every component imports from the system, and `/brand` provides visual proof.

## Source of Truth

- **Canonical tokens:** `tokens/lbta-web-tokens.json`
- **Generated outputs (do not hand-edit):**
  - `generated/tokens.tailwind.json` — Tailwind config consumes this
  - `generated/tokens.css` — `app/globals.css` imports this
  - `lib/brand-tokens.ts` — TS code imports `BRAND` from this

## Commands

```bash
npm run tokens:build               # rebuild generated artifacts from JSON
npm run tokens:check               # scan only files in `git diff` (fast iteration)
npm run tokens:check -- --all      # full-repo scan
npm run tokens:check -- --all --report  # update docs/brand-audit-2026-05-05.md
npm run quality-gate               # tokens:build + STRICT tokens:check + build + lint
```

`npm run quality-gate` runs **strict mode** — any error or warning fails the build.

## How it connects

- `tailwind.config.ts` imports `generated/tokens.tailwind.json` for the `brand.*` and legacy `lbta.*` namespaces.
- `app/globals.css` imports `generated/tokens.css` and maps existing CSS variables to generated `--brand-*` / `--lbta-*` variables.
- `lib/brand-tokens.ts` exports typed constants for use in TS logic that needs raw hex (e.g. computed accent colors, canvas, charts).

## Authoring rules

When adding or updating a token:

1. Edit only `tokens/lbta-web-tokens.json`.
2. Run `npm run tokens:build`.
3. Run `npm run tokens:check -- --all --report`.
4. Add the new token to `app/brand/page.tsx` so visual proof stays in sync.
5. Verify changed pages on dark sections and CTA surfaces.

## Usage rules — by surface

| Surface | Use |
|---|---|
| Tailwind className (`bg-`, `text-`, `border-`, …) | `bg-brand-pacific-dusk`, `text-brand-victoria-cove` |
| CSS in `globals.css` / `embedded-forms.css` | `var(--brand-pacific-dusk)`, `var(--horizon)` |
| Inline style or CSS-in-JS | `var(--brand-…)` (preferred) or `BRAND.…` from `lib/brand-tokens.ts` |
| TS logic (computed colors, charts, canvas) | `import { BRAND } from '@/lib/brand-tokens'` |

**Never hardcode** `'#XXXXXX'` literals in `app/` or `components/` — the checker will fail the build.

## Guardrails (what `tokens:check` catches)

The checker scans `app/` and `components/` for:

- **`text-white/40` and `text-white/25`** — fail WCAG 7:1 on dark surfaces. **ERROR** in strict mode.
- **Raw hex literals** in TS/TSX/CSS (outside `app/globals.css`, `app/embedded-forms.css`). **WARN → ERROR in strict mode.**
- **Arbitrary Tailwind colors** like `bg-[#0a1628]`. **WARN → ERROR in strict mode.**
- **Inline `style={{ background: 'linear-gradient(... #...)' }}`** — bypasses the token system. **WARN → ERROR in strict mode.**
- **Forbidden font families** (`Inter`, `Roboto`, `Arial`, `Space Grotesk`, `Playfair`, `Work Sans`, `Helvetica`) in app code. `lib/email.ts` is exempted (email-client fallbacks). **ERROR.**
- **Deprecated `lbta-*` classes** (`lbta-primary`, `lbta-coral`, `lbta-coral-dark`, `lbta-bone`). Run `tsx scripts/fix-deprecated-tokens.ts` to auto-migrate. **WARN.**

## Visual proof — `/brand`

The internal showcase route at **`/brand`** renders every color, type scale, button variant, accent treatment, and surface. It is `noindex` and excluded from the sitemap. Use it to:

- Verify a new token visually before merging.
- Catch contrast/visual-hierarchy regressions during review.
- Onboard collaborators (one URL, complete picture).

## Drift detector

`lib/brand-tokens.test.ts` runs on every `npm test` and asserts:

1. Every `BRAND.*` constant matches `tokens/lbta-web-tokens.json` exactly (catches stale generated files).
2. The full-repo `tokens:check --all` returns zero errors and zero warnings (catches new drift the moment it's introduced).

## Two namespaces — brand identity vs system utility

The codebase has two color namespaces by design. They are NOT interchangeable.

### `brand.*` — the 12 brand identity colors (use for design)

Pacific Dusk, Deep Water, Deep Card, Victoria Cove, Thousand Steps, Sunset Cliff, Sandstone, Morning Light, Salt Air, Tide Pool, Sage Hill, Driftwood. All 11 of the original Pacific palette plus `brand-deep-card` for elevated dark cards. **These define what LBTA looks like.**

### `lbta.*` — 4 system utility colors (use for non-brand semantic roles)

| Class | Hex | Role |
|---|---|---|
| `lbta-slate` | `#6B6B6B` | Neutral secondary text (body fine print, captions, labels) |
| `lbta-stone` | `#E8E4DF` | Neutral border / disabled background / divider |
| `lbta-red` | `#F04E23` | **Error/alert only** — required-field asterisks, validation errors. NEVER use for marketing or brand accents. |
| `lbta-black` | `#0A0A0A` | True black for premium CTAs (the `.btn-primary` background) |

**These are not brand colors.** They fill semantic roles the 11-color brand palette doesn't address. Documenting them as a separate tier prevents drift back into "well, lbta-orange ≈ brand-sunset-cliff so they're the same thing."

### Deprecated `lbta-*` (must migrate to `brand-*`)

These names exist in `tokens/lbta-web-tokens.json` for backwards compat but are **forbidden in new code**:

| Deprecated | Replacement |
|---|---|
| `lbta-primary` | `brand-pacific-dusk` |
| `lbta-charcoal` | `brand-pacific-dusk` |
| `lbta-cream` / `lbta-bone` | `brand-morning-light` |
| `lbta-beige` / `lbta-sand` | `brand-sandstone` |
| `lbta-orange` / `lbta-coral` / `lbta-burnt` | `brand-sunset-cliff` |
| `lbta-coral-dark` | `brand-sunset-cliff/85` (opacity for hover) |
| `lbta-secondary` | `lbta-slate` (alias dedup) |

The checker enforces this list — adding any of these in new code fails strict mode.

## Dark-surface contrast rules

For text on `bg-brand-deep-water`, `bg-brand-deep-card`, or any dark surface:

- **Primary copy**: `text-white/85` to `text-white/90`
- **Secondary copy**: `text-white/70` to `text-white/80`
- **Eyebrows / labels**: `text-white/65` to `text-white/75`
- **Helper / footnote**: `text-white/55` to `text-white/65`
- **Decorative borders/dividers**: `border-white/10` to `border-white/20` (non-text only)
- **❌ Never** `text-white/40` or `text-white/25` for any text — fails WCAG 7:1
