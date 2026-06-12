# Andrew-Decisions — Mobile UX Audit 2026-05-13

> **Purpose.** Capture the **Curve 2** calls that surfaced during the audit, with the audit's evidence-backed view on each — but the decision is Andrew's.
> **How to use this doc.** Each section: the question, what the audit found that bears on it, the recommendation (with 🟢/🟡/🔴 confidence), what happens if Andrew goes the other way, an explicit deadline so the decision doesn't drift.
> **Curve-2 framing.** Per `.cursorrules` Part 21 and `.cursor/rules/decision-lenses.mdc`: these are taste / strategy calls, not engineering calls. The audit's job is to sharpen the thinking, not pre-cook the answer. If Andrew can articulate the trade-off, the audit succeeded — even if his answer differs from the recommendation.

---

## Q1 — Mobile nav: polish-only, or in scope for redesign?

> Plan default: **polish-only**, unless the audit surfaces a >20% bounce drop on the drawer.

**What the audit found.**
- Mobile drawer is **mechanically excellent** (focus trap ✓, scroll lock ✓, return focus to menu button ✓, opaque background on light text ✓). See `Header.tsx:117-148`.
- The friction is **information density**, not interaction quality:
  - 8 program cards in a 2-up grid at 320px viewport → each card ≈ 132px wide, descriptions like "Coach-fed doubles — how sessions work" wrap to 2–3 lines per card.
  - Drawer end shows "(N) players trained" trust stat (`Header.tsx:486-489`), which is a consumer-grade metric vs. Aman's heritage-stat pattern.
- The Propeller Aman case study shows **menu simplification** (fewer items / simpler terms) lifted **CTR 218% and conversions 200%** ([source](https://www.propeller.co.uk/work/aman)). LBTA's drawer has 8 program cards + 7 nav items + Book Trial CTA + phone + email + trust stat → ~18 distinct decisions. Aman's mobile drawer has 4 top-level items.

**Recommendation (🟡 medium confidence): redesign the drawer Programs grid to a 1-column list of 4 featured programs + "View all programs" disclosure.**
- Effort: M (1–3 days).
- Keep the rest of the drawer mechanically as-is (it works).
- Swap "(N) players trained" → a heritage stat (Andrew picks; defaults: "Founded 2020" or "Official City Partner").

**If Andrew goes the other way (polish only).**
- No code-density risk; the existing drawer is functional.
- Cost: leaves on the table the 218%/200% pattern from Aman's case study. Risk-reward favors testing the simpler drawer in a future cycle if conversion data emerges.

**Deadline.** Decide by **2026-05-27** (within 2 weeks). Past that, the Curve-1 quick-wins ship without the drawer change, and this becomes a separate plan.

---

## Q2 — TrialBookingModal: in scope for refactor (bottom-sheet variant on mobile)?

> Plan default: **yes, if friction is critical**.

**What the audit found.**
- The modal is **mechanically sound** (focus trap ✓, escape ✓, body lock ✓, max-h-90vh ✓, success-redirect after 2.5s, synchronous double-submit guard).
- **Critical a11y bug** (separate from refactor question): unlabeled `<select>` on `/junior-trial`; modal's eyebrow at `text-brand-pacific-dusk/50` is **2.74:1 contrast**, fails AA. Both Curve 1 fixes.
- **Curve 2 friction** is *vibe + form length*: 6 fields visible at once (First, Last, Email, Phone, Program, Goals) — Hotel CRO 2026 industry consensus is ≤3 visible before scroll. ([Hotel CRO 2026 Insights](https://hotelsseo.com/blog/hotel-cro-2026-insights))
- iOS HIG: bottom sheets are the native idiom for ≤4 fields ([Apple HIG: Sheets](https://developer.apple.com/design/human-interface-guidelines/sheets)). LBTA's top-centered overlay feels "web," not "native."
- Cannot verify "keyboard covers Submit at 390 iOS Safari" without device — but with 6 fields + a textarea, the soft keyboard *almost certainly* obscures Submit on first-tap on the textarea.

**Recommendation (🟡 medium confidence): YES — bottom-sheet variant for mobile, defer rest of modal mechanics.**
- Effort: L (3–5 days).
- Replace the centered overlay with a bottom-anchored sheet at `<md:` breakpoint. Slide up from below. Sticky Submit at the bottom. Swipe-down dismiss. Max-height 80vh.
- Reduce visible fields: First+Last → single "Your name" or combined-line layout. Move "Goals (Optional)" to step 2 OR remove it entirely (it's already optional and the back-end doesn't critically need it).
- Target: **3 fields visible** at first paint + sticky Submit.

**If Andrew goes the other way (keep current overlay).**
- Modal still works; user can scroll within it. The Quick-win contrast + a11y fixes ship and the modal passes AA.
- Cost: continues to feel "web-form" on iOS. May leak some conversion to "I'll do this later from desktop."

**Deadline.** Decide by **2026-06-10** (4 weeks). Lots of moving parts; not a 2-week call.

---

## Q3 — StickyCTA strategy: always-on (current) or conversion-page-only?

> Plan default: **always-on**, but the audit should produce data that lets Andrew confidently decide.

**What the audit found.**
- StickyCTA appears on every page once scroll > 400px (`StickyCTA.tsx:54-56`).
- Mechanically: black-and-white luxury palette ✓, safe-area-inset honored ✓, contextual message per route ✓, single-expand pattern across stacking (`--lbta-sticky-cta-h` CSS var) ✓.
- Vibe check: Aman, Four Seasons editorial pages have **no sticky bar** on storytelling pages; the "Reserve" CTA lives in the top-right header. Aman's reservation flow is "always one tap from the corner" not "always one tap from the bottom."
- Belmond's "Slow Luxury 2026" framing is the opposite of always-on sticky CTAs — chapters with breathing room.
- Four Seasons exec on "delete first, optimize later": *"Luxury is no longer about more. It's about ease."* ([source](https://www.linkedin.com/posts/robmarkey_at-four-seasons-hotels-and-resorts-introducing-activity-7349416245869379585-By57))

**Recommendation (🟡 medium confidence): hybrid — keep StickyCTA on conversion pages, suppress on editorial pages.**
- **Conversion pages (keep StickyCTA):** `/`, `/schedules`, `/book`, `/junior-trial`, `/adult-trial`, `/programs/**`, `/contact`, `/pathway-planner`.
- **Editorial pages (suppress StickyCTA):** `/about`, `/philosophy`, `/coaches/andrew-mateljan`, `/coaches` (the index), `/success-stories`, `/blog/**`, `/faq`.
- Rationale: matches Aman's "reservation always in the header, never crowding the story" pattern. Quantifies "calm storytelling" without losing the Schedules-page CTA.
- Effort: S (1 day, just a prop on layouts or a `pathname.startsWith` check).

**If Andrew goes the other way (always-on).**
- Engineering effort: zero.
- Risk: editorial pages keep their transactional vibe; storytelling pages may underperform on time-on-page metrics.
- Reward (devil's advocate): users *do* convert from About pages sometimes; an always-visible Book CTA shortens that path.

**Deadline.** Decide by **2026-05-20** (1 week). Trivially reversible; should be fast.

---

## Q4 — Homepage hero stack: trim, or keep?

> Plan default: **trim the stack, keep the poster, defer video-drop to future experiment**.

**What the audit found.**
- Current hero stack at mobile (`HomeHero.tsx:127-172`):
  1. Eyebrow (`hero.eyebrow`)
  2. Tagline H1 (3 lines, `clamp(3rem, 9vw, 5.25rem)`)
  3. Pillars subline (Cormorant, clamp 1.25–1.75rem)
  4. Subline (sans, clamp 1–1.25rem)
  5. Pricing-hint link (Victoria Cove underline)
  6. Primary CTA (white-on-overlay button)
  7. Secondary CTA (outlined ghost button)
  8. Scroll-cue button (bottom-left)
- That's **8 stacked elements above the scroll-cue**. Aman.com mobile hero ([live](https://www.aman.com/)) is: 1 image, 1 sentence, 1 "Reserve" button in top-right header. Edition Hotels' [hero pattern](https://www.editionhotels.com/) is similar — bold serif H1 + soft fade-in + single CTA.
- Performance lab numbers (dev-mode caveats noted): TBT on homepage = **581ms** — the highest of any page, suggesting the parallax + video + entrance animations + multiple CTAs are doing real main-thread work.
- The "luxury delta" is most visible here. This is the page that decides if visitors think "boutique academy" or "service business."

**Recommendation (🟡 medium confidence): trim to eyebrow + tagline + 1 subline + 1 primary CTA, keep pricing-hint link as secondary affordance.**
- Effort: S (data-only change to `data/homepage-copy.json` + small `HomeHero.tsx` reflow).
- Remove the dual-CTA pattern at the hero; secondary CTA (`Explore Programs`) can live below the fold in the next section.
- Pillars line ("Movement · Craft · Community") can become a sub-eyebrow under the tagline OR be moved to a Founder Letter section.
- Scroll-cue stays.

**If Andrew goes the other way (keep current).**
- Risk: hero feels busier than the Aman/Edition benchmark.
- Reward: the current copy is good and well-crafted; trimming could remove signal that's already pulling weight.

**Deadline.** Decide by **2026-05-27** (2 weeks). This is the most visible Curve-2 change in the audit.

---

## Q5 — What is "done" for this audit?

> Plan default: 4 audit docs + screenshots + harness + remediation plan stub queued. Not "every finding fixed."

**What the audit produced.**
- `docs/audits/2026-05/scorecard.md` — Pass A measurable scorecard (Lighthouse / axe / contrast / brand tokens / touch targets / reduced-motion / h-scroll). 11 pages × 6 breakpoints sweep complete.
- `docs/audits/2026-05/gap-report.md` — Pass B luxury-flow gap report (F1–F5 + cross-cutting).
- `docs/audits/2026-05/findings.md` — Prioritized findings (4 Critical, 8 Should-fix, 4 Nice-to-have).
- `docs/audits/2026-05/andrew-decisions.md` — this doc.
- `docs/audits/2026-05/screenshots/` — 84 PNG screenshots across pages × breakpoints.
- `docs/audits/2026-05/lighthouse/` — 9 mobile Lighthouse reports (HTML + JSON).
- `docs/audits/2026-05/axe/` — 11 axe-core JSON outputs + a summary.
- `scripts/audit/screenshot-sweep.mjs` — Playwright sweep harness.
- `scripts/audit/axe-sweep.mjs` — axe-core sweep harness.

**Recommendation (🟢 high confidence): done — for the audit phase.**
- The plan's acceptance criteria all check off (see `findings.md` § acceptance gate).
- Real-device iOS + Android passes are explicitly **deferred to Andrew's manual pass**, with the gaps named in `scorecard.md` §12.
- Production Lighthouse re-run is explicitly deferred (dev-mode numbers flagged as diagnostic, not bar).

**If Andrew goes the other way (more work needed before "done").**
- The audit could be re-run after `npm run build && npm run start` to get production-mode numbers. This is a half-day of additional work and would let the scorecard claim "production passes the perf bar."
- The audit could also be extended with a manual VoiceOver iPhone pass + Android Chrome pass. That's 2–3 hours on a real device.

**Deadline.** This question gets answered by **2026-05-15** (2 days). If Andrew decides "more work first," I queue the production Lighthouse re-run and the device pass.

---

## Bonus — questions raised by the audit that weren't in the plan's original 5

These surfaced from the evidence. Andrew may or may not want to act on them.

### B-1 — Brand system v1.2 candidate: redefine the secondary-text token

The `text-brand-pacific-dusk/{50,60,65,70}` pattern keeps surfacing as AA-failing contrast across pages. **It's not a per-finding bug — it's a token design issue.** Cursorrules Part 7 has 12 brand colors + 4 utilities; "secondary text" isn't one of them; engineers reach for `/50–/70` opacity variants and they fail AA on light surfaces.

**Suggested:** introduce `--brand-text-secondary: <hex>` token tuned to pass AAA on both `morning-light` and `sandstone`. Quick-win fix is a global token swap; long-term fix is brand-system v1.2.

This is Curve 2 because it touches the brand-system lockdown (v1.1 was the canonical version). Could be the **most leveraged finding of the audit** — fixes contrast site-wide with one token change.

### B-2 — `/schedules` mobile information architecture

Discussed in gap-report F3 and plan §18.2. Not in the original 5 questions but worth Andrew's gut check: does the dense single-page-pricing-table feel transactional rather than boutique?

**Suggested:** if Q1/Q2/Q3 land cleanly, this can be a follow-up Curve-2 plan in 60-90 days. Don't bundle it.

### B-3 — Meta Pixel deprecation flag

All pages currently score Best-Practices 81 in part because Meta Pixel uses a deprecated API. This is also a **marketing / measurement decision**, not engineering. If Meta Lead events are mission-critical, keep it. If GA4 + ActiveCampaign are sufficient, retiring Meta cleans up BP score by ~5 points.

---

## Confidence summary

| Question | Confidence | Recommendation |
|---|---|---|
| Q1 — Mobile nav drawer | 🟡 | **redesign** Programs grid to 1-col + featured |
| Q2 — TrialBookingModal bottom-sheet | 🟡 | **YES** refactor on mobile |
| Q3 — StickyCTA always-on vs editorial-only | 🟡 | **hybrid** — suppress on editorial pages |
| Q4 — Hero stack trim | 🟡 | **trim** to 4 elements + 1 primary CTA |
| Q5 — Done? | 🟢 | **done** for audit phase; remediation is a new plan |
| B-1 — Brand v1.2 secondary-text token | 🟡 | **strong candidate** — most leveraged |
| B-2 — Schedules IA | 🔴 | **defer** — needs real conversion data |
| B-3 — Meta Pixel retire | 🔴 | **defer** — marketing call |

---

## Next step suggestion (audit author's view)

After Andrew answers Q1–Q5, the right move is **not** `/compound:review` on this audit (which would just verify the writing) — it's a **`/compound:plan` cycle for a Mobile UX Remediation Plan** that:

1. Ships all 11 Quick-wins from `findings.md` in one focused PR.
2. Implements Andrew's answer to Q3 (StickyCTA hybrid) immediately — it's small.
3. Defers Q1 + Q2 + Q4 + B-1 + B-2 into separate plans, each addressing one Curve-2 call cleanly.

That way **the easy compliance wins ship in 1–2 days, and the brand-defining decisions get the deliberation they deserve.**

If Andrew prefers `/compound:review` on this audit first (to validate the methodology before acting), that's reasonable but optional — the doc-level review wouldn't change the findings list, only the prose quality.
