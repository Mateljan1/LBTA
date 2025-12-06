# Multi-Domain Email Setup for All Brands

## Overview
Your Resend account now supports **5 brands** with automatic brand detection and routing:

1. **Laguna Beach Tennis Academy** (lagunabeachtennisacademy.com)
2. **Fit4Tennis** (fit4tennis.com)
3. **Tennis Beast** (tennisbeast.com)
4. **VYLO** (vylo.com)
5. **RacquetIQ** (racquetiq.com)

---

## How It Works

### 1. Automatic Brand Detection
The system automatically detects which brand to use based on the `source` field in form submissions:

```typescript
// Example form submissions:
{
  source: 'Facebook - Foundation Program'     // → Uses LBTA emails
  source: 'Fit4Tennis Instagram Campaign'     // → Uses Fit4Tennis emails
  source: 'Tennis Beast Landing Page'         // → Uses Tennis Beast emails
  source: 'VYLO Elite Program'                // → Uses VYLO emails
  source: 'RacquetIQ AI Campaign'             // → Uses RacquetIQ emails
}
```

### 2. Email Routing
Each brand sends emails from its own domain:

- **LBTA**: Sends from `noreply@lagunabeachtennisacademy.com`
  - Notifications to: `info@lagunabeachtennisacademy.com`, `andrew@lagunabeachtennisacademy.com`

- **Fit4Tennis**: Sends from `noreply@fit4tennis.com`
  - Notifications to: `andrew@fit4tennis.com`

- **Tennis Beast**: Sends from `noreply@tennisbeast.com`
  - Notifications to: `andrew@tennisbeast.com`

- **VYLO**: Sends from `noreply@vylo.com`
  - Notifications to: `andrew@vylo.com`

- **RacquetIQ**: Sends from `noreply@racquetiq.com`
  - Notifications to: `andrew@racquetiq.com`

---

## Setup Instructions

### Step 1: Verify Domains in Resend

1. Log into https://resend.com
2. Go to **Domains** → **Add Domain**
3. Add each domain:
   - `lagunabeachtennisacademy.com`
   - `fit4tennis.com`
   - `tennisbeast.com`
   - `vylo.com`
   - `racquetiq.com`

4. For each domain, add the DNS records Resend provides:
   - **SPF Record** (TXT)
   - **DKIM Records** (TXT)
   - **DMARC Record** (TXT) - optional but recommended

5. Wait for verification (usually 5-30 minutes)

### Step 2: Update Environment Variables

In `.env.local`, replace the placeholder API key:

```env
# Get this from Resend dashboard → API Keys
RESEND_API_KEY=re_your_actual_api_key_here
```

### Step 3: Customize Notification Recipients

Want different people to receive notifications for each brand?

Edit `.env.local`:

```env
# Multiple recipients - comma separated
LBTA_NOTIFICATION_EMAIL=info@lagunabeachtennisacademy.com,andrew@lagunabeachtennisacademy.com,coach@lagunabeachtennisacademy.com

FIT4TENNIS_NOTIFICATION_EMAIL=andrew@fit4tennis.com,support@fit4tennis.com

TENNISBEAST_NOTIFICATION_EMAIL=andrew@tennisbeast.com,orders@tennisbeast.com
```

---

## Using With Other Brands

### Example: Create a Fit4Tennis Landing Page

```typescript
// app/fit4tennis-trial/page.tsx
'use client'

import { useState } from 'react'

export default function Fit4TennisTrial() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const response = await fetch('/api/book', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...formData,
        programType: 'Fit4Tennis Trial',
        source: 'Fit4Tennis Landing Page', // ← Auto-detects Fit4Tennis brand!
      }),
    })

    if (response.ok) {
      // Success! Email sent from noreply@fit4tennis.com
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      {/* Your form fields */}
    </form>
  )
}
```

### Example: Tennis Beast Product Order

```typescript
const response = await fetch('/api/book', {
  method: 'POST',
  body: JSON.stringify({
    name: customerName,
    email: customerEmail,
    programType: 'Product Order',
    source: 'Tennis Beast Shopify', // ← Auto-detects Tennis Beast brand!
  }),
})

// Email automatically sent from noreply@tennisbeast.com
// Notification goes to andrew@tennisbeast.com
```

---

## Testing

### Test Each Brand

```bash
# Test LBTA
curl -X POST http://localhost:3000/api/book \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "phone": "555-1234",
    "programType": "Test",
    "source": "LBTA Test"
  }'

# Test Fit4Tennis
curl -X POST http://localhost:3000/api/book \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "phone": "555-1234",
    "programType": "Test",
    "source": "Fit4Tennis Test"
  }'
```

Check console logs:
```
Using brand config: lbta
Confirmation email sent from noreply@lagunabeachtennisacademy.com

Using brand config: fit4tennis
Confirmation email sent from noreply@fit4tennis.com
```

---

## Brand Detection Keywords

The system looks for these keywords in the `source` field:

- **Fit4Tennis**: `fit4tennis`, `f4t`
- **Tennis Beast**: `tennisbeast`, `tennis beast`
- **VYLO**: `vylo`
- **RacquetIQ**: `racquetiq`, `racquet iq`
- **Default**: Anything else defaults to LBTA

### Customize Detection

Edit `lib/email-config.ts` → `detectBrandFromSource()` function to add more keywords.

---

## Cost Savings

**Before (Mailchimp)**: $13-50/month per brand = $65-250/month total

**After (Resend)**:
- Free tier: 3,000 emails/month (all brands combined)
- Paid tier: $20/month for 50,000 emails (if needed)

**Savings**: ~$45-230/month 💰

---

## Next Steps

1. ✅ Get Resend API key
2. ✅ Verify all 5 domains in Resend
3. ✅ Update `.env.local` with API key
4. ✅ Test each brand's email routing
5. ✅ Create landing pages for other brands using same API endpoint
6. ✅ Cancel Mailchimp (optional - if not using campaigns)

---

## Need Help?

- **Resend Docs**: https://resend.com/docs
- **Domain Verification Issues**: Check DNS propagation with https://dnschecker.org
- **Multiple Recipients Not Working**: Check for extra spaces in comma-separated emails in `.env.local`
