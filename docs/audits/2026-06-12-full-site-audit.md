# LBTA Full Site Audit — June 12, 2026

> Synthesized from: May 2026 audit files, live grep, Supabase lead history, planned Mailchimp migration.
> Format: each item has **status**, **why unfinished / evidence**, **recommendation**, **owner (Andrew / Claude Code / Cursor)**.

---

## P0 — Revenue / Lead Path (fix blocking)

### P0-1 — Mailchimp migration shipped (this session)
**Status:** ✅ SHIPPED (this session — `rescue/lbta_website_draft_3526-2026-06-12`)
**What changed:**
- `lib/mailchimp.ts` created — `upsertMember`, `addMemberTags`, `upsertAndTag`, full tag vocabulary mapping from AC
- All 7 form routes (`/api/book`, `/api/register`, `/api/register-program`, `/api/register-year`, `/api/newsletter`, `/api/scholarship`, `/api/chat`) now upsert to Mailchimp + Supabase only
- Airtable removed from all hot paths
- Notion removed from all hot paths
- `lib/leads-canary.ts` updated: Postmark + GHL steps replaced with Mailchimp ping
- Vercel env vars set: `MAILCHIMP_API_KEY`, `MAILCHIMP_SERVER_PREFIX=us1`, `MAILCHIMP_AUDIENCE_ID=30bbabe32c`

**What Andrew must do in Mailchimp UI (before considering email live):**
1. Create a Customer Journey triggered on tag `source:website-form` → send confirmation email to subscriber
2. Create an internal notification Journey → when `source:website-form` tag added, send staff alert to `support@lagunabeachtennisacademy.com`
3. Create a scholarship Journey triggered on `flag:scholarship` tag
4. Test: submit `/api/book` with a real email, verify MC audience member + tags appear

---

### P0-2 — ActiveCampaign still referenced in `fulfillUtrCircuitRegistration`
**Status:** 🔶 PARTIAL — AC calls remain in `lib/fulfill-utr-circuit-registration.ts`
**Evidence:** File imports from `lib/activecampaign.ts`; when `ACTIVECAMPAIGN_API_KEY` is empty (org-kill rule), all AC calls silently no-op.
**Recommendation:** MC upsert is now called at the `register-year` route level before `fulfillUtrCircuitRegistration`, so UTR circuit leads ARE going to Mailchimp. AC cleanup = remove AC imports from `fulfill-utr-circuit-registration.ts` in a follow-up.
**Owner:** Claude Code follow-up

---

### P0-3 — Zero website leads June 6–12 (7-day drought suspected)
**Status:** 🔴 INVESTIGATE — Supabase shows last real lead `armenc@hotmail.com` on June 5
**Evidence:**
- Latest 100 Supabase rows: 71 non-canary, last real one June 5 at 03:27 UTC
- Test emails (verify-*, andrew@tennisbeast.com) appear June 5; no real traffic June 6-12
- Historical gap: 13-day drought caught in May (incident 2026-05-13)
**Possible causes:**
1. Low traffic (summer + Laguna Beach seasonality — possible)
2. Form silently broken after `b63e6c1` GHL→Airtable commit (forms still write to Supabase so this would show up)
3. New canary not yet catching a different failure mode
**Action:** After pushing this branch, verify a real form submission goes to both Mailchimp and Supabase. If a test submit works, drought = traffic (not bug). If it fails, escalate immediately.
**Owner:** Andrew + Claude Code (verify after deploy)

---

## P0 — Trust / Compliance

### P0-4 — Phone number drift: (949) 241-0847 vs canonical (949) 534-0457
**Status:** 🔴 BUG — Wrong number in 2 production pages
**Evidence (grepped live):**
- `app/coaches/andrew-mateljan/page.tsx:302` — `(949) 241-0847`
- `app/programs/usta-adult-league/page.tsx:253` — `(949) 241-0847`
**Recommendation:** Quick fix — replace both with `(949) 534-0457`.
**Owner:** Cursor (2 StrReplace operations, 5 min)

---

### P0-5 — Robert LeBuhn page still live (departed coach)
**Status:** 🔴 BUG — Departed coach page accessible
**Evidence:** `app/coaches/robert-lebuhn/page.tsx` exists; Robert LeBuhn departed April 2026
**Recommendation:** Delete `app/coaches/robert-lebuhn/` and add a redirect in `next.config.js` to `/coaches`
**Owner:** Cursor (quick — delete + redirect)

---

## P1 — UX / Mobile / Flow

### P1-1 — 402 contrast-violation nodes (91 color-contrast failures)
**Status:** 🟡 BLOCKED on Andrew's decision
**Evidence:** `docs/audits/2026-05/post-remediation/codemod-manifest.md` — 402 instances across 77 files; Andrew's 3-option decision (A: bulk codemod, B: high-traffic manual, C: defer) never captured
**Recommendation:** Option B — manual fix on `/`, `/book`, `/schedules`, `/contact` first; then codemod the rest.
**Owner:** Andrew decision → Cursor execute

---

### P1-2 — Trial booking: no mobile bottom-sheet flow
**Status:** 🟡 DEFERRED — scoped to after contrast fix in May plan
**Evidence:** `docs/audits/2026-05/gap-report.md` — trial booking modal uses desktop dialog; mobile users get degraded experience
**Recommendation:** Add `Sheet` (shadcn) for mobile breakpoints ≤767px on trial booking modal
**Owner:** Cursor (1-2h)

---

### P1-3 — Contact page CLS was 0.499
**Status:** 🟡 NEEDS VERIFICATION on prod
**Evidence:** Fixed in remediation branch per `docs/audits/2026-05/post-remediation/deploy-summary.md`; not re-measured on prod after recent commits
**Recommendation:** Run Lighthouse on `lagunabeachtennisacademy.com/contact` — should be <0.1
**Owner:** Claude Code (one Lighthouse run)

---

### P1-4 — Schedules page density on 320–375px
**Status:** 🟡 PARTIAL — partial fixes in May; screenshot sweep not re-run
**Evidence:** `plans/mobile-experience-improvement-plan.md` Phases 5–6 open
**Owner:** Cursor (mobile screenshot sweep → targeted fixes)

---

## P1 — Chat / Rally

### P1-5 — Chat widget still GHL; forms abandoned GHL
**Status:** 🟡 DECISION NEEDED
**Evidence:** `components/ChatWidget.tsx` loads `<chat-widget>` from `NEXT_PUBLIC_GHL_CHAT_WIDGET_LOCATION_ID`. All other GHL wiring removed (`b63e6c1`).
**Options:**
1. **Remove widget** until Rally bot is ready (least risk, clean)
2. **Replace with Crisp/Intercom** (adds SaaS cost — Saska Sheriff test applies)
3. **Keep GHL chat** (inconsistent — forms ≠ chat)
**Recommendation:** Option 1 — hide widget with `NEXT_PUBLIC_GHL_CHAT_WIDGET_LOCATION_ID=` unset, add TODO comment
**Owner:** Andrew decision → Cursor (5 min if remove)

---

### P1-6 — `/api/chat` is a stub (no LLM)
**Status:** 🟡 BY DESIGN for now
**Evidence:** `app/api/chat/route.ts` returns canned copy from `lib/chat-copy.ts`; Rally bot operates via GHL SMS webhook separately
**Recommendation:** Document as known; Rally bot Phase 2 = wire `/api/chat` to Rally/LLM once GHL chat is decided
**Owner:** Andrew decision on timeline

---

## P2 — Design / Brand / Content

### P2-1 — Brand token strict mode: no new hex literals
**Status:** ✅ ENFORCED — `scripts/check-brand-usage.ts` runs in CI
**Evidence:** `docs/brand-token-system.md` — CI fails on new `bg-[#…]` arbitrary values
**No action needed** — this is working.

---

### P2-2 — Email template footer still references "ActiveCampaign and GoHighLevel"
**Status:** 🔴 STALE COPY
**Evidence:** `lib/email.ts:156` — `"This contact has been added to ActiveCampaign and GoHighLevel automatically."`
**Recommendation:** Update to `"You have been added to our mailing list automatically."` or remove line
**Owner:** Cursor (one StrReplace)

---

### P2-3 — Imagery and LCP: run production Lighthouse
**Status:** 🟡 NOT YET RUN on prod
**Evidence:** May audits ran on dev; production build is different. LCP <2.5s required.
**Recommendation:** `npm run health:prod` after deploy + manual Lighthouse on `/`, `/book`, `/schedules`
**Owner:** Claude Code post-deploy

---

### P2-4 — Swim & Tennis camp suspended in JSON
**Status:** 🟡 NEEDS CONFIRM
**Evidence:** `data/year2026.json` has swim-tennis camp marked suspended
**Recommendation:** Verify no production page advertises this program; if not, no action
**Owner:** Cursor (one grep)

---

## P2 — Performance / SEO

### P2-5 — Production Lighthouse not re-run after recent commits
**Status:** 🟡 DEFERRED
**Evidence:** Last recorded scores were from May dev audit. Recent GHL→Airtable + Mailchimp changes may improve LCP (fewer blocking external fetches).
**Recommendation:** Run post-deploy
**Owner:** Claude Code

---

## P3 — Internal / Coach Hub

### P3-1 — Coach Hub Match Day runner shipped (Phase 2 open)
**Status:** 🟢 PHASE 1 LIVE — drill localStorage + multi-coach flows are Phase 2
**Evidence:** Commit `136ac1b` — Allison/Peter hub pages live. Drill localStorage, multi-coach cascade = Phase 2.
**Owner:** Cursor when Andrew requests

---

### P3-2 — Agent-native CRUD at 0%
**Status:** 🟡 DOCUMENTED — not blocking launch
**Evidence:** `docs/AGENT-NATIVE-ARCHITECTURE-AUDIT.md` — all user form actions have no agent tool parity
**Recommendation:** Phase 6→3→2 implementation documented; do after Mailchimp stable
**Owner:** Claude Code

---

## Supabase Lead Gaps — "Did we miss anyone?"

| Period | Count | Notes |
|--------|-------|-------|
| June 6–12, 2026 | **0 real leads** | 7-day drought; last real lead June 5 (armenc@hotmail.com). Verify post-deploy. |
| May 6–17, 2026 | **0 real leads** | 11-day gap (known incident 2026-05-13 — canary was installed to detect this) |
| May 21–28, 2026 | **0 real leads** | 7-day gap |

**Key metric:** 71 real leads total in Supabase (most are Meta lead ad imports via `/api/cron/mirror-meta-leads`). Website form leads = 19 (15 book + 3 newsletter + 1 register) since April 2026.

**Cross-check with Mailchimp audience:** 2,641 members as of today — most predate this site's Supabase install. Mailchimp is the source of truth going forward.

**Immediate action for Andrew:** Check if anyone called or texted in the last 7 days that is NOT in Supabase. If yes, manually add them to Mailchimp audience with tag `status:new-lead` + `source:manual-entry`. If no, drought = traffic.

---

## Quick Wins (Cursor can do in <30 min total)

1. **Phone fix** — 2 files: `(949) 241-0847` → `(949) 534-0457` (P0-4)
2. **Robert LeBuhn** — delete page + add redirect (P0-5)
3. **Email template copy** — remove "ActiveCampaign and GoHighLevel" line (P2-2)
4. **GHL chat widget** — unset env or remove if Andrew says go (P1-5 option 1)

Combined: ~25 min of Cursor work once Andrew confirms P1-5 decision.
