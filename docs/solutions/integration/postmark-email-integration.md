---
title: Postmark Email Integration Setup
category: integration
date: 2026-03-20
problem_type: integration_setup
component: email
status: solved
related_files:
  - lib/email.ts
  - app/api/book/route.ts
  - app/api/register-program/route.ts
  - app/api/register-year/route.ts
  - app/api/register/route.ts
  - app/api/scholarship/route.ts
  - app/api/newsletter/route.ts
  - docs/POSTMARK-SETUP-VERIFICATION.md
tags:
  - postmark
  - email
  - transactional-emails
  - integration
---

# Postmark Email Integration Setup

## Problem

The LBTA website needed automatic transactional emails sent when users submit forms (trial requests, registrations, newsletter signups, etc.). These emails needed to:
1. Notify staff at `support@lagunabeachtennisacademy.com` when forms are submitted
2. Send confirmation emails to users after registration
3. Use a reliable transactional email service with high deliverability
4. Maintain LBTA brand consistency in email templates
5. Never block API responses if email sending fails

## Solution

Integrated **Postmark** as the transactional email service, using their HTTP API directly (no npm dependency). Implemented a fire-and-forget email module that sends branded HTML emails for all form submissions.

### Implementation Details

**Location:** `lib/email.ts`

**Architecture:**
- Direct HTTP API integration with Postmark REST API
- Fire-and-forget pattern (all email functions return `Promise<void>`)
- Failures logged but never affect API responses
- Uses Postmark server token: `15dc4e0e-a75b-4444-b97a-6b4ef58d86b7`

**Postmark Configuration:**
- Domain: `lagunabeachtennisacademy.com` (DKIM ✅, Return-Path ✅)
- Sender Signatures:
  - `andrew@lagunabeachtennisacademy.com` (Andrew Mateljan)
  - `support@lagunabeachtennisacademy.com` (LBTA Support - default)

### Email Functions

#### Staff Notification Functions (to `support@lagunabeachtennisacademy.com`)

1. **`notifyTrialRequest(data)`** — Trial class booking notifications
   - Tag: `'trial-request'`
   - Fields: name, email, phone, program, location, experience, preferredDays

2. **`notifyPrivateLesson(data)`** — Private lesson request notifications
   - Tag: `'private-lesson'`
   - Fields: name, email, phone, coach, option

3. **`notifyRegistration(data)`** — Program registration notifications
   - Tag: `'registration'`
   - Supports: regular registrations, UTR circuit, camps
   - Fields: name, email, phone, program, type, division, season, location, studentName, studentAge, experience, notes

4. **`notifyScholarship(data)`** — Scholarship application notifications
   - Tag: `'scholarship'`
   - Fields: parentName, email, phone, studentName

5. **`notifyNewsletter(email)`** — Newsletter signup notifications
   - Tag: `'newsletter'`
   - Fields: email

#### User Confirmation Function (to registrant)

6. **`sendConfirmationEmail(params)`** — Registration confirmations
   - Tag: `'registration-confirmation'`
   - Recipient: User's email address
   - Content: Program-specific confirmation with category-aware "What Happens Next" section
   - Categories: Junior, Youth, Adult, Fitness, Camp, Match Play Series

### API Route Integration

All API routes call email functions using the fire-and-forget pattern:

```typescript
// Example from app/api/register-program/route.ts
void notifyRegistration({
  firstName: body.firstName,
  lastName: body.lastName,
  email: body.email,
  // ... other fields
})

void sendConfirmationEmail({
  email: body.email,
  firstName: body.firstName,
  programName: programData.name,
  // ... other fields
})
```

**Routes using Postmark:**
- `/api/book` → `notifyTrialRequest`, `notifyPrivateLesson`
- `/api/register-program` → `notifyRegistration`, `sendConfirmationEmail`
- `/api/register-year` → `notifyRegistration`, `sendConfirmationEmail`
- `/api/register` → `notifyRegistration`, `sendConfirmationEmail`
- `/api/scholarship` → `notifyScholarship`
- `/api/newsletter` → `notifyNewsletter`

### Environment Variables

**Required:**
- `POSTMARK_SERVER_TOKEN` — Postmark server token
  - Value: `15dc4e0e-a75b-4444-b97a-6b4ef58d86b7`
  - If missing, `sendEmail()` returns `false` immediately (graceful failure)

**Optional:**
- `POSTMARK_FROM_EMAIL` — Override default "from" address
  - Default: `'LBTA Website <support@lagunabeachtennisacademy.com>'`
  - If not set, uses default

**Setup in Vercel:**
1. Go to Project → Settings → Environment Variables
2. Add `POSTMARK_SERVER_TOKEN` with value `15dc4e0e-a75b-4444-b97a-6b4ef58d86b7`
3. Optionally add `POSTMARK_FROM_EMAIL` if different from default
4. Apply to Production, Preview, and Development environments

## Step-by-Step Solution

### 1. Postmark Account Setup

1. Created Postmark account
2. Added domain `lagunabeachtennisacademy.com`
3. Configured DNS records (DKIM, Return-Path)
4. Verified domain (DKIM ✅, Return-Path ✅)
5. Created sender signatures:
   - `andrew@lagunabeachtennisacademy.com`
   - `support@lagunabeachtennisacademy.com`
6. Obtained server token: `15dc4e0e-a75b-4444-b97a-6b4ef58d86b7`

### 2. Code Implementation

**Created `lib/email.ts` with:**

```typescript
const POSTMARK_API = 'https://api.postmarkapp.com/email'
const DEFAULT_FROM = 'LBTA Website <support@lagunabeachtennisacademy.com>'
const NOTIFY_TO = 'support@lagunabeachtennisacademy.com'

async function sendEmail(options: {
  to: string
  subject: string
  htmlBody: string
  tag?: string
}): Promise<boolean> {
  const token = getToken()
  if (!token) return false

  try {
    const res = await fetch(POSTMARK_API, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'X-Postmark-Server-Token': token,
      },
      body: JSON.stringify({
        From: getFrom(),
        To: options.to,
        Subject: options.subject,
        HtmlBody: options.htmlBody,
        Tag: options.tag ?? 'website-notification',
        MessageStream: 'outbound',
      }),
    })

    if (!res.ok) {
      const text = await res.text()
      console.error('[email] Postmark send failed:', res.status, text.slice(0, 200))
      return false
    }

    return true
  } catch (err) {
    console.error('[email] Postmark error:', err instanceof Error ? err.message : err)
    return false
  }
}
```

### 3. Email Template Design

**Notification Emails (Staff):**
- Branded HTML with LBTA colors and logo
- Gradient header (Pacific Dusk → Sunset Cliff → Thousand Steps)
- Table layout for form fields
- Footer with contact info and tagline

**Confirmation Emails (Users):**
- Branded HTML with responsive design
- Program-specific details (name, location, duration, age group)
- Category-aware "What Happens Next" section
- Footer with social links and app store badges

### 4. API Route Integration

Updated all form submission API routes to call email functions:

```typescript
// Example: app/api/register-program/route.ts
import { notifyRegistration, sendConfirmationEmail } from '@/lib/email'

// After successful registration processing:
void notifyRegistration({
  firstName: body.firstName,
  lastName: body.lastName,
  email: body.email,
  phone: body.phone,
  program: programData.name,
  // ... other fields
})

// Send confirmation to user:
void sendConfirmationEmail({
  email: body.email,
  firstName: body.firstName,
  programName: programData.name,
  location: programData.location,
  duration: programData.duration,
  ageGroup: programData.ageGroup,
  category: programData.category,
})
```

### 5. Environment Variable Configuration

Added to `.env.example`:
```bash
# Postmark — optional; when set, form submissions send notification emails to staff
POSTMARK_SERVER_TOKEN=
# Optional: override the default "from" address (default: support@lagunabeachtennisacademy.com)
# POSTMARK_FROM_EMAIL=
```

Configured in Vercel production environment.

## Verification

### Postmark Dashboard
- ✅ Domain verified: `lagunabeachtennisacademy.com`
- ✅ DKIM verified
- ✅ Return-Path verified
- ✅ Sender signatures active: `andrew@` and `support@`
- ✅ Server token: `15dc4e0e-a75b-4444-b97a-6b4ef58d86b7`

### Code Verification
- ✅ All email functions use fire-and-forget pattern (`void` calls)
- ✅ Error handling logs failures without affecting API responses
- ✅ HTML escaping applied to all user input
- ✅ Mobile-responsive email templates
- ✅ All API routes call appropriate email functions

### Test Procedures
1. Submit trial request → Check `support@` inbox for notification
2. Submit registration → Check both `support@` and registrant inboxes
3. Submit newsletter signup → Check `support@` inbox
4. Verify email formatting and branding
5. Check Postmark dashboard for delivery metrics

## Error Handling

**Fire-and-Forget Pattern:**
- All email functions return `Promise<void>`
- All calls use `void` prefix: `void notifyTrialRequest(...)`
- API routes never `await` email functions
- Email failures never affect HTTP response status

**Error Logging:**
- Errors prefixed with `[email]` for easy filtering
- Includes HTTP status codes and truncated error messages
- No PII in error logs (only status codes and error text)

**Graceful Degradation:**
- If `POSTMARK_SERVER_TOKEN` is missing, `sendEmail()` returns `false` immediately
- No exceptions thrown; all errors are logged but never propagated
- Form submissions succeed even if emails fail

## Prevention Strategies

### Environment Variable Validation
- Document `POSTMARK_SERVER_TOKEN` in `.env.example`
- Verify in Vercel dashboard before deployment
- Use `vercel env ls production | grep POSTMARK` to check

### Email Delivery Monitoring
- Check Postmark dashboard weekly for delivery issues
- Monitor bounce/complaint rates
- Review email delivery metrics monthly

### Code Quality
- All user input escaped via `escapeHtml()` function
- Email templates use proper HTML structure
- Mobile-responsive design for all email types
- Consistent branding across all email templates

## Related Documentation

- **Setup Guide:** [`docs/POSTMARK-SETUP-VERIFICATION.md`](../../POSTMARK-SETUP-VERIFICATION.md)
- **Power Stack:** [`docs/power-stack.md`](../../power-stack.md) (mentions Postmark)
- **Email Module:** `lib/email.ts`
- **Environment Variables:** `.env.example`

## Code Review Findings

### Critical Issues (Fixed)
1. ✅ Single-quote escaping added to `escapeHtml()` function
2. ✅ Viewport meta tag added to notification email templates

### Recommendations (Future)
1. Extract email templates to separate files for maintainability
2. Add basic email format validation in `sendEmail()` as safety check
3. Consider retry logic for confirmation emails (not notifications)
4. Add Postmark env vars to `lib/env.ts` for consistency

## Success Criteria

- ✅ Postmark domain verified and active
- ✅ Environment variables configured in Vercel
- ✅ All API routes call email functions correctly
- ✅ Test emails sent successfully
- ✅ Email formatting and branding verified
- ✅ Fire-and-forget pattern working (API responses succeed even if emails fail)
- ✅ Documentation created and cross-referenced

## Next Steps

1. Monitor Postmark dashboard for delivery rates
2. Set up bounce/complaint handling if not already configured
3. Consider adding email delivery tracking/logging
4. Review email templates quarterly for updates

---

*This integration enables automatic transactional emails from all LBTA website forms, improving staff notification and user confirmation workflows.*
