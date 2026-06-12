# Google Drive Setup — Founder, Adult Coach, Junior Coach, Marketing GPTs

> Drive is connected **read-only** and **scoped to specific folders per GPT**. The GPT is not allowed to see private documents, finances, or personal HR files.
>
> **Marketing GPT note:** Drive read access is **Phase 2 only** — unlocked after the dogfood week passes (see `gpt/02-GPT-BUILDS/05-Marketing-GPT/capabilities.md`). In Phase 1, the Marketing GPT relies on knowledge files uploaded directly to the GPT.

---

## Folder structures (in Andrew's Google Drive)

### For coach GPTs (Founder, Adult Coach, Junior Coach)

```
LBTA / Public-Safe Assets/        ← THE folder coach GPTs see
├── 01-Voice-Samples/
│   ├── andrew-emails-anonymized/      ← 8-12 of Andrew's past parent/member emails (PII removed)
│   ├── allison-emails-anonymized/     ← 6-10 of Allison's past parent/member emails
│   └── saska-emails-anonymized/       ← 6-10 of Saska's past parent/member emails
├── 02-Marketing-Assets/
│   ├── homepage-copy-current.md
│   ├── about-page-copy-current.md
│   └── program-descriptions-current.md
├── 03-Brand-Reference/
│   ├── logos/
│   ├── color-tokens.md
│   └── typography.md
├── 04-Public-Press/
│   └── (any press / public mentions)
└── 05-Operating-Calendar/
    └── public-calendar.csv          ← public-facing schedule, not internal staffing
```

### For Marketing GPT (Phase 2 only — separate, marketing-specific folder)

```
LBTA / Marketing-Library/        ← THE folder Marketing GPT sees (Phase 2)
├── 01-Brand-Assets/
│   ├── logos/                       ← LBTA wordmark, monogram, color variants
│   ├── color-tokens.txt
│   ├── fonts/                       ← Cormorant, DM Sans (license-clear)
│   └── templates/                   ← IG carousel base, newsletter base, blog base
├── 02-Photography/
│   ├── courts/                      ← LBHS, Moulton Meadows, Alta Laguna
│   ├── coaches/                     ← Andrew, Peter, Allison only (consent on file)
│   ├── editorial/                   ← wide shots, empty courts (no PII risk)
│   └── (consent-cleared player folders — see 13-marketing-asset-library.md)
├── 03-ActiveCampaign/
│   ├── past-newsletters/            ← HTML/text exports for voice reference
│   ├── templates/                   ← block-editor compatible newsletter shells
│   └── segment-notes.md
├── 04-Voice-Samples/                ← marketing-specific copy (IG, newsletter, blog, partner outreach)
│   ├── andrew-instagram-captions/   ← last 30 days
│   ├── andrew-newsletters/          ← last 12 sends
│   └── andrew-blog-posts/           ← last 6 posts
└── 05-Reference/
    ├── consent-log.md               ← who has consented to what surface
    ├── partner-list.md              ← current and prospective partners
    └── seasonal-calendar.md
```

**The Marketing GPT folder is separate from the coach GPT folder.** Each GPT only sees its own scope. This is by design — coaches don't need newsletter templates; the Marketing GPT doesn't need anonymized parent emails.

**Top-level Drive (NOT in the folder above) — never connected to GPTs:**
- Tax documents
- Member rosters with PII
- Stripe payouts / financials
- Coach contracts
- Family / insurance / legal
- HR files
- Andrew's personal docs

## Connecting Drive to a coach GPT

1. ChatGPT → **Configure** the GPT.
2. Capabilities → **Connect Apps** → **Google Drive**.
3. Authorize Andrew's Google account.
4. ChatGPT will ask which folders to expose. **Select only `LBTA / Public-Safe Assets/`.**
5. **Do NOT grant access to "all of Drive."** ChatGPT remembers this scoping per GPT.

## Connecting Drive to the Marketing GPT (Phase 2 only)

**Phase 1 (Day 0–14):** Drive read is OFF. The Marketing GPT relies on knowledge files uploaded directly (see `gpt/03-KNOWLEDGE-BRAIN/voice-samples/marketing-voice.md`).

**Phase 2 (Day 14+, after dogfood week passes):**

1. ChatGPT → **Configure** the Marketing GPT.
2. Capabilities → **Connect Apps** → **Google Drive**.
3. Authorize Andrew's Google account.
4. ChatGPT will ask which folders to expose. **Select only `LBTA / Marketing-Library/`.**
5. **Do NOT grant access to** `LBTA / Public-Safe Assets/` (different scope, different GPT) **or "all of Drive."**
6. Verify by asking: *"List the files you can see in Drive."* — should show only `LBTA / Marketing-Library/` contents.

**Why Phase 2 not Phase 1:** Drive read access expands the GPT's surface area. The dogfood week (Day 0–7) tests the GPT against tightly-scoped knowledge files first to catch voice and grounding issues before adding live data.

## What to put in this folder (and not)

✅ **Yes:**
- Anonymized voice samples (replace child names with `[Player A]`, replace parent names with `[Parent]`).
- Current website copy (already public).
- Brand reference (already public).
- Public press / awards.

❌ **No:**
- Any document with member or family last names.
- Any document with Stripe / payment data.
- Any document with phone numbers or emails of members.
- Internal staffing schedules with coach hourly rates.
- Coach 1:1 notes.

## Anonymization protocol (for voice samples)

When pulling 8–12 past emails into `01-Voice-Samples/`:

1. Replace all first + last names with `[Player A]`, `[Parent A]`, `[Coach A]`.
2. Replace all phone numbers with `(XXX) XXX-XXXX`.
3. Replace all email addresses with `[email]`.
4. Replace specific dates (birthdays, anniversaries) with `[date]`.
5. Keep voice, tone, sentence rhythm intact.
6. Run a final grep for digits and `@` to confirm no leakage.

## Verification

After connecting Drive to the Founder GPT, ask: **"List the files you can see in my Drive."**

✅ Acceptable: GPT lists only files in `LBTA / Public-Safe Assets/`.
❌ Unacceptable: GPT lists tax docs, member rosters, anything from outside the scoped folder.

If unacceptable: re-scope (Configure → Connected Apps → Google Drive → Manage permissions).

## Re-grant cadence

Google requires periodic re-authorization. When the GPT says "I can't access Drive," re-authorize through Configure. **Always confirm scope is still locked to `LBTA / Public-Safe Assets/`** after re-auth — Google sometimes resets to "all of Drive."
