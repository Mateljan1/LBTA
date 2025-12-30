# ActiveCampaign Email Marketing - Quick Start Guide

## 🚀 Get Started in 5 Minutes

### Step 1: Set Up API Access (1 minute)

```bash
# Add to your ~/.zshrc or ~/.bashrc
export ACTIVECAMPAIGN_API_KEY="your-api-key-here"
export ACTIVECAMPAIGN_URL="https://lbta.api-us1.com"

# Reload your shell
source ~/.zshrc
```

**Where to find your API key:**
1. Log in to ActiveCampaign: lbta.activehosted.com
2. Go to Settings → Developer
3. Copy your API key and URL

---

### Step 2: Test Your Connection (30 seconds)

```bash
cd "/Users/andrew-mac-studio/LBTA Build 12:16/LBTA/skills/activecampaign-email-marketing"

# List all your contact lists
python scripts/manage_lists.py --action list
```

**Expected output:**
```
📋 Contact Lists (5 total):

   ID: 1
   Name: All Contacts
   Subscribers: 1,234
   Created: 2024-01-15
   ...
```

---

### Step 3: Create Your First Campaign (3 minutes)

#### Example: Winter 2026 Registration Email

```bash
python scripts/create_campaign.py \
  --name "Winter 2026 Registration Open" \
  --subject "Winter Classes Start January 5th — Register by Dec 20th" \
  --template "assets/templates/season-launch.html" \
  --list "All Contacts"
```

**What happens:**
- ✅ Creates a draft campaign in ActiveCampaign
- ✅ Uses the luxury-branded season launch template
- ✅ Targets your "All Contacts" list
- ✅ Returns campaign ID for testing

**Output:**
```
✅ Campaign created successfully!
   Campaign ID: 456
   Name: Winter 2026 Registration Open
   Subject: Winter Classes Start January 5th — Register by Dec 20th
   List: All Contacts (ID: 1)
   Status: Draft
   View in ActiveCampaign: https://lbta.activehosted.com/app/campaigns/456
```

---

### Step 4: Send a Test Email (30 seconds)

```bash
python scripts/send_test.py \
  --campaign-id 456 \
  --email andrew@lagunabeachtennisacademy.com
```

**Output:**
```
📧 Sending test email...
   Campaign: Winter 2026 Registration Open
   To: andrew@lagunabeachtennisacademy.com
✅ Test email sent successfully
```

---

### Step 5: Review & Send (In ActiveCampaign)

1. Open the link from Step 3
2. Review the email design and content
3. Make any final edits
4. Schedule or send immediately

---

## 📧 Common Campaign Examples

### 1. Season Launch Email

```bash
python scripts/create_campaign.py \
  --name "Spring 2026 Registration Open" \
  --subject "Spring Tennis Starts April 6th" \
  --template "assets/templates/season-launch.html" \
  --list "All Contacts"
```

**Best for:** Winter/Spring/Summer/Fall registration announcements
**Timeline:** 4-6 weeks before season start
**Segment:** All active contacts

---

### 2. JTT Announcement

```bash
python scripts/create_campaign.py \
  --name "Spring JTT Registration Open" \
  --subject "Junior Team Tennis — Join the Team" \
  --template "assets/templates/jtt-announcement.html" \
  --list "Junior Parents"
```

**Best for:** Junior Team Tennis registration
**Timeline:** 6 weeks before season start
**Segment:** Junior parents (ages 7-17)

---

### 3. Monthly Newsletter

```bash
python scripts/create_campaign.py \
  --name "January 2026 Newsletter" \
  --subject "January Newsletter: Winter Classes + Australian Open Preview" \
  --template "assets/templates/newsletter.html" \
  --list "All Contacts"
```

**Best for:** Monthly community updates
**Timeline:** First Tuesday of each month
**Segment:** All engaged contacts

---

## 🎯 Segmentation Quick Reference

### Create a New List

```bash
python scripts/manage_lists.py \
  --action create \
  --name "Winter 2026 Leads"
```

### Add Contact to List

```bash
python scripts/manage_lists.py \
  --action add-contact \
  --list "All Contacts" \
  --email "parent@example.com" \
  --first-name "John" \
  --last-name "Doe"
```

---

## 🎨 Customizing Templates

### 1. Edit HTML Templates

Templates are in `assets/templates/`:
- `season-launch.html` - Season registration emails
- `jtt-announcement.html` - JTT campaigns
- `newsletter.html` - Monthly newsletters

**What to customize:**
- Hero headline and dates
- Program descriptions
- Pricing (pull from `/data/*.json`)
- CTAs and links
- Images

### 2. Brand Guidelines (Already Built In)

✅ **Typography:** Playfair Display + Work Sans
✅ **Colors:** Black/white primary, beige accents
✅ **Buttons:** Black background, white text, uppercase
✅ **Spacing:** 40%+ white space
✅ **Mobile:** Responsive at 320px, 375px, 768px

### 3. Pull Data from JSON Files

**Never hardcode prices or dates!** Always pull from:
- `/data/winter2026.json` - Winter programs
- `/data/year2026.json` - Full year data
- `/data/schedule-2026.json` - Schedules

---

## 📊 Performance Tracking

### LBTA Benchmarks

| Metric | Target | Industry Avg |
|--------|--------|--------------|
| Open Rate | 25-30% | 20-25% |
| Click Rate | 3-5% | 2-4% |
| Conversion | 5-10% | 2-5% |
| Unsubscribe | <0.3% | <0.5% |

### What to Monitor

**In ActiveCampaign:**
- Open rate by segment
- Click rate by CTA
- Conversion rate (trial bookings, registrations)
- Unsubscribe rate

**Optimize if:**
- **Low opens** → Improve subject lines, test send time
- **Low clicks** → Make CTAs more prominent
- **High unsubscribes** → Reduce frequency, improve targeting

---

## 🔄 Automation Workflows

### Welcome Series (New Subscribers)

**Trigger:** Contact subscribes to newsletter
**Emails:** 3 over 7 days

1. **Day 0:** Welcome + academy overview
2. **Day 3:** Program options + trial booking
3. **Day 7:** Success stories + registration CTA

### Trial Follow-up

**Trigger:** Contact books trial lesson
**Emails:** 4 over 14 days

1. **Day 0:** Pre-trial confirmation
2. **Day 1:** Post-trial thank you
3. **Day 5:** Program recommendations
4. **Day 10:** Early bird deadline reminder

### Re-engagement

**Trigger:** Contact inactive 90+ days
**Emails:** 3 over 30 days

1. **Day 0:** "We miss you" message
2. **Day 14:** Success stories
3. **Day 30:** Special comeback offer

---

## ✅ Pre-Send Checklist

Before sending any campaign:

- [ ] Subject line under 50 characters
- [ ] Preview text set (50-100 characters)
- [ ] Mobile responsive (test at 320px, 375px, 768px)
- [ ] All images have alt text
- [ ] All links work and use UTM parameters
- [ ] Prices match `/data/*.json` files
- [ ] CTAs point to correct URLs
- [ ] Unsubscribe link present
- [ ] Test email sent and reviewed
- [ ] Brand guidelines followed

---

## 🆘 Troubleshooting

### "Missing environment variables"

**Problem:** API credentials not set
**Solution:**
```bash
export ACTIVECAMPAIGN_API_KEY="your-key"
export ACTIVECAMPAIGN_URL="https://lbta.api-us1.com"
source ~/.zshrc
```

### "List not found"

**Problem:** List name doesn't match exactly
**Solution:**
```bash
# List all available lists
python scripts/manage_lists.py --action list

# Use exact name from output
python scripts/create_campaign.py --list "All Contacts"
```

### "Template file not found"

**Problem:** Wrong path to template
**Solution:**
```bash
# Use relative path from skill directory
--template "assets/templates/season-launch.html"

# Or absolute path
--template "/full/path/to/template.html"
```

---

## 📚 More Resources

- **Full Documentation:** `SKILL.md`
- **Campaign Templates:** `references/campaign-templates.md`
- **Segmentation Guide:** `references/segmentation-guide.md`
- **HTML Templates:** `assets/templates/`

---

## 🎉 You're Ready!

You now have everything you need to:
1. ✅ Create professional email campaigns
2. ✅ Use luxury-branded templates
3. ✅ Segment your audience strategically
4. ✅ Track performance and optimize
5. ✅ Maintain LBTA brand standards

**Next step:** Create your first campaign using the examples above!

---

**Questions?** Check `SKILL.md` or contact support@lagunabeachtennisacademy.com

