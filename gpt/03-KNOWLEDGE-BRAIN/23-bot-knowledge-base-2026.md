# 23 — Bot Knowledge Base · LBTA 2026

> **Canonical fact sheet for the bot and front-desk GPTs.**  
> Every price, time, and location is grounded in `/data/*.json` or named source. Voice follows `05-voice-and-brand.md`.  
> If the answer here disagrees with another doc, **this file wins for bot replies until reconciled in code.**

**Last verified:** 2026-05-04 (founder corrections applied: LiveBall Intermediate 3.0–4.0, LiveBall min 5 players, Saturday Adult Intermediate included in regular pricing) · **Sources of truth (in priority order):** `data/year2026.json`, `data/winter2026.json`, `data/spring-summer-2026.json`, `data/fall2026.json`, `data/leagues-2026.json`, `data/private-rates.json`, `data/pricing-supplemental.json`, `data/liveball.json`, `data/coaches.json`. UI mirror: `https://lagunabeachtennisacademy.com/schedules`.

**Bot rules of engagement**

- **Never invent numbers.** If a fact isn't in this file or `/data/*.json`, say "let me get the desk on this" and route to `support@lagunabeachtennisacademy.com` or **(949) 534-0457**.
- **Confirm season first** when quoting prices — Winter (Jan 5–Apr 5), Spring (Apr 6–Jun 13), Summer (Jun 15–Aug 29), Fall (Aug 31–Dec 19) all price differently because they have different week counts.
- **Payment confirms the spot.** App and email confirmations alone do **not** hold a place — the City of Laguna Beach charge does.
- Default voice: calm, plain English, short sentences. **No** "elite," "world-class," "maximize," "limited time."

**Canonical links**

- City registration & payment: `https://secure.rec1.com/CA/city-of-laguna-beach/catalog`
- LBTA app — iOS: `https://apps.apple.com/us/app/lbta/id6746348933`
- LBTA app — Android: `https://play.google.com/store/apps/details?id=com.court.laguna`
- Site schedule: `https://lagunabeachtennisacademy.com/schedules`
- Trial booking: `https://lagunabeachtennisacademy.com/book`

---

## Table of contents

1. [Identity & locations](#1-identity--locations) (Q1–Q5)
2. [Seasons & calendar 2026](#2-seasons--calendar-2026) (Q6–Q11)
3. [How registration & payment work](#3-how-registration--payment-work) (Q12–Q19)
4. [Junior programs (ages 3–11)](#4-junior-programs-ages-311) (Q20–Q26)
5. [Junior development & High Performance](#5-junior-development--high-performance) (Q27–Q31)
6. [Adult programs](#6-adult-programs) (Q32–Q37)
7. [LiveBall & Cardio Tennis](#7-liveball--cardio-tennis) (Q38–Q41)
8. [Camps 2026 — every break](#8-camps-2026--every-break) (Q42–Q49)
9. [Leagues — USTA & UTR Match Play](#9-leagues--usta--utr-match-play) (Q50–Q55)
10. [Private lessons](#10-private-lessons) (Q56–Q58)
11. [Policies — cancel, weather, makeup, credits](#11-policies--cancel-weather-makeup-credits) (Q59–Q63)
12. [Coaches](#12-coaches) (Q64–Q66)
13. [Scholarships, racquet rescue, app, escalations](#13-scholarships-racquet-rescue-app-escalations) (Q67–Q70)

---

## 1. Identity & locations

### Q1. What is Laguna Beach Tennis Academy (LBTA)?

**Tags:** identity, about  
**Answer:** Founder-led tennis academy in Laguna Beach, California. Andrew Mateljan runs it; Allison Cronk and Peter DeFrantz are the head coaches. We offer junior programs (ages 3+), adult programs (all levels), High Performance for UTR 8+ juniors, LiveBall, camps, leagues, and private lessons. Three locations across Laguna Beach.  
**Sources:** `data/coaches.json`, `gpt/03-KNOWLEDGE-BRAIN/01-academy-facts.md`  
**Self-serve:** `https://lagunabeachtennisacademy.com/about`

### Q2. Where do you train? What are the three locations?

**Tags:** location, where  
**Answer:**

- **Moulton Meadows Park** — 1098 Balboa Ave, Laguna Beach, CA 92651. Most junior weekday classes (Little Stars, Red/Orange/Green Dot) and adult Beyond Beginner.
- **Alta Laguna Park** — 3300 Alta Laguna Blvd, Laguna Beach, CA 92651. Saturday juniors, Competitive Green Dot, Junior Development (Mon/Wed in Spring/Summer), summer Tennis & Adventure camp, and Saturday UTR Match Play.
- **Laguna Beach High School (LBHS)** — 625 Park Ave, Laguna Beach, CA 92651. Adult New to Tennis, Adult Intermediate/Advanced, High Performance, Junior Development on Fridays, LiveBall (Sat/Sun), Cardio Tennis, Sunday UTR.

Always check the schedule row before going — a few classes flex by season.  
**Sources:** `data/spring-summer-2026.json`, `data/winter2026.json`, `data/fall2026.json`, `data/leagues-2026.json`  
**Self-serve:** `/schedules`

### Q3. Is class today at Moulton or Alta or LBHS?

**Tags:** venue-confusion, where, today  
**Answer:** It depends on the program **and** the day of the week — they don't all live in one place. Tell me which class and what day, and I'll pin the location. Easiest check: `/schedules` lists the venue next to each row, and the LBTA app shows your specific session.  
**Sources:** SMS log themes (Apr 30 / May 2); `data/spring-summer-2026.json`  
**Escalate:** front desk **(949) 534-0457** if the City portal is showing a different venue than our schedule.

### Q4. Is there parking?

**Tags:** parking, where  
**Answer:** Yes at all three locations. Moulton Meadows has a public lot. Alta Laguna has on-street and lot parking. LBHS has school lot parking after 3 PM weekdays and on weekends.  
**Sources:** `gpt/03-KNOWLEDGE-BRAIN/06-faq-and-scenarios.md`

### Q5. Is parent drop-off the norm?

**Tags:** parents, drop-off  
**Answer:** Yes. Coaching happens between coach and player. Parents are welcome to watch from the sideline; concerns get routed to the coach by email or phone after the session.  
**Sources:** `gpt/03-KNOWLEDGE-BRAIN/06-faq-and-scenarios.md`

---

## 2. Seasons & calendar 2026

### Q6. What are the four 2026 seasons and their dates?

**Tags:** calendar, dates  
**Answer:**

- **Winter 2026** — Jan 5 – Apr 5 (13 weeks).
- **Spring 2026** — Apr 6 – Jun 13 (10 weeks; skips May 25, Memorial Day).
- **Summer 2026** — Jun 15 – Aug 29 (11 weeks; skips Jun 19 and Jul 4).
- **Fall 2026** — Aug 31 – Dec 19 (16 weeks; skips Sep 7, Nov 11, Nov 26–27).

Each season has its own pricing (more weeks = higher absolute price; per-session value stays consistent).  
**Sources:** `data/year2026.json` (`seasons` block)  
**Self-serve:** `/schedules`

### Q7. When does registration open for each season?

**Tags:** registration, dates  
**Answer:**

- **Winter 2026** — opened Dec 1, 2025; early-bird deadline Dec 5, 2025 (5% off).
- **Spring 2026** — opened Mar 2, 2026; early bird Mar 20, 2026.
- **Summer 2026** — opened May 1, 2026; early bird May 20, 2026.
- **Fall 2026** — opens Aug 5, 2026; early bird Aug 19, 2026.

Early bird is **5% off** when you register **2+ weeks before** session start.  
**Sources:** `data/year2026.json` (`seasons.*.registrationOpen` / `earlyBirdDeadline`)

### Q8. What discounts are stackable?

**Tags:** discounts, pricing  
**Answer:**

- **Sibling** — 10% off additional siblings in the same program.
- **Early bird** — 5% off (2+ weeks before session start).
- **Multi-session** — 5% off when you register **two consecutive seasons together** (e.g. Winter+Spring or Fall+Winter).
- **Annual** — 10% off when you pay for the full year up front.
- **Multi-week camps** — 10% off when booking **4+ weeks** of camp.

Discounts apply at registration; if a code didn't apply, email `support@lagunabeachtennisacademy.com` and we'll fix it.  
**Sources:** `data/year2026.json` (`discounts`), `data/spring-summer-2026.json` (`discounts`), `data/winter2026.json` (`discounts`)

### Q9. What's the holiday/skip-week schedule?

**Tags:** dates, holidays  
**Answer:**

- **Spring 2026** skips May 25 (Memorial Day).
- **Summer 2026** skips Jun 19 (Juneteenth) and Jul 4 (Independence Day).
- **Fall 2026** skips Sep 7 (Labor Day), Nov 11 (Veterans Day), and Nov 26–27 (Thanksgiving).
- **Winter 2026** has no scheduled skip dates.

Camps cover most public-school breaks (Ski Week, Spring Break, Summer, Back-to-School, Thanksgiving, Winter Break).  
**Sources:** `data/year2026.json`, `data/spring-summer-2026.json`, `data/fall2026.json`, `data/winter2026.json`

### Q10. Does pricing change between seasons?

**Tags:** pricing, seasons  
**Answer:** Yes — the **per-session value is similar**, but each season's total price reflects its number of weeks. Junior 1×/week example:

- **Winter (13 wk):** $546
- **Spring (10 wk):** $420
- **Summer (11 wk):** $462
- **Fall (16 wk):** $672

Always anchor a quote to the season the family is asking about. If unsure which season, ask.  
**Sources:** `data/winter2026.json`, `data/spring-summer-2026.json`, `data/fall2026.json`

### Q11. Do I have to commit to the whole season?

**Tags:** commitment, drop-in  
**Answer:** No. Every group program has a **drop-in** option (typically $50 for juniors and adult-beginner; $70 for development; $90–100 for advanced). Seasonal packages are the better per-session value if you know you'll come back, but drop-in keeps it flexible.  
**Sources:** `data/winter2026.json`, `data/spring-summer-2026.json`, `data/fall2026.json` (each program's `pricing.drop_in`)

---

## 3. How registration & payment work

### Q12. How do I sign up for a program?

**Tags:** registration, how-to  
**Answer:** Two paths:

1. **First time at LBTA?** Book a free trial at `https://lagunabeachtennisacademy.com/book`. We confirm placement, then send you to the City portal for the season.
2. **Already know the program you want?** Register and pay at the City of Laguna Beach catalog: `https://secure.rec1.com/CA/city-of-laguna-beach/catalog`. Filter for "tennis" or your program name.

After payment lands with the City, your spot is held and we see you on the LBTA app roster.  
**Sources:** `components/RegistrationModal.tsx` (`BASE_REC1_URL`), email templates in `assets/emails/spring-2026/prospects/`

### Q13. Who handles payment — LBTA or the City?

**Tags:** payment, city, billing  
**Answer:** **The City of Laguna Beach.** All public-program tuition runs through their portal at `secure.rec1.com`. We don't take credit cards directly for group classes. Private lessons and a few specialty items are invoiced separately by us.  
**Sources:** SMS outbound templates ("payment goes through the City"), email footers "payment there confirms your spot"

### Q14. I got a confirmation but couldn't pay — am I registered?

**Tags:** payment, confirmation, friction  
**Answer:** **A spot isn't held until the City charges your card.** Confirmation emails or app entries can show up before payment clears, but the City portal is the source of truth. If your card was declined or the catalog wouldn't accept payment, text us and we'll either resolve it with the City or hold the seat manually for one session.  
**Sources:** SMS log clusters (Apr 30 – May 2: catalog booking without payment); email footers  
**Escalate:** **(949) 534-0457** or `support@lagunabeachtennisacademy.com`

### Q15. The City catalog isn't showing my class / "green dot" isn't there.

**Tags:** city-bug, catalog  
**Answer:** The City catalog sometimes lags our schedule by a day or two when a session is added, swapped, or moved between locations. If you can't find a class that's on `/schedules`, **don't double-book yourself**. Text **(949) 534-0457** with the day and class name; we'll either get the City to publish it or set up a manual hold.  
**Sources:** SMS log (Apr 30 — Lachlan's mom; "city hasn't updated yet" outbound)

### Q16. Can I pay in person at City Hall?

**Tags:** city, payment  
**Answer:** Yes — the Recreation department at City Hall (505 Forest Ave, Laguna Beach) accepts in-person payments during their office hours. Hours vary; if you're driving over, **call them first** to confirm they're open. If you'd rather not make the trip, online via the City portal is the fastest path.  
**Sources:** SMS log (May 1 — Kaori thread); City of Laguna Beach Recreation department  
**Escalate:** confirm City office hours by phone before driving.

### Q17. Can I pick which days I attend?

**Tags:** schedule, registration  
**Answer:** Yes. When you register, you choose **how many days per week** (1×, 2×, or 3×) and **which days** from the available options for that program (e.g. Mon/Wed, Tue/Thu, Saturday). You're not locked into every listed slot — only the ones you choose.  
**Sources:** `data/faq.json` (id: `day-selection`); program schedule arrays in season JSONs

### Q18. What's the LBTA app for?

**Tags:** app, technology  
**Answer:** The LBTA app is how we handle check-ins, last-minute schedule changes, weather notices, and roster updates. Download it before your second session:

- **iOS:** `https://apps.apple.com/us/app/lbta/id6746348933`
- **Android:** `https://play.google.com/store/apps/details?id=com.court.laguna`

Notifications hit faster than email. Payment still happens on the City portal — the app is for in-day operations.  
**Sources:** SMS outbound templates (Apr 28: "Grab the LBTA app too…")

### Q19. The app screen is blank after I signed up.

**Tags:** app, troubleshoot  
**Answer:** Account activation can take a few minutes the first time, especially if your registration with the City is still propagating. If it's still blank after 30 minutes, text **(949) 534-0457** with the email you signed up with and we'll push your account through manually.  
**Sources:** SMS log (Apr 30 — Kaori "blank screen")  
**Escalate:** **(949) 534-0457**

---

## 4. Junior programs (ages 3–11)

### Q20. Little Tennis Stars (ages 3–4) — what is it and how much?

**Tags:** juniors, little-stars, pricing  
**Answer:** Foam balls, mini courts, movement games. 45-minute sessions. Coach Allison.  
**Schedule (all four 2026 seasons):** Mon 3:30–4:15 PM (Moulton), Wed 3:30–4:15 PM (Moulton), Sat 9:00–9:45 AM (Alta in Spring/Summer; LBHS in Winter/Fall).  
**Pricing (monthly billed):** $120/month for 1×/wk, $200/month for 2×/wk, **$40 drop-in.**  
**Sources:** `data/spring-summer-2026.json` and `data/winter2026.json` and `data/fall2026.json` — `id: little-stars`

### Q21. Red Ball (ages 5–6) — what is it and how much?

**Tags:** juniors, red-ball, pricing  
**Answer:** 36-foot courts, low-compression red balls, real swings, real rallies, real scoring. 60-minute sessions. Coach Allison.  
**Schedule:** Mon 4:15–5:15 PM (Moulton), Wed 4:15–5:15 PM (Moulton), Sat 9:45–10:45 AM (Alta in Spring/Summer; LBHS Winter/Fall).  
**Pricing:**


| Season | 1×/wk | 2×/wk  | 3×/wk  | Sat-only | Drop-in |
| ------ | ----- | ------ | ------ | -------- | ------- |
| Winter | $546  | $1,092 | $1,635 | $497     | $50     |
| Spring | $420  | $840   | $1,260 | $380     | $50     |
| Summer | $462  | $924   | $1,386 | $418     | $50     |
| Fall   | $672  | $1,344 | $2,016 | $608     | $50     |


**Sources:** `data/winter2026.json`, `data/spring-summer-2026.json`, `data/fall2026.json` — `id: red-ball`

### Q22. Orange Ball (ages 7–8) — what is it and how much?

**Tags:** juniors, orange-ball, pricing  
**Answer:** 60-foot courts, orange balls, structured points, real serves. 60-minute sessions. Coach Allison.  
**Schedule:** Mon & Wed 5:15–6:15 PM (Moulton); Tue & Thu 3:30–4:30 PM (Moulton); Sat 10:45–11:45 AM (Alta in Spring/Summer; LBHS Winter/Fall).  
**Pricing matches Red Ball table above** ($420/$546/$462/$672 for 1× by season).  
**Sources:** `data/*.json` — `id: orange-ball`

### Q23. Green Dot (ages 9–11) — what is it and how much?

**Tags:** juniors, green-dot, pricing  
**Answer:** Full-size court, green-dot balls (~25% slower than regulation). Phase Play introduced — rally / attack / defend. 60-minute sessions. Coach Allison.  
**Schedule:** Tue 4:30–5:30 PM (Moulton), Thu 4:30–5:30 PM (Moulton), Sat 11:45 AM–12:45 PM (Alta in Spring/Summer; LBHS Winter/Fall).  
**Pricing matches Red Ball table** ($420/$546/$462/$672 for 1× by season).  
**Sources:** `data/*.json` — `id: green-dot`

### Q24. My child just turned 5 mid-season — they aged out of Little Stars. Refund?

**Tags:** age-band, overlap, refund  
**Answer:** This comes up — birthdays don't line up with our seasons. We typically transfer the prorated balance into the next program (Red Ball) and refund or credit any overlap. Email `support@lagunabeachtennisacademy.com` with the child's name, the date they aged up, and the registrations involved; we'll work it out with the City.  
**Sources:** SMS log clusters (Apr 29 / May 1 — Mila's mom: Little Stars → Red Ball overlap)  
**Escalate:** `support@lagunabeachtennisacademy.com`

### Q25. Saturday-only — is it cheaper?

**Tags:** saturday, pricing  
**Answer:** Yes. Saturday-only juniors get a discounted rate that runs slightly below the 1×/wk weekday price. By season:

- Winter: **$497**
- Spring: **$380**
- Summer: **$418**
- Fall: **$608**

This applies to Red Ball, Orange Ball, and Green Dot.  
**Sources:** `pricing.saturday1x` field across season JSONs

### Q26. My 7-year-old has never played — where do they start?

**Tags:** placement, juniors  
**Answer:** **Orange Ball at Moulton Meadows.** Coach Allison runs it. 60-minute group session. If they need a softer entry, Red Ball is the previous step (foam-ish red balls, 36-foot court). Either way, the trial is free — book at `/book` and we'll place them after the first session.  
**Sources:** `gpt/03-KNOWLEDGE-BRAIN/06-faq-and-scenarios.md` (Q10); `data/spring-summer-2026.json`

---

## 5. Junior development & High Performance

### Q27. Competitive Green Dot — what is it?

**Tags:** development, juniors  
**Answer:** A step up from Green Dot for ages 9–11+ who are ready for more than group classes. Match play, point construction, tournament prep. **Placement by coach invitation.** 2-hour sessions.  
**Schedule (Spring/Summer):** Tue & Thu 4:30–6:30 PM (Alta Laguna), Fri 4:30–6:30 PM (LBHS).  
**Schedule (Winter):** Mon & Wed 5:30–7:30 PM (Moulton — note: Moulton until Alta resurface complete), Fri 4:30–6:30 PM (LBHS).  
**Schedule (Fall):** Tue/Thu/Fri 4:30–6:30 PM (Alta).  
**Pricing:**


| Season | 1×     | 2×     | 3×     | Drop-in |
| ------ | ------ | ------ | ------ | ------- |
| Winter | $810   | $1,620 | $2,268 | $70     |
| Spring | $625   | $1,250 | $1,745 | $70     |
| Summer | $688   | $1,375 | $1,920 | $70     |
| Fall   | $1,000 | $2,000 | $2,792 | $70     |


**Sources:** `data/*.json` — `id: utr-green-dot`

### Q28. Junior Development (ages 11–18, UTR 1–7) — what is it?

**Tags:** development, juniors, UTR  
**Answer:** The first competitive training tier. Two UTR-banded tiers in the same time slot:

- **Tier 1 — UTR 1–4:** foundation work, controlled match play with peers at similar rating.
- **Tier 2 — UTR 4–7:** higher intensity, deeper tactical work, refining competitive identity.

2-hour sessions. Three coaches across the week (Peter, Andrew, Allison) divide each session by band.  
**Schedule (Spring/Summer):** Mon & Wed 4:30–6:30 PM (Alta), Fri 4:30–6:30 PM (LBHS).  
**Winter & Fall:** Mon, Wed, Fri 4:30–6:30 PM at LBHS.  
**Pricing same table as Competitive Green Dot.** Drop-in $70.  
**UTR 8+ players** belong in High Performance — separate program.  
**Sources:** `data/*.json` — `id: youth-development`

### Q29. High Performance (ages 12–17, UTR 8+) — what is it?

**Tags:** high-performance, juniors  
**Answer:** Highest level of training at LBTA. Tournament-condition sessions. **UTR 8+ required, coach approval required.** Run by Andrew + Peter on training days, Peter + Allison on Match Play.  
**Schedule (all 2026 seasons):** Mon 6:30–8:30 PM (Training, LBHS), Wed 6:30–8:30 PM (Training, LBHS), Fri 4:30–6:30 PM (Match Play, LBHS).  
**Pricing:**


| Season | 1×     | 2×     | 3×     | Drop-in |
| ------ | ------ | ------ | ------ | ------- |
| Winter | $810   | $1,620 | $2,268 | $100    |
| Spring | $625   | $1,250 | $1,745 | $100    |
| Summer | $688   | $1,375 | $1,920 | $100    |
| Fall   | $1,000 | $2,000 | $2,792 | $100    |


If you're under 12 or close to UTR 8 and want a placement conversation, ask for Andrew directly.  
**Sources:** `data/*.json` — `id: high-performance`

### Q30. Where does LBTA place its juniors? Real numbers?

**Tags:** placement, recruiting, college  
**Answer:** Andrew has placed **20+ players in D1 college tennis programs** and currently coaches Karue Sell (ATP #262). Past tour players coached: Max McKennon (ATP #458), Ryan Seggerman (ATP #63 doubles). For a recruiting conversation, schedule a call with Andrew — that's a Curve 2 talk, not a quick text answer.  
**Sources:** `data/coaches.json` (Andrew bio); `gpt/03-KNOWLEDGE-BRAIN/03-coaches.md`  
**Escalate:** request a 15-minute call with Andrew via `support@lagunabeachtennisacademy.com`.

### Q31. What does the full junior pathway cost over 10 years?

**Tags:** pathway, investment, juniors  
**Answer:** Honest answer: a serious 10-year competitive pathway (ages 8–18, including private lessons, tournaments, travel, equipment, and physical training) typically lands in the **$150,000–$300,000+** range. Monthly average for committed junior development is $1,500–$3,000 once a player is training 10–15 hours/week. Our placement record means D1 scholarships often offset a meaningful chunk for the right family — Andrew can walk you through the math directly.  
**Sources:** `data/faq.json` (`pro-pathway-cost`)

---

## 6. Adult programs

### Q32. New to Tennis (adult, all levels) — what is it?

**Tags:** adult, beginner  
**Answer:** No rating required, no equipment required — bring sneakers. 1-hour group sessions. Coaches Andrew (Tue/Thu mornings at LBHS) and Peter (Mon/Wed evenings at Moulton; Sat morning at LBHS).  
**Schedule:** Mon & Wed 6:30–7:30 PM (Moulton — Peter), Tue & Thu 10:00–11:00 AM (LBHS — Andrew), Sat 9:00–10:00 AM (LBHS — Peter).  
**Pricing:**


| Season | 1×/wk | 2×/wk | Sat-only | Drop-in |
| ------ | ----- | ----- | -------- | ------- |
| Winter | $546  | $797  | $497     | $55     |
| Spring | $420  | $615  | $380     | $55     |
| Summer | $462  | $677  | $418     | $55     |
| Fall   | $672  | $984  | $608     | $55     |


**Sources:** `data/*.json` — `id: adult-beginner-1`

### Q33. Beyond Beginner — when do I move up?

**Tags:** adult, beginner  
**Answer:** Once you can rally consistently and serve to start a point. Coach Allison runs Beyond Beginner Mon & Wed 6:30–7:30 PM at Moulton. Same price as New to Tennis (1× and 2× columns), no Saturday option.  
**Sources:** `data/*.json` — `id: adult-beginner-2`

### Q34. Adult Intermediate (NTRP 3.0–4.0) — what is it?

**Tags:** adult, intermediate  
**Answer:** 90-minute sessions with 30+ minutes of real match play every class. Tactical thinking begins; USTA-league prep starts here.  
**Schedule:** Tue & Thu 11:00 AM–12:30 PM (LBHS — Andrew), Sat 10:00–11:30 AM (LBHS — Peter). **Saturday is included in the regular 1×/2×/3× package — no separate Saturday pricing.**  
**Pricing:**


| Season | 1×   | 2×     | 3×     | Drop-in |
| ------ | ---- | ------ | ------ | ------- |
| Winter | $756 | $1,437 | $2,042 | $70     |
| Spring | $580 | $1,105 | $1,570 | $70     |
| Summer | $638 | $1,216 | $1,727 | $70     |
| Fall   | $928 | $1,768 | $2,512 | $70     |


**Sources:** `data/*.json` — `id: adult-intermediate`; founder confirmation 2026-05-04.

### Q35. Adult Advanced (NTRP 4.0+) — what is it?

**Tags:** adult, advanced  
**Answer:** 2-hour sessions, six-player max. Full tactical play; feeds directly into USTA leagues and UTR competition. Andrew + Peter co-teach.  
**Schedule:** Mon & Fri 12:00–2:00 PM (LBHS).  
**Pricing:**


| Season | 1×     | 2×     | Drop-in |
| ------ | ------ | ------ | ------- |
| Winter | $810   | $1,620 | $90     |
| Spring | $625   | $1,250 | $90     |
| Summer | $688   | $1,375 | $90     |
| Fall   | $1,000 | $2,000 | $90     |


**Sources:** `data/*.json` — `id: adult-advanced`

### Q36. I played college tennis 10 years ago — where do I fit?

**Tags:** adult, placement  
**Answer:** **Adult Advanced (4.0+)** at LBHS, Mon & Fri 12–2 PM with Andrew + Peter. If your goal is matches, also look at **USTA Leagues** (women's, mixed, 55+) and Sunday LiveBall Advanced. Drop in for a session before committing — first one's on us if you book through `/book`.  
**Sources:** `gpt/03-KNOWLEDGE-BRAIN/06-faq-and-scenarios.md`

### Q37. Free trial for adults?

**Tags:** trial, adult  
**Answer:** Yes — first group session is on us when you book through `/book`. Specialty sessions (High Performance, certain camps) have a discounted trial rate; we'll tell you up front before you pay.  
**Sources:** Email templates ("Free trial on all group classes"); SMS outbound (Apr 28 — Jennifer thread)

---

## 7. LiveBall & Cardio Tennis

### Q38. What is LiveBall? What level is it?

**Tags:** liveball, level  
**Answer:** Coach-fed, doubles-first, fast-rotation play. 150–200 ball contacts per session. Two levels:

- **Intermediate — NTRP 3.0–4.0.** Thursday (Moulton), Saturday (LBHS), and Sunday 9:00 AM (LBHS).
- **Advanced — NTRP 4.0+.** Sunday 10:30 AM (LBHS).

If you don't have a rating, we'll place you after one session.  
**Sources:** `data/spring-summer-2026.json`, `data/winter2026.json`, `data/fall2026.json` — `id: liveball`; founder confirmation 2026-05-04.

### Q39. What's the LiveBall schedule and price?

**Tags:** liveball, schedule, pricing  
**Answer:** Same schedule and price across all four 2026 seasons:

- **Thursday 6:00–7:30 PM** — Moulton Meadows (Allison)
- **Saturday 11:30 AM–1:00 PM** — LBHS (Peter)
- **Sunday 9:00–10:30 AM** — LBHS (Peter & Andrew) — **Intermediate (3.0–4.0)**
- **Sunday 10:30 AM–12:00 PM** — LBHS (Peter & Andrew) — **Advanced (4.0+)**

**Drop-in $50** · **Monthly $150** (unlimited LiveBall + Cardio Tennis).  
**Sources:** `data/spring-summer-2026.json`, `data/winter2026.json`, `data/fall2026.json` — `id: liveball`

### Q40. Is LiveBall ever cancelled?

**Tags:** liveball, cancellation, minimum  
**Answer:** Yes. **LiveBall needs a minimum of 5 players to run** — below that, we cancel and credit the session. Cancellations go out by SMS/email and on the LBTA app the morning of, sometimes the night before. If you show up and no one's there, text **(949) 534-0457** — we'll either find you a sub-in slot or convert it to a credit.  
**Sources:** Founder confirmation 2026-05-04 (`minPlayersToRun: 5`); SMS log (Apr 30 — outbound cancellation thread); SMS log (May 2 — Marylien thread)  
**Escalate:** **(949) 534-0457**

### Q41. Cardio Tennis — what is it, when, how much?

**Tags:** cardio-tennis, fitness  
**Answer:** Tennis-based fitness session, all levels, 90 minutes. **Friday 9:00–10:30 AM at LBHS** (every season). **Drop-in $50, Monthly $150** (same monthly bundles with LiveBall).  
**Sources:** `data/*.json` — `id: cardio-tennis`

---

## 8. Camps 2026 — every break

### Q42. Ski Week Camp — when and how much?

**Tags:** camp, ski-week, presidents-week  
**Answer:** **February 16–20, 2026.** Full day 9:00 AM–3:00 PM at LBHS. Ages 5–14. **$525/week** (~$105/day). Lunch included; skills clinics + match play.  
**Sources:** `data/year2026.json` (`camps[].id: ski-week`)

### Q43. Spring Break Camp — when and how much?

**Tags:** camp, spring-break  
**Answer:** **March 30 – April 2, 2026 (Mon–Thu).** Two tracks:

- **Tennis & Games (ages 5–11)** at Alta Laguna — morning 9 AM–12 PM, afternoon 12–3 PM.
- **Junior Development (ages 12–17)** at LBHS — morning 9 AM–12 PM, afternoon 1–4 PM.

**$325 for the week** (Mon–Thu) **or $85/half-day drop-in.** Coach Peter runs it.  
**Sources:** `data/year2026.json` (`spring-break`); `data/spring-summer-2026.json` (`camps.springBreak`)

### Q44. Summer Camps — when, how much, what tracks?

**Tags:** camp, summer  
**Answer:** **June 15 – August 29, 2026.** Two tracks at two locations:

**Tennis & Adventure (ages 5–11) — Alta Laguna Park · Mon–Thu**


| Option      | Hours      | Per week | Per day (drop-in) |
| ----------- | ---------- | -------- | ----------------- |
| Full Day    | 9 AM–3 PM  | $495     | $99               |
| Half Day AM | 9 AM–12 PM | $325     | $85               |
| Half Day PM | 12–3 PM    | $325     | $85               |


**Summer Training Camp (ages 12–17) — LBHS · Mon–Fri (by application)**


| Option   | Hours                 | Per week | Per day |
| -------- | --------------------- | -------- | ------- |
| Full Day | 9 AM–3 PM             | $595     | $120    |
| Half Day | 9 AM–12 PM or 12–3 PM | $325     | $85     |


**Multi-week discount:** 10% off when you book **4+ weeks** together. Coach Peter runs camps; Andrew teaches in Summer Training.  
**Sources:** `data/year2026.json` (`camps.summer`), `data/spring-summer-2026.json` (`camps.summer`)

### Q45. Was Swim & Tennis Camp running in 2026?

**Tags:** camp, swim-tennis  
**Answer:** No — the pool at Alta Laguna is closed for construction in summer 2026. We're running **Tennis & Adventure Camp** instead at the same location (tennis instruction + field games + crafts + Water Day Thursdays). Pricing follows the Tennis & Adventure table (Q44).  
**Sources:** `data/year2026.json` (`camps[].id: swim-tennis`, `suspended: true`)

### Q46. Back-to-School Mini Camp — when and how much?

**Tags:** camp, back-to-school  
**Answer:** **August 17–20, 2026 (Mon–Wed, 3 days).** Same tracks as summer (Tennis & Adventure ages 5–11 at Alta; Summer Training ages 12–17 at LBHS).


| Track              | Full Day (3 days) | Half Day (3 days) | Per day |
| ------------------ | ----------------- | ----------------- | ------- |
| Tennis & Adventure | $372              | $245              | ~$124   |
| Training           | $447              | $245              | ~$149   |


**Sources:** `data/year2026.json` (`camps[].id: back-to-school`)

### Q47. Thanksgiving Break Camp — when and how much?

**Tags:** camp, thanksgiving  
**Answer:** **November 23–25, 2026 (Mon–Wed).** Half-day options only (9 AM–12 PM or 12–3 PM). Tennis & Games (5–11) at Alta — **$221/3 days**. Junior Development (12–17) at LBHS — **$244/3 days**. Sibling 10% off applies. Coach Peter.  
**Sources:** `data/year2026.json` (`camps[].id: thanksgiving`)

### Q48. Winter Break Camp — when and how much?

**Tags:** camp, winter-break  
**Answer:** **Two 4-day sessions:** Dec 21–24 and Dec 28–31, 2026. Families can register for one or both. Tennis & Adventure (5–11) at Alta; Junior Development (12–17) at LBHS.


| Option                   | Per session (4 days) |
| ------------------------ | -------------------- |
| T&A Full Day (9 AM–3 PM) | $425                 |
| T&A Half Day             | $280                 |
| JrDev Half Day           | $280                 |


Drop-in $85–106/day depending on track.  
**Sources:** `data/year2026.json` (`camps[].id: winter-break`)

### Q49. Camp rain policy / makeups?

**Tags:** camp, weather, makeup  
**Answer:** We try to swap to an alternate day in the same week first. If no swap is possible, you get **make-up credit** good for any future camp or program. Pro-rated refunds available on request — email `support@lagunabeachtennisacademy.com`.  
**Sources:** `gpt/03-KNOWLEDGE-BRAIN/06-faq-and-scenarios.md` (Q17)

---

## 9. Leagues — USTA & UTR Match Play

### Q50. USTA Adult Leagues — what's offered in 2026?

**Tags:** league, USTA  
**Answer:** Four leagues:

- **Adult 18 & Over** — Apr 17 – Jul 5 (~11 wk). 2 singles + 3 doubles, same gender. Levels 2.5–5.0. **$458 (12 matches) / $393 (14 matches).** Deadline Apr 1.
- **Friday Women's** — Apr 17 – Jul 5 (~11 wk). 2 singles + 3 doubles, women only. Levels 2.5–4.5. Same prices.
- **Mixed 40+ Doubles** — Apr 18 – Sep 6 (~20 wk). 3 doubles lines, mixed, combined NTRP 6.0–10.0. Same prices.
- **Adult 55+ Doubles** — May 2 – Aug 16 (~15 wk). 3 doubles lines, same gender, combined NTRP 6.0–9.0. Same prices. Deadline Apr 19.

**+ USTA membership $48/year** (one-time annual fee, separate from league fee).  
**Sources:** `data/leagues-2026.json` (`usta`)

### Q51. UTR Match Play — when and where?

**Tags:** UTR, match-play  
**Answer:** **Season:** April 11 – June 6, 2026 · Grand Finals June 6.

- **Saturdays at Alta Laguna Park** — Color Ball, UTR 1–7 Singles.
- **Sundays at LBHS** — UTR 3–12 Singles, UTR 1–12 Doubles.

Allison runs the league pathway.  
**Sources:** `data/leagues-2026.json` (`utr`)

### Q52. UTR Match Play divisions and prices?

**Tags:** UTR, divisions, pricing  
**Answer:**


| Division                     | Day & Time       | Venue       | Format                                                               | Season | Drop-in |
| ---------------------------- | ---------------- | ----------- | -------------------------------------------------------------------- | ------ | ------- |
| Color Ball (juniors, scaled) | Sat 1:30–4:00 PM | Alta Laguna | Pod Round Robin                                                      | $349   | $55     |
| UTR 1–7 Singles              | Sat 4:00–6:30 PM | Alta Laguna | 8-Game Pro Sets                                                      | $399   | $65     |
| UTR 3–12 Singles             | Sun 3:00–5:30 PM | LBHS        | Varies week to week                                                  | $399   | $65     |
| UTR 1–12 Doubles             | Sun 5:30 PM      | LBHS        | 8-Game Pro Sets (paired by combined UTR — show up solo, we pair you) | $399   | $65     |


Coach is on court for every Color Ball match. Underhand serves and drop feeds welcome.  
**Sources:** `data/leagues-2026.json` (`utr.divisions`)

### Q53. NTRP-to-UTR conversion?

**Tags:** UTR, NTRP, level  
**Answer:** Rough mapping (men / women UTR):


| NTRP | Men UTR | Women UTR |
| ---- | ------- | --------- |
| 2.5  | 1.5–2.5 | 1.5–2.5   |
| 3.0  | 2.5–3.5 | 2.3–3.3   |
| 3.5  | 3.5–4.8 | 3.0–4.0   |
| 4.0  | 4.8–6.5 | 4.0–5.0   |
| 4.5  | 6.5–8.0 | 5.0–6.0   |
| 5.0+ | 8.0+    | 6.0+      |


**Sources:** `data/leagues-2026.json` (`utr.ntrpToUtr`)

### Q54. NTRP self-rating quick guide?

**Tags:** NTRP, level  
**Answer:**

- **2.5** — Rallies but inconsistent. Learning serve. New to match play.
- **3.0** — Consistent rally. Developing serve. Plays points with intention.
- **3.5** — Reliable groundstrokes and serve. Can place the ball. Comfortable in doubles.
- **4.0** — Strong all-court game. Spin, pace variation, tactical patterns.
- **4.5+** — Tournament-level. Weapons. Advanced tactics.

**Sources:** `data/leagues-2026.json` (`usta.ntrpGuide`)

### Q55. How do I sign up for a league or UTR Match Play?

**Tags:** league, registration  
**Answer:** Same City portal as everything else: `https://secure.rec1.com/CA/city-of-laguna-beach/catalog`. For USTA Adult Leagues you'll also need a current **USTA membership ($48/year)** — register at `usta.com` first if you don't have one. Email Allison via `support@lagunabeachtennisacademy.com` if you want her to recommend a team.  
**Sources:** `data/leagues-2026.json`, `data/pricing-supplemental.json` (`ustaAdultLeague`)

---

## 10. Private lessons

### Q56. Private lesson rates?

**Tags:** private, pricing  
**Answer:**


| Coach                                   | 60-min | 90-min | 10-pack | 20-pack | Availability |
| --------------------------------------- | ------ | ------ | ------- | ------- | ------------ |
| Andrew Mateljan (Founder)               | $250   | $350   | $2,300  | $4,200  | Limited      |
| Peter DeFrantz (Head Coach, Junior Dev) | $120   | $165   | $1,100  | $2,000  | Available    |
| Allison Cronk (Head Coach, Youth)       | $120   | $165   | $1,100  | $2,000  | Available    |


10-pack and 20-pack save vs single sessions; book at `/book` or email `support@lagunabeachtennisacademy.com`.  
**Sources:** `data/private-rates.json`, `data/year2026.json` (`privateCoaching`)

### Q57. Cancellation window for private lessons?

**Tags:** private, cancellation  
**Answer:** **24 hours' notice** to reschedule without charge. Inside 24 hours we'll always try to fill your slot, but the lesson may be billed in full. Weather cancellations are rescheduled at no charge.  
**Sources:** `gpt/03-KNOWLEDGE-BRAIN/06-faq-and-scenarios.md`, `data/faq.json` (`cancellation`)

### Q58. Can I request a specific coach?

**Tags:** private, coach  
**Answer:** Yes — pick the coach when you book a private. For group programs, the coach is set by program (e.g. Allison runs juniors and Beyond Beginner; Peter runs Junior Dev and adult Saturday; Andrew teaches Tue/Thu morning adult and High Performance). If a coach isn't a fit after a session, tell us and we'll re-route you.  
**Sources:** `gpt/03-KNOWLEDGE-BRAIN/06-faq-and-scenarios.md` (Q20); `data/coaches.json`

---

## 11. Policies — cancel, weather, makeup, credits

### Q59. Group session cancellation window?

**Tags:** cancellation, group  
**Answer:** **48 hours' notice** is the standard for group programs, but we're flexible — day swaps within the same week are routine. Email `support@lagunabeachtennisacademy.com` or text **(949) 534-0457**.  
**Sources:** `gpt/03-KNOWLEDGE-BRAIN/06-faq-and-scenarios.md` (Q24)

### Q60. 30-Day Money-Back Guarantee — how does it work?

**Tags:** refund, guarantee  
**Answer:** If LBTA isn't the right fit within your **first 30 days of training**, we refund your unused tuition in full — no questions, no friction. **After day 30**, remaining sessions convert to **LBTA account credit** you can apply to any future program, camp, or private lesson.  
**Sources:** `data/faq.json` (`cancellation`)

### Q61. Rain / weather cancellation — what happens?

**Tags:** weather, rain, makeup  
**Answer:** When we cancel for weather, you get a **make-up session** in the same or next week, or **account credit** if no make-up slot fits. We try to send the call by **email and the LBTA app the night before** when possible; sometimes the call is morning-of. If you didn't see the notice and showed up, text **(949) 534-0457** so we log the credit.  
**Sources:** `gpt/03-KNOWLEDGE-BRAIN/06-faq-and-scenarios.md`; SMS log (May 3 — Marylien thread)  
**Escalate:** **(949) 534-0457**

### Q62. How do I use my LBTA credit?

**Tags:** credit, account  
**Answer:** Reply to the credit email or text **(949) 534-0457** with which session/camp you want to apply it to. We'll either book the slot for you or coordinate with the City portal so you don't double-pay. Credits don't expire within the same calendar year.  
**Sources:** SMS log (May 3 — Marylien follow-up)  
**Escalate:** front desk applies credits manually because the City portal doesn't always know about them.

### Q63. What if my child loses interest after a few weeks?

**Tags:** refund, juniors  
**Answer:** Within the first 30 days, we refund the unused balance per the 30-Day Guarantee. After 30 days, we convert to credit for a future program — sometimes the right move is dropping from 2× to 1× per week, or shifting to a different coach. Email `support@lagunabeachtennisacademy.com` and we'll talk it through.  
**Sources:** `data/faq.json` (`cancellation`)

---

## 12. Coaches

### Q64. Andrew Mateljan — who is he?

**Tags:** coaches, andrew  
**Answer:** Founder & Director of Tennis. 20 years of coaching, including 7 years across Spain, Croatia, and Norway. Former #3 SoCal junior, #12 nationally. Currently coaches Karue Sell (ATP #262); previously Max McKennon (ATP #458) and Ryan Seggerman (ATP #63 doubles). Founder of Fit4Tennis (100K+ users). Head coach of LBHS Boys Varsity. Teaches Adult Intermediate (Tue/Thu mornings), High Performance, and select privates.  
**Sources:** `data/coaches.json` (`andrew-mateljan`)

### Q65. Peter DeFrantz — who is he?

**Tags:** coaches, peter  
**Answer:** Head Coach, Junior Development. USPTA + PTR certified. College tennis at Mt. San Jacinto. 8+ years coaching across SoCal. Runs Junior Development (Mon/Wed Alta), summer camps, Saturday adult sessions, LiveBall (Saturday), and most camp weeks. Player-centered, progressive style.  
**Sources:** `data/coaches.json` (`peter-defrantz`)

### Q66. Allison Cronk — who is she?

**Tags:** coaches, allison  
**Answer:** Head Coach, Youth Programs. Played NCAA at Shepherd University and NAIA at Westcliff (Dean's List both). 5+ years coaching across five SoCal academies. CPR/AED certified. Runs all junior weekday classes (Little Stars through Green Dot), Beyond Beginner (Mon/Wed), and Thursday LiveBall at Moulton. Technical, patient, adapts to whoever's across the net.  
**Sources:** `data/coaches.json` (`allison-cronk`)

---

## 13. Scholarships, racquet rescue, app, escalations

### Q67. Do you offer scholarships?

**Tags:** scholarship, financial-aid  
**Answer:** Yes. We award **~$25,000 in need-based scholarships annually**, covering **25–50%** of program tuition. Andrew reviews each application personally. Apply at `https://lagunabeachtennisacademy.com/apply-scholarship` — typical response within a week.  
**Sources:** `data/year2026.json` (`scholarships`)

### Q68. Racquet Rescue (restringing) — what's the price list?

**Tags:** racquet-rescue, stringing  
**Answer:** On-site stringing and customization at LBTA:

- **Standard stringing:** $25/racquet
- **Same-day service:** $35/racquet
- **Customization:** $50+/racquet
- **Grip replacement:** $10/racquet

**Strings (per set):** Luxilon $20–35 · Babolat $18–30 · Wilson $15–28 · Solinco $15–25.  
**Sources:** `data/pricing-supplemental.json` (`racquetRescue`)  
**Self-serve:** `https://lagunabeachtennisacademy.com/racquet-rescue`

### Q69. Do you have a payment plan?

**Tags:** payment, billing  
**Answer:** Yes. Email `support@lagunabeachtennisacademy.com` to set up a **two-payment or three-payment plan**. We don't charge interest on plans. The City portal isn't built for split billing, so we coordinate it manually.  
**Sources:** `gpt/03-KNOWLEDGE-BRAIN/06-faq-and-scenarios.md` (Q7)

### Q70. When do I escalate to a human, and how?

**Tags:** escalation, support  
**Answer:** Bot should hand off when the question involves any of:

- A specific refund, credit, or invoice number
- A City portal failure (payment declined, class invisible, conflicting confirmations)
- Roster moves between coaches
- Scholarship decisions
- Anything where the family is upset

Hand-off paths:

- Phone: **(949) 534-0457**
- Email: `support@lagunabeachtennisacademy.com`
- Founder direct (high-stakes recruiting, HP placement, complaints): request a 15-minute call with Andrew.

When in doubt, hand off — false confidence is worse than a 2-hour delay.  
**Sources:** `gpt/03-KNOWLEDGE-BRAIN/10-guardrails-and-escalation.md` (referenced); `.cursorrules` Part 21 (intelligent AI usage — no atrophy on judgment calls)

---

## Appendix A — At-a-glance pricing matrix (2026)

**Junior 1× / 2× / 3× per season:**


| Program                       | Winter (13w)           | Spring (10w)           | Summer (11w)           | Fall (16w)               |
| ----------------------------- | ---------------------- | ---------------------- | ---------------------- | ------------------------ |
| Red / Orange / Green Dot      | $546 / $1,092 / $1,635 | $420 / $840 / $1,260   | $462 / $924 / $1,386   | $672 / $1,344 / $2,016   |
| Little Stars (monthly billed) | $120 / $200 (1×/2×)    | $120 / $200            | $120 / $200            | $120 / $200              |
| Competitive Green Dot         | $810 / $1,620 / $2,268 | $625 / $1,250 / $1,745 | $688 / $1,375 / $1,920 | $1,000 / $2,000 / $2,792 |
| Junior Development            | $810 / $1,620 / $2,268 | $625 / $1,250 / $1,745 | $688 / $1,375 / $1,920 | $1,000 / $2,000 / $2,792 |
| High Performance              | $810 / $1,620 / $2,268 | $625 / $1,250 / $1,745 | $688 / $1,375 / $1,920 | $1,000 / $2,000 / $2,792 |


**Adult 1× / 2× per season:**


| Program                       | Winter                 | Spring                 | Summer                 | Fall                   |
| ----------------------------- | ---------------------- | ---------------------- | ---------------------- | ---------------------- |
| New to Tennis                 | $546 / $797            | $420 / $615            | $462 / $677            | $672 / $984            |
| Beyond Beginner               | $546 / $797            | $420 / $615            | $462 / $677            | $672 / $984            |
| Adult Intermediate (1×/2×/3×) | $756 / $1,437 / $2,042 | $580 / $1,105 / $1,570 | $638 / $1,216 / $1,727 | $928 / $1,768 / $2,512 |
| Adult Advanced (1×/2×)        | $810 / $1,620          | $625 / $1,250          | $688 / $1,375          | $1,000 / $2,000        |


**Drop-in (consistent across seasons):**
Juniors $50 · Little Stars $40 · Adult Beginner $55 · Adult Intermediate $70 · Adult Advanced $90 · Competitive Green Dot / Junior Dev $70 · High Performance $100 · LiveBall / Cardio Tennis $50 · Color Ball (UTR) $55 · UTR Singles/Doubles $65.

**Monthly bundles:**
LiveBall $150/month · Cardio Tennis $150/month (each unlimited).

**Sources:** every cell traces to `data/winter2026.json`, `data/spring-summer-2026.json`, or `data/fall2026.json`.

---

## Appendix B — Coverage matrix vs. SMS log clusters (May 2026 sample)


| SMS cluster                                              | Covered in    | Status                           |
| -------------------------------------------------------- | ------------- | -------------------------------- |
| "Where is class today — Moulton or Alta?"                | Q3, Q39       | ✅                                |
| "I can't pay on the City site"                           | Q14, Q15      | ✅                                |
| "Confirmed in app but didn't pay"                        | Q14           | ✅                                |
| "City catalog isn't showing my class"                    | Q15           | ✅                                |
| "Can I pay in person at City Hall?"                      | Q16           | ✅                                |
| "App is blank after I signed up"                         | Q19           | ✅                                |
| "Want a free trial — Saturday afternoon, serves"         | Q12, Q37      | ✅ (escalate for specialty trial) |
| "Class cancelled today — credit?"                        | Q40, Q61, Q62 | ✅                                |
| "Rain make-up — already paid?"                           | Q49, Q61      | ✅                                |
| "Daughter aged out of Little Stars mid-season — refund?" | Q24           | ✅                                |
| "LiveBall time confusion (10–11:30 vs 11:30–1)"          | Q39           | ✅                                |
| "What level is Intermediate vs Advanced LiveBall?"       | Q38           | ✅                                |
| "Cancel today's lesson — see Thursday slot?"             | Q18, Q57      | ✅ (app + private cancellation)   |
| "Are we registered for today?"                           | Q14, Q17      | ✅                                |
| "Need to use credit from a paid session"                 | Q62           | ✅                                |
| "Sibling discount?"                                      | Q8            | ✅                                |
| "Camp registration for daughter"                         | Q42–Q48       | ✅                                |
| "Standing private lesson — schedule?"                    | Q56–Q58       | ✅                                |
| "Reduced amount as a sub vs. core player?"               | Q70           | Escalate (case-by-case)          |
| "USTA Registration card on file invalid"                 | Q70           | Escalate (City billing)          |
| "Schedule overlap — book the wrong time"                 | Q15, Q17      | ✅                                |
| "Need to make up missed session"                         | Q49, Q59, Q61 | ✅                                |
| "Add another day mid-season"                             | Q17, Q70      | ✅ + Escalate (revised invoice)   |


---

## Appendix C — Reconciliation notes

### Resolved 2026-05-04 (founder confirmation)

1. ✅ **LiveBall Intermediate is NTRP 3.0–4.0** (not 2.5+). All four time slots are Intermediate **except** Sunday 10:30 AM which is Advanced (4.0+). JSON `ages`, `schedule.note`, and `description` updated across `winter2026.json`, `spring-summer-2026.json`, and `fall2026.json`.
2. ✅ **LiveBall minimum 5 players to run.** Codified as `minPlayersToRun: 5` in all three season JSONs and in KB Q40.
3. ✅ **Saturday Adult Intermediate is included in the regular package** (1×/2×/3×). It is not separately priced. `pricingNote` and the Saturday `note: "Separate pricing"` field removed from all three season JSONs; KB Q34 updated.

### Open

1. **City office hours** — no verified source in repo. Bot tells callers to phone the City before driving over.
2. **Multiple Rec1 deep links.** Marketing emails carry filter-encoded variants; bot uses the **base catalog URL** (matches `RegistrationModal.tsx`) so we don't ship a stale filter.

When any of these resolve in `/data/*.json`, update this file and bump `Last verified`.