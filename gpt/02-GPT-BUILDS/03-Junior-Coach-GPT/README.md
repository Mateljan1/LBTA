# LBTA Junior Coach GPT — Setup Folder

> Everything Saska (or Andrew on her behalf) needs to build the LBTA Junior Coach GPT in ChatGPT.

---

## Files in this folder

| File | What it is |
|---|---|
| `identity.md` | Name, description, profile picture spec |
| `system-prompt.md` | Full Instructions field. Paste into Builder. |
| `conversation-starters.md` | 4 starter prompts |
| `capabilities.md` | Tools ON / OFF, by phase |
| `activation-script.md` | Saska's first 20-minute session |
| `README.md` | This file |

## 5-minute setup

1. **chatgpt.com → My GPTs → Create → Configure**.
2. Open `identity.md` → copy Name + Description.
3. Open `system-prompt.md` → copy below the first `---` into **Instructions**.
4. Open `conversation-starters.md` → copy 4 starters in.
5. **Knowledge:** upload all 10 files from `03-KNOWLEDGE-BRAIN/`.
6. **Capabilities (Phase 1):** Web Search, Code Interpreter, Image Generation, Canvas — all checked.
7. **Actions:** none.
8. **Sharing:** Andrew's choice (see Adult Coach README — same pattern).
9. Save → Update → Save.

## Day-1 verification

Run all 4 conversation starters. Check:
- ✅ Drafts feel like a coach who sees the kid as a whole person, not a tennis output.
- ✅ Empathy on emotionally charged messages (kid cried, parent worried, etc).
- ✅ Concrete progress signals over generic praise ("she rallied 8 in a row" beats "she made progress").
- ✅ No future-pacing of a kid's outcomes (no "she's headed for D1" predictions).
- ✅ Coach roster correct (Andrew + Peter + Allison; **never** Robert).
- ✅ Safety / wellbeing topics → routed to Andrew, not drafted as a final.

## Day-1 first session

Run `activation-script.md`. 20 minutes. **Saska + Andrew** in the room. Outputs: one shipped parent email, one weekly group recap, one camp packing-list one-pager.

## When to re-upload

- Camp dates or program changes → `02-programs-and-pricing.md` and `04-calendar-and-camps.md`
- New coach / coach left → `03-coaches.md`
- Policy / weather / refund updates → `06-policies.md`
- Voice / brand updates → `07-voice-and-brand.md`

## When something feels wrong

- Voice drift (sounds too generic / too AI) → `05-OPERATIONS/runbooks/voice-drift.md`
- Hallucination (made up a name, date, price) → `05-OPERATIONS/runbooks/hallucination-incident.md`
- Saska resists using it → `06-COMMUNICATIONS/coach-1on1-talking-points.md`

## Owner

**Andrew owns the build.** Saska owns the daily use. Updates flow Andrew → GPT → Saska.
