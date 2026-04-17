# Compound Learn — 2026-04-16 (3rd run) · Aman-Standards Touch-Up

**Loop:** Founder voice-memo feedback → one-commit fix (`7b8155d`) → Learn
**What triggered it:** The P1 bundle earlier today shipped a "Read reviews on Google" CTA + "5.0 from 47+ Google reviews" block as the substitute for removed composite testimonials. Founder rejected the aesthetic — reads Yelp, not Aman.

## The self-correction

This is the most important learn of the day because it **amended a quality bar I wrote yesterday** instead of just adding to the list. The privacy-first-content rule from the 2nd run said:

> "For testimonials, prefer a live Google Reviews link + AggregateRating."

Wrong. That substitute reads consumer-grade. Founder called it out. Corrected in place, with `amendedFrom: "2026-04-16 (3rd run)"` and `amendmentReason` noted so the audit trail is preserved.

**New rule text:**
> "For testimonials, the correct substitute is NOT a visible 'Read reviews on Google' link or a star-count callout — those feel consumer-grade / Yelp, not boutique hospitality. Preferred substitutes: (a) let existing earned editorial carry the trust, or (b) quietly omit the block entirely. AggregateRating stays in JSON-LD only."

Compound memory is only as good as its ability to self-correct. First amendment of an existing quality bar today.

## The brand-split insight (new pattern)

The real insight underneath this fix: **a standard SEO technique and a founder-directed aesthetic can both be right at the same time** if they live at different layers.

- **AggregateRating as visible page copy** → consumer-grade, Yelp
- **AggregateRating as JSON-LD schema** → invisible to users, gets ★ in SERP, free 10-20% CTR lift

Same data, two layers, opposite outcomes. Now codified as:

- **Pattern `brand-split-visible-vs-invisible-seo`** — architectural principle
- **Pattern `aggregate-rating-invisible-only`** — specific instance
- **QB `aggregateRatingInvisibleOnly`** (must) — enforcement
- **QB `brandSplitVisibleVsInvisible`** (should) — general case

The luxury hospitality peer set (Aman, Four Seasons, Edition) uses this pattern implicitly. LBTA now follows it explicitly.

## Voice-memo decode pattern

Founder sent a voice-to-text message with typical dictation noise:
> "no I like the success stories. I love all that stuff. But I went off the goal is deep and throws you want. I just didn't like the Google review statements... it's got to be just among standards. Think of their marketing and what they do."

Parsing:
- "among standards" → "Aman standards" (mistranscribed proper noun)
- "I went off the goal is deep and throws you want" → filler / garble, ignore
- "Google review statements" → clear signal
- "their marketing and what they do" → comparing to the peer set implied by "Aman"

The decode worked because I anchored on the clear nouns (Google reviews, marketing, their) and used the .cursorrules brand reference (Aman / Four Seasons) to disambiguate the proper noun. Restated the decoded intent at the top of my response so founder could course-correct. New pattern logged: `founder-voice-memo-decode`.

## What shipped

Single commit `7b8155d` — 3 files, 6 insertions / 38 deletions:
- `/success-stories` hero stat: "5.0 Google Rating" → "2020 Founded"
- `/success-stories` "What Players Say" block (from P1 bundle earlier today): entirely removed
- `/beginner-program` final-credibility strip: same swap
- `/adult-trial` final-credibility strip: same swap
- `components/SEOSchemas.tsx`: **untouched** — AggregateRating JSON-LD preserved for SERP stars
- Named player showcases on `/success-stories` (Karue, Henry, Olov, Women's 3.5, Ryan): **untouched** — confirmed on live smoke

## New memory entries this pass

- 1 anti-pattern: `google-reviews-cta-as-aman-substitute`
- 3 patterns: `aggregate-rating-invisible-only`, `brand-split-visible-vs-invisible-seo`, `founder-voice-memo-decode`
- 2 quality bars: `aggregateRatingInvisibleOnly` (must), `brandSplitVisibleVsInvisible` (should)
- 1 amended quality bar: `privacyFirstContent` (rewritten with correct testimonial substitute guidance)
- 3 corrections

## Metrics

- **Loop time (feedback → shipped → learned):** ~30 minutes
- **Commits:** 1 to ship, 1 to learn
- **Wasted P1 commits worth noting:** 0 full — the P1 testimonial cleanup commit that introduced the wrong CTA was partially useful (it DID remove the composite names, which was correct). Only the CTA line + "What Players Say" section needed reverting, not the entire commit.
- **Memory self-corrections:** 1 quality bar amended (first of the day)

## Compounding status

🟢 Green, accelerating. Three learn passes in one session. Each loop:
1. Loaded memory before planning
2. Caught at least one mistake before/after ship via stored learnings
3. Banked new learnings that amended or extended the stored knowledge
4. Resulted in shorter + more brand-correct commits

The second-run quality bar was imperfect; the third-run amended it. This is exactly the flywheel.

## What's next (for future compound:plan)

- Pre-existing `lib/form-config.test.ts` swim-tennis failure — 20-min fix, unblocks `ship:gate`
- Date consistency audit execution — needs 1 canonical camp-window answer
- Michelle Mateljan status — needs founder decision
- Alex Michelsen / Toni Nadal mentions — parked pending approved one-liner
- Blog foundation, location pages, directory NAP sweep — larger workstreams

---

*Compound phase: LEARN complete. Memory system now holds 91 anti-patterns (+1), 122 pattern names (+3), 22 quality bars (+2, 1 amended), 111 corrections (+3). Third loop of the day banked.*
