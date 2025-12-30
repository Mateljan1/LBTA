# ✅ JTT Registration Form - Ready for Deployment

Your JTT registration form is complete and ready to deploy to Vercel!

---

## 🎯 **What's Ready**

### **Files Created:**
1. ✅ `/components/JTTRegistrationForm.tsx` - Complete form component
2. ✅ `/app/jtt/register/page.tsx` - Page route
3. ✅ `/app/api/jtt-registration/route.ts` - API endpoint

### **Environment Variables Already Set:**
✅ `ACTIVECAMPAIGN_API_KEY` - Already configured in Vercel  
✅ `ACTIVECAMPAIGN_URL` - Already configured in Vercel  
✅ `NOTION_API_KEY` - Already configured  
✅ `NOTION_DATABASE_ID` - Already configured  

**No additional environment variables needed!**

---

## 🚀 **How to Deploy**

### **Option 1: Push to GitHub (Recommended)**

```bash
cd "/Users/andrew-mac-studio/LBTA Build 12:16/LBTA"

# Stage the new files
git add components/JTTRegistrationForm.tsx
git add app/jtt/register/page.tsx
git add app/api/jtt-registration/route.ts

# Commit
git commit -m "feat: add JTT Spring 2026 registration form

- Complete 11-section registration form
- LBTA luxury brand styling
- ActiveCampaign integration
- Email notifications to admin
- Success screen with next steps
- Mobile-first responsive design"

# Push to GitHub
git push origin main
```

**Vercel will automatically:**
- Detect the push
- Build your Next.js app
- Deploy to production
- Update https://lagunabeachtennisacademy.com

---

### **Option 2: Manual Deployment via Vercel CLI**

```bash
cd "/Users/andrew-mac-studio/LBTA Build 12:16/LBTA"

# Install Vercel CLI (if not already installed)
npm i -g vercel

# Deploy to production
vercel --prod
```

---

## 📋 **Form Features**

### **11 Organized Sections:**
1. Player Information (name, DOB, age, grade, school)
2. Parent/Guardian Information (contact details, address)
3. Emergency Contact (name, phone, relationship)
4. Team Selection (6 divisions with times/locations)
5. Team Shirt Size (youth + adult sizes)
6. USTA Registration (yes/no with conditional fields)
7. Tennis Experience (level + UTR)
8. Payment Preferences (4 options + card authorization)
9. Sibling Discount (15% off second child)
10. Medical & Additional Notes
11. Consent & Agreement (photo + liability)

### **LBTA Brand Styling:**
✅ Playfair Display + Work Sans typography  
✅ Black/white/beige color palette  
✅ Luxury restraint (40%+ white space)  
✅ Black buttons with subtle hover  
✅ Mobile-first responsive (320px-1440px)  
✅ Smooth Framer Motion animations  

### **User Experience:**
✅ Conditional fields (show/hide based on selections)  
✅ Real-time validation  
✅ Clear error messages  
✅ Success screen with next steps  
✅ Contact information throughout  

---

## 🔗 **Integration Points**

### **ActiveCampaign (Already Connected)**
When form submits:
- Creates/updates contact
- Populates custom fields:
  - Player Name
  - Player Age
  - Division
  - Payment Preference
- Tags contact: "JTT Spring 2026"
- Triggers email automation (if configured)

### **Email Notifications**
Sends email to `support@lagunabeachtennisacademy.com` with:
- All registration details
- Formatted for easy reading
- Next steps checklist
- Ready to forward to City of Laguna Beach

---

## 📊 **After Deployment**

### **1. Test the Form**
```
URL: https://lagunabeachtennisacademy.com/jtt/register
```

**Test checklist:**
- [ ] Form loads correctly
- [ ] All fields validate properly
- [ ] Conditional fields show/hide
- [ ] Form submits successfully
- [ ] Success screen displays
- [ ] Email notification received
- [ ] ActiveCampaign contact created
- [ ] Mobile responsive (test on phone)

### **2. Add Link to JTT Page**
Update `/app/jtt/page.tsx` to add registration button:

```tsx
<a 
  href="/jtt/register"
  className="inline-flex items-center justify-center bg-lbta-black text-white font-sans text-sm font-medium tracking-[2.5px] uppercase px-12 py-5 rounded-sm transition-all duration-300 hover:bg-gray-800"
>
  Register Now
</a>
```

### **3. Set Up ActiveCampaign Automation**
In ActiveCampaign, create automation:
- **Trigger:** Contact tagged "JTT Spring 2026"
- **Action 1:** Send confirmation email
- **Action 2:** Add to "JTT Spring 2026" list
- **Action 3:** Notify admin

---

## 🎨 **Customization Options**

### **Update Divisions**
Edit `components/JTTRegistrationForm.tsx` line ~150:

```typescript
{ value: '10u-orange', label: '10U Orange Ball — Mon/Wed/Fri 3:45–5:45 PM @ Moulton Meadows' }
```

### **Update Shirt Sizes**
Edit line ~180:

```typescript
{ value: 'youth-xs', label: 'Youth XS (25–26")' }
```

### **Update Payment Options**
Edit line ~240:

```typescript
{ value: 'full', title: 'Pay in Full — Save $50', desc: 'Full payment at registration' }
```

---

## 📧 **Email Template for Confirmation**

After form submission, you can send this confirmation email via ActiveCampaign:

**Subject:** "JTT Spring 2026 Registration Received"

**Body:**
```
Hi {{contact.first_name}},

Thank you for registering {{player_name}} for Junior Team Tennis Spring 2026!

What happens next:

1. We'll forward your registration to the City of Laguna Beach within 24 hours
2. The City will contact you to complete payment based on your preferences
3. We'll send USTA registration instructions separately (if needed)
4. Expect a welcome email with practice details before January 12th

Questions?
- LBTA Admin: (949) 464-6645
- City Recreation: (949) 715-8620
- Email: support@lagunabeachtennisacademy.com

See you on the courts!

— Laguna Beach Tennis Academy
Movement. Discipline. Belonging.
```

---

## ✅ **Pre-Deployment Checklist**

- [x] Form component created
- [x] Page route created
- [x] API endpoint created
- [x] ActiveCampaign variables configured in Vercel
- [x] LBTA brand styling applied
- [x] Mobile responsive design
- [x] Accessibility standards met
- [x] Error handling implemented
- [x] Success screen designed
- [ ] **Ready to commit and push!**

---

## 🎉 **What You'll Have After Deployment**

✅ Professional JTT registration form at `/jtt/register`  
✅ Automatic ActiveCampaign integration  
✅ Email notifications to admin  
✅ Success screen with clear next steps  
✅ Mobile-optimized for parents on-the-go  
✅ LBTA luxury brand compliance  

---

## 🆘 **Support**

**Deployment issues?**
- Vercel Dashboard: vercel.com/andrew-mateljans-projects/laguna-beach-tennis-academy
- Vercel Support: vercel.com/support

**Form issues after deployment?**
- Check Vercel logs for errors
- Test API endpoint: `/api/jtt-registration`
- Verify ActiveCampaign connection

---

**Ready to deploy?** Just run the git commands above and Vercel will handle the rest! 🎾

**Project:** laguna-beach-tennis-academy  
**Domain:** lagunabeachtennisacademy.com  
**Status:** ✅ Ready for deployment

