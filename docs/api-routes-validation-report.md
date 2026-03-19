# API Routes Validation Report

**Date:** 2026-03-18  
**Scope:** `app/api/` — book, register-program, register-year, newsletter, scholarship, jtt-registration, activecampaign-webhook  
**Criteria:** (1) Zod validation + 400 for invalid body, (2) no 500 on validation failure, (3) rate limit try/catch, (4) consistent JSON response shape

---

## Summary

| Route | Zod + 400 | No 500 on validation | Rate limit try/catch | JSON shape | **Decision** |
|-------|-----------|----------------------|----------------------|------------|--------------|
| book | ✅ | ✅ | ✅ (allow on catch) | ✅ | **Ready** |
| register-program | ✅ | ✅ | ✅ (allow on catch) | ✅ generic 400 | **Ready** |
| register-year | ✅ | ✅ | ✅ (allow on catch) | ✅ generic 400 | **Ready** |
| newsletter | ✅ | ✅ | ✅ (allow on catch) | ✅ generic 400 | **Ready** |
| scholarship | ✅ | ✅ | ✅ (allow on catch) | ✅ generic 400 | **Ready** |
| jtt-registration | ✅ | ✅ | ✅ (allow on catch) | ✅ generic 400 | **Ready** |
| activecampaign-webhook | ✅ | ✅ | ✅ (allow on catch) | ✅ generic 400 | **Ready** |

**Fixes applied (2026-03-18):** register-program, register-year, newsletter, scholarship, jtt-registration now allow on rate-limit catch and return generic validation messages; activecampaign-webhook returns generic "Invalid webhook payload" for 400.

---

## Per-route detail

### 1. `app/api/book/route.ts` — **Ready**

- **parseJsonBody** → 400 "Invalid request format" when body is not valid JSON.
- **validateRequest** (bookingSchema / privateLessonBookingSchema) → 400 with **generic** message: "Invalid request. Please check your input." (does not expose Zod details).
- Validation failures never result in 500; outer catch returns 500 only for unexpected errors.
- **Rate limit:** `rateLimit()` wrapped in try/catch; on catch sets `rateLimitResult = { allowed: true, ... }` (allow on failure per quality bar).
- **JSON:** 400/429/500 → `{ success: false, error }`; 200 → `{ success: true, message }`.

---

### 2. `app/api/register-program/route.ts` — **Ready**

- **parseJsonBody** → 400 ✅  
- **validateRequest(programRegistrationSchema)** → 400 with generic message; validation details logged in non-production ✅  
- **Rate limit:** try/catch with allow on catch ✅  
- **JSON shape** ✅  

---

### 3. `app/api/register-year/route.ts` — **Ready**

- **parseJsonBody** + **validateRequest(registerYearSchema)** → 400 with generic message; validation logged in non-production ✅  
- **Rate limit:** allow on catch ✅  
- **JSON shape** ✅  

---

### 4. `app/api/newsletter/route.ts` — **Ready**

- **parseJsonBody** → 400 ✅  
- **validateRequest(newsletterSchema)** → 400 with generic message; validation logged in non-production ✅  
- **Rate limit:** allow on catch ✅  
- **JSON shape** ✅  

---

### 5. `app/api/scholarship/route.ts` — **Ready**

- **parseJsonBody** → 400 ✅  
- **validateRequest(scholarshipSchema)** → 400 with generic message; validation logged in non-production ✅  
- **Rate limit:** allow on catch ✅  
- **JSON shape** ✅  

---

### 6. `app/api/jtt-registration/route.ts` — **Ready**

- **parseJsonBody** → 400 ✅  
- **validateRequest(jttRegistrationSchema)** → 400 with generic message; validation logged in non-production ✅  
- **Rate limit:** allow on catch ✅  
- **JSON shape** ✅  

---

### 7. `app/api/activecampaign-webhook/route.ts` — **Ready**

- **parseJsonBody** → 400 "Invalid JSON body" ✅  
- **validateRequest(webhookPayloadSchema)** → 400 "Invalid webhook payload"; validation logged in non-production ✅  
- **Contact ID:** Validated as positive integer; 400 "Invalid contact ID" if invalid ✅  
- **Rate limit:** try/catch; allow on catch ✅  
- **JSON shape** ✅  

---

## Response shape consistency

- **Success:** All routes use `{ success: true, message?: string, ... }`.  
- **Error:** All use `{ success: false, error: string }`.  
- All routes now return a generic or fixed `error` string for 400 (no raw Zod output).

---

## References

- `lib/validations.ts` — `parseJsonBody`, `validateRequest`, Zod schemas  
- `lib/rate-limit.ts` — `rateLimit()` (never throws; returns `allowed: true` on internal catch)  
- `.cursor/compound/learnings/quality-bars.json` — `rateLimitTryCatchFormRoutes`, form-handler-never-500  
- `.cursor/compound/learnings/anti-patterns.json` — `optional-integration-causes-500`, `rate-limit-no-try-catch`, `api-400-raw-validation-error`
