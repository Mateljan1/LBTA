# LBTA Adult Coach GPT — Capabilities

> What Allison's GPT can and cannot do, by phase.

---

## Phase 1 — Day 1

| Capability | Setting | Why |
|---|---|---|
| **Web Search** | ✅ ON | Whitelisted: `lagunabeachtennisacademy.com`, `usta.com`, `myutr.com`, `playbypoint.com`. |
| **Code Interpreter** | ✅ ON | League rosters, lineups, NTRP/UTR sorts, schedule grids. |
| **Image Generation** | ✅ ON | Drill diagrams, court layouts only. **Never fake action shots of real players.** |
| **Canvas** | ✅ ON | Weekly newsletters, league bulletins. |
| **Knowledge files** | ✅ All 10 | Same shared brain as the other GPTs. |
| **Conversation starters** | ✅ 4 starters | See `conversation-starters.md`. |

## Phase 2 — Day 14–60

Add — only after Allison's dogfood week passes:

| Capability | Setting | Why |
|---|---|---|
| **Gmail** | ✅ ON, *read + draft only* | Drafts on `support@lagunabeachtennisacademy.com`. **Allison sends.** Setup: `04-INTEGRATIONS/phase-2-gmail-setup.md`. |
| **Google Drive** | ✅ ON, *read-only* | Read from `LBTA / Public-Safe Assets / Adult` only. Setup: `04-INTEGRATIONS/phase-2-drive-setup.md`. |

## Phase 3 — Day 60–90 (case-by-case)

| Capability | Setting | Why |
|---|---|---|
| **Google Calendar (read-only)** | 🟡 Optional | Only if Allison runs her own court schedule. Otherwise skip. |
| **Custom Action: USTA team finder** | 🟡 Optional | Phase 4 if leagues team logistics become heavy. |

---

## Hard-off (never enable)

| Capability | Why never |
|---|---|
| **Stripe / payments** | Out of scope. |
| **Gmail send (auto-send)** | Voice fidelity. Every reply human-sent. |
| **Google Drive write** | Read-only. No accidental overwrites of the Public-Safe Assets folder. |
| **Public sharing** | Internal only. Never publish to GPT store. |

## Verification

After saving:
1. **Capabilities:** Web Search, Code Interpreter, Image Generation, Canvas all ON.
2. **Knowledge:** 10 files.
3. **Actions:** none in Phase 1.
4. **Sharing:** **"Anyone with link"** within the LBTA workspace, **never** public. Or "Only me" if Andrew is the only owner and grants Allison via screen share. Pick one and document in `09-COMMAND-CENTER/master-setup-checklist.md`.

## Re-audit triggers

- After Allison's first 7-day dogfood (`05-OPERATIONS/eval/dogfood-week-playbook.md`)
- After every Friday Compound Review
- After any USTA league rule change

---

**Default state:** Allison has all Phase 1 capabilities; Phase 2 Gmail draft access added once dogfood week passes; nothing else until then.
