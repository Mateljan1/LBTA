# Court Flyer PDF — Schedule Audit

**Purpose:** Single reference for what the flyer shows and what the data says. Confirm the correct schedule with you before any changes.

---

## 1. Data source (single source of truth)

- **File:** `data/spring-summer-2026.json`
- **Season on flyer:** **Spring** (label "Spring", dates "April 6 – June 13, 2026")
- **How it’s used:** The PDF and `/schedules` page both use `getScheduleByLocationByDay('spring')`, which reads from this file. There is no separate “flyer” schedule.

---

## 2. What the data says (by location)

Below is the **exact** schedule derived from `spring-summer-2026.json` for Spring 2026, by venue and day.

### MOULTON MEADOWS PARK (Court 2)

| Day       | Time          | Program                    | Ages / level      |
|----------|---------------|----------------------------|-------------------|
| **Mon**  | 3:30–4:15 PM  | Little Tennis Stars        | Ages 3–4          |
| **Mon**  | 4:15–5:15 PM  | Red Ball                   | Ages 5–6          |
| **Mon**  | 5:15–6:15 PM  | Orange Ball                | Ages 7–8          |
| **Mon**  | 5:30–7:30 PM  | UTR Green Dot — Competitive | Ages 9–11+       |
| **Mon**  | 6:30–7:30 PM  | Adult Beginner 2 — Bridge  | NTRP 1.0–3.0      |
| **Tue**  | 3:30–4:30 PM  | Orange Ball                | Ages 7–8          |
| **Tue**  | 4:30–5:30 PM  | Green Dot                  | Ages 9–11         |
| **Wed**  | 3:30–4:15 PM  | Little Tennis Stars        | Ages 3–4          |
| **Wed**  | 4:15–5:15 PM  | Red Ball                   | Ages 5–6          |
| **Wed**  | 5:15–6:15 PM  | Orange Ball                | Ages 7–8          |
| **Wed**  | 5:30–7:30 PM  | UTR Green Dot — Competitive | Ages 9–11+       |
| **Wed**  | 6:30–7:30 PM  | Adult Beginner 2 — Bridge  | NTRP 1.0–3.0      |
| **Thu**  | 3:30–4:30 PM  | Orange Ball                | Ages 7–8          |
| **Thu**  | 4:30–5:30 PM  | Green Dot                  | Ages 9–11         |
| **Thu**  | 6:00–7:30 PM  | LiveBall (Int.)            | NTRP 2.0–3.5      |
| **Fri**  | *(no sessions in data)* | —                  | —                 |
| **Sat**  | *(no sessions in data)* | —                  | —                 |
| **Sun**  | *(no sessions in data)* | —                  | —                 |

So at Moulton, the data has **no Friday, Saturday, or Sunday** sessions.

---

### LAGUNA BEACH HIGH SCHOOL (weekdays: Courts 1 & 2 · weekends: Courts 5 & 6)

| Day       | Time              | Program                    | Ages / level      |
|----------|-------------------|----------------------------|-------------------|
| **Mon**  | 4:30–6:30 PM      | Youth Development          | 11–18 (UTR 1.5–5) |
| **Mon**  | 6:30–7:30 PM      | Adult Beginner 1 — True Beginner | NTRP 1.0–2.0 |
| **Mon**  | 6:30–8:30 PM      | High Performance           | 12–17 (UTR 5+)    |
| **Mon**  | 12:00–2:00 PM     | Adult Advanced             | NTRP 4.0+         |
| **Tue**  | 10:00–11:00 AM    | Adult Beginner 1           | NTRP 1.0–2.0      |
| **Tue**  | 11:00 AM–12:30 PM | Adult Intermediate         | NTRP 3.0–3.5      |
| **Wed**  | 4:30–6:30 PM      | Youth Development         | 11–18 (UTR 1.5–5) |
| **Wed**  | 6:30–7:30 PM      | Adult Beginner 1           | NTRP 1.0–2.0      |
| **Wed**  | 6:30–8:30 PM      | High Performance           | 12–17 (UTR 5+)    |
| **Thu**  | 10:00–11:00 AM    | Adult Beginner 1           | NTRP 1.0–2.0      |
| **Thu**  | 11:00 AM–12:30 PM | Adult Intermediate         | NTRP 3.0–3.5      |
| **Fri**  | 4:30–6:30 PM      | UTR Green Dot — Competitive | Ages 9–11+       |
| **Fri**  | 4:30–6:30 PM      | Youth Development          | 11–18 (UTR 1.5–5) |
| **Fri**  | 4:30–6:30 PM      | High Performance           | 12–17 (UTR 5+)    |
| **Fri**  | 9:00–10:30 AM     | Cardio Tennis              | All Levels        |
| **Fri**  | 12:00–2:00 PM     | Adult Advanced             | NTRP 4.0+         |
| **Sat**  | 9:00–9:45 AM      | Little Tennis Stars        | Ages 3–4          |
| **Sat**  | 9:00–10:00 AM     | Adult Beginner 1           | NTRP 1.0–2.0      |
| **Sat**  | 9:45–10:45 AM      | Red Ball                   | Ages 5–6          |
| **Sat**  | 10:00–11:30 AM     | Adult Intermediate         | NTRP 3.0–3.5      |
| **Sat**  | 10:45–11:45 AM     | Orange Ball                | Ages 7–8          |
| **Sat**  | 11:30 AM–1:00 PM   | LiveBall (Int.)            | NTRP 2.0–3.5      |
| **Sat**  | 11:45 AM–12:45 PM  | Green Dot                  | Ages 9–11         |
| **Sun**  | 9:00–10:30 AM      | LiveBall (Int.)            | NTRP 2.0–3.5      |
| **Sun**  | 10:30 AM–12:00 PM  | LiveBall (Adv.)            | NTRP 3.5+         |

---

### ALTA LAGUNA PARK (Courts 1 & 2)

- **Spring 2026:** No programs in the data (UTR Green Dot note says “Mon/Wed at Moulton until Alta Laguna resurface complete”).
- So the flyer will show **Alta** with an empty grid or “No sessions this week” unless we add programs here.

---

## 3. Your screenshot vs this data

From your screenshot (**Moulton Meadows Park — Court 2**), you had:

- **Wed:** Little Tennis Stars 3:30–4:15, Orange Ball 5:15–6:15, Adult Beginner 2 — Bridge 6:30–7:30 → **matches the data above.**
- **Thu:** Orange Ball 3:30–4:30, then **Orange Ball 5:15–6:15** and **Adult Beginner 2 — Bridge 6:30–7:30**  
  In the data, **Thursday at Moulton** has: Orange 3:30–4:30, **Green Dot 4:30–5:30**, **LiveBall (Int.) 6:00–7:30**. There is no second Orange at 5:15–6:15 and no Adult Beginner 2 on Thursday at Moulton.
- **Fri:** Red Ball 4:15–5:15  
  In the data, **Friday at Moulton** has **no sessions**.
- **Sat:** Red Ball 4:15–5:15  
  In the data, **Red Ball on Saturday** is at **LBHS 9:45–10:45 AM**, not at Moulton at 4:15–5:15.

So either:

1. The **data** is wrong and should be updated to match what you want on the flyer (e.g. add/change Thu, Fri, Sat at Moulton), or  
2. There is a **bug** in how the PDF (or web schedule) assigns sessions to days/columns.

---

## 4. What I need from you before changing anything

Please confirm:

1. **Which season** the flyer should represent: **Spring 2026** (April 6 – June 13) only, or also Summer / a different season?
2. **Moulton — correct schedule**
   - Should **Thursday** at Moulton show **Orange 5:15–6:15** and **Adult Beginner 2 — Bridge 6:30–7:30** (and if so, should we remove or move Green Dot 4:30–5:30 and LiveBall 6:00–7:30)?
   - Should **Friday** at Moulton show **Red Ball 4:15–5:15**? If yes, we add that to the data.
   - Should **Saturday** at Moulton show **Red Ball 4:15–5:15**? Right now Red Ball on Saturday is only at LBHS 9:45–10:45 AM in the data.
3. **LBHS**  
   Is the table in Section 2 correct for Laguna Beach High School, or do you want any days/times/classes added, removed, or changed?
4. **Alta**  
   Should the flyer show any Spring 2026 group classes at Alta, or is “no sessions” / empty correct until resurface is done?
5. **Any other programs**  
   Any classes that should exist in Spring 2026 but are missing from `data/spring-summer-2026.json` (or that should be removed)?

Once you confirm the correct schedule (and any corrections to the tables above), we can either:

- **Update only the data** in `data/spring-summer-2026.json` (and leave the PDF/schedule code as-is), or  
- **Fix a bug** in the flyer/schedule code if the data is correct but the PDF is rendering the wrong day/venue.

No schedule changes will be made until you confirm.
