# Apply LBTA Brand Guide to Website — Implementation Plan

## Overview

Align the LBTA Next.js website’s design system with the official **LBTA Brand Guide (v2.1)** so tokens, horizon treatment, and key components (pull quotes, section accents) match the guide. Single source of truth for visual brand: `Desktop/LBTA_UTR_circuit/circuit_polished_ready/LBTA_Brand_Guide_Final.html`.

## Problem Statement

The Brand Guide defines a horizon gradient, section identity (e.g. horizon bar on sections), pull-quote style (gradient left border), and CSS variables (`--horizon`, etc.). The website already has brand colors and a horizon line utility but: (1) there is no single `--horizon` token reused everywhere; (2) pull quotes use a solid accent, not the guide’s gradient; (3) optional section accents (e.g. horizon bar under section titles) are not systematized. Aligning these improves consistency and makes future changes follow one source (the Brand Guide).

## Proposed Solution

- **Tokens:** Add Brand Guide’s `--horizon` (and optional `--border`, `--text`, `--text-soft` if useful) to `app/globals.css` and use `--horizon` in `.horizon-line` / `.horizon-line-thin` so one definition drives all horizon visuals.
- **Horizon gradient:** Match the guide’s gradient (teal → orange → gold → orange → teal); keep current transparent-fade variant as an option if desired, or standardize on guide.
- **Pull quotes:** Update `PullQuote` (or shared blockquote styling) to use the guide’s `.section-quote` pattern: gradient left border (Victoria Cove → Sunset Cliff).
- **Section accents:** Add an optional utility or component for “section with horizon bar” (e.g. horizon bar under `h2` or top of section) and use it on key landing sections so the guide’s section identity appears where appropriate.
- **Audit:** Prefer `brand-*` over `lbta-*` in new/changed code; document Brand Guide path in `.cursorrules` or a short design doc so future work references it.

No change to data source of truth (`/data/*.json`, `/schedules`); no duplicate content; no hardcoded prices.

## Implementation Steps

### Phase 1: Design tokens (single source for horizon)

- [x] 1.1: In `app/globals.css` `:root`, add `--horizon` from Brand Guide:  
  `linear-gradient(90deg, #2E8B8B, #E8834A 35%, #C4963C 50%, #E8834A 65%, #2E8B8B)`.
- [x] 1.2: Replace the inline `linear-gradient(...)` in `.horizon-line` and `.horizon-line-thin` with `background: var(--horizon)` (and adjust opacity/height as needed; keep transparent fade only if explicitly desired).
- [x] 1.3: Optionally add `--border`, `--text`, `--text-soft` from the Brand Guide if they simplify existing utilities; otherwise leave as-is.

### Phase 2: Pull quotes and section-quote pattern

- [x] 2.1: In `app/globals.css`, add utility class `.section-quote` matching the Brand Guide:  
  `border-left: 4px solid; border-image: linear-gradient(180deg, var(--victoria-cove), var(--sunset-cliff)) 1; padding: 28px 0 28px 32px; margin: 36px 0`.
- [x] 2.2: Update `components/ui/PullQuote.tsx` to use the gradient left border (e.g. apply `section-quote` or equivalent styles) instead of a solid `border-l-brand-sunset-cliff`; preserve light/dark variant and attribution.
- [x] 2.3: Ensure any other blockquote or “section quote” usage site-wide uses the same pattern for consistency.

### Phase 3: Section identity (horizon bar under headings / sections)

- [x] 3.1: Add a small utility in `globals.css` (e.g. `.hz-demo` or `.section-horizon`) for a short horizon bar under section titles, matching Brand Guide’s `h2 + .hz-demo` (e.g. 3px height, `var(--horizon)`, rounded, optional opacity).
- [x] 3.2: Use `HorizonDivider` or the new utility on 2–3 high-impact sections (e.g. homepage intro, programs lead, about) so the guide’s section identity is visible; avoid clutter (not every section needs it).
- [x] 3.3: Document in `.cursorrules` or design doc: “Section accents: use HorizonDivider or .section-horizon under key section headings per Brand Guide.”

### Phase 4: Consistency and documentation

- [x] 4.1: Grep for remaining `lbta-*` in new or touched files; prefer `brand-*` where the Brand Kit has a direct mapping (see .cursorrules Part 7).
- [x] 4.2: Add a one-line reference in `.cursorrules` (e.g. in Part 3 or Part 4): “Visual brand source: LBTA Brand Guide v2.1 (LBTA_Brand_Guide_Final.html); horizon and section-quote patterns follow the guide.”
- [x] 4.3: Run `npm run build` and `npm run lint`; fix any regressions; quick visual check of homepage and one program page.

## Files to Create/Modify

| File | Action | Purpose |
|------|--------|---------|
| `app/globals.css` | Modify | Add `--horizon`, refactor `.horizon-line`/`.horizon-line-thin` to use it; add `.section-quote`; add optional `.section-horizon` or `.hz-demo` |
| `components/ui/PullQuote.tsx` | Modify | Use gradient left border (section-quote pattern) instead of solid sunset-cliff |
| `components/ui/HorizonDivider.tsx` | No change (or minor) | Already uses horizon classes; works once globals use `--horizon` |
| 1–2 section components or pages | Modify | Add HorizonDivider or section-horizon under key headings (e.g. homepage, about) |
| `.cursorrules` | Modify | One-line Brand Guide reference and optional section-accent note |

## Success Criteria

- [x] All horizon visuals (dividers, optional section bars) use a single `--horizon` token.
- [x] Pull quotes use the Brand Guide’s gradient left border (Victoria Cove → Sunset Cliff).
- [x] At least one or two key sections show the guide’s section identity (horizon bar under heading or top of section).
- [x] `.cursorrules` references the Brand Guide as visual source of truth.
- [x] Build and lint pass; no unintended style regressions.

## Research Sources

- LBTA Brand Guide v2.1: `Desktop/LBTA_UTR_circuit/circuit_polished_ready/LBTA_Brand_Guide_Final.html` (CSS variables, horizon, section-quote, hz-demo).
- Project `.cursorrules`: Parts 3 (design), 6 (tokens), 7 (color), 10 (components).

## Relevant Learnings

- Website already has `brand.*` and `lbta.*` in Tailwind and `:root` in globals; Brand Guide uses slightly different `--sandstone` in one swatch (#C8A87C); project standard is Sandstone #F5F0E5 — keep website tokens as-is for palette, adopt only horizon and section-quote pattern from the guide.
- Horizon gradient in the guide is symmetric (teal → orange → gold → orange → teal); website’s current horizon uses transparent fade at edges — plan standardizes on guide’s `--horizon` for consistency.

## Risks & Mitigations

| Risk | Mitigation |
|------|------------|
| Gradient border (border-image) quirks in some browsers | Use the same pattern as Brand Guide; test in Safari/Chrome/Firefox; fallback to solid Victoria Cove if needed. |
| Overuse of section horizon bars | Limit to 2–3 key sections; document “key sections only” in .cursorrules. |
| Color drift (e.g. sandstone) | Do not change existing brand color hex values; only add `--horizon` and section-quote styling from the guide. |

## Compound loop (completed)

- **Review:** CSS uses single `--horizon` token; `.section-quote` and `.section-horizon` use brand variables; PullQuote uses `brand-*`; decorative `.section-horizon` divs have `aria-hidden="true"`. No security/API/data impact.
- **Validate:** `npm run build` and `npm run lint` pass.
- **Deploy:** Pre-deploy gate passed. Deploy to Vercel when ready.
- **Learnings:** Section-quote uses background-based 4px left gradient (no border-image). `.cursorrules` documents Brand Guide and section accents for future work.
