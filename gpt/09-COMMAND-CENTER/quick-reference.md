# Quick Reference

> Pin to your desk. The numbers, links, and shortcuts you reach for most. **If anything here disagrees with an upstream file, upstream wins.**

---

## Canonical contact (locked, do not change without homepage update)

| Field | Value | Source |
|---|---|---|
| **Phone** | (949) 534-0457 | Homepage footer |
| **Email** | support@lagunabeachtennisacademy.com | Homepage footer |
| **Address** | Moulton Meadows Park, 1098 Balboa Ave, Laguna Beach, CA 92651 | Homepage |
| **Founder cell** | (private — do not put in any public-facing GPT) | Internal only |
| **Founder email** | (private — do not put in any public-facing GPT) | Internal only |

---

## Pricing (locked, source: 03-KNOWLEDGE-BRAIN/02-programs-and-pricing.md)

| Tier | Price | Use |
|---|---|---|
| Drop-In | $50 | Single session |
| Seasonal | $420 | One season |
| Committed | $840 | Two seasons |
| Camp (full week) | $495 | M–Th, 9am–3pm |
| Camp (half day) | $325 | M–Th, 9am–12pm |

Ages 5–11. Camps run Jun 16 – Aug 19 at Alta Laguna Park.

---

## Refund

**30-Day Money-Back Guarantee.** Full refund within 30 days, account credit after. Source: homepage. The FAQ has been aligned to this.

---

## Training sites

1. **LBHS** — Laguna Beach High School
2. **Moulton Meadows Park** — 1098 Balboa Ave (HQ address)
3. **Alta Laguna Park** — camp site

---

## Voice anchors

- "Tennis, as it should be taught."
- "Movement. Craft. Community."
- "Structure creates confidence. Confidence creates results."

Forbidden words (full list in `03-KNOWLEDGE-BRAIN/05-voice-and-brand.md`): *elite, world-class, master, mastery, maximize, boost, unlock potential, transform your game, take it to the next level, !!!.*

---

## The 6 GPTs at a glance

| GPT | User | Folder | Sharing |
|---|---|---|---|
| LBTA Founder | Andrew | `02-GPT-BUILDS/01-Founder-GPT/` | Only me |
| LBTA Adult Coach | Allison | `02-GPT-BUILDS/02-Adult-Coach-GPT/` | Andrew + Allison |
| LBTA Junior Coach | Saska | `02-GPT-BUILDS/03-Junior-Coach-GPT/` | Andrew + Saska |
| LBTA Front Desk (public) | Public | `02-GPT-BUILDS/04-Front-Desk-GPT/` | Anyone w/ link (after Day 28 Section A audit only) |
| LBTA Marketing | Andrew (solo) | `02-GPT-BUILDS/05-Marketing-GPT/` | Only me (Phase 7 dogfood + Phase 8 unlock) |
| LBTA Front Desk Drafts (private) | Andrew + ops | `02-GPT-BUILDS/06-Front-Desk-Draft-GPT/` | Only me (drafts replies, never customer-facing) |

---

## Emergency commands

| Situation | Command |
|---|---|
| Take Front Desk offline | ChatGPT → Edit GPT → Sharing → **Only me**. (Public link breaks instantly.) |
| Marketing GPT incident (forbidden word, image-gen, near-publish, fake testimonial) | See `05-OPERATIONS/runbooks/marketing-incident.md` — kill suspect draft, log, fix knowledge, re-test. |
| Revoke Marketing Drive/Gmail (Phase 8 only) | ChatGPT → Edit GPT (Marketing) → Connected Apps → Disconnect Drive + Gmail. |
| Sync repo → desktop mirror | `rsync -av --delete --exclude='01_BUILD-NOW_*' --exclude='02_BUILD-NEXT_*' --exclude='_ARCHIVE' /Users/andrew-mac-studio/LBTA_WEBSITE_DRAFT_3:5:26/gpt/ ~/Desktop/LBTA-Custom-GPT-FINAL/` |
| Find a knowledge file fast | `cd /Users/andrew-mac-studio/LBTA_WEBSITE_DRAFT_3:5:26/gpt/03-KNOWLEDGE-BRAIN && ls` |
| Lint the website (post-edit) | `cd /Users/andrew-mac-studio/LBTA_WEBSITE_DRAFT_3:5:26 && npm run lint` |

---

## File-finder cheatsheet

| If you need… | …open this |
|---|---|
| Why we built 6 GPTs not 1 | `01-ARCHITECTURE/team-architecture.md` |
| Where v2/v3 GPTs fit (roadmap) | `01-ARCHITECTURE/gpt-roadmap.md` |
| The 30-day post-dogfood plan | `01-ARCHITECTURE/post-dogfood-compound-loop.md` |
| The team's 20-minute first session | `01-ARCHITECTURE/team-activation-playbook.md` |
| The system prompt for Andrew's GPT | `02-GPT-BUILDS/01-Founder-GPT/system-prompt.md` |
| The system prompt for Marketing GPT | `02-GPT-BUILDS/05-Marketing-GPT/system-prompt.md` |
| Marketing surface templates (IG / newsletter / blog / partner / ad) | `03-KNOWLEDGE-BRAIN/12-marketing-surfaces.md` |
| Marketing brand voice + forbidden words | `03-KNOWLEDGE-BRAIN/11-marketing-brand-voice.md` |
| Marketing image-gen + consent rules | `03-KNOWLEDGE-BRAIN/13-marketing-asset-library.md` |
| Shared base knowledge for all GPTs | `03-KNOWLEDGE-BRAIN/01-academy-facts.md` … `10-guardrails-and-escalation.md` |
| Why we don't connect Stripe | `04-INTEGRATIONS/README.md` |
| Marketing-only integration rules (extended whitelist, Phase 2 Drive/Gmail) | `04-INTEGRATIONS/web-search-whitelist.md`, `04-INTEGRATIONS/google-drive-setup.md`, `04-INTEGRATIONS/gmail-setup.md` |
| What to do when GPT hallucinates | `05-OPERATIONS/runbooks/hallucination-incident.md` |
| What to do on a Marketing GPT incident | `05-OPERATIONS/runbooks/marketing-incident.md` |
| What to tell parents about AI | `06-COMMUNICATIONS/parent-faq.md` |
| The privacy disclosure | `07-LEGAL-PRIVACY/privacy-disclosure.md` |
| LBTA brand color hex codes | `08-BRAND-ASSETS/brand-token-reference.md` |
| The full setup checklist (incl. Phase 7+8 Marketing) | `09-COMMAND-CENTER/master-setup-checklist.md` |

---

## Cadence at a glance

| Cadence | Doc |
|---|---|
| Daily (during dogfood week, then 2–3x/wk) | `09-COMMAND-CENTER/daily-cockpit.md` |
| Friday pre-game (5 min) | `09-COMMAND-CENTER/weekly-cockpit.md` |
| Friday Compound Review (30 min) | `05-OPERATIONS/scripts/friday-compound-review.md` |
| Monthly knowledge refresh (60 min) | `05-OPERATIONS/scripts/monthly-knowledge-refresh.md` |
| Monthly red team audit | `05-OPERATIONS/eval/red-team-audit-template.md` |
| Quarterly review (90 min) | `05-OPERATIONS/scripts/quarterly-review.md` |
| Annual strategy review (2 hr) | `05-OPERATIONS/scripts/annual-strategy-review.md` |

---

## The 10/10 standard (re-read monthly)

1. Architecture matches the team's real jobs ✅ (6 GPTs: 5 ops + 1 marketing; ops split into Founder, Adult Coach, Junior Coach, Front Desk public, Front Desk Drafts private)
2. Measurable weight-off-Andrew (5+ hrs/wk ops + 4+ hrs/wk marketing by Day 60)
3. Learning loop ✅ (Friday ritual; marketing covered in same ritual)
4. Safe to scale ✅ (Front Desk public locked + Marketing kill-switches + Drafts GPT private + monthly red team Sections A+B)
5. Compounds (week 12 better than week 1)
6. All three coaches actively use it daily by Day 30; Marketing GPT used weekly by Day 45; Drafts GPT used 2–3×/wk by Day 30

Day 90 is the first 10/10 audit. v1 (5 ops) + v2 (Marketing) = a strong 8/10. The path is in `01-ARCHITECTURE/post-dogfood-compound-loop.md` and `01-ARCHITECTURE/gpt-roadmap.md`.

---

## Owner

Andrew Mateljan. Pin this to the wall.

— Tennis, as it should be taught.
