'use client'

interface AppDownloadCardProps {
  className?: string
  variant?: 'default' | 'dark'
}

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void
  }
}

const APP_STORE_URL = 'https://apps.apple.com/mo/app/lbta/id6746348933'
const PLAY_STORE_URL = 'https://play.google.com/store/apps/details?id=com.court.laguna&hl=en_US'

function trackAppDownload(platform: 'ios' | 'android') {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', 'registration_app_download_clicked', {
      event_category: 'Registration',
      platform,
    })
  }
}

export default function AppDownloadCard({ className, variant = 'default' }: AppDownloadCardProps) {
  const isDark = variant === 'dark'

  return (
    <div
      className={`rounded-lg px-5 py-5 md:px-6 md:py-6 ${
        isDark
          ? 'bg-white/[0.08] border border-white/10 text-white'
          : 'bg-brand-deep-water text-brand-sandstone shadow-[0_14px_45px_rgba(0,0,0,0.25)]'
      } ${className ?? ''}`}
    >
      <p className={`font-sans text-[11px] font-medium uppercase tracking-[0.18em] mb-2 ${isDark ? 'text-white/50' : 'text-brand-sandstone/70'}`}>
        LBTA App
      </p>
      <h3 className={`font-headline text-[20px] md:text-[22px] font-medium mb-2 ${isDark ? 'text-white' : 'text-brand-sandstone'}`}>
        Download the LBTA app
      </h3>
      <p className={`font-sans text-[14px] leading-relaxed mb-4 ${isDark ? 'text-white/70' : 'text-brand-sandstone/85'}`}>
        Your home base for class confirmations, cancellations, makeups, and coach messages.
      </p>
      <div className="flex flex-wrap gap-3">
        <a
          href={APP_STORE_URL}
          target="_blank"
          rel="noreferrer"
          onClick={() => trackAppDownload('ios')}
          className={`inline-flex items-center justify-center rounded-[2px] border font-sans text-[12px] font-medium tracking-[0.16em] uppercase px-4 py-2.5 min-h-[44px] transition-all duration-300 hover:-translate-y-0.5 focus:outline-none focus-visible:ring-2 ${
            isDark
              ? 'border-white/20 bg-white text-brand-deep-water hover:bg-white/90 focus-visible:ring-white/30 focus-visible:ring-offset-brand-deep-water focus-visible:ring-offset-2'
              : 'border-brand-sandstone/40 bg-brand-sandstone text-brand-deep-water hover:bg-white focus-visible:ring-brand-sandstone focus-visible:ring-offset-2 focus-visible:ring-offset-brand-deep-water'
          }`}
        >
          App Store
        </a>
        <a
          href={PLAY_STORE_URL}
          target="_blank"
          rel="noreferrer"
          onClick={() => trackAppDownload('android')}
          className={`inline-flex items-center justify-center rounded-[2px] border bg-transparent font-sans text-[12px] font-medium tracking-[0.16em] uppercase px-4 py-2.5 min-h-[44px] transition-all duration-300 hover:-translate-y-0.5 focus:outline-none focus-visible:ring-2 ${
            isDark
              ? 'border-white/20 text-white hover:bg-white/10 focus-visible:ring-white/30 focus-visible:ring-offset-brand-deep-water focus-visible:ring-offset-2'
              : 'border-brand-sandstone/40 text-brand-sandstone hover:bg-brand-sandstone/10 focus-visible:ring-brand-sandstone focus-visible:ring-offset-2 focus-visible:ring-offset-brand-deep-water'
          }`}
        >
          Google Play
        </a>
      </div>
    </div>
  )
}

