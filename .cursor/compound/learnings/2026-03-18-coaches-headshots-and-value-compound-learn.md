# Compound Learn — 2026-03-18 (Coaches Headshots + Page Value)

**Source:** Session work (coach image mapping, cache-bust, coaches page layout/copy)  
**Scope:** Coach headshots (named assets, cache-bust), coaches page Brand Guide accents and copy.

---

## Summary

- **Coach headshots:** Corrected mapping (1=Andrew, 2=Robert, 3=Peter, 4=Allison); used user-named files (Andrew_Bio_pic, Robert_bio_pic, etc.); added COACH_IMAGE_VERSION + coachImageSrc() so CDN/browsers load new images after deploy.
- **Coaches page:** Section-horizon under hero, founder eyebrow, and “Meet the Team”; copy tweaks (hero, team subline, CTA); Robert bio blockquote fixed to use section-quote only (no redundant border).

---

## CORRECTIONS (added to corrections.jsonl)

| Original | Correction |
|----------|------------|
| Coach headshots not updating after deploy (same URL, CDN/browser cache) | Use cache-bust: COACH_IMAGE_VERSION in lib/coaches-data.ts and coachImageSrc(path) appending ?v=N to every coach image URL; bump version when replacing assets. |
| Coach image mapping by number (1,2,3,4) error-prone when user provides named files | When user provides named assets (e.g. Andrew_Bio_pic-*.png, Robert_bio_pic-*.png), copy those to canonical public paths (andrew-headshot.png, robert-lebuhn.png, etc.); prefer named files over numbered when both exist. |

---

## PATTERNS (added to patterns.json)

- **coach-headshot-cache-bust** — When coach headshots live at static paths and are replaced: export COACH_IMAGE_VERSION and coachImageSrc(path) in lib/coaches-data.ts; use coachImageSrc() for all coach image src (cards, founder, bio pages, OG); bump COACH_IMAGE_VERSION when replacing assets so browsers and CDN fetch new files.
- **section-horizon-key-headings** — Brand Guide: use .section-horizon (horizon gradient bar) under key section headings (hero headline, section eyebrows like “Founder & Director”, “Meet the Team”) for visual consistency; add aria-hidden="true" on the decorative bar.

---

## ANTI-PATTERNS (added to anti-patterns.json)

- **section-quote-with-redundant-border** — When using class section-quote for pull quotes, do not add border-l-2 or other border classes; .section-quote already provides the gradient left edge. Redundant border overrides the Brand Guide gradient.

---

## Completed (this session)

- Coach images: 1→Andrew, 2→Robert, 3→Peter, 4→Allison; copied Andrew_Bio_pic, Robert_bio_pic, Peter_bio_pic, Allison_bio_pic to public/images/coaches/*.png.
- lib/coaches-data.ts: COACH_IMAGE_VERSION, coachImageSrc(); all coach image usages (CoachCard, FounderSection, coach bio pages, homepage, high-performance pathway) use coachImageSrc().
- Coaches hero: section-horizon under “The Coaches”; copy “Tour-level and certified coaches who teach more than technique. Movement. Craft. Community.”
- Founder section: section-horizon under “Founder & Director.”
- Coaching team: section-horizon under “Meet the Team”; subline “One philosophy: movement first, then craft—and a community that stays.”
- Coaches CTA: “Coaching that builds your game and your confidence. Book a trial to meet the right coach for you.”
- Robert bio page: blockquote uses section-quote only (removed border-l-2 border-brand-victoria-cove/40).
