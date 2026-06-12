# LBTA Brochures — V2 Voice Refresh + 09 Pod Application One-Pager

**Date:** 2026-05-06 · **Owner:** Andrew Mateljan · **Status:** Plan (awaiting approval)
**Builds on:** `plans/2026-05-06-lbta-print-brochure-system-v2-plan.md` (V2 ship plan, executed)
**Triggered by:** Andrew feedback — "good, but i just don't like the copy you chose, like how many players we support and everything like this, you know that's not what we do and how we want to present ourselves"

## Overview

Two phases. **Phase A** corrects voice/positioning drift in the just-shipped V2 set — strip volume metrics ("695 players · 25+ years · 20+ D1"), scrub the universal banned word "precision," upgrade the founder bio to bundle-truth depth, and recalibrate CTAs toward Andrew's "Reply / Come play" pattern. **Phase B** adds the 9th deliverable — `09_Pod_Application_OnePager.pdf` — using The Pod's distinct **Aman Resorts × tennis** voice and the 4-Layer Framework documented in `Shared_Brand_VoiceGuide_v2.md`.

## Problem Statement

V2 shipped technically correct against the website data files, but the **website data files are not the highest-fidelity source for LBTA voice and bio**. The canonical project bundle (`01_TIER_1_Always_Upload/*`) is. Three concrete drifts vs that bundle:

1. **Volume metrics block on the tri-fold (`stat-row`)** — `25+ Years · 695 Players · 20+ D1 alumni · 5.0/47 reviews`. The Brand Voice Guide explicitly says LBTA voice is "warm authority, professional but never corporate" and "What it's NOT: Aggressive sales … 'elite' or 'exclusive' language." The Mateljan Method §10 says "Parents are partners, not customers." Brochure stats blocks read like volume bragging — wrong tonal register. Andrew called this out directly.
2. **Universally banned word "precision"** appears in the A5 booklet philosophy block: *"Technical precision through biomechanics and footwork."* Per `Andrew_Master_System_Instructions_v2.md` line 109, "precision" is a hype word, banned in all contexts. (Source: `01_Andrew_Master_System_Instructions_v2.md` Banned Words list)
3. **Founder bio is generic vs canonical** — V2 mentions Karue Sell, Max McKennon, Ryan Seggerman (good). Missing from V2 but documented in the bundle: **Colton Smith #133**, **Alex Michelsen "came through" at ages 12–13 (now ATP #30, 2022 Wimbledon Boys' Doubles champion)**, **fourth-generation tennis coach lineage** (Grandpa Steve at Ford Park), **Kalamazoo × 2**, **ITF Futures circuit (US, Venezuela, El Salvador, Guatemala)**, **Sánchez-Casal Spain training under Jimmy Johnson**, **187-105 USTA coaching record (64% win rate)**. The bundle's specific guidance for Michelsen: *"Use 'came through' not 'I coached' — supplemental training, not primary."* V2 omitted Michelsen entirely (because `data/coaches.json` doesn't have him); the bundle confirms he's correct to mention with the right framing.

Plus a separate gap: **the Pod is a documented pricing-published program** (`06_LBTA_Finance_PricingMembership_v2.md` lines 153–169) with its own brand voice — but no brochure exists for it. V2 explicitly excluded Pod copy from variants 01–08 because the website doesn't carry it. With the bundle as a published source, the Pod one-pager can ship as a standalone variant 09 — by application, by invitation, separate from the public set.

## Proposed Solution

### Phase A — V2 voice refresh (must precede Pod ship)

Three targeted changes:

1. **Replace `partials/trust-block.html` with `partials/anchors-block.html`.** No numbers. Three qualitative anchors that match Brand Voice Guide LBTA tone: founder line ("*Founded by Andrew Mateljan · Fourth-generation tennis coach · Twenty years on tour and on court*"), city partnership line ("*Official City of Laguna Beach Tennis Partner since 2020*"), pillar line ("*Movement · Craft · Community*"). Used on tri-fold inside spread, A5 closing page, family page 2. (Source: Brand Voice Guide §1 LBTA Voice — "Vocabulary: 'our community,' 'on the courts,' 'development,' 'investment'")
2. **Scrub "precision."** A5 booklet line *"Technical precision through biomechanics and footwork"* → *"Technical clarity through biomechanics and footwork"* (or *"Footwork solves 80% of the problem before the swing happens"* directly from the bundle's Movement section). Add `precision`, `elevate`, `boost`, `enhance`, `unlock`, `game-changing`, `cutting-edge`, `amazing`, `incredible`, `optimize`, `mastery` to `check_brochure.py` BANNED_WORDS so they can never slip in again. (Source: `Andrew_Master_System_Instructions_v2.md` line 109 universal banned-words list)
3. **Upgrade founder bio in A5 booklet (page 2) and tri-fold panel 3 with bundle-truth specifics.** Add: fourth-generation lineage, Kalamazoo × 2, ITF Futures circuit, Sánchez-Casal Spain under Jimmy Johnson, Colton Smith ATP #133, Alex Michelsen "came through" at 12–13 (now ATP #30, 2022 Wimbledon Boys' Doubles champion), Karue Sell trajectory ("took him from #860 to #258 in 2025"). Keep concise — booklet page-2 prose, not a list. (Source: `03_Shared_The_Mateljan_Method_v5.md` §1 Identity + `06_LBTA_Finance_PricingMembership_v2.md`)

These three edits keep the existing 8 templates and the build pipeline intact. No file deletions. Re-render takes ~6s.

### Phase B — 09 Pod Application One-Pager (the Aman × tennis voice)

A single 8.5×11 letter-size PDF, printed on uncoated soft-touch cover, **handed to UHNW prospects in person or attached to a personal email from Andrew**. Not for hotel concierges. Not for the family-list. By invitation only.

**Structure follows the Pod's 4-Layer Framework** (Source: `05_Shared_Brand_VoiceGuide_v2.md` §2 The Pod Voice):

- **Layer 1 — Sensory Luxury Design.** Hero photograph (golden-hour court at Alta Laguna or LBHS). Opening prose evokes the physical experience: *"Morning light on the court. The sound of the ball. Ocean breeze ten minutes from the water. This is where small groups of serious players train every day with the same coach."*
- **Layer 2 — Status Architecture.** Scarcity through craft, not logos. *"By invitation. Two paying families per Pod. Annual commitment."* The "team behind the work" — Andrew + Peter + Allison, named. No "exclusive" / "limited time" language (banned).
- **Layer 3 — Institutional Semiosis.** Heritage + provenance. Fourth-generation tennis family. ATP coaching network (Colton Smith, Karue Sell, Max McKennon, Ryan Seggerman, Michelsen-came-through). D1 pipeline (Sean Daryabeigi USC, Rebecca Lynn Yale, Lauren Stein Cornell). Sánchez-Casal Spain.
- **Layer 4 — Narrative Cognition & Pacing.** Slow reveal. Don't lead with price. Open with what training *looks like*. Move through the team, the track record. Investment table appears in the lower third — quiet, not loud.

**Track record** (RESOLVED 2026-05-06 — Andrew chose: name Henry with full trajectory): Henry Mateljan (age 9), UTR 2.48 → 4.60 in 18 months. Currently in the 4.60–5.00 band (May 2026). One named player. Real numbers. The "original projection of ~7.0 by EOY" line from the bundle does NOT print — published trajectory only, no projection.

**Investment** (RESOLVED 2026-05-06 — Andrew chose: no price on the sheet):
- The sheet does NOT publish the dollar band. The Pod is "an annual program commitment" — pricing is shared in the follow-up conversation after Andrew receives the email.
- The bundle's published bands ($6,600–$11,000/mo for 3-player; $5,000–$8,333/mo for 4-player) inform the conversation, not the print piece.
- The sheet does describe what's included narratively: *"On-court training, individual development plans, tournament programming, travel coaching, communication, availability — one tuition covers it all."*

**CTA** (Pod-voice — RESOLVED 2026-05-06: email only, no phone):
*"Pod placement is by invitation. To request consideration, write to Andrew directly at andrew@lagunabeachtennisacademy.com."*

**Contact channel** (per `02_LBTA_SystemPrompt_v2.md` routing logic line 222: *"Premium / private inquiry → The Pod → connect with Andrew directly"*): **email only** — `andrew@lagunabeachtennisacademy.com`. The (949) 534-0457 academy line is NOT on this sheet (kept reserved for the public set).

## Implementation Steps

### Phase A — voice refresh

- [ ] Step A.1: Create `brochures/partials/anchors-block.html` — three qualitative anchor lines, no stats, drop-in replacement for `trust-block.html`.
- [ ] Step A.2: Edit `01_trifold_core.html` panel 3 — replace `stat-row` block with anchors-block render; rebalance heading + CTA card to fill the freed space (likely a longer founder pull-quote from the bundle).
- [ ] Step A.3: Edit `02_a5_booklet.html` — (a) page 2 Movement bullet: remove "precision"; (b) page 2 founder paragraph: upgrade with bundle-truth specifics (Colton Smith, Michelsen-came-through, Sánchez-Casal Spain, fourth-generation, Kalamazoo); (c) page 8 closing CTA — soften from "Book a complimentary trial" to "Reply for a personal program match" or keep transactional based on Andrew's call.
- [ ] Step A.4: Edit `06_email_warm_lead.html` founder coach card subtitle — append "fourth-generation tennis coach" anchor.
- [ ] Step A.5: Edit `07_private_coaching_onepager.html` Andrew bio — add Colton Smith #133, Michelsen-came-through framing, fourth-generation lineage. Keep concise.
- [ ] Step A.6: Update `00_MASTER_CONTENT_V2.md` §3 Coaches — Andrew block matches the bundle bio. Note Michelsen framing rule explicitly.
- [ ] Step A.7: Update `scripts/check_brochure.py` BANNED_WORDS — add `precision`, `elevate`, `boost`, `enhance`, `unlock`, `game-changing`, `cutting-edge`, `amazing`, `incredible`, `optimize`, `mastery`. (Universal banned-word list from `Andrew_Master_System_Instructions_v2.md` line 109.)
- [ ] Step A.8: Re-render all 8 V2 PDFs; re-run check_brochure.py with full network check; visual QA on the 3 changed templates (01, 02, 07); refresh `~/Desktop/LBTA_Brochures_v2/`.

### Phase B — 09 Pod Application One-Pager

- [ ] Step B.1: Add Pod content section to `scripts/build_brochure_content.py` — new `pod` block keyed off the bundle pricing (3-player range, 4-player range, travel coaching rate, annual prepay discount, Henry track record, configuration scarcity language). Mark this block clearly: *"Pod data — published per `06_LBTA_Finance_PricingMembership_v2.md`. Do not appear on variants 01–08."*
- [ ] Step B.2: Create `brochures/templates/09_pod_application_onepager.html` — single 8.5×11 page, 4-Layer Framework structure documented inline as HTML comments so the next editor sees the voice rules.
- [ ] Step B.3: Source one Pod-appropriate hero photo. Best candidate from existing assets: `hero-courts-sunset.jpg` (golden hour, ocean horizon, warm and quiet). Stretch goal: a Henry-on-court image if one exists in `data/player-media.json` or website assets.
- [ ] Step B.4: Write Pod copy under 4-Layer Framework. Hand-author this — not a template-fill exercise. Voice cadence: slow, sensory, named. Lengths: opening 3-4 sentences sensory; middle 4-6 sentences team + heritage; investment table compact; closing 1-2 sentences quiet invitation.
- [ ] Step B.5: Render via existing pipeline (`render_brochure.py 09`). Verify only Cormorant + DM Sans embedded. Verify zero banned words. Verify no public-set leak (the variants 01–08 must not be regenerated from a Pod-aware content.json without checking).
- [ ] Step B.6: Add `09_pod_application_onepager.pdf` to `~/Desktop/LBTA_Brochures_v2/` only after Andrew approves the rendered PDF. Stage in a sub-folder `_BY_INVITATION_ONLY/` so it's clearly not part of the open set.
- [ ] Step B.7: Update `00_MASTER_CONTENT_V2.md` §10 (Out of scope) — move Pod from "out of scope" to "in scope as variant 09, by-invitation distribution only."
- [ ] Step B.8: Update `brochures/docs/HOW_TO_PRINT.md` — add 09 row: 8.5×11 letter, uncoated soft-touch cover, qty 25–50 (very low — this is a personal-handoff piece, not bulk).

> **Step dependencies:** Phase A must complete and pass acceptance before Phase B renders. Phase A and the Pod-content-block (Step B.1) are independent and can run in parallel.

## Files to Create/Modify

| File | Action | Purpose |
|---|---|---|
| `brochures/partials/anchors-block.html` | Create | Replace trust-block — qualitative anchors, no numbers |
| `brochures/partials/trust-block.html` | Modify | Deprecate (keep file but unused; or delete after grep confirms zero refs) |
| `brochures/templates/01_trifold_core.html` | Modify | Swap stat-row for anchors; founder pull-quote |
| `brochures/templates/02_a5_booklet.html` | Modify | Strip "precision"; upgrade founder bio; soften closing CTA |
| `brochures/templates/06_email_warm_lead.html` | Modify | Append "fourth-generation" anchor on Andrew card |
| `brochures/templates/07_private_coaching_onepager.html` | Modify | Add Colton Smith / Michelsen-came-through / fourth-generation to Andrew bio |
| `brochures/templates/09_pod_application_onepager.html` | Create | Pod variant — Aman × tennis voice, 4-Layer Framework |
| `brochures/00_MASTER_CONTENT_V2.md` | Modify | §3 Coaches Andrew bio update; §10 Pod no longer out-of-scope; §11 Variant manifest +1 |
| `brochures/docs/HOW_TO_PRINT.md` | Modify | Add 09 print spec row |
| `scripts/build_brochure_content.py` | Modify | Add `pod` content block (sourced from bundle, not website) |
| `scripts/check_brochure.py` | Modify | Add 11 universal banned words to BANNED_WORDS |

```yaml
# files (for tooling)
create:
  - brochures/partials/anchors-block.html
  - brochures/templates/09_pod_application_onepager.html
modify:
  - brochures/templates/01_trifold_core.html
  - brochures/templates/02_a5_booklet.html
  - brochures/templates/06_email_warm_lead.html
  - brochures/templates/07_private_coaching_onepager.html
  - brochures/00_MASTER_CONTENT_V2.md
  - brochures/docs/HOW_TO_PRINT.md
  - scripts/build_brochure_content.py
  - scripts/check_brochure.py
```

## Out of scope (this plan)

- **No new variants beyond 09.** The Pod-application one-pager is the only addition. No "Pod brochure" 2-page version, no Pod email template, no Pod video script. Future Pod assets get their own plan.
- **No website changes.** `data/coaches.json` is not updated to add Michelsen / Colton Smith — that's a website fix, not a brochure fix. (Recommended as a follow-up plan, but not here.)
- **No Andrew personal phone/text-line publication.** The (949) 534-0457 academy line + the andrew@lagunabeachtennisacademy.com email remain the only published contact channels for Pod prospects, unless Andrew explicitly approves another in writing.
- **No Pod public marketing.** Variant 09 is by-invitation only — never on the website, never in a hotel concierge stack, never in an email blast, never on social.
- **No copy beyond the bundle.** No invented Pod sensory detail beyond what the brand voice guide explicitly authorizes (morning light, ocean breeze, sound of the ball). No "exclusive," no "private oasis," no "world-class" — all on the universal banned list.

## Success Criteria

- [ ] V2 set (variants 01–08) re-rendered with no volume metrics anywhere
- [ ] Zero "precision" / "premium" / "elite" / "elevate" / "boost" / "enhance" / "unlock" / "world-class" / "amazing" / "incredible" in any rendered HTML or PDF
- [ ] Andrew bio in 02 booklet, 01 trifold panel 3, and 07 private coaching page mentions: fourth-generation tennis coach, Kalamazoo, ITF Futures, Sánchez-Casal Spain, Colton Smith #133, Michelsen "came through" at 12–13 (now ATP #30)
- [ ] CTA tone audit: at least three variants now use a softer Andrew-voice CTA ("Reply / Come play / Find your level") — keeping "Book a Trial" only where transactional intent is clear
- [ ] Variant 09 renders, embeds only Cormorant + DM Sans, contains zero banned words, follows 4-Layer Framework
- [ ] Variant 09 contains the Henry track record (UTR 2.48 → 4.60 in 18 months) and the configuration-as-scarcity ("two paying families per 3-player Pod")
- [ ] Variant 09 publishes the bundle-documented pricing band ($5,000–$11,000/mo across configurations)
- [ ] Variant 09 stages in `~/Desktop/LBTA_Brochures_v2/_BY_INVITATION_ONLY/` not the open set
- [ ] All checks (colors, fonts, banned words, Pod-leak in 01–08, URLs) pass

## Acceptance checklist

- [ ] **No volume metrics** → grep all rendered HTML for `stat-row`, `years_experience`, `players_count`, `d1_placements`, `review_count` → zero hits in templates 01–08 (anchors-block has replaced).
- [ ] **No "precision" anywhere** → grep all rendered HTML and PDFs (`pdftotext`) → zero hits.
- [ ] **Universal banned-words gate** → `check_brochure.py` includes the 11 added words; passes green on all 9 variants.
- [ ] **Founder bio depth** → grep PDFs 01, 02, 07 for: "fourth-generation," "Kalamazoo," "Sánchez-Casal" (or "Sanchez-Casal"), "Colton Smith," "Michelsen" with the specific phrase "came through" — all present.
- [ ] **Pod 4-Layer signals present in 09** → grep PDF 09 text for sensory ("morning light" or "ocean" or "court at"), status ("by invitation," "two paying families"), institutional ("fourth-generation" + at least one ATP name), narrative pacing (price appears in lower half of page, not opening).
- [ ] **Pod CTA matches voice guide + Andrew's choice** → 09 PDF contains the word "invitation" and routes ONLY to `andrew@lagunabeachtennisacademy.com` (the (949) 534-0457 line is intentionally absent — kept for the public set).
- [ ] **No Pod price on 09** → grep 09 PDF text for `$`, `5,000`, `8,333`, `11,000`, `6,600` → zero hits (price held for the follow-up conversation per Andrew's choice).
- [ ] **No Pod leak into 01–08** → grep PDFs 01–08 text for "Pod" / "by invitation" / "Henry" / "UTR 2.48" → zero hits.
- [ ] **By-invitation staging** → 09 lives in `~/Desktop/LBTA_Brochures_v2/_BY_INVITATION_ONLY/09_pod_application_onepager.pdf`, NOT in the open set folder.
- [ ] **Regeneration** → `bash scripts/build_brochures.sh` re-renders all 9 PDFs idempotently; pre-flight green.
- [ ] **Visual QA** → Andrew has reviewed and approved the rendered 09 PDF specifically (Pod is judgment, not just compliance — the Aman tone is a taste call).

## Research Sources (bundle, the higher-fidelity layer)

- `01_TIER_1_Always_Upload/01_Andrew_Master_System_Instructions_v2.md` — universal banned-words list (line 109), Tennis Beast LLC ecosystem, voice DNA
- `01_TIER_1_Always_Upload/02_LBTA_SystemPrompt_v2.md` — routing logic for Pod inquiries (line 222: "Premium / private inquiry → The Pod → connect with Andrew directly")
- `01_TIER_1_Always_Upload/03_Shared_The_Mateljan_Method_v5.md` — §1 Identity (full Andrew bio), §10 LBTA Experience Standard ("Parents are partners, not customers"), §11 multi-platform voice ("The Pod" row: *"Premium, personal, transparent. 'You know me. You know Henry. Here's how this works.' No corporate language."*)
- `01_TIER_1_Always_Upload/05_Shared_Brand_VoiceGuide_v2.md` — §1 LBTA voice ("warm authority, professional but never corporate"), §2 The Pod 4-Layer Framework (SLD / SA / IS / NCP), universal banned words list
- `01_TIER_1_Always_Upload/06_LBTA_Finance_PricingMembership_v2.md` — Pod pricing bands (lines 153–169), Henry track record (line 169), tournament/travel coaching add-ons
- `01_TIER_1_Always_Upload/07_LBTA_Finance_PrivateLessonRates_v2.md` — confirms two-tier structure stays as published in V2 (no change needed)
- `01_TIER_1_Always_Upload/09_Shared_Andrew_Email_Voice_v2.md` — Tier 5 parent voice ("Hi Will! Yes-..."), CTA pattern (no "Book," prefer "Reply / Lmk")

## Relevant Learnings (extracted)

- **Bundle > website data files for voice and bio.** `data/coaches.json` is the website's runtime truth; `Shared_The_Mateljan_Method_v5.md` is the human-edited canonical. When they conflict, the bundle wins for narrative copy. The website data may need its own update plan to reach parity.
- **Volume metrics are an LBTA anti-pattern.** They look like marketing energy but read as corporate. Qualitative anchors (founder lineage, city partnership, philosophy) hold the same trust function without the tonal drift.
- **The Pod is structurally separate from public LBTA.** Different voice, different audience, different distribution channel, different language register. Co-authoring it inside the same template family would dilute both. Hence: separate variant, separate folder, separate distribution rule.
- **"Premium" is a universal banned word** (in the bundle's banned list, not just the chatbot list). I used it in the V2 master content doc (correctly flagged as banned in the doc itself, but the doc's own meta-language used it). Future copy generation must run through the universal-banned-words check, not just the chatbot-banned phrase check.

## Research conflicts & resolution

- **`data/coaches.json` vs bundle on Andrew's bio.** Website data: 3 ATP players (Karue Sell, Max McKennon, Ryan Seggerman). Bundle: 5 (adds Colton Smith #133, Alex Michelsen "came through" 12–13). The bundle is more complete and is what Andrew actually wrote. **Resolution: bundle wins for brochure copy.** Recommend a follow-up plan to update `data/coaches.json` so the website matches.
- **Pod track record specifics.** Bundle has Henry "UTR 2.48 → 4.60 in 18 months" with explicit caveat "original projection of ~7.0 by EOY adjusted to a more sustainable trajectory." V2 plan said "don't print specific trajectories without verifying" — but here the bundle IS the verification, and Andrew himself published the line. **Resolution: print the verified trajectory; do NOT print the original projection.** Caveat-aware writing.

## Confidence & uncertainty

- **Plan confidence: HIGH** on Phase A (clear corrections, mechanical execution, tight scope).
- **Plan confidence: MEDIUM-HIGH on Phase B copy structure**, **MEDIUM on Pod voice landing the Aman tone on first pass.** The Pod voice is taste-driven — likely needs 1–2 iterations with Andrew before final.
- **Uncertainty:**
  - Andrew personal text-line — kept off the brochure unless he approves. Default routes through academy line + email.
  - Whether the Henry track record reads as "warm specificity" or "using my own son in marketing" — both valid framings, Andrew's call.
  - Whether the Pod pricing band ($5K–$11K) goes on the printed sheet at all, or whether the printed sheet is invitation-only and pricing is shared in the follow-up conversation. Plan default: print the band (it's published in the bundle and signals seriousness without negotiation).

## Risks & Mitigations

| Risk | Mitigation |
|---|---|
| Pod voice misses (sounds Aman-cosplay rather than Aman-confident) | Andrew personally reviews and approves variant 09 before any distribution. Iterate copy 1–2 times. Acceptance check #10 explicitly requires his sign-off. |
| Pod copy leaks into public set when content.json regenerates | `check_brochure.py` Pod-leak check now expanded to grep all variants 01–08 for `$11,000`, `$8,333`, `$6,600`, `$5,000`, "by invitation," "Pod" — fails build if any hit appears outside variant 09. |
| Removing volume stats weakens trust block visually | Anchors-block redesign — three single-line founder/city/pillar anchors with horizon gradient separator — holds the same visual weight without numbers. Reviewed at render. |
| Andrew bio inflates and starts sounding boastful | Stick to the bundle's exact phrasing patterns ("came through," "took him from #860 to #258"). One paragraph max. The 6-named-players list is what reads as confidence, not adjectives. |
| New banned word "precision" breaks legitimate usage | Verified zero hits across V2 copy except the one Movement bullet. Replacement word ("clarity") aligns with Brand Voice Guide LBTA voice ("warm authority, professional"). |
| Andrew's text-line gets surfaced inadvertently | Plan explicitly out-of-scope: only the academy line and email appear on variant 09. Acceptance check verifies. |

> **Gate:** Variant 09 does not ship to anyone — including Andrew's prospects — until Andrew personally reviews the rendered PDF and approves. Phase B Step B.6 is gated on that approval. Pre-print run is zero copies until then.

## Decision lenses applied

- **Curve 1 vs Curve 2.** Phase A is **Curve 1** (mechanical corrections, capped payoff). Phase B is **Curve 2** (taste-driven, uncapped payoff — the Pod voice is part of the Pod offering's identity). Phase A ships at 95%; Phase B iterates with Andrew until it feels right.
- **Identity** — These edits are about *what we become to a parent reading this on their kitchen counter*. Volume stats make us a vendor. Founder lineage + city partnership + named ATP players make us a coach. The Pod page makes us *the team you'd want for your kid if you could have anyone*.
- **Survivorship gap** — Easy to miss what isn't there. The V2 set looked complete because all eight files exist. The gap was tone register and bio depth. Phase A closes that gap.
- **18-month horizon** — Pod variant 09 is the long-tail asset. A handful of UHNW conversations per year, but those are program-defining commitments. The artifact has to feel like the program.

## Open questions — RESOLVED 2026-05-06

1. **Pod contact channel** → ✓ **Email only.** `andrew@lagunabeachtennisacademy.com`. No phone on the sheet.
2. **Pod pricing on the printed sheet** → ✓ **No price.** Invite the conversation; share pricing in the follow-up.
3. **Henry as the named track record** → ✓ **Named in full.** Henry, age 9, UTR 2.48 → 4.60 in 18 months. Verified trajectory only — no projection language.

---

## Next step (after approval)

Run `/compound:work plans/2026-05-06-lbta-brochures-v2-voice-refresh-and-pod-onepager.md`. Phase A executes in ~30 minutes (mostly mechanical). Phase B is ~1 hour drafting + iteration with you on the Pod copy.
