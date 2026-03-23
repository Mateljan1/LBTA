#!/usr/bin/env node
/**
 * Push all 16 LBTA campaign emails to ActiveCampaign as draft messages.
 * Uses the updated HTML files from assets/emails/spring-2026/ (with new footer).
 *
 * Usage:
 *   node scripts/push-all-campaigns-to-ac.js
 *
 * Env (from .env.local):
 *   ACTIVECAMPAIGN_URL   e.g. https://tennisbeast.api-us1.com
 *   ACTIVECAMPAIGN_API_KEY
 */

const fs = require('fs')
const path = require('path')

try {
  require('dotenv').config({ path: path.resolve(process.cwd(), '.env.local') })
  require('dotenv').config({ path: path.resolve(process.cwd(), '.env') })
} catch {}

const base = (process.env.ACTIVECAMPAIGN_URL || '').replace(/\/$/, '')
const apiKey = process.env.ACTIVECAMPAIGN_API_KEY
if (!base || !apiKey) {
  console.error('Missing ACTIVECAMPAIGN_URL or ACTIVECAMPAIGN_API_KEY')
  process.exit(1)
}

const headers = {
  'Api-Token': apiKey,
  'Content-Type': 'application/json',
}

const CAMPAIGNS = [
  // Prospect Series (P1-P8)
  { file: 'prospects/LBTA_P1_Welcome_SEND_READY.html', subject: 'A quick intro from the guy who runs this place', preview: 'A framework you can use this weekend — from the LBTA coaching team.' },
  { file: 'prospects/LBTA_P2_HowWeTeach_SEND_READY.html', subject: "We don't tell kids where to hit (here's why)", preview: "Most tennis lessons look the same. Ours don't." },
  { file: 'prospects/LBTA_P3_RightAge_SEND_READY.html', subject: '"Is my kid the right age to start tennis?"', preview: 'The honest answer — plus a quick guide by age.' },
  { file: 'prospects/LBTA_P4_InsideASession_SEND_READY.html', subject: "Here's what happens in 60 minutes (minute by minute)", preview: "The thing that keeps most families from trying is not knowing what to expect." },
  { file: 'prospects/LBTA_P5_WhyTennis_SEND_READY.html', subject: '3 things tennis teaches that no classroom can', preview: 'Decision-making under pressure. Emotional regulation. Competitive grace.' },
  { file: 'prospects/LBTA_P6_MeetCoaches_SEND_READY.html', subject: '4 coaches, 50+ years of experience', preview: "Who's on the court — and how they actually coach." },
  { file: 'prospects/LBTA_P7_SpringStarted_SEND_READY.html', subject: "Spring started today — your free trial is ready", preview: "New faces are expected. You won't be the only one." },
  { file: 'prospects/LBTA_P8_ForAdults_SEND_READY.html', subject: '"I\'m too old to start." (No, you\'re not.)', preview: "Half our students are adults. Here's what it actually looks like." },
  // Returning Series (R1-R8)
  { file: 'returning/LBTA_R1_TrafficLight_SEND_READY.html', subject: 'The decision framework that changes how you play', preview: 'Every ball is red, yellow, or green. A framework you can use this weekend.' },
  { file: 'returning/LBTA_R2_First4Shots_SEND_READY.html', subject: '1–3 spots left on our USTA 3.5 team', preview: '70% of points end by shot 4. The stat that should change how you practice.' },
  { file: 'returning/LBTA_R3_70PercentRule_SEND_READY.html', subject: "What 12 hours does that 1 hour can't", preview: "If you're hitting every ball in during practice, you're not improving." },
  { file: 'returning/LBTA_R4_EarnTheLine_SEND_READY.html', subject: 'The shot selection mistake I see every week', preview: "It's not your forehand. It's when you choose to go down the line." },
  { file: 'returning/LBTA_R5_AttackSpace_SEND_READY.html', subject: 'Camp starts tomorrow. Spring starts Monday.', preview: 'Why swinging harder on a short ball is almost always wrong.' },
  { file: 'returning/LBTA_R6_DefenseHeight_SEND_READY.html', subject: 'The shot that improves every other shot', preview: "When you're stretched and off-balance, hit it HIGH. Here's why." },
  { file: 'returning/LBTA_R7_SummerPlan_SEND_READY.html', subject: 'The best summer plan isn\'t "sign up for everything"', preview: 'Camp weeks for breakthroughs. Weekly classes for consistency.' },
  { file: 'returning/LBTA_R8_OneCueWord_SEND_READY.html', subject: 'One word before every point', preview: "The difference between focused and scattered isn't talent." },
]

const emailsDir = path.resolve(__dirname, '../assets/emails/spring-2026')

async function createMessage(campaign, index) {
  const htmlPath = path.join(emailsDir, campaign.file)
  if (!fs.existsSync(htmlPath)) {
    console.error(`  ❌ File not found: ${campaign.file}`)
    return null
  }

  const htmlContent = fs.readFileSync(htmlPath, 'utf-8')
  const name = `LBTA Spring 2026 — ${path.basename(campaign.file, '_SEND_READY.html').replace('LBTA_', '')}`

  const res = await fetch(`${base}/api/3/messages`, {
    method: 'POST',
    headers,
    body: JSON.stringify({
      message: {
        type: 'template',
        name,
        subject: campaign.subject,
        preheader_text: campaign.preview,
        fromname: 'Laguna Beach Tennis Academy',
        fromemail: 'support@lagunabeachtennisacademy.com',
        reply2: 'support@lagunabeachtennisacademy.com',
        html: htmlContent,
        textcontent: '',
      },
    }),
  })

  if (!res.ok) {
    const text = await res.text()
    console.error(`  ❌ ${name}: ${res.status} ${text.slice(0, 150)}`)
    return null
  }

  const data = await res.json()
  const msgId = data.message?.id
  console.log(`  ✅ ${name} → Message ID: ${msgId}`)
  return msgId
}

async function main() {
  console.log('Pushing 16 campaigns to ActiveCampaign...\n')

  const results = []
  for (let i = 0; i < CAMPAIGNS.length; i++) {
    const campaign = CAMPAIGNS[i]
    const msgId = await createMessage(campaign, i)
    results.push({ ...campaign, messageId: msgId })
    // Small delay to avoid rate limiting
    await new Promise(r => setTimeout(r, 500))
  }

  console.log('\n--- Summary ---')
  const success = results.filter(r => r.messageId)
  const failed = results.filter(r => !r.messageId)
  console.log(`✅ Created: ${success.length}/16`)
  if (failed.length) {
    console.log(`❌ Failed: ${failed.length}`)
    failed.forEach(f => console.log(`   - ${f.file}`))
  }

  console.log('\nAll messages are now in AC as templates.')
  console.log('To create campaigns from these, go to:')
  console.log(`  ${base.replace('api-us1.com', 'activehosted.com')}/app/campaigns`)
  console.log('  → New Campaign → Select the template → Assign to list → Schedule')
}

main().catch(err => {
  console.error(err.message || err)
  process.exit(1)
})
