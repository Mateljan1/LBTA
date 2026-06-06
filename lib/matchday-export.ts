/**
 * Match Day end-of-day export — pure markdown builder used by the "Copy summary"
 * fallback (coach texts/emails it to Andrew when live sync isn't available).
 */

import {
  LEVEL_DEFS,
  POD_META,
  POD_ORDER,
  computeStandings,
  generateRoundRobin,
  matchKey,
  orderPodPlayers,
  type Player,
} from '@/lib/matchday-config'

interface ExportInput {
  weekName: string
  dayLabel: string
  players: Player[]
  results: Record<string, string>
  scores: Record<string, string>
  notes: string
}

export function buildExportMarkdown({
  weekName,
  dayLabel,
  players,
  results,
  scores,
  notes,
}: ExportInput): string {
  let out = `LBTA Match Play — ${weekName} · ${dayLabel}\nCoach: (fill in)\n\n`

  POD_ORDER.forEach((podId) => {
    const podPlayers = orderPodPlayers(players.filter((p) => p.pod === podId))
    if (!podPlayers.length) return
    const meta = POD_META[podId]
    out += `### ${meta.name} (${podPlayers.length} players)\n`
    out += `Players: ${podPlayers
      .map((p) => `${p.name} (${LEVEL_DEFS[p.level].label})${p.walkin ? ' [WALK-IN]' : ''}`)
      .join(', ')}\n`
    const walkins = podPlayers.filter((p) => p.walkin)
    if (walkins.length) {
      out += `Walk-ins (Andrew handles UTR upload + billing): ${walkins
        .map((p) => p.name)
        .join(', ')}\n`
    }
    out += '\n'
    generateRoundRobin(podPlayers).forEach((round, rI) => {
      round.forEach(([a, b], mI) => {
        const key = matchKey(podId, a.id, b.id)
        const w = results[key]
        const s = scores[key] || ''
        const winner = w === a.id ? a.name : w === b.id ? b.name : '(pending)'
        out += `R${rI + 1}.M${mI + 1}: ${a.name} vs ${b.name} → Winner: ${winner}${s ? ` (${s})` : ''}\n`
      })
    })
    out += '\n'
  })

  out += '### Standings\n'
  POD_ORDER.forEach((podId) => {
    const podPlayers = players.filter((p) => p.pod === podId)
    if (podPlayers.length < 2) return
    out += `\n${POD_META[podId].name}:\n`
    computeStandings(podId, podPlayers, results).forEach((s, i) => {
      out += `  ${i + 1}. ${s.name} — ${s.w}W ${s.l}L\n`
    })
  })

  if (notes.trim()) out += `\n### Coach notes\n${notes.trim()}\n`
  return out
}
