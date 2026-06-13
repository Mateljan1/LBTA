'use client'

interface Props {
  /** Public path under /public, e.g. /coach-hub-content/allison-2026-05-11.html */
  htmlPath: string
  /** Coach name for the iframe title attribute (a11y) */
  coachName: string
}

/**
 * Sandboxed iframe wrapper for the existing on-brand interactive HTMLs.
 * The HTMLs are full <html> documents with their own fonts + JS (drill check-offs, timer);
 * an iframe isolates them cleanly without conflicting with the parent doc's CSP / fonts.
 *
 * sandbox flags:
 *   - allow-scripts: needed for drill check-offs and timer JS
 *   - allow-same-origin: needed so the embedded JS can read its own DOM (otherwise localStorage / DOM access is blocked)
 *   - (intentionally NOT allow-top-navigation, allow-forms, allow-popups — keeps blast radius minimal)
 */
export default function CoachHtmlContent({ htmlPath, coachName }: Props) {
  return (
    <iframe
      title={`${coachName} — today's coaching plan`}
      src={htmlPath}
      sandbox="allow-scripts allow-same-origin"
      className="w-full block border-0"
      style={{ minHeight: 'calc(100vh - 73px)' }}
    />
  )
}
