# ✅ API Route Updated - Notion Database Aligned

## 🎯 What Changed

The `/app/api/register-program/route.ts` file has been updated to perfectly align with your Notion database structure.

---

## 📋 Field Mapping (Before → After)

| Old Field Name | New Field Name | Type | Auto-Populated |
|----------------|----------------|------|----------------|
| Name | **Parent Name** | Title | ✅ Yes |
| Email | **Parent Email** | Email | ✅ Yes |
| Phone | **Parent Phone** | Phone | ✅ Yes |
| Student Name | **Player Name** | Text | ✅ Yes |
| Student Age | **Age** | Number | ✅ Yes |
| Experience | **Experience Level** | Select | ✅ Yes |
| Preferred Days | **Days Selected** | Multi-select | ✅ Yes |
| Total Price | **Tuition** | Currency | ✅ Yes |
| Status: "Pending" | **Status: "New"** | Select | ✅ Yes |
| ❌ Missing | **Category** | Select | ✅ **NEW - Auto-determined** |
| ❌ Missing | **Frequency (days/week)** | Number | ✅ **NEW - Auto-calculated** |
| ❌ Missing | **Timestamp** | Date | ✅ **NEW - Current date/time** |
| ❌ Missing | **Early Bird Applied** | Checkbox | ✅ **NEW - Before Dec 20** |
| ❌ Missing | **Time Slot** | Text | ⚠️ Empty (manual entry) |
| ❌ Missing | **Notes** | Text | ✅ From form (if provided) |

---

## 🆕 New Features Added

### **1. Auto-Category Detection**

A helper function automatically determines the program category:

```typescript
function determineCategory(programName: string): string {
  // Junior: Little Stars, Red Ball, Orange Ball, Green Dot
  // Youth: Youth Development, High Performance
  // Fitness: Cardio, LiveBall, Family Tennis, Match Play
  // Adult: All other programs (default)
}
```

**Example:**
- "Orange Ball Tennis" → **Junior**
- "High Performance Training" → **Youth**
- "Adult Intermediate" → **Adult**
- "Cardio Tennis" → **Fitness**

### **2. Auto-Frequency Calculation**

The system counts how many days were selected:

```typescript
const frequency = (data.preferredDays || []).length
```

**Example:**
- Selected: [Monday, Wednesday] → **Frequency: 2**
- Selected: [Mon, Tue, Wed, Thu] → **Frequency: 4**

### **3. Early Bird Discount Detection**

Automatically checks if registration is before December 20, 2025:

```typescript
function isEarlyBird(): boolean {
  return new Date() < new Date('2025-12-20T23:59:59')
}
```

**Result:**
- Registration on Dec 15 → ✅ **Early Bird Applied: Yes**
- Registration on Dec 22 → ❌ **Early Bird Applied: No**

### **4. Timestamp Auto-Generation**

Every registration gets an automatic timestamp:

```typescript
'Timestamp': {
  date: { start: new Date().toISOString() }
}
```

---

## 📊 Complete Data Flow Example

### **User Submits Form:**
```typescript
{
  firstName: "Maria",
  lastName: "Rodriguez",
  email: "maria@email.com",
  phone: "(949) 555-1234",
  program: "Green Dot Tennis",
  studentName: "Emma Rodriguez",
  studentAge: "10",
  experience: "Some Experience",
  preferredDays: ["Tuesday", "Thursday"],
  location: "Moulton Meadows",
  totalPrice: 1092
}
```

### **Notion Database Receives:**
```typescript
{
  "Parent Name": "Maria Rodriguez",          // ✅ Title field
  "Player Name": "Emma Rodriguez",           // ✅ Student name
  "Program": "Green Dot Tennis",             // ✅ From form
  "Category": "Junior",                      // ✅ AUTO-DETERMINED
  "Location": "Moulton Meadows",             // ✅ From form
  "Days Selected": ["Tuesday", "Thursday"],  // ✅ Multi-select
  "Time Slot": "",                           // ⚠️ Manual entry needed
  "Frequency (days/week)": 2,                // ✅ AUTO-CALCULATED
  "Tuition": 1092,                           // ✅ From form
  "Age": 10,                                 // ✅ From form
  "Parent Email": "maria@email.com",         // ✅ From form
  "Parent Phone": "(949) 555-1234",          // ✅ From form
  "Experience Level": "Some Experience",     // ✅ From form
  "Status": "New",                           // ✅ Auto-set
  "Timestamp": "2025-12-12T19:30:00.000Z",  // ✅ AUTO-GENERATED
  "Early Bird Applied": true,                // ✅ AUTO-CHECKED
  "Notes": ""                                // ✅ Optional
}
```

---

## ⚠️ One Manual Field Remaining

**Time Slot** - This field will be blank on auto-registration because the exact class time depends on:
- Which specific class session they're joining
- Coach assignment
- Court availability

**Your workflow:**
1. Registration comes in with Status = "New"
2. You contact the family
3. You manually add the **Time Slot** (e.g., "4:30-5:30 PM")
4. Update Status to "Contacted" → "Paid"

**Alternative:** If you want this auto-populated, we could create a schedule mapping table that assigns default time slots based on program + location + days.

---

## 🧪 Testing the Updated API

### **Test Scenario 1: Junior Program (Green Dot)**

**Submit this payload:**
```json
{
  "firstName": "Test",
  "lastName": "Parent",
  "email": "test@example.com",
  "phone": "(949) 555-0000",
  "program": "Green Dot Tennis",
  "studentName": "Test Child",
  "studentAge": "10",
  "experience": "Beginner",
  "preferredDays": ["Tuesday", "Thursday"],
  "location": "Moulton Meadows",
  "totalPrice": 1092
}
```

**Expected Notion Entry:**
- Parent Name: Test Parent ✅
- Player Name: Test Child ✅
- Category: **Junior** (auto-detected) ✅
- Frequency: **2** (Tue + Thu) ✅
- Status: **New** ✅
- Early Bird: **Yes** (if before Dec 20) ✅

### **Test Scenario 2: Adult Program**

**Submit this payload:**
```json
{
  "firstName": "John",
  "lastName": "Smith",
  "email": "john@example.com",
  "phone": "(949) 555-1111",
  "program": "Adult Intermediate",
  "experience": "Intermediate",
  "preferredDays": ["Tuesday", "Thursday", "Saturday"],
  "location": "Laguna Beach High School",
  "totalPrice": 2042
}
```

**Expected Notion Entry:**
- Parent Name: John Smith ✅
- Player Name: John Smith (no separate student) ✅
- Category: **Adult** (auto-detected) ✅
- Frequency: **3** (Tue + Thu + Sat) ✅
- Age: null (not required for adults) ✅

---

## 🔧 Future Enhancements (Optional)

### **1. Auto Time Slot Assignment**

Create a schedule mapping:
```typescript
const scheduleMap = {
  'Green Dot Tennis': {
    'Moulton Meadows': {
      'Tuesday': '4:30-5:30 PM',
      'Thursday': '4:30-5:30 PM'
    }
  },
  'Adult Intermediate': {
    'LBHS': {
      'Tuesday': '11:00 AM-12:30 PM',
      'Thursday': '11:00 AM-12:30 PM',
      'Saturday': '10:00-11:30 AM'
    }
  }
}
```

Then auto-populate based on program + location + first selected day.

### **2. Waitlist Auto-Detection**

Check enrollment count and auto-set Status to "Waitlist" if class is full.

### **3. Coach Assignment**

Auto-assign coach based on program + location from your schedule data.

---

## ✅ Next Steps

1. **Test the Registration Flow:**
   ```bash
   npm run dev
   # Visit: http://localhost:3000/schedules
   # Click a program → Register → Submit
   # Check Notion database ✅
   ```

2. **Verify All Fields Populate:**
   - Open Notion database
   - Find the test registration
   - Confirm all fields are filled correctly
   - Only "Time Slot" should be blank

3. **Test Different Program Types:**
   - Junior program (check Category = "Junior")
   - Adult program (check Category = "Adult")
   - Youth program (check Category = "Youth")
   - Fitness program (check Category = "Fitness")

4. **Deploy to Production:**
   - Once tested locally, push to Vercel
   - Add environment variables to Vercel (if not done)
   - Test live registration

---

## 📞 Support

**Updated File:** `/app/api/register-program/route.ts`

**What's Working:**
- ✅ All field names match Notion database exactly
- ✅ Auto-category detection
- ✅ Auto-frequency calculation
- ✅ Auto-timestamp generation
- ✅ Early Bird discount detection
- ✅ Status set to "New" (not "Pending")

**What Needs Manual Entry:**
- ⚠️ Time Slot (after contacting family)

**Documentation:**
- Full Notion setup: Your user guide
- API documentation: This file
- Registration system: `REGISTRATION_SYSTEM_COMPLETE.md`

---

**🎾 Your registration system is now fully integrated with Notion! Ready to test.** ✨
