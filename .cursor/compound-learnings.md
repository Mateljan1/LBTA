# Compound Learnings — Full Site Visual Upgrade (Phases 0–3)

## CORRECTIONS

- **Section dividers**: Use shared `<HorizonDivider />` instead of raw `<div className="horizon-line" />` so variant and semantics stay consistent.
- **Bottom CTAs**: Use `<DarkSection>` with sandstone headline + sunset-cliff primary button (and secondary outline) instead of custom image-overlay sections.
- **Hero overlays**: Use `bg-brand-deep-water` with opacity (e.g. overlay) for cinematic depth; avoid flat black overlays only.

## PATTERNS

- **DarkSection**: For CTAs and key narrative blocks; optional radial gradient overlay (warm spots) via inline style; children in `container-lbta` by default.
- **HorizonDivider**: Between major page sections; use `as="hr"` when semantic break is desired; `variant="thin"` for tighter spacing.
- **Sandstone cards**: `bg-white border border-black/6` with left border accent `border-l-4 border-brand-sandstone` on desktop for content panels.
- **Serif section titles**: `font-headline` (Cormorant) for section titles and all display/headline text; `font-sans` (DM Sans) for body and eyebrows. Use `font-headline` everywhere Cormorant is intended (replaced `font-serif` sitewide in Phase 5).

## STANDARDS

- **Brand tokens**: Prefer `brand-deep-water`, `brand-sandstone`, `brand-sunset-cliff`, `brand-victoria-cove`, `brand-pacific-dusk`; avoid hardcoded hex in new code.
- **Single source of truth**: Prices and schedule data only in `/data/*.json`; no hardcoded prices in components.
- **Touch targets**: Min 48px height for buttons/links on mobile; focus ring 2px (black or white by context).
