# GoDaddy DNS Configuration for Racquet Rescue

## 🎯 Goal
Point `racquetrescue.com` to your LBTA website's Racquet Rescue page.

---

## 📋 Step-by-Step Instructions

### Step 1: Log into GoDaddy
1. Go to: https://dcc.godaddy.com/
2. Sign in with your credentials
3. Navigate to: **My Products** → **Domains**
4. Find `racquetrescue.com` and click **DNS** or **Manage DNS**

---

### Step 2: Add DNS Records

You need to add these records to point your domain to Vercel:

#### Record 1: Root Domain (racquetrescue.com)
```
Type:     A
Name:     @
Value:    76.76.21.21
TTL:      600 (or 1 Hour)
```

#### Record 2: WWW Subdomain (www.racquetrescue.com)
```
Type:     CNAME
Name:     www
Value:    cname.vercel-dns.com
TTL:      600 (or 1 Hour)
```

---

### Step 3: Remove Conflicting Records (If Any)

**Important:** If you see existing A or CNAME records for `@` or `www`, you need to:
1. Delete or pause the old records
2. Then add the new records above

Common conflicts:
- GoDaddy parking page (A record pointing to GoDaddy IP)
- Old website hosting (CNAME pointing to another service)

---

### Step 4: Verify Configuration

After adding the records:

1. **Wait 10-60 minutes** for DNS propagation
2. **Check DNS status:**
   - Go to: https://vercel.com/andrew-mateljans-projects/racquet-rescue/settings/domains
   - You should see ✅ green checkmarks next to both domains

3. **Test the domains:**
   ```bash
   # Check if DNS is propagated
   nslookup racquetrescue.com
   nslookup www.racquetrescue.com
   ```

4. **Visit in browser:**
   - http://racquetrescue.com
   - http://www.racquetrescue.com
   - Both should redirect to: https://lagunabeachtennisacademy.com/racquet-rescue

---

## 🔍 Troubleshooting

### Problem: "Domain not verified" in Vercel
**Solution:**
- Wait longer (DNS can take up to 48 hours, but usually 10-60 minutes)
- Double-check the A record value: `76.76.21.21`
- Make sure there are no conflicting records

### Problem: "This site can't be reached"
**Solution:**
- DNS hasn't propagated yet - wait longer
- Clear your browser cache
- Try in incognito mode
- Check DNS with: `nslookup racquetrescue.com`

### Problem: Shows GoDaddy parking page
**Solution:**
- Old A record is still active
- Delete the old A record pointing to GoDaddy's IP
- Add the new A record: `76.76.21.21`

### Problem: SSL certificate error
**Solution:**
- Vercel automatically provisions SSL certificates
- This can take 10-30 minutes after DNS is verified
- Be patient - it will resolve automatically

---

## 📸 Visual Guide

### What Your GoDaddy DNS Should Look Like:

```
┌─────────────────────────────────────────────────────┐
│ DNS Records for racquetrescue.com                  │
├─────────────────────────────────────────────────────┤
│ Type    Name    Value                    TTL        │
├─────────────────────────────────────────────────────┤
│ A       @       76.76.21.21             600         │
│ CNAME   www     cname.vercel-dns.com    600         │
└─────────────────────────────────────────────────────┘
```

---

## ⚡ Quick Reference

### Vercel DNS Values:
- **A Record IP:** `76.76.21.21`
- **CNAME Target:** `cname.vercel-dns.com`

### Vercel Project:
- **Project Name:** racquet-rescue
- **Project URL:** https://vercel.com/andrew-mateljans-projects/racquet-rescue
- **Settings:** https://vercel.com/andrew-mateljans-projects/racquet-rescue/settings/domains

### Target Destination:
- Both `racquetrescue.com` and `www.racquetrescue.com` will redirect to:
- **https://lagunabeachtennisacademy.com/racquet-rescue**

---

## 🎯 Expected Result

After DNS propagation (10-60 minutes):

1. ✅ `racquetrescue.com` → redirects to LBTA Racquet Rescue page
2. ✅ `www.racquetrescue.com` → redirects to LBTA Racquet Rescue page
3. ✅ SSL certificate automatically provisioned (HTTPS)
4. ✅ Both domains show green checkmarks in Vercel

---

## 📞 Need Help?

### GoDaddy Support:
- Phone: 480-505-8877
- Chat: Available in GoDaddy dashboard
- Help: https://www.godaddy.com/help

### Vercel Support:
- Dashboard: https://vercel.com/support
- Docs: https://vercel.com/docs/concepts/projects/domains

---

**Status:** Ready for DNS configuration
**Created:** December 24, 2025
**Estimated Time:** 10-60 minutes for DNS propagation

