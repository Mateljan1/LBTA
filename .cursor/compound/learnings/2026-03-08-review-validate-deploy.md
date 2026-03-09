# Compound Learn — 2026-03-08 (review → validate → deploy)

**Source:** Review + validate + deploy pass; production 100/100.

## CORRECTIONS
- Footer text on deep-water: use text-white/50+ (not /40 or /25) for WCAG 7:1.
- Hero CTA on dark: use solid background (e.g. bg-white) so contrast meets WCAG.
- Webhook payload ID: normalize to positive integer; 400 if invalid; use only validated number.
- Webhook secret: use crypto.timingSafeEqual with same-length buffers (not ===).

## PATTERNS
- **webhook-id-validate-then-use** — Normalize ID; 400 if invalid; use only validated number in URLs/bodies.
- **webhook-secret-timing-safe** — Buffer.from both; same length; crypto.timingSafeEqual.
- **hero-cta-on-dark-solid-bg** — bg-white text-black (or bg-black text-white) on dark hero.

## QUALITY BARS
- footerContrast, webhookIdValidation, webhookTimingSafeSecret, heroCtaContrast (all must).

## ANTI-PATTERNS
- footer-low-contrast, hero-button-no-bg, webhook-unvalidated-id, webhook-secret-non-timing-safe.

## FILES UPDATED
- `.cursor/compound/learnings/corrections.jsonl` (4 new lines)
- `.cursor/compound/learnings/anti-patterns.json` (4 new entries)
- `.cursor/compound/learnings/quality-bars.json` (4 new entries)
- `.cursor/compound/learnings/patterns.json` (3 new entries)
- `plans/COMPOUND_LEARN.md` (tables + learn run log row)
