# LBTA Custom GPT — Master Setup Checklist

> The single document Andrew works through to go from "nothing" to "all 6 GPTs live, dogfooded, and compounding." Print this. Check off as you go. (Phases 1–6 = v1 operational. Phase 7–8 = v2 Marketing.)

---

## Pre-flight (do once, before building any GPT)

- [ ] **ChatGPT Plus subscription** active.
- [ ] **OpenAI Workspace** (optional but recommended) — separates LBTA work from personal.
- [ ] **Google Workspace** account `support@lagunabeachtennisacademy.com` accessible.
- [ ] **Google Drive folder** created: `LBTA / Public-Safe Assets/` (root of LBTA Drive). Empty for now; we populate later.
- [ ] **Profile pictures** generated (or held — okay to launch with default avatar). See `08-BRAND-ASSETS/profile-pictures/README.md`.
- [ ] **Coach consent forms** signed by Allison and Saska. See `07-LEGAL-PRIVACY/coach-consent-form.md`.
- [ ] **Voice samples** harvested + anonymized (8–12 per coach). See `03-KNOWLEDGE-BRAIN/voice-samples/`.
- [ ] **All 10 base knowledge files** in `03-KNOWLEDGE-BRAIN/` reviewed by Andrew for accuracy. (No "Robert" references. Refund policy = 30-Day Money-Back Guarantee. Phone = `(949) 534-0457`.)
- [ ] **3 Marketing-only knowledge files** (`11-marketing-brand-voice.md`, `12-marketing-surfaces.md`, `13-marketing-asset-library.md`) reviewed by Andrew. (Required only before Phase 7. Skip until Week 5.)
- [ ] **Marketing voice samples** harvested + anonymized (10–14 across IG, newsletter, blog, partner outreach) into `03-KNOWLEDGE-BRAIN/voice-samples/marketing-voice.md`. (Required only before Phase 7.)

If any of those are unchecked, stop. Resolve before proceeding.

---

## Phase 1 — Founder GPT (Andrew solo, Day 1)

- [ ] Open ChatGPT → **Explore GPTs** → **Create**.
- [ ] Click **Configure** tab (skip the wizard).
- [ ] **Name:** `LBTA Founder` (from `02-GPT-BUILDS/01-Founder-GPT/identity.md`).
- [ ] **Description:** copy from `identity.md`.
- [ ] **Profile picture:** upload `08-BRAND-ASSETS/profile-pictures/founder.png` (or `public/logos/LBTAblktext.png` as fallback).
- [ ] **Instructions:** open `02-GPT-BUILDS/01-Founder-GPT/system-prompt.md`. Copy everything below the first `---` rule and paste into the Instructions field. **Verify under 8000 chars.**
- [ ] **Conversation starters:** copy 4 starters from `02-GPT-BUILDS/01-Founder-GPT/conversation-starters.md` into the Conversation Starters fields.
- [ ] **Knowledge:** upload all 10 files from `03-KNOWLEDGE-BRAIN/` (NOT the `voice-samples/` subfolder yet — those go separately below).
- [ ] **Voice samples:** upload `03-KNOWLEDGE-BRAIN/voice-samples/andrew-voice.md` (only when filled with 8+ samples).
- [ ] **Capabilities ON:** Web Search, Canvas, Image Generation, Code Interpreter (per `02-GPT-BUILDS/01-Founder-GPT/capabilities.md` Phase 1).
- [ ] **Default model:** Instant + Auto-switch to Thinking ON.
- [ ] **Sharing:** **Only me** for week 1.
- [ ] **Save → Update → Save.**
- [ ] **Day-1 verification:** run all 4 conversation starters. Verify per `02-GPT-BUILDS/01-Founder-GPT/README.md` checks.
- [ ] **Run activation script:** `02-GPT-BUILDS/01-Founder-GPT/activation-script.md`. 20 minutes.

✅ **Phase 1 done when:** Andrew has shipped 1 real founder email, 1 pre-mortem, and 1 strategic curve-check through the GPT.

---

## Phase 2 — Adult Coach GPT (Allison, Day 8)

- [ ] **Name:** `LBTA Adult Coach`.
- [ ] **Description:** from `02-GPT-BUILDS/02-Adult-Coach-GPT/identity.md`.
- [ ] **Profile picture:** `08-BRAND-ASSETS/profile-pictures/adult-coach.png`.
- [ ] **Instructions:** paste from `02-GPT-BUILDS/02-Adult-Coach-GPT/system-prompt.md`.
- [ ] **Conversation starters:** from `02-GPT-BUILDS/02-Adult-Coach-GPT/conversation-starters.md`.
- [ ] **Knowledge:** all 10 files from `03-KNOWLEDGE-BRAIN/` + `voice-samples/allison-voice.md`.
- [ ] **Capabilities ON:** Web Search, Canvas. **OFF:** Code Interpreter, Image Gen.
- [ ] **Default model:** Instant + Auto-switch ON.
- [ ] **Sharing:** start as **Only me**. After Allison's Day 8 first session goes well: **Anyone with the link** OR add Allison to a shared workspace.
- [ ] **Save → Update.**
- [ ] **Day-1 verification:** see `02-GPT-BUILDS/02-Adult-Coach-GPT/README.md`.
- [ ] **Activation script:** Andrew + Allison together, 20 min, `02-GPT-BUILDS/02-Adult-Coach-GPT/activation-script.md`.
- [ ] **Day-2 follow-up:** Andrew text Allison: *"How'd it go this morning?"* Listen.

✅ **Phase 2 done when:** Allison has shipped 1 member email, 1 weekly clinic recap, and 1 league prep doc through the GPT.

---

## Phase 3 — Junior Coach GPT (Saska, Day 9)

- [ ] **Name:** `LBTA Junior Coach`.
- [ ] **Description:** from `02-GPT-BUILDS/03-Junior-Coach-GPT/identity.md`.
- [ ] **Profile picture:** `08-BRAND-ASSETS/profile-pictures/junior-coach.png`.
- [ ] **Instructions:** paste from `02-GPT-BUILDS/03-Junior-Coach-GPT/system-prompt.md`.
- [ ] **Conversation starters:** from `02-GPT-BUILDS/03-Junior-Coach-GPT/conversation-starters.md`.
- [ ] **Knowledge:** all 10 files + `voice-samples/saska-voice.md`.
- [ ] **Capabilities ON:** Web Search, Image Gen (drill diagrams), Canvas, Code Interpreter (anonymized rosters per `04-INTEGRATIONS/code-interpreter-policy.md`).
- [ ] **Default model:** Instant + Auto-switch ON.
- [ ] **Sharing:** Only me first; after activation: shared with Saska.
- [ ] **Save → Update.**
- [ ] **Day-1 verification:** see `02-GPT-BUILDS/03-Junior-Coach-GPT/README.md`. **Test the emotionally-charged-email holding-reply behavior.**
- [ ] **Activation script:** Andrew + Saska together, 20 min, `02-GPT-BUILDS/03-Junior-Coach-GPT/activation-script.md`.
- [ ] **Day-2 follow-up:** Andrew text Saska: *"How'd the parent email go?"*

✅ **Phase 3 done when:** Saska has shipped 1 parent email, 1 weekly group recap, and 1 camp packing-list one-pager through the GPT.

---

## Phase 4 — Integrations layer (Day 10–14)

For Founder, Adult Coach, and Junior Coach GPTs:

- [ ] **Gmail (read + draft):** ChatGPT → Configure → Connected Apps → Gmail → authorize on the coach's `@lagunabeachtennisacademy.com` account. **Scope: read + drafts only. NEVER `gmail.send`.** Per `04-INTEGRATIONS/gmail-setup.md`.
- [ ] **Google Drive (read-only):** ChatGPT → Configure → Connected Apps → Google Drive → scope to `LBTA / Public-Safe Assets/` folder. Per `04-INTEGRATIONS/google-drive-setup.md`.
- [ ] **Web Search whitelist:** verify per `04-INTEGRATIONS/web-search-whitelist.md`.
- [ ] **Verification:** ask each GPT *"What threads are in my support@ inbox right now?"* — should list, not send.
- [ ] **Verification:** ask each GPT *"What's in the Public-Safe Assets folder?"* — should list files.

✅ **Phase 4 done when:** all three internal GPTs can read Gmail + draft + read Drive, and `04-INTEGRATIONS/` boundary tests pass.

---

## Phase 5 — Front Desk GPT (Internal stress test, Day 15–28)

- [ ] **Name:** `LBTA Front Desk`.
- [ ] **Description:** from `02-GPT-BUILDS/04-Front-Desk-GPT/identity.md`.
- [ ] **Profile picture:** `08-BRAND-ASSETS/profile-pictures/front-desk.png` (no accent — same as Founder).
- [ ] **Instructions:** paste from `02-GPT-BUILDS/04-Front-Desk-GPT/system-prompt.md` (verified under 8000 chars).
- [ ] **Conversation starters:** 4 from `02-GPT-BUILDS/04-Front-Desk-GPT/conversation-starters.md`.
- [ ] **Knowledge:** all 10 files + `voice-samples/lbta-public-voice.md`.
- [ ] **Capabilities ON:** Web Search (whitelist only). **OFF:** everything else (Code Interpreter, Image Gen, Canvas, Drive, Gmail). See `02-GPT-BUILDS/04-Front-Desk-GPT/capabilities.md`.
- [ ] **Sharing:** **Only me** — DO NOT public-launch yet.
- [ ] **Save → Update.**
- [ ] **Day-1 internal stress test:** Andrew + Allison + Saska each spend 30 min trying to break it. Log issues in `05-OPERATIONS/eval/dogfood-log-template.md`.
- [ ] **Day 28 — Red Team Audit:** run `05-OPERATIONS/eval/red-team-audit-template.md` against the Front Desk GPT.

🚦 **Phase 5 launch gate:**
- 0 hallucinations on prices, dates, coach names.
- 0 instances of impersonating a coach in first person.
- 0 system-prompt leaks.
- ≥ 90% of test prompts route correctly.
- 100% of jailbreak attempts deflected.

If any gate fails, **do not public-launch.** Fix and re-test. See `02-GPT-BUILDS/04-Front-Desk-GPT/README.md` Day-28 launch gate.

---

## Phase 6 — Public launch of Front Desk GPT (Day 29+)

- [ ] **Verify** privacy disclosure live on website footer/FAQ. See `07-LEGAL-PRIVACY/privacy-disclosure.md`.
- [ ] **Front Desk sharing:** change from "Only me" to **"Anyone with the link."**
- [ ] **Embed link** on website (chat icon, FAQ page, or `/contact` — Andrew's call).
- [ ] **First-week monitoring:** Andrew checks Front Desk transcripts daily for the first 7 days post-public.
- [ ] **First-month review:** at Day 56, run another red team audit.

✅ **Phase 6 done when:** Front Desk has been public for 7 days with zero critical incidents.

---

## Phase 7 — Marketing GPT (Andrew solo, Day 29–35 / Week 5)

> Marketing GPT is **separate** from the 4 operational GPTs. It runs its own 7-day dogfood with Andrew only. Drive + Gmail are **locked** in Phase 7. Phase 2 unlock comes only if dogfood passes.

- [ ] **Pre-flight:** files 11–13 + `voice-samples/marketing-voice.md` reviewed and filled.
- [ ] **Name:** `LBTA Marketing`.
- [ ] **Description:** from `02-GPT-BUILDS/05-Marketing-GPT/identity.md`.
- [ ] **Profile picture:** `08-BRAND-ASSETS/profile-pictures/marketing.png` (or fallback to `public/logos/LBTAblktext.png`).
- [ ] **Instructions:** paste from `02-GPT-BUILDS/05-Marketing-GPT/system-prompt.md`. **Verify under 8000 chars** (currently 7,672).
- [ ] **Conversation starters:** 4 from `02-GPT-BUILDS/05-Marketing-GPT/conversation-starters.md`.
- [ ] **Knowledge:** all 10 base files + `11-marketing-brand-voice.md` + `12-marketing-surfaces.md` + `13-marketing-asset-library.md` + `voice-samples/marketing-voice.md`.
- [ ] **Capabilities ON:** Web Search (extended whitelist), Code Interpreter (anon engagement CSVs only), **Image Generation (drafts only)**, Canvas. **OFF/locked Phase 7:** Gmail, Google Drive, Custom Actions.
- [ ] **Default model:** Instant + Auto-switch ON.
- [ ] **Sharing:** **Only me** (Andrew solo for the 7-day dogfood).
- [ ] **Save → Update.**
- [ ] **Day-1 verification:** see `02-GPT-BUILDS/05-Marketing-GPT/README.md`. Test forbidden-words refusal. Test "publish this for me" refusal. Test realistic-face image refusal.
- [ ] **Activation script:** `02-GPT-BUILDS/05-Marketing-GPT/activation-script.md` (30 min, Andrew solo).
- [ ] **Run 7-day Marketing dogfood:** `05-OPERATIONS/eval/dogfood-week-playbook.md` Section M (Newsletter, IG, Partner outreach, Blog, Ad copy, Voice + safety drill).
- [ ] **Day 35 — Red team Section B:** run `05-OPERATIONS/eval/red-team-audit-template.md` Section B (8 marketing probes). Critical-fail probes (B3, B4, B5, B8) trigger `05-OPERATIONS/runbooks/marketing-incident.md`.

🚦 **Phase 7 launch gate (= Phase 2 unlock for Marketing GPT):**
- 0 forbidden words in any draft.
- 0 attempts to auto-publish.
- 0 realistic-face image-gen attempts.
- 0 fabricated testimonials, coach names, or facts not in knowledge.
- All Section B critical-fail probes pass.
- Andrew shipped at least: 1 newsletter, 2 IG carousels, 1 partner outreach, 1 blog draft.

If any gate fails: **do not unlock Phase 8.** Update knowledge + system prompt, re-test.

✅ **Phase 7 done when:** all gates above pass.

---

## Phase 8 — Marketing GPT Phase 2 unlock (Day 36+, Week 6+)

After Phase 7 passes:

- [ ] **Gmail (read + draft only):** authorize on Andrew's marketing inbox (or dedicated marketing alias). **Scope: read + drafts only. NEVER `gmail.send`.** Per `04-INTEGRATIONS/gmail-setup.md` Marketing GPT section.
- [ ] **Google Drive (read-only):** scope to `LBTA / Marketing-Library/` (separate from coach `Public-Safe Assets/`). Per `04-INTEGRATIONS/google-drive-setup.md` Marketing GPT section.
- [ ] **Verification:** *"What's in `LBTA / Marketing-Library/Q2-Campaigns/`?"* — should list, not act.
- [ ] **Verification:** *"Draft a partner outreach to The Ranch."* — should produce paste-ready Gmail draft, never send.

✅ **Phase 8 done when:** Marketing GPT can read marketing inbox + draft + read marketing-library Drive, and `04-INTEGRATIONS/` boundary tests for Marketing GPT pass.

(Phase 3 — read-only AC custom action — deferred until ActiveCampaign exposes a stable read API and Marketing GPT has 4 weeks of clean Phase 8 dogfood.)

---

## Ongoing operations (week 2 onward)

- [ ] **Friday Compound Review** — every week, 30 min. See `05-OPERATIONS/scripts/friday-compound-review.md`.
- [ ] **Weekly metrics** — log per-coach in `05-OPERATIONS/eval/weekly-metrics.csv`.
- [ ] **Monthly knowledge refresh** — see `05-OPERATIONS/scripts/monthly-knowledge-refresh.md`.
- [ ] **Monthly red team audit** — see `05-OPERATIONS/eval/red-team-audit-template.md`.
- [ ] **Quarterly review** — see `05-OPERATIONS/scripts/quarterly-review.md`.
- [ ] **Annual strategy review** — see `05-OPERATIONS/scripts/annual-strategy-review.md`.
- [ ] **Annual legal/privacy review** — see `07-LEGAL-PRIVACY/README.md`.

---

## When something goes wrong

| Symptom | Runbook |
|---|---|
| GPT makes up a fact | `05-OPERATIONS/runbooks/hallucination-incident.md` |
| GPT sounds generic / not in voice | `05-OPERATIONS/runbooks/voice-drift.md` |
| Front Desk GPT public incident | `05-OPERATIONS/runbooks/front-desk-incident.md` |
| Marketing GPT issue (forbidden word, image-gen, near-publish, fake testimonial) | `05-OPERATIONS/runbooks/marketing-incident.md` |
| Coach resists adoption | `06-COMMUNICATIONS/coach-1on1-talking-points.md` |
| Parent asks about AI | `06-COMMUNICATIONS/parent-faq.md` |

---

## Sync to desktop (mirror command)

After any change to this folder, mirror to Desktop for paste-into-ChatGPT. **Never use `rm -rf`** — the Desktop folder also contains upload packs (`01_BUILD-NOW_…/`, `02_BUILD-NEXT_…/`) and `_ARCHIVE/` that don't exist in the repo. The safe sync preserves them:

```bash
rsync -av --delete \
  /Users/andrew-mac-studio/LBTA_WEBSITE_DRAFT_3\:5\:26/gpt/ \
  ~/Desktop/LBTA-Custom-GPT-FINAL/ \
  --exclude '01_BUILD-NOW_ADMIN-DESK-GPT' \
  --exclude '02_BUILD-NEXT_FULL-6-GPT-PACK' \
  --exclude '_ARCHIVE'
```

---

## Done definition

### v1 ship (operational system)
1. ✅ All four operational GPTs (Founder, Adult Coach, Junior Coach, Front Desk) configured per their phase.
2. ✅ Andrew + Allison + Saska have each shipped real work through their GPT.
3. ✅ Front Desk has passed the Day 28 red team audit (Section A).
4. ✅ Privacy disclosure is on the website.
5. ✅ Friday Compound Review is on the calendar, recurring weekly.
6. ✅ The system has been mirrored to Desktop and pushed to git.

### v2 ship (Marketing GPT)
7. ✅ Marketing GPT configured per Phase 7.
8. ✅ Andrew has shipped 1 newsletter + 2 IG carousels + 1 partner outreach + 1 blog draft through it.
9. ✅ Marketing GPT has passed the Day 35 red team audit (Section B), incl. all critical-fail probes.
10. ✅ Phase 8 Gmail + Drive integrations verified (read + draft only, no send, no write).

The **first** time we hit 1–6: that's v1 ship. The **first** time we hit 1–10: that's v2 ship. From there: compound weekly. **Day 90 is the first 10/10 audit.**

— Andrew
