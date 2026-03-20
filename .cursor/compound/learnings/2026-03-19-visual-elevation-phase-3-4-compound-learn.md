# Compound learn: Visual Elevation Phase 3 & 4 + review fixes (2026-03-19)

**Context:** Plan-aware implementation of layout variety (masonry, zigzag, bento, asymmetric) and legacy assets on homepage, camps, philosophy, success-stories. Followed by compound review (scope, security/performance, accessibility/pattern) and targeted fixes.

## What was done

- **Phase 4.0:** New layout primitives: `SplitSection`, `MasonryGrid`, `ZigzagSection` under `components/sections/`.
- **Phase 3:** Homepage — community masonry (10 legacy images, varied spans), Why Choose 60/40 asymmetric, philosophy bento (first pillar row-span-2), programs legacy image paths.
- **Phase 4:** Camps zigzag (camp-action-1–4), philosophy page bento (first principle col-span-2 row-span-2 + legacy belonging image), success-stories legacy images + varied “More Stories” grid (first card col-span-2).
- **Review fixes:** Success Stories video play button `aria-label` + `type="button"`; SplitSection `quality={90}` and JSDoc for imageAlt; philosophy and success-stories hero Images `quality={90}`.

## Review findings (source: compound review agents)

| Category | Result | Notes |
|----------|--------|------|
| Scope | ⚠️ | Only planned files changed; philosophy page uses non–design-system tokens (container-luxury, clay, sage) — defer to Phase 8. SplitSection created but not yet used. |
| Security | ✅ | No issues; asset paths static, no user input. |
| Performance | ✅ | `next.config.js` already had `/legacy-working-assets/**` in localPatterns. quality={90} added where missing. |
| Accessibility | ⚠️ | Play button aria-label and SplitSection imageAlt doc added. Decorative heroes correctly use alt="". |
| Pattern | ⚠️ | Philosophy (and similar pages) use a different token set; align with brand-* / container-lbta in design pass. |

## Corrections (extracted)

1. **Icon-only play button (e.g. video overlay) without accessible name**  
   → Add `type="button"` and `aria-label` describing the action (e.g. `aria-label={\`Play video about ${story.name}\`}`). Already in quality-bars as iconButtonA11y; this is the video-play variant.

2. **Reusable section components with next/image but no quality**  
   → Set `quality={90}` on all `next/image` in section primitives (SplitSection, etc.) and on hero/bento Images for consistency with project bar.

3. **Reusable layout component with optional image**  
   → When `imageSrc` is provided, require or document that `imageAlt` must be meaningful; JSDoc on SplitSection: “When imageSrc is set, pass a meaningful imageAlt for accessibility.”

## Patterns (extracted)

1. **Layout primitives for vibe**  
   **When:** Adding new “vibe” sections (masonry, zigzag, bento, asymmetric).  
   **Example:** Use `components/sections`: `MasonryGrid` for community/galleries (varied spans), `ZigzagSection` for alternating image/text blocks, `SplitSection` for 50/50 splits. Reference assets under `/legacy-working-assets/`; ensure path is in `next.config.js` `images.localPatterns`.

2. **Plan-aware code review**  
   **When:** Running compound review after plan-driven work.  
   **Example:** Pass to each review agent: plan summary (objective, out of scope, acceptance checklist, files to create/modify) plus code/diff. Enables scope compliance and acceptance-driven validation.

## Quality bars (reinforced)

- **next/image localPatterns:** Any new `public/` prefix used by `<Image src="/...">` must be in `next.config.js` → `images.localPatterns` (e.g. `/legacy-working-assets/**`). See 2026-03-19-header-logo-localpatterns-compound-learn.md.
- **Icon-only buttons:** Must have `aria-label` or visible text (iconButtonA11y).
- **Section/hero Images:** Prefer explicit `quality={90}` for consistency.

## Prevention

- Before adding a new layout or asset path: (1) confirm path is in localPatterns if using next/image; (2) use section primitives from `components/sections` where applicable; (3) use brand/container tokens (brand-*, container-lbta) not undefined classes (container-luxury, clay, sage) unless they are added to tailwind config and documented.
- When introducing new pages or sections that use a different “design system” (e.g. luxury tokens), either add those tokens to the project config and .cursorrules or refactor to shared tokens in a later design pass.

## Cross-links

- `plans/visual-elevation-legacy-assets-plan.md` (Phase 3 & 4 steps)
- `.cursor/compound/learnings/2026-03-19-header-logo-localpatterns-compound-learn.md` (localPatterns)
- `COMPOUND_LEARN.md` (corrections table; add row for play-button aria-label and image quality if not already covered)
