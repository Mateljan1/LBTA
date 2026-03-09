# Compound Learn Extraction — 2026-03-09

**Trigger:** `/compound:learn` after review → validate → deploy (brand guide scope).  
**Source:** `plans/2026-03-09-compound-review-validate-deploy-summary.md`, 6 review agents.

---

## Summary

Learnings from the Apply Brand Guide work and subsequent compound review/validate/deploy. No critical issues; 6 non-blocking warnings. All captured as corrections, patterns, standards, and anti-patterns so future work avoids the same issues.

---

## CORRECTIONS (4)

| Original | Correction |
|----------|------------|
| Parallax or scroll-driven animation without reduced-motion check | Gate with `matchMedia('(prefers-reduced-motion: reduce)')`; disable or use static fallback when true (e.g. About hero like HomeHero). |
| Inline blockquote with solid border instead of Brand Guide pull-quote | Use `<PullQuote>` or class `section-quote` for gradient left edge (Victoria Cove → Sunset Cliff). |
| Decorative inline SVG (e.g. arrow icons in links) without aria-hidden | Add `aria-hidden="true"` to the `<svg>`. |
| Using Tailwind classes not in config (e.g. lbta-tan) | Use only defined tokens: `lbta-beige` or `brand-sandstone`; check tailwind.config before adding color classes. |

---

## PATTERNS (3)

| Pattern | When to use | Example |
|---------|-------------|---------|
| pull-quote-section-quote | Any blockquote that should match Brand Guide | Use `<PullQuote>` or class `section-quote`; avoid inline border-l-2. |
| parallax-reduced-motion-gate | Page/component with parallax or scroll-driven motion | matchMedia; when true disable parallax or static fallback (HomeHero, About). |
| decorative-svg-aria-hidden | SVG is purely decorative (arrow, icon in link/button) | Add `aria-hidden="true"` to the `<svg>`. |

---

## STANDARDS (4)

| Rule | Level |
|------|--------|
| Parallax / scroll-driven motion must respect prefers-reduced-motion | Should |
| Pull quotes must use PullQuote or .section-quote (Brand Guide) | Should |
| Decorative SVGs (icons in links/buttons) must have aria-hidden="true" | Should |
| Only use Tailwind color classes defined in config (no lbta-tan, etc.) | Should |

---

## ANTI-PATTERNS (4)

- Parallax or scroll-driven animation without checking prefers-reduced-motion.
- Inline blockquote with solid border instead of PullQuote or .section-quote.
- Decorative SVG in link/button without aria-hidden="true".
- Using Tailwind color class not in config (e.g. lbta-tan).

---

## Files updated

- `plans/COMPOUND_LEARN.md` — 4 corrections, 3 patterns, 4 standards, 4 anti-patterns, 1 log row.
- `.cursor/compound/learnings/corrections.jsonl` — 4 new lines.
- `.cursor/compound/learnings/anti-patterns.json` — 4 new entries.
- `.cursor/compound/learnings/patterns.json` — 3 new entries.
- `.cursor/compound/learnings/quality-bars.json` — 4 new entries (parallaxReducedMotion, pullQuoteSectionQuote, decorativeSvgAriaHidden, tailwindColorDefined).
- `.cursor/compound/learnings/LEARNINGS.md` — 2026-03-09 section added.
