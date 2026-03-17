# Schedule PDF — Hosting and Publishing

## How it works

**Yes, the PDF is hosted on Vercel.** Anything you put in the `public/` folder is served at the site root. No backend or special config.

- File on disk: `public/schedule-2026.pdf`
- Live URL: `https://lagunabeachtennisacademy.com/schedule-2026.pdf`

When you deploy (e.g. `git push` + Vercel), that file is included in the deployment and becomes a direct download link. This is the same approach used by most schools, clubs, and gyms: a static PDF in the repo or uploaded to the site.

---

## Two ways to get the PDF live

### 1. Automated (recommended)

Generate the PDF from the same data as the website so it always matches:

```bash
npm run build:schedule-pdf
```

This writes `public/schedule-2026.pdf`. Commit that file (or run the script in CI and commit the artifact), then deploy. The "Download PDF" link on the site will work.

### 2. Manual

1. Open [Schedule by location](/schedules/calendar) on the site (or locally after `npm run dev`).
2. Choose the season you want.
3. Use the browser: **Print → Save as PDF**.
4. Save the file as `schedule-2026.pdf`.
5. Put it in the project: `public/schedule-2026.pdf`.
6. Commit and push; Vercel will serve it.

---

## Link on the site

- **Calendar page:** "Download PDF" points to `/schedule-2026.pdf`.
- **Schedules page:** The "Calendar / PDF" nav and the "Calendar view · Print or save as PDF" CTA go to `/schedules/calendar`, where both "Download PDF" (hosted file) and "Print / Save as PDF" (browser print) are available.

If the PDF file is not in `public/` yet, the Download PDF link will 404 until you add it and redeploy.
