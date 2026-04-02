# LBTA Registration Flow Implementation Plan

## Overview
Implement a unified LBTA registration experience where every `Register` action opens a polished, low-friction `RegistrationModal` that clearly explains city payment vs LBTA support, captures warm leads when needed, and always ends by nudging families to download the LBTA app.

## Problem Statement
Today, parents click **"Register"** expecting to pay on the LBTA site, but are instead dropped into a disconnected flow with no mention of city payment, Rec1, or the LBTA app. This creates confusion, erodes trust, and loses enrollments. We need a single, consistent registration flow that:
- Makes it obvious why payment goes through the City of Laguna Beach
- Offers a "do it now" path and a "have us help" path
- Connects registration with the LBTA app as the operational home base

## Proposed Solution
Implement a new `RegistrationModal` component, driven by the existing spec in `CURSOR_Registration_Flow_Spec.md`, and wire it to all "Register" entry points across the site. The modal will:
- **State 1 — choose**: Present two clear paths with high-contrast, on-brand cards:
  - **Path A — Pay now (Rec1)**: Opens the city Rec1 catalog in a new tab (starting with the single base URL option), then transitions the modal to a confirmation state after a short delay.
  - **Path B — Have us help**: Slides into a short inline lead form, posts to the existing lead-capture endpoint, then transitions to confirmation.
- **State 2 — form**: Use a minimal, mobile-friendly form with clear required vs optional fields, leveraging existing form validation patterns (`lib/validations.ts` / `lib/form-config.ts` / API routes) to avoid duplicate logic and to keep analytics consistent with `/book`.
- **State 3 — confirmation**: Show a calm confirmation message (variant for Path A vs Path B) and a reusable `AppDownloadCard` that promotes the LBTA app with App Store / Google Play links, reusing it wherever we need the same CTA (e.g. `/thank-you`, `/faq`).

Supporting changes:
- Update the **"How registration works"** copy on `/schedules` to match the new flow (using the exact copy from the spec).
- Add a new **FAQ block** on `/faq` explaining registration, why payment goes through the city, and what the LBTA app does (again using the provided copy).
- Instrument a small set of analytics events (via the existing form analytics / event tracking utilities, if present) to understand friction: which path parents choose, how often they submit the form, and how often they click app download links.

Architecture notes:
- Keep the modal and app download prompt as **pure presentational client components** that receive all dynamic data via props, and reuse the existing **lead registration API + schema** to avoid new backend complexity.
- Respect LBTA’s **luxury, mobile-first design system**: use Tailwind tokens (`brand-deep-water`, `brand-sandstone`, etc.), Cormorant/DM Sans typography, and existing button / card patterns.
- Initial Rec1 integration will use **Option A (single base URL)** for robustness, with a clear affordance in copy that the user will search for their program name. Option B (per-program URL mapping) will be left as an explicit future enhancement behind a typed lookup table in `/data` or `lib/programs-data.ts`.

## Implementation Steps

### Phase 1: Discovery & Foundations
- [ ] Step 1.1: **Audit existing registration triggers and data flow**
  - Find all "Register" buttons/components on `/schedules`, `/programs`, `/programs/*`, `/camps`, and any other pages that initiate registration.
  - Identify the existing lead-capture endpoint and validation stack (likely `/api/book` or `lib/validations.ts`, `lib/form-config.ts`, `lib/form-analytics.ts`).
  - Confirm how `program_name` and `registration_source` should be represented and stored.
- [ ] Step 1.2: **Confirm design tokens and shared UI primitives**
  - Review existing modal / card / button components (e.g. `RegistrationModal` if any legacy version exists, `LuxuryRegistrationModal`, `YearRegistrationModal`, etc.) to align animation, spacing, typography, and focus handling.
  - Decide whether to extend an existing modal wrapper (for consistent overlay/esc-close) or build a dedicated inline structure inside `RegistrationModal`.

### Phase 2: Core Components
- [ ] Step 2.1: **Create `AppDownloadCard` component**
  - Implement a reusable, dark-card CTA with App Store / Google Play buttons using the exact copy and URLs from the spec.
  - Ensure it works in both desktop modal and mobile full-screen contexts, and is accessible via keyboard and screen readers.
- [ ] Step 2.2: **Implement `RegistrationModal` skeleton and state machine**
  - Create `components/RegistrationModal.tsx` as a client component with the three states: `choose`, `form`, `confirmation`.
  - Define props for `programName`, `programDetails`, optional `rec1Url` (defaulting to the base Rec1 catalog URL when not provided), `isOpen`, `onClose`, and any analytics callbacks.
  - Implement internal state transitions: `choose` → `form` (Path B) and `choose` → `confirmation` (Path A, triggered after Rec1 tab opens), with a single source of truth for current state.
- [ ] Step 2.3: **Build `choose` state UI (Path selection)**
  - Implement two cards for "Pay now" and "Have us help" with the detailed copy, hierarchy, and accent borders (sunset-cliff for pay-now, victoria-cove for have-us-help).
  - Add the collapsible "Why does payment go through the city?" section with smooth expand/collapse, chevron rotation, and proper ARIA attributes.
  - On "Register & Pay" click, open `rec1Url` in a new tab (`window.open`) and schedule an internal state transition to `confirmation` after a short delay (configurable, default 2s).
  - On "Register — We'll Reach Out" click, transition to the `form` state.
- [ ] Step 2.4: **Build `form` state UI + validation**
  - Implement the form layout with first/last name, email, phone (required), and optional fields (player name, age, notes) exactly as specced.
  - Wire inputs to a local form state and validation using existing validation schemas/utilities where possible (to keep rules DRY and consistent with `/book`).
  - On submit, call the existing lead-capture API route with:
    - User fields
    - `program_name` (from props)
    - `registration_source` = `"schedules_modal"` (or more specific if needed, e.g. `"registration_modal"`).
  - Handle loading and error states inline; on success, transition to `confirmation`.
- [ ] Step 2.5: **Build `confirmation` state UI (shared for both paths)**
  - Implement the animated checkmark, headline, and path-specific body copy (Path A vs Path B).
  - Embed `AppDownloadCard` inside the confirmation state.
  - Add a "Done" button that closes the modal via `onClose`, with correct focus return to the triggering "Register" button.

### Phase 3: Integration Across Pages
- [ ] Step 3.1: **Wire `RegistrationModal` into `/schedules` program cards**
  - Identify the component that renders schedule/program rows and "Register" buttons.
  - Introduce state in the schedules page (or a shared layout provider) to track which program is currently selected for registration and whether the modal is open.
  - Pass the appropriate `programName`, `programDetails`, and `rec1Url` (initially using the base Rec1 URL for all programs) to `RegistrationModal`.
- [ ] Step 3.2: **Wire `RegistrationModal` into other program entry points**
  - Update "Register" buttons on `/programs` and `/programs/*` (junior, adult, high-performance, leagues, camps) and `/camps` to open the same modal with relevant program props.
  - Ensure the modal behaves consistently regardless of entry page (including SEO/SSR-safe client component usage).

### Phase 4: Content & FAQ Updates
- [ ] Step 4.1: **Update "How registration works" copy on `/schedules`**
  - Replace the existing collapsible content with the updated copy from the spec **verbatim**, preserving heading and structural styling.
  - Ensure the section layout still respects LBTA spacing, typography, and mobile behavior.
- [ ] Step 4.2: **Add new registration-related FAQ entries**
  - Update the FAQ page to include the three Q&A blocks from the spec under an appropriate section ("Getting Started" or "Registration").
  - Confirm that FAQ typography, anchors, and SEO metadata remain consistent with the rest of the page.

### Phase 5: Analytics & Friction Insights
- [ ] Step 5.1: **Integrate analytics events for the new flow**
  - Using the existing analytics utilities (if present), fire the following events with the specified payloads:
    - `registration_modal_opened` with `program_name`
    - `registration_path_a_clicked` with `program_name`
    - `registration_path_b_clicked` with `program_name`
    - `registration_form_submitted` with `program_name` and `registration_source`
    - `registration_app_download_clicked` with `platform` and `program_name`
    - `registration_modal_closed` with `program_name` and final `state` (`choose`, `form`, or `confirmation`)
  - Ensure events are debounced/guarded to avoid duplicates on fast repeated interactions.
- [ ] Step 5.2: **Add minimal friction diagnostics**
  - Optionally, capture simple derived metrics (e.g. modal open → path selection; path selection → completion) for internal analysis via existing analytics tooling, without overcomplicating the implementation.

### Phase 6: Polish, Accessibility, and Mobile
- [ ] Step 6.1: **Accessibility pass**
  - Ensure the modal has correct ARIA attributes, labelled headings, focus trapping, escape-key and backdrop close behavior (with clear, reversible actions).
  - Verify that collapsibles, buttons, and links are keyboard navigable and meet contrast guidelines, per LBTA’s accessibility rules.
- [ ] Step 6.2: **Mobile-first behavior**
  - Implement full-screen drawer behavior for the modal on small breakpoints (slide-up motion) while keeping centered modal layout on desktop.
  - Confirm type sizes, touch targets, and spacing adhere to LBTA’s mobile standards.
- [ ] Step 6.3: **Motion & interaction polish**
  - Add subtle, preference-respecting animations (fade/slide between states, card hover states, confirmation checkmark) in line with LBTA’s animation standards.
  - Ensure reduced-motion users see instant transitions without animation.

## Files to Create/Modify

| File | Action | Purpose |
|------|--------|---------|
| `components/RegistrationModal.tsx` | Create | Core modal component implementing choose → form → confirmation states |
| `components/AppDownloadCard.tsx` | Create | Reusable LBTA app download CTA (used in modal and potentially on other pages) |
| `components/schedules/ProgramRow.tsx` (or equivalent) | Modify | Wire "Register" buttons to open `RegistrationModal` with program-specific props |
| Other program entry components (`/programs`, `/programs/*`, `/camps`) | Modify | Ensure all "Register" buttons open `RegistrationModal` instead of navigating away |
| `app/schedules/page.tsx` | Modify | Update "How registration works" copy per spec; manage modal state if needed |
| `app/faq/page.tsx` | Modify | Add new registration/payment/app FAQ entries from the spec |
| `lib/form-config.ts` / `lib/validations.ts` / `lib/form-analytics.ts` (if used) | Modify | Reuse/extend existing schemas & tracking to support modal registration and analytics events |
| Relevant API route for lead capture (e.g. `app/api/book/route.ts`) | Modify | Accept `program_name` and `registration_source` from the modal form if not already supported |

```yaml
# files (for tooling; do not edit by hand)
create:
  - components/RegistrationModal.tsx
  - components/AppDownloadCard.tsx
modify:
  - components/schedules/ProgramRow.tsx
  - app/schedules/page.tsx
  - app/faq/page.tsx
  - app/programs/page.tsx
  - app/programs/junior/page.tsx
  - app/programs/adult/page.tsx
  - app/programs/high-performance/page.tsx
  - app/camps/page.tsx
  - lib/form-config.ts
  - lib/validations.ts
  - lib/form-analytics.ts
  - app/api/book/route.ts
```

## Out of scope (this plan)
- Building or maintaining a **per-program Rec1 URL mapping** (Option B) beyond the single base catalog URL; that will be a separate, data-driven plan.
- Changing deeper **payment / enrollment logic** in city systems or LBTA back office workflows.
- Implementing a full analytics dashboard or reporting layer; this plan only emits events.
- Large-scale refactors of existing forms, modals, or layout components not directly required to support the new registration flow.
- Any copy changes **outside** the provided spec text (copy in the spec is treated as final unless Andrew specifies edits).

## Success Criteria
- [ ] All "Register" buttons across `/schedules`, `/programs`, `/programs/*`, and `/camps` open the new `RegistrationModal` instead of navigating away.
- [ ] Path A ("Register & pay now") reliably opens the city Rec1 catalog in a new tab, and the modal transitions to a confirmation state with app download prompt.
- [ ] Path B ("Have us help") successfully submits to the existing lead capture endpoint with `program_name` and `registration_source` fields, then shows the confirmation + app download card.
- [ ] The "How registration works" section on `/schedules` matches the updated copy from the spec, with no visual regressions.
- [ ] The FAQ page includes the new registration/payment/app entries, rendered correctly and discoverable.
- [ ] Analytics events for modal open, path selection, form submission, app download click, and modal close are fired with the correct payloads and without obvious duplication.
- [ ] The flow is fully responsive, keyboard navigable, screen-reader friendly, and meets LBTA’s performance and accessibility bars.

## Acceptance checklist
- [ ] Open `/schedules`, click "Register" on at least three different programs → `RegistrationModal` appears with correct program name and details.
- [ ] In the modal, click "Register & Pay now" → a new tab opens to the Rec1 catalog, and after ~2 seconds the original tab’s modal shows the confirmation state with the Path A message and the app download card.
- [ ] In the modal, choose "Have us help", complete only required fields, and submit → request hits the expected lead-capture endpoint, includes `program_name` and `registration_source="schedules_modal"` (or agreed value), and shows the confirmation state with the Path B message and app download card.
- [ ] From the confirmation state, click both "App Store" and "Google Play" buttons → each opens the correct store URL in a new tab; clicking "Done" closes the modal and returns focus to the last "Register" trigger.
- [ ] Verify on mobile (320px, 375px) that the modal behaves as a full-screen drawer, all text remains readable without zoom, touch targets meet LBTA’s 48×48px minimum, and there is no horizontal scroll.
- [ ] Confirm the "How registration works" section on `/schedules` shows the updated copy verbatim and collapses/expands correctly on all breakpoints.
- [ ] Confirm the new FAQ entries render on `/faq` under the appropriate section and use the exact copy from the spec.
- [ ] Using the existing analytics tooling, confirm that a sample session triggers the expected events (`registration_modal_opened`, `registration_path_a_clicked`, `registration_path_b_clicked`, `registration_form_submitted`, `registration_app_download_clicked`, `registration_modal_closed`) with correct properties.
- [ ] Run `npm run lint` and the relevant tests (or `npm run ship:gate` if applicable) and ensure there are no new linting or test failures introduced by this work.

## Research Sources
- `CURSOR_Registration_Flow_Spec.md` in `Downloads` (primary UX and copy source)
- LBTA `.cursorrules` (brand, accessibility, and design system constraints)
- Existing LBTA registration-related components and API routes in this repo (`RegistrationModal`, `/book`, lead capture code) once inspected during implementation

## Relevant Learnings
- LBTA has strict **single source of truth** rules for data and copy; this plan reuses existing lead endpoints and keeps pricing/schedule data in `/data` instead of duplicating anything in UI code.
- Past work has emphasized **luxury, calm UX** and strong accessibility; this modal must prioritize clarity and low friction over cleverness or motion-heavy design.
- Supabase / server-side integrations already exist for lead storage; the modal should integrate with, not circumvent, those pathways via `lib/leads-store.ts` and API routes.

## Research conflicts & resolution
- **Rec1 URL strategy**: The spec presents Option A (single base catalog URL) and Option B (per-program URL mapping). To avoid brittle dependencies on city URLs and to keep this plan shippable, we will adopt **Option A only** in this iteration, with a clear helper line prompting parents to search for their program.
- **Modal wrapper vs standalone**: Depending on the existing modal ecosystem in the repo, we may choose to reuse a shared modal shell. The default assumption in this plan is to implement a self-contained `RegistrationModal` using existing Tailwind + layout patterns; if a shared modal wrapper exists and is clean to reuse, we will adapt to it during implementation without changing scope.

## Confidence & uncertainty
- **Plan confidence**: High — the spec is detailed and the required changes are well-bounded.
- **Uncertainty**:
  - Exact shape and expectations of the existing lead-capture endpoint; we may need minor schema adjustments to accept `program_name` and `registration_source`.
  - The precise set and locations of "Register" triggers across all program-related pages; some wiring work may be slightly more involved depending on how those components are structured.

## Risks & Mitigations
| Risk | Mitigation |
|------|------------|
| Inconsistent registration behavior across pages (some "Register" buttons not wired to the modal) | Systematically search for all "Register" buttons/components and cross-check against the plan’s file list; add any missing instances to the plan during implementation. |
| Lead-capture schema mismatch (missing `program_name` or `registration_source`) | Start by reading existing API route and validation schemas; extend them in a backwards-compatible way and add tests where reasonable. |
| Accessibility regressions (focus traps, keyboard nav, contrast) | Use existing modal patterns as reference, explicitly test keyboard navigation, and run at least a cursory a11y check after implementation. |
| Mobile layout issues (full-screen drawer bugs, text overflow) | Design and test mobile-first, using dev tools to verify behavior at 320px and 375px widths, and adjust spacing/typography as needed. |
| Overcomplicated analytics or event duplication | Keep analytics minimal and route them through existing utilities; add simple guards to avoid duplicate event firing on rapid clicks. |

