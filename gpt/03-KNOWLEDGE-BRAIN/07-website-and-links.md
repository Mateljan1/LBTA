# 07 — Website Map & Canonical Links

> **Bot factual lookup:** see `23-bot-knowledge-base-2026.md` (canonical 70-question reference grounded in `/data/*.json`). This file is the **link map only.**

> Source of truth: the live LBTA website. When linking from inside the GPT, prefer absolute URLs starting with `https://lagunabeachtennisacademy.com/`. Always favor `/schedules`, `/book`, `/camps` for high-conversion answers.

## City of Laguna Beach — registration & payment

| Purpose | URL |
|---|---|
| Catalog (canonical, base) | `https://secure.rec1.com/CA/city-of-laguna-beach/catalog` |

> Marketing emails sometimes carry pre-filtered deep links (e.g. tennis-only). Bot should default to the **base catalog URL** for accuracy and let the user filter; deep links may go stale when the City updates session IDs.

## LBTA app

| Platform | URL |
|---|---|
| iOS | `https://apps.apple.com/us/app/lbta/id6746348933` |
| Android | `https://play.google.com/store/apps/details?id=com.court.laguna` |

## Top-level navigation

| Page | URL | Use when… |
|---|---|---|
| Home | `/` | First-touch, brand intro |
| Schedules | `/schedules` | **Anyone asking pricing, days, or times** — single source of truth |
| Book a Trial | `/book` | The primary CTA — every "how do I start" goes here |
| Camps | `/camps` | Summer, spring break, ski week |
| Coaches | `/coaches` | Coach roster (Andrew, Peter, Allison) |
| About | `/about` | Founder story, philosophy, brand |
| Contact | `/contact` | General inbox + contact form |
| Philosophy | `/philosophy` | Long-form coaching belief |
| Success Stories | `/success-stories` | Testimonials, NCAA placements |
| FAQ | `/faq` | The 30 most-asked questions |
| Pathway Planner | `/pathway-planner` | Quiz-style program recommendation |

## Programs by pathway

| Page | URL |
|---|---|
| Programs overview | `/programs` |
| Junior pathway | `/programs/junior` |
| Adult pathway | `/programs/adult` |
| High Performance | `/programs/high-performance` |
| Leagues | `/programs/leagues` |
| USTA Adult League | `/programs/usta-adult-league` |
| UTR Match Play | `/programs/utr-match-play` |

## Trial / landing pages

| Page | URL |
|---|---|
| Junior Trial | `/junior-trial` |
| Adult Trial | `/adult-trial` |
| Beginner Program | `/beginner-program` |
| High Performance Pathway | `/high-performance-pathway` |
| Match Play | `/match-play` |
| Apply Scholarship | `/apply-scholarship` |
| Racquet Rescue (restringing) | `/racquet-rescue` |

## Coach pages

| Coach | URL |
|---|---|
| Andrew Mateljan (Founder) | `/coaches/andrew-mateljan` |
| Peter DeFrantz | `/coaches/peter-defrantz` |
| Allison Cronk | `/coaches/allison-cronk` |

> The former coach (removed) profile is being archived. Do not link to it.

## Conversion priority — when to link what

When the user is in **discovery** mode ("tell me about LBTA"):
1. Link `/about` for story
2. Link `/philosophy` for the belief
3. Close with `/book` for the trial

When the user is in **pricing** mode ("how much"):
1. Link `/schedules` (it has every program with prices)
2. Quote the anchor: $50 drop-in, $420 seasonal, $840 committed
3. Close with `/book`

When the user is in **kid-specific** mode ("my 8-year-old"):
1. Recommend program (Orange Ball, Green Dot, etc.)
2. Link `/programs/junior` for the pathway
3. Close with `/book`

When the user is in **adult / never-played** mode:
1. Recommend New to Tennis with Allison
2. Link `/programs/adult` or `/beginner-program`
3. Close with `/book`

When the user is in **competitive** mode ("UTR / college / matches"):
1. Recommend High Performance or UTR Match Play
2. Link `/programs/high-performance` or `/programs/utr-match-play`
3. Close with `/book` (and offer Andrew direct call for HP)

When the user is in **camp** mode:
1. Quote summer pricing ($495 full / $325 half)
2. Link `/camps`
3. Close with `/book` or "I can lock in your week — what dates?"

## CTAs the GPT should use

- "Book a trial." → `/book`
- "See the full schedule." → `/schedules`
- "Browse summer camps." → `/camps`
- "Take the Pathway Planner." → `/pathway-planner`
- "Apply for a scholarship." → `/apply-scholarship`

## Newsletter

- Signup: footer of every page; primary form via the Newsletter component.
- Cadence: weekly — "LBTA Weekly," lightweight (program updates, camp reminders, occasional founder note).
- Opt-out: link in every email. We honor it within 24 hours.

## Domain whitelist (for Web Search action)

When the GPT does web search, prefer these domains:
1. `lagunabeachtennisacademy.com` (always primary)
2. `playbypoint.com` (registration system, schedules, waivers)
3. `myutr.com` (UTR ratings)
4. `usta.com` (league rules)
5. `gptca.com` (coaching certification)
6. `atptour.com` / `wtatennis.com` (player records)

> Never prefer general tennis blogs, OC competitor academies, or social platforms over our own site.
