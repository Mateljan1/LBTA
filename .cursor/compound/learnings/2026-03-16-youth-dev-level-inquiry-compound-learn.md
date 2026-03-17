# Compound Learn — Youth Development Level-Based + Inquiry (2026-03-16)

**Source:** Youth Development level-based (UTR) messaging, special note for younger UTR-qualified players, and optional inquiry link. Pattern consideration: unify “with coaches’ approval” across programs.

---

## What Was Done

- **Youth Development** (winter/spring-summer/fall JSON): Ages set to "11-18 (level-based; UTR 1.5-5)"; description states level-based placement and that younger players who meet UTR may qualify; pricingNote: "Under 11 with UTR 1.5+? Contact us to inquire about placement."; inquiryLabel: "Inquire about placement" with link to `/contact?program=Youth%20Development&inquiry=placement`.
- **Program type** (ProgramCard.tsx): Optional `inquiryLabel`; ProgramRow and ProgramCard render an "Inquire" link when set.
- **Schedule schema**: Optional `inquiryLabel` on program schema.

---

## CORRECTIONS

| Original | Correction |
|----------|------------|
| Level- or invitation-based programs had no way for edge-case families (e.g. under age but UTR-qualified) to ask about placement | For programs with placement gates (level, invitation, coach approval), use description + optional pricingNote + optional inquiryLabel and link to contact so families can inquire; apply consistently where appropriate. |

---

## PATTERNS ADDED

- **placement-inquiry-unified** — When a program is level-based, invitation-based, or coach-approved (e.g. Youth Development, UTR Green Dot — Competitive, High Performance), use: (1) description that states level/age and that exceptions may qualify with coach approval where applicable; (2) optional pricingNote for the edge case (e.g. under age, different level); (3) optional inquiryLabel and link to `/contact?program=...&inquiry=placement` so families can inquire. Keeps “with coaches’ approval they can join a different class” unified: one pattern across programs instead of only on Youth Development.

---

## UNIFIED PLACEMENT / INQUIRY (RECOMMENDATION)

**Currently:**
- **Youth Development** — Level-based (UTR 1.5–5), ages 11–18; younger with UTR can qualify → has pricingNote + inquiryLabel. ✅
- **UTR Green Dot — Competitive** — "Invitation-based." No pricingNote or inquiryLabel; families have no explicit “contact to discuss invitation” path on the schedule row.
- **High Performance** — Ages 12–17, UTR 5+. FAQ says commitment + minimum skill (UTR 6+ by 14). No inquiry path on schedule for “almost there” or age exception.

**Recommendation:** Unify the pattern so any program that has a placement gate (level, invitation, or coach approval) offers:
1. Clear copy that it’s level/invitation/approval-based.
2. A short note for the edge case (e.g. “Under 12 or close on UTR? Contact us to discuss.” for HP; “Invitation-based — contact us to discuss placement.” for Green Dot Competitive).
3. Optional **Inquire** link (inquiryLabel) to `/contact?program=...&inquiry=placement` so “with coaches’ approval they can join” is discoverable and consistent.

**Concrete next steps (optional):**
- **UTR Green Dot — Competitive:** Add pricingNote (e.g. "Invitation-based. Contact us to discuss placement.") and inquiryLabel "Inquire about placement" in winter/spring-summer/fall JSON.
- **High Performance:** Add optional pricingNote (e.g. "Under 12 or UTR 4–5? Contact us to inquire about readiness.") and inquiryLabel "Inquire about placement" if you want the same one-click path for edge cases.

No schema or UI changes needed; the pattern is already supported. Only add the same fields to other program entries in the season JSON where you want the unified “inquiry / coach approval” experience.

---

## FILES UPDATED (this learn run)

- `.cursor/compound/learnings/patterns.json` — Added placement-inquiry-unified; updated lastLearnRun.
- `.cursor/compound/learnings/corrections.jsonl` — 1 new correction (placement-inquiry for level/invitation programs).
- `.cursor/compound/learnings/2026-03-16-youth-dev-level-inquiry-compound-learn.md` — This file.
