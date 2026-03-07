import type { Metadata } from 'next'
import Script from 'next/script'

export const metadata: Metadata = {
  title: 'Junior Tennis Registration | Laguna Beach Tennis Academy',
  description: 'Register for junior tennis programs. Ages 3-18, ATP/WTA coaching, small groups. Quarterly sessions with early bird pricing available.',
  keywords: 'junior tennis Laguna Beach, kids tennis program, youth tennis program, tennis registration, ATP coaching juniors, college tennis recruitment',
  openGraph: {
    title: 'Junior Tennis Registration | Laguna Beach Tennis Academy',
    description: 'Register for junior tennis programs. Ages 3-18, ATP/WTA coaching, small groups. Quarterly sessions with early bird pricing available.',
    type: 'website',
    url: 'https://lagunabeachtennisacademy.com/junior-trial',
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
