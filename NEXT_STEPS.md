# 🎾 LBTA Registration System - NEXT STEPS

## ✅ **What's Already Done**

### **Frontend Complete (100%)**
- ✅ 17 Winter 2026 programs with complete data
- ✅ 6 Fall 2025 programs
- ✅ ProgramCard component (collapsible, schedule/pricing tables)
- ✅ RegistrationModal component (2-step flow, validation)
- ✅ Updated schedules page with unified card system
- ✅ TypeScript passing, ESLint passing
- ✅ Mobile-optimized, accessible

### **API Configuration Complete (100%)**
- ✅ Environment variables added to `.env.local`
- ✅ Notion API Key configured
- ✅ Notion Database ID configured
- ✅ ActiveCampaign URL configured
- ✅ ActiveCampaign API Key configured

---

## ⏰ **10 Minutes Remaining** - Notion Database Setup

You just need to configure the Notion database properties. Here's exactly what to do:

### **Step 1: Open Your Notion Database** (1 min)

Click this link: https://www.notion.so/08b2c2c695d44a85be916a78ca9afbd1

### **Step 2: Add Missing Properties** (8 min)

Click the **"+"** button in the database header to add each property:

#### **Property 1: Email**
- Type: **Email**
- Name: `Email`

#### **Property 2: Phone**
- Type: **Phone Number**
- Name: `Phone`

#### **Property 3: Program**
- Type: **Text**
- Name: `Program`

#### **Property 4: Student Name**
- Type: **Text**
- Name: `Student Name`

#### **Property 5: Student Age**
- Type: **Number**
- Name: `Student Age`

#### **Property 6: Experience**
- Type: **Select**
- Name: `Experience`
- Options:
  - Beginner
  - Intermediate
  - Advanced
  - Not specified

#### **Property 7: Preferred Days**
- Type: **Multi-select**
- Name: `Preferred Days`
- Options:
  - Monday
  - Tuesday
  - Wednesday
  - Thursday
  - Friday
  - Saturday
  - Sunday

#### **Property 8: Location**
- Type: **Select**
- Name: `Location`
- Options:
  - Moulton Meadows
  - Alta Laguna Park
  - Laguna Beach High School

#### **Property 9: Total Price**
- Type: **Number**
- Name: `Total Price`
- Format: **Currency (USD)**

#### **Property 10: Status**
- Type: **Select**
- Name: `Status`
- Options:
  - Pending (default)
  - Confirmed
  - Cancelled

### **Step 3: Test Registration** (1 min)

```bash
npm run dev
```

1. Open: http://localhost:3000/schedules
2. Click any program card to expand
3. Click "Register for [Program]"
4. Fill out the 2-step form
5. Submit
6. Check your Notion database for the new entry! ✅

---

## 🎯 **Quick Test Scenario**

Try registering for **"Orange Ball Tennis"** (Junior program):

**Step 1:**
- Select days: Monday, Wednesday
- Select frequency: 2× per week ($1,092)
- Click "Continue"

**Step 2:**
- First Name: Test
- Last Name: Parent
- Email: test@example.com
- Phone: (949) 555-1234
- Student Name: Test Child
- Student Age: 8
- Experience: Beginner
- Click "Complete Registration"

**Expected Result:**
- ✅ Success message appears
- ✅ Modal closes after 3 seconds
- ✅ New row in Notion database with all data
- ✅ Status: "Pending"

---

## 📊 **What Happens When Someone Registers**

### **1. User Submits Form**
- Modal shows loading spinner
- Form data is validated
- POST request sent to `/api/register-program`

### **2. Backend Processing** (automatic)
```javascript
{
  firstName: "Test",
  lastName: "Parent",
  email: "test@example.com",
  phone: "(949) 555-1234",
  program: "Orange Ball Tennis",
  studentName: "Test Child",
  studentAge: 8,
  experience: "Beginner",
  preferredDays: ["Monday", "Wednesday"],
  location: "Moulton Meadows",
  totalPrice: 1092
}
```

### **3. Notion Database** (automatic)
New row created with:
- Name: Test Parent
- Email: test@example.com
- Phone: (949) 555-1234
- Program: Orange Ball Tennis
- Student Name: Test Child
- Student Age: 8
- Experience: Beginner
- Preferred Days: Monday, Wednesday
- Location: Moulton Meadows
- Total Price: $1,092
- Status: **Pending**

### **4. ActiveCampaign** (automatic)
Contact created/updated with:
- Email: test@example.com
- First Name: Test
- Last Name: Parent
- Phone: (949) 555-1234
- Custom field: Program = "Orange Ball Tennis"

### **5. Your Team's Next Steps** (manual)
1. Review Notion entry
2. Confirm program availability
3. Send payment link
4. Update Status to "Confirmed"

---

## 🎨 **User Experience Preview**

### **Schedules Page**
```
┌─────────────────────────────────────┐
│  [Winter 2026] [Fall 2025]          │  Season Toggle
│  Early Bird: Save $50 through Dec 20│  Banner
│  [All Programs ▼] [All Locations ▼] │  Filters
└─────────────────────────────────────┘

Junior Programs (6)
┌─────────────────────────────────────┐
│ Orange Ball Tennis        [▼]       │  Collapsed Card
│ Ages 7-8 · 1 hr                     │
│ 📍 Moulton Meadows  🕐 4 times     │
│ $546 /quarter                       │
└─────────────────────────────────────┘
                ↓ Click to expand
┌─────────────────────────────────────┐
│ Orange Ball Tennis        [▲]       │  Expanded Card
│ Ages 7-8 · 1 hr                     │
│ 📍 Moulton Meadows  🕐 4 times     │
│                                      │
│ Class Schedule:                     │
│ ┌──────────┬─────────────┬────────┐│
│ │ Monday   │ 5:15-6:15PM │Michelle││
│ │ Tuesday  │ 3:30-4:30PM │Andy    ││
│ │ Wednesday│ 5:15-6:15PM │Michelle││
│ │ Thursday │ 3:30-4:30PM │Andy    ││
│ └──────────┴─────────────┴────────┘│
│                                      │
│ Pricing Options:                    │
│ ┌────────┬────────┬────────┐       │
│ │  1×    │  2×    │  3×    │       │
│ │ $546   │ $1,092 │ $1,635 │       │
│ └────────┴────────┴────────┘       │
│                                      │
│ [Register for Orange Ball Tennis →] │  CTA Button
└─────────────────────────────────────┘
```

### **Registration Modal**
```
Step 1: Confirm Selection
┌─────────────────────────────────────┐
│ Orange Ball Tennis                   │
│ Ages 7-8 · Moulton Meadows · 1 hr   │
│                                      │
│ Select Days:                         │
│ [Mon] [Tue] [Wed] [Thu]             │
│  ✓     ✓                             │
│                                      │
│ Select Frequency:                    │
│ ○ 1× per week - $546                │
│ ● 2× per week - $1,092              │ Selected
│ ○ 3× per week - $1,635              │
│                                      │
│ Total: $1,092                        │
│                                      │
│ [Continue to Contact Info →]         │
└─────────────────────────────────────┘

Step 2: Contact Info
┌─────────────────────────────────────┐
│ Parent/Guardian Information          │
│ [First Name        ] [Last Name    ]│
│ [Email Address                     ]│
│ [Phone Number                      ]│
│                                      │
│ Student Information                  │
│ [Student Name                      ]│
│ [Student Age                       ]│
│                                      │
│ Experience: [Beginner] [Intermediate]│
│             [Advanced] [Not Sure]    │
│                                      │
│ [← Back] [Complete Registration →]  │
└─────────────────────────────────────┘
```

---

## 🚀 **After Testing, You're Ready to Deploy!**

Once you've tested locally and everything works:

### **1. Add Environment Variables to Vercel**

Go to: https://vercel.com/your-project/settings/environment-variables

Add these 4 variables:
```
NOTION_API_KEY=your_notion_api_key_here
NOTION_DATABASE_ID=your_notion_database_id_here
ACTIVECAMPAIGN_URL=https://your-account.api-us1.com
ACTIVECAMPAIGN_API_KEY=your_activecampaign_api_key_here
```

**Note:** Use your actual credentials from `.env.local`

Apply to: **Production, Preview, Development**

### **2. Deploy**

```bash
git add .
git commit -m "Add complete registration system with collapsible program cards"
git push origin main
```

Vercel will auto-deploy. Monitor build logs in dashboard.

### **3. Test Live Site**

- Visit your live schedules page
- Test registration with a real email
- Verify Notion database receives data
- Check ActiveCampaign contact is created

---

## 📞 **Support Contacts**

**Registration System Documentation:**
- `REGISTRATION_SETUP_GUIDE.md` - Full setup guide
- `REGISTRATION_QUICK_START.md` - Quick reference
- `REGISTRATION_SYSTEM_COMPLETE.md` - Technical specs

**LBTA Support:**
- Email: support@lagunabeachtennisacademy.com
- Phone: (949) 464-6645

**Notion Database:**
- https://www.notion.so/08b2c2c695d44a85be916a78ca9afbd1

**ActiveCampaign:**
- https://tennisbeast.api-us1.com

---

## ✅ **Checklist**

- [x] Frontend components built
- [x] Data files created (winter2026.json, fall2025.json)
- [x] API route tested (`/api/register-program`)
- [x] Environment variables configured (`.env.local`)
- [ ] **Notion database properties configured** ← YOU ARE HERE
- [ ] Test registration flow locally
- [ ] Add env vars to Vercel
- [ ] Deploy to production
- [ ] Test on live site

---

**You're almost done! Just 10 minutes of Notion setup remaining.** 🎾✨
