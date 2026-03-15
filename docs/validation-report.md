# LBTA Next.js Website — Validation Report

**Scope:** API contracts, user-flow wiring, and data integrity (no live API calls).  
**Date:** March 14, 2026.

---

## 1. API contract summary

| Route | Method | Body (POST) | Zod schema | Rate limit | Notes |
|-------|--------|-------------|------------|------------|-------|
| `/api/book` | POST | `firstName`, `lastName`, `email`, `phone` (required); `program`, `location`, `preferredDays`, `experience`, `goals` (optional) | `bookingSchema` | Yes (`sensitive`: 5/min) | NextRequest, parseJsonBody, validateRequest ✓ |
| `/api/register-program` | POST | `contactSchema` + `program` (required); `location`, `studentName`, `studentAge`, `preferredDays`, `timeSlot`, `totalPrice`, `experience`, `notes` (optional) | `programRegistrationSchema` | Yes (`form`: 10/min) | NextRequest, parseJsonBody, validateRequest ✓ |
| `/api/register-year` | POST | `registerYearSchema`: `firstName`, `lastName`, `email`, `phone`, `program` (required); `registrationType`, `studentName`, `playerName`, `preferredDays`, `location`, `timeSlot`, `totalPrice`/`price`, ages, `season`, `camp*`, `jtt*`, etc. (optional) | `registerYearSchema` | Yes (`form`) | NextRequest, parseJsonBody, validateRequest ✓ |
| `/api/register` | POST | `contactSchema` + `age`, `skillLevel`, `experience` (required); `program`, `season`, `earlyBird`, `finalPrice`, `goals`, `notes` (optional) | `registerSchema` | Yes (`form`) | NextRequest, parseJsonBody, validateRequest ✓ |
| `/api/newsletter` | POST | `email` (required) | `newsletterSchema` | Yes (`form`) | NextRequest, parseJsonBody, validateRequest ✓ |
| `/api/scholarship` | POST | `studentName`, `parentName`, `email` (required); `phone`, `studentGPA`, `householdIncome`, `sessionsPerWeek`, `commitment`, `notes` (optional) | `scholarshipSchema` | Yes (`form`) | NextRequest, parseJsonBody, validateRequest ✓ |
| `/api/jtt-registration` | POST | `jttRegistrationSchema`: player name/DOB/age, parent name/email/phone/address, emergency contact, `division`, `shirtSize`, `ustaRegistered`, `experienceLevel`, `paymentPreference`, consents, etc. | `jttRegistrationSchema` | Yes (`form`) | NextRequest, parseJsonBody, validateRequest ✓ |
| `/api/chat` | POST | `message` (required), `history` (optional) | `chatSchema` | Yes (`form`) | NextRequest, parseJsonBody, validateRequest ✓ |
| `/api/activecampaign-webhook` | POST, GET | POST: AC webhook payload (`contact.id` / `contact_id` / `id`; validated as positive integer); GET: verification only | `webhookPayloadSchema` | No | Secret via `x-webhook-secret` or `?secret=`; timing-safe compare ✓ |

**Consistency:** All POST handlers use `NextRequest`, `parseJsonBody`, and `validateRequest` with the appropriate Zod schema from `lib/validations.ts`. Rate limiting is applied from `lib/rate-limit.ts` (RATE_LIMITS.form or .sensitive) on all form/booking routes; the webhook does not use rate limiting and correctly uses secret verification instead.

---

## 2. User flows and wiring

| Flow | API route | Form / component | Wired? |
|------|-----------|------------------|--------|
| Book a trial | `/api/book` | TrialBookingModal | ✓ |
| Book a trial (homepage CTA) | `/api/book` | HomeCTAForm | ✓ (sends firstName, lastName, email, phone, program) |
| Book a trial (contact page) | `/api/book` | Contact page form | ✓ (derives firstName/lastName from name, sends program) |
| Book a trial (landing pages) | `/api/book` | adult-trial, junior-trial, beginner-program pages | ✓ |
| Register for program | `/api/register-program` | LuxuryRegistrationModal | ✓ |
| Year / camps / JTT (year-round) | `/api/register-year` | LuxuryYearModal | ✓ |
| Newsletter signup | `/api/newsletter` | NewsletterForm, ExitIntentPopup | ✓ |
| Scholarship application | `/api/scholarship` | apply-scholarship page | ✓ |
| Chat widget | `/api/chat` | ChatWidget | ✓ |
| JTT registration (dedicated form) | `/api/jtt-registration` | — | **No UI** — API exists; no component or page in codebase posts to this route. |
| Generic registration | `/api/register` | — | **No UI** — No form or component calls this route (documented as intentional). |

---

## 3. Data integrity

- **Schedule/program lists:** Sourced via **lib/programs-data** and **lib/camps-data** (no direct season JSON imports in components for program/camp lists).
  - **app/schedules/page.tsx:** Server component; loads programs with `getWinter2026Programs()`, `getSpringProgramsForDisplay()`, `getSummerProgramsForDisplay()`, `getFall2026Programs()` from `lib/programs-data`; passes `programsBySeason` to `SchedulesPageClient`. Uses `year2026Data` and `leaguesData` in the same page for camps, private coaching, leagues (single place, passed as props).
  - **components/schedules/ProgramsSection:** Receives `programsBySeason` as props; no direct JSON or programs-data import.
  - **app/camps/page.tsx:** Uses `getCampsFromYear2026()` from `lib/camps-data`.
  - **app/programs/page.tsx:** Uses `getProgramsOverview()` from `lib/programs-data`.
  - **components/TrialBookingModal.tsx:** Uses `getTrialProgramOptions()` from `lib/programs-data` for trial program options.
- **Exceptions (acceptable):**
  - **app/schedules/page.tsx** imports `year2026.json` and `leagues-2026.json` at page level for camps, private coaching, discounts, scholarships, and leagues; data is passed as props. This is the intended single load point for those sections.
  - Other pages/components import **data/faq.json**, **data/site-stats.json**, **data/homepage-copy.json**, **data/pricing-supplemental.json**, **data/leagues-2026.json** for FAQ, stats, copy, pricing tiers, and league content — not for “schedule program list” data. **lib/programs-data** and **lib/camps-data** themselves import from **data/** (winter2026, spring-summer-2026, fall2026, year2026, private-rates, pricing-supplemental) as the single entry point for program/camp shape and pricing.

**Conclusion:** Schedule and program list data is loaded via lib/programs-data and lib/camps-data; no component imports winter2026 or spring-summer-2026 directly for program list. Exceptions are limited to page-level loading of year2026/leagues and to content/copy/supplemental data files.

---

## Validation status: **WARNINGS**

**Summary:** API contracts are consistent (NextRequest, parseJsonBody, validateRequest, Zod, rate limiting where appropriate). All main user flows (trial booking, program registration, year/camp registration, newsletter, scholarship, contact, chat) are wired to the correct routes; **JTT has a full API but no in-app form** calling `/api/jtt-registration`. Data integrity is satisfied: schedule/program data flows through lib/programs-data and lib/camps-data with no direct season JSON in components. Status is WARNINGS due to the unwired JTT API (and the documented absence of a UI for `/api/register`).
