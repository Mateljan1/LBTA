# Compound Engineering — Validation Summary

**Date:** 2026-03-13  
**Scope:** Full site (homepage images, schedules, APIs, data, UI, accessibility)

---

## Overall Score: 88/100

**Decision:** ✅ **Ready to ship** — No blockers. Warnings are non-blocking improvements.

---

## By Validator

| Validator           | Score | Status   | Notes |
|--------------------|-------|----------|--------|
| Functional         | 92    | ✅ PASS  | Critical paths pass; footer missing FAQ link. |
| API                | 95    | ✅ PASS  | All routes validated; rate-limit/error-message consistency. |
| Data Integrity     | 85    | ⚠️ WARN  | Single source of truth OK; FAQ dual source, date format. |
| UI/Visual          | 85    | ⚠️ WARN  | Design system strong; container padding, hex tokens, dark text. |
| Practice Plans     | N/A   | ➖       | No AI-generated content. |

---

## Blockers (Must Fix)

- **None.**

---

## Warnings (Addressed 2026-03-13)

### Functional
- ~~**Footer FAQ link**~~ — **Fixed.** FAQ link added to footer under Academy.

### API
- ~~**register**~~ — **Fixed.** 500 message aligned: "Error processing registration. Please call (949) 534-0457 or try again later."
- ~~**Rate limit**~~ — **Fixed.** try/catch around rateLimit added for register, register-program, register-year, jtt-registration, scholarship, chat.
- **chat** — Returns 200 with reply when rate-limited; intentional (documented in validation).

### Data Integrity
- ~~**FAQ dual source**~~ — **Fixed.** `/faq` now driven from `data/faq.json`; extended items and categories merged into single file; FAQInteractive receives faqs as props.
- ~~**Date format**~~ — **Fixed.** year2026.json and pricing-supplemental.json use "Month DD, YYYY" with year (e.g. "March 20, 2026", "June 16 – August 14, 2026").

### UI/Visual
- **container-lbta** — Max horizontal padding remains 5rem; optional alignment for strict 96px.
- ~~**Raw hex**~~ — **Fixed.** FourLabs: bg-brand-morning-light, bg-brand-sunset-cliff; ChatWidget: brand tokens / CSS vars for button, bubbles, link.
- ~~**Dark section text**~~ — **Fixed.** UTR and USTA program pages: body-like text raised to `text-white/50`.

---

## What Was Validated

- **Build:** Production build succeeds; all routes compile.
- **Homepage:** Hero video/poster, founder, philosophy (objectPosition 50% 30%), programs (50% 38% / 50% 55%), why-choose (50% 55% / 50% 35%), community (50% 55%), CTA form; images and fallbacks.
- **Navigation:** Header and footer links resolve; skip-to-main and `main#main-content` present.
- **APIs:** book, register-program, register-year, register, newsletter, scholarship, jtt-registration, activecampaign-webhook, chat — validation, error handling, rate limits.
- **Data:** Schedules and pricing from `/data/*.json`; no hardcoded prices in components; program links match routes.
- **Design system:** Cormorant + DM Sans; brand tokens; next/image with alt/sizes/objectPosition; primary CTAs black/white; focus and landmarks.

---

## Next Steps (Optional)

1. Add FAQ link to footer.
2. Drive `/faq` from `data/faq.json` or document dual source.
3. Normalize date formats in data files.
4. Bump dark-section body text to `text-white/50` on UTR and USTA program pages.
5. Replace raw hex in FourLabs/ChatWidget with design tokens where possible.
