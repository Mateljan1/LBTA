# 🎾 LBTA Registration System - Setup Guide

## ✅ **What's Been Completed** (Automated)

All frontend components and data files have been built and integrated:

- ✅ `/data/winter2026.json` - 17 Winter 2026 programs with complete schedules & pricing
- ✅ `/data/fall2025.json` - 6 Fall 2025 programs  
- ✅ `ProgramCard.tsx` - Collapsible cards with schedule/pricing tables
- ✅ `RegistrationModal.tsx` - 2-step registration flow with validation
- ✅ Updated `/app/schedules/page.tsx` - Unified card system with filters
- ✅ Removed old components (ProgramModal, ScheduleCalendar)
- ✅ TypeScript compilation: ✅ PASSED
- ✅ ESLint: ✅ PASSED (no new errors)

---

## 📋 **Manual Setup Required** (15-20 minutes)

### **Step 1: Environment Variables** (2 minutes)

Create or update `.env.local` in the project root with these API credentials:

```bash
# Notion Integration
NOTION_API_KEY=your_notion_api_key_here
NOTION_DATABASE_ID=your_notion_database_id_here

# ActiveCampaign Integration
ACTIVECAMPAIGN_URL=https://your-account.api-us1.com
ACTIVECAMPAIGN_API_KEY=your_activecampaign_api_key_here
```

**Important:**
- `.env.local` is already in `.gitignore` (✅ safe - won't be committed)
- These credentials are only used server-side (Next.js API routes)
- Never share these keys publicly or commit them to git

---

### **Step 2: Notion Database Configuration** (10 minutes)

Open your Notion database: https://www.notion.so/08b2c2c695d44a85be916a78ca9afbd1

**Add/Verify These Properties:**

1. **Name** (Title) - Already exists ✅
2. **Email** (Email type) - Add if missing
3. **Phone** (Phone Number type) - Add if missing
4. **Program** (Text type) - Add if missing
5. **Student Name** (Text type) - Add if missing
6. **Student Age** (Number type) - Add if missing
7. **Experience** (Select type) - Add with options:
   - Beginner
   - Intermediate
   - Advanced
   - Not specified
8. **Preferred Days** (Multi-select type) - Add with options:
   - Monday
   - Tuesday
   - Wednesday
   - Thursday
   - Friday
   - Saturday
   - Sunday
9. **Location** (Select type) - Add with options:
   - Moulton Meadows
   - Alta Laguna Park
   - Laguna Beach High School
10. **Total Price** (Number type, format as Currency) - Add if missing
11. **Status** (Select type) - Add with options:
    - Pending (default)
    - Confirmed
    - Cancelled

**To Add a Property in Notion:**
1. Click "+" button in the database header
2. Select property type from dropdown
3. Name it exactly as shown above
4. For Select/Multi-select, add the options listed

---

### **Step 3: ActiveCampaign Configuration** (5 minutes)

Login to ActiveCampaign: https://tennisbeast.api-us1.com

**1. Verify Custom Fields Exist:**
- Go to **Settings → Fields**
- Confirm these custom fields exist:
  - `Program` (Text field)
  - `Student Name` (Text field)
  - `Student Age` (Number field)
  - `Registration Date` (Date field)

**2. Create Winter 2026 Tag:**
- Go to **Contacts → Tags**
- Create new tag: `Winter 2026 Registration`
- Use for automation triggers

**3. Set Up Confirmation Automation (Optional):**
- Go to **Automations → Create Automation**
- Trigger: "Tag is added" → `Winter 2026 Registration`
- Action: "Send email" → Create confirmation email:
  - Subject: "Registration Received - LBTA Winter 2026"
  - Body: Thank you message + "We'll confirm within 24 hours"

**Note:** The API route (`/api/register-program/route.ts`) currently sends contact data but doesn't add tags automatically. To enable tag automation, update line 83 in the API route with the appropriate ActiveCampaign automation ID.

---

### **Step 4: Test the Registration System** (10 minutes)

**Local Testing:**

1. **Start Dev Server:**
   ```bash
   npm run dev
   ```

2. **Navigate to Schedules Page:**
   - Open: http://localhost:3000/schedules
   - Verify Winter 2026 programs load correctly

3. **Test Registration Flow:**
   
   **a) Expand a Program Card:**
   - Click any program card to expand
   - Verify schedule table displays correctly
   - Verify pricing table shows all options
   - Check "Register" button is visible

   **b) Step 1 - Program Selection:**
   - Click "Register for [Program]" button
   - Modal should open to Step 1
   - Select days (if multiple available)
   - Select frequency (1×, 2×, 3× per week, etc.)
   - Verify calculated price displays correctly
   - Click "Continue to Contact Info"

   **c) Step 2 - Contact Information:**
   - Fill in required fields:
     - First Name: Test
     - Last Name: User
     - Email: test@example.com (use a real email for testing)
     - Phone: (949) 123-4567
   - For Junior/Youth programs, fill:
     - Student Name: Test Student
     - Student Age: 10
   - Select Experience Level: Beginner
   - Click "Complete Registration"

   **d) Verify Success:**
   - Success message should display
   - Modal auto-closes after 3 seconds

4. **Verify Data in Notion:**
   - Open Notion database
   - Check for new entry with:
     - Correct contact info
     - Program name
     - Selected days
     - Total price
     - Status: Pending

5. **Verify ActiveCampaign:**
   - Go to ActiveCampaign → Contacts
   - Search for test email
   - Verify contact was created/updated
   - Check custom fields populated

---

### **Step 5: Mobile Testing** (5 minutes)

**Responsive Design Check:**

1. Open Chrome DevTools (Cmd+Option+I)
2. Toggle device toolbar (Cmd+Shift+M)
3. Test these breakpoints:

   **Mobile (375px):**
   - [ ] Program cards are full width
   - [ ] Schedule table scrolls horizontally if needed
   - [ ] Pricing options stack vertically
   - [ ] Modal is centered and scrollable
   - [ ] Form inputs are touch-friendly (min 44×44px)

   **Tablet (768px):**
   - [ ] 2 cards per row
   - [ ] Filters stack horizontally
   - [ ] Modal width is appropriate

   **Desktop (1440px):**
   - [ ] 3 cards per row
   - [ ] All content centered with max-width
   - [ ] Proper spacing between cards

---

### **Step 6: Production Deployment**

**Before Deploying:**

1. **Environment Variables in Vercel:**
   - Go to Vercel Dashboard → Project Settings → Environment Variables
   - Add all 4 environment variables from `.env.local`
   - Apply to: Production, Preview, Development

2. **Test Build Locally (Optional):**
   ```bash
   npm run build
   npm start
   ```
   - Verify production build works
   - Test registration flow in production mode

3. **Deploy:**
   ```bash
   git add .
   git commit -m "Add registration system with collapsible program cards"
   git push origin main
   ```
   - Vercel auto-deploys on push
   - Monitor build logs in Vercel dashboard

4. **Post-Deployment Testing:**
   - Test registration on live site
   - Verify Notion integration works in production
   - Check ActiveCampaign receives contacts
   - Test on real mobile device

---

## 🎯 **Features Included**

### **Data Structure:**
- ✅ 17 Winter 2026 programs across 4 categories
- ✅ 6 Fall 2025 programs
- ✅ Complete schedule arrays (day, time, coach)
- ✅ Pricing objects (1×-5× weekly, monthly, drop-in)
- ✅ Location data for all programs

### **ProgramCard Component:**
- ✅ Collapsible design (click to expand)
- ✅ Program name, age, location, duration
- ✅ Quick info icons (MapPin, Clock, Users)
- ✅ Base price display when collapsed
- ✅ Schedule table (Day, Time, Coach) when expanded
- ✅ Pricing table (all frequency options) when expanded
- ✅ Register button (triggers modal)
- ✅ Smooth animations (200ms fade-in)

### **RegistrationModal Component:**
- ✅ 2-step flow with progress indicator
- ✅ Step 1: Confirm program + select days + frequency
- ✅ Step 2: Collect contact info + student details
- ✅ Form validation (email, phone, required fields)
- ✅ Conditional student info (Junior/Youth only)
- ✅ Experience level selection
- ✅ Submit to `/api/register-program`
- ✅ Success message with auto-close
- ✅ Error handling with fallback phone number

### **Schedules Page Updates:**
- ✅ Removed Table/Calendar views
- ✅ Unified card-based system
- ✅ Season toggle (Winter/Fall)
- ✅ Program Type filter (All, Junior, Youth, Adult, Fitness)
- ✅ Location filter (All, Moulton, Alta Laguna, LBHS)
- ✅ Grouped by category with headers
- ✅ Responsive grid (1/2/3 columns)
- ✅ Early Bird banner (Winter only)

---

## 🐛 **Troubleshooting**

### **Issue: Registration Modal Doesn't Open**
- Check browser console for errors
- Verify `RegistrationModal` is imported correctly
- Check `selectedProgram` state is set on button click

### **Issue: Notion Integration Fails**
- Verify `NOTION_API_KEY` is correct
- Check database ID matches your Notion database
- Ensure Notion integration has access to the database
- Verify all database properties exist with correct types

### **Issue: ActiveCampaign Contact Not Created**
- Check `ACTIVECAMPAIGN_URL` and `ACTIVECAMPAIGN_API_KEY`
- Verify API key has permission to create contacts
- Check field IDs in `/api/register-program/route.ts` line 68
- Review ActiveCampaign API logs

### **Issue: Form Validation Not Working**
- Check email format: must include `@` and `.`
- Check phone format: accepts various formats with parentheses/dashes
- Ensure all required fields have values

### **Issue: Mobile Layout Broken**
- Clear browser cache
- Check Tailwind responsive classes (`md:`, `lg:` prefixes)
- Verify viewport meta tag in `app/layout.tsx`

---

## 📞 **Support**

If you encounter issues:

1. Check browser console for JavaScript errors
2. Review Notion database property types
3. Test API routes directly (Postman/cURL)
4. Check Vercel deployment logs
5. Contact: support@lagunabeachtennisacademy.com

---

## 🎉 **You're All Set!**

Once manual setup is complete:
- Users can browse programs with filters
- Click to expand program cards
- Register through 2-step modal
- Data flows to Notion + ActiveCampaign automatically
- Mobile-optimized and accessible

**Next Steps:**
1. Complete Steps 1-3 above (environment + Notion + ActiveCampaign)
2. Test registration flow locally (Step 4)
3. Test mobile responsiveness (Step 5)
4. Deploy to production (Step 6)

---

**Built with:**
- Next.js 14.2
- TypeScript
- Tailwind CSS
- LBTA Design System
- Notion API
- ActiveCampaign API
