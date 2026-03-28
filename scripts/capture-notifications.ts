/**
 * Dev-only: mock Postmark `fetch`, capture internal notification payloads. Run from repo root:
 *   npm run capture:notifications
 * Writes JSON to /tmp/lbta-notify-*.json (not committed).
 */
import { notifyRegistration, notifyTrialRequest, notifyPrivateLesson, notifyScholarship, notifyNewsletter } from '@/lib/email';
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
  await notifyRegistration({
    firstName: 'Sarah', lastName: 'Thompson', email: 'sarah.t@example.com',
    phone: '(949) 555-1234', program: 'Orange Ball Tennis', location: 'Moulton Meadows',
    season: 'Spring 2026', studentName: 'Lily Thompson', studentAge: '8', experience: 'Beginner',
  });
  await notifyTrialRequest({
    firstName: 'Jessica', lastName: 'Martinez', email: 'jessica.m@example.com',
    phone: '(714) 555-9876', program: 'Green Dot Tennis', location: 'Moulton Meadows',
    experience: '1 year', preferredDays: ['Tuesday', 'Thursday'],
  });
  await notifyPrivateLesson({
    firstName: 'David', lastName: 'Chen', email: 'david.c@example.com',
    phone: '(949) 555-4567', coach: 'Karue Sell', option: '4-Pack (Save 10%)',
  });
  await notifyScholarship({
    parentName: 'Maria Rodriguez', email: 'maria.r@example.com',
    phone: '(949) 555-7890', studentName: 'Sofia Rodriguez',
  });
  await notifyNewsletter('newplayer@example.com');

  for (let i = 0; i < captured.length; i++) {
    fs.writeFileSync('/tmp/lbta-notify-' + i + '.json', JSON.stringify(captured[i]));
  }
  console.log('Captured ' + captured.length + ' notifications');
}
main();
