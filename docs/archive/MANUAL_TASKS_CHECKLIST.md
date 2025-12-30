# VYLO ULTRA-LUXURY AUDIT 2.0
## Remaining Manual Tasks - Quick Reference

**File:** `/app/vylo/page.tsx`  
**Status:** 85% Complete - 5 Tasks Remaining  
**Est. Time:** 2 hours 45 minutes

---

## ✅ COMPLETED (85%)
- [x] Luminance discipline (6 backgrounds)
- [x] Stillness divider ("Selection")
- [x] Lexical austerity (Selection Criteria)
- [x] Institutional tone (all labels)
- [x] FAQ reordering (pricing last)
- [x] Founder pedigree encoding
- [x] Academic photo framing
- [x] RhythmCard motion discipline

---

## 🔲 TODO (15%)

### HIGH PRIORITY

#### 1. Prestige CTA Button Redesign (45 min)
**Find all:** Links with "Request Evaluation" text  
**Replace with:**
```tsx
<Link
  href="/book"
  className="group inline-flex items-center gap-3 px-12 py-5 bg-[#1A1A1A] hover:bg-[#2A2A2A] transition-all duration-500"
  style={{
    fontFamily: "'Manrope', sans-serif",
    fontSize: '11px',
    fontWeight: 500,
    letterSpacing: '0.15em',
    textTransform: 'uppercase',
    color: '#FFFFFF',
    border: '1px solid rgba(255,255,255,0.1)',
  }}
>
  Request Evaluation
  <motion.span 
    className="text-white/40"
    initial={{ x: 0 }}
    whileHover={{ x: 4 }}
  >
    →
  </motion.span>
</Link>
```

#### 2. Identity Gating Section (60 min)
**Location:** After line ~1830 (search for "Quarterly Report Preview")  
**Insert:**
```tsx
{/* PRIVILEGED ACCESS PREVIEW */}
<section style={{ padding: '160px 0', background: '#0A0A0A' }}>
  <div className="max-w-[900px] mx-auto px-8 md:px-12">
    <div className="relative p-16 rounded-lg" style={{
      background: 'rgba(255,255,255,0.03)',
      border: '1px solid rgba(255,255,255,0.08)',
    }}>
      <div style={{
        position: 'absolute',
        inset: 0,
        background: 'url("data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Ctext x=\'0\' y=\'45\' font-size=\'48\' fill=\'%23ffffff\' opacity=\'0.02\'%3E█%3C/text%3E%3C/svg%3E")',
        filter: 'blur(1px)',
      }} />
      
      <div className="relative">
        <div style={{
          fontSize: '13px',
          fontWeight: 600,
          letterSpacing: '0.12em',
          textTransform: 'uppercase',
          color: 'rgba(255,255,255,0.4)',
          marginBottom: '24px',
        }}>
          Confidential Performance Documentation
        </div>
        
        <h3 style={{
          fontSize: '32px',
          fontWeight: 600,
          color: '#FFFFFF',
          marginBottom: '16px',
          letterSpacing: '-0.02em',
        }}>
          Quarterly Technical Analysis
        </h3>
        
        <p style={{
          fontSize: '15px',
          lineHeight: 1.8,
          color: 'rgba(255,255,255,0.5)',
          marginBottom: '32px',
        }}>
          Comprehensive biomechanical assessment, match analytics, and developmental recommendations provided to enrolled families. Sample reports available upon committee approval.
        </p>
        
        <div style={{
          padding: '24px',
          background: 'rgba(255,255,255,0.02)',
          border: '1px solid rgba(255,255,255,0.05)',
          borderRadius: '4px',
          filter: 'blur(4px)',
          userSelect: 'none',
        }}>
          <div style={{ height: '200px', opacity: 0.3 }}>
            [Redacted Performance Metrics]
          </div>
        </div>
      </div>
    </div>
  </div>
</section>
```

#### 3. Cognitive Rest Zone (30 min)
**Location:** Before "4-Year Journey" section (search for journey/timeline content)  
**Insert:**
```tsx
{/* COGNITIVE REST ZONE */}
<section style={{ 
  minHeight: '100vh',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  background: '#FFFFFF',
  padding: '0 5%',
}}>
  <motion.div
    initial={{ opacity: 0 }}
    whileInView={{ opacity: 1 }}
    viewport={{ once: true }}
    transition={{ duration: 2 }}
    style={{ textAlign: 'center' }}
  >
    <div style={{
      fontSize: '11px',
      fontWeight: 600,
      letterSpacing: '0.2em',
      textTransform: 'uppercase',
      color: 'rgba(0,0,0,0.3)',
      marginBottom: '48px',
    }}>
      The Journey
    </div>
    
    <div style={{
      fontFamily: "'Manrope', sans-serif",
      fontSize: 'clamp(100px, 15vw, 200px)',
      fontWeight: 300,
      color: '#111111',
      letterSpacing: '-0.04em',
      lineHeight: 0.9,
    }}>
      48
    </div>
    
    <div style={{
      fontSize: '18px',
      fontWeight: 500,
      color: 'rgba(0,0,0,0.4)',
      marginTop: '24px',
      letterSpacing: '0.05em',
    }}>
      Months
    </div>
  </motion.div>
</section>
```

### MEDIUM PRIORITY

#### 4. Motion Discipline - Remove 3D Tilt (30 min)
**Components to modify:**
- MilestoneCard (search for "MilestoneCard")
- Cohort Profile stats (search for "Cohort Profile")

**Changes needed:**
- Remove `useMotionValue`, `useTransform`, `useSpring` imports if only used here
- Remove `x`, `y`, `rotateX`, `rotateY` motion values
- Remove `onMouseMove` and `onMouseLeave` handlers
- Remove `style={{ rotateX, rotateY, transformStyle, perspective }}`
- Keep all fade-in animations (`initial={{ opacity: 0, y: 30 }}`)

#### 5. Footer Label (5 min)
**Find:** "Contact" in footer section  
**Replace with:** "Office of Admissions"

---

## 🧪 TESTING CHECKLIST

After each task:
- [ ] Check file still compiles (no syntax errors)
- [ ] Visual QA on localhost
- [ ] Test on mobile viewport

After all tasks:
- [ ] Full page scroll test (all animations work)
- [ ] All CTAs link to `/book`
- [ ] FAQ pricing question is LAST
- [ ] Founder photos show double border
- [ ] No console errors

---

## 📝 COMPLETION NOTES

When finished, update:
- `CHANGES_SUMMARY.md` - Change status from 85% to 100%
- `VERIFICATION_REPORT.txt` - Mark all tasks complete
- Create git commit with message:
  ```
  feat(vylo): Complete Ultra-Luxury Audit 2.0 implementation
  
  - Prestige CTA button redesign
  - Identity gating section
  - Cognitive rest zone divider
  - Motion discipline completion
  - Footer institutional labels
  ```

---

**Priority Order:** 2 → 3 → 1 → 4 → 5  
(Identity Gating and Rest Zone are high-impact visual additions)

