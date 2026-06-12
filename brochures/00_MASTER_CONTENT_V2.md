# LBTA Brochure System — Master Content Doc V2

**Version:** 2.0 · **Date:** 2026-05-06 · **Owner:** Andrew Mateljan
**Replaces:** `~/Desktop/LBTA_Brochures_v1/00_MASTER_CONTENT_DOC.md` (test only)
**Pipeline:** `scripts/build_brochures.sh` (build content → render PDFs → pre-flight QA)

> **Single source of truth rule.** Every fact in every printed brochure is generated
> from the project's `data/*.json` files at render time. Do **not** edit copy in PDFs
> or HTML templates without first updating the source data. If the website price
> changes, brochures update on the next render — no parallel doc to keep in sync.

---

## 1. Brand block (locked — never per-variant override)

| Field | Value | Source |
|---|---|---|
| Name | Laguna Beach Tennis Academy | `data/coaches.json`, `app/layout.tsx` |
| Primary tagline | *Tennis, as it should be taught.* | `data/homepage-copy.json:hero.tagline`, `lbta-brand` SKILL |
| Pillar trio | Movement. Craft. Community. | `data/homepage-copy.json:hero.pillars`, `.cursorrules` line 5 |
| City partner line | Official City of Laguna Beach Tennis Partner Since 2020 | `app/about/layout.tsx`, `app/adult-trial/page.tsx`, `app/beginner-program/page.tsx` |
| Web | `lagunabeachtennisacademy.com` | live site |
| Email | `support@lagunabeachtennisacademy.com` | `.cursorrules` Part 20 |
| Phone | `(949) 534-0457` | `.cursorrules` Part 20 |
| Address | 1098 Balboa Ave, Laguna Beach, CA 92651 | `.cursorrules` Part 20 |

> **V1 corrections shipped in V2:** "Movement. Craft. Community." was incorrectly
> labeled the tagline in V1 — it's the pillar trio. Primary tagline is "Tennis, as
> it should be taught." Email was `hello@…` placeholder; real address is `support@…`.

## 2. Locations (locked)

| Park | Address | Courts | Use |
|---|---|---|---|
| Moulton Meadows Park | Balboa Ave & Capistrano Ave, Laguna Beach 92651 | 2 | Youth & beginners |
| Alta Laguna Park | 3300 Alta Laguna Blvd, Laguna Beach 92651 | 4 | Junior development & UTR weekends |
| Laguna Beach High School | 625 Park Ave, Laguna Beach 92651 | 6 | High Performance · LiveBall · Camps |

## 3. Coaches (locked — visible roster only)

Source: `data/coaches.json`. Hidden coaches (`hidden: true`) are **excluded by the
build script** automatically. Saska Mateljan is back-of-house (Co-Owner / Finance
Director) and never appears in the coaches data file or on any brochure.

### Andrew Mateljan — Founder & Director of Tennis
> Fourth-generation tennis coach. Andrew was introduced to the game by his
> grandfather Steve at Ford Park in Redlands and has spent twenty years on tour
> and on court since. Top-12 nationally as a junior, two-time Kalamazoo Nationals
> competitor, ITF Futures circuit (US, Venezuela, El Salvador, Guatemala). Trained
> at Sánchez-Casal Spain under Jimmy Johnson; seven years coaching internationally
> across Spain, Croatia, and Norway.
>
> Currently coaches **Karue Sell (ATP #258)** — took him from #860 to #258 in 2025.
> **Colton Smith (ATP #133)**, **Max McKennon (#458)**, and **Ryan Seggerman (#63
> in doubles)** all came through the same training. **Alex Michelsen** came
> through the program at ages 12–13 — now ATP #30, 2022 Wimbledon Boys' Doubles
> champion. *(Bundle phrasing rule: "came through" not "I coached" — supplemental
> training, not primary. Source: `01_Andrew_Master_System_Instructions_v2.md`.)*

> **V1 corrections shipped in V2 (refresh 2026-05-06):** V1 listed Andrew as
> having "coached Alex Michelsen ages 12–13" — wrong framing. V2 uses the
> bundle-mandated "came through" wording. Colton Smith was missing from V2; now
> included. Fourth-generation lineage was missing; now included. Sánchez-Casal
> Spain training under Jimmy Johnson was missing; now included.

### Peter DeFrantz — Head Coach, Junior Development
> Grew up on the tennis court — his father coached high school tennis. College
> tennis at Mt. San Jacinto College; dual USPTA and PTR certified. Eight years
> coaching across Southern California with a progressive, player-centered approach.

### Allison Cronk — Head Coach, Youth Programs
> Varsity at Mira Costa High School; competed at Westcliff University (NAIA) and
> Shepherd University (NCAA) — Dean's List every semester at both. Coached at
> five academies across Orange County and the South Bay. B.A. History, Education
> minor. CPR/AED certified.

> **V1 corrections:** V1 listed Andrew as having "coached Alex Michelsen ages
> 12–13" — that claim does not appear in `data/coaches.json` or any current source.
> V2 uses the verified tour roster (Karue Sell, Max McKennon, Ryan Seggerman).
> Peter's title was "Senior Coach" in V1; real title is "Head Coach, Junior
> Development." Allison's NCAA/NAIA history was missing from V1.

## 4. The Pathway (the spine — appears on most variants)

Movement first. Craft second. Community always.

| Level | Age | Court | Where it leads |
|---|---|---|---|
| Little Tennis Stars | 3–4 | 36' foam | First racquet, first rally |
| Red Ball | 5–6 | 36' foam | Coordination + first match play |
| Orange Ball | 7–8 | 60' low-compression | Scoring, footwork, first tournament |
| Green Dot | 9–11 | 78' green | Phase Play · UTR 1.0–3.0 |
| Junior Development | 11–18 | 78' yellow | UTR 1–7 · USTA Level 6/5 |
| High Performance | 12–17 | 78' yellow | **UTR 8+ required** · Section / National events |

> **V1 correction:** V1 listed High Performance as "UTR 5+." Reality (per
> `data/spring-summer-2026.json`) is UTR 8+. UTR 1–7 is Junior Development.

## 5. Programs & pricing (Spring 2026 — generated from data files)

> **All pricing below is generated by `build_brochure_content.py` at render time.**
> If `data/spring-summer-2026.json` or `data/private-rates.json` changes, re-run
> `scripts/build_brochures.sh`. Do not transcribe prices into this doc.

### 5.1 Junior group programs

10-week Spring session: **April 6 – June 13, 2026** (skip May 25). Registration
opens **March 2, 2026**. Source: `data/spring-summer-2026.json:spring`.

| Program | Ages | Days · Time | 1 wk | 2 wk | 3 wk | Drop-in |
|---|---|---|---|---|---|---|
| Little Tennis Stars | 3–4 | Mon/Wed 3:30p · Sat 9:00a | $120/mo | $200/mo | — | $40 |
| Red Ball | 5–6 | Mon/Wed 4:15p · Sat 9:45a | $420 | $840 | $1,260 | $50 |
| Orange Ball | 7–8 | Mon/Wed 5:15p · Tue/Thu 3:30p · Sat 10:45a | $420 | $840 | $1,260 | $50 |
| Green Dot | 9–11 | Tue/Thu 4:30p · Sat 11:45a | $420 | $840 | $1,260 | $50 |
| Competitive Green Dot (invite) | 9–11+ | Tue/Thu/Fri 4:30–6:30p | $625 | $1,250 | $1,745 | $70 |
| Junior Development | 11–18 (UTR 1–7) | Mon/Wed/Fri 4:30–6:30p | $625 | $1,250 | $1,745 | $70 |
| **High Performance (UTR 8+)** | 12–17 | Mon/Wed 6:30–8:30p (training) · Fri 4:30–6:30p (match play) | $625 | $1,250 | $1,745 | $100 |

### 5.2 Adult programs

| Program | Format | 1 wk | 2 wk | 3 wk | Drop-in |
|---|---|---|---|---|---|
| New to Tennis | Tue/Thu 10a (Andrew) · Mon/Wed 6:30p (Peter) · Sat 9a (Peter) | $420 | $615 | — | $55 |
| Beyond Beginner | Mon/Wed 6:30p (Allison) | $420 | $615 | — | $55 |
| Adult Intermediate (NTRP 3.0–4.0) | Tue/Thu 11a · Sat 10a | $580 | $1,105 | $1,570 | $70 |
| Adult Advanced (NTRP 4.0+) | Mon/Fri 12–2p | $625 | $1,250 | — | $90 |

### 5.3 Open court

| Program | Format | Monthly | Drop-in |
|---|---|---|---|
| LiveBall (intermediate / advanced) | Thu 6p · Sat 11:30a · Sun 9a / 10:30a | $150 | $50 |
| Cardio Tennis | Fri 9–10:30a (LBHS) | $150 | $50 |

> **V1 correction:** V1 missed Adult Intermediate, Adult Advanced, Cardio Tennis,
> and the LBTA Sunday LiveBall slots.

### 5.4 Camps

**Spring Break Camp** · March 30 – April 2, 2026 (Mon–Thu)
- Tennis & Adventure (5–11) at Alta Laguna · 9a–12p or 12–3p · **$325/wk · $85/day**
- Junior Development (12–17) at LBHS · 9a–12p or 1–4p · **$325/wk · $85/day**
- Lead coach: Peter DeFrantz

**Summer Camps** · June 15 – August 29, 2026
- Tennis & Adventure Full Day (5–11) · 9a–3p · **$495/wk · $99/day**
- Tennis & Adventure Half Day (5–11) · AM or PM · **$325/wk · $85/day**
- Summer Training Full Day (12–17) at LBHS · 9a–3p · **$595/wk · $120/day**
- Summer Training Half Day (12–17) at LBHS · 9a–12p or 12–3p · **$325/wk · $85/day**

### 5.5 Private lessons (published rates only)

Source: `data/private-rates.json`.

| Coach | 60 min | 90 min | 10-pack (60 min) | 20-pack (60 min) |
|---|---|---|---|---|
| Andrew Mateljan | $250 | $350 | $2,300 (saves $200) | $4,200 (saves $800) |
| Peter DeFrantz | $120 | $165 | $1,100 (saves $100) | $2,000 (saves $400) |
| Allison Cronk | $120 | $165 | $1,100 (saves $100) | $2,000 (saves $400) |

Pack expiry: 12 months. 24-hour cancellation policy.

> ⚠️ **Do not print** any negotiated/family rate. Brochures show **published rates
> only**. Negotiated pricing is conversation-only per `.cursorrules` Part 12 single-
> source-of-truth.

### 5.6 USTA Adult Leagues (Spring 2026)

Source: `data/leagues-2026.json`. Four leagues open. $458 (12-player) / $393
(14-player). Plus annual USTA membership ($48). See variant 02 (A5 booklet) for
full league grid.

### 5.7 UTR Match Play (Spring 2026)

Source: `data/leagues-2026.json:utr`. Season **April 11 – June 6, 2026**, Grand
Finals June 6.

| Division | Day | Season | Drop-in |
|---|---|---|---|
| Color Ball (juniors) | Saturday at Alta Laguna · 1:30–4:00p | $349 | $55 |
| UTR 1–7 Singles | Saturday at Alta Laguna · 4:00–6:30p | $399 | $65 |
| UTR 3–12 Singles | Sunday at LBHS · 3:00–5:30p | $399 | $65 |
| UTR 1–12 Doubles | Sunday at LBHS · 5:30p | $399 | $65 |

### 5.8 Discounts (locked — published)

- **Sibling:** 10% additional siblings in same program
- **Early Bird:** 5% registered 2+ weeks before session start
- **Multi-Session:** 5% Spring + Summer together
- **Multi-Camp Week:** 10% booking 4+ weeks of camp

## 6. CTA matrix (per audience, every URL must return 200)

| Variant | Primary CTA | Secondary | Destination URL |
|---|---|---|---|
| 01 Tri-fold | Book a trial | View schedule & pricing | `/book` · `/schedules` |
| 02 A5 booklet | Book a trial | Explore programs | `/book` · `/programs` |
| 03 5×7 postcard | Book a trial | View schedule | `/book` · `/schedules` |
| 04 Concierge | Drop-in clinic from $50 | Book at lagunabeachtennisacademy.com/book | `/book` |
| 05 Local family | Try LiveBall · $50 | Find your level | `/book` · `/programs/junior` |
| 06 Email warm-lead | Reply for a personal program match | Browse all programs | `/book` · `/programs` |
| 07 Private coaching | Book a private session | View all coaches | `/book` · `/coaches` |
| 08 Spring 2026 insert | Register Spring 2026 | View calendar | `/schedules` |

## 7. Voice rules (every variant)

**Use:**
- Specific names, real numbers, the Pathway, "Tennis, as it should be taught."
- Calm, confident, direct. Founder voice.

**Banned (zero tolerance — enforced by `check_brochure.py`):**
- "elite," "world-class," "best in OC," "premier," "premium tier," "VIP,"
  "mastery," "maximize," "unlock your potential," "cutting-edge," "next-gen,"
  "revolutionary," "limited spots," "act now," "don't miss out"
- "We hope all is well," "Best regards," "LBTA Admin Team"
- "Guaranteed results," "#1," ALL-CAPS body copy, exclamation points in headlines

Sources: `.cursorrules` Part 14, `~/.claude/skills/lbta-messaging/SKILL.md`,
`~/.claude/skills/lbta-brand/SKILL.md` Quality Gate.

## 8. Visual system (locked — see `tokens/print.css`)

- **Palette** — only the 12 brand hex values from `tokens/lbta-web-tokens.json` v1.1.0
- **Type** — Cormorant Garamond (display, weight 300) + DM Sans (body)
- **Horizon gradient** — `linear-gradient(90deg, #2E8B8B → #E8834A → #D4A853 → #E8834A → #2E8B8B)` — required on every cover
- **Logos** — `brochures/assets/logos/LBTAblktext.png` (light bg) · `LBTAwhttext.png` (dark bg)
- **Coach portraits** — `andrew.png · peter.png · allison.png` in `brochures/assets/photos/`
- **Hero photos** — Cloudinary canonical set, mirrored locally in `brochures/assets/photos/`

> V1 used Playfair Display + Inter (both **explicitly banned** in `.cursorrules`
> Part 14) and a custom navy/sand/clay palette outside `tokens/lbta-web-tokens.json`.
> The horizon gradient was absent from every V1 PDF. V2 enforces all of this via
> `check_brochure.py`.

## 9. Variant manifest (V2 — 14 deliverables: 12 public + 1 internal + 1 by-invitation)

| File | Audience | Format | Page size | Distribution |
|---|---|---|---|---|
| `01_TriFold_Core.pdf` | Universal | 6-panel tri-fold | 11×8.5 landscape | Public |
| `02_A5Booklet_Core.pdf` | Universal | 8-page saddle-stitched | A5 (5.83×8.27) | Public |
| `03_5x7_Postcard.pdf` | Universal | Front + back | 7×5 landscape | Public |
| `04_Hotel_Concierge.pdf` | Visitor / concierge | 2 pages | Letter | Public |
| `05_Local_Family.pdf` | Local family | 2 pages | Letter | Public |
| `06_Email_Warm_Lead.pdf` | Warm lead | 1 page, clickable | Letter | Public |
| `07_Private_Coaching_OnePager.pdf` | Adult private prospect | 1 page | Letter | Public |
| `08_Seasonal_Insert_Spring2026.pdf` | Quarterly insert | 4×6 | 6×4 landscape | Public |
| `09_Pod_Application_OnePager.pdf` | UHNW Pod prospect | 1 page | Letter | **By invitation only** |
| `10_Placement_Guide.pdf` | **Internal staff reference** — both audiences in one dense view | 1 page, decision trees + cross-program matrix | 11×8.5 landscape | Internal — staff stack |
| `11_Placement_Juniors.pdf` | **Distribution** — parents asking "what should my kid be in?" | 1 page, parent voice, hero photo | 8.5×11 letter portrait | Public — email or print |
| `12_Placement_Adults.pdf` | **Distribution** — adults asking "where do I fit?" | 1 page, peer voice, cross-program stack | 8.5×11 letter portrait | Public — email or print |
| `13_Annual_Pricing.pdf` | **What it costs all year** — every program × every season + camps + privates + leagues | 1 page, dense reference | 8.5×11 letter portrait | Public + internal |
| `14_Annual_Calendar.pdf` | **The year at a glance** — 12-month Gantt with seasons, camps, leagues, key dates | 1 page, visual timeline | 11×8.5 landscape | Public + internal |

## 10. Out of scope for V2 print (must not appear in any public PDF 01–08)

- **The Pod content** — no name, no pricing, no copy in variants 01–08.
  Pod content lives ONLY in variant 09, which stages in
  `~/Desktop/LBTA_Brochures_v2/_BY_INVITATION_ONLY/` — never in the public
  set, never on the website, never in a hotel concierge stack.
  `check_brochure.py` greps variants 01–08 for `Pod`, `$11,000`, `$8,333`,
  `$6,600`, `$5,000`, "by invitation," "Henry," "UTR 2.48" and fails the
  build if any leaks in.
- **Negotiated/family rates** — published private rates only.
- **Personal coach phone numbers** — main academy line `(949) 534-0457` only,
  unless Andrew approves a coach-specific direct line in writing.
- **PlayByPoint as the guest-facing booking step** — V1 said "pay through City
  of Laguna Beach + PlayByPoint." V2 routes guests to
  `lagunabeachtennisacademy.com/book` (the real `/book` flow).
- **Saska or Michelle on coach lineups** — Saska is back-of-house. Michelle is
  `hidden: true` in `data/coaches.json` for 2026.

## 11. How to regenerate

```bash
# From repo root
bash scripts/build_brochures.sh

# Or skip the network URL check (offline / faster):
SKIP_NETWORK=1 bash scripts/build_brochures.sh
```

Output: `brochures/out/{01..08}_*.pdf`. Pre-flight QA must pass green before
sending to a printer.
