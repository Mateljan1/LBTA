# 13 — Marketing Asset Library (what the GPT can reference, what it can't)

> The Marketing GPT drafts copy. **The visual asset library lives in Andrew's Google Drive** at `LBTA / Marketing-Library /`. This file tells the GPT what's available, what's consent-cleared, and how to brief image generation when it's drafting moodboards or carousel comps.
>
> **Hard rule:** the GPT never invents player names, fakes testimonials, or generates images of real people. It briefs Andrew on what visual to source/shoot, or generates a clearly-labeled `DRAFT` moodboard/comp.

---

## What's in the marketing library (Drive layout)

```
LBTA / Marketing-Library /
├── 01-Brand-Assets/
│   ├── logos/                       (LBTA wordmark, monogram, color variants)
│   ├── color-tokens.txt             (hex codes — see Brand Kit)
│   ├── fonts/                       (Cormorant, DM Sans — license-clear)
│   └── templates/                   (IG carousel base, newsletter base, blog base)
├── 02-Photography/
│   ├── courts/                      (LBHS, Moulton Meadows, Alta Laguna)
│   ├── coaches/                     (Andrew, Peter, Allison — on-court)
│   ├── juniors/                     (consent-cleared only — see consent-log.md)
│   ├── adults/                      (consent-cleared only — see consent-log.md)
│   ├── camps/                       (group shots, consent-cleared)
│   └── editorial/                   (wide shots, empty courts, equipment)
├── 03-ActiveCampaign/
│   ├── past-newsletters/            (HTML/text exports for voice reference)
│   ├── templates/                   (block-editor compatible newsletter shells)
│   └── segment-notes.md             (which audience receives what)
├── 04-Voice-Samples/
│   ├── andrew-instagram-captions/   (last 30 days, copy-pasted)
│   ├── andrew-newsletters/          (last 12 sends)
│   └── andrew-blog-posts/           (last 6 posts, plain text)
└── 05-Reference/
    ├── consent-log.md               (who has consented to what — see below)
    ├── partner-list.md              (current and prospective partners)
    └── seasonal-calendar.md         (when each surface gets pushed)
```

> **Phase 1 status:** Andrew has Drive read access; the GPT does not (Phase 2 unlock). Until Phase 2, the GPT briefs Andrew on what to pull from Drive. Once Phase 2 ships, the GPT reads from `LBTA / Marketing-Library /` only — never from `LBTA / Private` or any folder with player PII.

---

## Photography rules (the most-broken rule on AI marketing tools)

### Hard rules

1. **Every photo of a real player needs explicit, written consent** — logged in `consent-log.md` (see below).
2. **No AI-generated images of "players that don't exist."** Even labeled "draft" or "concept." If a parent sees an LBTA-branded image of a kid who isn't real, it breaks trust. The GPT will not generate this. Period.
3. **No stock photos of tennis.** If the asset library doesn't have a usable photo, Andrew shoots one or the surface waits.
4. **No re-using a junior's face after they leave the program** unless renewed consent is on file.
5. **No coach photos other than Andrew, Peter, and Allison.** (Robert is no longer with LBTA — never reference him in marketing.)
6. **No photos of Moulton Meadows that show non-LBTA players in the background** (it's a public park; we don't market off other people's faces).

### What the GPT does when a surface needs a visual

- **For a real photo:** brief Andrew on the shot needed. *"Visual brief: Tuesday-morning warmup line, ages 8–12, Moulton Meadows. Consent on file for: [parent to confirm]. If no usable photo in Drive, schedule a 5-min shoot before next Tuesday."*
- **For a moodboard (Phase 1+):** generate a labeled `DRAFT — moodboard, not for publishing` showing tone, palette, composition. Never realistic faces.
- **For an IG carousel slide comp (Phase 1+):** generate a `DRAFT — comp for layout reference, not for publishing` with placeholder text and abstract visuals. Designed for Andrew to recreate in Canva — not to ship.

---

## Consent log (the single source of truth for "can we use their face?")

The actual log lives in `LBTA / Marketing-Library / 05-Reference / consent-log.md` (Phase 2 — GPT reads it; Phase 1 — Andrew references it manually).

### Schema

```
| Player name | Parent name | Date signed | Surfaces approved | Renewal date | Notes |
|-------------|-------------|-------------|-------------------|--------------|-------|
| [redacted]  | [redacted]  | 2026-03-15  | IG, Newsletter    | 2027-03-15   | No blog without re-ask |
```

### Surface scope (parents pick when signing)

- **Internal use only** (training material, testimonials shown to other LBTA families)
- **Instagram** (story, post, carousel)
- **Newsletter** (subscriber-only)
- **Blog / website**
- **Paid ads** (Meta, Google) — separate, opt-in, more conservative

### Consent expires after 12 months

The GPT prompts Andrew with: *"Visual brief: needs a junior on-court image. Last consent on file for [Player Name] expires [Date] — renew or use a different player."*

---

## Brand assets (always available to the GPT)

These don't require consent, are LBTA-owned, and the GPT can reference freely:

| Asset | Location | When to use |
|---|---|---|
| **LBTA wordmark** | `01-Brand-Assets/logos/` | Newsletter footer, blog header, partner email signature |
| **LBTA monogram** | `01-Brand-Assets/logos/` | IG profile, favicon, ad watermark |
| **Color tokens** | `01-Brand-Assets/color-tokens.txt` | Any visual brief — match Brand Kit |
| **Cormorant + DM Sans** | `01-Brand-Assets/fonts/` | Any layout brief |
| **Empty court shots** | `02-Photography/editorial/` | When privacy-safe imagery is needed (newsletter headers, blog feature images, ad backgrounds) |
| **Coach photos (3)** | `02-Photography/coaches/` | Coach feature posts, blog author bio, partner outreach attachments |

---

## Image generation policy (the kill-switch surface)

The Marketing GPT has Image Generation enabled in Phase 1, but **only for two purposes**:

### Allowed

- **Moodboards.** Tone, palette, composition references. Always labeled `DRAFT — moodboard, not for publishing`. Never realistic faces.
- **IG carousel slide comps.** Layout references for Andrew to recreate in Canva. Always labeled `DRAFT — comp for layout reference, not for publishing`. Placeholder text, abstract visuals only.

### Forbidden

- **Realistic faces of "players."** Even children. Even labeled. Trust violation.
- **Action shots that could be mistaken for real moments.** A drawn watercolor of a player swinging is OK. A photorealistic AI image of a player swinging is not.
- **Testimonial visuals** (a "happy parent" image with a quote). Real testimonials only, with consent.
- **Fake event photography** ("here's what camp looked like" — when no photographer was there).
- **Logos that could be confused with LBTA's actual mark.** Use the real mark from the asset library.

### When the GPT generates a draft visual

It must include this disclaimer in the response:

> ⚠️ **DRAFT — not for publishing.** This is a moodboard/comp for internal reference only. Real visual must be sourced from the LBTA asset library or shot before publishing. Never share this image outside Andrew + the marketing operator.

---

## Asset request workflow (when the library is missing what we need)

If a surface needs an asset that doesn't exist:

1. **GPT writes a visual brief.** What's needed, where it'd go, who'd be in it (consent-required), when it'd ship.
2. **Andrew triages.** Schedule shoot, ask parent for consent, or change the surface to one we already have assets for.
3. **GPT logs the request.** *"Asset request: Tuesday-morning warmup wide shot, ages 8–12, Moulton Meadows. Pending consent for [parent]."* Append to `LBTA / Marketing-Library / 05-Reference / asset-requests.md`.

---

## Voice samples (Phase 1: GPT references via knowledge file)

The GPT does not have Drive read access in Phase 1. But it does have `voice-samples/marketing-voice.md` uploaded as a knowledge file — populated by Andrew before activation. See `voice-samples/marketing-voice.md` for the template.

When Phase 2 unlocks Drive read, the GPT will reference fresh samples from `04-Voice-Samples/` weekly.

---

## When this file gets updated

- **After every shoot:** new photos added → consent log updated → this file's photography list refreshed.
- **After every season:** new templates → new partner list → seasonal calendar refreshed.
- **After every consent expiry:** flagged 30 days out by Andrew's calendar; this file's "active consent count" updated.
- **Quarterly minimum:** full audit of what's actually being used vs. what's in the library. Archive what hasn't been touched in 6 months.

---

## How the GPT uses this file

1. **Before drafting any visual brief:** consult this file for what's available, what's consent-cleared, what's allowed.
2. **Before generating any image:** check the "forbidden" list. If the requested image falls under forbidden, write a brief instead and explain why.
3. **On every draft that references a player:** verify the player name appears in the consent log scope (Phase 2). In Phase 1: flag *"[NEEDS ANDREW VERIFY: consent on file for this player on this surface]"*.
4. **On every visual draft:** apply the `DRAFT — not for publishing` label automatically.

---

## Phase 1 vs Phase 2 capability

| Capability | Phase 1 (Day 1) | Phase 2 (Day 14–60, post-dogfood) |
|---|---|---|
| Reference this file's structure | ✅ | ✅ |
| Read consent log | ❌ (Andrew checks manually) | ✅ (read-only from Drive) |
| Reference fresh voice samples | ❌ (uses uploaded knowledge file) | ✅ (read from `04-Voice-Samples/`) |
| Generate moodboards | ✅ (with `DRAFT` label) | ✅ |
| Generate carousel slide comps | ✅ (with `DRAFT` label) | ✅ |
| Generate realistic faces | ❌ (always) | ❌ (always) |
| Output visuals to Drive | ❌ | ❌ (Phase 1+ — manual save by Andrew) |

Phase 2 unlock requires the dogfood week to pass with zero AI-image-near-publishes. (See `05-OPERATIONS/runbooks/marketing-incident.md`.)
