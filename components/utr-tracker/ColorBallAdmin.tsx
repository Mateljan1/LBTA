'use client'

import { useMemo, useState } from 'react'
import type {
  ColorBallAttendance,
  ColorBallBadge,
  Player,
} from '@/lib/utr-tracker-types'

type ColorBallRow = {
  playerId: string
  name: string
  attended: boolean
  completed_match: boolean
  matches_played: number
  coachBadgesCsv: string
}

interface Props {
  players: Player[]
  attendance: ColorBallAttendance[]
  badges: ColorBallBadge[]
}

function buildRows(
  week: number,
  players: Player[],
  attendance: ColorBallAttendance[],
  badges: ColorBallBadge[]
): ColorBallRow[] {
  const weekAttendance = new Map(
    attendance
      .filter((a) => a.week === week)
      .map((a) => [a.player_id, a] as const)
  )
  const weekBadges = new Map<string, string[]>()
  for (const badge of badges.filter((b) => b.awarded_week === week && b.awarded_by === 'coach')) {
    const current = weekBadges.get(badge.player_id) ?? []
    current.push(badge.badge_id)
    weekBadges.set(badge.player_id, current)
  }

  return players
    .filter((p) => p.is_color_ball)
    .map((player) => {
      const attendanceRow = weekAttendance.get(player.id)
      return {
        playerId: player.id,
        name: player.name,
        attended: attendanceRow?.attended ?? false,
        completed_match: attendanceRow?.completed_match ?? false,
        matches_played: attendanceRow?.matches_played ?? 0,
        coachBadgesCsv: (weekBadges.get(player.id) ?? []).join(', '),
      }
    })
}

export default function ColorBallAdmin({ players, attendance, badges }: Props) {
  const [week, setWeek] = useState(1)
  const [rows, setRows] = useState<ColorBallRow[]>(
    buildRows(1, players, attendance, badges)
  )
  const [saving, setSaving] = useState(false)
  const [status, setStatus] = useState<string | null>(null)

  const rowCount = useMemo(() => rows.length, [rows])

  function changeWeek(nextWeek: number) {
    setWeek(nextWeek)
    setRows(buildRows(nextWeek, players, attendance, badges))
    setStatus(null)
  }

  function updateRow(playerId: string, patch: Partial<ColorBallRow>) {
    setRows((prev) =>
      prev.map((row) =>
        row.playerId === playerId ? { ...row, ...patch } : row
      )
    )
  }

  async function saveWeek() {
    setSaving(true)
    setStatus(null)
    try {
      const payload = {
        week,
        entries: rows.map((row) => ({
          player_id: row.playerId,
          attended: row.attended,
          completed_match: row.completed_match,
          matches_played: row.matches_played,
          coach_badges: row.coachBadgesCsv
            .split(',')
            .map((s) => s.trim())
            .filter(Boolean),
        })),
      }
      const res = await fetch('/api/utr-tracker/color-ball', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      const data = (await res.json().catch(() => ({}))) as {
        success?: boolean
        error?: string
      }
      if (!res.ok || !data.success) {
        setStatus(data.error ?? 'Failed to save Color Ball week.')
        return
      }
      setStatus(`Saved Color Ball week ${week}.`)
    } catch {
      setStatus('Failed to save Color Ball week.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <section className="rounded-2xl border border-brand-pacific-dusk/10 bg-white p-5 shadow-[0_8px_20px_rgba(27,58,92,0.06)]">
      <div className="mb-4 flex flex-wrap items-end gap-3">
        <h2 className="font-headline text-headline-sm text-brand-pacific-dusk">
          Color Ball Attendance & Badges
        </h2>
        <label className="font-sans text-sm text-brand-pacific-dusk">
          Week
          <input
            type="number"
            min={1}
            max={8}
            value={week}
            onChange={(e) => changeWeek(Number(e.target.value))}
            className="ml-2 w-16 min-h-[40px] rounded border border-black/15 px-2 py-1"
          />
        </label>
      </div>

      {rowCount === 0 ? (
        <p className="font-sans text-sm text-brand-pacific-dusk/70">
          No Color Ball players found in roster yet.
        </p>
      ) : (
        <div className="space-y-3">
          {rows.map((row) => (
            <div
              key={row.playerId}
              className="grid gap-2 rounded border border-black/10 p-3 md:grid-cols-[2fr_1fr_1fr_1fr_2fr]"
            >
              <p className="font-sans text-sm font-medium text-brand-pacific-dusk">
                {row.name}
              </p>
              <label className="inline-flex items-center gap-2 font-sans text-sm text-brand-pacific-dusk">
                <input
                  type="checkbox"
                  checked={row.attended}
                  onChange={(e) =>
                    updateRow(row.playerId, { attended: e.target.checked })
                  }
                />
                Attended
              </label>
              <label className="inline-flex items-center gap-2 font-sans text-sm text-brand-pacific-dusk">
                <input
                  type="checkbox"
                  checked={row.completed_match}
                  onChange={(e) =>
                    updateRow(row.playerId, {
                      completed_match: e.target.checked,
                    })
                  }
                />
                Completed match
              </label>
              <label className="font-sans text-sm text-brand-pacific-dusk">
                Matches
                <input
                  type="number"
                  min={0}
                  max={20}
                  value={row.matches_played}
                  onChange={(e) =>
                    updateRow(row.playerId, {
                      matches_played: Number(e.target.value) || 0,
                    })
                  }
                  className="ml-2 w-16 rounded border border-black/15 px-2 py-1"
                />
              </label>
              <label className="font-sans text-sm text-brand-pacific-dusk">
                Coach badges (comma separated)
                <input
                  type="text"
                  value={row.coachBadgesCsv}
                  onChange={(e) =>
                    updateRow(row.playerId, { coachBadgesCsv: e.target.value })
                  }
                  className="mt-1 w-full rounded border border-black/15 px-2 py-1"
                  placeholder="sportsmanship, hustle"
                />
              </label>
            </div>
          ))}
        </div>
      )}

      <div className="mt-4 flex items-center gap-3">
        <button
          type="button"
          onClick={saveWeek}
          disabled={saving || rowCount === 0}
          className="inline-flex min-h-[48px] items-center justify-center rounded-[2px] bg-black px-6 py-3 text-sm font-medium uppercase tracking-[2px] text-white disabled:opacity-60"
        >
          {saving ? 'Saving…' : 'Save Week'}
        </button>
        {status ? (
          <p className="font-sans text-sm text-brand-pacific-dusk/75">{status}</p>
        ) : null}
      </div>
    </section>
  )
}
