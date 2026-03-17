'use client'

import { useEffect, useRef } from 'react'

type GuideOverlayProps = {
  onClose: () => void
}

export function GuideOverlay({ onClose }: GuideOverlayProps) {
  const dialogRef = useRef<HTMLDivElement>(null)

  const FOCUSABLE = 'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'

  useEffect(() => {
    const el = dialogRef.current
    if (!el) return
    const first = el.querySelector<HTMLElement>(FOCUSABLE)
    first?.focus()
  }, [])

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'Escape') {
      onClose()
      return
    }
    const el = dialogRef.current
    if (e.key !== 'Tab' || !el) return
    const focusables = Array.from(el.querySelectorAll<HTMLElement>(FOCUSABLE)).filter((node) => !node.hasAttribute('disabled'))
    if (focusables.length === 0) return
    const current = document.activeElement
    const idx = current instanceof HTMLElement ? focusables.indexOf(current) : -1
    if (idx === -1) return
    if (e.shiftKey) {
      if (idx === 0) {
        e.preventDefault()
        focusables[focusables.length - 1]?.focus()
      }
    } else {
      if (idx === focusables.length - 1) {
        e.preventDefault()
        focusables[0]?.focus()
      }
    }
  }

  return (
    <div
      className="fixed inset-0 z-[100] bg-black/50 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-label="Guide"
      onKeyDown={handleKeyDown}
    >
      <div ref={dialogRef} className="bg-brand-morning-light rounded-lg shadow-xl max-w-3xl w-full max-h-[90vh] overflow-auto p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="font-headline text-brand-pacific-dusk text-xl">LBTA Coach Hub — Your Playbook</h2>
          <button
            type="button"
            onClick={onClose}
            className="min-h-[48px] px-4 rounded border border-black/20 font-sans text-sm font-medium focus:outline-none focus:ring-2 focus:ring-brand-victoria-cove focus:ring-offset-2"
            aria-label="Close Guide"
          >
            Close
          </button>
        </div>
        <p className="font-sans text-sm text-brand-pacific-dusk/70 mb-6">
          Everything you need to deliver a great session — curriculum, drills, camp operations, LBHS team plans, and more. Open it, run it, log it.
        </p>
        <section className="mb-6">
          <h3 className="font-sans text-sm font-semibold text-brand-pacific-dusk mb-2">Quick Start</h3>
          <ol className="list-decimal list-inside space-y-1 font-sans text-sm text-brand-pacific-dusk/80">
            <li>Select your name from the coach dropdown.</li>
            <li>Check the season and week (auto-detected).</li>
            <li>Click your program in the Programs tab.</li>
            <li>Select the day (Mon/Wed/Sat). Session plan loads with 6 drill blocks.</li>
            <li>Expand any drill block for setup, steps, cues, scaling.</li>
            <li>After class, use Post-Session Capture and copy home practice.</li>
          </ol>
        </section>
        <section className="mb-6">
          <h3 className="font-sans text-sm font-semibold text-brand-pacific-dusk mb-2">Week Binder</h3>
          <p className="font-sans text-sm text-brand-pacific-dusk/80">
            The Week Binder button generates every session for the selected coach for the week. Print it and bring it to the courts.
          </p>
        </section>
        <section className="mb-6">
          <h3 className="font-sans text-sm font-semibold text-brand-pacific-dusk mb-2">Assessment badges</h3>
          <p className="font-sans text-sm text-brand-pacific-dusk/80">
            Week 1: Baseline Intake. Weeks 2–9: Continuous KPI. Weeks 10–11: Pressure / Match Play. Week 12: Testing + Report.
          </p>
        </section>
        <section className="mb-6 p-4 rounded-lg border-2 border-brand-thousand-steps bg-brand-sandstone/30">
          <h3 className="font-sans text-sm font-semibold text-brand-pacific-dusk mb-2">Rules that never bend</h3>
          <ul className="font-sans text-sm text-brand-pacific-dusk/80 space-y-1">
            <li>· No advancement without 3 recorded KPIs. Data decides.</li>
            <li>· Fun-first mandate. Engagement over perfection.</li>
            <li>· Every kid active every minute. Station rotation at 5+ players.</li>
            <li>· Advancement flags and equipment issues → Robert.</li>
          </ul>
        </section>
      </div>
    </div>
  )
}
