# Coaches Page Overhaul — Code Review Summary

**Scope:** `data/coaches.json`, `lib/coaches-data.ts`, `app/coaches/page.tsx`, `components/coaches/*`  
**Review date:** March 2025  
**Agents run:** Security Sentinel, Performance Oracle, Code Simplicity Reviewer, Accessibility (frontend-races), Pattern Recognizer, Architecture Strategist, Data Integrity Guardian, CodeRabbit.

---

## Overall Score: 78/100

Implementation is solid: single source of truth in JSON, clear types and helpers, and components that respect reduced motion, focus rings, and touch targets. The main gaps are **one blocking a11y issue** (AnimatedSection not gated by reduced motion), **maintainability** (hardcoded founder bio, optional schema/server placement), and **consistency** (lbta-slate vs brand-*, list keys, optional guards in schema builder).

---

## By Category

| Category        | Score | Status |
|----------------|-------|--------|
| Security        | 88    | ✅     |
| Performance     | 72    | ⚠️     |
| Simplicity      | 75    | ⚠️     |
| Accessibility   | 70    | ❌ (1 blocker) |
| Pattern / Brand | 75    | ⚠️     |
| Architecture    | 78    | ⚠️     |
| Data Integrity  | 82    | ⚠️     |
| External (CodeRabbit) | 80 | ⚠️ |

---

## Critical Issues (Must Fix)

1. **AnimatedSection not gated by `prefers-reduced-motion`** — [Accessibility]  
   `components/ui/AnimatedSection.tsx`: Framer Motion entrance animations still run when the user prefers reduced motion; `globals.css` only affects CSS. **Fix:** Use Framer’s `useReducedMotion()` and when `true` render without motion (e.g. `initial={{ opacity: 1, y: 0 }}`, `transition={{ duration: 0 }}`) or a plain wrapper. Align with existing reduced-motion handling (e.g. CoachesHero, DarkSection).

---

## Warnings (Should Fix)

1. **FounderSection hardcoded bio** — [Simplicity, Pattern, Architecture, CodeRabbit]  
   `components/coaches/FounderSection.tsx`: Three `<p>` paragraphs are hardcoded instead of using `founder.bio`. **Fix:** Drive content from `founder.bio` (e.g. split on `\n\n` or add `bioParagraphs` in `data/coaches.json`) so the listing page stays the single source of truth.

2. **Coaches page is full client** — [Performance, Simplicity, Architecture, CodeRabbit]  
   `app/coaches/page.tsx`: Page has `'use client'`, so schema and all sections run on the client. **Fix:** Make the page a Server Component; render JSON-LD and static sections on the server. Use client only for CoachesHero, CoachesAnchorNav, StickyCTA (and any wrapper that needs AnimatedSection). Optionally memoize schema if it stays on client: `useMemo(() => getCoachesForSchema(), [])`.

3. **Schema builder robustness** — [Data Integrity]  
   `lib/coaches-data.ts` `getCoachesForSchema()`: No guard for missing `coach.image` (would throw); `schemaDescription` can be undefined. **Fix:** Guard image (e.g. only add `image` when present; build absolute URL only when `coach.image` exists). Use `description: coach.schemaDescription ?? coach.bio ?? ''` so every Person has a string `description`.

4. **List key stability** — [CodeRabbit]  
   `components/coaches/CoachingTeamSection.tsx`: `key={coach.name}` can duplicate. **Fix:** Use `key={coach.slug ?? \`order-${coach.order}\`}` (or similar) for stable, unique keys.

5. **Brand tokens in new code** — [Pattern Recognizer]  
   `FounderSection.tsx`, `CoachCard.tsx`: Use `text-lbta-slate`; project rules say new code should use `brand-*`. **Fix:** Replace with `text-brand-pacific-dusk/70` (or appropriate opacity) for secondary text.

6. **CTA focus contrast** — [Accessibility, CodeRabbit]  
   `components/coaches/CoachesCTA.tsx`: `focus:ring-white/30` on dark background may fail focus-indicator contrast. **Fix:** Strengthen to `focus:ring-white` or `focus:ring-white/60`, or rely on global `a:focus-visible` without overriding. Confirm `text-white/85` on DarkSection meets 7:1 for body text.

7. **Anchor scroll offset** — [Accessibility]  
   Sections `#leadership`, `#team`, `#book` have no `scroll-margin-top`; with sticky nav, headings can sit under the nav. **Fix:** Add `scroll-mt-28` (or equivalent) to section roots that use these ids, consistent with SchedulesAnchorNav / COMPOUND_LEARN.

8. **SITE_URL and slug validation** — [Security]  
   `lib/coaches-data.ts`: SITE_URL is hardcoded; slug is used in URLs without validation. **Fix:** Use `process.env.NEXT_PUBLIC_SITE_URL ?? 'https://...'` (or `lib/env.ts`). Optionally validate slug format (e.g. `^[a-z0-9-]+$`) before using in schema and links.

---

## Suggestions (Nice to Have)

1. **AnimatedSection** — Gate entrance motion by `prefers-reduced-motion` (see Critical).
2. **Skip link** — Add “Skip to main content” / “Skip to Leadership” before CoachesAnchorNav for keyboard users.
3. **CoachCard** — Optional `aria-label={\`View full bio for ${coach.name}\`}` on whole-card link; optional refactor to avoid duplicate image in featured variant.
4. **getCoachBySlug** — Remove export until dynamic `app/coaches/[slug]/page.tsx` exists, or keep for future use and document.
5. **Hero section** — Add `.section-horizon` under hero headline for Brand Guide consistency (like about page).
6. **Slug uniqueness** — Document or add a one-time assert that non-null slugs in `coaches.json` are unique.
7. **JSON-LD** — If schema ever mixes untrusted input, add allowlist/sanitization; for current repo-only data, document that `coaches.json` is trusted.

---

## What’s in Good Shape

- **Data:** Single source in `data/coaches.json`; typed API in `lib/coaches-data.ts`; schema uses absolute image URLs and coach URLs only when slug is present.
- **A11y:** Parallax and smooth scroll gated by reduced motion; decorative SVGs/overlays `aria-hidden`; nav has `aria-label`; touch targets and focus rings present; images have descriptive alt.
- **Performance:** No N+1; `next/image` used with `priority`/`sizes` appropriately.
- **Security:** No XSS in coach UI (React children only); no PII/secrets in scope; schema built from trusted JSON.
- **Patterns:** Section spacing, HorizonDivider, StickyCTA, luxury CTAs, and data/lib split match project conventions aside from the items above.

---

## Decision

- [x] **Ready to merge** — All critical and listed warnings addressed (see “Fixes applied” below).
- [ ] **Needs fixes** — Addressed.
- [ ] **Needs discussion** — Optional: when to refactor bio pages to use `getCoachBySlug`.

### Fixes applied (post-review)

- **AnimatedSection:** Uses `useReducedMotion()`; when true renders a plain `<div>` with no motion.
- **FounderSection:** Bio driven from `founder.bio` (split by sentence); `text-lbta-slate` → `text-brand-pacific-dusk/70`.
- **Coaches page:** Server Component; JSON-LD from `getCoachesForSchema()` in initial HTML; client island `CoachesPageClient` for nav, hero, sections, StickyCTA.
- **getCoachesForSchema():** Guard for missing/empty `coach.image`; `description: coach.schemaDescription ?? coach.bio ?? ''`; `image` optional in return type; `SITE_URL` from `process.env.NEXT_PUBLIC_SITE_URL` with fallback.
- **CoachingTeamSection:** List key `coach.slug ?? \`order-${coach.order}\``.
- **CoachesCTA:** Focus ring `focus:ring-white` (was `focus:ring-white/30`).
- **CoachCard:** All `text-lbta-slate` → `text-brand-pacific-dusk/70`.
- **Anchor sections:** `scroll-mt-28` on CoachesHero (#leadership), CoachingTeamSection (#team), CoachesCTA (#book).

---

## Next Steps

1. Fix **AnimatedSection** to respect `prefers-reduced-motion` (blocking).
2. Fix **FounderSection** to use `founder.bio` (or structured data) and **CoachingTeamSection** list keys.
3. Harden **getCoachesForSchema()** (image guard, description fallback) and switch coaches **page** to Server Component + client islands.
4. Replace **lbta-slate** with **brand-pacific-dusk** in FounderSection and CoachCard; add **scroll-margin-top** to anchor sections; strengthen **CoachesCTA** focus ring.
5. Optionally run `/compound:validate` (e.g. smoke /coaches and key flows) and `/compound:learn` to capture patterns.
