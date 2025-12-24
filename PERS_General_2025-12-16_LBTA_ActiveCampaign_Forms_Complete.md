# LBTA ActiveCampaign Forms - Complete Setup
## Modern Design System Integration

### 🎯 **FORMS TO CREATE IN ACTIVECAMPAIGN:**

---

## **FORM 5: Junior Programs (PRIORITY #1)**

**ActiveCampaign Setup:**
1. **Go to:** Sites & Forms → Create New Form → Inline Form
2. **Name:** "Junior Programs Registration - Winter 2026"
3. **Configure these fields:**

### **Form Fields:**
1. **First Name** (text, required)
2. **Last Name** (text, required)  
3. **Email** (email, required)
4. **Phone** (phone, required)
5. **Student Name** (text, required)
6. **Student Age** (number, required, min: 3, max: 12)
7. **Program Selection** (dropdown, required):
   - Little Tennis Stars (Ages 3-4) - $260/$520
   - Red Ball Tennis (Ages 5-6) - $546/$1,092
   - Orange Ball Tennis (Ages 7-8) - $546/$1,092  
   - Green Dot Tennis (Ages 9-11) - $546/$1,092
8. **Experience Level** (dropdown, required):
   - First time playing
   - Some tennis experience  
   - Has taken lessons before
9. **Preferred Frequency** (dropdown, required):
   - 1× per week
   - 2× per week
10. **Additional Notes** (textarea, optional)

### **Form Settings:**
- **Title:** "Junior Program Registration"
- **Description:** "Winter 2026 • Moulton Meadows • Ages 3-11"
- **Submit Button:** "Register Now"
- **Thank You Message:** "Thank you! We'll contact you within 24 hours to confirm your child's spot."

### **Automation:**
- **Add to List:** 4 (LBTA)
- **Apply Tags:** 27 (LBTA_Winter2026) + program-specific tag
- **Lead Source:** Set field[15] = "website_embedded"

### **Embed Code (After Creation):**
```html
<div class="_form_5"></div>
<script src="https://tennisbeast.activehosted.com/f/embed.php?id=5" type="text/javascript" charset="utf-8"></script>
```

---

## **FORM 6: Little Tennis Stars (SPECIFIC)**

For even better targeting, create individual forms:

**ActiveCampaign Setup:**
1. **Name:** "Little Tennis Stars Registration - Winter 2026"
2. **Pre-populate these hidden fields:**
   - Program: "Little Tennis Stars"
   - Location: "Moulton Meadows"  
   - Age Group: "3-4 years"
   - Pricing: "$260 (1×/week), $520 (2×/week)"

### **Form Fields:**
1. **Parent First Name** (text, required)
2. **Parent Last Name** (text, required)
3. **Email** (email, required) 
4. **Phone** (phone, required)
5. **Student Name** (text, required)
6. **Student Age** (number, required, min: 3, max: 4)
7. **Experience** (radio buttons):
   - First time playing tennis
   - Has played with parent/family
   - Has taken some lessons
8. **Frequency** (radio buttons):
   - 1× per week ($260/quarter)
   - 2× per week ($520/quarter)
9. **Preferred Days** (checkboxes):
   - Monday 3:30-4:15 PM
   - Wednesday 3:30-4:15 PM
10. **Special Needs** (textarea, optional)

**Automation:** List 4 + Tag 37 (little_stars) + Tag 27

---

## **FORM 7: Red Ball Tennis (SPECIFIC)**

**ActiveCampaign Setup:**
1. **Name:** "Red Ball Tennis Registration - Winter 2026"
2. **Pre-populate:**
   - Program: "Red Ball Tennis"
   - Location: "Moulton Meadows"
   - Age Group: "5-6 years"

### **Form Fields:**
[Same structure as Little Tennis Stars, but:]
- **Student Age:** min: 5, max: 6
- **Schedule Options:**
  - Monday 4:15-5:15 PM  
  - Wednesday 4:15-5:15 PM
- **Pricing:** $546 (1×), $1,092 (2×)

**Automation:** List 4 + Tag 38 (red_ball) + Tag 27

---

## **FORM 8: Orange Ball Tennis (SPECIFIC)**

**ActiveCampaign Setup:**
1. **Name:** "Orange Ball Tennis Registration - Winter 2026"  
2. **Pre-populate:**
   - Program: "Orange Ball Tennis"
   - Age Group: "7-8 years"

### **Form Fields:**
[Same structure, but:]
- **Student Age:** min: 7, max: 8
- **Schedule Options:**
  - Monday 5:15-6:15 PM
  - Wednesday 5:15-6:15 PM
  - Saturday 9:00-10:00 AM
  - Saturday 10:00-11:00 AM

**Automation:** List 4 + Tag 39 (orange_ball) + Tag 27

---

## **FORM 9: Green Dot Tennis (SPECIFIC)**

**ActiveCampaign Setup:**
1. **Name:** "Green Dot Tennis Registration - Winter 2026"
2. **Pre-populate:**
   - Program: "Green Dot Tennis"  
   - Age Group: "9-11 years"

### **Form Fields:**
[Same structure, but:]
- **Student Age:** min: 9, max: 11
- **Schedule Options:**
  - Tuesday 4:30-5:30 PM
  - Thursday 4:30-5:30 PM

**Automation:** List 4 + Tag 40 (green_dot) + Tag 27

---

## **🎨 MODERN LBTA STYLING (For All Forms)**

Apply this CSS to match your current website design:

```css
/* LBTA Modern Form Styling - Winter 2026 */
._form {
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif !important;
  background: #FFFFFF !important;
  border-radius: 24px !important;
  padding: 32px !important;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08) !important;
  border: 1px solid rgba(0, 0, 0, 0.06) !important;
  max-width: 600px !important;
  margin: 0 auto !important;
}

/* Form Title */
._form ._form-title {
  font-family: 'Crimson Text', Georgia, serif !important;
  font-size: 28px !important;
  font-weight: 600 !important;
  color: #000000 !important;
  text-align: center !important;
  margin-bottom: 8px !important;
  line-height: 1.3 !important;
}

/* Form Description */
._form ._form-description {
  font-family: 'Inter', sans-serif !important;
  font-size: 15px !important;
  color: rgba(0, 0, 0, 0.7) !important;
  text-align: center !important;
  margin-bottom: 32px !important;
  line-height: 1.5 !important;
}

/* Field Labels */
._form label,
._form ._form-label {
  font-family: 'Inter', sans-serif !important;
  font-size: 15px !important;
  font-weight: 600 !important;
  color: #000000 !important;
  margin-bottom: 8px !important;
  display: block !important;
}

/* Input Fields */
._form input[type="text"],
._form input[type="email"],
._form input[type="tel"],
._form input[type="number"],
._form select,
._form textarea {
  width: 100% !important;
  padding: 16px 20px !important;
  border: 2px solid #E5E7EB !important;
  border-radius: 50px !important;
  background: #FAF8F3 !important;
  font-family: 'Inter', sans-serif !important;
  font-size: 15px !important;
  color: rgba(0, 0, 0, 0.85) !important;
  transition: all 0.2s ease !important;
  outline: none !important;
  margin-bottom: 20px !important;
  box-sizing: border-box !important;
}

/* Textarea specific */
._form textarea {
  border-radius: 16px !important;
  resize: vertical !important;
  min-height: 100px !important;
  line-height: 1.5 !important;
}

/* Focus States */
._form input:focus,
._form select:focus,
._form textarea:focus {
  border-color: #F97316 !important; /* LBTA Orange */
  background: #FFFFFF !important;
  box-shadow: 0 0 0 4px rgba(249, 115, 22, 0.1) !important;
  transform: translateY(-1px) !important;
}

/* Placeholders */
._form input::placeholder,
._form textarea::placeholder {
  color: rgba(0, 0, 0, 0.4) !important;
  font-weight: 400 !important;
}

/* Radio Buttons & Checkboxes */
._form input[type="radio"],
._form input[type="checkbox"] {
  width: auto !important;
  margin-right: 8px !important;
  transform: scale(1.2) !important;
  accent-color: #F97316 !important;
}

._form .radio-group,
._form .checkbox-group {
  display: grid !important;
  grid-template-columns: 1fr !important;
  gap: 12px !important;
  margin-bottom: 24px !important;
}

._form .radio-group label,
._form .checkbox-group label {
  display: flex !important;
  align-items: center !important;
  font-size: 14px !important;
  font-weight: 400 !important;
  cursor: pointer !important;
  padding: 12px 16px !important;
  border: 1px solid #E5E7EB !important;
  border-radius: 12px !important;
  transition: all 0.2s ease !important;
}

._form .radio-group label:hover,
._form .checkbox-group label:hover {
  border-color: #F97316 !important;
  background: rgba(249, 115, 22, 0.05) !important;
}

/* Submit Button */
._form input[type="submit"],
._form button[type="submit"],
._form ._submit {
  width: 100% !important;
  background: linear-gradient(135deg, #DC2626 0%, #F97316 100%) !important;
  color: #FFFFFF !important;
  border: none !important;
  border-radius: 50px !important;
  padding: 18px 32px !important;
  font-family: 'Inter', sans-serif !important;
  font-size: 16px !important;
  font-weight: 600 !important;
  cursor: pointer !important;
  transition: all 0.3s ease !important;
  margin-top: 24px !important;
  min-height: 56px !important;
  box-shadow: 0 4px 12px rgba(249, 115, 22, 0.3) !important;
}

/* Submit Hover */
._form input[type="submit"]:hover,
._form button[type="submit"]:hover,
._form ._submit:hover {
  background: linear-gradient(135deg, #B91C1C 0%, #EA580C 100%) !important;
  transform: translateY(-2px) !important;
  box-shadow: 0 6px 20px rgba(249, 115, 22, 0.4) !important;
}

/* Submit Active */
._form input[type="submit"]:active,
._form ._submit:active {
  transform: translateY(0) !important;
}

/* Error Messages */
._form .error,
._form .field-error {
  color: #DC2626 !important;
  font-size: 13px !important;
  font-weight: 500 !important;
  margin-top: 4px !important;
  padding-left: 20px !important;
}

/* Success State */
._form ._form-thank-you {
  text-align: center !important;
  padding: 40px 20px !important;
  background: linear-gradient(135deg, #ECFDF5 0%, #F0FDF4 100%) !important;
  border: 1px solid #10B981 !important;
  border-radius: 16px !important;
  color: #059669 !important;
}

/* Hide AC Branding */
._form ._form-branding,
._form .powered-by {
  display: none !important;
}

/* Mobile Optimizations */
@media (max-width: 768px) {
  ._form {
    padding: 24px !important;
    border-radius: 20px !important;
  }
  
  ._form ._form-title {
    font-size: 24px !important;
  }
  
  ._form input[type="text"],
  ._form input[type="email"],
  ._form input[type="tel"],
  ._form input[type="number"],
  ._form select,
  ._form textarea {
    font-size: 16px !important; /* Prevent iOS zoom */
    padding: 16px 18px !important;
  }
  
  ._form input[type="submit"],
  ._form ._submit {
    font-size: 16px !important;
    padding: 16px 24px !important;
  }
}
```

---

## **FORM 5: JUNIOR PROGRAMS (Main Form)**

**Copy this configuration into ActiveCampaign:**

### **Form Configuration:**
```
Form Name: Junior Programs Registration - Winter 2026
Form Type: Inline/Embedded
Form ID: Will be auto-generated (should be 5)
```

### **Form HTML Template:**
```html
<form method="POST" action="https://tennisbeast.activehosted.com/proc.php" class="_form _form_5 _inline-form">
  <!-- Hidden Form Config -->
  <input type="hidden" name="u" value="5" />
  <input type="hidden" name="f" value="5" />
  <input type="hidden" name="s" />
  <input type="hidden" name="c" value="0" />
  <input type="hidden" name="m" value="0" />
  <input type="hidden" name="act" value="sub" />
  <input type="hidden" name="v" value="2" />

  <!-- Form Header -->
  <div class="_form-header">
    <h2 class="_form-title">Junior Program Registration</h2>
    <p class="_form-description">Winter 2026 • Moulton Meadows • Ages 3-11</p>
  </div>

  <!-- Student Information -->
  <div class="_form_element">
    <label for="student_name">Student's Full Name *</label>
    <input type="text" name="fullname" id="student_name" placeholder="Enter your child's full name" required />
  </div>

  <div class="_form_element">
    <label for="student_age">Student's Age *</label>
    <input type="number" name="field[4]" id="student_age" placeholder="Age" min="3" max="11" required />
  </div>

  <!-- Program Selection -->
  <div class="_form_element">
    <label for="program_selection">Program Level *</label>
    <select name="field[3]" id="program_selection" required>
      <option value="">Select program level...</option>
      <option value="little_tennis_stars">Little Tennis Stars (Ages 3-4)</option>
      <option value="red_ball">Red Ball Tennis (Ages 5-6)</option>
      <option value="orange_ball">Orange Ball Tennis (Ages 7-8)</option>
      <option value="green_dot">Green Dot Tennis (Ages 9-11)</option>
    </select>
  </div>

  <!-- Parent Information -->
  <div class="_form_element">
    <label for="parent_first">Parent/Guardian First Name *</label>
    <input type="text" name="firstname" id="parent_first" placeholder="First name" required />
  </div>

  <div class="_form_element">
    <label for="parent_last">Parent/Guardian Last Name *</label>
    <input type="text" name="lastname" id="parent_last" placeholder="Last name" required />
  </div>

  <div class="_form_element">
    <label for="email">Email Address *</label>
    <input type="email" name="email" id="email" placeholder="your@email.com" required />
  </div>

  <div class="_form_element">
    <label for="phone">Phone Number *</label>
    <input type="tel" name="phone" id="phone" placeholder="(555) 123-4567" required />
  </div>

  <!-- Experience Level -->
  <div class="_form_element">
    <label>Tennis Experience *</label>
    <div class="radio-group">
      <label><input type="radio" name="field[5]" value="beginner" required /> First time playing tennis</label>
      <label><input type="radio" name="field[5]" value="some_experience" required /> Some tennis experience</label>
      <label><input type="radio" name="field[5]" value="has_lessons" required /> Has taken lessons before</label>
    </div>
  </div>

  <!-- Frequency -->
  <div class="_form_element">
    <label>Preferred Frequency *</label>
    <div class="radio-group">
      <label><input type="radio" name="frequency" value="1x_week" required /> 1× per week</label>
      <label><input type="radio" name="frequency" value="2x_week" required /> 2× per week</label>
    </div>
  </div>

  <!-- Additional Notes -->
  <div class="_form_element">
    <label for="notes">Additional Notes (Optional)</label>
    <textarea name="customer_message" id="notes" placeholder="Any special needs, scheduling preferences, or questions..." rows="3"></textarea>
  </div>

  <!-- Hidden Fields for Tracking -->
  <input type="hidden" name="field[15]" value="website_embedded" />
  
  <!-- Submit Button -->
  <button type="submit" class="_submit">Register Now</button>

  <!-- Thank You Message (Hidden) -->
  <div class="_form-thank-you" style="display:none;">
    <h3>Registration Received!</h3>
    <p>Thank you for registering your child! Our team will contact you within 24 hours to confirm their spot and provide payment details.</p>
  </div>
</form>
```

---

## **FORM 10-15: FITNESS PROGRAMS**

Create these additional forms for fitness programs:

### **Cardio Tennis (Form 10)**
```
Name: Cardio Tennis Registration - Winter 2026
Fields: Name, Email, Phone, Fitness Level, Goals
Tags: Tag 14 (cardio) + Tag 27
Embed: <script src="https://tennisbeast.activehosted.com/f/embed.php?id=10"></script>
```

### **LiveBall Intermediate (Form 11)**
```
Name: LiveBall Intermediate Registration - Winter 2026
Fields: Name, Email, Phone, Tennis Level (NTRP), Preferred Location
Tags: Tag 19 (live_ball_intermediate) + Tag 27
Embed: <script src="https://tennisbeast.activehosted.com/f/embed.php?id=11"></script>
```

### **LiveBall Advanced (Form 12)**
```
Name: LiveBall Advanced Registration - Winter 2026  
Fields: Name, Email, Phone, Tennis Level (NTRP 4.0+), Tournament Experience
Tags: Tag 18 (live_ball_advanced) + Tag 27
Embed: <script src="https://tennisbeast.activehosted.com/f/embed.php?id=12"></script>
```

---

## **🔧 UPDATE lib/form-config.ts**

After creating the forms, update your form configuration:

```typescript
// Add these to FORM_CONFIGS in lib/form-config.ts

'little-stars': {
  programId: 'little-stars',
  formEmbedCode: '<div class="_form_6"></div><script src="https://tennisbeast.activehosted.com/f/embed.php?id=6"></script>',
  acFormId: '6',
  prePopulateData: {
    programName: 'Little Tennis Stars',
    location: 'Moulton Meadows',
    duration: '45 min',
    pricing: '$260 (1×/week) - $520 (2×/week)',
    category: 'Junior',
    ageGroup: '3-4 years',
    billingCycle: 'quarterly'
  },
  classTagId: 37
},

'red-ball': {
  programId: 'red-ball', 
  formEmbedCode: '<div class="_form_7"></div><script src="https://tennisbeast.activehosted.com/f/embed.php?id=7"></script>',
  acFormId: '7',
  // ... rest of config
},

// Continue for all programs...
```

---

## **🚀 PRIORITY CREATION ORDER:**

1. **Form 5** - Junior Programs (covers all junior programs initially)
2. **Form 6** - Little Tennis Stars (specific, high volume)
3. **Form 7** - Red Ball Tennis (popular)
4. **Forms 10-12** - Fitness Programs (good conversion)
5. **Forms 8-9** - Orange/Green Dot (complete junior coverage)

---

## **📝 QUICK SETUP CHECKLIST:**

For each form in ActiveCampaign:
- [ ] Create form with correct name
- [ ] Add all required fields with validation
- [ ] Set up automation (List 4 + appropriate tags)
- [ ] Apply LBTA styling CSS
- [ ] Test form submission
- [ ] Copy embed code to form-config.ts
- [ ] Test embedded form on website

**Start with Form 5 (Junior Programs) - this will immediately enable registration for Little Tennis Stars, Red Ball, Orange Ball, and Green Dot!** 🎾
