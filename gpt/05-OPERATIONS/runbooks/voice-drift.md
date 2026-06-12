# Runbook — Voice Drift

> A GPT's drafts started feeling "off." Too generic, too AI, too salesy, too clinical. Or: the GPT is using forbidden words. Or: it sounds nothing like the coach it's drafting for.

---

## Spotting drift early

Voice drift usually shows up in one of three patterns:

1. **Generic drift.** Drafts sound like any tennis coach anywhere. Loses LBTA's specific phrases and rhythm.
2. **Salesy drift.** Forbidden words leak in (`elite`, `world-class`, `unlock`, `level up`). Exclamation points appear.
3. **Persona drift.** Junior Coach starts sounding like the Founder. Or Front Desk starts speaking in first-person as Andrew.

If a coach says "this doesn't sound like me anymore," trust it. They're right.

## Diagnose (10 min)

### Step 1: read 5 recent drafts side-by-side

Pull 5 drafts from the past week. Read aloud. Note the specific patterns:
- Are full sentences flowing, or stiff?
- Are the verbs strong, or "to be" verbs ("is," "are," "was")?
- Are forbidden words present? (Search for the list — see Adult Coach system prompt.)
- Did the GPT name a specific kid / member when it shouldn't have? Or fail to when it should have?
- Does the sign-off use the right name and the canonical contact line?

### Step 2: compare to the voice samples

Open `03-KNOWLEDGE-BRAIN/voice-samples/` (or the samples in Drive). Read 3 anonymized originals. The 5 drafts should sit next to those without standing out.

### Step 3: check the system prompt

Open the GPT's `system-prompt.md`. Did anything change recently? Was a section trimmed for character count and accidentally removed a key voice cue?

## Fix (15–20 min)

### Pattern: Generic drift

**Cause:** Voice samples haven't been refreshed. The GPT is regressing to its base ChatGPT voice.

**Fix:** Pull 3–5 fresh anonymized drafts from the coach's recent week. Add to `voice-samples/`. Re-upload to the GPT's knowledge. Tighten the system prompt's "voice anchors" section with 2–3 short example sentences.

### Pattern: Salesy drift

**Cause:** Forbidden-words list isn't doing its job. Or a recent prompt change weakened it.

**Fix:** Open the system prompt. Re-add the forbidden-words section (copy from another GPT's prompt if needed). Add an explicit instruction: *"If you find yourself reaching for emphasis, choose specificity instead. Replace adjectives with the specific behavior or outcome."*

### Pattern: Persona drift

**Cause:** The GPT's identity isn't anchored hard enough at the top of the prompt.

**Fix:** Strengthen the system prompt's `## Role and identity` section. Add: *"You are NOT [other role]. You speak ONLY in [target voice]. If a question would be better answered by another GPT, say so and stop."*

## Verification (5 min)

Run the voice-test prompt:

> "Draft a 3-sentence reply to a member asking about [a routine schedule question]."

Read it. Then ask the GPT:

> "What forbidden words did you avoid? What specific LBTA voice cues did you include?"

The GPT should explain its choices in a way that maps to the system prompt. If it can't, the prompt is too vague.

## Track the drift

Log in `eval/dogfood-log-template.md` under "Voice issues this week." If the same pattern shows up 3 weeks running, escalate to a full prompt rewrite at the next monthly knowledge refresh.

## Long-term: the voice library

Every 90 days, refresh `03-KNOWLEDGE-BRAIN/voice-samples/` with the past quarter's best drafts (anonymized). The GPT's voice is only as good as the samples — and the samples are only as good as how recent they are.
