# Agent Tools — Action Parity Layer

**Purpose:** Agent-callable tools that mirror all user-facing API endpoints. Each tool calls the same API with the same request shapes as the frontend, ensuring **action parity** (Principle 1 of agent-native architecture).

**Security:** All tools require `AGENT_SECRET` environment variable. Tools should only run in development or behind authentication.

**Base URL:** Tools use `LBTA_API_URL` (default: `http://localhost:3000` for dev, or production URL).

---

## Available Tools

| Tool | API Endpoint | Purpose |
|------|-------------|---------|
| `book-trial.ts` | `POST /api/book` | Book a trial (group or private) |
| `register-program.ts` | `POST /api/register-program` | Register for a program |
| `register-year.ts` | `POST /api/register-year` | Year-round registration |
| `newsletter.ts` | `POST /api/newsletter` | Newsletter signup |
| `scholarship.ts` | `POST /api/scholarship` | Scholarship application |
| `chat.ts` | `POST /api/chat` | Send chat message |
| `register.ts` | `POST /api/register` | General registration |

**Note:** Coach hub auth/logout are intentionally excluded (human-only, no agent parity).

---

## Usage

### Setup (one-time)

The `AGENT_SECRET` is automatically generated and added to your `.env.local` file. If you need to regenerate it or set it manually:

```bash
# Generate a new secret (optional - already done for you)
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# Add to .env.local:
# AGENT_SECRET=your-generated-secret-here
```

### From command line:

```bash
# The AGENT_SECRET is automatically loaded from .env.local by Next.js
# For standalone scripts, you can also export it:
export AGENT_SECRET="your-secret-from-env-local"
export LBTA_API_URL="https://lagunabeachtennisacademy.com"  # Optional, defaults to localhost:3000

# Run a tool (using tsx from node_modules)
./node_modules/.bin/tsx scripts/agent-tools/newsletter.ts --email "test@example.com"
./node_modules/.bin/tsx scripts/agent-tools/book-trial.ts --firstName "John" --lastName "Doe" --email "john@example.com" --phone "9495551234"
```

### From agent/script:

```typescript
import { bookTrial } from './scripts/agent-tools/book-trial'

const result = await bookTrial({
  firstName: 'John',
  lastName: 'Doe',
  email: 'john@example.com',
  phone: '9495551234',
  // ... other fields
})
```

---

## Request Contracts

All tools follow the exact request shapes documented in `docs/api-contracts.md`. See that file for:
- Required vs optional fields
- Field types and constraints
- Response shapes
- Error handling

---

## Future: MCP Server

These tools can be wrapped in an MCP server (similar to `.cursor/scripts/ac-mcp-server.mjs`) to expose them via the Model Context Protocol. For now, they're standalone scripts for maximum flexibility.

---

*See `docs/AGENT-NATIVE-ARCHITECTURE-ROADMAP.md` Phase 2 for implementation details.*
