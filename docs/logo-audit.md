# LBTA Logo Usage Audit

One-page reference for all logo paths and alt text. Per .cursorrules: logos live in `public/logos/`; no external logo URLs except JSON-LD absolute URL.

---

## LBTA primary logo (black text)

| Location | Path | Alt | Notes |
|----------|------|-----|-------|
| **Header** | `/logos/LBTAblktext.png` | (from link/Image) | Link to `/`; "The Academy" wordmark beside it. |
| **Footer** | `/logos/LBTAblktext.png` | "Laguna Beach Tennis Academy" | Rendered with `brightness-0 invert` for dark background. |
| **ChatWidget** | `/logos/LBTAblktext.png` | (context: chat launcher) | Small logo in chat bubble/header. |
| **Chatbot (embedded)** | `/logos/LBTAblktext.png` | (context: chat UI) | Shown in chat header/avatar. |
| **Adult trial** | `/logos/LBTAblktext.png` | Descriptive per page | `app/adult-trial/page.tsx`. |
| **Beginner program** | `/logos/LBTAblktext.png` | Descriptive per page | `app/beginner-program/page.tsx`. |
| **Junior trial** | `/logos/LBTAblktext.png` | Descriptive per page | `app/junior-trial/page.tsx`. |

**JSON-LD (homepage):** `app/page.tsx` uses absolute URL `https://lagunabeachtennisacademy.com/logos/LBTAblktext.png` for schema.org; local path elsewhere.

---

## PartnershipSection (partner logos)

All under `public/logos/`. Alt text should describe the partner (e.g. name or "Partner name logo").

| Partner | Path | Alt / title |
|---------|------|-------------|
| Fit4Tennis | `/logos/fit4tennis.png` | Fit4Tennis — Movement & Performance |
| Racket Rescue | `/logos/racketrescue.png` | Racket Rescue — Equipment Services |
| RacquetIQ | `/logos/racquetiq.png` | RacquetIQ — Tennis Technology |
| GPTCA | `/logos/gptca.png` | GPTCA — Professional Coaching |
| Toroline | `/logos/toroline.png` | Toroline — Court Equipment |
| Tennis Beast | `/logos/tennisbeast.png` | Tennis Beast — Tennis Apparel |
| Laguna Beach High School | `/logos/lbhs.png` | Laguna Beach High School — School Partner |

Rendered via `PartnershipSection` with `title={`${partner.name} - ${partner.description}`}`; ensure each logo has appropriate alt (e.g. partner name) in component if not already.

---

## Racquet Rescue page

| Location | Path | Alt |
|----------|------|-----|
| **Racquet Rescue page** | `/logos/racketrescue.png` | Racquet Rescue (or page-specific descriptive alt). |

---

## Checklist

- [x] Header: local `/logos/LBTAblktext.png`
- [x] Footer: same file, inverted for dark background
- [x] PartnershipSection: all partner logos in `/logos/`
- [x] Trial/landing pages: LBTA logo local path
- [x] ChatWidget/Chatbot: LBTA logo local path
- [x] JSON-LD: absolute URL for Organization logo (exception documented)

**Last updated:** March 2026. Re-audit if new pages or components add logos.
