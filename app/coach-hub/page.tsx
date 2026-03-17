import type { HubData } from '@/lib/coach-hub-types'
import type { SeasonsMap, CoachSchedulesMap } from '@/lib/coach-hub-types'
import CoachHubClient from '@/components/coach-hub/CoachHubClient'
import hubDataJson from '@/data/coach-hub/hub-data.json'
import seasonsJson from '@/data/coach-hub/seasons.json'
import coachSchedulesJson from '@/data/coach-hub/coach-schedules.json'

const hubData = hubDataJson as unknown as HubData
const seasons = seasonsJson as unknown as SeasonsMap
const coachSchedules = coachSchedulesJson as unknown as CoachSchedulesMap

export default function CoachHubPage() {
  return (
    <CoachHubClient
      initialData={{
        hubData,
        seasons,
        coachSchedules,
      }}
    />
  )
}
