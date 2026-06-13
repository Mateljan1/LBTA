# LBTA Founder GPT — Capabilities

> What Andrew's GPT can and cannot do, by phase.

---

## Phase 1 — Day 1 (build day)

| Capability | Setting | Why |
|---|---|---|
| **Web Search** | ✅ ON | Restricted whitelist via system-prompt: `lagunabeachtennisacademy.com`, `usta.com`, `myutr.com`, `playbypoint.com`, `gptca.com`. Blocks open-internet hallucination loops. |
| **Code Interpreter** | ✅ ON | Roster CSVs, schedule grids, refund math, UTR/NTRP analysis. |
| **Image Generation** | ✅ ON | Founder-only. Drill diagrams, court layouts, social-asset moodboards. **Never fake action shots of real players.** |
| **Canvas** | ✅ ON | Long-form drafts (founder letters, philosophy posts, fundraising letters). |
| **Knowledge files** | ✅ All 10 | `01-academy-facts.md` through `10-guardrails-and-escalation.md`. Re-upload after every meaningful site/policy change. |
| **Conversation starters** | ✅ 4 starters | See `conversation-starters.md` in this folder. |

## Phase 2 — Day 14–60 (post-dogfood)

Add — only after `05-OPERATIONS/eval/dogfood-week-playbook.md` passes:

| Capability | Setting | Why |
|---|---|---|
| **Gmail** | ✅ ON, *read + draft only* | Andrew can ask: "Draft a reply to this parent on `support@`." GPT writes a Gmail draft. **Andrew sends.** Setup: `04-INTEGRATIONS/phase-2-gmail-setup.md`. |
| **Google Drive** | ✅ ON, *read-only* | Read from `LBTA / Public-Safe Assets` folder only. Never `LBTA / Private`. Setup: `04-INTEGRATIONS/phase-2-drive-setup.md`. |
| **Google Calendar** | ✅ ON, *read-only* | "What's my Tuesday look like?" Setup: `04-INTEGRATIONS/phase-2-calendar-setup.md`. |

## Phase 3 — Day 60–90 (operations)

| Capability | Setting | Why |
|---|---|---|
| **Slack outbound webhook** | ✅ ON | Founder GPT can ping Andrew's Slack DM with a "this needs you" flag during a drafting session. Skip if Slack is overkill for the team size. |
| **Custom Action: Read Notion** | 🟡 Optional | Read-only access to LBTA Operations workspace. Only after Notion cleanup is finished. |

## Phase 4 — Day 90+ (advanced)

| Capability | Setting | Why |
|---|---|---|
| **Custom Action: PlayByPoint** | 🟡 Optional | Read-only court schedule lookup. Spec: `04-INTEGRATIONS/phase-4-playbypoint.md`. |
| **Custom Action: ActiveCampaign** | 🟡 Optional | Read-only contact lookup. Spec: `04-INTEGRATIONS/phase-4-activecampaign.md`. |

---

## Hard-off (never enable)

| Capability | Why never |
|---|---|
| **Stripe / payments** | Cardholder data, PCI scope, refund authority. Out of scope. |
| **Gmail send (auto-send)** | Founder voice is non-negotiable. Every external reply is human-sent. |
| **Calendar write** | One source of truth: PlayByPoint + Andrew's calendar app. GPT proposes, Andrew commits. |
| **Public sharing** | This GPT is private. Never publish to GPT store, never link share to anyone. |

## Verification (ChatGPT Builder UI)

After saving the GPT:
1. **Configure → Capabilities:** confirm Web Search, Code Interpreter, Image Generation, Canvas all checked.
2. **Knowledge:** count the files. Should be 10.
3. **Actions:** none in Phase 1. (Phase 2+ adds 1–3.)
4. **Sharing:** **"Only me"**. Verify before saving.

## When to re-audit capabilities

- After every Friday Compound Review (see `01-ARCHITECTURE/team-rituals.md`)
- After every red-team audit (see `05-OPERATIONS/eval/red-team-audit-template.md`)
- Whenever a new tool is added (verify it doesn't bypass guardrails)

---

**Default state:** Andrew has all Phase 1 capabilities; nothing else. Add Phase 2 only when dogfood week passes and integrations are documented.
