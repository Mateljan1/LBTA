# LBTA Brand Token System

This project now uses a generated token pipeline for website brand colors.

## Source Of Truth

- Canonical tokens: `tokens/lbta-web-tokens.json`
- Generated outputs:
  - `generated/tokens.tailwind.json`
  - `generated/tokens.css`

Do not hand-edit generated files.

## Commands

- Build token artifacts: `npm run tokens:build`
- Check token usage guardrails: `npm run tokens:check`
- Full-repo guardrail scan: `npm run tokens:check -- --all`

`npm run quality-gate` now runs both token scripts before build and lint.

## How It Connects

- `tailwind.config.ts` imports `generated/tokens.tailwind.json` for `brand` and legacy `lbta` color namespaces.
- `app/globals.css` imports `generated/tokens.css` and maps existing CSS variables to generated token variables.

## Current Guardrails

`npm run tokens:check` scans `app` and `components` for:

- Forbidden low-contrast classes:
  - `text-white/40`
  - `text-white/25`
- Raw hex color literals in code styles
- Legacy `lbta-*` class usage (warning only for now)

By default, `tokens:check` targets currently edited files (`git diff`) to avoid blocking unrelated legacy debt. Use `--all` for a full baseline scan.

## Authoring Rules

When adding or updating tokens:

1. Edit only `tokens/lbta-web-tokens.json`
2. Run `npm run tokens:build`
3. Run `npm run tokens:check`
4. Verify changed pages on dark sections and CTA surfaces

## Migration Guidance

- Prefer `brand-*` classes for new code.
- Keep `lbta-*` only for compatibility in untouched legacy areas.
- For dark surfaces (`bg-brand-deep-water`), avoid low-opacity body text and keep CTA styles solid-fill with visible focus rings.
