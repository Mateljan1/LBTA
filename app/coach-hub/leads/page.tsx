import Link from 'next/link'
import {
  getAllLeads,
  isValidChannel,
  leadMatchesChannel,
  channelLabel,
  programLabel,
  LEAD_CHANNELS,
  type ChannelId,
  type LeadRow,
} from '@/lib/leads-query'

export const dynamic = 'force-dynamic'

export const metadata = {
  title: 'Leads',
  robots: { index: false, follow: false },
}

type SearchParams = Promise<{ channel?: string | string[] }>

function readChannelParam(raw: string | string[] | undefined): ChannelId {
  const value = Array.isArray(raw) ? raw[0] : raw
  return isValidChannel(value) ? value : 'all'
}

function formatDateTime(iso: string): { date: string; time: string } {
  return { date: iso.slice(0, 10), time: iso.slice(11, 16) }
}

function summary(row: LeadRow): string {
  const p = (row.payload || {}) as Record<string, unknown>
  const bits: string[] = []
  if (typeof p.coach === 'string') bits.push(p.coach)
  if (typeof p.location === 'string') bits.push(p.location)
  if (typeof p.campaign === 'string') bits.push(`📣 ${p.campaign}`)
  return bits.join(' · ')
}

export default async function CoachHubLeadsPage({
  searchParams,
}: {
  searchParams: SearchParams
}) {
  const params = await searchParams
  const channel = readChannelParam(params.channel)
  const all = await getAllLeads({ limit: 1000 })
  const filtered = channel === 'all' ? all : all.filter((r) => leadMatchesChannel(r, channel))

  const exportHref = `/api/coach-hub/leads/export${channel === 'all' ? '' : `?channel=${channel}`}`

  return (
    <main id="main-content" tabIndex={-1} className="min-h-screen bg-brand-morning-light text-brand-pacific-dusk">
      <header className="bg-gradient-to-br from-brand-pacific-dusk to-brand-deep-water text-brand-sandstone shadow-lg px-4 py-6 md:px-6">
        <div className="max-w-[1280px] mx-auto flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="font-sans text-xs uppercase tracking-[2px] text-brand-sandstone/70">Coach Hub</p>
            <h1 className="font-headline text-3xl md:text-4xl text-brand-sandstone">Leads</h1>
            <p className="mt-1 font-sans text-sm text-brand-sandstone/80">
              {filtered.length === all.length
                ? `${all.length} total leads across every channel`
                : `${filtered.length} of ${all.length} leads — ${LEAD_CHANNELS.find((c) => c.id === channel)?.label ?? ''}`}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Link
              href="/coach-hub"
              className="inline-flex items-center font-sans text-sm font-medium tracking-[1.5px] uppercase text-brand-sandstone/80 hover:text-brand-sandstone focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-brand-deep-water rounded-sm min-h-[48px] px-3"
            >
              ← Hub
            </Link>
            <a
              href={exportHref}
              className="inline-flex items-center bg-brand-sandstone text-brand-pacific-dusk font-sans text-sm font-medium tracking-[1.5px] uppercase min-h-[48px] px-5 rounded-[2px] transition-colors hover:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-brand-deep-water"
            >
              Download CSV
            </a>
          </div>
        </div>
      </header>

      <nav aria-label="Filter by channel" className="border-b border-brand-pacific-dusk/10 bg-brand-sandstone/40">
        <div className="max-w-[1280px] mx-auto px-4 md:px-6 py-3 flex flex-wrap gap-2">
          {LEAD_CHANNELS.map((c) => {
            const isActive = c.id === channel
            const count =
              c.id === 'all'
                ? all.length
                : all.filter((r) => leadMatchesChannel(r, c.id)).length
            const href = c.id === 'all' ? '/coach-hub/leads' : `/coach-hub/leads?channel=${c.id}`
            return (
              <Link
                key={c.id}
                href={href}
                aria-current={isActive ? 'true' : undefined}
                className={`inline-flex items-center min-h-[40px] px-3 py-1 rounded-full font-sans text-xs tracking-[1px] uppercase transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-victoria-cove focus-visible:ring-offset-2 ${
                  isActive
                    ? 'bg-brand-pacific-dusk text-brand-sandstone'
                    : 'bg-white text-brand-pacific-dusk hover:bg-brand-pacific-dusk/5 border border-brand-pacific-dusk/15'
                }`}
              >
                {c.label}
                <span className={`ml-2 font-mono text-[10px] ${isActive ? 'text-brand-sandstone/70' : 'text-brand-pacific-dusk/50'}`}>
                  {count}
                </span>
              </Link>
            )
          })}
        </div>
      </nav>

      <section className="max-w-[1280px] mx-auto px-4 md:px-6 py-8">
        {filtered.length === 0 ? (
          <div className="rounded-[2px] border border-brand-pacific-dusk/10 bg-white p-10 text-center">
            <p className="font-headline text-2xl text-brand-pacific-dusk">No leads in this channel yet.</p>
            <p className="mt-2 font-sans text-sm text-brand-pacific-dusk/70">
              {channel === 'meta'
                ? 'The daily Meta lead-ad mirror runs at 03:00 PT. Check back after the next sync.'
                : 'New submissions will appear here.'}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto rounded-[2px] border border-brand-pacific-dusk/10 bg-white shadow-[0_1px_2px_rgba(0,0,0,0.02),0_2px_4px_rgba(0,0,0,0.02)]">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-brand-pacific-dusk/10 bg-brand-sandstone/40">
                  <th scope="col" className="text-left font-sans text-xs uppercase tracking-[1.5px] text-brand-pacific-dusk/60 px-4 py-3 whitespace-nowrap">When</th>
                  <th scope="col" className="text-left font-sans text-xs uppercase tracking-[1.5px] text-brand-pacific-dusk/60 px-4 py-3">Name</th>
                  <th scope="col" className="text-left font-sans text-xs uppercase tracking-[1.5px] text-brand-pacific-dusk/60 px-4 py-3">Email</th>
                  <th scope="col" className="text-left font-sans text-xs uppercase tracking-[1.5px] text-brand-pacific-dusk/60 px-4 py-3 whitespace-nowrap">Phone</th>
                  <th scope="col" className="text-left font-sans text-xs uppercase tracking-[1.5px] text-brand-pacific-dusk/60 px-4 py-3">Channel</th>
                  <th scope="col" className="text-left font-sans text-xs uppercase tracking-[1.5px] text-brand-pacific-dusk/60 px-4 py-3">Class / Program</th>
                  <th scope="col" className="text-left font-sans text-xs uppercase tracking-[1.5px] text-brand-pacific-dusk/60 px-4 py-3">Notes</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((row) => {
                  const { date, time } = formatDateTime(row.created_at)
                  return (
                    <tr key={row.id} className="border-b border-brand-pacific-dusk/5 last:border-0 hover:bg-brand-sandstone/20 transition-colors">
                      <td className="px-4 py-3 align-top whitespace-nowrap">
                        <div className="font-mono text-xs text-brand-pacific-dusk">{date}</div>
                        <div className="font-mono text-[11px] text-brand-pacific-dusk/60">{time}</div>
                      </td>
                      <td className="px-4 py-3 align-top">{row.name || <span className="text-brand-pacific-dusk/40">—</span>}</td>
                      <td className="px-4 py-3 align-top">
                        <a
                          href={`mailto:${row.email}`}
                          className="text-brand-victoria-cove hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-victoria-cove focus-visible:ring-offset-1 rounded-sm break-all"
                        >
                          {row.email}
                        </a>
                      </td>
                      <td className="px-4 py-3 align-top whitespace-nowrap font-mono text-xs">
                        {row.phone ? (
                          <a
                            href={`tel:${row.phone}`}
                            className="text-brand-victoria-cove hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-victoria-cove focus-visible:ring-offset-1 rounded-sm"
                          >
                            {row.phone}
                          </a>
                        ) : (
                          <span className="text-brand-pacific-dusk/40">—</span>
                        )}
                      </td>
                      <td className="px-4 py-3 align-top">
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] tracking-[0.5px] uppercase bg-brand-pacific-dusk/5 text-brand-pacific-dusk">
                          {channelLabel(row)}
                        </span>
                      </td>
                      <td className="px-4 py-3 align-top">{programLabel(row)}</td>
                      <td className="px-4 py-3 align-top text-brand-pacific-dusk/70 max-w-[260px] truncate" title={summary(row)}>
                        {summary(row) || <span className="text-brand-pacific-dusk/40">—</span>}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </section>

      <footer className="max-w-[1280px] mx-auto px-4 md:px-6 pb-12 pt-2">
        <p className="font-sans text-xs text-brand-pacific-dusk/50">
          Source: Supabase <code className="font-mono">leads</code>. Meta lead-ad rows arrive via daily mirror from Notion.
        </p>
      </footer>
    </main>
  )
}
