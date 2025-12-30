# ActiveCampaign Email Marketing Skill Created ✅

## What Was Created

A comprehensive **ActiveCampaign Email Marketing Skill** for LBTA that provides:

### 📁 Skill Structure

```
skills/activecampaign-email-marketing/
├── SKILL.md                          # Main skill documentation
├── scripts/
│   ├── create_campaign.py            # Create campaigns via API
│   ├── send_test.py                  # Send test emails
│   └── manage_lists.py               # Manage contact lists
├── references/
│   ├── campaign-templates.md         # Pre-built campaign structures
│   └── segmentation-guide.md         # Audience targeting strategies
└── assets/
    └── templates/
        ├── season-launch.html        # Winter/Spring/Summer/Fall emails
        ├── jtt-announcement.html     # JTT registration emails
        └── newsletter.html           # Monthly newsletter template
```

---

## 🎯 What This Skill Does

### 1. Campaign Creation
- **Season launches** (Winter/Spring/Summer/Fall registration)
- **JTT announcements** (Junior Team Tennis campaigns)
- **Camp promotions** (Ski Week, Spring Break, Summer camps)
- **Monthly newsletters** (Community updates + tennis news)
- **Nurture sequences** (Trial follow-ups, re-engagement)

### 2. Automation Workflows
- **Welcome series** (3 emails over 7 days)
- **Trial follow-up** (4 emails over 14 days)
- **Abandoned registration** (3 emails over 3 days)
- **Re-engagement** (3 emails over 30 days)

### 3. List Management
- Create and manage contact lists
- Add/update contacts with custom fields
- Segment by program type, age, skill level, engagement

### 4. Brand Compliance
- Luxury aesthetic (Playfair Display + Work Sans)
- Black/white primary colors, minimal orange
- Mobile-first responsive design
- WCAG 2.1 AAA accessibility standards

---

## 🚀 How to Use

### Quick Start

1. **Set environment variables:**
```bash
export ACTIVECAMPAIGN_API_KEY="your-api-key"
export ACTIVECAMPAIGN_URL="https://lbta.api-us1.com"
```

2. **Create a campaign:**
```bash
cd skills/activecampaign-email-marketing
python scripts/create_campaign.py \
  --name "Winter 2026 Registration Open" \
  --subject "Winter Classes Start January 5th" \
  --template "assets/templates/season-launch.html" \
  --list "All Contacts"
```

3. **Send test email:**
```bash
python scripts/send_test.py \
  --campaign-id 123 \
  --email andrew@lagunabeachtennisacademy.com
```

---

## 📧 Pre-Built Campaign Templates

### 1. Season Launch
**File:** `assets/templates/season-launch.html`
**Use for:** Winter/Spring/Summer/Fall registration announcements
**Timeline:** 4-6 weeks before season start

**Includes:**
- Hero section with season dates
- Programs grid (Junior/Adult/High Performance)
- Pricing from `/data/*.json`
- Early bird CTA
- Schedule preview

### 2. JTT Announcement
**File:** `assets/templates/jtt-announcement.html`
**Use for:** Junior Team Tennis registration
**Timeline:** 6 weeks before season start

**Includes:**
- Key dates (practices, matches, playoffs)
- Divisions (10U, 12U, 14U, 18U)
- Pricing ($2,800/season)
- What's included
- Registration CTA

### 3. Newsletter
**File:** `assets/templates/newsletter.html`
**Use for:** Monthly community updates
**Timeline:** First Tuesday of each month

**Includes:**
- Academy updates
- Tennis news (pro tour insights)
- Student spotlights
- Upcoming events
- Community section

---

## 🎯 Segmentation Strategies

### By Program Type
- **Junior Parents** (Ages 3-17) - 60% of database
- **Adult Players** (NTRP 1.0-4.0+) - 35% of database
- **High Performance** (UTR 5-8) - 5% of database

### By Engagement Level
- **Hot Leads** (Last 7 days) - Daily emails
- **Warm Leads** (8-30 days) - 2-3x per week
- **Cold Leads** (31-90 days) - 1x per week
- **Inactive** (90+ days) - Re-engagement campaign

### By Customer Journey
- **Awareness** - Welcome series
- **Consideration** - Program spotlights
- **Decision** - Trial booking, early bird reminders
- **Retention** - Newsletters, event invitations

---

## 📊 Campaign Performance Benchmarks

### LBTA Targets
- **Open Rate:** 25-30%
- **Click Rate:** 3-5%
- **Conversion Rate:** 5-10%
- **Unsubscribe Rate:** <0.3%

### What to Optimize
- **Low Opens** → Improve subject lines, send time
- **Low Clicks** → Improve CTA prominence, content relevance
- **High Unsubscribes** → Reduce frequency, improve segmentation
- **Low Conversions** → Simplify registration, add urgency

---

## 🔧 Scripts Reference

### create_campaign.py
Create email campaigns via ActiveCampaign API

**Arguments:**
- `--name` - Campaign name (internal)
- `--subject` - Email subject line
- `--template` - Path to HTML template
- `--list` - Contact list name
- `--send-now` - Send immediately (default: create draft)

### send_test.py
Send test emails for campaigns

**Arguments:**
- `--campaign-id` - Campaign ID to test
- `--email` - Test email address

### manage_lists.py
Manage contact lists and subscriptions

**Actions:**
- `--action list` - List all contact lists
- `--action create --name "List Name"` - Create new list
- `--action add-contact --list "List" --email "email@example.com"` - Add contact

---

## 📚 Reference Documentation

### campaign-templates.md
Pre-built campaign structures for:
- Season launches
- JTT announcements
- Camp promotions
- Monthly newsletters
- Trial follow-up sequences
- Re-engagement campaigns
- Event invitations
- Abandoned registration

### segmentation-guide.md
Audience targeting strategies:
- Core segments (Program type, engagement, journey stage)
- Geographic segmentation (Laguna Beach, nearby cities)
- Custom fields (child age, skill level, program interest)
- Advanced tactics (predictive, RFM, engagement scoring)

---

## ✅ Brand Guidelines Compliance

### Visual Standards
- ✅ Playfair Display (headlines) + Work Sans (body)
- ✅ Black/white primary, beige accents, minimal orange
- ✅ 40%+ white space
- ✅ Mobile-first responsive (320px, 375px, 768px)

### Copy Standards
- ✅ Calm, confident, authentic tone
- ✅ No "maximize", "elite", "world-class"
- ✅ No exclamation points in headlines
- ✅ Founder-led, personal voice

### Technical Standards
- ✅ Images <350KB, WebP format
- ✅ 7:1 contrast ratio (WCAG 2.1 AAA)
- ✅ Alt text on all images
- ✅ Inline CSS for email clients

---

## 🎓 Next Steps

### 1. Set Up ActiveCampaign Access
- Get API key from ActiveCampaign account
- Set environment variables
- Test connection with `manage_lists.py --action list`

### 2. Create Your First Campaign
- Choose template (season-launch, jtt-announcement, newsletter)
- Customize content with program data from `/data/*.json`
- Create draft campaign
- Send test email
- Review and approve

### 3. Set Up Automations
- Welcome series for new subscribers
- Trial follow-up sequence
- Abandoned registration recovery
- Re-engagement for inactive contacts

### 4. Monitor Performance
- Track open rates, click rates, conversions
- A/B test subject lines and CTAs
- Optimize based on segment performance
- Refine segmentation strategy

---

## 🆘 Support

**For skill usage questions:**
- Read `SKILL.md` for comprehensive documentation
- Check `references/campaign-templates.md` for pre-built structures
- Review `references/segmentation-guide.md` for targeting strategies

**For ActiveCampaign account access:**
- Account: lbta.activehosted.com
- Support: support@lagunabeachtennisacademy.com
- Founder: Andrew Mateljan

---

## 🎉 What You Can Do Now

1. **Create Winter 2026 registration campaign** using `season-launch.html`
2. **Launch Spring JTT campaign** using `jtt-announcement.html`
3. **Send monthly newsletter** using `newsletter.html`
4. **Set up trial follow-up automation** (4 emails over 14 days)
5. **Segment your database** by program type and engagement level
6. **A/B test subject lines** to improve open rates
7. **Monitor performance** and optimize campaigns

---

**Created:** December 28, 2025
**Status:** ✅ Ready to use
**Location:** `/skills/activecampaign-email-marketing/`

