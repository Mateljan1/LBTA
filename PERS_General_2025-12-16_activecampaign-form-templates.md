# ActiveCampaign Form Templates - LBTA Winter 2026
## Complete Setup Guide for All 17+ Program Forms

### 🚀 **Quick Setup Instructions:**
1. **Go to ActiveCampaign → Forms**
2. **Click "Create a Form" → Inline/Embedded Form** 
3. **Copy the template below for each program**
4. **Customize fields and styling as specified**
5. **Copy the embed code to `lib/form-config.ts`**

---

## 📋 **Universal Form Fields (All Programs)**

### **Required Fields:**
- **First Name** (field_1) - Text Input
- **Last Name** (field_2) - Text Input  
- **Email** (field_3) - Email Input
- **Phone** (field_4) - Phone Input

### **Custom Fields Mapping:**
- **PROGRAM** (field_7) - Hidden/Pre-populated
- **LOCATION** (field_8) - Hidden/Pre-populated
- **DAYS_SELECTED** (field_9) - Checkbox Group
- **TUITION** (field_10) - Hidden/Pre-populated
- **LEAD_SOURCE** (field_15) - Hidden (Set to "website_embedded")

### **Conditional Fields:**
- **Student Name** (field_11) - Text (Junior/Youth only)
- **Student Age** (field_12) - Number (Junior/Youth only)
- **Experience Level** (field_13) - Select Dropdown
- **Notes** (field_14) - Textarea (Optional)

---

## 🎾 **JUNIOR PROGRAM FORMS (6 Forms)**

### **1. Little Tennis Stars Form**
```
Form Name: "Little Tennis Stars Registration - Winter 2026"
Form ID: [TO BE GENERATED]
Target List: List 4 (LBTA)
Tags to Apply: 37 (class:little_stars), 27 (LBTA_Winter2026)

FIELD CONFIGURATION:
- First Name: Required
- Last Name: Required
- Email: Required  
- Phone: Required
- Student Name: Required
- Student Age: Required (Min: 3, Max: 4)
- PROGRAM: Hidden, Default Value = "Little Tennis Stars"
- LOCATION: Hidden, Default Value = "Moulton Meadows"
- TUITION: Hidden, Default Value = "$260 (1x/week) - $520 (2x/week)"
- LEAD_SOURCE: Hidden, Default Value = "website_embedded"
- DAYS_SELECTED: Checkbox Group (Monday 3:30-4:15 PM, Wednesday 3:30-4:15 PM)
- Experience Level: Select (First Timer, Some Experience, Returning Student)
- Notes: Optional Textarea

FORM TITLE: "Register for Little Tennis Stars"
FORM DESCRIPTION: "Ages 3-4 • Moulton Meadows • 45 minutes • Starting at $260/quarter"
SUBMIT BUTTON: "Register Now"

AUTOMATION TRIGGER:
- Add to List 4
- Apply Tag 37 (class:little_stars)
- Apply Tag 27 (LBTA_Winter2026)
- Send confirmation email template
```

### **2. Red Ball Tennis Form**
```
Form Name: "Red Ball Tennis Registration - Winter 2026"
Target List: List 4 (LBTA)
Tags to Apply: 38 (class:red_ball), 27 (LBTA_Winter2026)

FIELD CONFIGURATION:
- First Name: Required
- Last Name: Required
- Email: Required
- Phone: Required
- Student Name: Required
- Student Age: Required (Min: 5, Max: 6)
- PROGRAM: Hidden, Default Value = "Red Ball Tennis"
- LOCATION: Hidden, Default Value = "Moulton Meadows"
- TUITION: Hidden, Default Value = "$546/quarter"
- LEAD_SOURCE: Hidden, Default Value = "website_embedded"
- DAYS_SELECTED: Checkbox Group (Monday 4:15-5:15 PM, Wednesday 4:15-5:15 PM)
- Experience Level: Select (First Timer, Some Tennis Experience, Advanced Beginner)
- Notes: Optional Textarea

FORM TITLE: "Register for Red Ball Tennis"
FORM DESCRIPTION: "Ages 5-6 • Moulton Meadows • 1 hour • $546/quarter"
```

### **3. Orange Ball Tennis Form**
```
Form Name: "Orange Ball Tennis Registration - Winter 2026"
Target List: List 4 (LBTA)
Tags to Apply: 39 (class:orange_ball), 27 (LBTA_Winter2026)

FIELD CONFIGURATION:
- [Same base fields as above]
- Student Age: Required (Min: 7, Max: 8)
- PROGRAM: Hidden, Default Value = "Orange Ball Tennis"
- LOCATION: Hidden, Default Value = "Moulton Meadows"
- TUITION: Hidden, Default Value = "$546/quarter"
- DAYS_SELECTED: Checkbox Group (Monday 5:15-6:15 PM, Wednesday 5:15-6:15 PM, Saturday 9:00-10:00 AM, Saturday 10:00-11:00 AM)
- Experience Level: Select (Beginner, Intermediate, Advanced)

FORM TITLE: "Register for Orange Ball Tennis"
FORM DESCRIPTION: "Ages 7-8 • Moulton Meadows • 1 hour • $546/quarter"
```

### **4. Orange Ball Match Play Form**
```
Form Name: "Orange Ball Match Play Registration - Winter 2026"
Target List: List 4 (LBTA)
Tags to Apply: 39 (class:orange_ball), 27 (LBTA_Winter2026)

FIELD CONFIGURATION:
- [Same base fields as Orange Ball Tennis]
- PROGRAM: Hidden, Default Value = "Orange Ball Match Play"
- TUITION: Hidden, Default Value = "$85/month"
- DAYS_SELECTED: Radio Button (Saturday 11:00 AM-12:00 PM)

FORM TITLE: "Register for Orange Ball Match Play"
FORM DESCRIPTION: "Ages 7-8 • Moulton Meadows • 1 hour • $85/month"
```

### **5. Green Dot Tennis Form**
```
Form Name: "Green Dot Tennis Registration - Winter 2026"
Target List: List 4 (LBTA)
Tags to Apply: 40 (class:green_dot), 27 (LBTA_Winter2026)

FIELD CONFIGURATION:
- [Same base fields as above]
- Student Age: Required (Min: 9, Max: 11)
- PROGRAM: Hidden, Default Value = "Green Dot Tennis"
- LOCATION: Hidden, Default Value = "Moulton Meadows"
- TUITION: Hidden, Default Value = "$546/quarter"
- DAYS_SELECTED: Checkbox Group (Tuesday 4:30-5:30 PM, Thursday 4:30-5:30 PM)

FORM TITLE: "Register for Green Dot Tennis"
FORM DESCRIPTION: "Ages 9-11 • Moulton Meadows • 1 hour • $546/quarter"
```

### **6. Green Dot Match Play Form**
```
Form Name: "Green Dot Match Play Registration - Winter 2026"
Target List: List 4 (LBTA)
Tags to Apply: 40 (class:green_dot), 27 (LBTA_Winter2026)

FIELD CONFIGURATION:
- [Same base fields as Green Dot Tennis]
- PROGRAM: Hidden, Default Value = "Green Dot Match Play"
- TUITION: Hidden, Default Value = "$85/month"
- DAYS_SELECTED: Radio Button (Saturday 12:00-1:00 PM)

FORM TITLE: "Register for Green Dot Match Play"
FORM DESCRIPTION: "Ages 9-11 • Moulton Meadows • 1 hour • $85/month"
```

---

## 🏆 **YOUTH PROGRAM FORMS (2 Forms)**

### **7. Youth Development Form**
```
Form Name: "Youth Development Registration - Winter 2026"
Target List: List 4 (LBTA)
Tags to Apply: 21 (class:youth_development), 27 (LBTA_Winter2026)

FIELD CONFIGURATION:
- First Name: Required
- Last Name: Required
- Email: Required
- Phone: Required
- Student Name: Required
- Student Age: Required (Min: 11, Max: 15)
- PROGRAM: Hidden, Default Value = "Youth Development"
- LOCATION: Hidden, Default Value = "Alta Laguna Park"
- TUITION: Hidden, Default Value = "Contact for pricing"
- LEAD_SOURCE: Hidden, Default Value = "website_embedded"
- Experience Level: Select (Beginner, Intermediate, Advanced, Tournament Player)
- UTR Rating: Text Input (Optional)
- Goals: Textarea ("What are your tennis goals this season?")
- Notes: Optional Textarea

FORM TITLE: "Register for Youth Development"
FORM DESCRIPTION: "Ages 11-15 • Alta Laguna Park • 1.5 hours • Contact for pricing"
```

### **8. High Performance Form**
```
Form Name: "High Performance Registration - Winter 2026"
Target List: List 4 (LBTA)
Tags to Apply: 41 (class:high_performance), 27 (LBTA_Winter2026)

FIELD CONFIGURATION:
- [Same base fields as Youth Development]
- Student Age: Required (Min: 12, Max: 17)
- PROGRAM: Hidden, Default Value = "High Performance"
- LOCATION: Hidden, Default Value = "Laguna Beach High School"
- UTR Rating: Required Text Input
- Tournament Experience: Select (None, Local, Regional, National)
- Current Coach: Text Input (Optional)
- Training Hours Per Week: Select (3-5, 6-8, 9-12, 12+)

FORM TITLE: "Register for High Performance"
FORM DESCRIPTION: "Ages 12-17 • UTR 5-8 • LBHS • 2 hours • Elite training program"
```

---

## 🏅 **ADULT PROGRAM FORMS (4 Forms)**

### **9. Adult Beginner 1 Form**
```
Form Name: "Adult Beginner 1 Registration - Winter 2026"
Target List: List 4 (LBTA)
Tags to Apply: 17 (class:adult_beginner), 27 (LBTA_Winter2026)

FIELD CONFIGURATION:
- First Name: Required
- Last Name: Required
- Email: Required
- Phone: Required
- PROGRAM: Hidden, Default Value = "Adult Beginner 1"
- LOCATION: Hidden, Default Value = "Laguna Beach High School"
- TUITION: Hidden, Default Value = "Contact for pricing"
- LEAD_SOURCE: Hidden, Default Value = "website_embedded"
- Experience Level: Radio Button (Complete Beginner, Played Recreationally, Returning After Break)
- Preferred Time: Checkbox Group (Weekday Mornings, Weekday Evenings, Weekend Mornings, Weekend Afternoons)
- Fitness Level: Select (Low, Moderate, High)
- Goals: Textarea ("What do you hope to achieve?")
- Notes: Optional Textarea

FORM TITLE: "Register for Adult Beginner 1"
FORM DESCRIPTION: "True Beginners • LBHS • 1.5 hours • Contact for pricing"
```

### **10. Adult Beginner 2 (Bridge) Form**
```
Form Name: "Adult Beginner 2 Bridge Registration - Winter 2026"
Target List: List 4 (LBTA)
Tags to Apply: 42 (class:adult_beginner_bridge), 27 (LBTA_Winter2026)

FIELD CONFIGURATION:
- [Same base fields as Adult Beginner 1]
- PROGRAM: Hidden, Default Value = "Adult Beginner 2 (Bridge)"
- LOCATION: Hidden, Default Value = "Moulton Meadows"
- Experience Level: Radio Button (Completed Beginner 1, Played Casually, Some Lessons)

FORM TITLE: "Register for Adult Beginner 2 (Bridge)"
FORM_DESCRIPTION: "Bridge Program • Moulton Meadows • 1.5 hours • Contact for pricing"
```

### **11. Adult Intermediate Form**
```
Form Name: "Adult Intermediate Registration - Winter 2026"
Target List: List 4 (LBTA)
Tags to Apply: 16 (class:adult_intermediate), 27 (LBTA_Winter2026)

FIELD CONFIGURATION:
- [Same base fields as Adult programs]
- PROGRAM: Hidden, Default Value = "Adult Intermediate"
- LOCATION: Hidden, Default Value = "Laguna Beach High School"
- Experience Level: Radio Button (NTRP 3.0, NTRP 3.5, Self-Assessed Intermediate)
- Play Frequency: Select (1x/week, 2-3x/week, 4+x/week)
- Competitive Interest: Radio Button (Social Only, Some Competition, Regular Tournaments)

FORM TITLE: "Register for Adult Intermediate"
FORM DESCRIPTION: "NTRP 3.0-3.5 • LBHS • 1.5 hours • Contact for pricing"
```

### **12. Adult Advanced Form**
```
Form Name: "Adult Advanced Registration - Winter 2026"
Target List: List 4 (LBTA)
Tags to Apply: 15 (class:adult_advanced), 27 (LBTA_Winter2026)

FIELD CONFIGURATION:
- [Same base fields as Adult programs]
- PROGRAM: Hidden, Default Value = "Adult Advanced"
- LOCATION: Hidden, Default Value = "Laguna Beach High School"
- Experience Level: Radio Button (NTRP 4.0, NTRP 4.5, NTRP 5.0+)
- Tournament Experience: Select (Club Level, Local, USTA, Professional)
- Training Goals: Checkbox Group (Technique Refinement, Match Strategy, Fitness, Tournament Prep)

FORM TITLE: "Register for Adult Advanced"
FORM DESCRIPTION: "NTRP 4.0+ • LBHS • 1.5 hours • Contact for pricing"
```

---

## 💪 **FITNESS PROGRAM FORMS (5 Forms)**

### **13. Cardio Tennis Form**
```
Form Name: "Cardio Tennis Registration - Winter 2026"
Target List: List 4 (LBTA)
Tags to Apply: 14 (class:cardio), 27 (LBTA_Winter2026)

FIELD CONFIGURATION:
- First Name: Required
- Last Name: Required
- Email: Required
- Phone: Required
- PROGRAM: Hidden, Default Value = "Cardio Tennis"
- LOCATION: Hidden, Default Value = "Laguna Beach High School"
- TUITION: Hidden, Default Value = "Contact for pricing"
- LEAD_SOURCE: Hidden, Default Value = "website_embedded"
- Fitness Level: Select (Beginner, Intermediate, Advanced)
- Tennis Experience: Select (None, Beginner, Intermediate, Advanced)
- Health Conditions: Textarea (Optional, "Any health conditions we should know about?")
- Goals: Select (Weight Loss, Fitness, Fun, Tennis Improvement)

FORM TITLE: "Register for Cardio Tennis"
FORM DESCRIPTION: "High-energy fitness • LBHS • 1 hour • All fitness levels welcome"
```

### **14. LiveBall Intermediate Form**
```
Form Name: "LiveBall Intermediate Registration - Winter 2026"
Target List: List 4 (LBTA)
Tags to Apply: 19 (class:live_ball_intermediate), 27 (LBTA_Winter2026)

FIELD CONFIGURATION:
- [Same base fields as fitness programs]
- PROGRAM: Hidden, Default Value = "LiveBall Intermediate"
- LOCATION: Hidden, Default Value = "Moulton Meadows / LBHS"
- Tennis Level: Select (NTRP 2.5, NTRP 3.0, NTRP 3.5)
- Preferred Location: Radio Button (Moulton Meadows Thu, LBHS Sun Morning)

FORM TITLE: "Register for LiveBall Intermediate"
FORM DESCRIPTION: "Match play drills • Multiple locations • 1 hour • NTRP 2.5-3.5"
```

### **15. LiveBall Advanced Form**
```
Form Name: "LiveBall Advanced Registration - Winter 2026"
Target List: List 4 (LBTA)
Tags to Apply: 18 (class:live_ball_advanced), 27 (LBTA_Winter2026)

FIELD CONFIGURATION:
- [Same base fields as LiveBall Intermediate]
- PROGRAM: Hidden, Default Value = "LiveBall Advanced"
- LOCATION: Hidden, Default Value = "Laguna Beach High School"
- Tennis Level: Select (NTRP 4.0, NTRP 4.5, NTRP 5.0+)
- Preferred Time: Radio Button (Sunday 10:30 AM-12:00 PM)

FORM TITLE: "Register for LiveBall Advanced"
FORM DESCRIPTION: "High-level match play • LBHS • 1.5 hours • NTRP 4.0+"
```

---

## 🔧 **FORM STYLING & BRANDING**

### **CSS Customization (Apply to All Forms):**
```css
/* Form container */
.ac-form {
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
  background: linear-gradient(135deg, #FAF8F3 0%, #FFFFFF 100%);
  border-radius: 16px;
  padding: 24px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
}

/* Form title */
.ac-form h2 {
  font-family: 'Crimson Text', serif;
  color: #1a1a1a;
  font-size: 24px;
  font-weight: 600;
  margin-bottom: 8px;
}

/* Form description */
.ac-form .form-description {
  color: rgba(0, 0, 0, 0.7);
  font-size: 15px;
  margin-bottom: 24px;
}

/* Input fields */
.ac-form input, .ac-form select, .ac-form textarea {
  border: 2px solid #e5e7eb;
  border-radius: 50px;
  background: #FAF8F3;
  padding: 16px 20px;
  font-size: 15px;
  transition: all 0.2s ease;
}

.ac-form textarea {
  border-radius: 16px;
}

/* Focus states */
.ac-form input:focus, .ac-form select:focus, .ac-form textarea:focus {
  border-color: #f97316;
  background: #ffffff;
  box-shadow: 0 0 0 4px rgba(249, 115, 22, 0.1);
}

/* Submit button */
.ac-form input[type="submit"] {
  background: linear-gradient(135deg, #dc2626 0%, #f97316 100%);
  color: white;
  border: none;
  border-radius: 50px;
  padding: 16px 32px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  box-shadow: 0 4px 12px rgba(249, 115, 22, 0.3);
  transition: all 0.3s ease;
}

.ac-form input[type="submit"]:hover {
  background: linear-gradient(135deg, #b91c1c 0%, #ea580c 100%);
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(249, 115, 22, 0.4);
}
```

---

## ⚡ **AUTOMATION SETUP**

### **Master Automation (Trigger: Contact added to List 4)**
1. **Wait 2 minutes** (allow webhook processing)
2. **Send Welcome Email** (Program-specific template)
3. **Add to Notion Database** (via webhook)
4. **Internal Notification** (to LBTA team)
5. **Follow-up Sequence** (24 hours later)

### **Tag-Based Follow-ups:**
- **Tag 37** (Little Stars) → Parent onboarding sequence
- **Tag 21** (Youth Dev) → Tournament readiness assessment  
- **Tag 17** (Adult Beginner) → Equipment recommendations
- **Tag 14** (Cardio) → Fitness tracking setup

---

## 📝 **IMPLEMENTATION CHECKLIST**

### **For Each Form (17 total):**
- [ ] Create form in ActiveCampaign
- [ ] Configure all required fields
- [ ] Set up pre-population values
- [ ] Apply LBTA styling/branding
- [ ] Configure automation triggers
- [ ] Test form submission
- [ ] Copy embed code to `lib/form-config.ts`
- [ ] Test embedded form on website
- [ ] Verify webhook integration
- [ ] Test analytics tracking

### **Next Steps:**
1. **Start with highest volume programs** (Adult Beginner, Little Stars)
2. **Test thoroughly** using Ctrl+Shift+T tester
3. **Monitor performance** with Ctrl+Shift+A analytics
4. **Roll out remaining forms** incrementally
5. **Optimize based on conversion data**

---

## 🎯 **SUCCESS METRICS TO TRACK**
- **Form completion rate** (target: >85%)
- **Conversion improvement** (target: 20-35% vs modal)
- **Mobile performance** (target: <3 second load time)
- **Webhook success rate** (target: 99%+)
- **User satisfaction** (qualitative feedback)

This comprehensive setup will create a seamless, branded registration experience that integrates perfectly with your existing ActiveCampaign automation and the embedded form system we built!
