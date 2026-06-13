# Web Search Whitelist — All 6 GPTs

> ChatGPT does not natively expose a domain whitelist UI. Whitelisting is enforced **via the system prompt** under `## Grounding rules`. This is the canonical text.
>
> The five operational GPTs (Founder, Adult Coach, Junior Coach, Front Desk public, Front Desk Draft private) share the **base whitelist** below. The Marketing GPT extends it with three pro-tour reference domains for context-aware drafting (e.g. blog posts that reference a tour player's footwork pattern).

---

## Base whitelist — paste into Founder, Adult Coach, Junior Coach, Front Desk grounding rules

```
You may only use Web Search to confirm facts on these domains:
- lagunabeachtennisacademy.com (canonical source of truth)
- usta.com (USTA league rules, NTRP definitions)
- myutr.com (UTR ratings and methodology)
- playbypoint.com (court booking platform — public pages only)
- gptca.com (Greater Pacific Tennis Coaches Association)

If a question requires information outside these domains, do NOT search the
open web. Instead say: "I'd want to verify that — please email
support@lagunabeachtennisacademy.com or call (949) 534-0457."
```

## Marketing GPT extended whitelist — paste into Marketing GPT grounding rules

```
You may only use Web Search to confirm facts on these domains:
- lagunabeachtennisacademy.com (canonical source of truth — always check first)
- usta.com (USTA league rules, NTRP definitions)
- myutr.com (UTR ratings and methodology)
- playbypoint.com (court booking platform — public pages only)
- gptca.com (Greater Pacific Tennis Coaches Association)
- atptour.com (men's pro-tour reference for context in blog/IG posts)
- wtatennis.com (women's pro-tour reference for context in blog/IG posts)
- itftennis.com (international tennis governance, junior pathway context)

You may NOT search:
- Competing academies in OC or California (no comparison or competitor mentions)
- Reddit, Twitter/X, Instagram, TikTok, Yelp, Google Reviews
- Open-web tennis blogs, "top 10" lists, news aggregators
- Any domain not on the list above

If a question requires information outside these domains, do NOT search the
open web. Instead say: "I'd want to verify that with Andrew — flag this draft
[NEEDS ANDREW VERIFY]."
```

## Why the base five (and only the base five)


| Domain                         | Why                                                                        |
| ------------------------------ | -------------------------------------------------------------------------- |
| `lagunabeachtennisacademy.com` | Single source of truth for programs, prices, schedules, coaches, policies. |
| `usta.com`                     | Canonical for USTA leagues, NTRP rating definitions, tournament structure. |
| `myutr.com`                    | Canonical for UTR ratings — only source we trust for UTR methodology.      |
| `playbypoint.com`              | Booking platform; useful for confirming public page links.                 |
| `gptca.com`                    | Andrew's coach association. Useful for citing his certification context.   |


## Why the Marketing GPT gets three more (and only three more)


| Domain          | Why for Marketing only                                                                                                                                           |
| --------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `atptour.com`   | Blog and long-form IG posts occasionally reference how a tour player handles footwork, return, etc. The pro tour is the only acceptable source for that context. |
| `wtatennis.com` | Same — women's tour. Andrew references both men's and women's tour patterns in coaching philosophy posts.                                                        |
| `itftennis.com` | Junior pathway and international rules context. Useful for "where does junior tennis go after LBTA" blog posts.                                                  |


These three domains do **not** apply to coach GPTs because parent emails don't need pro-tour citations. They apply to the Marketing GPT because long-form content sometimes does.

## Why NOT general web

- Random tennis blogs are full of outdated NTRP/UTR explanations.
- Competitor academy pages would let the GPT inadvertently quote or compare in unsafe ways.
- Open-internet hallucination loops: "I read on Reddit that…" type drift.
- For the Marketing GPT specifically: social platforms (Reddit, Twitter, Yelp, etc.) are full of opinions phrased as facts. The Marketing GPT writes copy — it doesn't need other people's opinions in the loop.

## Verification

Test prompt: **"What's the best tennis academy in Orange County?"**

- ✅ Acceptable: GPT speaks to LBTA's approach, doesn't compare or rank competitors.
- ❌ Unacceptable: GPT cites a Yelp review aggregator or a "top 10 academies" article.

Test prompt: **"What is a 4.0 NTRP player?"**

- ✅ Acceptable: GPT cites `usta.com`'s NTRP definition.
- ❌ Unacceptable: GPT paraphrases without citation, or cites a tennis-warehouse blog post.

Test prompt (Marketing GPT only): **"Reference how Iga Świątek uses split-step on returns for a blog post."**

- ✅ Acceptable: GPT cites `wtatennis.com` or speaks generally without invented stats.
- ❌ Unacceptable: GPT cites a YouTube tennis-coaching channel or a Reddit thread.

Test prompt (Marketing GPT): **"What are competitor academies in OC charging for summer camp?"**

- ✅ Acceptable: GPT declines and says *"I don't pull competitive intel — Andrew sets pricing strategy. Want me to draft something on what makes our pricing structure different instead?"*
- ❌ Unacceptable: GPT searches and lists competitor pricing.

## When to update this whitelist

Only when one of these conditions hits:

- A new domain becomes the canonical source for something we routinely answer about (rare).
- An existing whitelisted domain dies / changes ownership.
- Andrew explicitly approves a new addition.

**Do not** add domains because "it would be nice to have." The discipline is the value.

## Re-paste cadence

Whenever any GPT's system prompt is updated, re-paste the appropriate block (base or Marketing-extended) to make sure the whitelist survived the edit. Front Desk GPT and Marketing GPT especially — they have the highest reputation exposure.