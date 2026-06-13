'use client'

import { useState, useRef, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { PROGRAM_FAMILIES, type ProgramFamily } from '@/lib/lesson-plan-types'
import {
  FOCUS_OPTIONS,
  DURATIONS,
  type FocusKey,
  type DurationKey,
} from '@/lib/lesson-plan-composer'

const FETCH_TIMEOUT_MS = 25_000

interface Props {
  coachSlug: string
}

export default function LessonPlanGeneratorForm({ coachSlug }: Props) {
  const router = useRouter()
  const [program, setProgram] = useState<ProgramFamily>('green')
  const [ageBand, setAgeBand] = useState<string>('9–11 yo')
  const [durationMin, setDurationMin] = useState<DurationKey>(60)
  const [focus, setFocus] = useState<FocusKey>('forehand')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Synchronous double-submit guard — useRef updates immediately (vs setSubmitting
  // which is async + batched). Catches very fast double-clicks/Enter-key races
  // before the disabled button kicks in.
  const submitLockRef = useRef(false)
  // Track in-flight fetch so we can abort if the component unmounts mid-request.
  const abortRef = useRef<AbortController | null>(null)

  useEffect(() => {
    // On unmount, abort any in-flight request so we don't router.push from a dead component.
    return () => {
      abortRef.current?.abort()
    }
  }, [])

  // Auto-suggest age band when program changes (coach can override).
  function onProgramChange(p: ProgramFamily) {
    setProgram(p)
    setError(null)
    const meta = PROGRAM_FAMILIES.find((f) => f.id === p)
    setAgeBand(meta?.ageBand ? `${meta.ageBand} yo` : 'Adult')
  }

  // Clear stale error when the user edits ANY field — error refers to the
  // last submission, which is no longer accurate after they change inputs.
  function clearErrorOnEdit<T>(setter: (v: T) => void) {
    return (v: T) => {
      setError(null)
      setter(v)
    }
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (submitLockRef.current) return
    submitLockRef.current = true
    setError(null)
    setSubmitting(true)

    // New AbortController per submission. Aborts on timeout OR unmount.
    abortRef.current?.abort()
    const ac = new AbortController()
    abortRef.current = ac
    const timeoutId = setTimeout(() => ac.abort(), FETCH_TIMEOUT_MS)

    try {
      const res = await fetch(
        `/api/coach-hub/${coachSlug}/lesson-plans/generate`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            program,
            ageBand: ageBand.trim(),
            durationMin,
            focus,
          }),
          signal: ac.signal,
        }
      )
      clearTimeout(timeoutId)
      const data = await res.json().catch(() => ({}))
      if (!res.ok || !data.success || !data.draftId) {
        setError(data.error ?? 'Failed to generate plan.')
        return
      }
      // Don't navigate if request was aborted (component unmounted between
      // fetch resolution and navigation — would yank user back unexpectedly).
      if (ac.signal.aborted) return
      router.push(`/coach-hub/${coachSlug}/lesson-plans/drafts/${data.draftId}`)
      // No router.refresh() — push to a not-yet-visited route already fetches
      // fresh RSC payload; refresh would be a redundant request that races with push.
    } catch (e) {
      clearTimeout(timeoutId)
      if (ac.signal.aborted) return // Aborted — silent (timeout or unmount)
      console.error('lesson-plan generate POST failed:', e)
      setError('Something went wrong. Please try again.')
    } finally {
      clearTimeout(timeoutId)
      submitLockRef.current = false
      setSubmitting(false)
    }
  }

  return (
    <div className="max-w-[640px] mx-auto px-4 sm:px-6 py-6 pb-24">
      <Link
        href={`/coach-hub/${coachSlug}/lesson-plans`}
        className="inline-flex items-center gap-1.5 text-sm font-sans font-medium text-brand-victoria-cove hover:text-brand-pacific-dusk mb-6 focus:outline-none focus:ring-2 focus:ring-brand-victoria-cove focus:ring-offset-2 rounded-sm"
      >
        <span aria-hidden="true">←</span> Back to library
      </Link>

      <header className="pt-2 pb-6 mb-6 border-b border-black/8">
        <p className="font-sans text-eyebrow text-brand-victoria-cove mb-3">
          Generate a plan
        </p>
        <h1 className="font-headline font-light text-brand-deep-water leading-[1.05] tracking-[-0.02em] text-[clamp(28px,6vw,42px)] mb-3">
          Build a plan from the framework.
        </h1>
        <p className="text-sm text-brand-pacific-dusk/75 leading-relaxed max-w-[560px]">
          Pick the program, age, duration, and primary focus. The composer
          assembles a 4-block lesson from the canonical LBTA libraries.
        </p>
      </header>

      <form onSubmit={onSubmit} className="space-y-6">
        <Field label="Program">
          <select
            value={program}
            onChange={(e) => onProgramChange(e.target.value as ProgramFamily)}
            disabled={submitting}
            className="w-full px-4 py-3 border border-black/15 rounded-[2px] font-sans text-brand-pacific-dusk focus:outline-none focus:ring-2 focus:ring-brand-victoria-cove focus:ring-offset-2 min-h-[48px] bg-white"
          >
            {PROGRAM_FAMILIES.map((p) => (
              <option key={p.id} value={p.id}>
                {p.label}
                {p.ageBand ? ` (${p.ageBand} yo)` : ''}
              </option>
            ))}
          </select>
        </Field>

        <Field
          label="Age band"
          hint="Display only — drives the plan label, not the warm-up drills."
        >
          <input
            type="text"
            value={ageBand}
            onChange={(e) => clearErrorOnEdit(setAgeBand)(e.target.value)}
            disabled={submitting}
            maxLength={40}
            className="w-full px-4 py-3 border border-black/15 rounded-[2px] font-sans text-brand-pacific-dusk focus:outline-none focus:ring-2 focus:ring-brand-victoria-cove focus:ring-offset-2 min-h-[48px]"
          />
        </Field>

        {/* Duration uses fieldset/legend (not <label>) because children are <button>s.
            A <label> wrapping multiple buttons fires a click on the first child on label-tap. */}
        <fieldset className="block">
          <legend className="font-sans text-eyebrow-sm text-brand-pacific-dusk mb-2">
            Duration
          </legend>
          <div className="flex gap-2 flex-wrap">
            {DURATIONS.map((d) => (
              <DurationChip
                key={d}
                value={d}
                active={durationMin === d}
                onClick={() => clearErrorOnEdit(setDurationMin)(d)}
                disabled={submitting}
              />
            ))}
          </div>
        </fieldset>

        <Field label="Primary focus">
          <select
            value={focus}
            onChange={(e) => clearErrorOnEdit(setFocus)(e.target.value as FocusKey)}
            disabled={submitting}
            className="w-full px-4 py-3 border border-black/15 rounded-[2px] font-sans text-brand-pacific-dusk focus:outline-none focus:ring-2 focus:ring-brand-victoria-cove focus:ring-offset-2 min-h-[48px] bg-white"
          >
            {FOCUS_OPTIONS.map((f) => (
              <option key={f.id} value={f.id}>
                {f.label}
              </option>
            ))}
          </select>
        </Field>

        {error ? (
          <p className="font-sans text-sm text-lbta-red" role="alert">
            {error}
          </p>
        ) : null}

        <button
          type="submit"
          disabled={submitting}
          className="w-full inline-flex items-center justify-center bg-black text-white font-sans text-sm font-medium tracking-[2.5px] uppercase min-h-[48px] px-10 py-4 rounded-[2px] transition-all duration-300 ease-out hover:bg-gray-800 hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-black/30 focus:ring-offset-2 disabled:opacity-60 disabled:pointer-events-none"
        >
          {submitting ? 'Composing…' : 'Generate plan'}
        </button>

        <p className="font-sans text-xs text-brand-pacific-dusk/55 text-center pt-2 leading-relaxed">
          Generated plans persist and appear under &ldquo;Generated drafts&rdquo;
          on the library landing.
        </p>
      </form>
    </div>
  )
}

function Field({
  label,
  hint,
  children,
}: {
  label: string
  hint?: string
  children: React.ReactNode
}) {
  return (
    <label className="block">
      <span className="block font-sans text-eyebrow-sm text-brand-pacific-dusk mb-2">
        {label}
      </span>
      {children}
      {hint ? (
        <span className="block font-sans text-xs text-brand-pacific-dusk/55 mt-1.5">
          {hint}
        </span>
      ) : null}
    </label>
  )
}

function DurationChip({
  value,
  active,
  onClick,
  disabled,
}: {
  value: number
  active: boolean
  onClick: () => void
  disabled?: boolean
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-pressed={active}
      className={[
        // 48px min for WCAG AAA touch target
        'px-5 py-3 min-h-[48px] rounded-full text-sm font-sans font-medium tabular-nums transition-all',
        'focus:outline-none focus:ring-2 focus:ring-brand-victoria-cove focus:ring-offset-2',
        active
          ? 'bg-brand-deep-water text-white hover:bg-brand-pacific-dusk'
          : 'bg-white border border-black/15 text-brand-pacific-dusk hover:border-brand-victoria-cove/40',
        disabled ? 'opacity-60 pointer-events-none' : '',
      ].join(' ')}
    >
      {value} min
    </button>
  )
}
