# LBTA Adult Coach GPT — Setup Folder

> Everything Allison (or Andrew on her behalf) needs to build the LBTA Adult Coach GPT in ChatGPT.

---

## Files in this folder

| File | What it is |
|---|---|
| `identity.md` | Name, description, profile picture spec |
| `system-prompt.md` | Full Instructions field. Paste into Builder. |
| `conversation-starters.md` | 4 starter prompts |
| `capabilities.md` | Tools ON / OFF, by phase |
| `activation-script.md` | Allison's first 20-minute session |
| `README.md` | This file |

## 5-minute setup

1. **chatgpt.com → My GPTs → Create → Configure** (skip chat builder).
2. Open `identity.md` → copy Name and Description.
3. Open `system-prompt.md` → copy everything below the first `---` into **Instructions**.
4. Open `conversation-starters.md` → copy 4 starters in.
5. **Knowledge:** upload all 10 files from `03-KNOWLEDGE-BRAIN/`.
6. **Capabilities (Phase 1):** Web Search, Code Interpreter, Image Generation, Canvas — all checked.
7. **Actions:** none.
8. **Sharing:** Andrew's call — either **Only me** (Andrew owns, Allison uses via screen share) or **Anyone with link** within the LBTA workspace. Document the choice.
9. Save → Update → Save.

## Day-1 verification

Run all 4 conversation starters. Check:
- ✅ Drafts sound like a senior coach who knows the member, not a chatbot.
- ✅ NTRP / UTR / USTA league terms used correctly.
- ✅ Coach roster correct (Andrew + Peter + Allison; **never** Robert).
- ✅ Empathy on emotional / health-related player messages.
- ✅ Canonical phone/email at the close.
- ✅ When the GPT doesn't know, it asks.

## Day-1 first session

Run `activation-script.md`. 20 minutes. **Allison + Andrew** in the room. Outputs: one shipped league email, one weekly clinic recap, one 2026 Spring league lineup recommendation.

## When to re-upload

Same triggers as Founder GPT:
- Pricing / programs changed → `02-programs-and-pricing.md`
- Calendar / camp dates changed → `04-calendar-and-camps.md`
- Coach changes → `03-coaches.md`
- Policy changes → `06-policies.md`
- Voice / brand updates → `07-voice-and-brand.md`

## When something feels wrong

- Voice drift → `05-OPERATIONS/runbooks/voice-drift.md`
- Hallucination → `05-OPERATIONS/runbooks/hallucination-incident.md`
- Allison resists using the GPT → `06-COMMUNICATIONS/coach-1on1-talking-points.md`

## Owner

**Andrew owns the build.** Allison owns the daily use. Updates flow Andrew → GPT → Allison.
