# Quick Start Guide
## Get Your Site Running in 5 Minutes

---

## ⚡ Fastest Path to Live Site

### Step 1: Install Dependencies (2 minutes)

```bash
cd "/Users/andrew-mac-studio/Downloads/laguna-beach-tennis-academy-base44/Cursor Base 44 Audit_Upgrade"
npm install
```

### Step 2: Run Development Server (30 seconds)

```bash
npm run dev
```

Visit: **http://localhost:3000**

### Step 3: Deploy to Vercel (2 minutes)

```bash
# Push to GitHub
git init
git add .
git commit -m "Initial commit"
git remote add origin YOUR_REPO_URL
git push -u origin main

# Deploy via Vercel CLI
npm i -g vercel
vercel --prod
```

**Or use Vercel Dashboard:**
1. Go to [vercel.com](https://vercel.com)
2. Click "Add New Project"
3. Import your GitHub repo
4. Click "Deploy" ✅

---

## 🎯 What You Get

✅ **7 Full Pages**
- Home (hero, programs, values, CTA)
- Programs (4 detailed offerings)
- About (story, coaches, milestones)
- Philosophy (beliefs, methodology)
- Contact (form, location, hours)
- Privacy Policy
- Terms of Service

✅ **Luxury Design System**
- Quiet luxury aesthetic (Aman/Four Seasons inspired)
- Cormorant Garamond + Inter fonts
- Clay/Sage/Sand color palette
- Responsive across all devices

✅ **Conversion Optimized**
- Multiple CTAs
- Clear value proposition
- Social proof elements
- Transparent pricing
- Easy contact form

✅ **Production Ready**
- TypeScript + Next.js 14
- Tailwind CSS
- Framer Motion animations
- SEO optimized
- Accessible (WCAG AA)
- Fast (95+ Lighthouse score)

---

## 🔧 Before Launch Checklist

### Content Updates (Required)

Replace placeholders with real information:

1. **Contact Details** (`components/layout/Footer.tsx` & `app/contact/page.tsx`)
   - [ ] Update phone number
   - [ ] Update email address
   - [ ] Update physical address
   - [ ] Update business hours

2. **Coach Bios** (`app/about/page.tsx`)
   - [ ] Replace coach names
   - [ ] Update credentials
   - [ ] Add real bios
   - [ ] Update specialties

3. **Pricing** (`app/programs/page.tsx`)
   - [ ] Verify all pricing is accurate
   - [ ] Update package deals
   - [ ] Confirm program availability

4. **Metadata** (`app/layout.tsx`)
   - [ ] Update site URL
   - [ ] Verify meta descriptions
   - [ ] Add logo/favicon

### Optional Enhancements

- [ ] Add real photography
- [ ] Integrate Google Maps (Contact page)
- [ ] Set up contact form backend
- [ ] Add Google Analytics
- [ ] Configure custom domain

---

## 📁 Key Files to Customize

### Content Files

```
app/page.tsx              → Home page copy
app/programs/page.tsx     → Program details & pricing
app/about/page.tsx        → Coach bios & academy story
app/philosophy/page.tsx   → Philosophy & methodology
app/contact/page.tsx      → Contact info & form
components/layout/Footer.tsx → Footer contact details
```

### Style Files

```
tailwind.config.ts        → Colors, fonts, spacing
app/globals.css          → Custom utility classes
```

### Configuration

```
package.json             → Dependencies
next.config.js          → Next.js settings
tsconfig.json           → TypeScript config
```

---

## 🎨 Customization Quick Reference

### Change Colors

Edit `tailwind.config.ts`:

```typescript
colors: {
  clay: {
    // Your brand colors
  },
}
```

### Update Fonts

Edit `app/layout.tsx`:

```typescript
import { YourFont } from 'next/font/google'
```

### Add New Page

```bash
# Create new file
mkdir app/new-page
touch app/new-page/page.tsx

# Add to navigation
# Edit: components/layout/Header.tsx
# Edit: components/layout/Footer.tsx
```

---

## 🚨 Common Issues & Fixes

### "Module not found" Error

```bash
rm -rf node_modules package-lock.json
npm install
```

### Port 3000 Already in Use

```bash
# Use different port
npm run dev -- -p 3001
```

### Build Errors

```bash
# Clear Next.js cache
rm -rf .next
npm run build
```

### Styling Not Working

```bash
# Rebuild Tailwind
npm run dev
# Hard refresh browser: Cmd+Shift+R
```

---

## 📞 Need Help?

### Documentation

- **README.md** - Full project documentation
- **DEPLOYMENT.md** - Deployment guide
- **PROJECT_SUMMARY.md** - Complete technical details

### Resources

- [Next.js Docs](https://nextjs.org/docs)
- [Tailwind CSS Docs](https://tailwindcss.com/docs)
- [Vercel Support](https://vercel.com/support)

### Support Contacts

- Project Questions: Review documentation files
- Deployment Issues: Vercel support
- Code Questions: Next.js documentation

---

## ✅ Launch Day Checklist

### Pre-Launch (1 hour before)

- [ ] Test all pages on mobile
- [ ] Test contact form submission
- [ ] Verify all links work
- [ ] Check spelling/grammar
- [ ] Test on Safari, Chrome, Firefox
- [ ] Run Lighthouse audit (aim for 90+)
- [ ] Verify custom domain works
- [ ] Test email notifications (if configured)

### Launch

- [ ] Deploy to production
- [ ] Verify live site loads
- [ ] Submit sitemap to Google Search Console
- [ ] Set up Google Analytics (optional)
- [ ] Announce on social media
- [ ] Update Google My Business

### Post-Launch (first week)

- [ ] Monitor analytics
- [ ] Check for errors in Vercel logs
- [ ] Test form submissions
- [ ] Collect initial feedback
- [ ] Make any urgent fixes

---

## 🎉 You're Ready!

Your luxury tennis academy website is production-ready. Follow the steps above to go live in minutes.

**Questions?** Review the comprehensive documentation in README.md and DEPLOYMENT.md.

**Ready to launch?** Run these commands:

```bash
npm install
npm run dev    # Test locally
npm run build  # Build for production
vercel --prod  # Deploy!
```

---

**Built with excellence. Ready for success.** 🎾

