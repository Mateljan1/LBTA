import type { Metadata } from 'next'
import { Inter, Montserrat, Cormorant_Garamond } from 'next/font/google'
import './globals.css'
import ConditionalLayout from '@/components/layout/ConditionalLayout'

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
  openGraph: {
    title: 'Laguna Beach Tennis Academy | Excellence Built Here',
    description: 'ATP/WTA coaching for ages 3 to professional. Small by design.',
    type: 'website',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${inter.variable} ${montserrat.variable} ${cormorant.variable}`}>
      <head>
        {/* Google Analytics */}
        <script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"></script>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-XXXXXXXXXX');
            `,
          }}
        />
      </head>
      <body className="flex flex-col min-h-screen">
        <ConditionalLayout>
          {children}
        </ConditionalLayout>
      </body>
    </html>
  )
}
