# Facebook Meta Pixel Connection Verification

## ✅ **Setup Status**

### **What's Configured:**
- **Pixel ID**: `1560970271593544`
- **Pixel Script**: Installed in app/layout.tsx
- **Tracking Component**: MetaPixel component active
- **Conversion Events**: Configured on all 3 landing pages

---

## **How to Verify Connection**

### **Option 1: Use Facebook Pixel Helper (Chrome Extension)**

1. **Install Chrome Extension**:
   - Visit: https://chrome.google.com/webstore/detail/facebook-pixel-helper/fdgfkebogiimcoedlicjlajpkdmockpc
   - Click "Add to Chrome"

2. **Test Your Site**:
   ```bash
   npm run dev
   ```

3. **Visit Your Landing Pages**:
   - http://localhost:3000/beginner-program
   - http://localhost:3000/junior-trial
   - http://localhost:3000/adult-trial

4. **Check Extension Icon**:
   - Extension icon should turn **blue** with a number (shows active pixels)
   - Click the icon to see:
     - ✅ Pixel `1560970271593544` is firing
     - ✅ PageView event detected

5. **Submit a Test Form**:
   - Fill out form and submit
   - Pixel Helper should show:
     - ✅ `Lead` event fired (with program value)
     - ✅ `CompleteRegistration` event fired

---

### **Option 2: Use Facebook Events Manager**

1. **Open Events Manager**:
   - Go to: https://business.facebook.com/events_manager2
   - Select your pixel (1560970271593544)

2. **Check "Test Events" Tab**:
   - Click "Test Events" in left sidebar
   - Start your dev server: `npm run dev`
   - Visit: http://localhost:3000/beginner-program

3. **You Should See**:
   ```
   Browser: Chrome
   Event: PageView
   Time: Just now
   ```

4. **Submit a Test Form**:
   - Fill out the form
   - Click submit
   - You should see in Events Manager:
     ```
     Event: Lead
     Value: 504.00 USD (or 1008.00)

     Event: CompleteRegistration
     Value: 504.00 USD
     ```

---

### **Option 3: Check Browser Console**

1. Start dev server: `npm run dev`
2. Visit: http://localhost:3000/beginner-program
3. Open browser console (F12 or Cmd+Option+I)
4. Type: `fbq`
5. You should see:
   ```javascript
   function fbq() { [native code] }
   ```
   ✅ This means Facebook Pixel is loaded!

6. Check for initialization:
   ```javascript
   window.fbq.queue
   ```
   Should show array with events

---

## **Expected Events on Each Page**

### **Foundation Program** (`/beginner-program`)
- **PageView**: Fires on page load
- **Lead**: Fires when form submitted
  - Value: $504 (Saturday) or $1,008 (weekday)
  - content_name: "Foundation 12-Week Program"
- **CompleteRegistration**: Fires on success page
  - Value: $504 or $1,008

### **Junior Trial** (`/junior-trial`)
- **PageView**: Fires on page load
- **Lead**: Fires when form submitted
  - Value: $35
  - content_name: "Junior Trial"
- **CompleteRegistration**: Fires on success page
  - Value: $35

### **Adult Trial** (`/adult-trial`)
- **PageView**: Fires on page load
- **Lead**: Fires when form submitted
  - Value: $0 (complimentary)
  - content_name: "Adult Trial"
- **CompleteRegistration**: Fires on success page
  - Value: $0

---

## **Troubleshooting**

### **Pixel Not Showing in Pixel Helper**

1. **Check .env.local**:
   ```bash
   cat .env.local | grep PIXEL
   ```
   Should show: `NEXT_PUBLIC_META_PIXEL_ID=1560970271593544`

2. **Restart Dev Server**:
   ```bash
   # Kill existing server
   pkill -f "next dev"

   # Start fresh
   npm run dev
   ```

3. **Hard Refresh Browser**:
   - Chrome/Edge: Cmd+Shift+R (Mac) or Ctrl+Shift+R (Windows)
   - This clears cache

### **Events Not Firing**

1. **Check Console for Errors**:
   - Open browser console (F12)
   - Look for red error messages
   - Common issue: `fbq is not defined` → Means pixel script didn't load

2. **Verify Form Submission**:
   - Check console after clicking "Enroll now" or "Request trial"
   - Should see network request to `/api/book`

3. **Check Tracking Code**:
   ```bash
   # Verify tracking is imported
   grep "trackFormSubmit" app/beginner-program/page.tsx
   grep "trackConversion" app/beginner-program/page.tsx
   ```

### **Live Site Not Working (After Deploy)**

1. **Verify Environment Variables**:
   - Make sure `NEXT_PUBLIC_META_PIXEL_ID` is set in Vercel/production environment
   - Go to Vercel dashboard → Project → Settings → Environment Variables
   - Add: `NEXT_PUBLIC_META_PIXEL_ID = 1560970271593544`
   - Redeploy

2. **Check Domain Verification**:
   - Go to Events Manager → Data Sources → Pixel
   - Verify your domain is added and verified

---

## **Production Testing**

Once deployed to production:

1. **Visit Production Site**:
   - https://lagunabeachtennisacademy.com/beginner-program

2. **Use Pixel Helper**:
   - Should see pixel firing on production domain

3. **Submit Real Lead**:
   - Use real email (yours)
   - Check if you receive confirmation email
   - Check Events Manager for Lead + CompleteRegistration events

4. **Wait 24-48 Hours**:
   - Facebook aggregates data
   - Check Events Manager → Overview for conversion data

---

## **Facebook Ads Optimization**

Once pixel is verified and collecting data:

1. **Create Custom Conversions**:
   - Events Manager → Custom Conversions
   - Create conversion for "Lead - Foundation Program"
   - URL contains: `/beginner-program` + Event: Lead

2. **Use for Ad Optimization**:
   - When creating Facebook ads, choose:
     - Conversion objective
     - Optimize for: Lead or CompleteRegistration
     - Track your pixel

3. **Build Audiences**:
   - Create custom audience from website visitors
   - Create lookalike audiences from converters
   - Retarget people who visited but didn't convert

---

## **Quick Test Checklist**

- [ ] Install Facebook Pixel Helper extension
- [ ] Start dev server (`npm run dev`)
- [ ] Visit /beginner-program page
- [ ] Pixel Helper shows pixel `1560970271593544` is active
- [ ] PageView event fires on page load
- [ ] Fill out form with test data
- [ ] Submit form
- [ ] Lead event fires (check Pixel Helper)
- [ ] Success page shows
- [ ] CompleteRegistration event fires
- [ ] Check Events Manager → Test Events tab
- [ ] All events appear in Test Events

---

## **Need Help?**

- **Pixel Helper Not Working**: Disable ad blockers, privacy extensions
- **Events Not in Events Manager**: Check Test Events tab (real-time), Overview tab takes 24-48 hours
- **Production Issues**: Verify environment variables are set in deployment platform
