import type { Metadata, Viewport } from 'next'
import { Inter, Montserrat, Cormorant_Garamond } from 'next/font/google'
import Script from 'next/script'
import './globals.css'
import ConditionalLayout from '@/components/layout/ConditionalLayout'
import Chatbot from '@/components/ui/Chatbot'

const inter = Inter({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-inter',
  display: 'swap',
  preload: true,
  adjustFontFallback: true,
})

const montserrat = Montserrat({
  subsets: ['latin'],
  weight: ['500', '600', '700', '800'],
  variable: '--font-montserrat',
  display: 'swap',
  preload: true,
  adjustFontFallback: true,
})

const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-cormorant',
  display: 'optional',
  preload: true,
  adjustFontFallback: true,
})

export const metadata: Metadata = {
  title: 'Championship Tennis Training in Laguna Beach | Laguna Beach Tennis Academy',
  description: 'ATP/WTA coaching for ages 3-18 and adults. 20+ D1 college placements. Official City of Laguna Beach tennis partner since 2020. Free trial available.',
  keywords: 'tennis lessons Laguna Beach, ATP coaching, junior tennis academy, college tennis recruitment, D1 placement, private tennis lessons, USTA tennis',
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'LBTA',
  },
  openGraph: {
    title: 'Laguna Beach Tennis Academy | Excellence Built Here',
    description: 'ATP/WTA coaching for ages 3 to professional. Small by design.',
    type: 'website',
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
    <html lang="en" className={`${inter.variable} ${montserrat.variable} ${cormorant.variable}`}>
      <head>
        {/* PWA & Mobile Optimization */}
        <link rel="manifest" href="/manifest.json" />
        <link rel="apple-touch-icon" href="/icons/icon-192x192.png" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="mobile-web-app-capable" content="yes" />

        {/* Performance Optimizations */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://use.typekit.net" />
        <link rel="preconnect" href="https://qtrypzzcjebvfcihiynt.supabase.co" />
        <link rel="dns-prefetch" href="https://www.googletagmanager.com" />
      </head>
      <body className="flex flex-col min-h-screen">
        {/* Google Analytics - Optimized with Next.js Script */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-XXXXXXXXXX');
          `}
        </Script>

        <ConditionalLayout>
          {children}
        </ConditionalLayout>
        <Chatbot />
      </body>
    </html>
  )
}
