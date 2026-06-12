# LBTA Custom GPTs — Integrations

> Which apps connect to which GPT, why, and how to set them up safely. Treat this as the security boundary doc.

---

## Integration matrix

| App | Founder | Adult Coach | Junior Coach | Front Desk | Marketing | Notes |
|---|---|---|---|---|---|---|
| **Web Search (whitelisted)** | ✅ | ✅ | ✅ | ✅ | ✅ (extended whitelist) | Whitelist enforced via system prompt. Marketing GPT adds: `atptour.com`, `wtatennis.com`, `itftennis.com` for context-aware drafting. |
| **Google Drive (read-only)** | ✅ | ✅ | ✅ | ❌ | 🟡 Phase 2 only | Folder: `LBTA / Public-Safe Assets` (coaches), `LBTA / Marketing-Library / ActiveCampaign` (Marketing GPT, Phase 2). |
| **Gmail (read + draft only)** | ✅ | ✅ | ✅ | ❌ | 🟡 Phase 2 only | **Never auto-send.** Drafts only. Andrew/operator reviews then sends. Marketing GPT Phase 2 unlock requires passing dogfood week. |
| **Code Interpreter** | ✅ | ✅ | ✅ | ❌ | ✅ | CSVs, schedule grids, refund math (coaches). Marketing: anonymized engagement CSVs (IG, newsletter), reach/save analysis. **No customer PII.** |
| **Image Generation** | ✅ | ❌ | ❌ | ❌ | ✅ (drafts only) | Founder: diagrams, court layouts, moodboards. Marketing: moodboards + IG carousel slide comps as drafts only — always labeled `DRAFT — not for publishing`. **No fake action shots of real players.** |
| **Canvas** | ✅ | ✅ | ✅ | ❌ | ✅ | Long-form drafts (blog posts, newsletter founder notes, partner pitches). |
| **Custom Actions / API** | ❌ | ❌ | ❌ | ❌ | ❌ Phase 1, 🟡 Phase 3 | None in Phase 1. Marketing GPT may add read-only ActiveCampaign / PlayByPoint actions in Phase 3 (Day 60–90) per `gpt/02-GPT-BUILDS/05-Marketing-GPT/capabilities.md`. |
| **Stripe** | ❌ | ❌ | ❌ | ❌ | ❌ | **Out of scope across the board.** Payments stay on the website. |
| **PlayByPoint** | ❌ (read-only via web) | ❌ (read-only via web) | ❌ | ❌ | ❌ Phase 1, 🟡 Phase 3 | No API integration in Phase 1; coaches still work in PlayByPoint directly. |
| **ActiveCampaign** | 🟡 (read via Drive export) | 🟡 (read via Drive export) | ❌ | ❌ | 🟡 Phase 2 (HTML draft via Drive) | No write access. Marketing GPT outputs ActiveCampaign-compatible newsletter HTML/text; Andrew copies into AC manually. **No API write, ever.** |
| **Notion** | ❌ | ❌ | ❌ | ❌ | ❌ | Not connected — Notion is the planning layer; GPTs are the execution layer. |

Legend: ✅ on, ❌ off, 🟡 read-only / indirect / phased.

## Integration setup guides (in this folder)

| File | What it sets up |
|---|---|
| `web-search-whitelist.md` | The exact whitelist text in the system prompt + how to verify (includes Marketing GPT extension) |
| `google-drive-setup.md` | Drive folder structure, sharing model, what NOT to put in the GPT-readable folder |
| `gmail-setup.md` | Read + draft scopes, never auto-send, Andrew/Allison/Saska review flow |
| `playbypoint-handoff.md` | Why PBP is not connected and what coaches do instead |
| `activecampaign-handoff.md` | How AC drafts flow Founder/Adult Coach/Marketing GPT → Gmail draft → Andrew/Allison sends through AC |
| `code-interpreter-policy.md` | What kinds of files are safe to upload to a session |
| `image-generation-policy.md` | Founder + Marketing only; what's allowed, what's not |

## Security boundary (one paragraph)

The five LBTA GPTs are **drafting and decision-support tools, not systems of record.** They never write to a customer system (Stripe, ActiveCampaign, PlayByPoint, Meta Ads, Google Ads), never auto-send (Gmail draft only), never auto-post (no social platform write access), and never expose member PII outside Andrew's, Allison's, Saska's, and the marketing operator's individual ChatGPT accounts. The Front Desk GPT — the only public-facing surface — has the strictest profile: Web Search whitelisted, no Drive, no Gmail, no Code Interpreter, no Image Gen, no file uploads. The Marketing GPT — the only one that touches public-broadcast content — has the **second**-strictest profile: Image Gen output is always labeled `DRAFT`, no auto-publish to any platform, no API write to ActiveCampaign or any social. This is intentional.
