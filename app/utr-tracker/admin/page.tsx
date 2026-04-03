import AdminMatches from '@/components/utr-tracker/AdminMatches'
import ColorBallAdmin from '@/components/utr-tracker/ColorBallAdmin'
import PlayerRoster from '@/components/utr-tracker/PlayerRoster'
import {
  getAllColorBallAttendance,
  getAllColorBallBadges,
  getAllPlayers,
} from '@/lib/utr-tracker-supabase'

export default async function UtrTrackerAdminPage() {
  const [players, attendance, badges] = await Promise.all([
    getAllPlayers(),
    getAllColorBallAttendance(),
    getAllColorBallBadges(),
  ])

  return (
    <div className="bg-brand-morning-light text-brand-pacific-dusk">
      <main className="container-lbta section-sm space-y-8">
        <header>
          <p className="text-eyebrow text-brand-victoria-cove mb-2">Admin</p>
          <h1 className="font-headline text-headline text-brand-pacific-dusk mb-2">
            UTR Tracker Operations
          </h1>
          <p className="font-sans text-brand-pacific-dusk/75 max-w-3xl">
            Enter weekly match results, update Color Ball attendance and badges,
            and maintain the player roster for live public standings.
          </p>
        </header>

        <AdminMatches />
        <ColorBallAdmin
          players={players}
          attendance={attendance}
          badges={badges}
        />
        <PlayerRoster initialPlayers={players} />
      </main>
    </div>
  )
}
