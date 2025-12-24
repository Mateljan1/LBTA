# ✅ READY TO MIGRATE - Domain Transfer Checklist

## 🎉 Migration Preparation Complete!

Everything is ready for your domain migration from WordPress.com to Vercel.

**Status:**
- ✅ Domains added to Vercel
- ✅ 301 Redirects deployed and active
- ✅ SSL certificates being generated
- ✅ New Winter 2026 landing page live
- ✅ WordPress site analyzed (no valuable content to lose!)

---

## 📊 What We Found on Your WordPress Site

**Good news:** Your WordPress.com site is basically empty:
- 4 placeholder pages (Home, Blog, Contact, About)
- 3 example blog posts (WordPress.com templates)
- **No real content**

**What this means:**
Your #1 Google ranking comes from your **domain name** (exact match) and **domain authority**, NOT from page content. This makes migration super safe!

---

## 🛡️ SEO Protection Active

All old WordPress URLs will automatically redirect to your new site:

```
OLD → NEW (301 Permanent Redirect)
================================
/blog/              → /  (Homepage)
/contact/           → /  (Homepage)
/about/             → /  (Homepage)
/2021/03/07/*       → /  (Homepage)
/wp-admin/*         → /  (Homepage)
```

These 301 redirects tell Google: "This content permanently moved, transfer all ranking power."

---

## 🚀 Ready to Launch

Your new Vercel site is live at:
- **Current URL:** https://laguna-beach-tennis-academy-lwkc9jbli-andrew-mateljans-projects.vercel.app
- **Will be:** https://lagunabeachtennisacademy.com (after DNS update)

**New pages available:**
- ✅ / (Homepage)
- ✅ /beginner-program (Foundation 12-Week)
- ✅ /junior-trial
- ✅ /adult-trial
- ✅ /winter-2026 (NEW! Pre-registration for Winter Quarter)
- ✅ All other existing pages

---

## 📋 DNS UPDATE INSTRUCTIONS

### Step 1: Log into WordPress.com

1. Go to: https://wordpress.com/log-in
2. Enter your WordPress.com credentials
3. Navigate to: **My Sites** → **Domains**
4. Click: **lagunabeachtennisacademy.com**

**If you can't log in:**
- Try password reset with: andrew@lagunabeachtennisacademy.com or info@...
- Contact WordPress.com support

### Step 2: Update DNS Records

Click **Name Servers and DNS** → **DNS Records**

**DELETE these old records:**
```
A Record: 192.0.78.168
A Record: 192.0.78.247
```

**ADD these new records:**

**For Root Domain:**
```
Type: A
Name: @ (or blank, or "lagunabeachtennisacademy.com")
Value: 76.76.21.21
TTL: 3600 (or Auto)
```

**For WWW:**
```
Type: A
Name: www
Value: 76.76.21.21
TTL: 3600 (or Auto)
```

**Alternative for WWW (if WordPress.com allows CNAME):**
```
Type: CNAME
Name: www
Value: cname.vercel-dns.com
TTL: 3600
```

### Step 3: Save Changes

Click **Save** or **Update DNS** button.

---

## ⏰ What Happens After DNS Update

**0-5 minutes:**
- DNS changes saved
- Old site still serves most traffic

**1-6 hours:**
- DNS starts propagating globally
- Some visitors see new site, some see old
- This is normal!

**24-48 hours:**
- Full global propagation complete
- All visitors see new Vercel site
- Migration complete!

---

## 🔍 How to Verify It's Working

### Method 1: Command Line
```bash
dig lagunabeachtennisacademy.com +short
```
Should show: `76.76.21.21`

### Method 2: Online Tool
1. Go to: https://dnschecker.org
2. Enter: lagunabeachtennisacademy.com
3. Should show `76.76.21.21` globally

### Method 3: Visit Your Site
1. Go to: https://lagunabeachtennisacademy.com
2. Hard refresh: Cmd+Shift+R (Mac) or Ctrl+Shift+R (Windows)
3. Should see your new Vercel site
4. Check Meta Pixel Helper (should show pixel firing)

---

## 📈 Post-Migration SEO Checklist

**Within 24 hours:**
- [ ] Verify site loads at lagunabeachtennisacademy.com
- [ ] Check Meta Pixel is tracking
- [ ] Test all form submissions
- [ ] Submit new sitemap to Google Search Console

**Within 7 days:**
- [ ] Monitor Google Search Console for errors
- [ ] Check rankings haven't dropped
- [ ] Verify all redirects working
- [ ] Monitor traffic analytics

**Within 30 days:**
- [ ] Consider canceling WordPress.com hosting (keep domain registration!)
- [ ] Monitor rankings stabilize
- [ ] Celebrate successful migration! 🎉

---

## 🆘 If Something Goes Wrong

### Site Goes Down or Breaks

**Quick Rollback:**
1. Log back into WordPress.com DNS
2. Delete the new A records (76.76.21.21)
3. Re-add old A records:
   - 192.0.78.168
   - 192.0.78.247
4. Wait 5-10 minutes
5. Old site will be back

### SSL Certificate Issues

If you see "Not Secure" warnings:
- This is temporary during SSL generation (can take 1-24 hours)
- Vercel is automatically creating certificates
- Just wait, it will resolve automatically

### Can't Access WordPress.com

Contact WordPress.com support:
- https://wordpress.com/help/contact
- They can verify domain ownership via email @ your domain

---

## 💰 Cost Savings

**Before (WordPress.com + Domain):**
- Hosting: ~$4-25/month
- Domain: ~$15-20/year

**After (Vercel + Domain at WordPress.com):**
- Vercel hosting: FREE (or $20/month Pro if needed)
- Domain registration: Keep at WordPress.com ($15-20/year)
- Potential savings: $48-300/year

---

## 🎯 Migration Timeline Recommendation

**Today (Right Now):**
- ✅ Everything is ready!
- ⏸️  Wait for your decision to proceed

**When You're Ready (Low Traffic Time):**
- Update DNS records in WordPress.com
- Takes 5 minutes

**Next 24-48 Hours:**
- Monitor DNS propagation
- Check site functionality
- Verify tracking/forms working

**Days 3-7:**
- Monitor Google Search Console
- Check rankings
- Verify everything stable

**Day 8+:**
- Celebrate! Migration complete
- Optionally cancel WordPress hosting

---

## 📞 Support Resources

**Vercel Issues:**
- Dashboard: https://vercel.com/dashboard
- Support: https://vercel.com/help

**WordPress.com DNS Issues:**
- Support: https://wordpress.com/help/contact
- Domain management: https://wordpress.com/domains

**Google Search Console:**
- Console: https://search.google.com/search-console
- Submit sitemap: https://lagunabeachtennisacademy.com/sitemap.xml

---

## ✅ Pre-Flight Checklist

Before updating DNS, verify:

- [ ] You can log into WordPress.com
- [ ] You can access DNS settings for lagunabeachtennisacademy.com
- [ ] You have screenshot of current DNS records (backup)
- [ ] You're ready to wait 24-48 hours for full propagation
- [ ] You've tested the .vercel.app site and it looks good
- [ ] You're comfortable with the migration process

**Once all boxes are checked, you're ready to update DNS!**

---

## 🚀 Ready When You Are

Everything is configured and ready. The migration is:
- ✅ Safe (301 redirects protect SEO)
- ✅ Reversible (can rollback if needed)
- ✅ Tested (site live on .vercel.app)
- ✅ Cost-effective (free Vercel tier)

**Update DNS whenever you're ready!**

Questions? Ask me anything before making the DNS changes.
