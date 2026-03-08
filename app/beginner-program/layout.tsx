import type { Metadata } from 'next'
import Script from 'next/script'

export const metadata: Metadata = {
  title: 'Beginner Tennis Program | Start Playing Today | LBTA',
  description:
    'New to tennis? LBTA\'s beginner program teaches strokes, footwork, serving, and scoring from scratch. Laguna Beach, CA.',
  openGraph: {
    title: 'Beginner Tennis Program | Start Playing Today | LBTA',
    description:
      'New to tennis? LBTA\'s beginner program teaches strokes, footwork, serving, and scoring from scratch. Laguna Beach, CA.',
    type: 'website',
    url: 'https://lagunabeachtennisacademy.com/beginner-program',
    images: [
      {
        url: '/images/hero/laguna-horizon.webp',
        width: 1920,
        height: 1080,
        alt: 'Laguna Beach Tennis Academy',
      },
    ],
  },
}

export default function BeginnerProgramLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <Script
        id="fb-pixel-beginner"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
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
          `,
        }}
      />
      {children}
    </>
  )
}
