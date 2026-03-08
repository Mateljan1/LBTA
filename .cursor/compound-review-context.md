# Compound Engineering Review — LBTA Website

## Scope
Uncommitted changes across the Laguna Beach Tennis Academy Next.js 14 (App Router) codebase.

## Change summary
- **Visual upgrade**: HorizonDivider and DarkSection added across pages; font-serif → font-headline; CTA sections use DarkSection.
- **Lint/a11y/UX**: TrialBookingModal (useCallback handleClose, escape effect deps); VideoTestimonials (auto-advance effect deps); layout (FB pixel eslint-disable); ChatWidget & PartnershipSection (img → Next/Image); HorizonDivider default as=hr; DarkSection scroll entrance + useReducedMotion.
- **Components**: AnimatedSection ref cleanup; new DarkSection, HorizonDivider, PullQuote, StatGrid; removed PressBanner, TrustBadges.
- **Data**: Single source of truth preserved; no hardcoded prices in components.

## Key files to review
- `app/layout.tsx` — FB pixel img, scripts
- `components/TrialBookingModal.tsx` — useCallback, escape/focus effects
- `components/VideoTestimonials.tsx` — auto-advance useEffect
- `components/AnimatedSection.tsx` — ref cleanup in useEffect
- `components/ChatWidget.tsx` — Next/Image for logo
- `components/ui/PartnershipSection.tsx` — Next/Image for partner logos
- `components/ui/DarkSection.tsx` — motion + useReducedMotion
- `components/ui/HorizonDivider.tsx` — default as=hr
- Multiple `app/**/page.tsx` — HorizonDivider, DarkSection, font-headline

## Tech stack
Next.js 14+, TypeScript, Tailwind, Framer Motion. Brand: Cormorant + DM Sans, brand-* tokens, WCAG 2.1 AAA.
