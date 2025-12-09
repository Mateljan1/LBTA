import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Foundation 12-Week Beginner Tennis Program | Free Trial | Laguna Beach Tennis Academy',
  description: 'Transform from beginner to confident player in 12 weeks with ATP/WTA coaching. Small groups, video analysis, personalized development. Official City of Laguna Beach partner. Free trial lesson.',
  keywords: 'beginner tennis lessons Laguna Beach, tennis program for beginners, foundation tennis training, ATP coaching beginners, junior tennis program, adult beginner tennis',
  openGraph: {
    title: 'Foundation 12-Week Beginner Tennis Program - Free Trial',
    description: '🎾 Transform into a confident player in just 12 weeks with professional ATP/WTA coaching. Small groups (max 4:1), video analysis, personalized development plan.',
    type: 'website',
    url: 'https://lagunabeachtennisacademy.com/beginner-program',
    images: [
      {
        url: '/og-beginner-program.jpg',
        width: 1200,
        height: 630,
        alt: 'LBTA Foundation 12-Week Beginner Program',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Foundation 12-Week Beginner Tennis Program - Free Trial',
    description: 'Transform into a confident player in 12 weeks with ATP/WTA coaching. Free trial lesson included.',
  },
}

export default function BeginnerProgramLayout({
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
