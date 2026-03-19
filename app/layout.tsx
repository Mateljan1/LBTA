import type { Metadata, Viewport } from 'next'
import { Cormorant, DM_Sans } from 'next/font/google'
import Script from 'next/script'
import './globals.css'
import ConditionalLayout from '@/components/layout/ConditionalLayout'
import ExitIntentPopupLoader from '@/components/ExitIntentPopupLoader'
import { OrganizationSchema } from './schema'
import { ReviewSchema } from '@/components/SEOSchemas'

const cormorant = Cormorant({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600'],
  style: ['normal', 'italic'],
  variable: '--font-cormorant',
  display: 'swap',
  preload: true,
  adjustFontFallback: true,
})

const dmSans = DM_Sans({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600'],
  style: ['normal', 'italic'],
  variable: '--font-dm-sans',
  display: 'swap',
  preload: true,
  adjustFontFallback: true,
})

/** Default SEO + OG aligned with homepage voice (Movement · Craft · Community). Child routes use title template unless they set `title.absolute`. */
export const metadata: Metadata = {
  metadataBase: new URL('https://lagunabeachtennisacademy.com'),
  title: {
    default: 'Laguna Beach Tennis Academy | Tennis, as it should be taught.',
    template: '%s | Laguna Beach Tennis Academy',
  },
  description:
    'Movement. Craft. Community. Tennis in Laguna Beach — junior programs, adult training, and high-performance pathway. Official City of Laguna Beach partner. Book a trial.',
  keywords:
    'tennis lessons Laguna Beach, junior tennis programs, adult tennis, Laguna Beach Tennis Academy, private lessons, USTA, tennis camps',
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'LBTA',
  },
  openGraph: {
    title: 'Laguna Beach Tennis Academy | Tennis, as it should be taught.',
    description:
      'Movement. Craft. Community. Tennis in Laguna Beach — programs for juniors and adults. Book a trial.',
    type: 'website',
    images: [{ url: '/images/hero/laguna-horizon.webp', width: 1920, height: 1080, alt: 'Laguna Beach Tennis Academy courts' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Laguna Beach Tennis Academy | Tennis, as it should be taught.',
    description:
      'Movement. Craft. Community. Tennis in Laguna Beach — junior programs, adult training, high-performance pathway.',
    images: ['/images/hero/laguna-horizon.webp'],
  },
  icons: {
    icon: '/icons/icon-192x192.png',
    apple: '/icons/icon-192x192.png',
  },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#FFFFFF' },
    { media: '(prefers-color-scheme: dark)', color: '#0A0A0A' },
  ],
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${dmSans.variable} ${cormorant.variable}`}>
      <head>
        {/* PWA & Mobile Optimization */}
        <link rel="manifest" href="/manifest.json" />
        <link rel="icon" href="/icons/icon-192x192.png" type="image/png" />
        <link rel="apple-touch-icon" href="/icons/icon-192x192.png" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="mobile-web-app-capable" content="yes" />

        {/* Performance Optimizations - fonts self-hosted via next/font */}
        <link rel="dns-prefetch" href="https://www.googletagmanager.com" />
        <link rel="preconnect" href="https://connect.facebook.net" />
        {/* Hero video poster = LCP; preload small poster so it paints immediately */}
        <link rel="preload" as="image" href="/images/hero/hero-poster.webp" fetchPriority="high" />

        {/* Schema Markup */}
        <OrganizationSchema />
        <ReviewSchema />
      </head>
      <body className={`${dmSans.className} flex flex-col min-h-screen overflow-x-hidden`}>
        {/* Skip to main content link for accessibility */}
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-[100] focus:px-4 focus:py-2 focus:bg-black focus:text-white focus:rounded-md focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-black"
        >
          Skip to main content
        </a>

        {/* Meta Pixel - afterInteractive for performance */}
        <Script id="meta-pixel" strategy="afterInteractive">
          {`
            !function(f,b,e,v,n,t,s)
            {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
            n.callMethod.apply(n,arguments):n.queue.push(arguments)};
            if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
            n.queue=[];t=b.createElement(e);t.async=!0;
            t.src=v;s=b.getElementsByTagName(e)[0];
            s.parentNode.insertBefore(t,s)}(window,document,'script',
            'https://connect.facebook.net/en_US/fbevents.js');
            fbq('init', '1560970271593544');
            fbq('track', 'PageView');
          `}
        </Script>
        <noscript>
          {/* eslint-disable-next-line @next/next/no-img-element -- Facebook 1x1 tracking pixel; noscript fallback requires img */}
          <img
            height="1"
            width="1"
            style={{ display: 'none' }}
            src="https://www.facebook.com/tr?id=1560970271593544&ev=PageView&noscript=1"
            alt=""
          />
        </noscript>

        {/* Google Analytics 4 */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-VCH0K84TSF"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-VCH0K84TSF', {
              page_path: window.location.pathname,
            });
          `}
        </Script>
        
        <ConditionalLayout>
          {children}
        </ConditionalLayout>
        
        {/* Exit Intent Popup for Lead Capture */}
        <ExitIntentPopupLoader />
      </body>
    </html>
  )
}
