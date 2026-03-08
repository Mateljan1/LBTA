import type { Metadata } from 'next'
import Script from 'next/script'

export const metadata: Metadata = {
  title: 'Junior Tennis Trial | Ages 3-17 | Laguna Beach Tennis Academy',
  description:
    'Book a free junior tennis trial at LBTA. Programs from Little Stars (age 3) through High Performance. Laguna Beach, CA.',
  openGraph: {
    title: 'Junior Tennis Trial | Ages 3-17 | Laguna Beach Tennis Academy',
    description:
      'Book a free junior tennis trial at LBTA. Programs from Little Stars (age 3) through High Performance. Laguna Beach, CA.',
    type: 'website',
    url: 'https://lagunabeachtennisacademy.com/junior-trial',
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

export default function JuniorTrialLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <Script
        id="fb-pixel-junior"
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
