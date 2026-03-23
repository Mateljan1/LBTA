# Postmark Email Integration — Setup Verification Guide

**Purpose:** Verify that Postmark transactional emails are configured correctly and sending from all LBTA website forms.

**Postmark Server Token:** `15dc4e0e-a75b-4444-b97a-6b4ef58d86b7`  
**Domain:** `lagunabeachtennisacademy.com` (Verified ✅)

---

## Quick Status Check

### ✅ Already Verified (from Postmark Dashboard)
- Domain verification: DKIM ✅, Return-Path ✅
- Sender signatures configured:
  - `andrew@lagunabeachtennisacademy.com` (Andrew Mateljan)
  - `support@lagunabeachtennisacademy.com` (LBTA Support)

### ⏳ Needs Verification
- Environment variables in Vercel production
- Test email delivery from each API route
- Email formatting and branding
- Bounce/complaint handling configuration

---

## 1. Environment Variables Verification

### In Vercel Dashboard

1. Go to your Vercel project → Settings → Environment Variables
2. Verify these variables exist for **Production** (and Preview if testing):

| Variable | Expected Value | Required |
|----------|----------------|----------|
| `POSTMARK_SERVER_TOKEN` | `15dc4e0e-a75b-4444-b97a-6b4ef58d86b7` | ✅ Yes |
| `POSTMARK_FROM_EMAIL` | `support@lagunabeachtennisacademy.com` | ⚠️ Optional (defaults to this) |

### Verification Command

```bash
# Check if variables are set (requires Vercel CLI)
vercel env ls production | grep POSTMARK
```

**Expected output:**
```
POSTMARK_SERVER_TOKEN    Production, Preview, Development
POSTMARK_FROM_EMAIL      Production, Preview (optional)
```

---

## 2. Postmark Dashboard Verification

### Server Token Check

1. Log into Postmark: https://account.postmarkapp.com
2. Go to **Servers** → Find server with token `15dc4e0e-a75b-4444-b97a-6b4ef58d86b7`
3. Verify:
   - Server name matches LBTA
   - Status is **Active**
   - Sending limits are appropriate

### Domain & Signatures

1. Go to **Sending** → **Signatures**
2. Verify `lagunabeachtennisacademy.com` shows:
   - ✅ DKIM Verified
   - ✅ Return-Path Verified
3. Verify both sender signatures are active:
   - `andrew@lagunabeachtennisacademy.com`
   - `support@lagunabeachtennisacademy.com`

### Bounce & Complaint Handling

1. Go to **Settings** → **Bounce Handling**
2. Verify bounce webhook is configured (if using)
3. Check complaint handling settings

---

## 3. Code Implementation Verification

### Email Module (`lib/email.ts`)

**Location:** `lib/email.ts`

**Key Functions:**
- `sendEmail()` - Core Postmark API call
- `notifyTrialRequest()` - Trial booking notifications
- `notifyPrivateLesson()` - Private lesson notifications
- `notifyRegistration()` - Program registration notifications
- `notifyScholarship()` - Scholarship application notifications
- `notifyNewsletter()` - Newsletter signup notifications
- `sendConfirmationEmail()` - Registration confirmations to users

**Verification Checklist:**
- [x] Uses Postmark HTTP API directly (no npm dependency)
- [x] All functions are fire-and-forget (void calls)
- [x] Error handling logs failures without affecting API responses
- [x] Default FROM email matches sender signature: `support@lagunabeachtennisacademy.com`

### API Routes Using Postmark

| Route | Notification Function | Confirmation Function |
|-------|----------------------|----------------------|
| `/api/book` | `notifyTrialRequest`, `notifyPrivateLesson` | None |
| `/api/register-program` | `notifyRegistration` | `sendConfirmationEmail` |
| `/api/register-year` | `notifyRegistration` | `sendConfirmationEmail` |
| `/api/register` | `notifyRegistration` | `sendConfirmationEmail` |
| `/api/scholarship` | `notifyScholarship` | None |
| `/api/newsletter` | `notifyNewsletter` | None |

**Verification:** All routes import and call email functions correctly.

---

## 4. Test Email Procedures

### Test 1: Trial Request Notification

1. Go to `/book` page
2. Fill out trial request form
3. Submit form
4. **Check:** Email arrives at `support@lagunabeachtennisacademy.com`
5. **Verify:** Email contains all form fields (name, email, phone, program, location, etc.)

### Test 2: Registration Confirmation

1. Go to `/schedules` page
2. Register for any program
3. Submit registration form
4. **Check:** Two emails sent:
   - Notification to `support@lagunabeachtennisacademy.com`
   - Confirmation to registrant's email address
5. **Verify:** Confirmation email shows program details, location, next steps

### Test 3: Newsletter Signup

1. Go to newsletter signup form
2. Enter email address
3. Submit
4. **Check:** Email arrives at `support@lagunabeachtennisacademy.com`
5. **Verify:** Email shows newsletter signup notification

### Test 4: Scholarship Application

1. Go to `/apply-scholarship` page
2. Fill out scholarship form
3. Submit
4. **Check:** Email arrives at `support@lagunabeachtennisacademy.com`
5. **Verify:** Email contains parent name, student name, contact info

---

## 5. Email Formatting Verification

### Notification Emails (to staff)

**Recipient:** `support@lagunabeachtennisacademy.com`

**Should include:**
- LBTA branding (logo, colors, gradient header)
- Form type (trial request, registration, etc.)
- All submitted form fields in table format
- Footer with contact info and tagline

**Check:**
- [ ] Mobile-responsive layout
- [ ] Brand colors (Pacific Dusk, Sunset Cliff, etc.)
- [ ] All form fields displayed correctly
- [ ] Links work correctly

### Confirmation Emails (to registrants)

**Recipient:** User's email address

**Should include:**
- LBTA branding
- Program name, location, duration
- "What Happens Next" section (category-specific)
- Contact information
- Footer with social links

**Check:**
- [ ] Program details are accurate
- [ ] "What Happens Next" matches program category
- [ ] Mobile-responsive layout
- [ ] All links work correctly

---

## 6. Postmark Dashboard Monitoring

### Delivery Metrics

1. Go to **Activity** → **Sent**
2. Check recent email sends:
   - Delivery rate should be >95%
   - Bounce rate should be <5%
   - Open rate (if tracking enabled)

### Bounce Handling

1. Go to **Activity** → **Bounces**
2. Review any bounces:
   - Hard bounces (invalid email) → Remove from lists
   - Soft bounces (temporary) → Monitor for patterns

### Complaint Handling

1. Go to **Activity** → **Spam Complaints**
2. Review any complaints:
   - Investigate cause
   - Update email content if needed

---

## 7. Troubleshooting

### Emails Not Sending

**Check 1: Environment Variables**
```bash
# Verify in Vercel
vercel env ls production | grep POSTMARK
```

**Check 2: Postmark Server Token**
- Verify token matches: `15dc4e0e-a75b-4444-b97a-6b4ef58d86b7`
- Check server is active in Postmark dashboard

**Check 3: Domain Verification**
- Verify DKIM and Return-Path are still verified
- Check DNS records haven't changed

**Check 4: Code Logs**
- Check Vercel function logs for Postmark errors
- Look for `[email] Postmark send failed` messages

### Emails Going to Spam

**Solutions:**
1. Verify domain reputation in Postmark
2. Check SPF/DKIM records are valid
3. Ensure sender signature matches FROM address
4. Review email content for spam triggers

### Missing Form Fields in Emails

**Check:**
1. Verify API route is passing all required fields
2. Check `lib/email.ts` field mapping
3. Review form validation schema

---

## 8. Maintenance Checklist

### Weekly
- [ ] Review Postmark dashboard for delivery issues
- [ ] Check bounce/complaint rates
- [ ] Monitor sending limits

### Monthly
- [ ] Review email delivery metrics
- [ ] Update email templates if needed
- [ ] Verify domain verification status

### Quarterly
- [ ] Review and update email content
- [ ] Check Postmark account limits
- [ ] Review bounce/complaint handling procedures

---

## Related Documentation

- **Email Module:** `lib/email.ts`
- **API Routes:** `app/api/*/route.ts`
- **Environment Variables:** `.env.example`
- **Power Stack:** `docs/power-stack.md`

---

## Support

**Postmark Support:** https://postmarkapp.com/support  
**LBTA Support:** support@lagunabeachtennisacademy.com  
**Postmark Dashboard:** https://account.postmarkapp.com

---

*Last verified: [Date]*  
*Next verification: [Date + 1 month]*
