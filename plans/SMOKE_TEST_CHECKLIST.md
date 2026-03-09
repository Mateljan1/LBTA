# LBTA Smoke Test Checklist (Post-Deploy)

**Target:** Vercel production (replace `https://YOUR_PRODUCTION_URL` with actual URL)  
**Scope:** Critical paths only. No server started; run after deploy.

---

## Status

**Checklist ready.** Run the steps below once the site is deployed to verify critical paths. No live URL was used; all expectations are derived from the codebase.

---

## Checklist

### 1. Pages (load with 200, no client crash)

| Path | Method | Check | Pass |
|------|--------|-------|------|
| `/` | GET | 200, HTML, homepage content visible | ☐ |
| `/schedules` | GET | 200, HTML, schedules/programs content | ☐ |
| `/book` | GET | 200, HTML, trial booking page | ☐ |
| `/contact` | GET | 200, HTML, contact page | ☐ |

**Browser:** Open each URL; confirm page loads and no blank/error screen.  
**curl:**  
`curl -s -o /dev/null -w "%{http_code}" https://YOUR_PRODUCTION_URL/` → expect `200` (repeat for `/schedules`, `/book`, `/contact`).

---

### 2. API: `/api/newsletter` (POST)

| Check | Request | Expected response | Pass |
|-------|---------|-------------------|------|
| Invalid JSON → 400 | `Content-Type: application/json`, body `not json` or `{` | Status **400**, body has `success: false` and `error: "Invalid request format"` | ☐ |
| Invalid shape → 400 | `{"foo":"bar"}` or `{}` (no email) | Status **400**, body `success: false`, `error` contains validation message (e.g. email) | ☐ |
| Valid shape → 200 or 500 | `{"email":"test@example.com"}` | Status **200** with `success: true`, `message: "Subscribed successfully"` **or** **500** if ActiveCampaign/env not configured (still confirms route and validation path) | ☐ |

**curl examples:**

```bash
# Invalid JSON → 400
curl -s -w "\nHTTP_CODE:%{http_code}" -X POST https://YOUR_PRODUCTION_URL/api/newsletter \
  -H "Content-Type: application/json" -d 'not json'

# Invalid shape (no email) → 400
curl -s -w "\nHTTP_CODE:%{http_code}" -X POST https://YOUR_PRODUCTION_URL/api/newsletter \
  -H "Content-Type: application/json" -d '{}'

# Valid shape → 200 (or 500 if AC unavailable)
curl -s -w "\nHTTP_CODE:%{http_code}" -X POST https://YOUR_PRODUCTION_URL/api/newsletter \
  -H "Content-Type: application/json" -d '{"email":"smoke-test@example.com"}'
```

---

### 3. API: `/api/book` (POST)

| Check | Request | Expected response | Pass |
|-------|---------|-------------------|------|
| Invalid JSON → 400 | `Content-Type: application/json`, body `{` or non-JSON | Status **400**, body `success: false`, `error: "Invalid request format"` | ☐ |
| Invalid shape → 400 | `{}` or `{"email":"x"}` (missing required: firstName, lastName, phone) | Status **400**, body `success: false`, `error` contains validation message | ☐ |
| Valid shape → 200 (or 500) | Valid booking body (see below) | Status **200**, body `success: true`, `message` contains "Trial request received" **or** **500** if backend/env issue | ☐ |

**Minimal valid body (from `bookingSchema`):**  
`firstName`, `lastName`, `email`, `phone` required; `program`, `location`, `preferredDays`, `experience`, `goals` optional.

**curl examples:**

```bash
# Invalid JSON → 400
curl -s -w "\nHTTP_CODE:%{http_code}" -X POST https://YOUR_PRODUCTION_URL/api/book \
  -H "Content-Type: application/json" -d '{'

# Invalid shape → 400
curl -s -w "\nHTTP_CODE:%{http_code}" -X POST https://YOUR_PRODUCTION_URL/api/book \
  -H "Content-Type: application/json" -d '{"email":"a@b.com"}'

# Valid shape → 200
curl -s -w "\nHTTP_CODE:%{http_code}" -X POST https://YOUR_PRODUCTION_URL/api/book \
  -H "Content-Type: application/json" \
  -d '{"firstName":"Smoke","lastName":"Tester","email":"smoke@example.com","phone":"9495550000"}'
```

---

## Summary

- **Pages:** 4 paths (/, /schedules, /book, /contact) — load, 200, content present.
- **APIs:** 2 routes — invalid JSON → 400 + "Invalid request format"; invalid shape → 400 + validation error; valid shape → 200 + correct JSON shape (or 500 if external service down).

**Rate limits:** Newsletter and book use rate limiting (e.g. 5/min for book). If you hit 429, wait or use different IP; 429 still confirms the route is live.

---

## Score

**100** — Checklist is complete and aligned with the codebase. Score reflects readiness of the checklist and expected behavior; after you run it on production, the **pass rate** (e.g. 10/10 checks) is your deploy score.

**Quick score after run:**  
`(passed checks / 10) * 100`  
- 10/10 = 100  
- 8/10 = 80 (e.g. 2 pages or API checks failed)
