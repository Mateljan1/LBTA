import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Winter 2026 Junior Tennis Registration | $50 OFF | Laguna Beach Tennis Academy',
  description: 'Register for Winter 2026 junior tennis programs. Ages 3-18, ATP/WTA coaching, small groups. $50 off by December 15th. 13-week session starts January 6.',
  keywords: 'junior tennis Laguna Beach, kids tennis Winter 2026, youth tennis program, tennis registration, ATP coaching juniors, college tennis recruitment',
  openGraph: {
    title: 'Winter 2026 Junior Tennis - $50 OFF by Dec 15th',
    description: 'ATP/WTA coaching for ages 3-18. Small groups, proven results. Register by December 15th and save $50.',
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
      {/* Meta Pixel for Landing Page */}
      <script
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
