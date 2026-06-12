# LBTA Marketing GPT — Capabilities

> What the Marketing GPT can and cannot do, by phase.

---

## Phase 1 — Day 1 (build day, Andrew solo)

| Capability | Setting | Why |
|---|---|---|
| **Web Search** | ✅ ON | Restricted whitelist via system-prompt: `lagunabeachtennisacademy.com`, `atptour.com`, `wtatennis.com`, `itftennis.com`, `usta.com`, `myutr.com`. Blocks open-internet hallucination loops on prices, results, partner stats. |
| **Code Interpreter** | ✅ ON | Anonymized engagement CSVs (IG, newsletter), reach/save analysis, A/B caption sorting. **No customer PII.** |
| **Image Generation** | ✅ ON | **Drafts only.** Moodboards and IG carousel slide comps for Andrew to reference, never publish. Output always labeled `DRAFT — not for publishing`. **Never** fake action shots of real players, fake testimonial visuals, or fake event photography. |
| **Canvas** | ✅ ON | Long-form drafts (blog posts, newsletter founder notes, partner pitches). |
| **Knowledge files** | ✅ All shared + 3 marketing-specific | The 10 shared `03-KNOWLEDGE-BRAIN/*.md` files, plus `11-marketing-brand-voice.md`, `12-marketing-surfaces.md`, `13-marketing-asset-library.md`, plus `voice-samples/marketing-voice.md`. |
| **Conversation starters** | ✅ 4 starters | See `conversation-starters.md` in this folder. |

## Phase 2 — Day 14–60 (post-dogfood, post-team-activation)

Add — only after `05-OPERATIONS/eval/dogfood-week-playbook.md` passes for the Marketing GPT (run the marketing-specific dogfood probes — see `05-OPERATIONS/runbooks/marketing-incident.md`):

| Capability | Setting | Why |
|---|---|---|
| **Google Drive** | ✅ ON, *read-only* | Read from `LBTA / Marketing-Library / ActiveCampaign` only — past newsletter HTML/text exports, brand asset references, voice samples Andrew has saved. **Never** `LBTA / Private` or any folder with player PII. Setup: `04-INTEGRATIONS/phase-2-marketing-drive-setup.md`. |
| **Gmail** | ✅ ON, *read + draft only* | "Draft a partner email to X." GPT writes a Gmail draft on `support@`. **Andrew sends.** No auto-send, ever. Setup: `04-INTEGRATIONS/phase-2-marketing-gmail-setup.md`. |
| **ActiveCampaign-compatible newsletter draft** | ✅ Manual copy/paste | GPT outputs newsletter as HTML/text formatted for ActiveCampaign's editor; Andrew copies into AC manually. **No API write access.** |

## Phase 3 — Day 60–90 (operations, only if Phase 2 is clean)

| Capability | Setting | Why |
|---|---|---|
| **Custom Action: Read ActiveCampaign** | 🟡 Optional | Read-only contact list / segment summary. Spec: `04-INTEGRATIONS/phase-3-activecampaign-read.md`. **No write, no send.** |
| **Custom Action: Read PlayByPoint** | 🟡 Optional | Read-only enrollment counts to inform "what should we promote this week" prompts. **No write.** |

## Phase 4 — Day 90+ (deferred, requires explicit Andrew approval)

| Capability | Setting | Why |
|---|---|---|
| **Engagement-data ingest** | 🟡 Optional | Scheduled CSV exports from Meta/IG insights + AC into a Drive folder the GPT can read. Used to inform — not generate — "what to post" decisions. |

---

## Hard-off (never enable)

| Capability | Why never |
|---|---|
| **Any auto-post to social platforms** | If the GPT publishes AI-generated marketing, the GPT failed. Andrew's brand is the moat. |
| **Direct API write to Meta Ads / Google Ads** | Spend exposure + brand exposure. Drafts only, human-loaded. |
| **Direct API write to ActiveCampaign** | One source of truth: Andrew clicks send in AC. Avoids accidental blast to wrong segment. |
| **Final published visual asset generation** | Image gen is *always* a draft moodboard or comp. Never the asset shipped to followers. |
| **Real player photo use without consent** | Every real player photo must be in `13-marketing-asset-library.md` with explicit consent. No shortcuts. |
| **Public sharing of this GPT** | Private to LBTA. Never publish to GPT store, never link-share. |

## Verification (ChatGPT Builder UI)

After saving the GPT:
1. **Configure → Capabilities:** Web Search, Code Interpreter, Image Generation, Canvas all checked.
2. **Knowledge:** count files. Should be 10 shared + 3 marketing-specific (`11-`, `12-`, `13-`) + the marketing voice sample = **14 files**.
3. **Actions:** none in Phase 1.
4. **Sharing:** **"Only me"** in Phase 1; expand to specific email invites in Phase 2 only after dogfood.

## When to re-audit capabilities

- After every Friday Compound Review (see `01-ARCHITECTURE/team-rituals.md`).
- After every monthly red-team audit (see `05-OPERATIONS/eval/red-team-audit-template.md`) — run the marketing-specific probes.
- Whenever Andrew adds a new surface (TikTok, podcast, etc.) — verify the GPT has the right knowledge file and template before drafting.
- Whenever a Phase 2/3/4 capability is requested — verify it doesn't bypass the "Andrew approves every send" rule.

---

**Default state:** Phase 1 only. Phase 2 unlocks **only** after a passing dogfood week with marketing-specific probes (see `05-OPERATIONS/runbooks/marketing-incident.md`). Phase 3+ is optional and requires explicit Andrew approval per capability.
