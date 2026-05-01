# Full Site Audit — Layout, Photos, Links, UX, Copy, Data

**Date:** March 2026  
**Status:** Executed (compound:work)  
**Standard:** .cursorrules + compound learnings + WCAG 2.1 AAA + mobile-first

---

## Overview

A comprehensive audit covering every public-facing page: layout, photos, links, user experience (including full mobile), copy, data integrity, performance, and accessibility. Reconciles prior audits (Photos & Layouts, Mobile Phase 1, Agent-Native, LBTA Comprehensive 2025) and closes gaps.

---

## Problem Statement

Prior audits covered subsets of the site:
- **Photos & Layouts:** Image paths, alt, objectPosition — applied to many pages but fixes documented as done; needs verification.
- **Mobile Phase 1:** Only 8 pages checked at 320/375px; ~30 pages not explicitly audited for mobile.
- **Agent-Native:** Architecture focus, not per-page UX.
- **LBTA Comprehensive 2025:** 27 pages, UX/brand/CRO; likely outdated vs current routes.

**Gaps:** Full mobile coverage, link audit, form flows on mobile, performance validation, PWA/standalone, landscape, real-device testing, and reconciliation of what’s fixed vs. pending.

---

## Proposed Solution

Execute audit in **6 phases**. Each phase produces a checklist; fixes tracked per phase. Integrates with compound-engineering workflow (plan → work → review → validate → compound).

**Layout exclusions (ConditionalLayout):** `/beginner-program`, `/junior-trial`, `/coach-hub`, `/print` render without Header/Footer. Coach-hub and print are out of scope for public UX; beginner/junior landings are in scope for mobile and content.

---

## Implementation Steps

### Phase 1: Page inventory and link audit

**1.1 Build canonical page list**

| Route | Layout | Notes |
|-------|--------|-------|
| `/` | Full | Homepage |
| `/about` | Full | |
| `/book` | Full | |
| `/camps` | Full | |
| `/contact` | Full | |
| `/faq` | Full | |
| `/fitness` | Full | |
| `/help` | Full | Agent capability discovery |
| `/philosophy` | Full | |
| `/schedules` | Full | Primary schedules + pricing |
| `/schedules/calendar` | Full | Print-friendly calendar |
| `/coaches` | Full | |
| `/coaches/andrew-mateljan` | Full | |
| `/coaches/allison-cronk` | Full | |
| `/coaches/former-coach-removed` | Full | historical route reference |
| `/coaches/peter-defrantz` | Full | |
| `/programs` | Full | Overview |
| `/programs/adult` | Full | |
| `/programs/junior` | Full | |
| `/programs/high-performance` | Full | |
| `/programs/leagues` | Full | |
| `/programs/usta-adult-league` | Full | |
| `/programs/utr-match-play` | Full | |
| `/junior-trial` | Standalone | No header/footer |
| `/adult-trial` | Full | |
| `/beginner-program` | Standalone | No header/footer |
| `/high-performance-pathway` | Full | |
| `/match-play` | Full | |
| `/racquet-rescue` | Full | |
| `/pathway-planner` | Full | Interactive quiz |
| `/apply-scholarship` | Full | Form |
| `/success-stories` | Full | |
| `/thank-you` | Full | Dynamic by type |
| `/privacy` | Full | |
| `/terms` | Full | |
| `/print/court-flyer` | Standalone | Print layout; out of scope for mobile UX |
| `/not-found` | Full | 404 page |
| `/coach-hub` | Standalone | Private; out of scope |

**Total public pages in scope: 35** (excluding coach-hub, print as special cases)

**1.2 Internal link audit**

- [ ] Header nav: All links resolve (Programs dropdown, Schedule, Coaches, About, Contact, Camp, Book Trial)
- [ ] Footer nav: Programs, Academy, Legal (Privacy, Terms) — all resolve
- [ ] In-page CTAs: Book Trial, Register, View Schedule, etc. — correct targets
- [ ] StickyCTA links
- [ ] Breadcrumbs where present
- [ ] Coach bios → /book?type=private&coach=slug
- [ ] Program cards → /schedules#programs or /programs/*
- [ ] Cross-page links (e.g., FAQ → schedules, contact)

**1.3 Redirect verification**

- [ ] All redirects in `next.config.js` resolve correctly (test source → destination)
- [ ] Legacy paths: /pricing→/schedules, /schedule→/schedules, /vylo→/programs/high-performance, /elite-pathway→/high-performance-pathway, /LBTA_Winter2026_Schedule.html→/schedules/calendar?season=winter, /jtt→/programs/leagues, etc.

**1.4 External link audit**

- [ ] Footer: Instagram, Facebook — valid
- [ ] PartnershipSection logos — links and images
- [ ] Contact: tel:, mailto:, map links
- [ ] Thank-you page: tel, mailto, app links
- [ ] No broken external URLs (optional: link checker script)

**Deliverable:** `docs/audit/full-site-link-audit.md` — table of all links, status

---

### Phase 2: Layout and responsive (all viewports)

**2.1 Viewport checks (320px, 375px, 768px, 1024px, 1440px)**

Per .cursorrules breakpoints. For each page in scope:

- [ ] No horizontal scroll at 320px
- [ ] No horizontal scroll at 375px
- [ ] Layout adapts correctly at 768px (tablet)
- [ ] Desktop layout correct at 1024px and 1440px

**Pages to verify (prior Mobile Phase 1 only checked 8):**

| Page | 320px | 375px | 768px | Notes |
|------|-------|-------|-------|-------|
| / | Done | Done | — | |
| /schedules | Done | Done | — | |
| /contact | Done | Done | — | |
| /programs | Done | — | — | |
| /programs/junior | Done | — | — | |
| /coaches | Done | — | — | |
| /about | Done | — | — | |
| /apply-scholarship | Risk→Fixed | — | — | min-w-[300px] fixed |
| /book | | | | |
| /camps | | | | |
| /faq | | | | |
| /fitness | | | | |
| /help | | | | |
| /philosophy | | | | |
| /success-stories | | | | |
| /thank-you | | | | |
| /pathway-planner | | | | |
| /adult-trial | | | | |
| /junior-trial | | | | |
| /beginner-program | | | | |
| /high-performance-pathway | | | | |
| /match-play | | | | |
| /racquet-rescue | | | | |
| /programs/adult | | | | |
| /programs/high-performance | | | | |
| /programs/leagues | | | | |
| /programs/usta-adult-league | | | | |
| /programs/utr-match-play | | | | |
| /coaches/andrew-mateljan | | | | |
| /coaches/allison-cronk | | | | |
| /coaches/former-coach-removed | | | | |
| /coaches/peter-defrantz | | | | |
| /privacy | | | | |
| /terms | | | | |
| /not-found | | | | |
| /schedules/calendar | | | | |

**2.2 Touch targets (48×48px minimum)**

- [ ] Header mobile menu (open, links, Book Trial)
- [ ] Footer links (min-h-[48px] or equivalent — verify on device)
- [ ] All primary CTAs (Register, Book Trial, Submit)
- [ ] StickyCTA
- [ ] ChatWidget (60×60)
- [ ] BackToTop
- [ ] Modal close buttons
- [ ] ProgramRow / CampRow / LeagueRow buttons
- [ ] Pathway planner interactive elements
- [ ] Form submit buttons

**2.3 Form input font size (16px on mobile)**

- [ ] Contact form: inputs, select, textarea — 16px (Phase 3 fix applied)
- [ ] LuxuryRegistrationModal
- [ ] TrialBookingModal
- [ ] LuxuryYearModal
- [ ] Scholarship form
- [ ] NewsletterForm (email input)

**2.4 Scroll-anchor and sticky nav**

- [ ] Schedules: #programs, #private, #camps, #leagues — scroll-mt-28, heading visible
- [ ] Coaches: anchor sections if present
- [ ] Pathway planner: any in-page nav
- [ ] Any other sticky in-page nav

**2.5 Modal behavior (320/375px)**

- [ ] LuxuryRegistrationModal: max-height, internal scroll, close reachable
- [ ] TrialBookingModal
- [ ] LuxuryYearModal
- [ ] Optional: sticky close for long forms

**Deliverable:** `docs/audit/full-site-layout-audit.md` — checklist with pass/fail per page

---

### Phase 3: Photos and imagery

**3.1 Image path verification**

Per `docs/PHOTOS-AND-LAYOUTS-AUDIT.md` and `docs/solutions/ui-bugs/site-wide-image-404s-layout-consistency.md` — verify all fixes applied:

- [ ] All hero images use valid paths (legacy-working-assets or public/images where files exist)
- [ ] Program cards: Youth Dev, High Perf, Fitness, Leagues — legacy paths
- [ ] Fitness Cardio Tennis, not-found, About/Contact private-specialty — legacy
- [ ] Homepage founder, Results (Karue), philosophy pillars — legacy
- [ ] Run `scripts/verify-image-paths.mjs` if present

**3.2 Hero alt text**

- [ ] Every hero with descriptive alt (not empty) where image conveys content
- [ ] Decorative overlays: alt="" documented

**3.3 objectPosition**

- [ ] Hero and card images: consistent objectPosition (50% 50% for faces, 50% 60% for horizon)
- [ ] About facility, Contact form accent

**3.4 next/image usage**

- [ ] All images use next/image (no raw `<img>` unless required)
- [ ] sizes attribute on responsive images
- [ ] priority on LCP/hero images only
- [ ] WebP preferred per .cursorrules

**Deliverable:** Update or confirm `docs/PHOTOS-AND-LAYOUTS-AUDIT.md` status; note any new issues

---

### Phase 4: Copy and data

**4.1 Forbidden copy (per .cursorrules Part 14)**

- [ ] No "maximize", "boost", "elite", "world-class", "mastery"
- [ ] No "Sign up now!", "Don't miss out!", "Limited time!"
- [ ] No fake scarcity or urgency
- [ ] No generic marketing speak
- [ ] No exclamation points in headlines
- [ ] Grep codebase for forbidden terms

**4.2 CTA consistency**

- [ ] Primary CTA: "Book Trial" or "Register" — consistent labeling
- [ ] Secondary: "Learn More", "Contact" — consistent
- [ ] No "BOOK TRIAL" vs "Book Trial" vs "Get Started" chaos (per LBTA Comprehensive 2025)

**4.3 Data single source of truth**

- [ ] Pricing: all from data/*.json — zero hardcoded prices in components
- [ ] form-config prePopulateData.pricing — derived from /data or documented sync
- [ ] Trust stats (500+ players, etc.): data/site-stats.json
- [ ] FAQ: data/faq.json for homepage + schema
- [ ] Programs, camps, leagues: data/winter2026.json, year2026.json, leagues-2026.json

**4.4 Brand voice**

- [ ] Calm, confident, specific — no salesy or hyperbolic
- [ ] Founder voice where applicable

**Deliverable:** `docs/audit/full-site-copy-data-audit.md`

---

### Phase 5: User experience and flows

**5.1 Critical user flows (mobile and desktop)**

- [ ] Book Trial: /book → modal or flow → success → thank-you?type=trial
- [ ] Program registration: /schedules → Register → LuxuryRegistrationModal → thank-you?type=program
- [ ] Year registration: LuxuryYearModal → thank-you?type=year
- [ ] Scholarship: /apply-scholarship → submit → success
- [ ] Newsletter: Footer or popup → submit → success
- [ ] Contact form: /contact → submit → success
- [ ] Pathway planner: quiz → result → CTA to schedules/book

**5.2 Navigation flow**

- [ ] Homepage → Programs → Schedules → Register
- [ ] Homepage → Book Trial → modal
- [ ] Schedules anchor nav: Programs, Private, Camps, Leagues
- [ ] Coaches → Book with coach pre-selected
- [ ] Mobile menu: all links work, focus trap, close returns focus

**5.3 Error and empty states**

- [ ] 404 page: image loads, CTAs work
- [ ] Form validation: inline errors, focus management
- [ ] API errors: generic message to user, no leak

**5.4 ChatWidget**

- [ ] Welcome message and suggested actions
- [ ] Mobile: placement, overlay, 48px+ tap target
- [ ] Stub behavior documented (no real AI yet)

**5.5 Exit intent popup**

- [ ] Desktop: trigger behavior
- [ ] Mobile: not shown or appropriate alternative
- [ ] Newsletter signup flow

**Deliverable:** `docs/audit/full-site-ux-flows-audit.md`

---

### Phase 6: Performance, accessibility, PWA

**6.1 Performance (per .cursorrules)**

- [ ] LCP < 2.5s on 3G throttled (mobile)
- [ ] CLS < 0.1
- [ ] INP < 100ms
- [ ] Lighthouse ≥ 90 (Performance, Accessibility, Best Practices, SEO)
- [ ] Run: `npx lighthouse https://lagunabeachtennisacademy.com --view` (or local) — mobile emulation

**6.2 Accessibility (WCAG 2.1 AAA)**

- [ ] Color contrast: 7:1 minimum (footer text on deep-water: text-white/70+)
- [ ] Hero CTA on dark: solid background (bg-white or bg-black)
- [ ] Focus states: visible 2px ring, focus-visible used
- [ ] Skip to main content: works
- [ ] Keyboard nav: all interactive elements reachable
- [ ] Reduced motion: prefers-reduced-motion respected (AnimatedSection, parallax, scroll)
- [ ] Screen reader: semantic HTML, ARIA where needed, no duplicate schema id
- [ ] Touch targets: 48×48px minimum

**6.3 PWA and standalone**

- [ ] manifest.json valid
- [ ] apple-mobile-web-app-capable, status-bar-style
- [ ] Icons: 192x192 present
- [ ] Optional: Install and test standalone on device

**6.4 SEO and metadata**

- [ ] metadataBase set to production URL
- [ ] OG images per key pages
- [ ] JSON-LD schema: Organization, FAQ where applicable
- [ ] No duplicate schema ids
- [ ] Sitemap, robots

**Deliverable:** `docs/audit/full-site-performance-a11y-audit.md`

---

## Files to Create/Modify

| File | Action | Purpose |
|------|--------|---------|
| `plans/full-site-audit-plan.md` | Create | This plan |
| `docs/audit/full-site-link-audit.md` | Create | Phase 1 results |
| `docs/audit/full-site-layout-audit.md` | Create | Phase 2 results |
| `docs/PHOTOS-AND-LAYOUTS-AUDIT.md` | Modify | Phase 3 status update |
| `docs/audit/full-site-copy-data-audit.md` | Create | Phase 4 results |
| `docs/audit/full-site-ux-flows-audit.md` | Create | Phase 5 results |
| `docs/audit/full-site-performance-a11y-audit.md` | Create | Phase 6 results |
| Components/pages as needed | Modify | Fixes from audit findings |

---

## Out of scope (this plan)

- Coach hub private content and flows
- Print/court-flyer print-specific layout (out of mobile UX scope)
- Real-device testing (recommended but not scripted)
- A/B testing or conversion optimization
- Content strategy or new copy creation (audit only)

---

## Success criteria

- [ ] All 35 public pages audited for layout, links, images, copy, data
- [ ] Mobile viewport checks (320, 375, 768px) for every page
- [ ] No horizontal scroll at 320px on any page
- [ ] All internal links resolve; redirects verified
- [ ] Zero hardcoded prices; data single source confirmed
- [ ] No forbidden copy terms
- [ ] Critical user flows work on mobile
- [ ] Lighthouse mobile ≥ 90 where applicable
- [ ] All audit findings documented with severity and fix status

---

## Acceptance checklist

| Criterion | Check |
|-----------|-------|
| Full page coverage | 35 pages in inventory; all audited |
| Mobile coverage | 320/375/768px checked per page |
| Link audit | Header, footer, in-page, redirects — all verified |
| Photo audit | Paths valid, alt present, objectPosition consistent |
| Copy audit | No forbidden terms; CTA consistency |
| Data audit | No hardcoded prices; form-config aligned |
| Flow audit | Book, register, scholarship, contact, newsletter — work on mobile |
| Performance | LCP/CLS acceptable; Lighthouse score noted |
| Accessibility | Contrast, focus, keyboard, reduced motion |

---

## Research sources

- `docs/PHOTOS-AND-LAYOUTS-AUDIT.md`
- `docs/solutions/ui-bugs/site-wide-image-404s-layout-consistency.md`
- `plans/mobile-audit-phase1-checklist.md`
- `.cursor/compound/learnings/2026-03-17-mobile-audit-compound-learn.md`
- `docs/AGENT-NATIVE-ARCHITECTURE-AUDIT.md`
- `docs/archive/LBTA_COMPREHENSIVE_SITE_AUDIT_2025.md`
- `.cursorrules` (Parts 6–14)
- `plans/COMPOUND_LEARN.md`

---

## Relevant learnings

- Mobile: test at 320/375/768px; 48px touch targets; 16px input font; scroll-mt on anchor sections
- Images: legacy-working-assets single source; hero alt; objectPosition for crop
- Footer: text-white/70+ on deep-water for WCAG 7:1
- Hero CTA on dark: solid background
- No hardcoded prices; derive from /data
- Form inputs 16px to avoid iOS zoom

---

## Risks and mitigations

| Risk | Mitigation |
|------|------------|
| Audit drift (findings vs fixes) | Track status per finding; use compound:learn after fixes |
| Too many pages to complete in one pass | Phase execution can be incremental; document blockers |
| Real-device gaps | Use browser DevTools device emulation; recommend manual device pass |

---

## Execution order

1. **Phase 1** (Link audit) — foundational; can run in parallel with Phase 2
2. **Phase 2** (Layout) — largest; use browser MCP at 320/375/768px
3. **Phase 3** (Photos) — verify prior fixes; quick if done
4. **Phase 4** (Copy/data) — grep and data trace
5. **Phase 5** (UX flows) — manual flow testing
6. **Phase 6** (Performance/a11y) — Lighthouse, contrast check

After fixes: run `/compound:review` and `/compound:validate`; then `/compound:learn` to capture new corrections and patterns.

---

## Execution Summary (compound:work 2026-03-22)

| Phase | Status | Deliverable | Fixes applied |
|-------|--------|-------------|---------------|
| 1. Link audit | ✅ | docs/audit/full-site-link-audit.md | None |
| 2. Layout | ✅ | docs/audit/full-site-layout-audit.md | NewsletterForm text-[15px]→text-base; Apply Scholarship inputs +text-base |
| 3. Photos | ✅ | docs/audit/full-site-photos-audit.md | None (verify:images passed) |
| 4. Copy/data | ✅ | docs/audit/full-site-copy-data-audit.md | None |
| 5. UX flows | ✅ | docs/audit/full-site-ux-flows-audit.md | None |
| 6. Perf/a11y | ✅ | docs/audit/full-site-performance-a11y-audit.md | None |

**Build:** ✅ Pass | **Lint:** Verified
