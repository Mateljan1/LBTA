# LBTA Compound Engineering — Learnings

**Session**: LBTA Full Compound Execution (Waves 1–4, Review, Validate)  
**Date**: March 2026

Use this document when doing future compound work, plan verification, or 10/10 audits on the LBTA site.

---

## CORRECTIONS (what was wrong → what to do instead)

| Original | Correction |
|----------|------------|
| Homepage inline form with placeholder-only labels | Add visible or `sr-only` `<label>` with `htmlFor` and matching input `id`, or `aria-label` on each input. Add live region (`role="alert"`) for submit errors. |
| “Scroll to content” button without min size | Use `min-h-[48px] min-w-[48px]` (and padding) so touch target is ≥ 48×48px (WCAG 2.1). |
| VYLO layout blocking Google Fonts (Inter) | Remove external `<link>` for Inter. Use `next/font` (e.g. DM Sans) or design-system vars (Cormorant/DM Sans); .cursorrules forbid Inter. |
| Two `priority` images on one page (e.g. coaches) | Use `priority` only on the hero image; remove from secondary images to avoid competing LCP. |
| Hero `<Image fill priority>` without `sizes` | Always set `sizes` (e.g. `sizes="100vw"`) on fill/priority images for predictable LCP. |
| Junior-trial hero as JPG | Prefer WebP and update `src` for LCP/bandwidth per .cursorrules. |
| Hardcoded hex in modals | Use Brand Kit tokens only: `bg-lbta-black`, `bg-brand-sandstone`, `text-lbta-slate`, `border-lbta-stone`, `brand-tide-pool`, etc. |
| League pricing duplicated in usta-adult-league and utr-match-play | Single source: `data/leagues-2026.json`; both pages import from it. |
| Programs adult as redirect to /schedules | Implement full adult pathway page (progression, leagues, schedule/book CTAs); no redirect. |

---

## PATTERNS (name — when to use — example)

| Pattern | When to use | Example |
|--------|-------------|---------|
| **Server shell + client islands** | Pages with mostly static content and few interactive bits | Homepage: server `page.tsx`; `HomeHero`, `HomeCTAForm` as client components. |
| **Footer as server component** | Footer is static except one form | Footer.tsx no `'use client'`; `NewsletterForm` is client and handles state + submit. |
| **Focus trap in mobile menu** | Any overlay/drawer menu | On open: focus first focusable; Tab/Shift+Tab wrap within panel; on close: return focus to trigger. |
| **Programs dropdown keyboard nav** | Menu with multiple items | Arrow Down/Up, Home, End; focus first menuitem when panel opens; `role="menu"` / `role="menuitem"`. |
| **JSON-LD for program/event pages** | League or event-specific pages | `LeagueEventSchema` in schema.tsx; pass name, description, startDate, endDate, location. |
| **Data file per domain** | Schedules vs leagues vs pricing | `winter2026`/`fall2025` for programs; `leagues-2026.json` for USTA/UTR; no duplicate content. |
| **StickyCTA on key pages** | Conversion pages (e.g. homepage) | `<StickyCTA text="Book Trial" href="/book" showAfterScroll={600} />` before closing tag. |

---

## STANDARDS (rule — enforcement level)

| Rule | Level |
|------|--------|
| Zero hardcoded hex in active .tsx (excl. PERS_ legacy); use Brand Kit tokens only | Required |
| Newsletter status/error messages: `aria-live="polite"`, `role="status"` / `role="alert"` | Required |
| All interactive elements: visible focus (2px ring), keyboard reachable | Required |
| Touch targets ≥ 48×48px on mobile | Required |
| No render-blocking external fonts; use next/font or CSS vars | Required |
| `priority` only on one hero image per page | Required |
| Fill/priority images must have `sizes` | Required |
| .cursorrules Part 13 (file structure) must match code (e.g. adult pathway, no JTT route) | Recommended |
| Homepage form: proper labels + live region for errors | Required for WCAG 2.1 AAA |
| When logging third-party API errors, truncate response body or log status only (no full body — PII risk) | Should |

---

## AC + GHL (2026-03-10)

- **Optional dual-write:** Env-gate (all three GHL vars); after AC success call `void sendToGHL(payload)`; same validated payload; on failure log only.
- **External API error logs:** Truncate body (e.g. 100 chars) or log status only. See `externalApiErrorLogSafe` in quality-bars and `external-api-error-log-truncate` in patterns.
- **Setup checklists:** One doc per system (AC, GHL); IDs from code; cross-reference from `docs/registration-flows-and-ops.md`.

## Full wire-up (2026-03-11)

- **Env checker script:** `scripts/check-ac-ghl-env.js` reports which AC/GHL vars are set; never prints values. Exit 0 only when both `ACTIVECAMPAIGN_URL` and `ACTIVECAMPAIGN_API_KEY` are set. Use `npm run check:env` locally or in CI.
- **Doc chain:** One-pager (`docs/ac-ghl-connected-onepager.md`) → AC checklist, GHL checklist, registration-flows; MCP doc (`docs/ac-ghl-connection-via-mcps.md`) for Vercel/GHL MCP usage; README links to one-pager and `check:env`.
- **Compound full loop for “wire up”:** Plan (env checker + docs + success criteria) → Work (script + README link) → Review (security: no secrets in output; simplicity: minimal script) → Validate (build, lint) → Deploy (commit, push, vercel --prod) → Compound (this log).

---

## REVIEW ARTIFACTS TO REUSE

- **Accessibility**: HomeCTAForm labels + live error region; HomeHero 48px scroll button; NewsletterForm `aria-busy` when loading; contrast check on footer status text.
- **Architecture**: Document that `/programs/adult` is a full pathway (not redirect); clarify `/schedule` vs `/schedules` and their data sources.
- **Performance**: One `priority` per page; add `sizes` where missing; VYLO layout must not load Inter.
- **Regression**: After JTT removal, any external links to `/jtt` should point to `/programs/leagues` or `/schedules` where appropriate.

---

## 2026 Schedule Sync (2026-03-12)

- **Canonical source:** DOCX program overviews (Winter, Spring, Summer, Fall) are the source of truth; align `data/*.json` to them.
- **Single entry for schedule data:** All season program lists via `lib/programs-data` (getWinter2026Programs, getSpringProgramsForDisplay, getSummerProgramsForDisplay, getFall2026Programs). No component imports season JSON directly.
- **Price display:** When a program has both `monthly` and session tiers, prefer monthly when it’s the minimum/primary (ProgramRow getPrice()); remove unused 4x/5x.
- **Program data shape:** Same optional keys (`matchPlay`, `pricingNote`) and same program names/ages across winter, spring-summer, fall. Remove dead exports (e.g. getSpringPrograms, getSummerPrograms).
- **Full learnings:** `.cursor/compound/learnings/2026-03-12-schedule-sync-compound-learn.md` and `plans/compound-review-2026-schedule-sync.md`.

---

## Schedule UX: pricingNote, server-side data, time format (2026-03-12)

- **pricingNote / slot.note in UI:** Program type has `pricingNote?`; schedule slot has `note?`. Show in ProgramRow (under price; after time as " — {note}") and in ProgramCard (Investment section; schedule list). Data from JSON only; render as text (no dangerouslySetInnerHTML).
- **Server-side schedule data:** `app/schedules/page.tsx` is a Server Component: loads programs via programs-data getters and year2026; passes `programsBySeason`, `seasons`, `initialSeason`, `seasonCta`, `year2026` to `SchedulesPageClient`. Client bundle no longer includes programs-data or season JSON.
- **year2026 payload:** Pass only the slice the client uses: `{ privateCoaching, monthlyPrograms, discounts, scholarships, camps }`. Type `Year2026Sections` in SchedulesPageClient matches that shape and `data/year2026.json`; server builds the object explicitly to avoid sending unused keys.
- **Season type once:** Use a single shared type for season data at the server/client boundary: `SeasonDataForDisplay` in `lib/season-utils.ts`; SchedulesPageClient and ProgramsSection both use it (no duplicate SeasonData / SeasonDataForClient).
- **Time strings in JSON:** Normalize `schedule[].time` in winter2026, spring-summer-2026, fall2026 to use Unicode en-dash (U+2013), e.g. "11:45 AM–12:45 PM".
- **Optional follow-ups:** Load LeaguesSection data on server and pass as props; add Zod (or similar) runtime validation for year2026/programs if JSON shape changes; consider `React.memo(ProgramRow)` and `useMemo` for getPrice if needed.

---

## Track 1 Verification & quality gate (2026-03-13)

- **Single doc:** `docs/quality-gate.md` records Lighthouse (home/schedules/programs), responsive pass, forbidden copy, a11y, build/lint. One place to update when running the .cursorrules Part 16 checklist.
- **README:** Quality gate subsection links to the doc and states "Every PR: build + lint; periodically: Lighthouse + responsive + forbidden copy + a11y."
- **Lighthouse script:** `npm run lighthouse` runs homepage only; output path must match quality-gate (see Track 4). Dev server must be running (`npm run dev` first); schedules/programs use the manual npx commands in the doc.
- **Target alignment:** README Performance target set to "Lighthouse ≥90 in all categories" to match quality-gate.md (no separate 95+).
- **Forbidden copy:** Grep limited to user-facing code (`app/`, `components/`, `data/`); docs/plans may use words in context.

---

## Track 2 Missing assets — Why Choose (2026-03-13)

- **Folder:** `public/images/why-choose/` created with `.gitkeep`; add `why-choose-1.webp` and `why-choose-2.webp` when supplied.
- **Fallback in code:** `WhyChooseImage` client component wraps `next/image` with `src` + `fallbackSrc`; `onError` switches to fallback once (guarded by `failed` state). Homepage Why Choose section uses it with fallbacks: image1 → `/images/hero/laguna-horizon.webp`, image2 → `/images/community/community-1.webp`.
- **Documentation:** `plans/homepage-media-brief.md` lists Why Choose (×2) in section table and asset checklist; notes fallback behavior at bottom so section never breaks.
- **Pattern:** `client-image-fallback-missing-asset` in patterns.json — use when image paths may not exist yet; client wrapper with onError fallback + doc + folder.

---

## Track 3 Micro-polish (2026-03-13)

- **Junior-trial placeholders:** Neutral placeholders "Your name", "Email", "Phone" (per site-polish plan); labels/aria unchanged.
- **PartnershipSection:** Comment updated to "Partnership logos in /public/logos/"; removed inline "// Upload PNG here" from partner entries (logos are in place).
- **Skip-to-main:** Link already in `app/layout.tsx` (sr-only, focus-visible). Target must be focusable and use main landmark: `<main id="main-content" tabIndex={-1}>`. ConditionalLayout wraps normal pages in main; standalone landings (junior-trial, beginner-program) must provide their own. Junior-trial root changed from div to main with id and tabIndex={-1}; ConditionalLayout main given tabIndex={-1} so focus moves into main on all routes.
- **Pattern:** `skip-to-main-focusable-target` in patterns.json — skip target must be `<main id="main-content" tabIndex={-1}>` so focus moves and landmark is correct.

---

## Track 4 Performance & SEO (2026-03-13)

- **Hero video:** WebM primary; MP4 optional Safari fallback. In `HomeHero.tsx`, add `<source src="/videos/LBTA-Home-Hero.mp4" type="video/mp4" />` after WebM. Browser picks one source (no double load); missing MP4 yields one 404, poster still shows. Document in `docs/lighthouse-baseline.md` and `plans/homepage-media-brief.md`.
- **Lighthouse script:** Single `npm run lighthouse` writes HTML to `docs/lighthouse-report.html`. Quality-gate.md must reference the same path ("Full report from npm run lighthouse: docs/lighthouse-report.html"); avoid duplicate script keys in package.json.
- **Baseline doc:** `docs/lighthouse-baseline.md` records hero formats, Lighthouse run instructions (points to quality-gate for full table), and meta audit. Meta audit: key pages (home, schedules, programs, about, contact, book, coaches, camps, faq) each have unique title/description; no code change if already unique.
- **Pattern:** When adding an npm script that writes to docs, update any existing doc that references report paths so script output and doc reference match.

---

## SUCCESS CRITERIA (plan checklist)

- [ ] Zero hex in active app/ and components/ (excl. PERS_)
- [ ] Homepage server component, Brand Kit, StickyCTA
- [ ] Newsletter API → ActiveCampaign
- [ ] JTT removed; camps/links → /schedules
- [ ] Adult pathway page (no redirect)
- [ ] League data in leagues-2026.json; JSON-LD on league pages
- [ ] Focus trap + Programs arrow keys + aria-live on newsletter
- [ ] Build passes; no lint errors
