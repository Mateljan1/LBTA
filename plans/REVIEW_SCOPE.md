# Code Review Scope — Compound Engineering

## Summary of changes (LBTA website)

1. **VYLO removal**
   - Deleted: `app/vylo/`, `app/vylo-apply/`, `app/api/vylo-apply/route.ts`
   - `next.config.js`: permanent redirects `/vylo`, `/vylo-apply` → `/programs/high-performance`
   - `ConditionalLayout.tsx`: removed `isVYLO`; standalone layout only for beginner/junior landings
   - `app/coaches/andrew-mateljan/page.tsx`: removed VYLO section
   - `components/ui/PartnershipSection.tsx`: removed VYLO from partners
   - `app/pathway-planner/page.tsx`: "consider VYLO" → "explore High Performance"
   - `tailwind.config.ts`: removed `vylo` color token (if present)

2. **Accessibility**
   - `components/HomeCTAForm.tsx`: sr-only labels with htmlFor/id for name, email, phone; submitError state; role="alert" aria-live="assertive" error message
   - `components/HomeHero.tsx`: scroll button min-h-[48px] min-w-[48px], visible focus ring, icon aria-hidden

3. **Performance / images**
   - `app/coaches/page.tsx`: removed `priority` from founder portrait (only hero has priority)
   - `app/not-found.tsx`, `app/racquet-rescue/page.tsx`: added `sizes="100vw"` to hero Image
   - `app/junior-trial/page.tsx`: comment that hero should be WebP when asset available

4. **Documentation**
   - `.cursorrules` Part 13: file structure updated — removed jtt/page.tsx, adult = full pathway, added programs/leagues; brand/typography/color tokens updated (Cormorant, DM Sans, brand palette)

5. **Other**
   - Brand refresh across many pages: "Movement. Discipline. Belonging." → "Movement. Craft. Community."; Playfair/Work Sans → Cormorant/DM Sans; lbta-* → brand-* where applied
   - JTT routes/pages removed or moved; new programs/leagues, utr-match-play, usta-adult-league

## Key files to review

- `next.config.js` (redirects)
- `components/layout/ConditionalLayout.tsx`
- `components/HomeCTAForm.tsx`, `components/HomeHero.tsx`
- `app/coaches/page.tsx`, `app/not-found.tsx`, `app/racquet-rescue/page.tsx`, `app/junior-trial/page.tsx`
- `app/coaches/andrew-mateljan/page.tsx`, `components/ui/PartnershipSection.tsx`, `app/pathway-planner/page.tsx`
- `.cursorrules` (Part 13 + color/typography)
- `tailwind.config.ts`

## Output format required from each reviewer

- **Status**: ✅ PASS | ⚠️ WARNINGS | ❌ ISSUES
- **Findings**: table with Severity (🔴 Critical / 🟡 Warning / 🟢 Note), Location, Issue, Recommendation
- **Summary**: 1–2 sentences
