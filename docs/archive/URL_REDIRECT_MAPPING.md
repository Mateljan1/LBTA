# URL Redirect Mapping
## Unbounce → Next.js Migration Plan

**CRITICAL**: This document maps your 50 Unbounce pages to the 26 Next.js pages to preserve your #1 Google ranking.

---

## Deployment Status

✅ **Staging Site Live**: https://laguna-beach-tennis-academy-8wcprhetv-andrew-mateljans-projects.vercel.app

⚠️ **Production DNS**: Currently points to WordPress.com (192.0.78.247, 192.0.78.168)

---

## When You're Ready to Go Live

1. **Add these 301 redirects** to `next.config.js` or `vercel.json`
2. **Point DNS** from WordPress.com to Vercel
3. **Monitor Google Search Console** for any ranking changes

---

## Redirect Mapping

### Junior Programs
```
/junior-academy/ → /programs/junior
/little-tennis-stars/ → /programs/junior#foundation
/red-ball-program/ → /programs/junior#red-ball
/junior-champions-tennis-program/ → /programs/junior#youth
/youth-development/ → /programs/junior#youth
/competitive-tennis-teams/ → /programs/high-performance
```

### Adult Programs
```
/adult-academy/ → /programs/adult
/adults-tennis-academy/ → /programs/adult
/beginner/ → /programs/adult#beginner
/intermediate/ → /programs/adult#intermediate
/advanced/ → /programs/adult#advanced
/advanced-beginners/ → /programs/adult#beginner
```

### Training Types
```
/live-ball-tennis/ → /match-play
/cardio-tennis/ → /programs/adult#cardio
/fit4tennis-fitness-training/ → /programs/high-performance
/private-tennis-lessons/ → /book
/private-lessons-adult/ → /book
/high-performance/ → /programs/high-performance
```

### Information Pages
```
/the-team/ → /coaches
/faq/ → /faq  ✅ (exact match)
/events/ → /contact
/camps/ → /contact
/corporate-events/ → /contact
/terms-and-conditions/ → /terms  ✅ (exact match)
/privacy-policy/ → /privacy  ✅ (exact match)
/registration/ → /book
/thank-you/ → /thank-you  ✅ (exact match)
```

### Landing Pages (Marketing/SEO)
```
/academy/ → /
/tennis-academy-near-me/ → /
/best-tennis-academy-orange-county/ → /
/tennis-training-laguna-beach/ → /
/junior-tennis-near-me/ → /programs/junior
/adult-tennis-lessons-orange-county/ → /programs/adult
/tennis-lessons-near-me/ → /
/professional-tennis-coaching/ → /coaches
/tennis-lessons-laguna-beach/ → /
/orange-county-tennis/ → /
/tennis-laguna-beach/ → /
/southern-california-tennis-academy/ → /
```

### Coaching & Team
```
/meet-the-coaches/ → /coaches
/andrew-mateljan/ → /coaches/andrew-mateljan  ✅ (exact match)
/coaching-staff/ → /coaches
```

### Programs & Pricing
```
/programs/ → /programs  ✅ (exact match)
/pricing/ → /pricing  ✅ (exact match)
/schedules/ → /schedules  ✅ (exact match)
/group-lessons/ → /programs
/semi-private/ → /book
/clinics/ → /programs
```

### Miscellaneous
```
/contact/ → /contact  ✅ (exact match)
/about/ → /about  ✅ (exact match)
/testimonials/ → /success-stories
/reviews/ → /success-stories
/gallery/ → /success-stories
/location/ → /contact
/directions/ → /contact
```

### Homepage Variants
```
/ → /  ✅ (homepage)
/home/ → /
/home-2025/ → /
```

---

## Implementation Options

### Option 1: Next.js Redirects (Recommended)
Add to `next.config.js`:
```javascript
async redirects() {
  return [
    {
      source: '/junior-academy',
      destination: '/programs/junior',
      permanent: true, // 301 redirect
    },
    {
      source: '/adult-academy',
      destination: '/programs/adult',
      permanent: true,
    },
    // ... add all redirects from above
  ]
}
```

### Option 2: Vercel Configuration
Add to `vercel.json`:
```json
{
  "redirects": [
    { "source": "/junior-academy", "destination": "/programs/junior", "permanent": true },
    { "source": "/adult-academy", "destination": "/programs/adult", "permanent": true }
  ]
}
```

---

## Missing Content Analysis

### Pages in Unbounce NOT in Next.js (Need to Build):
- None critical - all content categories covered

### Pages in Next.js NOT in Unbounce (New Features):
- `/vylo` - New VYLO Performance Institute page ✅
- `/apply-scholarship` - New scholarship application
- `/pathway-planner` - New player pathway tool
- `/philosophy` - Coaching philosophy deep dive

---

## SEO Preservation Checklist

- [ ] Add all 301 redirects before DNS change
- [ ] Submit new sitemap to Google Search Console
- [ ] Monitor 404 errors in Vercel Analytics
- [ ] Check Google Search Console for crawl errors
- [ ] Verify all pages indexed within 30 days
- [ ] Monitor ranking changes for key terms:
  - "laguna beach tennis academy"
  - "tennis lessons laguna beach"
  - "junior tennis orange county"
  - "andrew mateljan"

---

## Notes

**Large Files Excluded** (need CDN hosting):
- `public/videos/vylo-hero.mp4` (185MB)
- `public/vylo-hero.MP4` (185MB duplicate)
- Several large photos (10-26MB each)

These are excluded via `.vercelignore` to meet Vercel's 100MB file limit.
Upload to Supabase Storage or Cloudinary and update image/video paths.

---

## Next Steps

1. ✅ Staging deployed - test everything
2. ⏳ Upload large media to CDN
3. ⏳ Add 301 redirects to config
4. ⏳ Update lagunabeachtennisacademy.com DNS to Vercel
5. ⏳ Monitor SEO rankings for 30 days

---

**Current Status**: Staging only - safe to test without affecting live site or SEO.
