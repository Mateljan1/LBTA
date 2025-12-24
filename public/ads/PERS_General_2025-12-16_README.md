# LBTA Static Ad Images

Professional static image ads for your three programs, designed for social media marketing.

## 📁 Files Created

1. **beginner-program-ad.html** - Foundation 12-Week Program
2. **junior-development-ad.html** - Junior Development Program
3. **high-performance-ad.html** - High Performance Program

## 🎨 Design Features

### Beginner Program Ad
- **Color Scheme:** Navy blue & sky blue
- **Messaging:** "Build Championship Fundamentals"
- **Target:** Ages 3-18 & adults, beginners
- **Key Features:** ATP/WTA coaching, small classes, 12-week curriculum

### Junior Development Ad
- **Color Scheme:** Teal & green
- **Messaging:** "Build The Next Champion"
- **Target:** Ages 8-18, competitive players
- **Key Features:** 20+ D1 placements, tournament prep, mental game

### High Performance Ad
- **Color Scheme:** Black & gold (premium)
- **Messaging:** "Excellence Built Here"
- **Target:** Elite players, college-bound athletes
- **Key Features:** Professional training, D1 pipeline, stats showcase

## 📸 How to Export as Images

### Method 1: Screenshot (Quick)
1. Open any HTML file in your browser
2. Press **F11** for fullscreen (or View → Full Screen)
3. Take screenshot:
   - **Mac:** Cmd + Shift + 4, then drag to select
   - **Windows:** Windows + Shift + S
4. Save as PNG/JPG

### Method 2: Browser DevTools (Precise)
1. Open HTML file in Chrome/Edge
2. Right-click → Inspect
3. Press Cmd+Shift+P (Mac) or Ctrl+Shift+P (Windows)
4. Type "screenshot" → Select "Capture full size screenshot"
5. Image saves automatically at 1080x1080px

### Method 3: Online Tools
1. Open HTML file in browser
2. Copy full URL (file:// path)
3. Use online HTML-to-image converter:
   - https://htmlcsstoimage.com/
   - https://html2canvas.hertzen.com/
4. Download as PNG

### Method 4: Playwright/Puppeteer (Advanced)
```javascript
const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  await page.setViewport({ width: 1080, height: 1080 });
  await page.goto('file:///path/to/beginner-program-ad.html');
  await page.screenshot({ path: 'beginner-ad.png' });

  await browser.close();
})();
```

## 🎯 Recommended Use Cases

### Beginner Program Ad
- Facebook/Instagram ads targeting parents
- Google Display ads
- Email marketing campaigns
- Website hero section

### Junior Development Ad
- Instagram/Facebook targeting competitive tennis families
- Tournament program promotions
- College recruiting showcases
- Youth sports directories

### High Performance Ad
- Premium Instagram/Facebook campaigns
- College recruiting materials
- Elite tournament sponsorships
- Partnership proposals

## 📱 Social Media Specs

All ads are designed at **1080x1080px** (Instagram/Facebook square format).

**Perfect for:**
- Instagram Feed Posts (1:1)
- Facebook Feed Posts (1:1)
- Instagram Stories (resize to 1080x1920)
- LinkedIn Posts (1:1)
- Twitter/X Posts (1:1)

**To resize for Stories (9:16):**
1. Open in browser
2. Inspect element → `.ad-container`
3. Change height to `1920px`
4. Screenshot again

## 🔄 Customization

Each HTML file is self-contained with inline CSS. To customize:

1. **Change colors:** Find hex codes in CSS (e.g., `#1a2b4a`)
2. **Update text:** Edit content in HTML sections
3. **Swap images:** Change `src="../UPDATED LBTA PICS/..."` path
4. **Adjust sizes:** Modify font-size values in CSS

## 📊 Meta Pixel Tracking

When using these ads in campaigns, ensure:
- Meta Pixel is installed on landing pages
- UTM parameters added to destination URLs
- Conversion events configured in Meta Events Manager

## 🚀 Quick Start

1. **View the ads:**
   ```bash
   open public/ads/beginner-program-ad.html
   open public/ads/junior-development-ad.html
   open public/ads/high-performance-ad.html
   ```

2. **Export all ads at once:**
   - Open all three HTML files in separate browser tabs
   - Use Method 2 (DevTools screenshot) on each tab
   - Save with descriptive names

3. **Upload to Meta Ads Manager:**
   - Go to Meta Ads Manager → Create Ad
   - Upload PNG images
   - Set destination URLs to your landing pages
   - Add UTM parameters for tracking

## 💡 Pro Tips

- Use **PNG format** for best quality (no compression artifacts)
- Test ads on mobile devices before launching campaigns
- A/B test different versions with small budget first
- Update images seasonally (e.g., Winter 2026 → Spring 2026)
- Track click-through rates and adjust messaging accordingly

## 🎨 Design Philosophy

These ads follow modern social media advertising best practices:
- **Bold typography** for thumb-stopping power
- **Clean layouts** for easy mobile viewing
- **Contrasting CTAs** for high click-through rates
- **Professional imagery** from your LBTA photo library
- **Trust signals** (20+ D1 placements, ATP/WTA coaching)

## 📞 Need Modifications?

Contact Andrew or update the HTML files directly. All code is commented and easy to modify.

---

**Created:** December 2025
**Format:** 1080x1080px HTML ads
**Rendering:** Works in all modern browsers
**Export:** Screenshot or HTML-to-image tools