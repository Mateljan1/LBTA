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

## Migration guidance (legacy `lbta-*`)

- Prefer `brand-*` classes for new code.
- Keep `lbta-*` only for backwards compatibility in untouched legacy areas.
- For dark surfaces (`bg-brand-deep-water`, `bg-brand-deep-card`), avoid low-opacity body text — keep CTA styles solid-fill with visible focus rings.
- Use `text-white/55` minimum for body content on dark surfaces; `/65–/75` for eyebrows; `/80–/90` for primary copy. Never `/40` or `/25`.
