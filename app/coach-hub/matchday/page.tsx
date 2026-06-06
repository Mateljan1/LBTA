import type { Metadata } from 'next'
import MatchDayApp from '@/components/coach-hub/matchday/MatchDayApp'
import { getQuickBatches } from '@/lib/matchday-roster'
import { getUtrSeasonWeekNumber } from '@/lib/utr-match-play'

export const metadata: Metadata = {
  title: 'Match Day · Coach Hub · LBTA',
  robots: { index: false, follow: false, nocache: true },
}

// Reads env + the live UTR roster per request — never statically cached.
export const dynamic = 'force-dynamic'

function dayLabel(): string {
  return new Intl.DateTimeFormat('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(new Date())
}

export default async function MatchDayPage() {
  const { batches, source } = await getQuickBatches()
  const weekName = `Week ${getUtrSeasonWeekNumber()}`
  // Capability token, only rendered into the gated page (proxy.ts protects this route).
  const syncToken = process.env.MATCHDAY_SYNC_TOKEN?.trim() || null

  return (
    <div className="min-h-screen bg-brand-morning-light">
      <MatchDayApp
        weekName={weekName}
        dayLabel={dayLabel()}
        syncToken={syncToken}
        quickBatches={batches}
        rosterSource={source}
      />
    </div>
  )
}
