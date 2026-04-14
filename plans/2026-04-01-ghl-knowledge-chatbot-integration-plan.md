# GHL Conversation History Knowledge Integration Plan

## Overview

Replace the lightweight Poppy AI proxy with a direct Claude API chatbot that ingests LBTA's 10,688 curated customer-facing conversation examples, 12 intent playbooks, and segment-specific knowledge packs to produce responses grounded in real LBTA messaging patterns -- not generic AI output.

## Problem Statement

The current chatbot architecture (`/api/chatbot-webhook` -> `lib/poppy.ts` -> Poppy AI) has three structural limitations:

1. **No conversation history grounding.** Poppy receives only a system prompt prefix and the user's single message. It has no access to the 65,693 real GHL messages, meaning it invents plausible-sounding responses rather than mirroring how LBTA actually communicates. When a parent asks about makeup classes, proration, or scheduling conflicts, the bot guesses instead of following the patterns Ben/Robert have used thousands of times.

2. **No intent routing.** The current system treats every inbound message identically -- the same system prompt, the same model call, the same response strategy. But the GHL data reveals 12 distinct intent categories with dramatically different response patterns: a "thanks" message needs a 15-word acknowledgment, a "pricing" question needs a detailed 200-word breakdown with specific dollar amounts, and a "complaint_or_issue" needs empathy + escalation. One-size-fits-all fails.

3. **No contact context.** The bot cannot personalize. It doesn't know if the parent is a long-time family (Kristen Sanderson with 3,000+ messages) or a brand-new lead. The GHL contact index has this data -- tags, message history, enrollment status -- but none of it reaches the AI.

**Why now:** The GHL conversation history pipeline has been built and validated. The data is clean, segmented, and production-ready in `knowledge/ghl/latest/`. The existing March 30 chatbot plan focuses on GHL Conversation AI native deployment. This plan is the complementary path: making the Vercel webhook chatbot dramatically smarter using the same data, regardless of which platform ultimately serves as the primary chatbot.

## Proposed Solution

**Architecture: Direct Claude API with intent-routed few-shot retrieval**

Replace Poppy AI with a direct Anthropic Claude API call from the Vercel webhook. The system prompt gets enriched with: (1) the customer-facing chatbot knowledge pack (18KB markdown), (2) intent-matched few-shot examples selected at runtime from a pre-indexed JSONL store, and (3) contact context from GHL when available.

(Source: Anthropic prompting best practices -- "Examples are one of the most reliable ways to steer Claude's output format, tone, and structure." 3-5 well-crafted examples per intent dramatically improve accuracy.)

The solution has four layers:

1. **Knowledge Layer** -- The customer-facing chatbot knowledge pack (`ghl_chatbot_knowledge.md`, 18KB) is embedded directly in the system prompt as static context. This gives Claude the intent playbook summaries, typical asks/replies per category, and LBTA operational knowledge. Small enough to fit in every request without RAG infrastructure.

2. **Few-Shot Layer** -- At build time, the 10,688 curated response examples are indexed into a lightweight keyword-based retrieval structure (stored as a JSON file on disk). At runtime, the inbound message is matched against this index, and the top 3-5 most relevant examples are injected into the prompt as `<example>` blocks. This is the highest-leverage improvement: real LBTA responses as few-shot demonstrations.

3. **Intent Router** -- A fast, low-cost classification step (either keyword-based heuristics from the intent playbooks, or a single cheap Claude Haiku call) determines the message's intent category before the main generation call. This controls which few-shot examples to retrieve and which segment-specific instructions to activate (customer-facing vs billing-support vs internal-ops).

4. **Contact Context Layer** -- When the GHL webhook payload includes a `contactId`, fetch the contact's recent conversation summary from GHL (or from a cached contact index) and inject it as context. This lets the bot say "Hi Kristen!" instead of "Hi there!" and know that Lars is enrolled in Youth Development.

### Why not continue with Poppy?

Poppy AI is a content strategy platform, not a chatbot infrastructure. Its API is a passthrough to an LLM with a board-level knowledge base. The limitations:
- Cannot upload files via API (their docs confirm this is "in active development")
- Cannot inject per-request few-shot examples
- Cannot route by intent
- Cannot inject contact context
- Adds latency (extra network hop) and cost (credit-based pricing) vs direct Claude API
- The board's knowledge base is static -- updating it requires manual UI interaction

The direct Claude API gives full control over the prompt, enables prompt caching (70-80% cost reduction on repeated context), and allows the exact architecture this data was built for.

(Source: Anthropic prompt caching documentation -- cached system prompts reduce costs dramatically for RAG-style workloads with shared context.)

## Implementation Steps

### Phase 1: Foundation -- Claude API Client & Knowledge Embedding (Day 1)

- [ ] 1.1: Install `@anthropic-ai/sdk` as a project dependency
- [ ] 1.2: Create `lib/claude.ts` -- typed Claude API client with error handling, retry logic, and response parsing. Accept `systemPrompt`, `userMessage`, `examples` (array of `{user: string, assistant: string}`), and `model` (default: `claude-sonnet-4-6`). Return `{text: string | null, inputTokens: number, outputTokens: number, error?: string}`. Never throw -- same contract as current `askPoppy`
- [ ] 1.3: Create `lib/chatbot-knowledge.ts` -- load and cache the customer-facing chatbot knowledge markdown at module scope. Read from `knowledge/ghl/chatbot/customer_facing/ghl_chatbot_knowledge.md` (bundled into the project at build time). Export `getChatbotKnowledge(): string`
- [ ] 1.4: Create `lib/chatbot-system-prompt.ts` -- compose the full system prompt by combining: (a) Andrew voice rules (migrated from current `SYSTEM_PREFIX` in `lib/poppy.ts`), (b) the chatbot knowledge pack, (c) escalation rules, (d) intent-specific instructions placeholder. Export `buildSystemPrompt(intent?: string): string`
- [ ] 1.5: Add `ANTHROPIC_API_KEY` to Vercel env vars on **both** Vercel projects (per `vercel-dual-project.md` memory). Use `encrypted` type (per `feedback-vercel-env-type.md` memory)

### Phase 2: Few-Shot Example Index (Day 1-2)

- [ ] 2.1: Create `scripts/build-example-index.ts` -- build script that reads `ghl_response_examples_curated.jsonl` (customer-facing segment, 10,688 examples) and produces a compact JSON index file. For each example, extract: `id`, `intent_labels`, `inbound_text`, `outbound_text`, and a keyword set (top 8 TF-IDF-ish terms from inbound_text after stopword removal). Output: `knowledge/ghl/chatbot/example-index.json` (estimated ~3-5MB)
- [ ] 2.2: Create `lib/example-retriever.ts` -- at runtime, load the example index (cached in memory on first request via module-scope `let`). Given an inbound message and optional intent label, score examples by keyword overlap + intent match, return top 5 ranked examples as `{inbound: string, outbound: string}[]`. No vector DB needed -- keyword matching on 10K examples is sub-millisecond in-memory
- [ ] 2.3: Write tests for the example retriever: verify that "Is tennis cancelled today because of rain?" returns weather-intent examples, "How much does LiveBall cost?" returns pricing examples, and "Thank you Ben!" returns short acknowledgment examples
- [ ] 2.4: Add `knowledge/ghl/` directory to the project (symlink or copy the customer-facing segment from `~/Desktop/Andrew_Clone_Package/knowledge/ghl/latest/chatbot/customer_facing/`). Add to `.gitignore` if files exceed reasonable repo size; otherwise commit the chatbot-specific files only (knowledge pack + intent playbooks + built index, not the raw 16MB JSONL)

### Phase 3: Intent Classification (Day 2)

- [ ] 3.1: Create `lib/intent-classifier.ts` -- classify an inbound message into one of the 12 intent categories: `general`, `thanks`, `schedule`, `general_question`, `trial_or_booking`, `pricing`, `weather`, `payment_process`, `private_lessons`, `complaint_or_issue`, `attendance`, `makeup`. Two strategies:
  - **Primary (fast, free):** Keyword heuristic using the intent playbook sample user messages as a reference corpus. Match against top terms per intent. Returns in <1ms
  - **Fallback (if heuristic confidence is low):** Single Claude Haiku call with the 12 intent labels and 2 example messages per label. Returns in ~200ms, costs ~$0.001
- [ ] 3.2: Export `classifyIntent(message: string): Promise<{intent: string, confidence: number, method: 'keyword' | 'llm'}>` with explicit types
- [ ] 3.3: Write tests covering: each of the 12 intents with 3 sample messages (36 test cases), edge cases (empty message, emoji-only, mixed intents), and verify keyword classifier handles the high-volume intents (general, thanks, schedule) without needing the LLM fallback

### Phase 4: Contact Context Hydration (Day 2-3)

- [ ] 4.1: Create `lib/contact-context.ts` -- given a `contactId`, fetch the contact's recent context. Two sources:
  - **Fast path:** Look up `contactId` in the pre-built `ghl_contact_index.jsonl` (cached in memory, keyed by contact_id). Returns tags, message counts, top intents, latest inbound/outbound text
  - **Live path (optional, Phase 2):** Call GHL API to get the contact's last 5 messages for real-time context. Uses existing `GHL_PIT_TOKEN`
- [ ] 4.2: Export `getContactContext(contactId: string): Promise<{name: string, tags: string[], recentMessages: string[], enrollmentStatus: string} | null>`. Return null if contact not found -- bot falls back to generic greeting
- [ ] 4.3: Build the contact index loader: `scripts/build-contact-index.ts` reads `ghl_contact_index.jsonl`, extracts the fields needed for context (name, tags, top intents, message counts), and outputs a compact `knowledge/ghl/contact-index.json` keyed by `contact_id`. Estimated ~1-2MB

### Phase 5: Webhook Integration (Day 3)

- [ ] 5.1: Modify `app/api/chatbot-webhook/route.ts` -- replace the `askPoppy` call with the new pipeline:
  ```
  1. Extract contactId, messageBody, contactName from GHL payload (existing logic)
  2. Check escalation keywords (existing `needsEscalation` -- keep as-is)
  3. classifyIntent(messageBody)
  4. getContactContext(contactId)
  5. retrieveExamples(messageBody, intent)
  6. buildSystemPrompt(intent)
  7. askClaude(systemPrompt, messageBody, examples, contactContext)
  8. sendGhlSms(contactId, response)
  ```
- [ ] 5.2: Add feature flag: `CHATBOT_ENGINE` env var (`poppy` | `claude`). Default to `poppy` so deployment doesn't break existing behavior. Set to `claude` when ready to switch. This allows instant rollback
- [ ] 5.3: Add response logging: log intent classification, example count, contact context hit/miss, token usage, and latency to console. Structured JSON for Vercel log parsing
- [ ] 5.4: Keep `lib/poppy.ts` intact -- do not delete. The feature flag allows A/B comparison

### Phase 6: Billing-Support & Edge Case Handling (Day 3-4)

- [ ] 6.1: Enhance escalation logic in `lib/chatbot-system-prompt.ts`: for `pricing`, `payment_process`, and `complaint_or_issue` intents, inject the billing-support knowledge pack segment as additional system prompt context (29KB). This gives the bot billing-specific patterns without polluting customer-facing responses
- [ ] 6.2: Add conversation-length guardrails: if a conversation exceeds 8 back-and-forth messages (detectable via GHL conversation history), auto-escalate to human with a warm handoff message. Prevents the bot from getting stuck in loops
- [ ] 6.3: Add "I don't know" instruction: for questions where the knowledge pack and examples provide no clear answer, instruct Claude to say "Let me check on that and get back to you" and trigger an internal notification (reuse existing `notifyEscalation` with a "needs-research" reason). This prevents hallucinated program details or pricing

### Phase 7: Testing & Validation (Day 4-5)

- [ ] 7.1: Create `scripts/chatbot-smoke-test.ts` -- send 20 test messages covering all 12 intents and verify: (a) response is non-empty, (b) response passes voice quality check (no periods at end, no banned words, under 200 chars per thought), (c) escalation triggers fire correctly, (d) few-shot examples are relevant to the query
- [ ] 7.2: A/B comparison: run the same 20 messages through both Poppy and Claude pipelines, compare side-by-side. Document quality differences
- [ ] 7.3: Latency benchmark: measure end-to-end webhook response time. Target: <3 seconds (GHL webhook timeout). Claude Sonnet 4.6 typically responds in 1-2 seconds for short outputs
- [ ] 7.4: Cost estimate: calculate per-message cost based on actual token usage from smoke tests. Target: <$0.01 per message (system prompt ~5K tokens cached + ~100 token user message + ~500 token few-shot examples + ~150 token response)

## Files to Create/Modify

| File | Action | Purpose |
|------|--------|---------|
| `lib/claude.ts` | Create | Direct Claude API client with typed responses |
| `lib/chatbot-knowledge.ts` | Create | Load and cache the GHL chatbot knowledge pack |
| `lib/chatbot-system-prompt.ts` | Create | Compose intent-aware system prompts with voice rules |
| `lib/example-retriever.ts` | Create | Keyword-based few-shot example retrieval from index |
| `lib/intent-classifier.ts` | Create | 12-intent message classifier (keyword + LLM fallback) |
| `lib/contact-context.ts` | Create | Contact context hydration from index + GHL API |
| `scripts/build-example-index.ts` | Create | Build-time script to index 10,688 curated examples |
| `scripts/build-contact-index.ts` | Create | Build-time script to compact contact index for runtime |
| `scripts/chatbot-smoke-test.ts` | Create | 20-message smoke test across all 12 intents |
| `knowledge/ghl/chatbot/customer_facing/ghl_chatbot_knowledge.md` | Copy | 18KB customer-facing knowledge pack |
| `knowledge/ghl/chatbot/customer_facing/ghl_intent_playbooks.jsonl` | Copy | 12 intent playbooks for classifier reference |
| `knowledge/ghl/chatbot/billing_support/ghl_chatbot_knowledge.md` | Copy | 29KB billing-support knowledge pack |
| `knowledge/ghl/chatbot/example-index.json` | Generate | Built by `build-example-index.ts` at build time |
| `knowledge/ghl/contact-index.json` | Generate | Built by `build-contact-index.ts` at build time |
| `app/api/chatbot-webhook/route.ts` | Modify | Replace Poppy with Claude pipeline, add feature flag |
| `lib/poppy.ts` | Keep | Preserved for rollback via feature flag |
| `package.json` | Modify | Add `@anthropic-ai/sdk` dependency |
| `.gitignore` | Modify | Add raw JSONL source files if not committing them |

```yaml
# files (for tooling; do not edit by hand)
create:
  - lib/claude.ts
  - lib/chatbot-knowledge.ts
  - lib/chatbot-system-prompt.ts
  - lib/example-retriever.ts
  - lib/intent-classifier.ts
  - lib/contact-context.ts
  - scripts/build-example-index.ts
  - scripts/build-contact-index.ts
  - scripts/chatbot-smoke-test.ts
modify:
  - app/api/chatbot-webhook/route.ts
  - package.json
  - .gitignore
copy:
  - knowledge/ghl/chatbot/customer_facing/ghl_chatbot_knowledge.md
  - knowledge/ghl/chatbot/customer_facing/ghl_intent_playbooks.jsonl
  - knowledge/ghl/chatbot/billing_support/ghl_chatbot_knowledge.md
generate:
  - knowledge/ghl/chatbot/example-index.json
  - knowledge/ghl/contact-index.json
keep:
  - lib/poppy.ts
```

## Out of Scope (this plan)

- **GHL Conversation AI native deployment** -- covered in the March 30 plan (`2026-03-30-lbta-ghl-chatbot-plan.md`). This plan complements it by making the Vercel webhook path smarter. Both can coexist
- **Vector database / embeddings infrastructure** -- keyword retrieval on 10K examples is sufficient. Embedding-based retrieval is a future upgrade if keyword matching proves inadequate
- **Conversation memory across messages** -- this plan handles single-turn responses. Multi-turn conversation threading (remembering what the parent said 3 messages ago) requires GHL conversation history API integration, which is a Phase 2 enhancement
- **The 17 GHL automation workflows** -- those are GHL-native and covered in the March 30 plan
- **Website chat widget** -- this plan focuses on the SMS webhook path (GHL inbound -> Vercel -> Claude -> GHL outbound). The website widget is a separate concern
- **Training or fine-tuning a custom model** -- few-shot prompting with real examples achieves the same quality without the cost or complexity of fine-tuning
- **Real-time GHL API calls for live conversation history** -- the contact index is pre-built. Live API calls are marked as optional Phase 2 in step 4.1
- **Internal ops segment** -- the chatbot responds to parents, not coaches. Internal ops data is excluded from the customer-facing knowledge pack by design

## Success Criteria

- [ ] Claude-powered chatbot responds to all 12 intent categories with voice-appropriate, factually grounded answers
- [ ] Few-shot examples are relevant to the inbound message (manual review of 20 test cases)
- [ ] Bot sounds like Andrew/Ben -- passes the 10-point voice quality check (no periods, child name first, one CTA, no banned words, short responses)
- [ ] Escalation triggers fire correctly for complaints, refunds, private lessons with Andrew, and billing issues
- [ ] End-to-end webhook latency is under 3 seconds (GHL timeout constraint)
- [ ] Per-message cost is under $0.01 (prompt caching + short outputs)
- [ ] Feature flag allows instant rollback to Poppy without code changes
- [ ] Intent classifier achieves >85% accuracy on the 36-case test suite
- [ ] Contact context personalizes responses when contactId is available (greeting by name, awareness of enrollment status)

## Acceptance Checklist

- [ ] [Voice] Send "Hi, what programs do you have for my 7 year old?" -> response mentions Jr. Champions, uses child-name-first pattern, no periods at end, one CTA. Verify against 3 similar real examples from the knowledge pack
- [ ] [Intent] Send messages for all 12 intents -> classifier returns correct intent for 10+ of 12
- [ ] [Few-Shot] Send "Is tennis cancelled today because of rain?" -> verify the injected examples are weather-related, not general
- [ ] [Escalation] Send "I want a refund" -> bot sends holding response, `notifyEscalation` fires, GHL SMS contains "Let me look into this and get back to you today"
- [ ] [Contact] Send message with a known contactId from the index -> response includes the contact's name and awareness of their enrollment
- [ ] [Billing] Send "Can you prorate July since we'll be away?" -> response follows the billing-support patterns from the knowledge pack (empathetic, "this is noted", offers to schedule)
- [ ] [Rollback] Set `CHATBOT_ENGINE=poppy` -> verify webhook uses Poppy path, responses match previous behavior
- [ ] [Latency] Measure 10 webhook round-trips -> all under 3 seconds
- [ ] [Cost] Log token usage for 20 messages -> calculate average cost, verify under $0.01/message
- [ ] [No Hallucination] Send "What is the price for the Gold Package?" (a program that doesn't exist) -> bot responds with "Let me check on that" or similar, does NOT invent a price

## Research Sources

- [Anthropic Prompting Best Practices](https://platform.claude.com/docs/en/build-with-claude/prompt-engineering/claude-prompting-best-practices) -- few-shot examples, system prompt structure
- [Anthropic Multishot Prompting Guide](https://docs.anthropic.com/en/docs/build-with-claude/prompt-engineering/multishot-prompting) -- `<example>` tag structure, 3-5 example recommendation
- [Anthropic Long Context Prompting](https://www.anthropic.com/news/prompting-long-context) -- context window management, "lost in the middle" mitigation
- [Claude Context Engineering Best Practices](https://01.me/en/2025/12/context-engineering-from-claude/) -- four pillars of context optimization
- [Vercel Serverless Function Limits](https://vercel.com/docs/functions/limitations) -- 4.5MB body limit, 250MB function size
- [Poppy AI FAQ](https://intercom.help/poppy-ai/en/articles/12666719-poppy-api-power-user-frequently-asked-questions) -- API limitations, no file upload via API
- GHL conversation history pipeline manifest (`knowledge/ghl/latest/ghl_export_manifest.json`) -- 10,688 customer-facing examples, 7,902 retrieval chunks, 1,531 conversation summaries
- GHL use case manifest (`knowledge/ghl/latest/ops/ghl_use_case_manifest.json`) -- recommended file bundles per use case

## Relevant Learnings

- **From `vercel-dual-project.md` memory:** TWO Vercel projects deploy the same repo. Env vars must be set on BOTH projects. The `ANTHROPIC_API_KEY` must be added to both
- **From `feedback-vercel-env-type.md` memory:** Use Vercel `encrypted` type, not `sensitive`. Sensitive returns empty on reads
- **From `lead-pipeline-architecture.md` memory:** The website form -> notification pipeline has 6 API routes and 5 downstream systems. The chatbot webhook is one of these routes. Changes must not break the existing form submission flow
- **From existing `lib/poppy.ts`:** The current system prompt is 31 lines of voice rules. The new system prompt will be ~500 lines (voice rules + knowledge pack). Prompt caching makes this cost-effective
- **From `SYSTEM_PREFIX` in poppy.ts:** Andrew's voice DNA is already codified: no periods, child name first, "investment" not "cost", single CTA, specific emoji rules, banned words list. These rules must be preserved exactly in the new system prompt
- **From GHL data analysis:** Average inbound message is 76.5 chars (~20 tokens). Average outbound is 333.7 chars (~80 tokens). The system prompt + few-shot examples will dominate token usage, making prompt caching essential

## Research Conflicts & Resolution

**Conflict 1: Poppy AI vs Direct Claude API**
- The March 30 plan explicitly says "Poppy AI chatbot deployment -- eliminated. Content strategy tool, not a chatbot platform." However, the current production code uses Poppy AI via `lib/poppy.ts`.
- **Resolution:** This plan replaces Poppy with direct Claude API but keeps the Poppy code for rollback. The feature flag (`CHATBOT_ENGINE`) allows switching without deployment. This aligns with the March 30 plan's assessment while being non-destructive.

**Conflict 2: Knowledge pack size vs Vercel function limits**
- The customer-facing chatbot knowledge pack is 18KB (well within limits). The full curated examples JSONL is 16MB (too large to embed in every request). The example index (~3-5MB) is at the edge of the 4.5MB body limit.
- **Resolution:** The example index is loaded into memory at cold start (not sent in the request body). Only 3-5 selected examples (~2KB) are injected into each prompt. The 4.5MB body limit applies to the HTTP request/response, not to in-memory data. Vercel serverless functions can hold up to 250MB uncompressed. The index fits comfortably.

**Conflict 3: Keyword retrieval vs Vector/embedding retrieval**
- Best practices recommend embedding-based retrieval for semantic similarity. However, keyword matching on 10K examples with known intent labels is fast, free, and avoids infrastructure complexity.
- **Resolution:** Start with keyword retrieval. The intent labels (12 categories) provide strong pre-filtering, and keyword overlap within an intent category is sufficient for few-shot selection. If quality is inadequate after testing, upgrade to embeddings as a Phase 2 enhancement. The `example-retriever.ts` interface is designed to be swappable.

## Confidence & Uncertainty

**Plan confidence: HIGH**

The data pipeline is complete and validated. The Anthropic Claude API is well-documented. The architecture (system prompt + few-shot examples + intent routing) is a proven pattern. No new infrastructure is needed -- this is a code-only change to the existing Vercel webhook.

**Uncertainty:**
- Keyword retrieval quality vs embedding-based -- mitigated by intent pre-filtering and the 36-case test suite
- Vercel cold start latency with the example index in memory -- mitigated by the index being <5MB; Vercel cold starts are typically <1 second for functions under 50MB
- Claude API latency under load -- mitigated by using Sonnet (fast) rather than Opus, and by the 3-second GHL timeout acting as a natural circuit breaker
- Prompt caching effectiveness with dynamic few-shot examples -- the system prompt (knowledge pack + voice rules) is static and cacheable; only the examples and user message vary per request. Estimated 70-80% cache hit rate on the system prompt portion
- Whether 3-5 keyword-matched examples are enough to capture LBTA's response style -- the knowledge pack provides the overall tone; examples provide specific phrasing patterns. Testing will validate

## Risks & Mitigations

| Risk | Mitigation |
|------|------------|
| Claude API key leaked or rate-limited | Use Vercel encrypted env var. Set usage limits in Anthropic dashboard. Feature flag allows instant rollback to Poppy |
| Example index too large for Vercel function memory | Index is ~3-5MB; Vercel allows 250MB. If needed, reduce to top 5,000 examples by intent diversity |
| Keyword retrieval returns irrelevant examples | Intent pre-filtering narrows to ~1,000 examples per category. Top-5 keyword overlap within a filtered set is reliable. Fallback: use the intent playbook sample messages as static examples |
| Bot hallucinates program details or pricing | "I don't know" instruction in system prompt. Step 6.3 adds explicit fallback to "Let me check on that" + internal notification |
| GHL webhook timeout (3 seconds) exceeded | Sonnet responds in 1-2s for short outputs. If latency spikes, reduce few-shot count from 5 to 3, or switch to Haiku for time-critical responses |
| Breaking change to existing form submission flow | The chatbot webhook is a separate route (`/api/chatbot-webhook`). Form submissions use different routes (`/api/register`, `/api/trial-request`, etc.). No shared code is modified except `package.json` |
| Cost overrun from high message volume | At $0.01/message and ~100 messages/day, monthly cost is ~$30. Set Anthropic dashboard budget alert at $50/month. Prompt caching reduces this further |

<!-- Gate: If keyword retrieval quality is below 70% relevance on the 36-case test suite, pause Phase 5 and implement embedding-based retrieval before integrating with the webhook -->

---

*GHL Knowledge Integration Plan v1.0 | April 1, 2026*
*Architecture: Direct Claude API + Intent-Routed Few-Shot Retrieval*
*Timeline: 5 days (3 days core build, 2 days testing)*
*Estimated cost: ~$30/month at 100 messages/day*
*Data source: 10,688 curated customer-facing examples from GHL conversation history pipeline*
