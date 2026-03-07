# PERS\_\* Files — A/B Test Variant (December 16, 2025)

These files are **not served in production**. The main `layout.tsx`, `globals.css`, data files, and route handlers are the active versions.

## What are PERS\_\* files?

On December 16, 2025, a set of files were preserved as a snapshot during a general-purpose (PERS\_General) A/B test variant exploration. The prefix `PERS_General_2025-12-16_` was applied to distinguish them from the production codebase.

They represent an experimental branch that included embedded ActiveCampaign form integrations, analytics dashboards, webhook testing utilities, and alternative schedule page layouts. None of these variants were promoted to production.

## Production status

- **NOT active** — the main `app/layout.tsx`, `app/globals.css`, `data/winter2026.json`, etc. are the canonical files
- These PERS\_\* files are inert and not imported or referenced anywhere in the production build

## Action required

Archive or remove all PERS\_\* files before final production launch to keep the repository clean.

## File inventory

| File | Location |
|------|----------|
| `PERS_General_2025-12-16_layout.tsx` | `app/` |
| `PERS_General_2025-12-16_globals.css` | `app/` |
| `PERS_General_2025-12-16_embedded-forms.css` | `app/` |
| `PERS_General_2025-12-16_page.tsx` | `app/schedules/` |
| `PERS_General_2025-12-16_route.ts` | `app/api/register-program/` |
| `PERS_General_2025-12-16_route.ts` | `app/api/activecampaign-webhook/` |
| `PERS_General_2025-12-16_AnalyticsDashboard.tsx` | `components/` |
| `PERS_General_2025-12-16_ComprehensiveFormTester.tsx` | `components/` |
| `PERS_General_2025-12-16_EmbeddedRegistrationPanel.tsx` | `components/` |
| `PERS_General_2025-12-16_winter2026.json` | `data/` |
| `PERS_General_2025-12-16_form-config.ts` | `lib/` |
| `PERS_General_2025-12-16_form-analytics.ts` | `lib/` |
| `PERS_General_2025-12-16_webhook-tester.ts` | `lib/` |
| `PERS_General_2025-12-16_activecampaign-form-templates.md` | project root |
| `PERS_General_2025-12-16_LBTA_ActiveCampaign_Forms_Complete.md` | project root |
