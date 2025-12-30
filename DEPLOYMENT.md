# Deployment Guide
## Laguna Beach Tennis Academy

This guide walks you through deploying your website to production using Vercel (recommended) or alternative platforms.

---

## 🚀 Quick Start: Vercel Deployment

### Prerequisites
- Git repository (GitHub, GitLab, or Bitbucket)
- Vercel account (free tier available)

### Step-by-Step Deployment

#### 1. Push to Git

```bash
cd "/Users/andrew-mac-studio/Downloads/laguna-beach-tennis-academy-base44/Cursor Base 44 Audit_Upgrade"
git init
git add .
git commit -m "Initial commit: Laguna Beach Tennis Academy"
git remote add origin YOUR_REPO_URL
git push -u origin main
```

#### 2. Connect to Vercel

**Option A: Vercel Dashboard**
1. Visit [vercel.com](https://vercel.com)
2. Click "Add New Project"
3. Import your repository
4. Vercel auto-detects Next.js—no configuration needed
5. Click "Deploy"

**Option B: Vercel CLI**
```bash
npm i -g vercel
vercel login
vercel
vercel --prod
```

#### 3. Configure Domain (Optional)

1. In Vercel dashboard, go to your project
2. Click "Settings" → "Domains"
3. Add your custom domain (e.g., lbtennisacademy.com)
4. Update DNS records as instructed by Vercel

---

## 🔧 Environment Setup

### No Environment Variables Required

The site works out-of-the-box. For production enhancements, optionally add:

```env
NEXT_PUBLIC_SITE_URL=https://lbtennisacademy.com
```

### Future Enhancements

For contact form backend integration, you'll need:

```env
CONTACT_FORM_EMAIL=info@lbtennisacademy.com
SENDGRID_API_KEY=your_api_key
```

---

## 📊 Performance Checklist

Before deployment, verify:

- [ ] All images optimized (use Next.js Image component)
- [ ] Fonts loading via next/font (already configured)
- [ ] No console errors in production build
- [ ] Lighthouse score 90+ across all metrics
- [ ] Mobile responsiveness tested
- [ ] Forms tested and functional
- [ ] All links working

### Test Production Build Locally

```bash
npm run build
npm start
# Visit http://localhost:3000
```

---

## 🌐 Alternative Deployment Platforms

### Netlify

```bash
# Install Netlify CLI
npm install -g netlify-cli

# Deploy
netlify deploy --prod
```

**netlify.toml** (create if needed):
```toml
[build]
  command = "npm run build"
  publish = ".next"

[[plugins]]
  package = "@netlify/plugin-nextjs"
```

### Railway

1. Visit [railway.app](https://railway.app)
2. Click "New Project" → "Deploy from GitHub"
3. Select your repository
4. Railway auto-detects Next.js
5. Click "Deploy"

### DigitalOcean App Platform

1. Visit [cloud.digitalocean.com/apps](https://cloud.digitalocean.com/apps)
2. Click "Create App"
3. Connect your repository
4. Configure build settings:
   - Build Command: `npm run build`
   - Run Command: `npm start`
5. Deploy

---

## 🔐 Production Checklist

### Security
- [ ] HTTPS enabled (automatic with Vercel)
- [ ] Environment variables secured
- [ ] No API keys in client code
- [ ] Security headers configured

### SEO
- [ ] Sitemap submitted to Google Search Console
- [ ] robots.txt configured (already included)
- [ ] Meta descriptions on all pages (already included)
- [ ] Open Graph tags present (already included)
- [ ] Structured data implemented (consider adding)

### Analytics (Optional)
- [ ] Google Analytics configured
- [ ] Conversion tracking set up
- [ ] Error tracking (Sentry) integrated

---

## 📧 Contact Form Backend Setup

The contact form currently shows success messages client-side. For production:

### Option 1: Vercel Functions (Serverless)

Create `api/contact.ts`:

```typescript
import { NextRequest, NextResponse } from 'next/server'
import nodemailer from 'nodemailer'

export async function POST(request: NextRequest) {
  const body = await request.json()
  
  // Configure your email service
  const transporter = nodemailer.createTransport({
    // Your SMTP config
  })
  
  await transporter.sendMail({
    from: process.env.CONTACT_FORM_EMAIL,
    to: 'info@lbtennisacademy.com',
    subject: `New inquiry from ${body.name}`,
    html: `
      <h2>New Contact Form Submission</h2>
      <p><strong>Name:</strong> ${body.name}</p>
      <p><strong>Email:</strong> ${body.email}</p>
      <p><strong>Program:</strong> ${body.program}</p>
      <p><strong>Message:</strong> ${body.message}</p>
    `
  })
  
  return NextResponse.json({ success: true })
}
```

### Option 2: Third-Party Services

**FormSpree**
```typescript
// Replace form action in contact/page.tsx
action="https://formspree.io/f/YOUR_FORM_ID"
```

**SendGrid**
- Sign up at sendgrid.com
- Get API key
- Add to environment variables
- Integrate via API

---

## 🔄 Continuous Deployment

Vercel automatically deploys on git push:

1. **Push to main** → Production deployment
2. **Push to feature branch** → Preview deployment
3. **Pull request** → Automatic preview URL

### Git Workflow

```bash
# Create feature branch
git checkout -b feature/new-program

# Make changes and commit
git add .
git commit -m "Add new program offering"

# Push for preview
git push origin feature/new-program

# Merge to main for production
git checkout main
git merge feature/new-program
git push origin main
```

---

## 📈 Monitoring

### Vercel Analytics (Built-in)

Vercel provides:
- Real User Monitoring (RUM)
- Web Vitals tracking
- Performance insights
- Geographic distribution

Access via: Project → Analytics

### Custom Monitoring

Consider adding:
- **Sentry**: Error tracking
- **LogRocket**: Session replay
- **Hotjar**: User behavior analytics

---

## 🆘 Troubleshooting

### Build Fails

```bash
# Clear cache and rebuild
rm -rf .next
npm run build
```

### Images Not Loading

Verify `next.config.js` has proper image domains configured.

### Fonts Not Loading

Fonts are loaded via next/font—verify internet connection during build.

### 404 on Routes

Ensure all pages are in `app/` directory with proper naming.

---

## 📞 Support

**Deployment Issues:**
- Vercel: [vercel.com/support](https://vercel.com/support)
- Next.js: [nextjs.org/docs](https://nextjs.org/docs)

**Code Questions:**
- Review README.md
- Check Next.js documentation
- Inspect browser console for errors

---

## ✅ Post-Deployment

1. **Test thoroughly**
   - Navigate all pages
   - Submit contact form
   - Test on mobile devices
   - Verify all links

2. **Monitor performance**
   - Check Vercel Analytics
   - Run Lighthouse audit
   - Monitor error rates

3. **Update DNS**
   - Point your domain to Vercel
   - Add www redirect if desired
   - Verify SSL certificate

4. **Launch marketing**
   - Submit to Google Search Console
   - Update Google My Business
   - Share on social media

---

**Deployed successfully?** 🎉

Your luxury tennis academy website is now live and ready to welcome students.

