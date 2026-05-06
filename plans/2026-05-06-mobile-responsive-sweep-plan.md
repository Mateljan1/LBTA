# Mobile Responsive Sweep — Plan Stub

**Status:** Queued from /compound:full brand-system run (2026-05-06)
**Predecessor:** `plans/2026-05-05-brand-system-lockdown-audit.md` (brand v1.1 locked)
**Type:** Plan stub — run `/compound:plan` to expand before executing

## Why now

Brand v1.1 is locked. The next-highest-leverage adjacent win is verifying every fixed component at all breakpoints. The contrast and token fixes shipped in `ddd76e6` were verified at desktop only — mobile/tablet need explicit sign-off.

## Scope (start here when expanding)

### Verify at 320 / 375 / 768 / 1024 / 1440

- `RegistrationModal.tsx` — modal scrolls cleanly, all 13 fixed text colors readable, form fields stay usable on small screens, sticky-bottom Register button has proper safe-area padding
- `components/programs/ProgramPathwayCard.tsx` — image-left/image-right alternation works mobile, horizon-vertical bar visible on md+, schedule/pricing grid wraps properly
- `components/schedules/ProgramCard.tsx` — `bg-brand-deep-card` cards stack to one column on mobile, register button stays 48px+ touch target, ring-offset visible
- `components/programs/MethodSection.tsx` — image-to-content gradient blend hidden on mobile (lg:block), no horizontal scroll
- `components/HomeHero.tsx` — already audited but re-verify after token changes
- `components/utr-tracker/UtrLeaderboard.tsx` — `text-white/(10..35)` instances flagged in brand audit but deferred; revisit in mobile context

### Cross-cutting checks

- 48×48px touch target enforcement (existing `.cursorrules` rule, but spot-verify on every CTA/icon)
- `prefers-reduced-motion` respected on all new animations
- iOS form zoom (16px input font-size minimum)
- `--lbta-sticky-cta-h` and `--lbta-program-bar-h` correctly account for safe-area-inset-bottom

## Acceptance (draft)

- Browser MCP screenshot suite at 320/375/768/1024/1440 for each fixed component
- Lighthouse mobile score ≥ 90 (Performance, Accessibility, Best Practices, SEO) on /, /schedules, /programs, /coaches, /book
- No horizontal scroll at any breakpoint on any audited route
- Touch targets ≥ 48×48 verified

## Out of scope

- New mobile features (this is verification + small polish, not redesign)
- Tablet-specific layouts (audit only; redesigns are separate plans)
- Email templates (own follow-up plan)

## Estimate

~1 day (verification + small polish fixes). Run `/compound:plan plans/2026-05-06-mobile-responsive-sweep-plan.md` to expand.
