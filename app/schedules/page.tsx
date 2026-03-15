import {
  getWinter2026Programs,
  getSpringProgramsForDisplay,
  getSummerProgramsForDisplay,
  getFall2026Programs,
} from '@/lib/programs-data'
import { getCurrentSeason, getAllSeasons, getSeasonCTA, type SeasonKey } from '@/lib/season-utils'
import { parseYear2026Sections, parsePrograms, parseLeagues } from '@/lib/schedule-schemas'
import year2026Data from '@/data/year2026.json'
import leaguesData from '@/data/leagues-2026.json'
import type { Program } from '@/components/ProgramCard'
import SchedulesPageClient from '@/components/schedules/SchedulesPageClient'

export default function SchedulesPage() {
  const winter = parsePrograms(getWinter2026Programs())
  const spring = parsePrograms(getSpringProgramsForDisplay())
  const summer = parsePrograms(getSummerProgramsForDisplay())
  const fall = parsePrograms(getFall2026Programs())
  const programsBySeason: Record<SeasonKey, Program[]> = {
    winter,
    spring,
    summer,
    fall,
  }
  const seasons = getAllSeasons()
  const initialSeason = getCurrentSeason()
  const seasonCta = getSeasonCTA()
  const year2026 = parseYear2026Sections(year2026Data)
  const leagues = parseLeagues(leaguesData)

  return (
    <SchedulesPageClient
      programsBySeason={programsBySeason}
      seasons={seasons}
      initialSeason={initialSeason}
      seasonCta={seasonCta}
      year2026={year2026}
      leagues={leagues}
    />
  )
}
