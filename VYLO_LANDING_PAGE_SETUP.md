# VYLO Landing Page Setup Guide

## Overview
A high-converting, standalone landing page for VYLO Facebook ads campaign. Completely separate from the main LBTA site.

## Landing Page URL
**Production:** `https://lagunabeachtennisacademy.com/vylo-apply`
**Local:** `http://localhost:3000/vylo-apply`

## Features
✅ Conversion-optimized design matching Instagram bio language
✅ Lead capture form (First Name, Last Name, Email, Phone, Player UTR)
✅ ActiveCampaign integration with automatic tagging
✅ Success message with confirmation
✅ Mobile-responsive, clean, minimal design
✅ Hidden from site navigation (perfect for ads)
✅ SEO metadata optimized for Facebook ads

## Facebook Ads Setup

### 1. Landing Page URL
Use this URL in your Facebook ads:
```
https://apply.vylo.tennis
```

### 2. Recommended Ad Copy (Matches Landing Page)
**Primary Text:**
```
We don't train tennis players. We build pros who can win under lights.

Pressure. Capacity. Results.
Roster capped. Entry earned.

VYLO Performance Institute — Founding Cohort January 2026
Ten positions. Laguna Beach, California.
```

**Headline:**
- "Apply to VYLO Performance Institute"
- "Elite Tennis Development | Jan 2026"
- "Ten Athletes. One Trajectory."

**Description:**
- "UTR 9.0+ | Full-time commitment | Laguna Beach"
- "30+ Division I placements. ATP/WTA coaching."

### 3. Facebook Pixel Tracking
The page is ready for Facebook Pixel. Add your pixel code to:
```
/app/vylo-apply/layout.tsx
```

Example:
```tsx
export default function VYLOApplyLayout({ children }) {
  return (
    <>
      {/* Facebook Pixel */}
      <script
        dangerouslySetInnerHTML={{
          __html: `
            !function(f,b,e,v,n,t,s)
            {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
            n.callMethod.apply(n,arguments):n.queue.push(arguments)};
            if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
            n.queue=[];t=b.createElement(e);t.async=!0;
            t.src=v;s=b.getElementsByTagName(e)[0];
            s.parentNode.insertBefore(t,s)}(window, document,'script',
            'https://connect.facebook.net/en_US/fbevents.js');
            fbq('init', 'YOUR_PIXEL_ID');
            fbq('track', 'PageView');
          `,
        }}
      />
      {children}
    </>
  )
}
```

### 4. Track Form Submissions
The form automatically sends a "Lead" event when submitted. To track in Facebook:

Add to `/app/vylo-apply/page.tsx` after successful submission (line 37):
```tsx
// Track Facebook conversion
if (typeof window !== 'undefined' && (window as any).fbq) {
  (window as any).fbq('track', 'Lead', {
    content_name: 'VYLO Founding Cohort',
    value: 0,
    currency: 'USD',
  })
}
```

## ActiveCampaign Integration

### Current Setup
✅ Automatically creates/updates contacts
✅ Adds tag: "VYLO - Founding Cohort Interest"
✅ Captures: First Name, Last Name, Email, Phone, Player UTR

### Required Environment Variables
Make sure these are set in your `.env.local`:
```
ACTIVE_CAMPAIGN_API_URL=https://youraccounthere.api-us1.com
ACTIVE_CAMPAIGN_API_KEY=your_api_key_here
```

### Custom Field Setup (Optional)
To track Player UTR in ActiveCampaign:

1. Go to ActiveCampaign → Settings → Fields
2. Create new field: "Player UTR"
3. Get the field ID (it will look like a number, e.g., "5")
4. Update `/app/api/vylo-apply/route.ts` line 23:
   ```tsx
   field: '5', // Replace with your actual UTR field ID
   ```

### Add to Email List (Optional)
To automatically add leads to a specific list:

1. Create a list in ActiveCampaign: "VYLO - Founding Cohort"
2. Get the list ID
3. Uncomment lines 76-89 in `/app/api/vylo-apply/route.ts`
4. Replace `YOUR_VYLO_LIST_ID` with your actual list ID

## Automation Workflow (Recommended)

### Suggested ActiveCampaign Automation:
1. **Trigger:** Contact is tagged with "VYLO - Founding Cohort Interest"
2. **Wait:** 5 minutes
3. **Send Email:** "Welcome to VYLO - Next Steps"
4. **Wait:** 2 days
5. **Send Email:** "Your VYLO Journey Begins Here"
6. **Wait:** 3 days
7. **Send Email:** "Meet the Co-Founders" (Andrew & Kevin)
8. **Wait:** 5 days
9. **Send Email:** "VYLO Application Process"

## Testing Before Launch

### Local Testing
```bash
cd "Cursor Base 44 Audit_Upgrade"
npm run dev
```
Visit: `http://localhost:3000/vylo-apply`

### Test Form Submission
1. Fill out the form with test data
2. Check ActiveCampaign for new contact
3. Verify tag was added: "VYLO - Founding Cohort Interest"
4. Check email automation triggered

## DNS Configuration for apply.vylo.tennis

To use the subdomain `apply.vylo.tennis`, you need to configure DNS settings:

### Option 1: Deploy to Vercel (Recommended)
1. Deploy the LBTA site to Vercel
2. In Vercel Dashboard → Domains → Add `apply.vylo.tennis`
3. Vercel will provide DNS records to add to your domain registrar
4. Add the CNAME record to your vylo.tennis DNS:
   ```
   Type: CNAME
   Name: apply
   Value: cname.vercel-dns.com
   ```

### Option 2: Custom Hosting
If hosting elsewhere, point the subdomain to your server's IP:
```
Type: A
Name: apply
Value: YOUR_SERVER_IP
```

**DNS Propagation:** Changes can take 1-48 hours to propagate globally.

## Launch Checklist

- [ ] DNS configured for apply.vylo.tennis subdomain
- [ ] Environment variables set (ACTIVE_CAMPAIGN_API_URL, ACTIVE_CAMPAIGN_API_KEY)
- [ ] Custom field for Player UTR created in ActiveCampaign (optional)
- [ ] Email automation workflow created in ActiveCampaign
- [ ] Facebook Pixel installed (if tracking conversions)
- [ ] Test form submission works
- [ ] Verify email automation sends
- [ ] Test on mobile devices
- [ ] Deploy to production
- [ ] Test production URL: https://apply.vylo.tennis
- [ ] Launch Facebook ad campaign

## Facebook Ads Best Practices

### Targeting Suggestions
- **Age:** 35-55 (parents of junior players)
- **Location:** 50-mile radius of Laguna Beach, CA + nationwide
- **Interests:**
  - Tennis
  - Junior tennis
  - USTA
  - College tennis recruiting
  - Athletic development
  - Elite sports academies

### Budget Recommendation
- Start: $50-100/day
- Monitor Cost Per Lead (CPL)
- Target CPL: $15-25 for qualified tennis leads

### A/B Testing
Create 3-4 ad variations testing:
- Different hero images (court, player training, facility)
- Headline variations ("Apply Now" vs "Register Interest" vs "Join Founding Cohort")
- Copy length (short vs long)

## Support
Questions? Email: support@lagunabeachtennisacademy.com

---

**Files Created:**
- `/app/vylo-apply/page.tsx` - Main landing page
- `/app/vylo-apply/layout.tsx` - Metadata & SEO
- `/app/api/vylo-apply/route.ts` - Form submission API
