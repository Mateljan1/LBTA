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
<head><meta charset="utf-8"></head>
<body style="margin:0;padding:0;font-family:Arial,Helvetica,sans-serif;background:#f4f4f4;">
  <div style="max-width:600px;margin:20px auto;background:#fff;border-radius:4px;overflow:hidden;box-shadow:0 1px 3px rgba(0,0,0,0.1);">
    <div style="background:#1B2A4A;padding:20px 24px;">
      <h1 style="margin:0;color:#F8A121;font-size:18px;font-weight:700;">LBTA — ${escapeHtml(options.heading)}</h1>
    </div>
    <div style="padding:20px 24px;">
      <p style="margin:0 0 16px;color:#666;font-size:13px;">A new ${escapeHtml(options.type)} was submitted on lagunabeachtennisacademy.com</p>
      <table style="width:100%;border-collapse:collapse;font-size:14px;">
        ${rows}
      </table>
      <p style="margin:20px 0 0;color:#999;font-size:12px;">This contact has been added to ActiveCampaign and GoHighLevel automatically.</p>
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
