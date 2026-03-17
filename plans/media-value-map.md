# Media Value Map — Every Layout, Every Slot

**Purpose:** So we know exactly where photos and videos appear (or could appear) across the site, especially **trial sign-up, book, and thank-you** flows. No guesswork — every high-value layout is covered.

---

## Conversion flows (trial / book / thank-you)

| Step | Page or component | Has media now? | Layout role | Add / improve |
|------|-------------------|----------------|-------------|---------------|
| **1. Book page** | `/book` | ❌ None | Hero = dark gradient only; "What to Expect" = 3 text steps | **Hero:** Add `book-hero.webp` (16:9, 1920×1080) — courts at golden hour. **Optional:** 3 small images for "What to Expect" (we call you / assessment / path) or one "coach on court" beside the CTA. |
| **2. Trial modal** | TrialBookingModal (from header or book) | ❌ None | Form only | **Optional:** Small trust strip above or below form: e.g. one line "Join 1,000+ players" + tiny image (e.g. community-1) or keep modal minimal for focus. |
| **3. Junior trial** | `/junior-trial` | ✅ 1 hero | Hero = `juniors.webp` (full-bleed); form below | **Keep hero.** Optional: second strip above form — 2–3 images (e.g. camp action, coach with juniors) or one short video loop. |
| **4. Adult trial** | `/adult-trial` | ✅ 1 hero | Hero = `adult-trial-hero.webp`; "12-Week" and "Why This Works" = text only | **Keep hero.** Add **one image** in "Why This Works" (right column): adult group or coach with adults (4:3 or 16:9). Optional: 3 small images for 12-Week phases. |
| **5. Beginner program** | `/beginner-program` | ✅ 1 hero + 1 Vimeo | Hero; Vimeo testimonial | Optional: second image strip (adult beginners) if you have more. |
| **6. Thank-you** | `/thank-you` | ❌ None | SVG pattern + CheckCircle icon | **Optional:** One warm image below headline: "See you on court" — courts or coach (16:9 or 4:3, not too big) to reinforce commitment. |

---

## Full site: page → media slots

| Page | Section / component | Current | Size (W×H) | Aspect | Slot name | Value |
|------|---------------------|---------|------------|--------|-----------|--------|
| **Home** | Hero | Video + poster | 1920×1080 | 16:9 | hero video, hero-poster | Highest |
| **Home** | Founder | andrew-headshot | 600×800 | 3:4 | andrew-portrait / andrew-headshot | High |
| **Home** | Results | karue-training | 1200×675 | 16:9 | karue-training | Highest |
| **Home** | Philosophy | movement, discipline, belonging | 800×800 | 1:1 | philosophy pillars | High |
| **Home** | Programs | juniors, adults, private-lessons | 800×600 | 4:3 | program cards | High |
| **Home** | Why Choose | why-choose-1, why-choose-2 | 800×600 | 4:3 | why-choose | High |
| **Home** | Community | community-1…6 | 800×800 | 1:1 | community grid | Medium |
| **Home** | Destination | laguna-horizon | 1920×1080 | 16:9 | destination | Medium |
| **Home** | CTA | cta-background | 1920×640 | 16:9 or 3:1 | cta | Medium |
| **Book** | Hero | ❌ None | — | — | **book-hero** | **Add — High** |
| **Book** | What to Expect | ❌ None | — | — | **book-expect-1,2,3** (optional) | Optional |
| **Junior trial** | Hero | juniors.webp | 1920×1080 | 16:9 | junior-trial-hero (or juniors) | Highest |
| **Junior trial** | Above form | ❌ None | — | — | **junior-trial-strip** (optional) | Optional |
| **Adult trial** | Hero | adult-trial-hero | 1920×1080 | 16:9 | adult-trial-hero | Highest |
| **Adult trial** | Why This Works | ❌ None | — | — | **adult-trial-why-image** | **Add — High** |
| **Beginner program** | Hero | adult-trial-hero | 1920×1080 | 16:9 | same | High |
| **Thank-you** | Hero / main | ❌ None | — | — | **thank-you-image** (optional) | Optional |
| **Philosophy** | Hero | ❌ None | — | — | philosophy-hero | Add |
| **Philosophy** | Pillars | ❌ In code but need assets | 800×800 | 1:1 | movement, discipline, belonging | Add |
| **Success stories** | Hero | ❌ None | — | — | success-stories-hero | Add |
| **Success stories** | Cards | karue, community-3,1,5 | 800×600 | 4:3 | results + community | OK |
| **Coaches** | Hero | schedules-hero | 1920×1080 | 16:9 | schedules-hero | OK |
| **Coaches** | Founder + cards | andrew-headshot, etc. | 600×800 | 3:4 | coaches | OK |
| **Programs** | Hero | hero.webp | 1920×1080 | 16:9 | programs-hero | OK |
| **Camps** | Hero | community-3 | 1920×1080 | 16:9 | camps-hero | Improve |
| **Leagues / USTA / UTR** | Hero | ❌ None | — | — | leagues-hero | Add |
| **Match play** | Hero | ❌ None | — | — | match-play-hero | Add |
| **Fitness** | Hero / section | community-7, belonging | — | — | fitness-hero | Add |
| **About** | Hero, story | laguna-horizon, private-specialty | — | — | about-hero, gallery | OK / add gallery |
| **Contact** | Hero | laguna-horizon | 1920×1080 | 16:9 | contact-hero | OK |
| **404** | Hero | community-3 | — | — | — | OK |

---

## Layout types and specs (quick reference)

| Layout type | Typical use | Aspect | Export size | Max KB |
|-------------|-------------|--------|-------------|--------|
| **Full-bleed hero** | Home, trial pages, book, philosophy, success stories, camps, leagues | 16:9 | 1920×1080 | 350 |
| **Half-width / founder** | Founder block, coach portrait | 3:4 or 4:5 | 600×800 or 800×1000 | 250 |
| **Card (program, why choose)** | Program cards, Why Choose, story cards | 4:3 | 800×600 | 200 |
| **Square (philosophy, community)** | Philosophy pillars, community grid | 1:1 | 800×800 | 120–200 |
| **Results strip** | Karue, pro/college | 16:9 or 3:2 | 1200×675 or 800×533 | 300 |
| **CTA band** | Footer CTA | 16:9 or 3:1 | 1920×640 | 300 |
| **Inline (section)** | "Why This Works" column, thank-you | 4:3 or 16:9 | 800×600 or 1200×675 | 200–300 |
| **Modal / tiny** | Optional trust in modal | 1:1 small | 400×400 | 80 |

---

## Priority: what to add for maximum value

1. **Book page hero** — First thing someone sees when they click "Book Trial." One image: inviting courts (golden hour). 1920×1080.
2. **Adult trial "Why This Works" image** — One photo (adult group or coach with adults) in the right column. 800×600 or 1200×675.
3. **Thank-you image** (optional) — One "see you on court" photo below the headline. 1200×675 or 800×600.
4. **Philosophy hero + pillars** — So philosophy page matches the rest of the site. Hero 1920×1080; 3 pillars 800×800.
5. **Success-stories hero** — One strong image (pro/celebration or group). 1920×1080.
6. **Leagues / match-play heroes** — So program pages feel complete. 1920×1080 each.
7. **Trial modal** — Optional: one small trust image or leave text-only for focus.

---

## Video placement

| Where | Current | Add / improve |
|-------|---------|---------------|
| Home hero | Video + poster | Keep; ensure 15–30 sec, strong poster frame. |
| VideoTestimonials | Vimeo carousel | Keep; optional one more (adult testimonial). |
| Trial pages | None | Optional: short loop (e.g. 10 sec) in hero or above form. |
| Book page | None | Optional: 15–20 sec "what to expect" or coach intro. |
| Thank-you | None | Optional: autoplay mute 5–10 sec "see you on court." |

---

*Use this map with `plans/canva-asset-brief.md` and Desktop folder placeholders. Every "Add" row is a slot to fill; sizes and aspects are in the table and in the DROP_HERE files.*
