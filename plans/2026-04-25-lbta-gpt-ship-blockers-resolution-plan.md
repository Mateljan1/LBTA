# LBTA GPT Ship-Blockers — Resolution Plan

**Date:** 2026-04-25
**Status:** Awaiting Andrew's decisions on 5 critical items; the rest have grounded recommendations ready to apply.
**Skills applied:** compound-engineering · ceo-advisor · hormozi-offers · brainstorming
**Source hub:** [LBTA Custom GPT Build Hub](https://www.notion.so/LBTA-Custom-GPT-Build-Hub-511d0e2eb19b44f2b48d282a0621a890)

---

## 0. ⚠️ Pre-flight — must resolve before any Notion writes

The Notion integration "Claude Code" **does not have access** to the GPT Build Hub page (`511d0e2e...`). I confirmed by retrieve and search. Surrounding pages (Operations System, Contact & Campaign Hub, Schedules, Campaigns DB, snapshots) ARE shared.

**Fix (you, 30 seconds in Notion):**
1. Open the Build Hub page.
2. Click "Share" → search "Claude Code" integration → Add → "Can edit."
3. Repeat for the parent workspace folder if you want the integration to inherit child page access automatically.

Without this, I can ground recommendations from repo + adjacent Notion pages, but I cannot read the Hub's current questions tab or write back canonical answers programmatically.

---

## 1. 🔴 Required decisions — CEO-advisor framing

These are policy decisions where the GPT will quote you to customers. They are **brand-defining**, not just operational. I'm applying CEO-advisor + Hormozi-offers lenses where useful.

### Q1 — Canonical phone number

**Recommendation:** **(a) (949) 534-0457** (no debate — this is already the de-facto canonical number).

**Evidence (from repo audit):**
- `components/layout/Footer.tsx:139` → `(949) 534-0457`
- All 14+ Spring 2026 prospect/returning emails footer: `(949) 534-0457`
- `data/faq.json` "makeups" answer: `949-534-0457`
- Lighthouse report tracks `tel:9495340457` as the homepage CTA
- `app/coaches/peter-defrantz/page.tsx:179` → `(949) 241-0847` (drift)
- `app/programs/leagues/page.tsx:135` → `(949) 241-0847` (drift)
- `assets/other info_LBTA/LBTA_USTA_League_Flyer.html:461` → `949-241-0847` (drift)

**Already documented as P0 in `plans/2026-04-16-preship-preview.html`:**
> Switch personal phone (949) 241-0847 → business (949) 534-0457. Exception: `app/coaches/andrew-mateljan/page.tsx` keeps personal line (acceptable as founder's direct contact).

**The (949) 464-6645 number in the Lead-to-Enrollment SOP and Winter Welcome email does not appear anywhere in the website, JSON-LD, or any sent email template.** That's an SOP-only orphan. Either retire it or designate it as a routed-to-934-0457 backup.

**For the GPT:** Use **(949) 534-0457** as the only number it gives customers. Keep `(949) 241-0847` reserved for "the founder's direct line — only when explicitly asked for Andrew personally."

🟢 **High confidence — say "approve" and I'll fix all source-of-truth files.**

---

### Q2 — Canonical customer email

**Recommendation:** **(a) info@…** for the GPT, with **support@… as the live operational alias**.

**Evidence:**
- Code canonical: `lib/site-copy.ts:10` → `SUPPORT_EMAIL = 'support@lagunabeachtennisacademy.com'`
- All site `mailto:` links use `support@`
- JSON-LD homepage `email` field uses `support@`
- `andrew@…` appears only in flyers (founder direct, like the personal phone)
- I found **no `info@…` in the live codebase**

**Why I'm recommending change of recommendation here vs. the simple "match code" answer:**

CEO-advisor lens — you have two distinct customer states:
1. **Pre-customer (lead/parent shopping)** — should hit a brand-friendly inbox: `info@`
2. **Active member (already enrolled)** — should hit a service inbox: `support@`

This is the same logic luxury hospitality runs (Aman uses `reservations@` vs `concierge@`). Today, both go to one place anyway, so cost = $0 to set the alias. The GPT can route prospects to `info@` and members to `support@` even if they both forward to the same Gmail.

**If you want zero ops overhead:** Just keep `support@` for everything. (b) is fine. The GPT will use whichever you decide.

🟡 **Medium confidence — minor split. Say "info@", "support@", or "both with rule."**

---

### Q3 — Published business hours

**Recommendation:** **(a) "By program schedule only — see /schedules"** + a soft phone window.

**Reasoning (CEO-advisor + brand restraint):**
- The site never publishes business hours today. Your brand voice ("calm, restraint, confident") fights against the "MON–FRI 9–5" rectangle that screams chain-store.
- Customers asking the GPT "when are you open?" actually want one of three things: (a) when can I take a class, (b) when can I reach a human, (c) when do you respond to email/text.
- The GPT can answer all three without committing you to fixed hours:
  - **Court hours** → "By program schedule, see [/schedules]"
  - **Phone/text** → "Mon–Sat, 8am–7pm Pacific. Sundays we're slower."
  - **Email** → "We respond within 2 business hours during phone hours; otherwise next morning."

**Hormozi lens:** Faster response = lower perceived "Time Delay" in the value equation. Don't publish hours wider than you'll actually staff — but don't publish a tiny window that signals "we're a hobby."

🟢 **High confidence — recommend (c) hybrid: court hours by schedule + phone hours Mon–Sat 8a–7p PT.**

---

### Q4 — Refund policy beyond the 30-day guarantee 🚨 OFFER-INTEGRITY ISSUE

**This is the most important question on the list.** You have a **homepage promise that contradicts a FAQ promise.**

**Evidence:**
- `data/homepage-copy.json:260` → `"30-Day Money-Back Guarantee · No Long-Term Commitment"`
- `data/faq.json:43-45` → "Program refunds are available up to 48 hours before the session start date. … Group clinics: no refunds for missed sessions, but make-up sessions may be available."

**A parent who reads the homepage trusts a 30-day risk reversal. A parent who reads the FAQ sees a 48-hour-before-start cutoff. These cannot both be true.** A GPT that quotes both will get caught in a contradiction the first time it's tested. This is also a real legal/dispute exposure.

**Hormozi lens — the value equation:**
The 30-day guarantee is a **risk-reversal that lowers Effort & Sacrifice + Time Delay** in the prospect's mind. Removing it weakens the offer. Replacing it with "case by case" hides the offer entirely. The right answer is to **make the guarantee real and the post-30-day rules clean**, not to choose between them.

**Recommended unified policy (CEO + Hormozi merged):**

| Window | Policy |
|---|---|
| **First 30 days from program start** | "30-Day Movement Guarantee" — full refund, no questions asked. Try one session, four sessions, or three weeks of sessions. If it's not a fit, we refund the unused balance pro-rata + first session free. |
| **After 30 days, before mid-season** | Pro-rated **account credit** for unused sessions (not cash refund). Credit valid 12 months. |
| **After 30 days, mid-season or later** | No refund or credit. Make-up sessions for documented illness/injury. |
| **Private lessons** | 24-hour cancellation. Late cancel = lesson forfeited. (Already in FAQ — keep as-is.) |
| **Camps** | See Q5 weather. |

**Why this works:**
- ✅ Honors the homepage 30-day promise exactly as advertised
- ✅ Replaces vague "48 hours before session start" with a clean window-based rule
- ✅ Account credit > cash refund post-30-days = you keep cash flow, customer keeps option value
- ✅ Hormozi-grade: bigger bonus (free first session on refund) actually *increases* perceived value

**Action:** I can draft the unified policy as a single block of copy that goes:
1. Into `data/homepage-copy.json` (replaces the one-liner)
2. Into `data/faq.json` (replaces the cancellation entry)
3. Into a new `app/terms/page.tsx` section (canonical legal text)
4. Into the GPT's instruction set as the verbatim answer

🔴 **Critical decision — needs your call before I touch anything. The homepage and FAQ are out of sync today. Confirm the unified policy above, or give me the version you actually want.**

---

### Q5 — Camp weather make-up

**Recommendation:** **(c) Alternate-day swap if available, else (a) extend a make-up day later in summer.** No refunds — credits only.

**Reasoning:** Camps are higher fixed cost (counselor wages, court reservations, lunches). Refunds destroy unit economics. Most parents prefer a swap anyway because it preserves their childcare plan. Combine c + a as a graceful waterfall:

1. Alternate-day swap same week (preferred)
2. Make-up day later in summer (next available week)
3. Account credit toward fall programming (if neither works)
4. Refund only if all three fail (rare edge case, founder approval)

🟢 **High confidence — confirm "c→a→credit waterfall, refund as edge case" or override.**

---

## 2. 🟡 Brand assets — answers I can give you now

### Q6 — Brand color hex codes

**Already in code, in three places:**
- `tailwind.config.ts:14-19` → imports from `generated/tokens.tailwind.json`
- `.cursorrules` Part 7 → 11-color palette with hex values
- `data/homepage-copy.json` (some component-level overrides)

**Canonical 11-color brand kit (already wired into Tailwind):**

```
brand-pacific-dusk:    #1B3A5C   (primary text, headings)
brand-deep-water:      #0F2237   (dark backgrounds, hero)
brand-victoria-cove:   #2E8B8B   (links, focus states)
brand-thousand-steps:  #C4963C   (prestige accent — sparingly)
brand-sunset-cliff:    #E8834A   (primary CTA / hover accent)
brand-sandstone:       #F5F0E5   (warm surface, sections)
brand-morning-light:   #FAF8F4   (default background)
brand-salt-air:        #FFFFFF   (white)
brand-tide-pool:       #3A8B6E   (success / positive)
brand-sage-hill:       #7A8B6E   (secondary green)
brand-driftwood:       #B8A88A   (neutral accent)
```

Source of truth lives at `tokens/lbta-web-tokens.json` → built to `generated/tokens.tailwind.json`. No Figma sync needed; this is the codebase canonical.

🟢 **No action needed — paste into Notion as a block. I can do this once Hub access is granted.**

### Q7 — Web/print fonts

- **Headlines:** Cormorant (Google Fonts, OFL license, free for commercial)
- **Body:** DM Sans (Google Fonts, OFL license, free for commercial)
- Wired in `tailwind.config.ts:21-25` via `var(--font-cormorant)` / `var(--font-dm-sans)` (Next.js font optimization).

For print: use **Cormorant Garamond** for display copy + **DM Sans** for body. Both download free at fonts.google.com.

🟢 **No action needed — same paste-into-Notion treatment as Q6.**

### Q8 — Logo source files

**Live, canonical (`/public/logos/`):**
- `LBTAblktext.png` — black wordmark (Header, Footer)
- `LBTAwhttext.png` — white wordmark
- `LBTA-horizontal-white.png` — horizontal lockup, white
- `LBTA-stacked-white.png` — stacked lockup, white
- `lbta-club-profile-480.png` — round profile/avatar
- `racketrescue.png`, `gptca.png`, `vylo.png`, etc. — sub-brand marks

**Missing:** SVG vector versions. PNG-only is acceptable for web at current sizes, but for print/swag you'll want SVG masters. Do you have those somewhere outside the repo (Figma, Drive, designer's hand-off)?

🟡 **Action item:** flag SVG masters as a follow-up; not blocking for GPT ship.

### Q9 — Player/parent waiver text

**Recommendation:** **Draft a baseline now, replace with PlayByPoint export when available.**

The PlayByPoint waiver is your real legal document and must be signed in PlayByPoint anyway. The GPT's job isn't to *be* the waiver — it's to *summarize* what's in the waiver so a parent isn't blindsided at registration.

**Proposed GPT-facing summary (I'll draft the actual text on approval):**

> "When you register through PlayByPoint, you'll sign a standard waiver covering: (1) assumption of risk for tennis-related activity, (2) photo/media release (opt-out available), (3) emergency medical authorization, (4) policy acknowledgment. The full waiver displays in PlayByPoint before payment. We never store payment info; PlayByPoint handles all PCI compliance."

🟡 **Approve "yes draft baseline" and I'll write it.**

### Q10 — Photo/media release language

Same recommendation as Q9: draft baseline, swap when PlayByPoint exports. Standard release language is well-trodden — I can draft it from CA-compliant templates and flag it as "review with counsel before going live as legal doc."

🟡 **Approve "yes draft baseline."**

---

## 3. 🟢 Notion cleanup — verified findings + recommended actions

Pulled live from your workspace (search-grounded):

### Q11 — Archive Contacts SOT Snapshot duplicates

**Confirmed:** Multiple snapshots dated 2026-03-12, 2026-03-13 (4×), 2026-03-15 — at least 7 visible in one search page; you reported ~30+ total.

**Recommendation:** **YES, archive all but the most recent.** Snapshots are diagnostic — not source of truth. Keep the latest as historical reference. Archive (don't delete) so audit trail survives.

🟢 **Greenlight: "archive all SOT snapshots except latest" → I queue the operation and execute on Hub access.**

### Q12 — Mark "LBTA Operations System" (Dec 2024) as superseded

I can see the page (id `2b56c7b5-f87c-814e-a14a-d567a8b992ef`). Last edited 2026-04-19 — actively touched. **Do NOT mark as superseded blindly** — there's recent activity. Need to see if the recent edits are content updates or just metadata.

🟡 **Recommend "let me look first."** I'll diff the page sections against the newer Operations docs before suggesting supersede.

### Q13 — Mark "LBTA Automation Blueprint" (Nov 2025) as superseded

Need to retrieve to verify. Same pattern as Q12 — don't blindly supersede without verifying contents.

🟡 **Recommend "let me look first."**

### Q14 — Canonical Coaches database

**Critical finding from search:** Notion has legacy coach pages (Coach Binh Minh Ta, Coach Sadaf Sadeghvaziri, Coach Lora Betelman) that are NOT on the live website. Live coaches are Andrew Mateljan, Peter DeFrantz, Allison Cronk, Michelle Mateljan.

This means whichever Coaches DB is "canonical," it has stale entries.

**Recommendation:** Pick `Coaches Master` as canonical (matches enterprise naming convention), then:
1. Mirror the 5 live coaches from `data/coaches.json` (canonical in repo)
2. Mark legacy coach pages as Status = "Archived (Legacy)"
3. Set the other two DBs to read-only with banner: "Superseded by Coaches Master — see [link]"

🟡 **Confirm "Coaches Master" or override. Then I'll execute on Hub access.**

### Q15 — Canonical Programs database

Same pattern: pick `Programs - Master List` (most descriptive name), sync to `data/year2026.json` + `data/spring-summer-2026.json` as the repo canonical, archive others.

🟡 **Confirm "Programs - Master List" or override.**

### Q16 — Canonical Business Plan

**Confirmed three Canvas 1 copies via search.** Latest edit dates accessible — I'd need to retrieve all three to compare content, but search confirms they exist.

**Recommendation:** **Latest wins by default IS correct** for living docs like business plans. Confirm: latest = canonical, prior = "Archived — see canonical version."

🟢 **Greenlight: "latest wins, archive priors."**

---

## 4. ⚙️ GPT scope — confirm intent

### Q17 — Who uses the GPT?

**Recommendation:** **(a) Just you + a small internal team — to start.**

**Reasoning (CEO-advisor staged rollout):**
- Phase 1 (now): Internal-only dogfooding. You and a small internal team hammer it for 4 weeks. Surface every bug, hallucination, brand-voice slip, factual error.
- Phase 2 (4 weeks later): Add coach team (Peter, Allison, Michelle) with read-only access — they ask, can't edit.
- Phase 3 (8+ weeks later, only if Phase 2 is clean): Public chatbot embedded on the site.

Public-facing GPT before the data layer is locked = the GPT will hallucinate phone numbers, refund policies, and class times to customers. With the contradictions we just found in Q1 (3 phone numbers) and Q4 (homepage vs FAQ), shipping public-facing on day one is **how you create a class-action FAQ instead of a chatbot.**

🟢 **Recommend (a) for Phase 1. Plan to escalate to (d) by Q3 2026.**

### Q18 — Speed-to-lead SLA

**Recommendation:** Keep "2 hours" but tighten the definition.

- **Phone/text inbound:** within 1 hour during 8a–7p PT, Mon–Sat. Sunday: best effort same-day.
- **Email/web form:** within 2 hours during phone hours, else next morning by 9a PT.
- **GPT-handled tier-1 questions:** instant. SLA only applies when GPT escalates to human.

This matches the "By program schedule + phone hours Mon–Sat 8a–7p" recommendation from Q3.

🟢 **Confirm phone hours from Q3 and this auto-resolves.**

### Q19 — Phase 1 integrations (3-integration MVP)

**✅ Web Search** — agreed.

**✅ Google Drive (read-only).** Yes, spec a `LBTA / Public-Safe Assets` folder structure. Proposed:
```
LBTA / Public-Safe Assets /
├── 01-brand /          (logos, color cards, fonts)
├── 02-programs /       (current schedules, pricing, descriptions)
├── 03-policies /       (refund policy, waivers, FAQs)
├── 04-coaches /        (bios, credentials, headshots)
├── 05-facilities /     (court info, locations, parking)
├── 06-press /          (D1 placement record, founder bio)
└── 07-templates /      (email signatures, response templates)
```
The GPT only reads from this folder — never the master Drive. Acts as "what's safe to surface to customers" filter.

**✅ Gmail (read, draft-only).** Use `support@…` (not `info@…`) for Phase 1 — that's the inbox that has actual customer history the GPT can learn from. If you implement the info@/support@ split (Q2), revisit in Phase 2.

🟢 **Confirm "Phase 1 = web search + Drive (with proposed folder structure) + Gmail support@ read/draft."**

---

## 5. Acceptance checklist (the unblock list)

Mark these in order. I'll execute the green ones immediately on approval; the others wait on your decision.

- [ ] **PRE-1** Share GPT Build Hub Notion page with "Claude Code" integration
- [ ] **Q1** Approve canonical phone = (949) 534-0457; I fix all repo drifts
- [ ] **Q2** Choose info@ vs support@ vs both-with-rule
- [ ] **Q3** Approve hybrid hours: court by schedule + phone Mon–Sat 8a–7p PT
- [ ] **Q4** ⚠️ Approve unified refund policy (the homepage/FAQ contradiction MUST be resolved before GPT goes anywhere)
- [ ] **Q5** Approve camp weather waterfall (swap → make-up → credit → refund-as-edge)
- [ ] **Q6** Acknowledge brand colors are canonical in code (no action)
- [ ] **Q7** Acknowledge fonts (Cormorant + DM Sans, OFL license)
- [ ] **Q8** Confirm SVG masters exist somewhere or punt to backlog
- [ ] **Q9** Approve "draft baseline waiver summary"
- [ ] **Q10** Approve "draft baseline media release summary"
- [ ] **Q11** Greenlight archive SOT snapshots
- [ ] **Q12** Defer until I diff the Operations System page
- [ ] **Q13** Defer until I diff the Automation Blueprint
- [ ] **Q14** Confirm "Coaches Master" canonical (or override)
- [ ] **Q15** Confirm "Programs - Master List" canonical (or override)
- [ ] **Q16** Greenlight "latest Business Plan canvas wins"
- [ ] **Q17** Confirm Phase 1 = internal only
- [ ] **Q18** SLA confirmed via Q3
- [ ] **Q19** Confirm 3-integration MVP + folder spec

---

## 6. Out of scope (this plan)

- Building the actual GPT (system prompt, knowledge base ingestion, deployment) — that's the next plan
- Touching live PlayByPoint waiver text (legal review needed)
- Any code changes to the website until your decisions land
- Public-facing chatbot embed (Phase 3)

---

## 7. Risks & mitigations

| Risk | Mitigation |
|---|---|
| Q4 contradiction creates legal/trust exposure | Resolve before GPT touches a customer; treat as P0 |
| Notion integration permission stays scoped to surrounding pages only | I work from cached context + repo until permission granted |
| Legacy coach data leaks into GPT answers | Phase 1 internal-only catches this in dogfooding |
| Phone drift on coach/league pages persists | Q1 approval triggers a cleanup commit that fixes all 3 sources at once |

---

## 8. Confidence & uncertainty

- **High confidence:** Q1, Q3, Q5, Q6, Q7, Q11, Q16, Q17, Q19 — repo + Notion evidence is clean
- **Medium confidence:** Q2, Q8, Q12, Q13, Q14, Q15, Q18 — depend on your taste/preference
- **Critical decision:** Q4 — single biggest brand-integrity question on the list; must be resolved by you, not me

---

## 9. Research sources

- `components/layout/Footer.tsx` (canonical phone/email render)
- `lib/site-copy.ts` (SUPPORT_EMAIL constant)
- `data/homepage-copy.json` (30-day guarantee copy)
- `data/faq.json` (cancellation FAQ — contradicts homepage)
- `tailwind.config.ts` + `.cursorrules` Part 7 (brand kit)
- `public/logos/` (canonical logo assets)
- `plans/2026-04-16-preship-preview.html` (prior phone-cleanup audit)
- Notion search (Contacts SOT Snapshot Status × 7+, Coaches legacy DB, Business Plan canvases × 3, Operations System, Contact & Campaign Hub)
- Notion `notion_retrieve_page` on Hub → `404 not_found` → integration permission gap
