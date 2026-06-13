# LBTA Founder GPT — Setup Folder

> This folder is **everything** needed to build the LBTA Founder GPT in ChatGPT. Self-contained.

---

## Files in this folder

| File | What it is |
|---|---|
| `identity.md` | Name, description, profile picture spec, default model |
| `system-prompt.md` | The full Instructions field. Paste into Builder. |
| `conversation-starters.md` | The 4 starter prompts shown on first open |
| `capabilities.md` | What's ON / OFF, by phase |
| `activation-script.md` | Andrew's first 20-minute session — get the GPT producing useful drafts on day 1 |
| `README.md` | This file |

## 5-minute setup (ChatGPT Plus / Team / Enterprise)

1. Go to **chatgpt.com → My GPTs → Create**.
2. Click **Configure** (top right, skip the chat builder).
3. Open `identity.md` in this folder. Copy:
   - **Name** → Name field
   - **Description** → Description field
4. Open `system-prompt.md` in this folder. Copy **everything below the first `---`** into the **Instructions** field.
5. Open `conversation-starters.md`. Copy the 4 starters into Conversation Starters.
6. **Knowledge:** click "Upload files" and upload all 10 files from `03-KNOWLEDGE-BRAIN/` (the section above this one in the master folder).
7. **Capabilities (Phase 1):** check Web Search, Code Interpreter, Image Generation, Canvas. (See `capabilities.md` for why.)
8. **Actions:** none in Phase 1.
9. **Sharing:** **Only me.** Confirm before saving.
10. Click **Save** → **Update** → **Save**.

## Day-1 verification (run before relying on it)

Open the GPT and run all 4 conversation starters. For each:
- ✅ Voice sounds like Andrew (calm, confident, specific — not a chatbot).
- ✅ Forbidden words absent.
- ✅ Coach roster correct (Andrew + Peter + Allison; **never** Robert).
- ✅ Phone/email canonical (`(949) 534-0457` / `support@lagunabeachtennisacademy.com`).
- ✅ Refund policy = 30-day guarantee + account credit.
- ✅ When the GPT doesn't know something, it asks rather than invents.

If any of these fail → re-paste the system prompt, re-upload knowledge files, save again. Most failures = old prompt cached or old knowledge file.

## Day-1 first session

Run `activation-script.md`. 20 minutes. Andrew + this GPT, no distractions. Output: one shipped draft, one pre-mortem, one Curve check.

## When to re-upload

| Trigger | Files to re-upload |
|---|---|
| Pricing changed on website | `02-programs-and-pricing.md` |
| Calendar / camp dates changed | `04-calendar-and-camps.md` |
| New coach / coach left | `03-coaches.md` |
| Policy changed (refund, weather, etc) | `06-policies.md` |
| Voice / brand language updated | `07-voice-and-brand.md` |
| Any time the live site has a meaningful edit | All affected files |

## When something feels wrong

Open `05-OPERATIONS/runbooks/`:
- Voice drift → `voice-drift.md`
- Hallucination → `hallucination-incident.md`

## Owner

**Andrew Mateljan.** This GPT is private. Nobody else builds, edits, or accesses it.
