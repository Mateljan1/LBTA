# LBTA Final Optimization & GA4 Integration Plan

**GA4 Measurement ID:** G-VCH0K84TSF  
**Stream ID:** 13135115539  
**Estimated Time:** 1.5-2 hours

---

## Task 1: Google Analytics 4 Integration (15 min)

### File to Modify
`app/layout.tsx`

### Implementation

Add GA4 tracking script to the layout head section:

```typescript
import Script from 'next/script'

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        {/* Google Analytics 4 */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-VCH0K84TSF"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-VCH0K84TSF', {
              page_path: window.location.pathname,
              send_page_view: true
            });
          `}
        </Script>
      </head>
      <body>
        {children}
      </body>
    </html>
  )
}
```

### Event Tracking

Create `lib/analytics.ts`:
```typescript
export const trackEvent = (eventName: string, parameters?: Record<string, any>) => {
  if (typeof window !== 'undefined' && (window as any).gtag) {
    (window as any).gtag('event', eventName, parameters)
  }
}

// Pre-defined events
export const events = {
  bookTraining: () => trackEvent('book_training_click', { location: window.location.pathname }),
  formSubmit: (formType: string) => trackEvent('form_submission', { form_type: formType }),
  registerProgram: (program: string) => trackEvent('register_program', { program_name: program }),
  newsletterSignup: () => trackEvent('newsletter_signup'),
}
```

Add tracking to buttons:
```typescript
<Link 
  href="/book" 
  onClick={() => events.bookTraining()}
>
  Book Training →
</Link>
```

---

## Task 2: Navigation Simplification (20 min)

### File to Modify
`components/layout/Header.tsx`

### New Navigation Structure

```typescript
const navigation = [
  { name: 'Programs', href: '/programs' },
  { name: 'Schedules', href: '/schedules' },
  { name: 'Coaches', href: '/coaches' },
  { name: 'Camps', href: '/camps' },
  { name: 'Fitness', href: '/fitness' },
  { name: 'About', href: '/about' },
  { name: 'Contact', href: '/contact' },
]
```

### Update CTA Button

Change "Book Trial" → "Book Training":
```typescript
<Link
  href="/book"
  className="bg-gradient-to-r from-lbta-red to-lbta-orange hover:opacity-90 text-white font-sans font-semibold text-[14px] md:text-[16px] py-3 px-8 rounded-full transition-all duration-200"
>
  BOOK TRAINING
</Link>
```

---

## Task 3: Page Visibility Management (20 min)

### Files to Update

For each hidden page, add noindex meta tag:

**Files:**
- `app/philosophy/page.tsx`
- `app/pricing/page.tsx`
- `app/beginner-program/page.tsx`
- `app/adult-trial/page.tsx`
- `app/junior-trial/page.tsx`
- `app/vylo/page.tsx`
- `app/vylo-apply/page.tsx`
- `app/success-stories/page.tsx`

**Add to each:**
```typescript
export const metadata = {
  title: 'Page Title',
  robots: {
    index: false,
    follow: false,
  }
}
```

---

## Task 4: Redirects Setup (15 min)

### File to Create
`next.config.js` or `middleware.ts`

**Option A: next.config.js**
```javascript
module.exports = {
  async redirects() {
    return [
      {
        source: '/pricing',
        destination: '/schedules',
        permanent: true,
      },
      {
        source: '/beginner-program',
        destination: '/programs',
        permanent: true,
      },
      {
        source: '/philosophy',
        destination: '/about',
        permanent: true,
      },
    ]
  },
}
```

---

## Task 5: Robots.txt & Sitemap (15 min)

### Create/Update `public/robots.txt`

```txt
User-agent: *
Allow: /
Disallow: /vylo
Disallow: /vylo-apply
Disallow: /beginner-program
Disallow: /adult-trial
Disallow: /junior-trial
Disallow: /pricing
Disallow: /philosophy
Disallow: /success-stories

Sitemap: https://lagunabeachtennisacademy.com/sitemap.xml
```

### Generate Sitemap

Create `app/sitemap.ts`:
```typescript
import { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: 'https://lagunabeachtennisacademy.com',
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1,
    },
    {
      url: 'https://lagunabeachtennisacademy.com/programs',
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: 'https://lagunabeachtennisacademy.com/schedules',
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: 'https://lagunabeachtennisacademy.com/coaches',
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: 'https://lagunabeachtennisacademy.com/camps',
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: 'https://lagunabeachtennisacademy.com/fitness',
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: 'https://lagunabeachtennisacademy.com/about',
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    {
      url: 'https://lagunabeachtennisacademy.com/contact',
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: 'https://lagunabeachtennisacademy.com/book',
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.9,
    },
  ]
}
```

---

## Task 6: Event Tracking Implementation (20 min)

### Update Components with Tracking

**RegistrationModal.tsx:**
```typescript
import { events } from '@/lib/analytics'

// On successful registration
if (response.ok) {
  events.registerProgram(program.program)
  setIsSuccess(true)
}
```

**Footer.tsx (Newsletter):**
```typescript
if (response.ok) {
  events.newsletterSignup()
  setStatus('success')
}
```

**Contact page:**
```typescript
if (response.ok) {
  events.formSubmit('contact')
  setStatus('success')
}
```

**All "Book Training" buttons:**
```typescript
<Link 
  href="/book"
  onClick={() => events.bookTraining()}
>
  Book Training →
</Link>
```

---

## Implementation Order

1. Add GA4 script to layout.tsx
2. Create lib/analytics.ts helper
3. Update navigation (Header.tsx)
4. Add noindex tags to hidden pages
5. Create redirects in next.config.js
6. Update robots.txt
7. Create sitemap.ts
8. Add event tracking to components
9. Test analytics in GA4 Real-Time view
10. Verify redirects work
11. Test sitemap in Google Search Console

---

## Files to Create

- `lib/analytics.ts` (event tracking helper)
- `app/sitemap.ts` (dynamic sitemap)
- `next.config.js` (redirects, if doesn't exist)
- `public/robots.txt` (if doesn't exist)

## Files to Modify

- `app/layout.tsx` (GA4 scripts)
- `components/layout/Header.tsx` (navigation update)
- `components/layout/Footer.tsx` (newsletter tracking)
- `components/RegistrationModal.tsx` (registration tracking)
- `app/contact/page.tsx` (contact form tracking)
- 8 hidden pages (add noindex meta)

---

## Testing Checklist

After implementation:
- [ ] GA4 Real-Time shows pageviews
- [ ] Click "Book Training" → event appears in GA4
- [ ] Submit contact form → event tracked
- [ ] Register for program → event tracked
- [ ] Subscribe to newsletter → event tracked
- [ ] Visit /pricing → redirects to /schedules
- [ ] Visit /philosophy → redirects to /about
- [ ] Check robots.txt accessible
- [ ] Verify sitemap.xml loads
- [ ] Hidden pages not in navigation

---

**Ready to create the full implementation plan with your GA4 ID (G-VCH0K84TSF)?**