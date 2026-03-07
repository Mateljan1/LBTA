# Documentation Check Report — LBTA

**Focus:** `.cursorrules` Part 13 (file structure), comments in code, color/typography, forbidden patterns.  
**Reference:** `plans/REVIEW_SCOPE.md`, `.cursorrules` structure.

---

## Status: ❌ ISSUES

---

## Findings

| Severity | Location | Issue | Recommendation |
|----------|----------|--------|----------------|
| 🔴 Critical | `.cursorrules` Part 13 — `lib/` | Part 13 lists `lib/notion.ts` and `lib/utils.ts`; neither file exists in the repo. | Remove `notion.ts` and `utils.ts` from the Part 13 lib tree, or add a note that the list is illustrative and omit non-existent files. Prefer aligning the list to actual `lib/` contents (e.g. `activecampaign.ts`, `analytics.ts`, `env.ts`, `form-config.ts`, `validations.ts`, etc.). |
| 🟡 Warning | `.cursorrules` Part 13 — `programs/` | Part 13 omits `programs/utr-match-play/page.tsx` and `programs/usta-adult-league/page.tsx`. Both exist in the app and are referenced in REVIEW_SCOPE (“new programs/leagues, utr-match-play, usta-adult-league”). | Add under `programs/`: `utr-match-play/page.tsx` and `usta-adult-league/page.tsx` so the doc matches the codebase. |
| 🟢 Note | `.cursorrules` Part 13 — `data/` | Part 13 lists four data JSON files; repo also has `leagues-2026.json` and `year2026.json`. | Optionally add `leagues-2026.json` and `year2026.json` to the data list for completeness. |
| ✅ Pass | App structure vs Part 13 | No `app/programs/jtt` or standalone JTT page; Part 13 does not list JTT. | None. |
| ✅ Pass | Adult pathway | Part 13 states `programs/adult/page.tsx` is “Full adult pathway (not redirect)”; `app/programs/adult/page.tsx` exists. | None. |
| ✅ Pass | Leagues | Part 13 lists `programs/leagues/page.tsx` (“Leagues (JTT redirects here)”); `app/programs/leagues/page.tsx` exists. | None. |
| ✅ Pass | Junior-trial comment | REVIEW_SCOPE requires a comment that hero should be WebP when asset available. | None. |
| ✅ Pass | Code comment | `app/junior-trial/page.tsx` line 228 contains: `{/* Hero — prefer WebP when asset available (see .cursorrules / COMPOUND_LEARN) */}`. | None. |
| ✅ Pass | Forbidden patterns | Part 14 forbids the correct set (e.g. forbidden fonts, hardcoded prices, duplicate content, emoji icons). Part 8 “NEVER USE” lists Space Grotesk, Inter, Roboto, Arial, Playfair Display, Work Sans. | None. |
| ✅ Pass | Color / typography | Part 7 documents the brand palette (March 2026) and lbta legacy tokens; Part 8 documents Cormorant + DM Sans and the typography scale. Aligns with REVIEW_SCOPE “brand/typography/color tokens updated”. | None. |

---

## Summary

Part 13 correctly reflects the intended post-review structure (no JTT page, adult as full pathway, leagues present), the junior-trial hero WebP comment exists in code, and forbidden patterns plus color/typography are up to date. The only blocking issue is Part 13 listing non-existent `lib/notion.ts` and `lib/utils.ts`; fixing that and adding the two program sub-pages to Part 13 will bring the documentation in line with the app.
