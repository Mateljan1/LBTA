# Laguna Beach Tennis Academy

**Excellence Built Here** - A sophisticated tennis academy website built with Next.js 14, TypeScript, and Tailwind CSS. 

Combining Aman/Four Seasons-level design restraint with LBTA's bold, performance-driven brand positioning.

## 🎾 Brand Essence

### Positioning
- **NOT** a quiet spa experience  
- **YES** ATP/WTA-level training with sophisticated presentation
- Small by design. Results-driven. Honest communication.

### Key Differentiators
- ATP/WTA coaching (currently coaching ATP #258, #458)
- 20+ D1 college placements since 2020
- Official City of Laguna Beach tennis partner since 2020
- Fit4Tennis: 100K+ followers
- 3 premium locations

## 🏗️ Site Architecture

```
/                    → Home (Excellence Built Here, ATP showcases, City partnership)
/programs           → Program overview with scholarship info
/programs/junior    → Ages 3-18, real pricing ($140-$260/mo)
/programs/adult     → All NTRP levels ($180-$300/mo)
/programs/high-performance → Competitive training ($260-$520/mo)
/coaches            → 5 real coaches with photos, bios, rates
/coaches/andrew-mateljan → Dedicated founder page, ATP players, philosophy
/vylo               → VYLO Performance Institute ($2,200-3,500/mo)
/contact            → Real contact info, 4-step process, form
/faq                → Brutally honest answers
/about              → (Philosophy page - can be repurposed)
/privacy            → Privacy policy
/terms              → Terms of service
```

## 🛠️ Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS (custom LBTA brand tokens)
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **Deployment**: Vercel (recommended)
- **Booking**: book.lagunabeachtennisacademy.com

## 🎨 Design System

### Colors

```css
LBTA Orange: #f8a121     /* Primary CTA */
Burnt Orange: #e67e30    /* Accents */
Intense Orange: #E65100  /* Urgent CTAs */
Cream: #f5f1e8           /* Main background */
Tan: #f8e6bb             /* Section backgrounds */
Charcoal: #1a1a1a        /* Primary text */
Slate: #2d2d2d           /* Secondary backgrounds */
Gold: #c9a961            /* Premium accents */

VYLO Orange: #F26522     /* VYLO brand distinct */
```

### Typography

```css
Display (Headings): Cormorant Garamond - Light/Normal (300-400)
Body/UI: Montserrat - Medium (500-600)
Accent: Inter - Regular/Medium (400-500)
```

### Spacing

```css
Section Spacing: py-20 md:py-32 lg:py-40
Container: max-w-7xl with generous padding
Letter Spacing: 1.5px-3px for elegance
```

## 📦 Installation

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

## 🚀 Deployment to Vercel

### Quick Deploy

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel --prod
```

### Via Dashboard
1. Push to GitHub
2. Import to Vercel
3. Deploy automatically

## 📝 Real Content Included

### Coaches
- Andrew Mateljan ($250/hr) - ATP/WTA Coach, Founder
- Kevin Jackson ($150/hr) - College Prep, 20+ D1 placements
- Savriyan Danilov ($120/hr) - ATP Pro #556
- Andy Wu ($100/hr) - USPTA, EdD
- Michelle Bevins ($120/hr) - Youth Director

### Programs & Pricing
- Junior: $140-$260/mo (1-2x/week)
- Adult: $180-$300/mo  
- High Performance: $260-$520/mo
- Private: $100-$250/hr
- VYLO: $2,200-3,500/mo (elite tier)

### Contact
- Phone: (949) 464-6645
- Email: support@lagunabeachtennisacademy.com
- Address: 1098 Balboa Ave, Laguna Beach, CA 92651
- Hours: Mon-Fri 6AM-9PM, Sat-Sun 7AM-6PM

## ♿ Accessibility

- Semantic HTML structure
- ARIA labels where needed
- Keyboard navigation
- Focus states on all interactive elements
- WCAG AA color contrast

## 📊 Performance

- Next.js Image optimization
- Font optimization via next/font
- Component code splitting
- Minimal JavaScript
- Target: 95+ Lighthouse score

## 🎯 Conversion Strategy

**Primary CTA:** "Start Free Trial" / "Book Free Trial"
- Links to: book.lagunabeachtennisacademy.com
- UTM tracking: &utm_source=website&utm_medium=...&utm_campaign=nextjs

**Trust Builders:**
- Free trial (zero commitment)
- Transparent pricing
- Scholarship program ($25K+ annually)
- 100% satisfaction guarantee
- Real testimonials and ATP player showcases

## 🔧 Customization

### Update Content

All content is in page components:
- `app/page.tsx` → Home page
- `app/programs/**/page.tsx` → Program pages
- `app/coaches/**/page.tsx` → Coach pages
- etc.

### Update Colors

Edit `tailwind.config.ts`:

```typescript
colors: {
  lbta: {
    orange: '#f8a121',
    // ... your colors
  }
}
```

### Update Coaches

Edit coach data in:
- `app/coaches/page.tsx` (coaches array)
- `app/coaches/andrew-mateljan/page.tsx`

## 📞 Support

For questions:
- Email: support@lagunabeachtennisacademy.com
- Phone: (949) 464-6645

## 📄 License

© 2025 Laguna Beach Tennis Academy. All rights reserved.

---

**Built with restraint, precision, and commitment to excellence.**
