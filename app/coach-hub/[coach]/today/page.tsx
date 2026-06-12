import { notFound } from 'next/navigation'
import coachesJson from '@/data/coach-hub/coaches.json'
import type { CoachEntry, CoachRegistry } from '@/lib/coach-today-types'
import { getCoachTodayData } from '@/lib/coach-today-data'
import CoachTodayShell from '@/components/coach-hub-coach/CoachTodayShell'
import CoachHtmlContent from '@/components/coach-hub-coach/CoachHtmlContent'
import CoachDataView from '@/components/coach-hub-coach/CoachDataView'

const REGISTRY = coachesJson as unknown as CoachRegistry

interface PageProps {
  params: Promise<{ coach: string }>
}

export default async function PerCoachTodayPage({ params }: PageProps) {
  const { coach: rawSlug } = await params
  const slug = (rawSlug ?? '').toLowerCase()
  const coach: CoachEntry | undefined = REGISTRY[slug]

  if (!coach) {
    notFound()
  }

  let body: React.ReactNode = null

  if (coach.contentType === 'html' && coach.htmlPath) {
    body = <CoachHtmlContent htmlPath={coach.htmlPath} coachName={coach.name} />
  } else if (coach.contentType === 'data') {
    const data = getCoachTodayData(slug)
    if (data) {
      body = <CoachDataView data={data} />
    } else {
      body = (
        <div className="max-w-[720px] mx-auto px-6 py-12">
          <p className="font-headline text-xl text-brand-deep-water mb-2">
            No content for today.
          </p>
          <p className="text-sm text-brand-pacific-dusk/70">
            Add a static import for{' '}
            <code className="font-mono text-xs bg-brand-sandstone px-1.5 py-0.5 rounded">
              {coach.slug}
            </code>{' '}
            in <code className="font-mono text-xs">lib/coach-today-data.ts</code>.
          </p>
        </div>
      )
    }
  } else {
    body = (
      <div className="max-w-[720px] mx-auto px-6 py-12">
        <p className="font-headline text-xl text-brand-deep-water">
          Coach view is not configured.
        </p>
      </div>
    )
  }

  return (
    <CoachTodayShell coach={coach} activeTab="today">
      {body}
    </CoachTodayShell>
  )
}
