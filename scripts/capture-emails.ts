/**
 * Dev-only: mock Postmark `fetch`, capture HTML email payloads. Run from repo root:
 *   npm run capture:emails
 * Writes JSON to /tmp/lbta-email-*.json (not committed).
 */
import { sendConfirmationEmail, sendTrialConfirmationEmail, sendPrivateLessonConfirmationEmail, sendScholarshipConfirmationEmail } from '@/lib/email';
import * as fs from 'fs';

const captured: Array<{subject: string, html: string, tag: string}> = [];
const origFetch = globalThis.fetch;
globalThis.fetch = (async (url: string | URL | Request, opts?: RequestInit) => {
  const urlStr = typeof url === 'string' ? url : url instanceof URL ? url.toString() : (url as Request).url;
  if (urlStr.includes('postmarkapp')) {
    const body = JSON.parse(opts?.body as string);
    captured.push({ subject: body.Subject, html: body.HtmlBody, tag: body.Tag });
    return new Response(JSON.stringify({ MessageID: 'test' }), { status: 200 });
  }
  return origFetch(url, opts as RequestInit);
}) as typeof fetch;

process.env.POSTMARK_SERVER_TOKEN = 'fake-for-capture';

async function main() {
  await sendConfirmationEmail({ email: 't@t.com', firstName: 'Sarah', programName: 'Orange Ball Tennis', location: 'Moulton Meadows', duration: '1 hr', ageGroup: '7-8 years', category: 'Youth' });
  await sendTrialConfirmationEmail({ email: 't@t.com', firstName: 'Jessica', program: 'Green Dot Tennis', location: 'Moulton Meadows' });
  await sendPrivateLessonConfirmationEmail({ email: 't@t.com', firstName: 'David', coach: 'Karue Sell', option: '4-Pack (Save 10%)' });
  await sendScholarshipConfirmationEmail({ email: 't@t.com', firstName: 'Maria', studentName: 'Sofia Rodriguez' });
  await sendConfirmationEmail({ email: 't@t.com', firstName: 'Michael', programName: 'Adult Intermediate', location: 'Alta Laguna', duration: '1.5 hrs', category: 'Adult' });

  for (let i = 0; i < captured.length; i++) {
    fs.writeFileSync('/tmp/lbta-email-' + i + '.json', JSON.stringify(captured[i]));
  }
  console.log('Captured ' + captured.length + ' emails');
}
main();
