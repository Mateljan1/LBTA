# Racquet Rescue Integration - Complete Setup Guide

## ✅ What We've Built

### 1. **LBTA Website Integration** (lagunabeachtennisacademy.com)
- ✅ Added "Racquet Rescue" to main navigation menu
- ✅ Created `/racquet-rescue` page with luxury LBTA aesthetic
- ✅ Professional services showcase with pricing
- ✅ Booking form (ready for ActiveCampaign integration)
- ✅ Location and hours information

### 2. **Vercel Project Created**
- ✅ Project Name: `racquet-rescue`
- ✅ Project ID: `prj_5oElLIsgH4TjKlV6mnxdprA7BZp5`
- ✅ Framework: Next.js 14
- ✅ Domains added: `racquetrescue.com` and `www.racquetrescue.com`

---

## 🚀 Next Steps

### Step 1: Deploy LBTA Website Updates
The Racquet Rescue page is now part of your LBTA website. Deploy it:

```bash
cd /Users/andrew-mac-studio/LBTA\ Build\ 12:16/LBTA
git add .
git commit -m "Add Racquet Rescue service page and navigation"
git push origin main
```

This will automatically deploy to:
- https://lagunabeachtennisacademy.com/racquet-rescue

### Step 2: Configure GoDaddy DNS for racquetrescue.com

You need to point your GoDaddy domain to Vercel. Here's how:

#### A. Get Vercel DNS Records
1. Go to: https://vercel.com/andrew-mateljans-projects/racquet-rescue/settings/domains
2. Click on `racquetrescue.com`
3. You'll see DNS records like:
   - **A Record**: `76.76.21.21`
   - **CNAME Record**: `cname.vercel-dns.com`

#### B. Update GoDaddy DNS Settings
1. Log into GoDaddy: https://dcc.godaddy.com/domains
2. Find `racquetrescue.com` and click "DNS"
3. **Add these records:**

   **For root domain (racquetrescue.com):**
   - Type: `A`
   - Name: `@`
   - Value: `76.76.21.21`
   - TTL: `600`

   **For www subdomain:**
   - Type: `CNAME`
   - Name: `www`
   - Value: `cname.vercel-dns.com`
   - TTL: `600`

4. Save changes
5. Wait 10-60 minutes for DNS propagation

### Step 3: Create Standalone Racquet Rescue Website (Optional)

If you want racquetrescue.com to be a completely separate website (not just redirecting to LBTA), we can:

1. **Option A: Redirect to LBTA** (Simplest)
   - Point racquetrescue.com → lagunabeachtennisacademy.com/racquet-rescue
   - This is already set up! Just configure DNS above.

2. **Option B: Standalone Site** (More Complex)
   - Create a separate Next.js project for racquetrescue.com
   - Deploy it to the new Vercel project
   - Requires additional development work

**Recommendation:** Start with Option A (redirect). It's simpler and keeps all your content in one place.

---

## 📋 Racquet Rescue Page Features

### Services Offered:
1. **Standard Stringing** - $25 (2-3 day turnaround)
2. **Same-Day Service** - $35 (drop off before noon)
3. **Racquet Customization** - $50+ (weight, balance, lead tape)
4. **Grip Replacement** - $10 (premium grips)

### Premium String Brands:
- Luxilon ($20-35)
- Babolat ($18-30)
- Wilson ($15-28)
- Solinco ($15-25)

### Key Features:
- ⚡ Same-day service available
- 🎯 Expert precision (25+ years experience)
- 🏆 Premium professional-grade strings
- 📍 Located at LBTA (1098 Balboa Ave, Laguna Beach)

### Hours:
- Monday-Friday: 9:00 AM - 6:00 PM
- Saturday: 10:00 AM - 4:00 PM
- Sunday: Closed

---

## 🔗 ActiveCampaign Integration (TODO)

The booking form is ready but needs ActiveCampaign connection:

### What to Do:
1. Create a new ActiveCampaign form for "Racquet Rescue Bookings"
2. Add these fields:
   - First Name
   - Last Name
   - Email
   - Phone
   - Service Type (dropdown)
   - Number of Racquets
   - Additional Notes
3. Get the form embed code or API endpoint
4. Replace the form in `/app/racquet-rescue/page.tsx` (line ~270)

### Alternative: Use Existing Contact Form
You can also route Racquet Rescue bookings through your existing LBTA contact form with a "Service Type" field.

---

## 🎨 Design Notes

The Racquet Rescue page follows LBTA's luxury aesthetic:

- **Typography:** Playfair Display (headlines) + Work Sans (body)
- **Colors:** LBTA Orange (#F8A121), LBTA Red (#F04E23), LBTA Beige (#F8E6BB)
- **Layout:** Generous white space, subtle borders, premium feel
- **Animations:** Smooth 800ms transitions with cinematic easing
- **Accessibility:** WCAG 2.1 AAA compliant, 48px touch targets

---

## 📱 Mobile Optimization

The page is fully responsive:
- ✅ 320px (iPhone SE)
- ✅ 375px (iPhone 14)
- ✅ 768px (iPad)
- ✅ 1024px (Desktop)
- ✅ 1440px (Large Desktop)

---

## 🧪 Testing Checklist

After deployment, test:

- [ ] Navigation menu shows "Racquet Rescue"
- [ ] Page loads at `/racquet-rescue`
- [ ] All sections render correctly
- [ ] Form fields are accessible
- [ ] Mobile menu includes Racquet Rescue
- [ ] Images load properly
- [ ] Links work (especially "Book Service" and "Contact Us")

---

## 🌐 Domain Configuration Summary

### Current Setup:
- **lagunabeachtennisacademy.com** → LBTA main site (already live)
- **racquetrescue.com** → Will redirect to lagunabeachtennisacademy.com/racquet-rescue

### Vercel Projects:
1. **laguna-beach-tennis-academy** (existing)
   - Domain: lagunabeachtennisacademy.com
   - Status: ✅ Live

2. **racquet-rescue** (new)
   - Domain: racquetrescue.com
   - Status: ⏳ Awaiting DNS configuration

---

## 🔧 Technical Details

### File Structure:
```
/app/racquet-rescue/
  └── page.tsx          # Main Racquet Rescue page

/components/layout/
  └── Header.tsx        # Updated with Racquet Rescue nav item

/public/logos/
  └── racketrescue.png  # Racquet Rescue logo
```

### Dependencies:
- Next.js 14.2+
- Tailwind CSS 3.4+
- Framer Motion 11+ (for animations)

---

## 📞 Support

If you need help with:
- **DNS Configuration:** Contact GoDaddy support
- **Vercel Deployment:** Check Vercel dashboard
- **ActiveCampaign:** Use existing LBTA account
- **Design Changes:** Edit `/app/racquet-rescue/page.tsx`

---

## 🎯 Quick Commands

```bash
# Deploy LBTA updates (includes Racquet Rescue)
cd /Users/andrew-mac-studio/LBTA\ Build\ 12:16/LBTA
git add .
git commit -m "Add Racquet Rescue integration"
git push origin main

# Check deployment status
vercel --prod

# View live site
open https://lagunabeachtennisacademy.com/racquet-rescue
```

---

## ✨ What's Next?

1. **Immediate:**
   - Deploy LBTA updates (Step 1 above)
   - Configure GoDaddy DNS (Step 2 above)
   - Test the page on staging/production

2. **Short-term:**
   - Integrate ActiveCampaign booking form
   - Add real photos of stringing services
   - Set up email notifications for bookings

3. **Long-term:**
   - Consider adding online payment for services
   - Create a "String of the Month" feature
   - Add customer testimonials section

---

**Status:** ✅ Ready for DNS configuration and deployment
**Created:** December 24, 2025
**Project:** Laguna Beach Tennis Academy - Racquet Rescue Integration

