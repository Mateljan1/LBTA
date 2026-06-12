# LBTA Marketing GPT — Setup Folder

> This folder is **everything** needed to build the LBTA Marketing GPT in ChatGPT. Self-contained.

---

## Files in this folder

| File | What it is |
|---|---|
| `identity.md` | Name, description, profile picture spec, default model |
| `system-prompt.md` | The full Instructions field. Paste into Builder. ≤8,000 chars (currently ~7,700). |
| `conversation-starters.md` | The 4 starter prompts shown on first open |
| `capabilities.md` | What's ON / OFF, by phase |
| `activation-script.md` | Andrew's first 30-minute session — get the GPT producing shippable drafts on day 1 |
| `README.md` | This file |

## 5-minute setup (ChatGPT Plus / Team / Enterprise)

1. Go to **chatgpt.com → My GPTs → Create**.
2. Click **Configure** (top right, skip the chat builder).
3. Open `identity.md` in this folder. Copy:
   - **Name** → Name field
   - **Description** → Description field
4. Open `system-prompt.md` in this folder. Copy **everything below the first `---`** into the **Instructions** field. (Verify char count ≤8,000.)
5. Open `conversation-starters.md`. Copy the 4 starters into Conversation Starters.
6. **Knowledge:** click "Upload files" and upload:
   - **All 10 shared files** from `03-KNOWLEDGE-BRAIN/` (`01-academy-facts.md` through `10-guardrails-and-escalation.md`)
   - **The 3 marketing-specific files** from `03-KNOWLEDGE-BRAIN/`: `11-marketing-brand-voice.md`, `12-marketing-surfaces.md`, `13-marketing-asset-library.md`
   - **The marketing voice sample** from `03-KNOWLEDGE-BRAIN/voice-samples/`: `marketing-voice.md`
   - **Total: 14 files.**
7. **Capabilities (Phase 1):** check Web Search, Code Interpreter, Image Generation, Canvas. (See `capabilities.md` for why.)
8. **Actions:** none in Phase 1.
9. **Sharing:** **Only me.** Confirm before saving.
10. Click **Save** → **Update** → **Save**.

## Day-1 verification (run before relying on it)

Open the GPT and run all 4 conversation starters. For each:
- ✅ Voice sounds like Andrew on the website (calm, founder-direct, specific — not a chatbot, not a marketing intern).
- ✅ Forbidden words absent (*elite, world-class, mastery, maximize, boost, unleash, crush, dominate, level up, transformational, don't miss out, limited time, last chance*).
- ✅ Coach roster correct (Andrew + Peter + Allison; **never** Robert; never invented coaches).
- ✅ Phone/email canonical (`(949) 534-0457` / `support@lagunabeachtennisacademy.com`). Andrew's personal cell or email **never** in a draft.
- ✅ Refund policy = 30-day guarantee + account credit (when relevant — usually only for blog/FAQ-adjacent copy).
- ✅ When the GPT doesn't know something, it flags `[NEEDS ANDREW VERIFY: …]` rather than inventing.
- ✅ Image generation output is **always** labeled `DRAFT — not for publishing`.

If any of these fail → re-paste the system prompt, re-upload knowledge files, save again. Most failures = old prompt cached or old knowledge file.

## Day-1 first session

Run `activation-script.md`. 30 minutes. Andrew + this GPT, no distractions. Output: one shippable IG carousel, one drafted partner email, one newsletter section.

## When to re-upload knowledge

| Trigger | Files to re-upload |
|---|---|
| Pricing changed on website | `02-programs-and-pricing.md` |
| Calendar / camp dates changed | `04-calendar-and-camps.md` |
| New coach / coach left | `03-coaches.md` |
| Policy changed (refund, weather, etc.) | `06-policies.md` |
| Voice / brand language updated | `07-voice-and-brand.md`, `11-marketing-brand-voice.md`, `voice-samples/marketing-voice.md` |
| New marketing surface added (TikTok, podcast, etc.) | `12-marketing-surfaces.md` |
| Asset library updated (new approved photos / consents) | `13-marketing-asset-library.md` |
| Any time the live site has a meaningful edit | All affected files |

## Re-upload cadence

- **Monthly minimum:** re-upload `12-marketing-surfaces.md` and `voice-samples/marketing-voice.md` even if "nothing changed" — that's how voice drift gets caught and corrected.
- **Quarterly:** full knowledge refresh against the live site.

## When something feels wrong

Open `05-OPERATIONS/runbooks/`:
- Voice drift → `voice-drift.md` (with marketing-specific probes documented in `marketing-incident.md`)
- Hallucination (invented price, fake testimonial, wrong coach) → `hallucination-incident.md`
- Marketing-specific incident (forbidden word slipped, AI image was almost shipped, partner name was wrong) → `marketing-incident.md`

## Phase 2 unlock checklist

Don't enable Phase 2 (Drive read, Gmail draft, ActiveCampaign-compatible HTML) until **all** of the following are true:

- [ ] 7-day dogfood week passed (see `05-OPERATIONS/eval/dogfood-week-playbook.md` with marketing probes).
- [ ] Zero hallucinations in shipped drafts during dogfood week.
- [ ] Zero forbidden-word leaks in shipped drafts.
- [ ] Zero AI-generated visuals were almost-published.
- [ ] Andrew is using the GPT 5+ times/week organically.
- [ ] `04-INTEGRATIONS/phase-2-marketing-drive-setup.md` and `phase-2-marketing-gmail-setup.md` are written and tested in a sandbox.

## Owner

**Andrew Mateljan.** This GPT is private (Phase 1). Phase 2 may invite a single part-time marketing operator — only with explicit Andrew approval.
