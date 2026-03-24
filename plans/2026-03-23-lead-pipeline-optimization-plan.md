# Lead Pipeline Optimization Plan

> **For Claude:** Use /execute-plan to implement this plan task-by-task.

**Goal:** Close every gap in the LBTA lead capture pipeline so that nothing gets lost — every form sends a confirmation email, season tags auto-update, and GHL gets program context.

**Architecture:** Six targeted fixes to the existing Next.js API routes and shared modules. No new routes or dependencies. Each task is independent and can be deployed individually. The existing `sendConfirmationEmail()` and `buildNotificationHtml()` patterns are reused everywhere.

**Tech Stack:** Next.js 14 (App Router), TypeScript strict mode, Postmark HTTP API, ActiveCampaign REST API, GoHighLevel Lead Connector API v2

---

## Task Overview

| # | Task | Risk | Files Changed |
|---|------|------|---------------|
| 1 | Fix hardcoded season tag in webhook handler | Low | 2 files |
| 2 | Add trial booking confirmation email | Low | 2 files |
| 3 | Add private lesson confirmation email | Low | 1 file |
| 4 | Add scholarship confirmation email | Low | 2 files |
| 5 | Add program context to GHL sync | Low | 2 files |
| 6 | AC admin tasks (no code — manual checklist) | None | 0 files |

---

### Task 1: Auto-detect season tag in webhook handler

**Problem:** `app/api/activecampaign-webhook/route.ts:216` hardcodes `CAMPAIGN_TAGS.winter_2026`. Spring started — non-website leads (Facebook, walk-ins) are getting tagged with the wrong season.

**Files:**
- Modify: `lib/activecampaign.ts` (add helper function)
- Modify: `app/api/activecampaign-webhook/route.ts:216` (use helper)

**Step 1: Add `getCurrentSeasonTagId()` to `lib/activecampaign.ts`**

Add this function after the `SEASON_TAGS` constant (after line 160):

```typescript
/**
 * Return the AC season tag ID for the current date.
 * Uses the same season boundary logic as the rest of the site.
 * Falls back to spring_2026 if no match (safe default for 2026).
 */
export function getCurrentSeasonTagId(): number {
  const now = new Date()
  const month = now.getMonth() // 0-indexed

  // Jan-Mar → winter (tag 228), Apr-Jun → spring (227),
  // Jul-Sep → summer (230 = summer_2025 until 2026 tag exists),
  // Oct-Dec → fall (229 = fall_2025 until 2026 tag exists)
  if (month <= 2) return SEASON_TAGS.winter_2026   // 228
  if (month <= 5) return SEASON_TAGS.spring_2026   // 227
  if (month <= 8) return SEASON_TAGS.summer_2025   // 230 (placeholder until summer_2026 created)
  return SEASON_TAGS.fall_2025                      // 229 (placeholder until fall_2026 created)
}
```

**Step 2: Update the webhook handler**

In `app/api/activecampaign-webhook/route.ts`, change line 216:

```typescript
// BEFORE:
const seasonTagId = CAMPAIGN_TAGS.winter_2026  // 228

// AFTER:
const seasonTagId = getCurrentSeasonTagId()
```

Update the import at the top of the file to include `getCurrentSeasonTagId`.

**Step 3: Verify**

```bash
cd /Users/andrew-mac-studio/LBTA_WEBSITE_DRAFT_3:5:26
npx tsc --noEmit
```

Expected: No type errors.

**Step 4: Commit**

```bash
git add lib/activecampaign.ts app/api/activecampaign-webhook/route.ts
git commit -m "fix: auto-detect season tag in AC webhook handler

Replaces hardcoded winter_2026 tag with getCurrentSeasonTagId()
that derives the correct season from the current date. Prevents
non-website leads from getting stale season tags."
```

---

### Task 2: Add confirmation email for trial bookings

**Problem:** When someone requests a trial class via `/api/book`, the staff gets a Postmark notification but the parent/player gets nothing — no confirmation that their request was received.

**Files:**
- Modify: `lib/email.ts` (add `sendTrialConfirmationEmail`)
- Modify: `app/api/book/route.ts:210-219` (call it after `notifyTrialRequest`)

**Step 1: Add `sendTrialConfirmationEmail` to `lib/email.ts`**

Add after the `notifyTrialRequest` function (after line 160):

```typescript
/**
 * Send a branded confirmation email to a trial class requestor.
 * Fire-and-forget — failures are logged but never affect the API response.
 */
export async function sendTrialConfirmationEmail(params: {
  email: string
  firstName: string
  program?: string
  location?: string
}): Promise<void> {
  const { email, firstName, program, location } = params
  const programDisplay = program || 'a trial class'
  const locationDisplay = location || 'one of our Laguna Beach courts'

  void sendEmail({
    to: email,
    subject: `LBTA — Your Trial Class Request Is Confirmed`,
    tag: 'trial-confirmation',
    htmlBody: buildConfirmationHtml({
      email,
      firstName,
      programName: `Trial Class${program ? ` — ${program}` : ''}`,
      location: locationDisplay,
      duration: 'TBD (our team will confirm)',
      category: 'Trial',
    }),
  })
}
```

**Step 2: Update `buildConfirmationHtml` to handle "Trial" category**

In `lib/email.ts`, inside the `buildConfirmationHtml` function, add a `Trial` case to the `whatHappensNext` section (around line 312). After the `isMatchPlay` check and before the `isJuniorOrYouth` check:

```typescript
  const isTrial = category === 'Trial'

  let whatHappensNext = ''
  if (isTrial) {
    whatHappensNext = `
      <tr><td style="padding:4px 0 4px 12px;color:#333;font-size:14px;font-family:'DM Sans',Arial,sans-serif;">1. Our team will call or email within 24 hours to schedule your trial session.</td></tr>
      <tr><td style="padding:4px 0 4px 12px;color:#333;font-size:14px;font-family:'DM Sans',Arial,sans-serif;">2. Your first session is free — just show up and play.</td></tr>
      <tr><td style="padding:4px 0 4px 12px;color:#333;font-size:14px;font-family:'DM Sans',Arial,sans-serif;">3. Bring a racquet (loaners available), water, and athletic shoes.</td></tr>`
  } else if (isCamp) {
```

Also update the preheader text to handle trial:

```typescript
// In the preheader div, change:
Your ${escapeHtml(programName)} registration is confirmed
// to handle trial:
Your ${escapeHtml(programName)} request is confirmed
```

And update the hero heading to use "Request" instead of "Registration" when it's a trial:

```typescript
// Change the hero h1:
<p style="...">REGISTRATION CONFIRMED</p>
// to:
<p style="...">${isTrial ? 'TRIAL REQUEST CONFIRMED' : 'REGISTRATION CONFIRMED'}</p>

// And:
Your Spot in <em>...</em> Is Reserved.
// to:
${isTrial ? `Your <em>...</em> Is Confirmed.` : `Your Spot in <em>...</em> Is Reserved.`}
```

**Step 3: Wire it up in `/api/book/route.ts`**

After line 219 (after the `notifyTrialRequest` call), add:

```typescript
    // Send branded confirmation email TO the trial requestor (fire-and-forget)
    void sendTrialConfirmationEmail({
      email: trialBody.email,
      firstName: trialBody.firstName,
      program: trialBody.program,
      location: trialBody.location,
    })
```

Update the import at the top:

```typescript
import { notifyTrialRequest, notifyPrivateLesson, sendTrialConfirmationEmail } from '@/lib/email'
```

**Step 4: Verify**

```bash
npx tsc --noEmit
```

**Step 5: Commit**

```bash
git add lib/email.ts app/api/book/route.ts
git commit -m "feat: send confirmation email to trial class requestors

Adds sendTrialConfirmationEmail() with Trial-specific 'What Happens
Next' content. Closes the gap where trial requestors got no
confirmation that their submission was received."
```

---

### Task 3: Add confirmation email for private lesson bookings

**Problem:** Private lesson requests via `/api/book` (bookingType=private) also get no confirmation email to the requester.

**Files:**
- Modify: `lib/email.ts` (add `sendPrivateLessonConfirmationEmail`)
- Modify: `app/api/book/route.ts:149-156` (call it after `notifyPrivateLesson`)

**Step 1: Add `sendPrivateLessonConfirmationEmail` to `lib/email.ts`**

Add after the `sendTrialConfirmationEmail` function:

```typescript
/**
 * Send a branded confirmation email to a private lesson requestor.
 * Fire-and-forget.
 */
export async function sendPrivateLessonConfirmationEmail(params: {
  email: string
  firstName: string
  coach: string
  option: string
}): Promise<void> {
  void sendEmail({
    to: params.email,
    subject: `LBTA — Your Private Lesson Request with ${params.coach}`,
    tag: 'private-lesson-confirmation',
    htmlBody: buildConfirmationHtml({
      email: params.email,
      firstName: params.firstName,
      programName: `Private Lessons — ${params.coach}`,
      location: 'TBD (coach will confirm)',
      duration: params.option,
      category: 'Private',
    }),
  })
}
```

**Step 2: Add "Private" category to `buildConfirmationHtml`**

In the `whatHappensNext` section of `buildConfirmationHtml`, add before the `isCamp` check:

```typescript
  const isPrivate = category === 'Private'

  // Then in the if/else chain:
  if (isTrial) {
    // ... (from Task 2)
  } else if (isPrivate) {
    whatHappensNext = `
      <tr><td style="padding:4px 0 4px 12px;color:#333;font-size:14px;font-family:'DM Sans',Arial,sans-serif;">1. Your requested coach will reach out within 24 hours to schedule your lesson.</td></tr>
      <tr><td style="padding:4px 0 4px 12px;color:#333;font-size:14px;font-family:'DM Sans',Arial,sans-serif;">2. Lesson times and court location will be confirmed directly with your coach.</td></tr>
      <tr><td style="padding:4px 0 4px 12px;color:#333;font-size:14px;font-family:'DM Sans',Arial,sans-serif;">3. Bring a racquet, water, and athletic shoes to your session.</td></tr>`
  } else if (isCamp) {
```

**Step 3: Wire it up in `/api/book/route.ts`**

After line 156 (after `notifyPrivateLesson`), add:

```typescript
      // Send branded confirmation email TO the requestor (fire-and-forget)
      void sendPrivateLessonConfirmationEmail({
        email: privateBody.email,
        firstName: privateBody.firstName,
        coach: privateBody.coach,
        option: privateBody.option,
      })
```

Update the import:

```typescript
import {
  notifyTrialRequest,
  notifyPrivateLesson,
  sendTrialConfirmationEmail,
  sendPrivateLessonConfirmationEmail,
} from '@/lib/email'
```

**Step 4: Verify**

```bash
npx tsc --noEmit
```

**Step 5: Commit**

```bash
git add lib/email.ts app/api/book/route.ts
git commit -m "feat: send confirmation email for private lesson requests

Adds sendPrivateLessonConfirmationEmail() with Private-specific
'What Happens Next' content including coach follow-up expectations."
```

---

### Task 4: Add confirmation email for scholarship applications

**Problem:** Scholarship applicants get no confirmation. These are families seeking financial assistance — leaving them without acknowledgment is especially poor experience.

**Files:**
- Modify: `lib/email.ts` (add `sendScholarshipConfirmationEmail`)
- Modify: `app/api/scholarship/route.ts:117-122` (call it after `notifyScholarship`)

**Step 1: Add `sendScholarshipConfirmationEmail` to `lib/email.ts`**

Add after the `sendPrivateLessonConfirmationEmail` function:

```typescript
/**
 * Send a branded confirmation email to a scholarship applicant.
 * Fire-and-forget.
 */
export async function sendScholarshipConfirmationEmail(params: {
  email: string
  firstName: string
  studentName?: string
}): Promise<void> {
  void sendEmail({
    to: params.email,
    subject: `LBTA — We Received Your Scholarship Application`,
    tag: 'scholarship-confirmation',
    htmlBody: buildConfirmationHtml({
      email: params.email,
      firstName: params.firstName,
      programName: `Scholarship Application${params.studentName ? ` for ${params.studentName}` : ''}`,
      location: 'Laguna Beach Tennis Academy',
      duration: 'Application under review',
      category: 'Scholarship',
    }),
  })
}
```

**Step 2: Add "Scholarship" category to `buildConfirmationHtml`**

In the `whatHappensNext` section:

```typescript
  const isScholarship = category === 'Scholarship'

  // In the if/else chain, add before the final else:
  } else if (isScholarship) {
    whatHappensNext = `
      <tr><td style="padding:4px 0 4px 12px;color:#333;font-size:14px;font-family:'DM Sans',Arial,sans-serif;">1. Our team will review your application within 5 business days.</td></tr>
      <tr><td style="padding:4px 0 4px 12px;color:#333;font-size:14px;font-family:'DM Sans',Arial,sans-serif;">2. We will reach out by email or phone to discuss next steps and available support.</td></tr>
      <tr><td style="padding:4px 0 4px 12px;color:#333;font-size:14px;font-family:'DM Sans',Arial,sans-serif;">3. All applications are handled with complete confidentiality.</td></tr>`
  } else if (isJuniorOrYouth) {
```

Also update the hero text to handle Scholarship:

```typescript
// In the label line:
${isTrial ? 'TRIAL REQUEST CONFIRMED' : isScholarship ? 'APPLICATION RECEIVED' : 'REGISTRATION CONFIRMED'}

// In the heading:
${isTrial ? `Your <em>...</em> Is Confirmed.` : isScholarship ? `Your Application Has Been Received.` : `Your Spot in <em>...</em> Is Reserved.`}
```

**Step 3: Wire it up in `/api/scholarship/route.ts`**

After line 122 (after `notifyScholarship`), add:

```typescript
    // Send confirmation email TO the applicant (fire-and-forget)
    const scholarshipFirstName = spaceIdx > 0
      ? parentName.slice(0, spaceIdx)
      : parentName || 'there'
    void sendScholarshipConfirmationEmail({
      email: validation.data.email,
      firstName: scholarshipFirstName,
      studentName: validation.data.studentName,
    })
```

Update the import:

```typescript
import { notifyScholarship, sendScholarshipConfirmationEmail } from '@/lib/email'
```

**Step 4: Verify**

```bash
npx tsc --noEmit
```

**Step 5: Commit**

```bash
git add lib/email.ts app/api/scholarship/route.ts
git commit -m "feat: send confirmation email for scholarship applications

Adds sendScholarshipConfirmationEmail() with Scholarship-specific
messaging. Ensures families seeking financial assistance receive
immediate acknowledgment of their application."
```

---

### Task 5: Add program context to GHL sync

**Problem:** `sendToGHL()` only sends name/email/phone. GHL workflows can't differentiate a camp signup from a private lesson request. All contacts look identical in GHL.

**Files:**
- Modify: `lib/gohighlevel.ts` (extend payload type + createContact body)
- Modify: All API routes that call `sendToGHL()` (6 files — add `tags` and `customFields`)

**Step 1: Extend `GHLContactPayload` in `lib/gohighlevel.ts`**

```typescript
// BEFORE:
export type GHLContactPayload = {
  email: string
  firstName?: string
  lastName?: string
  phone?: string
}

// AFTER:
export type GHLContactPayload = {
  email: string
  firstName?: string
  lastName?: string
  phone?: string
  /** Free-text tags for GHL segmentation (e.g. "Website Registration", "Trial Request") */
  tags?: string[]
  /** Custom field values — keys must match GHL custom field keys */
  customFields?: Array<{ key: string; field_value: string }>
}
```

**Step 2: Pass tags and customFields in `createContact`**

In the `createContact` function body, extend the JSON payload:

```typescript
  const res = await fetch(`${GHL_BASE}/contacts/`, {
    method: 'POST',
    headers,
    body: JSON.stringify({
      locationId,
      email: payload.email.trim(),
      firstName: (payload.firstName ?? '').trim() || undefined,
      lastName: (payload.lastName ?? '').trim() || undefined,
      phone: (payload.phone ?? '').trim() || undefined,
      tags: payload.tags,
      customFields: payload.customFields,
    }),
  })
```

**Step 3: Update callers with program context**

In each API route, update the `sendToGHL()` calls to include tags. Example for `/api/register-program/route.ts`:

```typescript
// BEFORE:
void sendToGHL({
  email: data.email,
  firstName: data.firstName,
  lastName: data.lastName,
  phone: data.phone,
})

// AFTER:
void sendToGHL({
  email: data.email,
  firstName: data.firstName,
  lastName: data.lastName,
  phone: data.phone,
  tags: ['Website Registration', data.program],
})
```

Routes and their tags:

| Route | Tags to pass |
|-------|-------------|
| `/api/register/route.ts` | `['Website Registration', data.program ?? 'General Inquiry']` |
| `/api/register-program/route.ts` | `['Website Registration', data.program]` |
| `/api/register-year/route.ts` | `['Website Registration', data.program, data.registrationType ?? 'seasonal']` |
| `/api/book/route.ts` (trial) | `['Trial Request', trialBody.program ?? 'Not Specified']` |
| `/api/book/route.ts` (private) | `['Private Lesson', privateBody.coach]` |
| `/api/scholarship/route.ts` | `['Scholarship Application']` |
| `/api/newsletter/route.ts` | `['Newsletter']` |

**Step 4: Verify**

```bash
npx tsc --noEmit
```

**Step 5: Commit**

```bash
git add lib/gohighlevel.ts app/api/register/route.ts app/api/register-program/route.ts app/api/register-year/route.ts app/api/book/route.ts app/api/scholarship/route.ts app/api/newsletter/route.ts
git commit -m "feat: pass program context to GHL sync

Extends GHLContactPayload with optional tags and customFields.
All 7 form API routes now send program-specific tags to GHL so
workflows can segment by program type (trial, private, camp, etc)."
```

---

### Task 6: ActiveCampaign admin tasks (manual — no code)

These are changes made in the ActiveCampaign dashboard, not in code. Do them after deploying Tasks 1-5.

**6a. Disable the AC list notification email**

1. Log in to ActiveCampaign → Lists → "Laguna Beach Tennis Academy" (list 4)
2. Settings → Notifications → Turn OFF "New subscriber notification"
3. You'll still get the detailed Postmark notifications (which include program, location, etc.)

**6b. Retire or redirect AC native forms**

1. Go to ActiveCampaign → Forms → find the form at `forms.lagunabeachtennisacademy.com/contact/2471`
2. Options:
   - **Option A (recommended):** Edit the form action URL to redirect to `https://lagunabeachtennisacademy.com/contact` — sends leads through your full pipeline
   - **Option B:** Add program interest, experience level, and location fields to the AC form + ensure the webhook handler processes them

**6c. Update season tag for Spring 2026**

This is automated by Task 1 above. But verify after deploy:
1. Create a test contact via Facebook Lead Ads or manual AC entry
2. Check that the webhook applies tag `spring_2026` (227), not `winter_2026` (228)

**6d. Create summer_2026 and fall_2026 season tags in AC (before those seasons start)**

1. Go to ActiveCampaign → Contacts → Tags
2. Create: `season:summer-2026` and `season:fall-2026`
3. Note the tag IDs
4. Update `SEASON_TAGS` in `lib/activecampaign.ts` and `getCurrentSeasonTagId()` with the new IDs

---

## Deployment Order

```
Task 1 (season tag fix)     → deploy immediately, fixes active bug
Task 2 (trial confirmation) → deploy with Task 3
Task 3 (private lesson confirmation) → deploy with Task 2
Task 4 (scholarship confirmation) → deploy independently
Task 5 (GHL program context) → deploy independently
Task 6 (AC admin)           → do after all code deploys
```

## Verification After Deploy

1. Submit a trial request on `lagunabeachtennisacademy.com/book` → check for confirmation email in registrant inbox + internal Postmark notification
2. Submit a private lesson request → same check
3. Submit a scholarship application → same check
4. Verify Postmark dashboard shows new tags: `trial-confirmation`, `private-lesson-confirmation`, `scholarship-confirmation`
5. Verify GHL contacts from new submissions have program tags visible

---

## Risk Assessment

All tasks are **low risk**:
- Tasks 1-4 add fire-and-forget emails that don't affect the API response
- Task 5 adds optional fields to GHL — existing contacts are unaffected
- No database migrations, no schema changes, no breaking API changes
- Every change is behind `void` (fire-and-forget) so failures never block the registration response
