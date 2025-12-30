# Domain Migration Guide: WordPress.com → Vercel

## ✅ Status: Domains Added to Vercel (Setup Complete)

Both domains are now configured in Vercel and ready for DNS updates:
- ✅ lagunabeachtennisacademy.com
- ✅ www.lagunabeachtennisacademy.com

**Current State:** Your WordPress.com site is still live. Nothing has changed yet.

---

## 🎯 What You Need to Do

Update DNS records in your WordPress.com account to point to Vercel.

---

## Step 1: Log Into WordPress.com

1. Go to: https://wordpress.com/log-in
2. Log in with your WordPress.com account
3. Navigate to: **My Sites** → **Domains**
4. Click on: **lagunabeachtennisacademy.com**

**Don't have access?** Check these email accounts for WordPress.com login:
- info@lagunabeachtennisacademy.com
- andrew@lagunabeachtennisacademy.com
- Any email you used for Bluehost/Unbounce

---

## Step 2: Access DNS Settings

Once you're viewing your domain in WordPress.com:

1. Click **Name Servers and DNS**
2. Click **DNS Records** (or **Manage DNS**)

You should see a list of current DNS records pointing to WordPress servers.

---

## Step 3: Update DNS Records

**⚠️ IMPORTANT: Do this during low-traffic hours (late night/early morning)**

### Records to ADD/UPDATE:

**A Record for Root Domain:**
```
Type: A
Name: @ (or leave blank, or "lagunabeachtennisacademy.com")
Value: 76.76.21.21
TTL: 3600 (or Auto)
```

**A Record for WWW:**
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
TTL: 3600 (or Auto)
```

### Records to DELETE:

**Delete these old WordPress A records:**
- 192.0.78.168
- 192.0.78.247

**Delete any CNAME records pointing to WordPress.com**

---

## Step 4: What Happens Next

**Immediate (0-5 minutes):**
- DNS changes are saved in WordPress.com
- Old site still loads for most visitors

**Within 1-24 hours:**
- DNS propagates globally
- Some visitors see new Vercel site
- Some visitors still see old WordPress site
- This is normal during DNS propagation

**After 24-48 hours:**
- All visitors worldwide see new Vercel site
- Old WordPress site no longer serves traffic
- Domain fully migrated

---

## 🔍 How to Verify It's Working

### Check DNS Propagation:

**Option 1: Command Line**
```bash
dig lagunabeachtennisacademy.com +short
```
Should show: `76.76.21.21` (Vercel's IP)

**Option 2: Online Tool**
- Go to: https://dnschecker.org
- Enter: lagunabeachtennisacademy.com
- Check: Should show 76.76.21.21 globally

### Check Site is Live:

1. Visit: https://lagunabeachtennisacademy.com
2. You should see your new Vercel site
3. Check Meta Pixel Helper (should show pixel firing)
4. Test form submissions

---

## 🚨 SEO Protection (CRITICAL!)

### Before Switching DNS, We Need 301 Redirects

**Why this matters:**
- Your WordPress site has pages that rank on Google
- New Vercel site has different URLs
- Without redirects, Google loses your rankings

**Example URLs that need redirects:**
```
OLD (WordPress):
https://lagunabeachtennisacademy.com/old-about-page
https://lagunabeachtennisacademy.com/old-programs-page

NEW (Vercel):
https://lagunabeachtennisacademy.com/ (homepage)
https://lagunabeachtennisacademy.com/beginner-program
https://lagunabeachtennisacademy.com/junior-trial
```

**We need to map all old URLs to new URLs.**

---

## 📋 Next Steps Checklist

- [ ] Log into WordPress.com
- [ ] Find DNS settings for lagunabeachtennisacademy.com
- [ ] Screenshot current DNS records (for backup)
- [ ] **WAIT:** Let me set up 301 redirects first (SEO protection)
- [ ] Update A records to point to 76.76.21.21
- [ ] Delete old WordPress IP records
- [ ] Wait 24-48 hours for DNS propagation
- [ ] Verify site loads on new Vercel infrastructure
- [ ] Submit new sitemap to Google Search Console
- [ ] Monitor rankings for 7 days

---

## 🆘 If Something Goes Wrong

### Site Goes Down:

1. **Don't panic** - DNS changes are reversible
2. Log back into WordPress.com DNS settings
3. Change A records back to old WordPress IPs:
   - 192.0.78.168
   - 192.0.78.247
4. Wait 5-10 minutes for DNS to revert

### Lost WordPress Login:

**Password Reset:**
- Go to: https://wordpress.com/log-in
- Click "Lost your password?"
- Enter email associated with domain

**Can't find email?**
- Check: andrew@lagunabeachtennisacademy.com
- Check: info@lagunabeachtennisacademy.com
- Contact WordPress.com support: https://wordpress.com/help/contact

**Still stuck?**
- WordPress.com support can verify domain ownership
- You'll need access to email @ your domain

---

## 📊 Current Configuration Summary

**Domain Registrar:** Automattic Inc. (WordPress.com)
**Current Hosting:** WordPress.com
**Current DNS:** WordPress nameservers (ns1/ns2/ns3.wordpress.com)
**Current IPs:** 192.0.78.168, 192.0.78.247

**New Hosting:** Vercel
**New IP:** 76.76.21.21
**New Site:** https://laguna-beach-tennis-academy.vercel.app (currently live)

---

## 🎯 What Happens to WordPress Site After Migration?

**WordPress.com hosting will still exist, but:**
- No traffic will go to it (DNS points to Vercel now)
- You can still access it via WordPress.com backend
- You can cancel WordPress.com hosting plan (optional)
- Keep domain registration at WordPress.com (renews Jan 26, 2026)

**Cost Savings:**
- Vercel: Free tier (or $20/month Pro if needed)
- WordPress.com: Can cancel hosting plan
- Potential savings: $10-25/month

---

## 📞 Need Help?

**DNS Issues:**
- WordPress.com Support: https://wordpress.com/help/contact
- Vercel Support: https://vercel.com/help

**Migration Questions:**
- I'm here to help! Ask me anything before making DNS changes.

---

## ⏰ Recommended Migration Timeline

**Day 1 (Today):**
- ✅ Domains added to Vercel (DONE)
- ⏸️  Set up 301 redirects (NEXT STEP - DON'T SKIP!)
- ⏸️  Test everything on .vercel.app URL

**Day 2-3:**
- Update DNS in WordPress.com
- Monitor DNS propagation
- Check site functionality

**Day 4-10:**
- Monitor Google Search Console
- Check rankings haven't dropped
- Verify all forms/tracking working

**Day 11+:**
- Consider canceling WordPress.com hosting
- Keep domain registration active

---

## 🔐 Domain Ownership

**Important:** Your domain is registered with WordPress.com, which means:
- You need WordPress.com login to manage DNS
- Domain renews January 26, 2026
- You can transfer domain to another registrar later (optional)
- Or keep it at WordPress.com and just change DNS (easier)

**Keeping domain at WordPress.com is totally fine!**
You're just changing where the DNS points (to Vercel instead of WordPress hosting).
