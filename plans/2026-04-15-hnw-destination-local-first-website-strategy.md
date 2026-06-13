# LBTA Website — HNW · Destination · Local-First Growth Plan

## Overview

Deep strategic review of **lagunabeachtennisacademy.com** to align product, narrative, and UX with a **boutique, high-trust academy**: attract **high-net-worth households** and **serious developmental players** (including long-horizon competitive goals), **without** abandoning **local-first** community roots or **operational truth** in `/data`. Layer **Laguna Beach as destination** (camps, retreats, hotel partnerships, pickleball + tennis experiences) as a **parallel funnel** with clear labeling—not a rebrand into generic “luxury resort tennis.”

**Compound inputs:** CEO-advisor framing (stakeholder clarity, capital of attention, reputation risk), `.cursorrules` (voice, tokens, single source of truth), existing `plans/2026-04-15-full-site-operational-consistency-audit.md` (dates/pricing drift is a trust killer for HNW), Vibe Marketing **AUTHORITY** archetype (expert voice, facts > hype)—adapted so LBTA stays **calm**, not loud.

## Problem Statement

1. **Strategic tension:** The site must speak to **locals** (recurring revenue, culture, accessibility) and **visitors** (camps, retreats, short intensives) without mixed messages or buried CTAs.
2. **Positioning gap:** “Grand Slam” and “HNW” are **outcome and audience** signals, not slogans. Current copy skews **broad community + programs**; there is no dedicated **path for concierge / visitor / family relocating** or **long-horizon competitive development** that still matches brand voice (no “world-class,” “maximize,” fake scarcity—per project rules).
3. **Trust mechanics:** HNW parents and serious players punish **inconsistency** (schedule vs email vs doc). Operational audit already flags **multi-source drift**—that directly undermines premium positioning.
4. **Commercial expansion:** Hotels, retreats, pickleball packages need **web real estate + CRM handoff**—today they risk living only in DMs unless architected.

## Proposed Solution

### A. Audience architecture (two funnels, one brand)

| Funnel | Primary job-to-be-done | Site behavior |
|--------|------------------------|---------------|
| **Local / recurring** | Find the right program, trust coaches, book trial, stay year-round | Home → Programs / Schedule → Book; community proof; clear “what happens first week” |
| **Destination / concierge** | Plan a week or season in Laguna; pair lodging + tennis (+ pickleball); limited time | Dedicated **“Visit / Stay & Train”** (or similar) hub: packages **outline**, partner logos, **inquiry** CTA—not fake e-commerce checkout unless real |

**Rule:** Every destination page repeats **local members eat first** (court priority, culture)—one sentence, not defensiveness.

### B. Narrative: AUTHORITY without hype (Vibe + LBTA)

- **Primary archetype:** **AUTHORITY** (facts, methodology, coach credentials, clear progression)—aligned with founder-led positioning.
- **Secondary:** **TEACHER** / **STORYTELLER** for long-form (player arcs, parent decision journey)—already partially on Success Stories.
- **Avoid:** **HYPE_MACHINE**, generic **Instagram** lifestyle hooks verbatim; any line that trips **forbidden patterns** in `.cursorrules` (e.g. “elite,” “world-class,” urgency tricks).

**Grand Slam / pro trajectory:** Frame as **long-horizon development** and **individual readiness**—specificity (hours, structure, tournament support) over trophy promises.

### C. UX: “professional, simple sale”

1. **Global journey:** Awareness → **Schedule & pricing** (truth) → **Book trial / inquiry** → confirmation → human follow-up.
2. **Limit choices per screen:** Program hub holds breadth; **schedule** holds depth; landings hold **one primary CTA** + secondary “learn philosophy.”
3. **HNW affordances:** Optional **Concierge inquiry** form (name, goals, dates, travel, child age/level)—routes to CRM with **tagging** (local vs visitor, junior vs adult).
4. **Partnerships:** Hotels appear as **trust transfer** (named partners, “packages coordinated by LBTA,” not third-party checkout unless integrated).

### D. Destination product lines (web + ops)

- **Summer camps:** Already strong; amplify **Laguna as destination** in hero + FAQ (travel, parking, what to bring)—still **local kids first** in enrollment messaging where true.
- **Retreats / packages:** Start with **1–2 pilot** hotel partners; single landing **template** (problem → itinerary shape → what’s included → inquiry).
- **Pickleball + tennis:** Subpage or section under destination hub—**clear separation** from core tennis curriculum so brand doesn’t blur.

### E. Tie to operational consistency

**Before** heavy marketing spend on HNW/destination: complete or materially advance **`2026-04-15-full-site-operational-consistency-audit.md`**—premium buyers notice **date/price mismatches** instantly.

## Implementation Steps

### Phase 1: Strategy lock (1–2 working sessions)
- [ ] **Positioning paragraph** (internal): one page—who we are for locals vs visitors; what we never claim; Grand Slam language guardrails.
- [ ] **Partner criteria:** hotel/partner minimum (brand fit, liability, court access, margin).
- [ ] **CRM taxonomy:** tags for Local / Visitor / Trial / Camp / Retreat inquiry; automation rules.

### Phase 2: IA & content (site map)
- [ ] Add **destination hub** route (name TBD: `/visit`, `/laguna`, `/stay-and-train`) linked from footer + optional home module.
- [ ] **Concierge / group inquiry** variant on contact or standalone—fields match sales workflow.
- [ ] **Pathway clarity:** From “serious junior” and “high performance” pages, explicit **next step** chain to schedule + trial (no orphan pages).

### Phase 3: Copy & design passes (brand-compliant)
- [ ] Rewrite key headers for **AUTHORITY**: specifics (method, progression, coach ratios where true)—run **forbidden phrase** pass (project list + optional `flag-problematic-phrases` for AI-ish tone).
- [ ] **HNW-sensitive trust elements:** named testimonials only if permissioned; align Google review stats with live profile.
- [ ] Photography brief: **destination** module uses **coastal / editorial** assets—consistent with luxury restraint (not stock tennis clichés).

### Phase 4: Engineering & measurement
- [ ] Events: `inquiry_submit`, `partner_click`, `destination_section_view` for analytics.
- [ ] UTM playbook for hotel partners; single landing per campaign.
- [ ] Schema.org updates for **LocalBusiness** + events/camps if applicable.

### Phase 5: Validate & compound
- [ ] **Usability:** 3–5 parent interviews (2 local, 2 out-of-area)—task: find camp dates + price + book path.
- [ ] **Acceptance:** See checklist below; then `/compound:learn` capture (what messaging landed, what confused).

## Files to Create/Modify (when executing — not all in this strategy pass)

| File / area | Action | Purpose |
|-------------|--------|---------|
| `app/visit/` or similar | Create | Destination hub |
| `components/layout/Header.tsx`, `Footer.tsx` | Modify | Nav to hub |
| `data/*.json` + schedule | Modify | Any new packages **must** pull numbers from data |
| `lib/form-config.ts`, CRM routes | Modify | Concierge fields + tags |
| `plans/2026-04-15-full-site-operational-consistency-audit.md` | Execute | Trust prerequisite |

```yaml
# files (for tooling; sync when implementation starts)
create: []
modify: []
```

## Out of scope (this plan document)

- Full visual redesign unrelated to IA/content.
- Building hotel booking engines or taking payments for packages without ops/legal readiness.
- Replacing ActiveCampaign/GHL—only **tag/field** recommendations unless separate project.

## Success Criteria

- [ ] Two-funnel model **documented** and reflected in **nav + one new hub**.
- [ ] **Primary user tasks** ≤3 clicks to schedule or book from home (validated by test).
- [ ] **Zero** known date/price conflicts between site JSON and public emails (per ops audit remediation).
- [ ] **Brand check:** no forbidden hype patterns; Grand Slam / competitive goals framed responsibly.
- [ ] **Partner-ready:** at least one **repeatable** landing pattern for hotel/retreat collaboration.

## Acceptance checklist

- [ ] Stakeholder reads positioning paragraph and says **“this is us”** for both local and visitor.
- [ ] New visitor can answer: **When is camp? What does it cost? How do I start?** in under **2 minutes** on site.
- [ ] CRM receives **distinguishable** inquiries (local vs destination) for follow-up.
- [ ] `npm run ship:gate` passes after any shipped code changes.

## Research Sources

- Internal: `plans/2026-04-15-full-site-operational-consistency-audit.md`, `.cursorrules`, `app/sitemap.ts`
- Vibe Marketing MCP: `list-archetypes`, `get-archetype` (AUTHORITY), `find-hooks` (adapt, don’t copy generic hooks)
- Live site: https://lagunabeachtennisacademy.com/

## Relevant Learnings

- **Operational drift** destroys premium positioning—fix data single-source before scaling HNW messaging.
- **AUTHORITY** voice = specificity and credentials; LBTA adds **warmth + restraint** on top.

## Research conflicts & resolution

- **CEO growth instinct (“Grand Slam,” “HNW”)** vs **brand rules (no “elite” / hype):** Resolve with **specific developmental claims** and **pathway language**, not trophy promises.
- **Destination marketing** vs **local-first:** Resolve with **explicit dual funnel** and **transparent enrollment/court priority** where policy exists.

## Confidence & uncertainty

- **Plan confidence:** Medium-high for IA + messaging; **medium** for partner economics until hotels confirm.
- **Uncertainty:** Actual **conversion rate** of destination inquiries; **legal** terms for packages; **court capacity** for retreats.

## Risks & Mitigations

| Risk | Mitigation |
|------|------------|
| Sounding exclusive or elitist | Pair every upscale line with **structure, clarity, community**—show, don’t boast |
| Overpromising competitive outcomes | Tie claims to **process** and **individual assessment** |
| Partner reputation drag | Named partners only; written standards; exit clause |
| Site complexity | Strict **hub + schedule** pattern; one CTA per critical view |
| Ops/data drift | Finish consistency audit; automate grep for `$` outside `/data` |

## Decision lenses (short)

- **Ghost notes:** Missing pieces might include **clear refund/policy** link on destination flows, **travel packing** FAQ, **what “boutique” means** in numbers (ratio, hours).
- **Loss function:** Primary metric for first 90 days: **qualified inquiries** (destination + concierge), not raw traffic.
- **Horizons:** 90d = hub + pilot partner; 18mo = repeatable retreat product + CRM loops; 5yr = LBTA as **credible** national destination for serious juniors **without** diluting local identity.
- **Identity:** This should make LBTA **more legible**, not louder—**craftsman** positioning.

---

*Compound phase: **PLAN** complete. Next: stakeholder alignment → `/compound:work` against scoped tickets (IA + hub + forms), parallel ops audit execution.*
