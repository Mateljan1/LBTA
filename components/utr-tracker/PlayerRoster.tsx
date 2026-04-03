'use client'

import { useState } from 'react'
import type { Player } from '@/lib/utr-tracker-types'

type EditablePlayer = {
  id?: string
  name: string
  utr: string
  divisions: {
    sat_color_ball: boolean
    sat_utr_singles: boolean
    sun_singles: boolean
    sun_doubles: boolean
  }
  color_ball_stage: '' | 'red' | 'orange' | 'green'
  is_color_ball: boolean
  provisional_utr: boolean
  joined_week: number
}

function toEditable(player: Player): EditablePlayer {
  const divisionSet = new Set(player.divisions)
  return {
    id: player.id,
    name: player.name,
    utr: player.utr == null ? '' : String(player.utr),
    divisions: {
      sat_color_ball: divisionSet.has('sat_color_ball'),
      sat_utr_singles: divisionSet.has('sat_utr_singles'),
      sun_singles: divisionSet.has('sun_singles'),
      sun_doubles: divisionSet.has('sun_doubles'),
    },
    color_ball_stage: player.color_ball_stage ?? '',
    is_color_ball: player.is_color_ball,
    provisional_utr: player.provisional_utr,
    joined_week: player.joined_week,
  }
}

function emptyEditable(): EditablePlayer {
  return {
    name: '',
    utr: '',
    divisions: {
      sat_color_ball: false,
      sat_utr_singles: false,
      sun_singles: false,
      sun_doubles: false,
    },
    color_ball_stage: '',
    is_color_ball: false,
    provisional_utr: false,
    joined_week: 1,
  }
}

export default function PlayerRoster({ initialPlayers }: { initialPlayers: Player[] }) {
  const [rows, setRows] = useState<EditablePlayer[]>(
    initialPlayers.map(toEditable)
  )
  const [saving, setSaving] = useState(false)
  const [status, setStatus] = useState<string | null>(null)

  function addRow() {
    setRows((prev) => [emptyEditable(), ...prev])
  }

  function updateRow(index: number, patch: Partial<EditablePlayer>) {
    setRows((prev) =>
      prev.map((row, i) => (i === index ? { ...row, ...patch } : row))
    )
  }

  async function saveRoster() {
    setSaving(true)
    setStatus(null)

    const payload = {
      players: rows
        .filter((row) => row.name.trim().length > 0)
        .map((row) => ({
          id: row.id,
          name: row.name.trim(),
          utr: row.utr.trim() === '' ? null : Number(row.utr),
          divisions: ([
            row.divisions.sat_color_ball ? 'sat_color_ball' : null,
            row.divisions.sat_utr_singles ? 'sat_utr_singles' : null,
            row.divisions.sun_singles ? 'sun_singles' : null,
            row.divisions.sun_doubles ? 'sun_doubles' : null,
          ].filter(Boolean) as Array<
            'sat_color_ball' | 'sat_utr_singles' | 'sun_singles' | 'sun_doubles'
          >),
          color_ball_stage: row.color_ball_stage || null,
          is_color_ball: row.is_color_ball,
          provisional_utr: row.provisional_utr,
          social_opt_in: false,
          season_registration: true,
          is_drop_in: false,
          joined_week: row.joined_week,
        })),
    }

    try {
      const res = await fetch('/api/utr-tracker/players', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      const data = (await res.json().catch(() => ({}))) as {
        success?: boolean
        saved?: number
        error?: string
      }
      if (!res.ok || !data.success) {
        setStatus(data.error ?? 'Failed to save roster.')
        return
      }
      setStatus(`Saved ${data.saved ?? payload.players.length} players.`)
    } catch {
      setStatus('Failed to save roster.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <section className="rounded-2xl border border-brand-pacific-dusk/10 bg-white p-5 shadow-[0_8px_20px_rgba(27,58,92,0.06)]">
      <div className="mb-4 flex items-center justify-between gap-3">
        <h2 className="font-headline text-headline-sm text-brand-pacific-dusk">
          Player Roster
        </h2>
        <button
          type="button"
          onClick={addRow}
          className="inline-flex min-h-[40px] items-center justify-center rounded border border-black/20 px-3 py-1 text-xs font-medium uppercase tracking-[1.8px] text-brand-pacific-dusk"
        >
          Add Player
        </button>
      </div>

      <div className="space-y-3 max-h-[420px] overflow-auto pr-1">
        {rows.map((row, index) => (
          <div
            key={row.id ?? `new-${index}`}
            className="rounded border border-black/10 p-3"
          >
            <div className="grid gap-2 md:grid-cols-4">
              <label className="font-sans text-sm text-brand-pacific-dusk">
                Name
                <input
                  value={row.name}
                  onChange={(e) => updateRow(index, { name: e.target.value })}
                  className="mt-1 w-full rounded border border-black/15 px-2 py-1"
                />
              </label>
              <label className="font-sans text-sm text-brand-pacific-dusk">
                UTR
                <input
                  value={row.utr}
                  onChange={(e) => updateRow(index, { utr: e.target.value })}
                  className="mt-1 w-full rounded border border-black/15 px-2 py-1"
                />
              </label>
              <label className="font-sans text-sm text-brand-pacific-dusk">
                Joined week
                <input
                  type="number"
                  min={1}
                  max={8}
                  value={row.joined_week}
                  onChange={(e) =>
                    updateRow(index, { joined_week: Number(e.target.value) || 1 })
                  }
                  className="mt-1 w-full rounded border border-black/15 px-2 py-1"
                />
              </label>
              <label className="font-sans text-sm text-brand-pacific-dusk">
                Color Ball stage
                <select
                  value={row.color_ball_stage}
                  onChange={(e) =>
                    updateRow(index, {
                      color_ball_stage: e.target.value as EditablePlayer['color_ball_stage'],
                    })
                  }
                  className="mt-1 w-full rounded border border-black/15 px-2 py-1"
                >
                  <option value="">None</option>
                  <option value="red">Red</option>
                  <option value="orange">Orange</option>
                  <option value="green">Green</option>
                </select>
              </label>
            </div>

            <div className="mt-2 grid gap-2 md:grid-cols-4">
              <label className="inline-flex items-center gap-2 font-sans text-sm text-brand-pacific-dusk">
                <input
                  type="checkbox"
                  checked={row.divisions.sat_color_ball}
                  onChange={(e) =>
                    updateRow(index, {
                      divisions: {
                        ...row.divisions,
                        sat_color_ball: e.target.checked,
                      },
                    })
                  }
                />
                Sat Color Ball
              </label>
              <label className="inline-flex items-center gap-2 font-sans text-sm text-brand-pacific-dusk">
                <input
                  type="checkbox"
                  checked={row.divisions.sat_utr_singles}
                  onChange={(e) =>
                    updateRow(index, {
                      divisions: {
                        ...row.divisions,
                        sat_utr_singles: e.target.checked,
                      },
                    })
                  }
                />
                Sat UTR
              </label>
              <label className="inline-flex items-center gap-2 font-sans text-sm text-brand-pacific-dusk">
                <input
                  type="checkbox"
                  checked={row.divisions.sun_singles}
                  onChange={(e) =>
                    updateRow(index, {
                      divisions: {
                        ...row.divisions,
                        sun_singles: e.target.checked,
                      },
                    })
                  }
                />
                Sun Singles
              </label>
              <label className="inline-flex items-center gap-2 font-sans text-sm text-brand-pacific-dusk">
                <input
                  type="checkbox"
                  checked={row.divisions.sun_doubles}
                  onChange={(e) =>
                    updateRow(index, {
                      divisions: {
                        ...row.divisions,
                        sun_doubles: e.target.checked,
                      },
                    })
                  }
                />
                Sun Doubles
              </label>
            </div>

            <div className="mt-2 flex gap-4">
              <label className="inline-flex items-center gap-2 font-sans text-sm text-brand-pacific-dusk">
                <input
                  type="checkbox"
                  checked={row.is_color_ball}
                  onChange={(e) =>
                    updateRow(index, { is_color_ball: e.target.checked })
                  }
                />
                Is Color Ball player
              </label>
              <label className="inline-flex items-center gap-2 font-sans text-sm text-brand-pacific-dusk">
                <input
                  type="checkbox"
                  checked={row.provisional_utr}
                  onChange={(e) =>
                    updateRow(index, { provisional_utr: e.target.checked })
                  }
                />
                Provisional UTR
              </label>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-4 flex items-center gap-3">
        <button
          type="button"
          onClick={saveRoster}
          disabled={saving}
          className="inline-flex min-h-[48px] items-center justify-center rounded-[2px] bg-black px-6 py-3 text-sm font-medium uppercase tracking-[2px] text-white disabled:opacity-60"
        >
          {saving ? 'Saving…' : 'Save Roster'}
        </button>
        {status ? (
          <p className="font-sans text-sm text-brand-pacific-dusk/75">{status}</p>
        ) : null}
      </div>
    </section>
  )
}
