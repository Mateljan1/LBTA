#!/usr/bin/env node
/**
 * Create all 16 Spring 2026 drip messages in ActiveCampaign (Prospects P1–P8,
 * Returning R1–R8). Uses HTML from assets/emails/spring-2026/ and subject/preview
 * from plans/activecampaign-spring-2026-drip-campaigns-plan.md.
 *
 * Usage:
 *   node scripts/create-ac-drip-messages.js
 *
 * Env (from .env.local or shell):
 *   ACTIVECAMPAIGN_URL   e.g. https://tennisbeast.api-us1.com
 *   ACTIVECAMPAIGN_API_KEY
 *
 * Output: Logs each created message name and ID; writes message IDs to
 * assets/emails/spring-2026/message-ids.json for use when building automations.
 */

const fs = require('fs')
const path = require('path')

try {
  require('dotenv').config({ path: path.resolve(process.cwd(), '.env.local') })
  require('dotenv').config({ path: path.resolve(process.cwd(), '.env') })
} catch {
  // no dotenv
}

const BASE = (process.env.ACTIVECAMPAIGN_URL || process.env.AC_API_URL || '').replace(/\/$/, '')
const API_KEY = process.env.ACTIVECAMPAIGN_API_KEY || process.env.AC_API_TOKEN
if (!BASE || !API_KEY) {
  console.error('Missing credentials. Set in .env.local or shell: ACTIVECAMPAIGN_URL + ACTIVECAMPAIGN_API_KEY, or AC_API_URL + AC_API_TOKEN')
  process.exit(1)
}

const ROOT = path.resolve(__dirname, '..')
const PROSPECTS_DIR = path.join(ROOT, 'assets/emails/spring-2026/prospects')
const RETURNING_DIR = path.join(ROOT, 'assets/emails/spring-2026/returning')

const FROM = {
  fromname: 'Andrew Mateljan',
  fromemail: 'support@lagunabeachtennisacademy.com',
  reply2: 'support@lagunabeachtennisacademy.com',
}

const PROSPECT_MESSAGES = [
  { file: 'LBTA_P1_Welcome_SEND_READY.html', name: 'LBTA P1 Welcome', subject: "A quick intro from the guy who runs this place", preview: "A framework you can use this weekend — from the LBTA coaching team." },
  { file: 'LBTA_P2_HowWeTeach_SEND_READY.html', name: 'LBTA P2 How We Teach', subject: "We don't tell kids where to hit (here's why)", preview: "Most tennis lessons look the same. Ours don't." },
  { file: 'LBTA_P3_RightAge_SEND_READY.html', name: 'LBTA P3 Right Age', subject: '"Is my kid the right age to start tennis?"', preview: "The honest answer — plus a quick guide by age." },
  { file: 'LBTA_P4_InsideASession_SEND_READY.html', name: 'LBTA P4 Inside a Session', subject: "Here's what happens in 60 minutes (minute by minute)", preview: "The thing that keeps most families from trying is not knowing what to expect." },
  { file: 'LBTA_P5_WhyTennis_SEND_READY.html', name: 'LBTA P5 Why Tennis', subject: '3 things tennis teaches that no classroom can', preview: "Decision-making under pressure. Emotional regulation. Competitive grace." },
  { file: 'LBTA_P6_MeetCoaches_SEND_READY.html', name: 'LBTA P6 Meet Coaches', subject: '4 coaches, 50+ years of experience', preview: "Who's on the court — and how they actually coach." },
  { file: 'LBTA_P7_SpringStarted_SEND_READY.html', name: 'LBTA P7 Spring Started', subject: 'Spring started today — your free trial is ready', preview: "New faces are expected. You won't be the only one." },
  { file: 'LBTA_P8_ForAdults_SEND_READY.html', name: 'LBTA P8 For Adults', subject: '"I\'m too old to start." (No, you\'re not.)', preview: "Half our students are adults. Here's what it actually looks like." },
]

const RETURNING_MESSAGES = [
  { file: 'LBTA_R1_TrafficLight_SEND_READY.html', name: 'LBTA R1 Traffic Light', subject: 'The decision framework that changes how you play', preview: "Every ball is red, yellow, or green. A framework you can use this weekend." },
  { file: 'LBTA_R2_First4Shots_SEND_READY.html', name: 'LBTA R2 First 4 Shots', subject: '1–3 spots left on our USTA 3.5 team', preview: "70% of points end by shot 4. The stat that should change how you practice." },
  { file: 'LBTA_R3_70PercentRule_SEND_READY.html', name: 'LBTA R3 70 Percent Rule', subject: 'What 12 hours does that 1 hour can\'t', preview: "If you're hitting every ball in during practice, you're not improving." },
  { file: 'LBTA_R4_EarnTheLine_SEND_READY.html', name: 'LBTA R4 Earn the Line', subject: 'The shot selection mistake I see every week', preview: "It's not your forehand. It's when you choose to go down the line." },
  { file: 'LBTA_R5_AttackSpace_SEND_READY.html', name: 'LBTA R5 Attack Space', subject: 'Camp starts tomorrow. Spring starts Monday.', preview: "Why swinging harder on a short ball is almost always wrong." },
  { file: 'LBTA_R6_DefenseHeight_SEND_READY.html', name: 'LBTA R6 Defense Height', subject: 'The shot that improves every other shot', preview: "When you're stretched and off-balance, hit it HIGH. Here's why." },
  { file: 'LBTA_R7_SummerPlan_SEND_READY.html', name: 'LBTA R7 Summer Plan', subject: "The best summer plan isn't \"sign up for everything\"", preview: "Camp weeks for breakthroughs. Weekly classes for consistency." },
  { file: 'LBTA_R8_OneCueWord_SEND_READY.html', name: 'LBTA R8 One Cue Word', subject: 'One word before every point', preview: "The difference between focused and scattered isn't talent." },
]

const headers = {
  'Api-Token': API_KEY,
  'Content-Type': 'application/json',
}

async function createMessage(dir, { file, name, subject, preview }) {
  const htmlPath = path.join(dir, file)
  if (!fs.existsSync(htmlPath)) {
    throw new Error(`File not found: ${htmlPath}`)
  }
  const htmlContent = fs.readFileSync(htmlPath, 'utf-8')
  const res = await fetch(`${BASE}/api/3/messages`, {
    method: 'POST',
    headers,
    body: JSON.stringify({
      message: {
        type: 'template',
        name,
        subject,
        fromname: FROM.fromname,
        fromemail: FROM.fromemail,
        reply2: FROM.reply2,
        html: htmlContent,
        textcontent: '',
        // Preview text: AC API may support it; some UIs use automation step
        ...(preview && { previewtext: preview }),
      },
    }),
  })
  if (!res.ok) {
    const text = await res.text()
    throw new Error(`Create message failed: ${res.status} ${text}`)
  }
  const { message } = await res.json()
  return message
}

async function main() {
  const ids = { prospects: [], returning: [] }

  console.log('Creating Prospect messages (P1–P8)...')
  for (const spec of PROSPECT_MESSAGES) {
    const msg = await createMessage(PROSPECTS_DIR, spec)
    ids.prospects.push({ name: msg.name, id: msg.id })
    console.log(`  ${msg.name} (id: ${msg.id})`)
  }

  console.log('Creating Returning messages (R1–R8)...')
  for (const spec of RETURNING_MESSAGES) {
    const msg = await createMessage(RETURNING_DIR, spec)
    ids.returning.push({ name: msg.name, id: msg.id })
    console.log(`  ${msg.name} (id: ${msg.id})`)
  }

  const outPath = path.join(ROOT, 'assets/emails/spring-2026/message-ids.json')
  fs.writeFileSync(outPath, JSON.stringify(ids, null, 2), 'utf-8')
  console.log(`\nMessage IDs written to ${outPath}`)
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
