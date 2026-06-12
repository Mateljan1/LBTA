# LBTA GPTs — Ownership (RACI)

> R = Responsible (does it). A = Accountable (signs off). C = Consulted. I = Informed.

---

## By function

| Function | Andrew | Allison | Saska |
|---|---|---|---|
| Build / configure GPTs | **R, A** | I | I |
| Daily use of own GPT | C | **R, A** (Adult) | **R, A** (Junior) |
| Knowledge file updates | **R, A** | C | C |
| Friday Compound Review | **R, A** | **R** (Adult) | **R** (Junior) |
| Hallucination incident response | **R, A** | C | C |
| Voice drift incident response | **R, A** | C (Adult) | C (Junior) |
| Front Desk red team / launch gate | **R, A** | I | I |
| Monthly knowledge refresh | **R, A** | C | C |
| Quarterly review | **R, A** | C | C |
| Annual strategy | **R, A** | I | I |
| Drive folder hygiene | **R, A** | C | C |
| Voice samples (anonymized exports) | **A** | **R** (own) | **R** (own) |
| ActiveCampaign campaign sends | **R, A** (Founder pace) | **R, A** (Adult member comms) | I |
| Gmail draft → send | C | **R, A** (own threads) | **R, A** (own threads) |

## By GPT

| GPT | Owner (build) | Owner (daily use) | Sharing |
|---|---|---|---|
| Founder | Andrew | Andrew | Private |
| Adult Coach | Andrew | Allison | Allison + Andrew |
| Junior Coach | Andrew | Saska | Saska + Andrew |
| Front Desk | Andrew | (public) | Anyone-with-link, post Day 28 |

## Escalation paths

- **Voice / drafting issue** → Owner of that GPT → Andrew if needed.
- **Hallucination on facts (price, date, coach)** → Andrew, immediately. See runbook.
- **Privacy concern** (PII showed up where it shouldn't) → Andrew, immediately. **Pause use of the affected GPT until reviewed.**
- **Public abuse** of Front Desk GPT → Andrew. Pull link if severity is high.

## Backup

If Andrew is unavailable for >48 hours:
- Allison handles Adult Coach issues.
- Saska handles Junior Coach issues.
- **Front Desk freezes** — no changes until Andrew returns.
- Hallucination/incident: pause use of affected GPT, log in `runbooks/`, wait for Andrew.
