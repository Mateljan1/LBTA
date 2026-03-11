# Optional Polish + Homepage Overhaul — Master Plan

**Purpose:** One plan so you know exactly what we will do and what you will get. Three tracks: **Track A** (schedules polish), **Track B** (homepage overhaul), **Track C** (registration flow & operations). Simplicity and function over complexity.

---

## What you're getting (summary)

| Track | Scope | Deliverables | When |
|-------|--------|---------------|------|
| **A. Schedules optional polish** | Active section highlighting + plan doc tick | Sticky nav shows which section you're in; schedules plan success criteria all [x]. | Execute when you say "do Track A" or "do schedules Phase 4". |
| **B. Homepage full overhaul** | Layout, copy, imagery, a11y per existing plan | Hero-only fold, one CTA, LBTA voice everywhere, media brief + optional asset checklist; imagery wired as you supply files. | Execute when you say "do Track B" or "run homepage overhaul"; can run in phases. |
| **C. Registration flow & operations** | One thank-you, one ops map, optional AC for scholarship, email checklist | Single confirmation experience; you know where every lead lives; optional confirmation emails doc; scholarship in AC so no lead is lost. | Execute when you say "do Track C" or "registration polish". |

You can do **A only**, **B only**, **C only**, or any combination. **A, B, and C can run in parallel** (three agents): no file overlap between A/B/C. Each track has clear success criteria and file changes below.

---

## Track A: Schedules optional polish

**Goal:** Schedules page sticky nav shows the current section (active state + aria-current). Plan doc matches reality (success criteria ticked).

### What you get

1. **Active section in nav** — As you scroll Programs → Private Lessons → Camps → Leagues, the matching nav link is visually distinct (e.g. font-weight or underline) and has `aria-current="true"` for screen readers. No flashing; respects `prefers-reduced-motion`.
2. **Plan doc accurate** — `plans/schedules-page-ux-overhaul-plan.md` Success Criteria section: all items that are already true in code are marked [x].

### Implementation steps (Track A)

#### A.1 — Active section highlighting (SchedulesAnchorNav)

- [ ] **A.1.1** In `components/schedules/SchedulesAnchorNav.tsx`, add state: `activeSectionId: string | null`.
- [ ] **A.1.2** Use `IntersectionObserver` on the four section roots (`#programs`, `#private`, `#camps`, `#leagues`). When a section’s intersection ratio crosses a threshold (e.g. > 0.2 or “more than 20% in view”), set `activeSectionId` to that section’s id. Use a single observer and check which section has the largest visible ratio if multiple are in view, or “first in view” logic per plan.
- [ ] **A.1.3** For the link that matches `activeSectionId`: add `aria-current="true"` and a distinct style (e.g. `font-semibold text-brand-pacific-dusk` and/or `border-b-2 border-brand-victoria-cove`). For other links, no `aria-current` and default style.
- [ ] **A.1.4** No animation on active change (no flashing). If you use a transition, respect `prefers-reduced-motion` (no transition when reduced).
- [ ] **A.1.5** Ensure observer is created/cleaned up in `useEffect`; observe only the four section elements (refs or `document.getElementById` in effect).

#### A.2 — Schedules plan success criteria (doc only)

- [ ] **A.2.1** Open `plans/schedules-page-ux-overhaul-plan.md`. In the “Success Criteria” section, change each `[ ]` to `[x]` for criteria that are already met by the current implementation (Private Lessons one click, no mandatory long scroll, sticky nav visible, section order, touch targets, smooth scroll, scroll-margin-top, no modal on load, mobile nav, data from JSON). Leave unchecked only if something is not true (e.g. Lighthouse ≥ 90 — tick only after a quick check or leave as [ ] with a note “verify Lighthouse”).
- [ ] **A.2.2** In the same plan, mark Phase 4 steps **4.1** and **4.2** as [x] after A.1 is implemented.

### Files to create/modify (Track A)

| File | Action | Purpose |
|------|--------|---------|
| `components/schedules/SchedulesAnchorNav.tsx` | Modify | Add IntersectionObserver, activeSectionId state, aria-current and active style. |
| `plans/schedules-page-ux-overhaul-plan.md` | Modify | Tick Success Criteria and Phase 4 steps. |

### Success criteria (Track A)

- [ ] Scrolling to Programs / Private / Camps / Leagues updates the sticky nav so the current section’s link is visually distinct and has `aria-current="true"`.
- [ ] No layout shift or flash when active section changes; reduced-motion respected.
- [ ] Schedules plan Success Criteria section reflects implemented behavior (all [x] that are true).
- [ ] Build and lint pass; no new a11y or layout regressions.

---

## Track B: Homepage full overhaul

**Goal:** Execute the existing `plans/homepage-overhaul-plan.md` so the homepage is hero-first, one primary CTA, LBTA voice everywhere, and imagery is briefed and wired as you supply assets.

### What you get (by phase)

| Phase | What you get |
|-------|----------------|
| **B.1 Layout & UX** | Hero has no form in it; exit-intent never on load; one bottom CTA form; Sticky CTA correct; mobile 320/375 ok, 48px targets. |
| **B.2 Copy** | Single source `data/homepage-copy.json` (already exists — we verify and extend). Hero subline, founder, results, philosophy, programs, CTAs all LBTA voice; no forbidden words. |
| **B.3 Imagery** | Media brief doc (exists at `plans/homepage-media-brief.md`). Optional asset checklist. All existing images have alt/sizes; new paths only when you provide files. |
| **B.4 Polish & a11y** | Hero CTA solid bg, 48px, focus ring; reduced-motion on parallax/animations; HomeCTAForm a11y (labels, live region). |

**Note:** `data/homepage-copy.json` already exists and has hero subline, Book a Trial, founder, results, etc. So B.2 may be mostly verification and a few tweaks. B.1 and B.4 are the main code passes; B.3 is brief + wiring as assets arrive.

### Implementation steps (Track B) — ordered

- [ ] **B.1.1** Hero: confirm no form inside hero; only video, tagline, pillars, subline, “Book a Trial”, scroll cue.
- [ ] **B.1.2** ExitIntentPopup: guard so it never shows on initial load (e.g. only on exit-intent or after scrollY > X).
- [ ] **B.1.3** Bottom CTA: one form (HomeCTAForm); clear label “Get Started” or “Start with a Trial”.
- [ ] **B.1.4** Sticky CTA: z-index and placement don’t clash with header.
- [ ] **B.1.5** Mobile: hero and CTAs at 320px and 375px; no horizontal scroll; 48px touch targets.
- [ ] **B.2.1** Verify `data/homepage-copy.json` is the single source for hero, founder, results, philosophy, programs, CTAs; page and components import from it.
- [ ] **B.2.2** Copy audit: no “unlock your full potential”, “Join Now” as hero CTA, or forbidden words; Karue/founder lines match bio/research.
- [ ] **B.2.3** CTAs: primary “Book a Trial”; secondary “View Programs”, “See Schedules”, “Read Andrew’s Story”, “Watch His Journey”; form submit “Request a Trial” or “Get Started”.
- [ ] **B.3.1** Confirm `plans/homepage-media-brief.md` (or equivalent) exists and lists section, purpose, aspect, path, alt; optional checklist for “ready” assets.
- [ ] **B.3.2** All homepage `<Image>` and `<video>` have `alt`/`aria-label` and `sizes`; no new paths until you provide files.
- [ ] **B.4.1** Hero CTA: solid bg for 7:1; all CTAs min-h 48px; focus ring visible; footer/dark text at least text-white/50.
- [ ] **B.4.2** Parallax and AnimatedSection respect `prefers-reduced-motion`.
- [ ] **B.4.3** HomeCTAForm: labels and live region for error/success.

### Files to create/modify (Track B)

| File | Action | Purpose |
|------|--------|---------|
| `components/HomeHero.tsx` | Modify | Ensure no form; subline/CTA from data. |
| `components/ExitIntentPopup.tsx` | Modify | Guard: never show on initial load. |
| `app/page.tsx` | Modify | Copy from data; section order if needed. |
| `data/homepage-copy.json` | Verify/extend | Single source; add any missing keys. |
| `components/HomeCTAForm.tsx` | Modify | Label from data; a11y. |
| `plans/homepage-media-brief.md` | Verify/create | Section brief + optional checklist. |
| Section components (Founder, Results, Philosophy, Programs, etc.) | Modify | Pull copy from data; ensure CTAs match. |
| `plans/homepage-overhaul-plan.md` | Modify | Tick steps as we complete them. |

### Success criteria (Track B)

- [ ] Hero owns the fold: no form in hero; one primary CTA “Book a Trial”.
- [ ] Exit-intent does not show on load.
- [ ] All homepage copy from one source; LBTA voice; no forbidden words.
- [ ] CTAs and form labels match plan (Book a Trial, View Programs, See Schedules, etc.).
- [ ] Media brief (and optional checklist) in place; images have alt/sizes.
- [ ] Focus, contrast, 48px, reduced-motion per .cursorrules.
- [ ] Build and lint pass; Lighthouse accessibility ≥ 90 on homepage.

---

## Track C: Registration flow & operations

**Goal:** One clear confirmation experience for the user; one clear map for you (where leads go, what emails to set up); optional but high-value simplifications so nothing falls through the cracks and complexity is reduced.

**Philosophy:** Functional options and simplicity win. Turning complex flows into one simple, more functional version is the goal. Tennis academies and small businesses run on relationships and clarity—registration and follow-up should feel human and trackable.

### What you get

1. **One thank-you page that adapts** — Same URL `/thank-you`, optional `?type=trial|program|year|scholarship`. Headline and first line change by type (e.g. "We've received your trial request" vs "We've received your scholarship application"); "What Happens Now" and contact stay the same. User gets one consistent place; you edit one page.
2. **One-page ops map** — A single doc (e.g. `docs/registration-flows-and-ops.md`) that lists: which form → which API → where data lands (Notion / ActiveCampaign / Supabase) → what the user sees. So you always know where to look (Notion for program/year; AC for everyone who gets email; Supabase for lead backup and scholarship if configured).
3. **ActiveCampaign confirmation checklist** — A short doc (or section in the ops map) that says which automations to have in AC: e.g. "Contact added to List 4 → send welcome/confirmation"; "Tag Trial Request → send trial confirmation"; "Tag JTT Spring 2026 → send JTT confirmation." Code already adds contacts and tags; automations send the emails. This makes the "do we send a confirmation?" question explicit and one-time setup.
4. **Optional: Scholarship into ActiveCampaign** — Today scholarship only goes to `storeLead` (Supabase). If Supabase isn't set, applications exist only in the 200 response. Option: add contact to AC with a "Scholarship" tag so they're in your CRM and can receive a "we received your application" email. Simple, functional.
5. **Optional: Program/Year success → redirect to thank-you** — Today LuxuryYearModal and LuxuryRegistrationModal show success inside the modal, then close. Option: on success, redirect to `/thank-you?type=program` or `/thank-you?type=year` so the user gets the full "What Happens Now" and one confirmation experience everywhere.

### Current state (reference)

| Form / entry | API | Notion | ActiveCampaign | Supabase (storeLead) | User sees |
|--------------|-----|--------|----------------|----------------------|-----------|
| Trial / Book (modal, adult-trial, junior-trial, contact, HomeCTA, beginner) | `/api/book` | — | List 4 + tags (trial, program) | — | Redirect `/thank-you` |
| Program registration (LuxuryRegistrationModal) | `/api/register-program` | Yes | List 4 + class tag | — | Success in modal, close |
| Year / camps / JTT (LuxuryYearModal) | `/api/register-year` | Yes | List 4 + season/camp/JTT tags | — | Success in modal, close |
| Newsletter, ExitIntent | `/api/newsletter` | — | List 4 | — | Inline success |
| Scholarship | `/api/scholarship` | — | — | Yes (if env set) | Redirect `/thank-you?type=scholarship` (copy still trial) |
| Generic register | `/api/register` | — | — | Yes (if env set) | (No UI caller in codebase) |

Confirmation emails are **not** sent by the website; they are sent by ActiveCampaign automations when a contact is added to a list or tagged. So "is there an email?" = yes, if you set up the automation in AC for that list/tag.

### Implementation steps (Track C)

- [x] **C.1** Thank-you page: read `searchParams.type` (`trial` | `program` | `year` | `scholarship`). Default `trial` when missing. Set headline and first line by type (e.g. trial: "You're All Set" + "We've received your request and will contact you within 24 hours to confirm your trial."; scholarship: "Application Received" + "We've received your scholarship application and will review it shortly."). Keep one layout; no duplicate sections.
- [x] **C.2** Create `docs/registration-flows-and-ops.md` (or `plans/registration-flows-ops.md`): table Form → API → Notion/AC/Supabase → User sees; plus "Where to look" (Notion for program/year; AC for contacts and email; Supabase for leads/scholarship if configured).
- [x] **C.3** Add "ActiveCampaign automations checklist" to that doc or a short `docs/activecampaign-confirmation-checklist.md`: List 4 add → confirmation/welcome; tag Trial Request → trial confirmation; tag JTT Spring 2026 → JTT confirmation; etc. Code references (list id 4, tag ids in `lib/activecampaign.ts`) so you can match AC to code.
- [x] **C.4 (Optional)** Scholarship API: when AC env is set, after `storeLead`, upsert contact to ActiveCampaign and add tag "Scholarship" (create tag in AC if needed; document id in ops doc). So every scholarship app is in AC even if Supabase is not set.
- [x] **C.5 (Optional)** LuxuryYearModal and LuxuryRegistrationModal: on success, after short delay or "View next steps" click, redirect to `window.location.href = '/thank-you?type=year'` or `'/thank-you?type=program'` instead of only closing. Keeps one confirmation experience.

### Files to create/modify (Track C)

| File | Action | Purpose |
|------|--------|---------|
| `app/thank-you/page.tsx` | Modify | Read `type` from searchParams; dynamic headline + first line by type. |
| `docs/registration-flows-and-ops.md` or `plans/registration-flows-ops.md` | Create | One-page map: form → API → where data lives → what user sees. |
| `docs/activecampaign-confirmation-checklist.md` or section in ops doc | Create | Which AC automations to set for confirmation emails. |
| `app/api/scholarship/route.ts` | Modify (optional) | Add AC upsert + Scholarship tag when env set. |
| `components/LuxuryYearModal.tsx` | Modify (optional) | Redirect to `/thank-you?type=year` on success. |
| `components/LuxuryRegistrationModal.tsx` | Modify (optional) | Redirect to `/thank-you?type=program` on success. |

### Success criteria (Track C)

- [x] Thank-you page shows context-appropriate copy for trial, program, year, scholarship (via `?type=`).
- [x] One ops doc exists: where each form's data goes and where you look (Notion / AC / Supabase).
- [x] AC confirmation checklist exists so you know which automations to set for list/tags.
- [x] (Optional) Scholarship creates AC contact + tag when AC is configured.
- [x] (Optional) Program/year modals redirect to thank-you so one confirmation experience.
- [x] Build and lint pass; no regressions.

---

## Out of scope (this plan)

- New imagery creation (you supply assets; we wire paths and alt).
- Changes to other pages (about, coaches, schedules content) except as already specified.
- Backend or API contract changes (Track C optional scholarship AC is additive, not a breaking change).

---

## How to run this

- **Track A only:** “Execute Track A of optional-polish-and-homepage-master-plan” or “Do schedules Phase 4 and tick the plan.”
- **Track B only:** “Execute Track B of optional-polish-and-homepage-master-plan” or “Run the homepage overhaul from the master plan.”
- **Both, in order:** “Do Track A then Track B” — we do A, validate, then do B in phases.
- **Track C only:** "Execute Track C of optional-polish-and-homepage-master-plan" or "Registration flow and operations polish."
- **Two or three agents in parallel:** A, B, and C touch different files (no overlap). Run e.g. Agent 1 = A, Agent 2 = B, Agent 3 = C; merge when done.

After execution we will: run build/lint, update the relevant plan checkboxes, and optionally run compound review → validate → deploy (you choose deploy or not).

---

## Research / references

- Schedules: `plans/schedules-page-ux-overhaul-plan.md` (Phase 4, Success Criteria).
- Homepage: `plans/homepage-overhaul-plan.md` (Phases 1–4).
- Code: `components/schedules/SchedulesAnchorNav.tsx`, `app/page.tsx`, `data/homepage-copy.json`, `components/HomeHero.tsx`, `components/ExitIntentPopup.tsx`.
- Registration: `app/api/book/route.ts`, `app/api/register-program/route.ts`, `app/api/register-year/route.ts`, `app/api/newsletter/route.ts`, `app/api/scholarship/route.ts`, `lib/activecampaign.ts`, `lib/leads-store.ts`, `app/thank-you/page.tsx`, `components/LuxuryYearModal.tsx`, `components/LuxuryRegistrationModal.tsx`.
- .cursorrules: a11y (48px, focus, reduced-motion), brand tokens, forbidden copy.
