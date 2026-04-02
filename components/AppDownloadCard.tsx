import Link from 'next/link'

interface AppDownloadCardProps {
  className?: string
}

const APP_STORE_URL = 'https://apps.apple.com/mo/app/lbta/id6746348933'
const PLAY_STORE_URL = 'https://play.google.com/store/apps/details?id=com.court.laguna&hl=en_US'

export default function AppDownloadCard({ className }: AppDownloadCardProps) {
  return (
    <div
      className={`rounded-lg bg-brand-deep-water text-brand-sandstone px-5 py-5 md:px-6 md:py-6 shadow-[0_14px_45px_rgba(0,0,0,0.25)] ${className ?? ''}`}
    >
      <p className="font-sans text-[11px] font-medium uppercase tracking-[0.18em] text-brand-sandstone/70 mb-2">
        LBTA App
      </p>
      <h3 className="font-headline text-[20px] md:text-[22px] font-medium text-brand-sandstone mb-2">
        Download the LBTA app
      </h3>
      <p className="font-sans text-[14px] text-brand-sandstone/85 leading-relaxed mb-4">
        Your home base for class confirmations, cancellations, makeups, and coach messages.
      </p>
      <div className="flex flex-wrap gap-3">
        <Link
          href={APP_STORE_URL}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center justify-center rounded-[2px] border border-brand-sandstone/40 bg-brand-sandstone text-brand-deep-water font-sans text-[12px] font-medium tracking-[0.16em] uppercase px-4 py-2.5 min-h-[44px] transition-all duration-300 hover:bg-white hover:-translate-y-0.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-sandstone focus-visible:ring-offset-2 focus-visible:ring-offset-brand-deep-water"
        >
          App Store
        </Link>
        <Link
          href={PLAY_STORE_URL}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center justify-center rounded-[2px] border border-brand-sandstone/40 bg-transparent text-brand-sandstone font-sans text-[12px] font-medium tracking-[0.16em] uppercase px-4 py-2.5 min-h-[44px] transition-all duration-300 hover:bg-brand-sandstone/10 hover:-translate-y-0.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-sandstone focus-visible:ring-offset-2 focus-visible:ring-offset-brand-deep-water"
        >
          Google Play
        </Link>
      </div>
    </div>
  )
}

