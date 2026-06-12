# PlayByPoint Handoff — All 6 GPTs

> PlayByPoint (PBP) is **not connected** to any LBTA GPT. This is intentional. PBP is the system of record for court bookings, member rosters, and class enrollments. Coaches still work in PBP directly.

---

## Why no integration

1. **PBP has no public LLM-friendly API** for Andrew's account tier (as of April 2026).
2. **PBP is a system of record, not a draft tool.** GPTs are for drafting; bookings are a transaction. We don't want a GPT to "almost book" a court.
3. **Hallucination risk is too high.** A GPT confidently saying "Court 2 is open at 4pm" when it isn't is brand-damaging.

## How GPTs handle PBP-related questions

| Question | What the GPT does |
|---|---|
| "What time does the Saturday adult clinic meet?" | Cite from `02-programs-and-pricing.md` and `04-calendar-and-camps.md`. Route to `/schedules` for live availability. |
| "Is court 2 open Saturday at 9am?" | "I don't have live court availability — please check `playbypoint.com` or call `(949) 534-0457`." |
| "Can you book me a court?" | Route to `/book` and `playbypoint.com`. |
| "Is the 4pm Tuesday clinic full?" | Same as above — route to PBP. |

## What coaches do instead

- **Allison:** logs into PBP directly to confirm enrollment counts and roster.
- **Saska:** same for junior groups.
- **Andrew:** uses PBP for high-performance roster and 1:1 scheduling.

## When this might change

If PBP exposes a developer API in the future:
1. Read-only first (roster + class lookup).
2. Sandbox testing (Andrew only).
3. Security review.
4. Documented integration here.
5. Never write access (no auto-booking).

For now: **PBP stays where it is, GPTs stay where they are, coaches bridge the two.**
