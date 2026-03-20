# API Request Contracts

**Purpose:** Document request shapes for all user-facing API endpoints so agent tools and frontend stay in sync. See **lib/validations.ts** for Zod schemas.

**Last updated:** March 2025

---

## Endpoints

### POST `/api/book`

**Purpose:** Trial booking (group or private lesson)

**Request body:**
```typescript
{
  firstName: string        // 1-100 chars
  lastName: string         // 1-100 chars
  email: string            // Valid email, max 255 chars
  phone: string            // 10-20 chars
  program?: string         // Max 200 chars
  location?: string        // Max 200 chars
  preferredDays?: string[] // Max 31 items, each max 50 chars
  experience?: string      // Max 200 chars
  goals?: string           // Max 1000 chars
  // For private lessons:
  bookingType?: 'private'
  coach?: string           // Required if bookingType === 'private', max 200 chars
  option?: '60' | '90' | '10-pack' | '20-pack'
  message?: string         // Max 500 chars
}
```

**Response:** `{ success: boolean, message?: string, error?: string }`

**Schema:** `bookingSchema` or `privateLessonBookingSchema` from `lib/validations.ts`

---

### POST `/api/register-program`

**Purpose:** Program registration (e.g. junior programs, adult programs)

**Request body:**
```typescript
{
  firstName: string        // 1-100 chars
  lastName: string         // 1-100 chars
  email: string            // Valid email, max 255 chars
  phone: string            // 10-20 chars
  program: string          // Required, 1-200 chars
  location?: string        // Max 200 chars
  studentName?: string     // Max 200 chars
  studentAge?: string | number
  preferredDays?: string[] // Max 31 items, each max 50 chars
  timeSlot?: string        // Max 100 chars
  totalPrice?: string | number
  experience?: string      // Max 200 chars
  notes?: string           // Max 2000 chars
}
```

**Response:** `{ success: boolean, message?: string, error?: string }`

**Schema:** `programRegistrationSchema` from `lib/validations.ts`

---

### POST `/api/register-year`

**Purpose:** Year-round registration (seasonal, camp, UTR circuit, etc.)

**Request body:**
```typescript
{
  registrationType?: 'seasonal' | 'camp' | 'utr-circuit' | 'jtt' | 'swim-tennis' | 'private' | 'inquiry' // Default: 'seasonal'
  firstName: string        // 1-100 chars
  lastName: string         // 1-100 chars
  email: string            // Valid email, max 255 chars
  phone: string            // 10-20 chars
  program: string          // Required, 1-200 chars
  studentName?: string     // Max 200 chars
  playerName?: string       // Max 200 chars
  preferredDays?: string[] // Max 31 items, each max 50 chars
  location?: string        // Max 200 chars
  timeSlot?: string        // Max 100 chars
  totalPrice?: string | number
  price?: string | number
  studentAge?: string | number
  playerAge?: string | number
  season?: string          // Max 50 chars
  experience?: string      // Max 200 chars
  notes?: string           // Max 2000 chars
  programId?: string       // Max 100 chars
  campId?: string          // Max 100 chars
  campName?: string        // Max 200 chars
  campDates?: string       // Max 200 chars
  campWeek?: string        // Max 100 chars
  division?: string        // Max 100 chars
  // ... passthrough allows additional fields
}
```

**Response:** `{ success: boolean, message?: string, error?: string }`

**Schema:** `registerYearSchema` from `lib/validations.ts`

---

### POST `/api/newsletter`

**Purpose:** Newsletter signup

**Request body:**
```typescript
{
  email: string            // Valid email, max 255 chars
}
```

**Response:** `{ success: boolean, message?: string, error?: string }`

**Schema:** `newsletterSchema` from `lib/validations.ts`

---

### POST `/api/scholarship`

**Purpose:** Scholarship application

**Request body:**
```typescript
{
  studentName: string      // 1-100 chars
  parentName: string       // 1-100 chars
  email: string            // Valid email, max 255 chars
  phone?: string           // 10-20 chars
  studentGPA?: string      // Max 20 chars
  householdIncome?: string // Max 100 chars
  sessionsPerWeek?: string | number
  commitment?: string      // Max 200 chars
  notes?: string           // Max 2000 chars
  // ... passthrough allows additional fields
}
```

**Response:** `{ success: boolean, message?: string, error?: string }`

**Schema:** `scholarshipSchema` from `lib/validations.ts`

---

### POST `/api/chat`

**Purpose:** Chat widget message (stub — returns fixed reply)

**Request body:**
```typescript
{
  message: string          // Required, 1-2000 chars
  history?: Array<{       // Optional, max 50 items
    role: 'user' | 'assistant'
    content: string        // Max 2000 chars
  }>
}
```

**Response:** `{ reply: string }` (always returns redirect to phone/contact)

**Schema:** `chatSchema` from `lib/validations.ts`

**Note:** Backend is a stub; does not use `history` or generate AI responses.

---

### POST `/api/coach-hub/auth`

**Purpose:** Coach hub login

**Request body:**
```typescript
{
  password: string         // Required, 1-512 chars
}
```

**Response:** 
- `200`: `{ success: true }` (sets cookie)
- `400`: `{ success: false, error: string }` (invalid body)
- `401`: `{ success: false, error: string }` (wrong password)

**Schema:** `coachHubAuthSchema` from `lib/validations.ts`

---

### GET `/api/coach-hub/logout`

**Purpose:** Coach hub logout

**Request:** No body

**Response:** `{ success: boolean }` (clears cookie)

---

### POST `/api/register`

**Purpose:** General registration (contact + player info)

**Request body:**
```typescript
{
  firstName: string        // 1-100 chars
  lastName: string         // 1-100 chars
  email: string            // Valid email, max 255 chars
  phone: string            // 10-20 chars
  age: string | number
  skillLevel: string       // Required, 1-100 chars
  experience: string       // Required, 1-500 chars
  program?: string         // Max 200 chars
  season?: string          // Max 50 chars
  earlyBird?: boolean
  finalPrice?: string | number
  goals?: string           // Max 1000 chars
  notes?: string           // Max 2000 chars
}
```

**Response:** `{ success: boolean, message?: string, error?: string }`

**Schema:** `registerSchema` from `lib/validations.ts`

---

## Common Patterns

### Rate Limiting
All form endpoints use rate limiting with unique keys per route (e.g. `book:${ip}`, `register-program:${ip}`). See `lib/rate-limit.ts`.

### Validation
All endpoints use Zod schemas from `lib/validations.ts`. Invalid requests return `400` with error message.

### Response Shape
All endpoints return:
```typescript
{
  success: boolean
  message?: string    // Success message
  error?: string      // Error message (client-safe, no PII)
}
```

### Error Handling
- `400`: Validation error or invalid request body
- `401`: Authentication failure (coach-hub)
- `429`: Rate limit exceeded
- `500`: Server error (generic message to client, details logged server-side)

---

## Agent Tool Parity

For action parity (agent-native architecture), each endpoint above should have a corresponding agent tool that:
1. Calls the same API with the same request shape
2. Uses the same validation schemas
3. Respects the same rate limits
4. Returns the same response format

**Status:** No agent tools currently exist. See `docs/AGENT-NATIVE-ARCHITECTURE-AUDIT.md` for recommendations.

---

*See `lib/validations.ts` for TypeScript types and Zod schemas. Keep this doc in sync when adding or changing endpoints.*
