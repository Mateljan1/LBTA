# LBTA Mobile Navigation & UX Refinements Plan

**Target Site:** https://lagunabeachtennisacademy.com  
**Estimated Time:** 1.5-2 hours  
**Complexity:** Medium

---

## Task 1: Chat Widget Overlap Fix (5 minutes)

### Current Issue
Chat widget (z-index ~40-50) overlaps filter dropdowns and sticky CTAs on mobile.

### Files to Modify
- `app/schedules/page.tsx` (filter bar z-index)
- `components/StickyCTA.tsx` (sticky CTA z-index)
- `components/MobileFilterOverlay.tsx` (overlay z-index)

### Implementation

**Update filter bar z-index:**
```typescript
// Line ~150 in app/schedules/page.tsx
<div className="sticky top-0 z-50 bg-white/95...">  // Changed from z-40 to z-50
```

**Add bottom padding to content:**
```typescript
// Add to main sections
<section className="... pb-20 md:pb-24">  // Adds 80px bottom padding
```

**Update chat widget z-index** (if we have control):
- Set to z-30 (below filters and CTAs)

### Expected Result
- Filters always appear above chat widget
- Sticky CTAs don't overlap with chat
- Clean layering hierarchy

---

## Task 2: LiveBall Time Correction (5 minutes)

### Current Issue
LiveBall session times are incorrect in data files.

### Files to Modify
- `data/winter2026.json`
- `data/fall2025.json` (if applicable)

### Corrections Needed

**LiveBall Intermediate:**
```json
{
  "schedule": [
    { "day": "Thursday", "time": "6:00-7:30 PM", "location": "LBHS" },  // Was incorrect
    { "day": "Sunday", "time": "9:00-10:30 AM", "location": "LBHS" }   // Was 9:00-10:00 AM
  ]
}
```

### Expected Result
- Accurate times displayed on /schedules
- Consistent across all pages
- No confusion for registrants

---

## Task 3: Mobile Nav Tab Behavior (10 minutes)

### Current Issue
Navigation links may open in new tabs or create duplicate windows.

### Files to Modify
- `components/layout/Header.tsx` (or wherever mobile nav is)

### Implementation

**Remove target="_blank" from internal links:**
```typescript
// BEFORE
<a href="/programs" target="_blank">Programs</a>

// AFTER
<Link href="/programs">Programs</Link>
```

**Add menu auto-close:**
```typescript
const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

<Link 
  href="/programs" 
  onClick={() => setMobileMenuOpen(false)}  // Auto-close on tap
>
  Programs
</Link>
```

### Expected Result
- All navigation stays in same tab
- Menu closes after selection
- Smooth page transitions

---

## Task 4: Accordion Default State (10 minutes)

### Current Issue
Junior Programs accordion is expanded by default (line in schedules page).

### Files to Modify
- `app/schedules/page.tsx`

### Implementation

**Change initial state:**
```typescript
// Line ~20
const [expandedAccordions, setExpandedAccordions] = useState<string[]>(['Junior'])

// CHANGE TO:
const [expandedAccordions, setExpandedAccordions] = useState<string[]>([])
```

**Ensure smooth animations:**
```css
/* Already implemented in globals.css */
.accordion-content {
  transition: max-height 300ms cubic-bezier(0.25, 0.1, 0.25, 1);
}
```

**Auto-scroll on expand** (already implemented):
```typescript
setTimeout(() => {
  element?.scrollIntoView({ behavior: 'smooth', block: 'start' })
}, 250)
```

### Expected Result
- All accordions collapsed on page load
- Clean, minimal initial view
- Smooth expand animations
- Auto-scroll to expanded section

---

## Task 5: Navigation Flow Cleanup (10 minutes)

### Files to Modify
- All page files (check for anchors)
- `app/layout.tsx` (add canonical tags)

### Implementation

**Remove redundant anchors:**
```typescript
// Find and remove references like:
<Link href="/programs#junior">  // Remove #junior
<Link href="/programs">          // Use clean URLs
```

**Add canonical tags:**
```typescript
// In each page's metadata
export const metadata = {
  ...
  alternates: {
    canonical: 'https://lagunabeachtennisacademy.com/programs'
  }
}
```

### Expected Result
- Clean URL structure
- Proper SEO canonical tags
- Clear user journey: Programs → Schedules → Book

---

## Task 6: Mobile Layout Polish (15 minutes)

### Files to Modify
- `components/layout/Footer.tsx`
- `components/StickyCTA.tsx`
- All page files with sticky elements

### Implementation

**Add iOS safe area support:**
```typescript
<div className="... pb-[calc(80px+env(safe-area-inset-bottom))]">
```

**Increase footer bottom padding:**
```typescript
// In Footer.tsx
<footer className="... pb-24 md:pb-20">  // 100px mobile padding
```

**Add safe-area to sticky CTAs:**
```typescript
<div className="fixed bottom-0 ... pb-[env(safe-area-inset-bottom)]">
```

### Expected Result
- No content cut off on iPhones with notches
- Consistent spacing on all devices
- CTAs properly positioned

---

## Task 7: Mobile Navigation Redesign (30 minutes)

### Files to Create/Modify
- `components/layout/Header.tsx` or mobile nav component

### Implementation

**Glass morphism drawer:**
```typescript
<div className={`
  fixed inset-y-0 right-0 w-[85%] max-w-sm
  backdrop-blur-md bg-[#FAF8F3]/95
  transform transition-transform duration-300
  ${isOpen ? 'translate-x-0' : 'translate-x-full'}
`}>
  {/* Gradient overlay */}
  <div className="absolute inset-0 bg-gradient-to-b from-black/5 to-transparent pointer-events-none" />
  
  {/* Navigation Links */}
  <nav className="p-6 pt-20">
    <ul className="space-y-6">
      {navItems.map((item, index) => (
        <li 
          key={item.href}
          style={{ animationDelay: `${index * 50}ms` }}
          className="animate-fade-in-up"
        >
          <Link
            href={item.href}
            onClick={() => setIsOpen(false)}
            className="font-serif text-[20px] text-black/90 hover:text-lbta-orange transition-colors"
          >
            {item.name}
          </Link>
        </li>
      ))}
    </ul>
    
    {/* CTA */}
    <Link
      href="/book"
      className="mt-8 block w-full bg-gradient-to-r from-lbta-red to-lbta-orange text-white text-center py-4 rounded-full font-sans font-semibold"
    >
      Book Training →
    </Link>
  </nav>
</div>
```

**Hide chat when drawer open:**
```typescript
useEffect(() => {
  if (isOpen) {
    document.querySelector('.chat-widget')?.classList.add('hidden')
  } else {
    document.querySelector('.chat-widget')?.classList.remove('hidden')
  }
}, [isOpen])
```

### Expected Result
- Elegant glass-morphism drawer
- Staggered link fade-ins
- Chat widget hides automatically
- Professional, cinematic feel

---

## Task 8: Interaction Refinements (15 minutes)

### Files to Modify
- All button/CTA components
- Accordion components
- Footer social icons

### Implementation

**CTA hover/tap animation:**
```css
.cta-button {
  transition: transform 150ms cubic-bezier(0.25, 0.1, 0.25, 1);
}
.cta-button:active {
  transform: scale(0.97);
}
```

**Accordion chevron rotation:**
```typescript
<ChevronDown 
  className={`transition-transform duration-300 ${
    isExpanded ? 'rotate-180' : 'rotate-0'
  }`}
/>
```

**Footer social icon hover:**
```css
.social-icon {
  transition: transform 200ms ease-out;
}
.social-icon:hover {
  transform: translateY(-3px);
}
```

**Sticky CTA fade-in:**
```typescript
<div className={`
  fixed bottom-0 transition-opacity duration-300
  ${isVisible ? 'opacity-100' : 'opacity-0 pointer-events-none'}
`}>
```

### Expected Result
- Tactile button feedback
- Smooth chevron rotation
- Subtle icon lifts
- Professional polish throughout

---

## Implementation Order

1. ✅ Chat widget z-index fixes (quick win)
2. ✅ LiveBall time corrections (data update)
3. ✅ Accordion default state (one-line change)
4. ✅ Mobile nav tab behavior (Link component updates)
5. ✅ Navigation flow cleanup (remove anchors, add canonicals)
6. ✅ Mobile layout polish (safe-area, padding)
7. ✅ Mobile nav redesign (glass morphism drawer)
8. ✅ Interaction refinements (animations, hover effects)

---

## Files to Modify

### Data
- `data/winter2026.json` (LiveBall times)
- `data/fall2025.json` (if applicable)

### Components
- `components/layout/Header.tsx` (mobile nav)
- `components/layout/Footer.tsx` (social hover, padding)
- `components/StickyCTA.tsx` (safe-area, fade-in)
- `components/MobileFilterOverlay.tsx` (z-index)
- `app/schedules/page.tsx` (accordion default, filter z-index)

### Pages
- All pages (canonical tags, anchor cleanup)

### Styles
- `app/globals.css` (interaction animations)

---

## Testing Checklist

After implementation:

- [ ] Test on iPhone 13/14/15 (Safari)
- [ ] Test on Galaxy S23 (Chrome)
- [ ] Verify chat widget doesn't overlap
- [ ] Verify all accordions collapsed by default
- [ ] Test navigation (no duplicate tabs)
- [ ] Check footer spacing on small devices
- [ ] Verify safe-area padding on notched iPhones
- [ ] Test glass-morphism drawer animation
- [ ] Verify all hover/tap animations smooth

---

## Expected Outcomes

### User Experience
- Seamless navigation (no tab duplication)
- Clean initial view (accordions collapsed)
- No UI element overlaps
- Smooth animations throughout

### Visual
- Glass-morphism mobile nav
- Cinematic drawer animations
- Professional interaction polish
- Brand-consistent motion

### Technical
- Proper z-index layering
- iOS safe-area support
- Accurate schedule data
- Clean URL structure

---

**Ready to implement when you switch to Agent mode!**
