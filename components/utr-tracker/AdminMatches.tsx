'use client'

import { useMemo, useState } from 'react'

type DivisionValue = 'sat_utr_singles' | 'sun_singles' | 'sun_doubles'
type WriteMode = 'append' | 'replace_week_division_date'

type ParsedMatch = {
  week: number
  date: string
  division: DivisionValue
  is_doubles: boolean
  player1_name: string
  player1_utr: number
  player1_provisional: boolean
  player2_name: string
  player2_utr: number
  player2_provisional: boolean
  player3_name?: string
  player3_utr?: number
  player3_provisional?: boolean
  player4_name?: string
  player4_utr?: number
  player4_provisional?: boolean
  score: string
  winner_slot: number
}

function parseUtr(raw: string): { value: number; provisional: boolean } | null {
  const trimmed = raw.trim()
  if (!trimmed) return null
  const provisional = trimmed.endsWith('*')
  const numeric = provisional ? trimmed.slice(0, -1) : trimmed
  const value = Number(numeric)
  if (!Number.isFinite(value)) return null
  return { value, provisional }
}

export default function AdminMatches() {
  const today = new Date().toISOString().slice(0, 10)
  const [week, setWeek] = useState(1)
  const [date, setDate] = useState(today)
  const [division, setDivision] = useState<DivisionValue>('sat_utr_singles')
  const [writeMode, setWriteMode] =
    useState<WriteMode>('replace_week_division_date')
  const [rawInput, setRawInput] = useState('')
  const [saving, setSaving] = useState(false)
  const [status, setStatus] = useState<string | null>(null)

  const preview = useMemo(() => {
    const rows = rawInput
      .split('\n')
      .map((line) => line.trim())
      .filter(Boolean)

    const parsed: ParsedMatch[] = []
    const errors: string[] = []

    rows.forEach((line, index) => {
      const parts = line.split(',').map((p) => p.trim())
      const isDoubles = division === 'sun_doubles'

      if (!isDoubles && parts.length !== 6) {
        errors.push(`Line ${index + 1}: expected 6 comma-separated values for singles.`)
        return
      }
      if (isDoubles && parts.length !== 10) {
        errors.push(`Line ${index + 1}: expected 10 comma-separated values for doubles.`)
        return
      }

      const p1Utr = parseUtr(parts[1])
      const p2Utr = parseUtr(parts[3])
      if (!p1Utr || !p2Utr) {
        errors.push(`Line ${index + 1}: invalid UTR value.`)
        return
      }

      if (!isDoubles) {
        const winnerSlot = Number(parts[5])
        if (winnerSlot !== 1 && winnerSlot !== 2) {
          errors.push(`Line ${index + 1}: winner slot must be 1 or 2.`)
          return
        }
        parsed.push({
          week,
          date,
          division,
          is_doubles: false,
          player1_name: parts[0],
          player1_utr: p1Utr.value,
          player1_provisional: p1Utr.provisional,
          player2_name: parts[2],
          player2_utr: p2Utr.value,
          player2_provisional: p2Utr.provisional,
          score: parts[4],
          winner_slot: winnerSlot,
        })
        return
      }

      const p3Utr = parseUtr(parts[5])
      const p4Utr = parseUtr(parts[7])
      if (!p3Utr || !p4Utr) {
        errors.push(`Line ${index + 1}: invalid doubles partner UTR value.`)
        return
      }
      const winnerSlot = Number(parts[9])
      if (![1, 2, 3, 4].includes(winnerSlot)) {
        errors.push(`Line ${index + 1}: winner slot must be 1, 2, 3, or 4.`)
        return
      }

      parsed.push({
        week,
        date,
        division,
        is_doubles: true,
        player1_name: parts[0],
        player1_utr: p1Utr.value,
        player1_provisional: p1Utr.provisional,
        player2_name: parts[2],
        player2_utr: p2Utr.value,
        player2_provisional: p2Utr.provisional,
        player3_name: parts[4],
        player3_utr: p3Utr.value,
        player3_provisional: p3Utr.provisional,
        player4_name: parts[6],
        player4_utr: p4Utr.value,
        player4_provisional: p4Utr.provisional,
        score: parts[8],
        winner_slot: winnerSlot,
      })
    })

    return { parsed, errors, totalRows: rows.length }
  }, [rawInput, week, date, division])

  async function saveAll() {
    if (preview.parsed.length === 0 || preview.errors.length > 0) return

    setSaving(true)
    setStatus(null)
    try {
      const res = await fetch('/api/utr-tracker/matches', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          matches: preview.parsed,
          write_mode: writeMode,
        }),
      })
      const data = (await res.json().catch(() => ({}))) as {
        success?: boolean
        inserted?: number
        writeMode?: WriteMode
        error?: string
      }
      if (!res.ok || !data.success) {
        setStatus(data.error ?? 'Failed to save matches.')
        return
      }
      const modeLabel =
        (data.writeMode ?? writeMode) === 'replace_week_division_date'
          ? 'replace mode'
          : 'append mode'
      setStatus(
        `Saved ${data.inserted ?? preview.parsed.length} matches (${modeLabel}).`
      )
      setRawInput('')
    } catch {
      setStatus('Failed to save matches.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <section className="rounded-2xl border border-brand-pacific-dusk/10 bg-white p-5 shadow-[0_8px_20px_rgba(27,58,92,0.06)]">
      <h2 className="font-headline text-headline-sm text-brand-pacific-dusk mb-4">
        UTR Match Entry
      </h2>

      <div className="grid gap-3 md:grid-cols-3 mb-4">
        <label className="font-sans text-sm text-brand-pacific-dusk">
          Week
          <input
            type="number"
            min={1}
            max={8}
            value={week}
            onChange={(e) => setWeek(Number(e.target.value))}
            className="mt-1 w-full min-h-[48px] rounded border border-black/15 px-3 py-2"
          />
        </label>
        <label className="font-sans text-sm text-brand-pacific-dusk">
          Date
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="mt-1 w-full min-h-[48px] rounded border border-black/15 px-3 py-2"
          />
        </label>
        <label className="font-sans text-sm text-brand-pacific-dusk">
          Division
          <select
            value={division}
            onChange={(e) => setDivision(e.target.value as DivisionValue)}
            className="mt-1 w-full min-h-[48px] rounded border border-black/15 px-3 py-2"
          >
            <option value="sat_utr_singles">Saturday UTR 2.0-5.0</option>
            <option value="sun_singles">Sunday Singles</option>
            <option value="sun_doubles">Sunday Doubles</option>
          </select>
        </label>
      </div>
      <div className="mb-4 rounded border border-brand-pacific-dusk/10 bg-brand-morning-light px-3 py-2">
        <label className="font-sans text-sm text-brand-pacific-dusk">
          Write mode
          <select
            value={writeMode}
            onChange={(e) => setWriteMode(e.target.value as WriteMode)}
            className="mt-1 w-full min-h-[48px] rounded border border-black/15 px-3 py-2 md:max-w-md"
          >
            <option value="replace_week_division_date">
              Replace existing matches for selected week/division/date
            </option>
            <option value="append">Append matches (advanced)</option>
          </select>
        </label>
        <p className="mt-1 font-sans text-xs text-brand-pacific-dusk/70">
          Replace mode prevents duplicate imports by clearing the selected scope
          before insert.
        </p>
      </div>

      <p className="font-sans text-sm text-brand-pacific-dusk/75 mb-2">
        Singles format: <code>Player1, UTR, Player2, UTR, Score, WinnerSlot(1|2)</code>
        <br />
        Doubles format: <code>Player1, UTR, Player2, UTR, Player3, UTR, Player4, UTR, Score, WinnerSlot(1|2|3|4)</code>
        <br />
        Add <code>*</code> after UTR for provisional values (example <code>3.5*</code>).
      </p>

      <textarea
        value={rawInput}
        onChange={(e) => setRawInput(e.target.value)}
        rows={8}
        placeholder="One match per line..."
        className="w-full rounded border border-black/15 px-3 py-2 font-mono text-sm"
      />

      <div className="mt-3">
        <p className="font-sans text-sm text-brand-pacific-dusk/75">
          Parsed: {preview.parsed.length}/{preview.totalRows} lines
        </p>
        {preview.errors.length > 0 && (
          <ul className="mt-2 rounded border border-lbta-red/20 bg-lbta-red/5 p-3 text-sm text-lbta-red">
            {preview.errors.map((err) => (
              <li key={err}>{err}</li>
            ))}
          </ul>
        )}
      </div>

      <div className="mt-4 flex items-center gap-3">
        <button
          type="button"
          onClick={saveAll}
          disabled={saving || preview.parsed.length === 0 || preview.errors.length > 0}
          className="inline-flex min-h-[48px] items-center justify-center rounded-[2px] bg-black px-6 py-3 text-sm font-medium uppercase tracking-[2px] text-white disabled:opacity-60"
        >
          {saving ? 'Saving…' : 'Save All'}
        </button>
        {status ? (
          <p className="font-sans text-sm text-brand-pacific-dusk/75">{status}</p>
        ) : null}
      </div>
    </section>
  )
}
