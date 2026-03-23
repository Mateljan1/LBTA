/**
 * Postmark transactional email module for LBTA website.
 *
 * Sends internal notification emails to staff when forms are submitted.
 * Uses the Postmark HTTP API directly (no npm dependency).
 *
 * Env: POSTMARK_SERVER_TOKEN, POSTMARK_FROM_EMAIL (optional, defaults below).
 * Failures are logged only — they never affect the API response.
 */

const POSTMARK_API = 'https://api.postmarkapp.com/email'
const DEFAULT_FROM = 'LBTA Website <support@lagunabeachtennisacademy.com>'
const NOTIFY_TO = 'support@lagunabeachtennisacademy.com'

function getToken(): string | null {
  return process.env.POSTMARK_SERVER_TOKEN ?? null
}

function getFrom(): string {
  return process.env.POSTMARK_FROM_EMAIL ?? DEFAULT_FROM
}

// ============================================================
// Core send function
// ============================================================

async function sendEmail(options: {
  to: string
  subject: string
  htmlBody: string
  tag?: string
}): Promise<boolean> {
  const token = getToken()
  if (!token) return false

  try {
    const res = await fetch(POSTMARK_API, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'X-Postmark-Server-Token': token,
      },
      body: JSON.stringify({
        From: getFrom(),
        To: options.to,
        Subject: options.subject,
        HtmlBody: options.htmlBody,
        Tag: options.tag ?? 'website-notification',
        MessageStream: 'outbound',
      }),
    })

    if (!res.ok) {
      const text = await res.text()
      console.error('[email] Postmark send failed:', res.status, text.slice(0, 200))
      return false
    }

    return true
  } catch (err) {
    console.error('[email] Postmark error:', err instanceof Error ? err.message : err)
    return false
  }
}

// ============================================================
// Notification builders
// ============================================================

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}

function field(label: string, value: string | undefined | null): string {
  if (!value) return ''
  return `<tr><td style="padding:6px 12px;font-weight:600;color:#1B2A4A;white-space:nowrap;vertical-align:top;">${escapeHtml(label)}</td><td style="padding:6px 12px;color:#333;">${escapeHtml(value)}</td></tr>`
}

function buildNotificationHtml(options: {
  type: string
  heading: string
  fields: Array<{ label: string; value: string | undefined | null }>
}): string {
  const rows = options.fields.map(f => field(f.label, f.value)).filter(Boolean).join('')
  return `<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
<body style="margin:0;padding:0;font-family:'DM Sans',Arial,Helvetica,sans-serif;background:#d5d1ca;">
  <div style="max-width:600px;margin:20px auto;background:#FAF8F4;border-radius:4px;overflow:hidden;box-shadow:0 1px 3px rgba(0,0,0,0.1);">
    <div style="height:3px;background:linear-gradient(90deg,#2E8B8B,#E8834A 35%,#C4963C 50%,#E8834A 65%,#2E8B8B);"></div>
    <div style="padding:16px 24px;">
      <table style="width:100%;"><tr>
        <td><img src="https://tennisbeast.activehosted.com/content/3aQRzG/2026/03/02/34c3a71c-67af-45ba-b72a-b93da3c7a3e1.png" alt="LBTA" width="120" style="display:block;" /></td>
        <td style="text-align:right;vertical-align:middle;"><img src="https://tennisbeast.activehosted.com/content/3aQRzG/2026/03/15/7c9759d7-f71e-4169-bf0c-d960fac082e1.png" alt="City of Laguna Beach" width="28" style="display:block;" /></td>
      </tr></table>
    </div>
    <div style="background:#0F2237;padding:20px 24px;">
      <h1 style="margin:0;color:#C4963C;font-size:18px;font-weight:700;font-family:'DM Sans',Arial,sans-serif;">LBTA — ${escapeHtml(options.heading)}</h1>
    </div>
    <div style="padding:20px 24px;">
      <p style="margin:0 0 16px;color:#666;font-size:13px;">A new ${escapeHtml(options.type)} was submitted on lagunabeachtennisacademy.com</p>
      <table style="width:100%;border-collapse:collapse;font-size:14px;">
        ${rows}
      </table>
      <p style="margin:20px 0 0;color:#999;font-size:12px;">This contact has been added to ActiveCampaign and GoHighLevel automatically.</p>
    </div>
    <div style="height:3px;background:linear-gradient(90deg,#2E8B8B,#E8834A 35%,#C4963C 50%,#E8834A 65%,#2E8B8B);"></div>
    <div style="background:#0F2237;padding:24px;text-align:center;">
      <img src="https://tennisbeast.activehosted.com/content/3aQRzG/2026/03/19/1a8509e6-5c33-4110-8117-a1b68732bac1.png" alt="Laguna Beach Tennis Academy" width="180" style="display:block;margin:0 auto 10px;" />
      <p style="margin:0 0 6px;font-family:'DM Sans',Arial,sans-serif;font-size:12px;letter-spacing:0.15em;color:#C4963C;">Movement. Craft. Community.</p>
      <p style="margin:0;font-family:'DM Sans',Arial,sans-serif;font-size:11px;color:#667788;">
        <a href="https://lagunabeachtennisacademy.com" style="color:#2E8B8B;text-decoration:none;">lagunabeachtennisacademy.com</a> · (949) 534-0457
      </p>
    </div>
  </div>
</body>
</html>`
}

// ============================================================
// Public notification functions (fire-and-forget)
// ============================================================

export type NotifyTrialParams = {
  firstName: string
  lastName: string
  email: string
  phone?: string
  program?: string
  location?: string
  experience?: string
  preferredDays?: string[]
}

export async function notifyTrialRequest(data: NotifyTrialParams): Promise<void> {
  void sendEmail({
    to: NOTIFY_TO,
    subject: `New Trial Request — ${data.firstName} ${data.lastName}`,
    tag: 'trial-request',
    htmlBody: buildNotificationHtml({
      type: 'trial class request',
      heading: 'New Trial Request',
      fields: [
        { label: 'Name', value: `${data.firstName} ${data.lastName}` },
        { label: 'Email', value: data.email },
        { label: 'Phone', value: data.phone },
        { label: 'Program', value: data.program },
        { label: 'Location', value: data.location },
        { label: 'Experience', value: data.experience },
        { label: 'Preferred Days', value: data.preferredDays?.join(', ') },
      ],
    }),
  })
}

export type NotifyPrivateLessonParams = {
  firstName: string
  lastName: string
  email: string
  phone?: string
  coach: string
  option: string
}

export async function notifyPrivateLesson(data: NotifyPrivateLessonParams): Promise<void> {
  void sendEmail({
    to: NOTIFY_TO,
    subject: `Private Lesson Request — ${data.firstName} ${data.lastName} → ${data.coach}`,
    tag: 'private-lesson',
    htmlBody: buildNotificationHtml({
      type: 'private lesson request',
      heading: 'Private Lesson Request',
      fields: [
        { label: 'Name', value: `${data.firstName} ${data.lastName}` },
        { label: 'Email', value: data.email },
        { label: 'Phone', value: data.phone },
        { label: 'Coach', value: data.coach },
        { label: 'Option', value: data.option },
      ],
    }),
  })
}

export type NotifyRegistrationParams = {
  firstName: string
  lastName: string
  email: string
  phone?: string
  program: string
  location?: string
  season?: string
  registrationType?: string
  division?: string
  studentName?: string
  studentAge?: string | number
  experience?: string
  notes?: string
}

export async function notifyRegistration(data: NotifyRegistrationParams): Promise<void> {
  const regType = data.registrationType ?? 'registration'
  const heading = regType === 'utr-circuit'
    ? 'UTR Circuit Registration'
    : regType === 'camp'
      ? 'Camp Registration'
      : 'Program Registration'

  void sendEmail({
    to: NOTIFY_TO,
    subject: `New ${heading} — ${data.firstName} ${data.lastName} — ${data.program}`,
    tag: 'registration',
    htmlBody: buildNotificationHtml({
      type: regType,
      heading,
      fields: [
        { label: 'Name', value: `${data.firstName} ${data.lastName}` },
        { label: 'Email', value: data.email },
        { label: 'Phone', value: data.phone },
        { label: 'Program', value: data.program },
        { label: 'Type', value: data.registrationType },
        { label: 'Division', value: data.division },
        { label: 'Season', value: data.season },
        { label: 'Location', value: data.location },
        { label: 'Student Name', value: data.studentName },
        { label: 'Student Age', value: data.studentAge != null ? String(data.studentAge) : undefined },
        { label: 'Experience', value: data.experience },
        { label: 'Notes', value: data.notes },
      ],
    }),
  })
}

export type NotifyScholarshipParams = {
  parentName?: string
  email: string
  phone?: string
  studentName?: string
}

export async function notifyScholarship(data: NotifyScholarshipParams): Promise<void> {
  void sendEmail({
    to: NOTIFY_TO,
    subject: `Scholarship Application — ${data.parentName || data.email}`,
    tag: 'scholarship',
    htmlBody: buildNotificationHtml({
      type: 'scholarship application',
      heading: 'Scholarship Application',
      fields: [
        { label: 'Parent Name', value: data.parentName },
        { label: 'Email', value: data.email },
        { label: 'Phone', value: data.phone },
        { label: 'Student Name', value: data.studentName },
      ],
    }),
  })
}

export async function notifyNewsletter(email: string): Promise<void> {
  void sendEmail({
    to: NOTIFY_TO,
    subject: `Newsletter Signup — ${email}`,
    tag: 'newsletter',
    htmlBody: buildNotificationHtml({
      type: 'newsletter signup',
      heading: 'Newsletter Signup',
      fields: [
        { label: 'Email', value: email },
      ],
    }),
  })
}

// ============================================================
// Registrant confirmation email (sent TO the registrant)
// ============================================================

export type ConfirmationEmailParams = {
  /** Registrant email address */
  email: string
  firstName: string
  /** Program display name, e.g. "Orange Ball Tennis" */
  programName: string
  /** Court location, e.g. "Moulton Meadows" */
  location: string
  /** Session duration, e.g. "1 hr" */
  duration: string
  /** Age group when applicable, e.g. "7-8 years" */
  ageGroup?: string
  /** Category: Junior, Youth, Adult, Fitness, Camp, Match Play Series */
  category: string
}

function buildConfirmationHtml(params: ConfirmationEmailParams): string {
  const { firstName, programName, location, duration, ageGroup, category } = params

  // Build the program-details rows — only what applies to THIS program
  let detailRows = ''
  detailRows += `<tr><td style="padding:5px 0;color:#667788;font-size:13px;font-family:'DM Sans',Arial,sans-serif;width:100px;vertical-align:top;">Program</td><td style="padding:5px 0;color:#0F2237;font-size:14px;font-weight:600;font-family:'DM Sans',Arial,sans-serif;">${escapeHtml(programName)}</td></tr>`
  detailRows += `<tr><td style="padding:5px 0;color:#667788;font-size:13px;font-family:'DM Sans',Arial,sans-serif;vertical-align:top;">Location</td><td style="padding:5px 0;color:#0F2237;font-size:14px;font-weight:600;font-family:'DM Sans',Arial,sans-serif;">${escapeHtml(location)}</td></tr>`
  detailRows += `<tr><td style="padding:5px 0;color:#667788;font-size:13px;font-family:'DM Sans',Arial,sans-serif;vertical-align:top;">Duration</td><td style="padding:5px 0;color:#0F2237;font-size:14px;font-weight:600;font-family:'DM Sans',Arial,sans-serif;">${escapeHtml(duration)}</td></tr>`
  if (ageGroup) {
    detailRows += `<tr><td style="padding:5px 0;color:#667788;font-size:13px;font-family:'DM Sans',Arial,sans-serif;vertical-align:top;">Ages</td><td style="padding:5px 0;color:#0F2237;font-size:14px;font-weight:600;font-family:'DM Sans',Arial,sans-serif;">${escapeHtml(ageGroup)}</td></tr>`
  }

  // Category-aware "What Happens Next" section
  const isJuniorOrYouth = category === 'Junior' || category === 'Youth'
  const isCamp = category === 'Camp'
  const isMatchPlay = category === 'Match Play Series'

  let whatHappensNext = ''
  if (isCamp) {
    whatHappensNext = `
      <tr><td style="padding:4px 0 4px 12px;color:#333;font-size:14px;font-family:'DM Sans',Arial,sans-serif;">1. Our team will confirm your camp dates and send a detailed packing list.</td></tr>
      <tr><td style="padding:4px 0 4px 12px;color:#333;font-size:14px;font-family:'DM Sans',Arial,sans-serif;">2. Payment information will be sent separately.</td></tr>
      <tr><td style="padding:4px 0 4px 12px;color:#333;font-size:14px;font-family:'DM Sans',Arial,sans-serif;">3. Drop-off and pick-up instructions arrive the week before camp.</td></tr>`
  } else if (isMatchPlay) {
    whatHappensNext = `
      <tr><td style="padding:4px 0 4px 12px;color:#333;font-size:14px;font-family:'DM Sans',Arial,sans-serif;">1. We will review your registration and confirm your division placement.</td></tr>
      <tr><td style="padding:4px 0 4px 12px;color:#333;font-size:14px;font-family:'DM Sans',Arial,sans-serif;">2. Match schedules and format details will be sent prior to the first session.</td></tr>
      <tr><td style="padding:4px 0 4px 12px;color:#333;font-size:14px;font-family:'DM Sans',Arial,sans-serif;">3. Payment information will be provided when we confirm your spot.</td></tr>`
  } else if (isJuniorOrYouth) {
    whatHappensNext = `
      <tr><td style="padding:4px 0 4px 12px;color:#333;font-size:14px;font-family:'DM Sans',Arial,sans-serif;">1. Our team will call or email within 24 hours to confirm your child's spot and preferred days.</td></tr>
      <tr><td style="padding:4px 0 4px 12px;color:#333;font-size:14px;font-family:'DM Sans',Arial,sans-serif;">2. We'll share class times and payment details once confirmed.</td></tr>
      <tr><td style="padding:4px 0 4px 12px;color:#333;font-size:14px;font-family:'DM Sans',Arial,sans-serif;">3. Please bring a racquet (loaners available), water, and athletic shoes to the first session.</td></tr>`
  } else {
    // Adult / Fitness
    whatHappensNext = `
      <tr><td style="padding:4px 0 4px 12px;color:#333;font-size:14px;font-family:'DM Sans',Arial,sans-serif;">1. Our team will reach out within 24 hours to confirm your spot and preferred schedule.</td></tr>
      <tr><td style="padding:4px 0 4px 12px;color:#333;font-size:14px;font-family:'DM Sans',Arial,sans-serif;">2. Payment details and class logistics will follow once confirmed.</td></tr>
      <tr><td style="padding:4px 0 4px 12px;color:#333;font-size:14px;font-family:'DM Sans',Arial,sans-serif;">3. Bring a racquet, water bottle, and comfortable athletic clothing.</td></tr>`
  }

  return `<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml" lang="en"><head>
<meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>LBTA &mdash; Registration Confirmed</title>
<style>
@import url('https://fonts.googleapis.com/css2?family=Cormorant:ital,wght@0,300;0,400;0,500;0,600;1,300;1,400&family=DM+Sans:wght@300;400;500;600;700&display=swap');
body{margin:0;padding:0;width:100%!important;-webkit-text-size-adjust:100%;}
table{border-spacing:0;border-collapse:collapse;}td{padding:0;}img{border:0;outline:none;display:block;}
a{color:#2E8B8B;text-decoration:none;}
@media screen and (max-width:660px){
.wrap{width:100%!important;}.mp{padding-left:24px!important;padding-right:24px!important;}
.ht{font-size:36px!important;}.bt{font-size:15px!important;}
}
</style></head>
<body style="margin:0;padding:0;background-color:#d5d1ca;">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#d5d1ca;">
<tr><td align="center">
<div style="display:none;font-size:1px;color:#d5d1ca;line-height:1px;max-height:0;max-width:0;opacity:0;overflow:hidden;">Your ${escapeHtml(programName)} registration is confirmed &mdash; here are your program details and next steps.</div>
<table role="presentation" class="wrap" width="660" cellpadding="0" cellspacing="0" style="max-width:660px;width:100%;background-color:#FAF8F4;">
<tr><td style="height:3px;background:linear-gradient(90deg,#2E8B8B,#E8834A 35%,#C4963C 50%,#E8834A 65%,#2E8B8B);font-size:0;">&nbsp;</td></tr>
<tr><td style="padding:20px 40px 12px;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0"><tr>
    <td style="width:55%;vertical-align:middle;"><img src="https://tennisbeast.activehosted.com/content/3aQRzG/2026/03/02/34c3a71c-67af-45ba-b72a-b93da3c7a3e1.png" alt="LBTA" width="180" style="width:180px;height:auto;"></td>
    <td style="width:45%;vertical-align:middle;text-align:right;">
      <table role="presentation" cellpadding="0" cellspacing="0" style="display:inline-table;"><tr>
        <td style="vertical-align:middle;padding-right:8px;">
          <p style="margin:0 0 1px;font-family:'DM Sans',Helvetica,Arial,sans-serif;font-size:8px;font-weight:600;letter-spacing:0.1em;text-transform:uppercase;color:rgba(27,58,92,0.3);">Official Recreation Partner</p>
          <p style="margin:0;font-family:'Cormorant',Georgia,serif;font-weight:400;font-size:13px;color:#1B3A5C;">City of Laguna Beach</p>
        </td>
        <td style="vertical-align:middle;"><img src="https://tennisbeast.activehosted.com/content/3aQRzG/2026/03/15/7c9759d7-f71e-4169-bf0c-d960fac082e1.png" alt="City" width="40" style="width:40px;height:40px;border-radius:20px;"></td>
      </tr></table>
    </td>
  </tr></table>
</td></tr>
<tr><td><table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#0F2237;">
<tr><td class="mp" style="padding:40px 56px 32px;text-align:center;">
  <p style="margin:0 0 14px;font-family:'DM Sans',Helvetica,Arial,sans-serif;font-size:9px;font-weight:600;letter-spacing:0.3em;text-transform:uppercase;color:rgba(245,240,229,0.4);">REGISTRATION CONFIRMED</p>
  <h1 class="ht" style="margin:0 0 10px;font-family:'Cormorant',Georgia,serif;font-weight:300;font-size:38px;line-height:1.12;color:#F5F0E5;">Your Spot in <em style='font-style:italic;font-weight:400;color:#E8834A;'>${escapeHtml(programName)}</em> Is Reserved.</h1>
</td></tr></table></td></tr>
<tr><td class="mp" style="padding:36px 56px 0;"><p style="margin:0 0 20px;font-family:'DM Sans',Helvetica,Arial,sans-serif;font-size:15.5px;font-weight:400;line-height:1.85;color:rgba(27,58,92,0.68);">Hey ${escapeHtml(firstName)},</p><p style="margin:0 0 20px;font-family:'DM Sans',Helvetica,Arial,sans-serif;font-size:15.5px;font-weight:400;line-height:1.85;color:rgba(27,58,92,0.68);">Thank you for registering for <strong style="color:#1B3A5C;">${escapeHtml(programName)}</strong>. We&rsquo;re excited to have you join us at Laguna Beach Tennis Academy.</p></td></tr>
<tr><td class="mp" style="padding:24px 56px 0;">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#0F2237;border-radius:10px;">
<tr><td style="padding:28px 32px;">
  <p style="margin:0 0 16px;font-family:'DM Sans',Helvetica,Arial,sans-serif;font-size:9px;font-weight:700;letter-spacing:0.2em;text-transform:uppercase;color:#E8834A;">PROGRAM DETAILS</p>
  <table style="width:100%;border-collapse:collapse;">
    <tr><td style="padding:6px 0;color:rgba(245,240,229,0.5);font-size:13px;font-family:'DM Sans',Helvetica,Arial,sans-serif;width:90px;vertical-align:top;">Program</td><td style="padding:6px 0;color:#F5F0E5;font-size:14px;font-weight:600;font-family:'DM Sans',Helvetica,Arial,sans-serif;">${escapeHtml(programName)}</td></tr>
    <tr><td style="padding:6px 0;color:rgba(245,240,229,0.5);font-size:13px;font-family:'DM Sans',Helvetica,Arial,sans-serif;vertical-align:top;">Location</td><td style="padding:6px 0;color:#F5F0E5;font-size:14px;font-weight:600;font-family:'DM Sans',Helvetica,Arial,sans-serif;">${escapeHtml(location)}</td></tr>
    <tr><td style="padding:6px 0;color:rgba(245,240,229,0.5);font-size:13px;font-family:'DM Sans',Helvetica,Arial,sans-serif;vertical-align:top;">Duration</td><td style="padding:6px 0;color:#F5F0E5;font-size:14px;font-weight:600;font-family:'DM Sans',Helvetica,Arial,sans-serif;">${escapeHtml(duration)}</td></tr>
    ${ageGroup ? `<tr><td style="padding:6px 0;color:rgba(245,240,229,0.5);font-size:13px;font-family:'DM Sans',Helvetica,Arial,sans-serif;vertical-align:top;">Ages</td><td style="padding:6px 0;color:#F5F0E5;font-size:14px;font-weight:600;font-family:'DM Sans',Helvetica,Arial,sans-serif;">${escapeHtml(ageGroup)}</td></tr>` : ''}
  </table>
</td></tr></table></td></tr>
<tr><td class="mp" style="padding:28px 56px 0;">
  <p style="margin:0 0 12px;font-family:'DM Sans',Helvetica,Arial,sans-serif;font-size:9px;font-weight:700;letter-spacing:0.2em;text-transform:uppercase;color:#E8834A;">WHAT HAPPENS NEXT</p>
  <table style="width:100%;border-collapse:collapse;">
    ${whatHappensNext.replace(/color:#333/g, 'color:rgba(27,58,92,0.68)').replace(/font-size:14px/g, 'font-size:15px;line-height:1.75')}
  </table>
</td></tr>
<tr><td class="mp" style="padding:24px 56px 0;">
  <p style="margin:0 0 20px;font-family:'DM Sans',Helvetica,Arial,sans-serif;font-size:15.5px;font-weight:400;line-height:1.85;color:rgba(27,58,92,0.68);">Questions? Reply to this email or call <strong style="color:#1B3A5C;">(949) 534-0457</strong>.</p>
  <p style="margin:0 0 20px;font-family:'DM Sans',Helvetica,Arial,sans-serif;font-size:15.5px;font-weight:400;line-height:1.85;color:rgba(27,58,92,0.68);">See you on the courts.</p>
  <p style="margin:0 0 2px;font-family:'DM Sans',Helvetica,Arial,sans-serif;font-size:14px;font-weight:600;color:#1B3A5C;">Andrew</p>
  <p style="margin:0;font-family:'DM Sans',Helvetica,Arial,sans-serif;font-size:12px;color:rgba(27,58,92,0.5);">Founder &amp; Academy Director &middot; Laguna Beach Tennis Academy</p>
</td></tr>
<tr><td style="padding:28px 0 0;"></td></tr>
<tr><td style="height:3px;background:linear-gradient(90deg,#2E8B8B,#E8834A 35%,#C4963C 50%,#E8834A 65%,#2E8B8B);font-size:0;">&nbsp;</td></tr>
<tr><td style="padding:20px 40px 24px;background-color:#0F2237;text-align:center;">
  <img src="https://tennisbeast.activehosted.com/content/3aQRzG/2026/03/19/1a8509e6-5c33-4110-8117-a1b68732bac1.png" alt="Laguna Beach Tennis Academy" width="200" style="width:200px;height:auto;margin:0 auto 8px;display:block;">
  <p style="margin:0 0 8px;font-family:'Cormorant',Georgia,serif;font-weight:400;font-size:12px;letter-spacing:0.08em;color:rgba(245,240,229,0.45);">Movement. &nbsp;Craft. &nbsp;Community.</p>
  <table role="presentation" cellpadding="0" cellspacing="0" style="margin:0 auto 10px;"><tr>
    <td style="padding:0 6px;"><a href="https://instagram.com/lagunabeachtennisacademy" style="text-decoration:none;"><img src="https://cdn2.hubspot.net/hubfs/53/tools/email-signature-generator/icons/instagram-icon-2x.png" alt="Instagram" width="20" style="width:20px;height:20px;opacity:0.35;"></a></td>
    <td style="padding:0 6px;"><a href="https://facebook.com/lagunabeachtennisacademy" style="text-decoration:none;"><img src="https://cdn2.hubspot.net/hubfs/53/tools/email-signature-generator/icons/facebook-icon-2x.png" alt="Facebook" width="20" style="width:20px;height:20px;opacity:0.35;"></a></td>
  </tr></table>
  <p style="margin:0 0 4px;font-family:'DM Sans',Helvetica,Arial,sans-serif;font-size:11px;color:rgba(245,240,229,0.3);">Laguna Beach Tennis Academy &middot; Laguna Beach, CA &middot; (949) 534-0457</p>
  <p style="margin:0 0 4px;font-family:'DM Sans',Helvetica,Arial,sans-serif;font-size:11px;"><a href="https://www.lagunabeachtennisacademy.com" style="color:rgba(245,240,229,0.4);">lagunabeachtennisacademy.com</a></p>
  <p style="margin:0 0 10px;font-family:'DM Sans',Helvetica,Arial,sans-serif;font-size:10px;color:rgba(245,240,229,0.2);">Official Tennis Programming Partner of the City of Laguna Beach</p>
  <table role="presentation" cellpadding="0" cellspacing="0" style="margin:0 auto;"><tr>
    <td style="padding:0 3px;"><a href="https://apps.apple.com/us/app/lbta/id6746348933" style="text-decoration:none;"><img src="https://developer.apple.com/assets/elements/badges/download-on-the-app-store.svg" alt="App Store" width="85" style="width:85px;height:auto;"></a></td>
    <td style="padding:0 3px;"><a href="https://play.google.com/store/apps/details?id=com.playbypoint.appx" style="text-decoration:none;"><img src="https://upload.wikimedia.org/wikipedia/commons/7/78/Google_Play_Store_badge_EN.svg" alt="Google Play" width="95" style="width:95px;height:auto;"></a></td>
  </tr></table>
</td></tr>
</table></td></tr></table></body></html>`
}

/**
 * Send a branded, program-specific confirmation email TO the registrant.
 * Fire-and-forget — failures are logged but never affect the API response.
 */
export async function sendConfirmationEmail(params: ConfirmationEmailParams): Promise<void> {
  void sendEmail({
    to: params.email,
    subject: `LBTA — Your ${params.programName} Registration Is Confirmed`,
    tag: 'registration-confirmation',
    htmlBody: buildConfirmationHtml(params),
  })
}
