import type { Metadata } from 'next'
import Link from 'next/link'
import leagues2026 from '@/data/leagues-2026.json'
import { LeagueEventSchema } from '@/app/schema'
import HorizonDivider from '@/components/ui/HorizonDivider'

export const metadata: Metadata = {
  title: 'UTR Match Play Series | Laguna Beach Tennis Academy',
  description:
    'LBTA UTR Circuit — Season 1. 8 Saturdays of rated matchplay in Laguna Beach. 5 divisions from Color Ball juniors to advanced adults. April–June 2026.',
}

const divisions = leagues2026.utr.divisions
const ntrpToUtr = leagues2026.utr.ntrpToUtr

export default function UTRMatchPlayPage() {
  return (
    <div>
      <LeagueEventSchema
        name="UTR Match Play Series — Season 1"
        description="8 Saturdays of rated matchplay in Laguna Beach. 5 divisions from Color Ball juniors to advanced adults. April–June 2026."
        startDate="2026-04-04"
        endDate="2026-06-13"
        location="Laguna Beach"
      />
      {/* Hero */}
      <section className="relative bg-brand-deep-water text-white overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-brand-deep-water via-brand-pacific-dusk/70 to-brand-sunset-cliff/10" />
        <div className="relative container-lbta section-lg">
          <Link
            href="/programs/leagues"
            className="inline-flex items-center gap-2 text-[12px] font-sans font-medium text-brand-victoria-cove/70 tracking-wider uppercase mb-8 hover:text-brand-victoria-cove transition-colors"
          >
            <span>&larr;</span> Leagues & Circuit
          </Link>
          <span className="text-eyebrow text-brand-sunset-cliff/80 mb-4 block">
            Season 1 — April 4 to June 13, 2026
          </span>
          <h1 className="font-headline text-display-xl text-white mb-6 max-w-3xl">
            UTR Match Play Series
          </h1>
          <p className="text-[1.1rem] font-sans font-light text-white/60 max-w-2xl leading-relaxed">
            8 Saturdays of structured, rated matchplay in Laguna Beach. Five
            divisions from Color Ball juniors to advanced adults. Every result
            submitted to UTR.
          </p>
        </div>
      </section>

      <HorizonDivider />

      {/* Saturday Flow */}
      <section className="container-lbta section">
        <div className="max-w-4xl mx-auto">
          <h2 className="font-headline text-display text-brand-pacific-dusk mb-4">
            Every Saturday
          </h2>
          <p className="text-body text-brand-pacific-dusk/60 max-w-2xl mb-12 leading-relaxed">
            Show up, compete, and track your progress. Divisions are by level,
            not age or gender.
          </p>

          <div className="grid sm:grid-cols-4 gap-8 mb-16">
            {[
              { step: '01', title: 'Check In', desc: 'Arrive and see the draw. Seeded by your rating.' },
              { step: '02', title: 'Play', desc: 'Competitive matches in your division. Best of 3 or pro sets.' },
              { step: '03', title: 'Results', desc: 'Scores submitted to UTR same day. Rating updates reflect immediately.' },
              { step: '04', title: 'Leaderboard', desc: 'Season standings refresh every Sunday. Track your climb.' },
            ].map((item) => (
              <div key={item.step}>
                <span className="text-eyebrow text-brand-sunset-cliff mb-3 block">
                  {item.step}
                </span>
                <h3 className="font-headline text-headline-sm text-brand-pacific-dusk mb-2">
                  {item.title}
                </h3>
                <p className="text-[14px] font-sans font-light text-brand-pacific-dusk/55 leading-relaxed">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Divisions */}
      <section className="bg-brand-sandstone">
        <div className="container-lbta section">
          <div className="max-w-5xl mx-auto">
            <h2 className="font-headline text-display text-brand-pacific-dusk mb-4">
              Five Divisions
            </h2>
            <p className="text-body text-brand-pacific-dusk/60 mb-12">
              Find your level. Multiple divisions can be played if your rating qualifies.
            </p>

            <div className="grid gap-4">
              {divisions.map((d) => (
                <div
                  key={d.name}
                  className="bg-white rounded-lg border border-brand-pacific-dusk/5 p-6 md:p-8 flex flex-col md:flex-row md:items-center gap-4 md:gap-8 hover:shadow-soft transition-all"
                >
                  <div className="flex-1 min-w-0">
                    <h3 className="font-headline text-headline text-brand-pacific-dusk mb-1">
                      {d.name}
                    </h3>
                    <p className="text-[14px] font-sans font-light text-brand-pacific-dusk/50">
                      {d.level}
                    </p>
                  </div>
                  <div className="grid grid-cols-3 gap-4 text-[13px] font-sans text-brand-pacific-dusk/60 md:text-right">
                    <div>
                      <span className="text-eyebrow-sm text-brand-pacific-dusk/30 block mb-0.5">Format</span>
                      <span className="font-light">{d.format}</span>
                    </div>
                    <div>
                      <span className="text-eyebrow-sm text-brand-pacific-dusk/30 block mb-0.5">Time</span>
                      <span className="font-light">{d.time}</span>
                    </div>
                    <div>
                      <span className="text-eyebrow-sm text-brand-pacific-dusk/30 block mb-0.5">Price</span>
                      <span className="font-medium text-brand-sunset-cliff">{d.price}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Season Points & Grand Finals */}
      <section className="container-lbta section">
        <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-12">
          <div>
            <h3 className="font-headline text-display-sm text-brand-pacific-dusk mb-6">
              Season Points
            </h3>
            <p className="text-[15px] font-sans font-light text-brand-pacific-dusk/55 mb-6 leading-relaxed">
              Two leaderboard tracks: UTR (national, skill-based) and Season
              Points (local, effort-based — points only go up).
            </p>
            <div className="space-y-3">
              {[
                { label: 'Show up and compete', pts: '+10' },
                { label: 'Win a match', pts: '+15' },
                { label: 'Upset (UTR diff ≥ 0.5)', pts: '+25' },
                { label: 'Complete all weekly matches', pts: '+10' },
                { label: '3-week attendance streak', pts: '+20' },
                { label: 'UTR improves from prior week', pts: '+10' },
              ].map((item) => (
                <div
                  key={item.label}
                  className="flex items-center justify-between py-2 border-b border-brand-pacific-dusk/5"
                >
                  <span className="text-[14px] font-sans font-light text-brand-pacific-dusk/60">
                    {item.label}
                  </span>
                  <span className="text-[14px] font-sans font-medium text-brand-sunset-cliff">
                    {item.pts}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h3 className="font-headline text-display-sm text-brand-pacific-dusk mb-6">
              Grand Finals
            </h3>
            <p className="text-eyebrow text-brand-sunset-cliff mb-4">
              June 13, 2026
            </p>
            <div className="space-y-4 text-[15px] font-sans font-light text-brand-pacific-dusk/55 leading-relaxed">
              <p>
                <strong className="font-medium text-brand-pacific-dusk">4:00 PM</strong> — Division
                finals across all five divisions.
              </p>
              <p>
                <strong className="font-medium text-brand-pacific-dusk">6:00 PM</strong> — Food
                trucks, social hour, Season 2 registration opens.
              </p>
              <p>
                <strong className="font-medium text-brand-pacific-dusk">7:00 PM</strong> — Awards
                ceremony, grand raffle.
              </p>
              <p>
                <strong className="font-medium text-brand-pacific-dusk">8:00 PM</strong> — Exhibition: Season Champion plays doubles with Karu&eacute; Sell (ATP #258, UCLA All-American).
              </p>
            </div>

            <div className="mt-8 bg-brand-sandstone rounded-lg p-6">
              <h4 className="text-eyebrow text-brand-victoria-cove mb-3">
                Season Tiers
              </h4>
              <div className="space-y-2">
                {[
                  { tier: 'Legend', req: 'Grand Finals Top 3' },
                  { tier: 'Champion', req: '450+ points' },
                  { tier: 'Advanced', req: '250–449 points' },
                  { tier: 'Contender', req: '100–249 points' },
                  { tier: 'Challenger', req: '0–99 points' },
                ].map((t) => (
                  <div
                    key={t.tier}
                    className="flex items-center justify-between text-[13px] font-sans"
                  >
                    <span className="font-medium text-brand-pacific-dusk">
                      {t.tier}
                    </span>
                    <span className="font-light text-brand-pacific-dusk/50">
                      {t.req}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* NTRP → UTR Reference */}
      <section className="bg-white border-y border-brand-pacific-dusk/5">
        <div className="container-lbta section-sm">
          <div className="max-w-3xl mx-auto">
            <h3 className="font-headline text-display-sm text-brand-pacific-dusk mb-6 text-center">
              NTRP to UTR Reference
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full text-[14px] font-sans">
                <thead>
                  <tr className="border-b border-brand-pacific-dusk/10">
                    <th scope="col" className="py-3 px-4 text-left text-eyebrow-sm text-brand-pacific-dusk/40">
                      NTRP
                    </th>
                    <th scope="col" className="py-3 px-4 text-left text-eyebrow-sm text-brand-pacific-dusk/40">
                      UTR (Men)
                    </th>
                    <th scope="col" className="py-3 px-4 text-left text-eyebrow-sm text-brand-pacific-dusk/40">
                      UTR (Women)
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {ntrpToUtr.map((row) => (
                    <tr
                      key={row.ntrp}
                      className="border-b border-brand-pacific-dusk/5"
                    >
                      <td className="py-3 px-4 font-medium text-brand-pacific-dusk">
                        {row.ntrp}
                      </td>
                      <td className="py-3 px-4 font-light text-brand-pacific-dusk/60">
                        {row.men}
                      </td>
                      <td className="py-3 px-4 font-light text-brand-pacific-dusk/60">
                        {row.women}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

      {/* Venues */}
      <section className="container-lbta section-sm">
        <div className="max-w-4xl mx-auto">
          <h3 className="font-headline text-display-sm text-brand-pacific-dusk mb-8 text-center">
            Venues
          </h3>
          <div className="grid sm:grid-cols-2 gap-6">
            {[
              {
                name: 'Laguna Beach High School',
                address: '605 Park Ave, Laguna Beach',
                courts: '6 courts (4 lit)',
                divisions: 'UTR 3.0–5.0, UTR 5.0–7.0, Doubles',
              },
              {
                name: 'Alta Laguna Park',
                address: 'Alta Laguna Blvd, Laguna Beach',
                courts: '4 courts',
                divisions: 'Color Ball, UTR 2.0–4.0',
              },
            ].map((v) => (
              <div
                key={v.name}
                className="bg-brand-sandstone rounded-lg p-6"
              >
                <h4 className="font-headline text-headline-sm text-brand-pacific-dusk mb-2">
                  {v.name}
                </h4>
                <p className="text-[14px] font-sans font-light text-brand-pacific-dusk/50 mb-1">
                  {v.address}
                </p>
                <p className="text-[14px] font-sans font-light text-brand-pacific-dusk/50 mb-3">
                  {v.courts}
                </p>
                <p className="text-[12px] font-sans font-medium text-brand-victoria-cove tracking-wide">
                  {v.divisions}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Sign Up */}
      <section className="bg-brand-deep-water text-white">
        <div className="container-lbta section text-center">
          <h2 className="font-headline text-display text-white mb-4">
            Register for Season 1
          </h2>
          <p className="text-[1.05rem] font-sans font-light text-white/50 max-w-lg mx-auto mb-8">
            8 Saturdays of competitive, rated matchplay. Choose your division
            and secure your spot.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <a
              href="mailto:info@lagunabeachtennisacademy.com?subject=UTR%20Circuit%20Registration"
              className="btn-primary"
            >
              Register Now
            </a>
            <Link href="/book" className="btn-secondary border-white/20 text-white hover:border-white/50 hover:bg-white/5">
              Book a Trial First
            </Link>
          </div>
          <p className="text-[13px] font-sans font-light text-white/50 mt-6">
            Presented by Laguna Beach Tennis Academy & Fit4Tennis
          </p>
        </div>
      </section>
    </div>
  )
}
