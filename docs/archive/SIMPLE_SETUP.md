# 🎯 SIMPLE SETUP - 3 Quick Steps

## Step 1: Copy ALL Photos (Drag & Drop)

**Open Finder and do this:**

1. **Navigate to:** iCloud Drive → Workspace → Manual Library → Brands → LBTA → Laguna_Beach_Tennis_Academy_CONSOLIDATED → Business_Documents → Content → Images → **LBTA Photos**

2. **Select ALL photos** (Cmd+A)

3. **Drag them into:** 
   Downloads → laguna-beach-tennis-academy-base44 → Cursor Base 44 Audit_Upgrade → **public → photos**

**Result:** Gallery will have ~240 high-quality photos to choose from

---

## Step 2: Copy Logos (Drag & Drop)

**You showed me these PNGs - save each to public/logos/:**

From the images you sent:

| Logo Image You Showed | Save As |
|-----------------------|---------|
| FIT4TENNIS (gray with yellow ball) | `public/logos/fit4tennis.png` |
| VYLO (black V logo) | `public/logos/vylo.png` |
| RACKETRESCUE (red logo) | `public/logos/racketrescue.png` |
| RacquetIQ (blue/teal) | `public/logos/racquetiq.png` |
| GPTCA (shield logo) | `public/logos/gptca.png` |
| TOROLINE (green script) | `public/logos/toroline.png` |
| TENNIS BEAST (yellow impact) | `public/logos/tennisbeast.png` |
| LBHS (wave circle) | `public/logos/lbhs.png` |

**Drag each PNG into:**  
Downloads → laguna-beach-tennis-academy-base44 → Cursor Base 44 Audit_Upgrade → **public → logos**

---

## Step 3: Fix Videos (Check Vimeo IDs)

**If videos aren't playing, check these Vimeo IDs are correct:**

Current IDs in gallery:
- 1002037886 (Junior Academy)
- 1002038009 (Private Lessons)
- 1002037960 (Adult Programs)
- 533673103 (Movement Training)

**To update Vimeo IDs:**
1. Open: `components/ui/PhotoVideoGallery.tsx`
2. Find the `galleryItems` array at top
3. Update `vimeoId: 'XXXXXXX'` with correct IDs from your Vimeo account

---

## ✅ After Setup

**Refresh:** http://localhost:3002

**You'll see:**
- ✅ Gallery with all photos
- ✅ Videos playing (if IDs are correct)
- ✅ All 8 partner logos showing
- ✅ Logos in Beyond the Court section

---

## 🎬 Why Videos Might Not Play

**Check:**
1. Are videos public on Vimeo? (not private/password protected)
2. Are Vimeo IDs correct?
3. Does Vimeo allow embedding?

**Test a Vimeo ID:**  
Visit: `https://player.vimeo.com/video/1002037886`  
If it loads → ID is good  
If error → ID is wrong or video is private

---

**The code is ready - just need those asset files in the right folders!** 🎾

