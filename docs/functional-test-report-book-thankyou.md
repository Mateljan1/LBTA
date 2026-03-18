# Functional Test Report: Book & Thank-You Flows

**Scope:** Book trial, book private, thank-you page, PrivateCoachingSection link.  
**Method:** Code read-only (no live server).  
**Date:** 2026-03-17.

---

## Status: **WARNINGS**

---

## Findings

| Flow | Result | Note |
|------|--------|------|
| **1) Book trial** | PASS | Default `/book` shows hero "Book Your Free Trial" and opens `TrialBookingModal` via `useEffect` when `isPrivate` is false. Modal POSTs to `/api/book` with `firstName`, `lastName`, `email`, `phone`, `program`, `playerAge`, `goals`, `source` — **no `bookingType`**. API treats as trial (`raw.bookingType !== 'private'`), validates with `bookingSchema`. On success modal sets `window.location.href = '/thank-you'`. |
| **2) Book private** | PASS | `/book?type=private` shows hero "Book a Private Lesson" and 24hr subcopy; opens `PrivateLessonModal` via `useEffect`. Form POSTs with `bookingType: 'private'`, `coach`, `option` (60/90/10-pack/20-pack), contact fields, `message`. API uses `privateLessonBookingSchema`; on success modal redirects to `/thank-you?type=private`. |
| **3) Thank-you copy** | PASS | `getThankYouType(searchParams?.type)` maps `type=private` → "Request Received" + 24hr private copy; missing/other → `'trial'` → "You're All Set" + trial copy. `COPY_BY_TYPE` and logic match spec. |
| **4) PrivateCoachingSection link** | PASS | `PrivateCoachingSection.tsx` line 161: `<Link href="/book?type=private">` with label "Book a Private Lesson". |

---

## Summary

- **Book page:** Hero and modal selection by `?type=private` are correct; trial and private modals post the expected payloads and redirect as specified.
- **API:** `/api/book` branches on `bookingType === 'private'`, validates with the correct schemas, and returns success; no `bookingType` implies trial path.
- **Thank-you:** Copy by `type` is implemented correctly; **Next.js 15+ `searchParams` Promise** (see Warnings) can break reading `type` unless the page is updated.
- **Links:** Private coaching CTA correctly points to `/book?type=private`.

---

## Warnings

1. **Thank-you page and `searchParams` in Next 15+**  
   App uses Next 16 (`package.json`: `"next": "^16.1.1"`). In Next 15+, `page.tsx` receives `searchParams` as a **Promise**. `app/thank-you/page.tsx` uses it synchronously (`searchParams?.type`). If the runtime passes a Promise, `searchParams?.type` is undefined and `getThankYouType(undefined)` always returns `'trial'`, so `/thank-you?type=private` would show trial copy.  
   **Recommendation:** Make `ThankYouPage` async and type/await `searchParams`, e.g. `searchParams?: Promise<{ type?: string | string[] }>`, then `const params = await searchParams` and `getThankYouType(params?.type)`. Align with `app/schedules/calendar/page.tsx` pattern.

2. **Trial modal payload vs `bookingSchema`**  
   `TrialBookingModal` sends `playerAge` and `source`; `bookingSchema` does not define them. Zod strips unknown keys by default, so the API accepts the request; no functional failure, but `playerAge` is not persisted in AC/backend (only `program`, `goals`, etc. are in the schema). Optional clarification: document or add `playerAge` to schema if it should be stored.

---

## Blockers

**None** for the flows as implemented. The only potential **functional blocker** is (1) above if Next 16 actually passes `searchParams` as a Promise to the thank-you page; that would make private thank-you copy unreachable until the page is updated to await `searchParams`.

---

## Evidence (code references)

- **Book page hero & modal:** `app/book/page.tsx` L11–24 (isPrivate, useEffect), L30–38 (hero), L55, L151–152 (modals).
- **Trial modal submit:** `components/TrialBookingModal.tsx` L146–160 (POST without bookingType), L157–160 (redirect `/thank-you`).
- **Private modal submit:** `components/PrivateLessonModal.tsx` L146–168 (POST with bookingType, coach, option; redirect `/thank-you?type=private`).
- **API branch:** `app/api/book/route.ts` L69–74 (isPrivateLesson), L83–135 (private), L137–189 (trial).
- **Thank-you copy:** `app/thank-you/page.tsx` L14–40 (COPY_BY_TYPE), L36–40 (getThankYouType), L46–48 (type → headline/firstLine).
- **Private link:** `components/schedules/PrivateCoachingSection.tsx` L160–161 (`href="/book?type=private"`).
- **searchParams Promise usage:** `app/schedules/calendar/page.tsx` L33–38 (async, await searchParams).
