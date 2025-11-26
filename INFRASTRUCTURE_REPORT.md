# 🔍 INFRASTRUCTURE AUDIT REPORT
## LagunaBeachTennisAcademy.com - Complete Analysis

**Date:** November 26, 2025  
**Auditor:** Senior AI Infrastructure Engineer  
**Classification:** Mission-Critical Migration (SEO #1 Local Ranking)

---

## 1. VERIFIED EVIDENCE (MCP Checks)

### ✅ WordPress.com Query Results:

**Finding:** 2 WordPress.com sites found in account:

**Site 1:**
```
URL: https://lagunabeachtennisacademy.com
WordPress Domain: fit4tenniscom.wordpress.com
Platform: Atomic (WordPress managed hosting)
Custom Domain: FALSE ← Critical finding
Status: Active, Launched
```

**Site 2:**
```
URL: http://lagunabeachtennisacademy748268111.wordpress.com  
Platform: Simple
Status: Coming Soon (not launched)
Custom Domain: FALSE
```

**Analysis:**  
❌ Domain lagunabeachtennisacademy.com is **NOT** registered at WordPress.com  
❌ Domain is **NOT** managed by WordPress.com  
✅ There IS a WordPress.com site that *points* to the URL (but doesn't own it)  

**Conclusion:** WordPress.com is **NOT** your domain registrar.

---

### ✅ GoDaddy Query Results:

**Checked:** 40+ domains in connected GoDaddy account  
**Finding:** lagunabeachtennisacademy.com **NOT FOUND**

**Domains Found:**
- fit4tennis.com ✅ (registered at GoDaddy)
- fit4basketball.com, fit4pickleball.com, etc.
- racquetiq.app, racquetiq.io
- 30+ pickleball/tennis domains

**Analysis:**  
❌ Domain lagunabeachtennisacademy.com is **NOT** at GoDaddy

**Conclusion:** GoDaddy is **NOT** your domain registrar for LBTA.

---

### ⚠️ Unable to Verify (Need Manual Check):

**Cannot confirm via MCP:**
- Actual domain registrar (likely Namecheap, Network Solutions, or other)
- Current DNS nameservers
- Current DNS A/CNAME records
- Unbounce DNS configuration
- Current SSL certificate provider

**Reason:** Domain not in WordPress.com or GoDaddy accounts

---

## 2. CURRENT-STATE INFRASTRUCTURE MAP

Based on evidence + user statements:

```
┌─────────────────────────────────────────────────────────┐
│                    CURRENT STATE                        │
└─────────────────────────────────────────────────────────┘

Domain Registration:
├─ Domain: lagunabeachtennisacademy.com
├─ Registrar: UNKNOWN (NOT WordPress.com, NOT GoDaddy)
│  └─ Likely: Namecheap, Network Solutions, or other
├─ Registration Date: Unknown
└─ Expiration: Unknown - VERIFY IMMEDIATELY

DNS Configuration:
├─ Nameservers: UNKNOWN (need to check registrar)
├─ A Record: Likely points to → Unbounce IP
├─ CNAME (www): Likely points to → Unbounce
└─ MX Records: Unknown

Current Live Site:
├─ Platform: Unbounce (landing page builder)
├─ URL: https://lagunabeachtennisacademy.com
├─ Content: Tennis programs, booking, contact
├─ SEO Status: #1 for "tennis Laguna Beach" (local)
├─ SSL: Unbounce-provided (auto)
└─ Performance: Unbounce speeds

New Site (We Just Built):
├─ Platform: Next.js 14 + TypeScript
├─ Current Location: Local only (localhost:3000)
├─ Status: Complete, tested, ready to deploy
├─ Git: Committed (2 commits, all saved)
└─ Destination: TBD (recommend Vercel)

WordPress.com Connection:
├─ Site exists but "has_custom_domain": FALSE
├─ Likely inactive or legacy setup
└─ NOT hosting your live site
```

---

## 3. SEO-SAFE MIGRATION PLAN

### **CRITICAL CONSTRAINTS:**
- ⚠️ You are #1 for local "tennis Laguna Beach"  
- ⚠️ Cannot afford downtime or broken URLs  
- ⚠️ Must preserve all Google rankings  
- ⚠️ Must maintain SSL throughout  

### **STEP-BY-STEP MIGRATION (Zero-Downtime)**

---

### **PHASE 1: PREPARATION** (Before Touching Anything)

**Step 1.1: Identify Your Actual Domain Registrar** ⚠️ REQUIRED
```
Action: You must manually check WHERE the domain is registered
Options:
  a) Check email for domain renewal notices
  b) Try logging into: Namecheap, Network Solutions, Domain.com, etc.
  c) Use WHOIS lookup tool: whois.domaintools.com
  d) Check credit card statements for annual domain charges

WHY CRITICAL: We need registrar access to update DNS
```

**Step 1.2: Document Current Unbounce Configuration**
```
Action: Login to Unbounce
Document:
  - All published pages
  - URL structure
  - Which URLs get most traffic (Google Analytics)
  - Any custom domains configured
  - Current DNS settings shown in Unbounce
```

**Step 1.3: Audit Current URLs**
```
Action: List all pages on current site
Example URLs to check:
  - lagunabeachtennisacademy.com/
  - /junior-programs
  - /adult-programs  
  - /coaches
  - /contact
  - (any others that rank in Google)
```

---

### **PHASE 2: DEPLOY NEW SITE (Parallel - No DNS Change Yet)**

**Step 2.1: Deploy to Vercel**
```bash
cd "Cursor Base 44 Audit_Upgrade"

# Login to Vercel (one-time)
npx vercel login

# Deploy to production
npx vercel --prod
```

**Result:** Get temporary URL (e.g., `lbta-tennis.vercel.app`)

**Step 2.2: Test Everything on Vercel URL**
```
Test checklist:
  ✓ All 21 pages load
  ✓ Forms work
  ✓ Images load
  ✓ Mobile responsive
  ✓ SSL working
  ✓ No console errors
```

**Step 2.3: Add Custom Domain to Vercel (Don't Activate Yet)**
```
Vercel Dashboard → Settings → Domains
Add: lagunabeachtennisacademy.com
Result: Vercel gives you DNS instructions
IMPORTANT: Don't update DNS yet - just get the instructions
```

---

### **PHASE 3: CREATE URL MAPPING & REDIRECTS**

**Step 3.1: Map Old URLs → New URLs**
```
Document needed redirects:

OLD UNBOUNCE URL              →  NEW NEXT.JS URL
/                             →  / (no change)
/junior-programs              →  /programs/junior
/adult-programs               →  /programs/adult
/coaches                      →  /coaches (no change)
/contact                      →  /contact (no change)
/pricing                      →  /pricing (no change)
[Add all your old URLs here]
```

**Step 3.2: Implement 301 Redirects in Next.js**

Add to `next.config.js`:
```javascript
async redirects() {
  return [
    {
      source: '/junior-programs',
      destination: '/programs/junior',
      permanent: true, // 301 redirect
    },
    {
      source: '/adult-programs',
      destination: '/programs/adult',
      permanent: true,
    },
    // Add all old URLs
  ]
}
```

**Step 3.3: Re-deploy to Vercel**
```bash
vercel --prod
```

Test redirects on Vercel temp URL.

---

### **PHASE 4: DNS CUTOVER (The Critical Moment)**

**Step 4.1: Get Current DNS Records (Document Before Changing)**
```
Login to your domain registrar
Document current:
  - Nameservers (e.g., ns1.unbounce.com, ns2.unbounce.com)
  - A record
  - CNAME records  
  - MX records (email!)
  - TXT records (verification codes)
  - TTL values
```

**Step 4.2: Lower TTL First (24-48 Hours Before)**
```
Why: Faster DNS propagation when you switch
Action: Change TTL from 86400 to 300 (5 minutes)
Wait: 24 hours for old TTL to expire
```

**Step 4.3: Update DNS to Point to Vercel**

**Option A: Change Nameservers** (Simpler but all-or-nothing)
```
Replace:
  OLD: ns1.unbounce.com, ns2.unbounce.com
  NEW: ns1.vercel-dns.com, ns2.vercel-dns.com

Pros: Vercel manages everything
Cons: All DNS goes through Vercel
```

**Option B: Keep Nameservers, Update A/CNAME Only** (More control)
```
Keep current nameservers
Update only:
  A record @ → Vercel IP (they provide)
  CNAME www → cname.vercel-dns.com

Pros: Keep control of nameservers
Cons: More technical
```

**RECOMMENDATION:** Start with Option B (safer, reversible)

**Step 4.4: Monitor Propagation**
```
Tools:
  - whatsmydns.net
  - dnschecker.org

Wait: 1-24 hours (usually 1-4 hours)
Verify: Site resolves to Vercel
```

---

### **PHASE 5: POST-MIGRATION VERIFICATION**

**Step 5.1: SEO Preservation Checklist**
```
✓ All old URLs redirect (test each one)
✓ Homepage loads correctly
✓ SSL certificate active
✓ No 404 errors
✓ Google Search Console updated
✓ Sitemap submitted
✓ Google Business Profile URL correct
✓ No indexing blocks (robots.txt correct)
```

**Step 5.2: Submit to Google**
```
Google Search Console:
  1. Add new sitemap: lagunabeachtennisacademy.com/sitemap.xml
  2. Request re-crawl of homepage
  3. Monitor for 2 weeks

Google Business Profile:
  1. Update website URL (if different)
  2. Verify it's still lagunabeachtennisacademy.com
```

**Step 5.3: Monitor Rankings**
```
Week 1: Check daily
Week 2: Check every 2-3 days  
Week 3-4: Weekly checks

Tools:
  - Google Search Console (position tracking)
  - Manual searches for key terms
  - Analytics traffic comparison
```

**Step 5.4: Decommission Unbounce (Only After Confident)**
```
Timeline: 2-4 weeks after migration
Verify first:
  ✓ Traffic stable or improved
  ✓ Rankings maintained
  ✓ No 404 errors in Search Console
  ✓ All redirects working

Then: Cancel Unbounce subscription
```

---

## 4. RECOMMENDED HOSTING STRATEGY

### **🏆 VERDICT: VERCEL** (Unequivocal Recommendation)

**Why Vercel for Your Next.js Site:**

✅ **Built for Next.js** - Zero configuration  
✅ **Superior Performance** - Edge network, auto-optimization  
✅ **Better SEO** - Faster site = better Google ranking  
✅ **Free Tier Sufficient** - Handles your traffic easily  
✅ **Automatic SSL** - Let's Encrypt, zero config  
✅ **Git Integration** - Push to deploy  
✅ **Preview URLs** - Test before going live  
✅ **Analytics Built-in** - Track performance  
✅ **99.99% Uptime** - Enterprise reliability  

**Cost Comparison:**
- Unbounce: $90-200/month
- Vercel: $0/month (free tier)
- **Savings:** $1,000-2,000/year

**Performance Comparison:**
- Unbounce: ~2-4s page load
- Vercel + Next.js: ~0.5-1s page load
- **Result:** Better Google ranking (speed is ranking factor)

### **Bluehost: NOT RECOMMENDED**

❌ Not optimized for Next.js  
❌ Slower than Vercel  
❌ More complex configuration  
❌ WordPress-focused (not needed)  
❌ More expensive  

**Verdict:** Skip Bluehost entirely.

---

## 5. REQUIRED DNS CHANGES

### **BEFORE (Current - Unbounce):**
```
Domain: lagunabeachtennisacademy.com
Registrar: [UNKNOWN - YOU MUST VERIFY]
Nameservers: Likely Unbounce or default registrar
A Record: Points to Unbounce IP
CNAME www: Points to Unbounce
Status: Live, working, ranking #1
```

### **AFTER (Target - Vercel):**
```
Domain: lagunabeachtennisacademy.com  
Registrar: [SAME - Don't transfer]
Nameservers: Option A (Vercel) or Option B (Keep current)
A Record: Points to Vercel IP (76.76.21.21 or as provided)
CNAME www: Points to cname.vercel-dns.com
Status: Live on Vercel, faster, optimized
```

### **EXACT DNS RECORDS NEEDED:**

**Once you deploy to Vercel and add custom domain, Vercel will show:**

```
Type    Name    Value                       TTL
────────────────────────────────────────────────
A       @       76.76.21.21                 300
CNAME   www     cname.vercel-dns.com        300
```

**IMPORTANT:** Don't change these until:
1. ✅ New site deployed to Vercel
2. ✅ Tested on temp URL
3. ✅ Redirects configured
4. ✅ You're ready to switch

---

## 6. FINAL DEPLOYMENT CHECKLIST

### **PRE-DEPLOYMENT (Do First):**
- [ ] **CRITICAL:** Find where domain is actually registered
- [ ] Login to that registrar (get credentials)
- [ ] Document current DNS settings (screenshot everything)
- [ ] List all current Unbounce URLs
- [ ] Check Google Analytics for top pages
- [ ] Backup current site (screenshots of all pages)

### **DEPLOYMENT TO VERCEL:**
- [ ] Run `vercel --prod` in project folder
- [ ] Get temporary Vercel URL
- [ ] Test all 21 pages on temp URL
- [ ] Verify forms work
- [ ] Test mobile responsiveness
- [ ] Check SSL certificate
- [ ] Add custom domain in Vercel dashboard
- [ ] Get DNS instructions from Vercel
- [ ] **DO NOT update DNS yet**

### **REDIRECT CONFIGURATION:**
- [ ] Map all old Unbounce URLs to new URLs
- [ ] Add redirects to `next.config.js`
- [ ] Test redirects on Vercel temp URL
- [ ] Redeploy to Vercel
- [ ] Verify each redirect works

### **DNS CUTOVER:**
- [ ] Lower TTL to 300 (5 min) - wait 24 hours
- [ ] Update A record to Vercel IP
- [ ] Update CNAME to Vercel
- [ ] Monitor DNS propagation (whatsmydns.net)
- [ ] Verify site loads on main domain
- [ ] Check SSL auto-provisions
- [ ] Test all pages work
- [ ] Test all redirects work

### **POST-MIGRATION:**
- [ ] Submit sitemap to Google Search Console
- [ ] Request Google re-crawl
- [ ] Monitor rankings daily (week 1)
- [ ] Check for 404 errors in Search Console
- [ ] Verify Google Business Profile URL
- [ ] Monitor traffic in Analytics
- [ ] Keep Unbounce active for 2-4 weeks
- [ ] Cancel Unbounce only after confident

---

## 7. RISKS + SAFEGUARDS

### **🔴 HIGH RISK: Incorrect Domain Registrar**

**Risk:** Trying to change DNS at wrong place  
**Impact:** Nothing happens, or breaks site  
**Safeguard:**  
✅ MUST verify actual registrar first  
✅ Get login access before starting  
✅ Document current settings  

---

### **🔴 HIGH RISK: DNS Propagation Delays**

**Risk:** Site down during 1-24 hour propagation  
**Impact:** Temporary #1 ranking loss  
**Safeguard:**  
✅ Lower TTL 24-48 hours before  
✅ Make changes during low-traffic time (2-4 AM)  
✅ Have rollback plan (revert DNS)  

---

### **🟡 MEDIUM RISK: Broken Redirects**

**Risk:** Old URLs return 404  
**Impact:** Lost traffic, SEO damage  
**Safeguard:**  
✅ Map every old URL before switching  
✅ Implement 301 redirects in Next.js  
✅ Test each redirect before DNS change  
✅ Monitor 404s in Search Console after  

---

### **🟡 MEDIUM RISK: SSL Certificate Delays**

**Risk:** HTTPS doesn't work immediately  
**Impact:** Google flags as "Not Secure"  
**Safeguard:**  
✅ Vercel auto-provisions SSL (usually 1-5 min)  
✅ Wait for cert before announcing  
✅ Don't switch DNS until SSL confirmed  

---

### **🟡 MEDIUM RISK: Email Disruption**

**Risk:** MX records get lost  
**Impact:** Emails bounce  
**Safeguard:**  
✅ Document current MX records  
✅ Re-add MX records after DNS change  
✅ Test email after migration  

---

### **🟢 LOW RISK: Nameserver Override**

**Risk:** Accidentally changing nameservers breaks everything  
**Impact:** Total site outage  
**Safeguard:**  
✅ Recommend keeping current nameservers  
✅ Only change A/CNAME records  
✅ Document original nameservers first  

---

### **🟢 LOW RISK: Conflicting Hosts**

**Risk:** Both Unbounce and Vercel try to serve site  
**Impact:** Unpredictable behavior  
**Safeguard:**  
✅ DNS points to one or the other  
✅ Once Vercel works, keep Unbounce as backup  
✅ Decommission Unbounce only after 2-4 weeks  

---

## 8. ROLLBACK PLAN

**If migration goes wrong:**

### **Immediate Rollback (Within 24 hours):**
```
1. Login to domain registrar
2. Revert DNS to original Unbounce settings
3. Wait 5-30 minutes for propagation
4. Site back to Unbounce (original state)
5. Diagnose issue before trying again
```

### **Gradual Rollback (After days/weeks):**
```
1. Identify problem (404s, traffic drop, etc.)
2. Check Search Console for errors
3. Fix specific issues (redirects, etc.)
4. Re-test
5. If unfixable: Revert DNS to Unbounce
```

---

## 9. CLARIFYING QUESTIONS (REQUIRED)

**Before proceeding, I need you to verify:**

### **🔴 CRITICAL - Must Know:**

**Q1:** Where is your domain actually registered?
- Check email for renewal notices
- Try logging into Namecheap, Network Solutions, Domain.com
- Or use whois.domaintools.com

**Q2:** What are the current Unbounce page URLs?
- List all pages on current site
- Which get most Google traffic?

**Q3:** Do you have email (support@lagunabeachtennisacademy.com)?
- Where is email hosted?
- Need to preserve MX records

### **🟡 IMPORTANT - Should Know:**

**Q4:** When does domain expire?
- Don't want it expiring during migration!

**Q5:** Any other services using this domain?
- Subdomains?
- Third-party integrations?

---

## 10. RECOMMENDED NEXT STEPS

### **IMMEDIATE (Today):**

**1. Find Your Domain Registrar** ⚠️ TOP PRIORITY
```
Try:
- Check spam/inbox for "domain renewal" emails
- Check browser saved passwords
- Check credit card statements
- Use WHOIS lookup: https://whois.domaintools.com/lagunabeachtennisacademy.com
```

**2. Document Current Unbounce Setup**
```
- List all page URLs
- Check Unbounce DNS settings
- Identify most-visited pages
```

**3. Deploy to Vercel (Safe - No DNS Change)**
```bash
cd "Cursor Base 44 Audit_Upgrade"
npx vercel --prod
```

### **THIS WEEK:**

**4. Test Vercel Deployment Thoroughly**  
**5. Create Redirect Mapping**  
**6. Get Vercel DNS Instructions**  
**7. Document Rollback Plan**  

### **NEXT WEEK (Only After Testing):**

**8. Lower DNS TTL**  
**9. Update DNS to Vercel**  
**10. Monitor Migration**  

---

## 11. WHAT I BUILT vs WHERE TO HOST

### **What We Built:**
```
Platform: Next.js 14 + TypeScript
Tech Stack: React, Tailwind CSS, Framer Motion
Current Location: Your local machine only
Git Status: Committed (all saved)
File Count: 57 files
Pages: 21 complete pages
Ready: Yes, production-ready
```

### **Where It Should Go:**
```
Recommended: Vercel
Reason: Built for Next.js, fastest, free
Alternative: Netlify (also good for Next.js)
NOT Recommended: Bluehost, WordPress hosting
```

### **Where It Currently Is:**
```
Location: Localhost only
URL: http://localhost:3000
Status: Not deployed anywhere yet
Action Needed: Deploy to Vercel
```

---

## 12. SAFETY-FIRST APPROACH

### **My Recommendations:**

**DO:**
✅ Find actual domain registrar FIRST  
✅ Deploy to Vercel with temp URL  
✅ Test everything thoroughly  
✅ Create comprehensive redirect map  
✅ Lower TTL before switching  
✅ Keep Unbounce active during transition  
✅ Monitor SEO closely after migration  

**DON'T:**
❌ Change DNS without knowing registrar  
❌ Switch DNS without testing on Vercel first  
❌ Delete Unbounce immediately  
❌ Skip redirect configuration  
❌ Forget to preserve MX records  
❌ Rush - take 2-3 weeks to be safe  

---

## 13. SUMMARY & ACTION PLAN

### **IMMEDIATE ACTION REQUIRED:**

**You must find where the domain is registered.** This is blocking everything else.

**Try these:**
1. Email search for "domain renewal"
2. Browser saved passwords
3. WHOIS lookup: https://whois.domaintools.com
4. Credit card statements

**Once you find registrar:**
- Get login access
- Document current DNS
- Then we can proceed safely

### **My Recommendation:**

**Safe Migration Timeline:**
- **Week 1:** Find registrar, deploy to Vercel, test
- **Week 2:** Configure redirects, prepare DNS
- **Week 3:** Lower TTL, switch DNS, monitor
- **Week 4:** Verify SEO, decommission Unbounce

**Zero-downtime approach - your #1 ranking will be safe.**

---

**NEXT: Find your domain registrar, then switch to agent mode and say:**

*"I found the registrar at [name]. Help me deploy to Vercel and migrate safely."*

I'll guide you through each step with exact commands and safety checks.

---

**Your work is saved. You can restart Cursor anytime.** ✅

