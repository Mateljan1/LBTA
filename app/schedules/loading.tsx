import HorizonDivider from '@/components/ui/HorizonDivider'

/**
 * Loading UI for /schedules while the page and data load.
 * Skeleton matches the schedules hero and content structure.
 */
export default function SchedulesLoading() {
  return (
    <>
      <p className="sr-only" role="status" aria-live="polite">
        Loading schedules
      </p>
      <div aria-hidden="true">
        <section className="bg-brand-deep-water py-16 md:py-20 animate-pulse">
          <div className="max-w-[1200px] mx-auto px-4 md:px-6 text-center">
            <div className="h-3 w-32 mx-auto mb-4 rounded bg-white/20" />
            <div className="h-12 md:h-16 w-64 mx-auto mb-6 rounded bg-white/25" />
            <div className="h-5 w-[min(100%,400px)] mx-auto rounded bg-white/20" />
          </div>
        </section>
        <HorizonDivider />
        <div className="bg-white pt-4 pb-20">
          <div className="max-w-[1200px] mx-auto px-4 md:px-6">
            <div className="h-5 w-40 rounded bg-black/5 mb-8" />
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-24 rounded-lg bg-black/5 animate-pulse" style={{ animationDelay: `${i * 80}ms` }} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
