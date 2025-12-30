# 🚀 Racquet Rescue Deployment Checklist

## ✅ Pre-Deployment (COMPLETED)

- [x] Created `/racquet-rescue` page with luxury design
- [x] Added "Racquet Rescue" to navigation menu
- [x] Created Vercel project for domain redirect
- [x] Added racquetrescue.com and www.racquetrescue.com domains
- [x] Verified no linting errors
- [x] Mobile-responsive design (320px - 1440px+)
- [x] Accessibility compliance (WCAG 2.1 AAA)

---

## 🎯 Deployment Steps (DO THESE NOW)

### Step 1: Deploy to Production (5 minutes)

```bash
# Navigate to project
cd /Users/andrew-mac-studio/LBTA\ Build\ 12:16/LBTA

# Check git status
git status

# Stage all changes
git add .

# Commit with descriptive message
git commit -m "Add Racquet Rescue service page

- Add Racquet Rescue to main navigation
- Create /racquet-rescue page with full service showcase
- Include pricing for all services ($25-$50+)
- Add booking form (ready for ActiveCampaign)
- Mobile-responsive luxury design
- Location and hours information"

# Push to production
git push origin main
```

**Expected Result:**
- Vercel will automatically deploy
- Page will be live in 2-3 minutes
- Visit: https://lagunabeachtennisacademy.com/racquet-rescue

---

### Step 2: Configure GoDaddy DNS (10 minutes)

#### A. Log into GoDaddy
1. Go to: https://dcc.godaddy.com/
2. Navigate to: **My Products** → **Domains**
3. Find **racquetrescue.com**
4. Click **DNS** or **Manage DNS**

#### B. Add DNS Records

**Record 1: Root Domain**
```
Type:  A
Name:  @
Value: 76.76.21.21
TTL:   600
```

**Record 2: WWW Subdomain**
```
Type:  CNAME
Name:  www
Value: cname.vercel-dns.com
TTL:   600
```

#### C. Remove Conflicts
- Delete any existing A records for `@`
- Delete any existing CNAME records for `www`
- Remove GoDaddy parking page records

#### D. Save & Wait
- Save changes
- Wait 10-60 minutes for DNS propagation

---

### Step 3: Configure Vercel Redirects (5 minutes)

After DNS is verified:

1. Go to: https://vercel.com/andrew-mateljans-projects/racquet-rescue/settings/domains

2. For **racquetrescue.com:**
   - Click domain name
   - Under "Redirect to", enter: `lagunabeachtennisacademy.com/racquet-rescue`
   - Enable "Permanent Redirect (308)"
   - Save

3. For **www.racquetrescue.com:**
   - Click domain name
   - Under "Redirect to", enter: `lagunabeachtennisacademy.com/racquet-rescue`
   - Enable "Permanent Redirect (308)"
   - Save

---

## 🧪 Testing Checklist

### Test on LBTA Website
- [ ] Visit: https://lagunabeachtennisacademy.com
- [ ] Click "Racquet Rescue" in navigation
- [ ] Page loads correctly
- [ ] All sections visible (Hero, Services, Pricing, Booking, Location)
- [ ] Images load (hero background, logo)
- [ ] Buttons work ("Book Service", "Contact Us")
- [ ] Form fields are accessible
- [ ] Mobile menu includes "Racquet Rescue"

### Test on Mobile
- [ ] Open on iPhone (Safari)
- [ ] Open on Android (Chrome)
- [ ] Navigation menu works
- [ ] All sections stack correctly
- [ ] Touch targets are 48px minimum
- [ ] No horizontal scroll

### Test Domain Redirects (After DNS Setup)
- [ ] Visit: http://racquetrescue.com
- [ ] Redirects to: https://lagunabeachtennisacademy.com/racquet-rescue
- [ ] Visit: http://www.racquetrescue.com
- [ ] Redirects to: https://lagunabeachtennisacademy.com/racquet-rescue
- [ ] SSL certificate active (HTTPS)
- [ ] No certificate warnings

### Test DNS Propagation
```bash
# Check if DNS is live
nslookup racquetrescue.com
# Should show: 76.76.21.21

nslookup www.racquetrescue.com
# Should show: cname.vercel-dns.com

# Check from different locations
# Use: https://www.whatsmydns.net/#A/racquetrescue.com
```

---

## 📊 Verification Steps

### 1. LBTA Website Deployment
- [ ] Vercel deployment successful
- [ ] No build errors
- [ ] Page accessible at `/racquet-rescue`
- [ ] Navigation updated

### 2. DNS Configuration
- [ ] GoDaddy records added
- [ ] Old records removed
- [ ] DNS propagated (10-60 minutes)
- [ ] Vercel shows green checkmarks

### 3. Domain Redirects
- [ ] racquetrescue.com → LBTA page
- [ ] www.racquetrescue.com → LBTA page
- [ ] SSL certificates active
- [ ] No redirect loops

### 4. Functionality
- [ ] All links work
- [ ] Form fields accessible
- [ ] Images load
- [ ] Mobile responsive
- [ ] Fast page load (< 3 seconds)

---

## 🐛 Troubleshooting

### Problem: Page not found (404)
**Solution:**
- Check deployment status in Vercel
- Verify file exists: `/app/racquet-rescue/page.tsx`
- Clear browser cache
- Try incognito mode

### Problem: Domain not redirecting
**Solution:**
- DNS not propagated yet (wait longer)
- Check DNS records in GoDaddy
- Verify Vercel redirect configuration
- Clear DNS cache: `sudo dscacheutil -flushcache` (Mac)

### Problem: SSL certificate error
**Solution:**
- Vercel provisions SSL automatically
- Wait 10-30 minutes after DNS verification
- Check Vercel domain settings
- Ensure DNS is correctly configured

### Problem: Form not submitting
**Solution:**
- ActiveCampaign not yet integrated (expected)
- This is the next step after deployment
- Form UI is complete, just needs backend connection

---

## 📞 Support Contacts

### GoDaddy Support
- **Phone:** 480-505-8877
- **Chat:** Available in dashboard
- **Help:** https://www.godaddy.com/help

### Vercel Support
- **Dashboard:** https://vercel.com/support
- **Docs:** https://vercel.com/docs
- **Status:** https://vercel-status.com

### ActiveCampaign
- **Your Account:** (existing LBTA account)
- **Support:** https://www.activecampaign.com/support

---

## 🎯 Success Criteria

You'll know everything is working when:

1. ✅ https://lagunabeachtennisacademy.com/racquet-rescue loads
2. ✅ "Racquet Rescue" appears in navigation menu
3. ✅ All sections display correctly
4. ✅ Page is mobile-responsive
5. ✅ http://racquetrescue.com redirects to LBTA page
6. ✅ http://www.racquetrescue.com redirects to LBTA page
7. ✅ SSL certificates active (HTTPS)
8. ✅ No console errors in browser

---

## 📈 Next Steps After Deployment

### Immediate (Within 24 Hours)
1. Test all functionality
2. Verify redirects work
3. Check mobile experience
4. Share with team for feedback

### Short-term (This Week)
1. Integrate ActiveCampaign form
2. Add real photos of stringing services
3. Set up email notifications for bookings
4. Create social media posts announcing service

### Long-term (This Month)
1. Add customer testimonials
2. Create "String of the Month" feature
3. Implement online payment (optional)
4. Track analytics and conversions

---

## 📄 Documentation

All documentation is in your project:

- `RACQUET_RESCUE_FINAL_SUMMARY.md` - Complete overview
- `RACQUET_RESCUE_SETUP.md` - Technical details
- `GODADDY_DNS_SETUP.md` - DNS configuration guide
- `DEPLOYMENT_CHECKLIST.md` - This file

---

## ⏱️ Estimated Timeline

| Task | Time | Status |
|------|------|--------|
| Deploy LBTA updates | 5 min | ⏳ Ready |
| Configure GoDaddy DNS | 10 min | ⏳ Ready |
| Wait for DNS propagation | 10-60 min | ⏳ Pending |
| Configure Vercel redirects | 5 min | ⏳ Ready |
| Test everything | 10 min | ⏳ After deployment |
| **Total** | **40-80 min** | |

---

**Status:** ✅ Ready for deployment
**Created:** December 24, 2025
**Last Updated:** December 24, 2025

---

**🎾 Let's Launch Racquet Rescue! 🎾**

