# Final Refinements Plan

## Already Complete Today
- Homepage (hero, parallax, Movement cards)
- About page (timeline, text layout)
- Contact page (complete redesign)
- Schedules page (accordion, filters, registration)
- Footer (unified, social icons)
- Video optimization (79% reduction)
- StickyCTA, Timeline, PricingDropdown components
- Schema markup (already exists)

## Remaining Work

### 1. Coaches Page Grid Rebuild
**File:** app/coaches/page.tsx
- Replace circular portraits with rectangular 3:4 ratio
- Implement 3x2 grid layout (3 cols desktop, 1 col mobile)
- Add hover overlays with quotes
- Add CTA section below grid

### 2. Hero Overlay Verification
**Files:** All pages
- Verify Coaches, Fitness, Camps have proper gradients
- Ensure contrast >= 7:1 on all hero text

### 3. Final ARIA Pass
**Files:** Coaches, Fitness, Camps, Programs
- Add aria-labels to all interactive elements
- Add alt text to all images
- Verify tab navigation

### 4. Lighthouse Audit
- Run on Homepage, Schedules, Contact
- Target: Performance >= 90, Accessibility >= 95
- Fix any issues found

## Estimated Time: 2-3 hours
