import type { ConcurrentSessionRow } from '@/lib/calendar-schedule'
import {
  partitionConcurrentSessions,
  concurrentSessionRowTw,
  playerGuidanceFromAges,
  sortConcurrentSessionsByStart,
} from '@/lib/calendar-schedule'

export type ConcurrentCellVariant = 'flyer' | 'calendar'

interface ConcurrentScheduleCellBodyProps {
  sessions: ConcurrentSessionRow[]
  blockTime: string
  variant: ConcurrentCellVariant
}

function SessionRow({
  row,
  timeCls,
  nameCls,
  guideCls,
}: {
  row: ConcurrentSessionRow
  timeCls: string
  nameCls: string
  guideCls: string
}) {
  const levelLine = playerGuidanceFromAges(row.ages)
  return (
    <div className={`mb-1.5 last:mb-0 ${concurrentSessionRowTw(row.programName, row.category)}`}>
      <div className={timeCls}>{row.time}</div>
      <div className={nameCls}>{row.programName}</div>
      {levelLine ? <div className={guideCls}>{levelLine}</div> : null}
    </div>
  )
}

/**
 * Renders merged “concurrent courts” schedule cells: two columns (Juniors | Adults & LiveBall)
 * when both sides exist; otherwise a single column with per-row color accents (e.g. Friday youth).
 */
export function ConcurrentScheduleCellBody({
  sessions,
  blockTime,
  variant,
}: ConcurrentScheduleCellBodyProps) {
  const { juniors, adultsColumn, youthColumn } = partitionConcurrentSessions(sessions)
  const j = sortConcurrentSessionsByStart(juniors)
  const a = sortConcurrentSessionsByStart(adultsColumn)
  const y = sortConcurrentSessionsByStart(youthColumn)

  const isFlyer = variant === 'flyer'
  const timeCls = isFlyer
    ? 'text-[9px] font-bold text-brand-deep-water tabular-nums'
    : 'text-[11px] font-semibold text-brand-pacific-dusk tabular-nums'
  const nameCls = isFlyer
    ? 'text-[10px] font-semibold text-brand-deep-water leading-snug'
    : 'text-[13px] font-medium text-brand-pacific-dusk leading-snug'
  const headerCls = isFlyer
    ? 'text-[8px] font-bold uppercase tracking-wider text-brand-deep-water/95 mb-1'
    : 'text-[10px] font-bold uppercase tracking-wider text-brand-pacific-dusk mb-1.5'
  const noteCls = isFlyer ? 'text-[8px]' : 'text-[11px]'
  const guideCls = isFlyer
    ? 'text-[8px] font-medium text-brand-pacific-dusk/90 mt-0.5 leading-snug'
    : 'text-[11px] text-brand-pacific-dusk/75 mt-0.5 leading-snug'

  function Column({ title, rows }: { title: string; rows: ConcurrentSessionRow[] }) {
    if (!rows.length) return null
    return (
      <div className="min-w-0 flex-1">
        <div className={headerCls}>{title}</div>
        <div className="space-y-0">
          {rows.map((r) => (
            <SessionRow
              key={`${r.programId}-${r.time}-${r.programName}`}
              row={r}
              timeCls={timeCls}
              nameCls={nameCls}
              guideCls={guideCls}
            />
          ))}
        </div>
      </div>
    )
  }

  const twoCol = j.length > 0 && a.length > 0
  const onlyYouth = y.length > 0 && j.length === 0 && a.length === 0

  if (twoCol) {
    return (
      <div className="w-full">
        <div className={`flex flex-row ${isFlyer ? 'gap-1.5' : 'gap-3'} items-stretch`}>
          <Column title="Juniors" rows={j} />
          <div
            className="w-px shrink-0 bg-brand-pacific-dusk/20 self-stretch min-h-[2rem]"
            aria-hidden
          />
          <Column title="Adults & LiveBall" rows={a} />
        </div>
        {!isFlyer && (
          <p className={`mt-2 ${noteCls} text-brand-pacific-dusk/85 leading-snug`}>
            Neighboring courts · {blockTime}. Each row is a different class—use the level line to find your fit.
          </p>
        )}
      </div>
    )
  }

  if (onlyYouth) {
    return (
      <div className="w-full">
        <div className={headerCls}>Youth & performance</div>
        <div className="space-y-0">
          {y.map((r) => (
            <SessionRow
              key={`${r.programId}-${r.time}-${r.programName}`}
              row={r}
              timeCls={timeCls}
              nameCls={nameCls}
              guideCls={guideCls}
            />
          ))}
        </div>
        {!isFlyer && (
          <p className={`mt-2 ${noteCls} text-brand-pacific-dusk/85 leading-snug`}>
            Neighboring courts · {blockTime}. Placement differs by program—check each level line.
          </p>
        )}
      </div>
    )
  }

  const sorted = sortConcurrentSessionsByStart(sessions)
  return (
    <div className="w-full">
      <div className="space-y-0">
        {sorted.map((r) => (
          <SessionRow
            key={`${r.programId}-${r.time}-${r.programName}`}
            row={r}
            timeCls={timeCls}
            nameCls={nameCls}
            guideCls={guideCls}
          />
        ))}
      </div>
      {!isFlyer && (
        <p className={`mt-2 ${noteCls} text-brand-pacific-dusk/85 leading-snug`}>
          Neighboring courts · {blockTime}. Each row is a different class.
        </p>
      )}
    </div>
  )
}
