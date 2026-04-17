import type { Metadata } from 'next'

const site = 'https://lagunabeachtennisacademy.com'

export const metadata: Metadata = {
  title: 'Journal',
  description:
    'Notes on training, junior development, adult tennis, and life around the courts in Laguna Beach — from Laguna Beach Tennis Academy.',
  alternates: {
    canonical: '/blog',
    types: {
      'application/rss+xml': `${site}/blog/feed.xml`,
    },
  },
  openGraph: {
    title: 'Journal | Laguna Beach Tennis Academy',
    description:
      'Notes on training, junior development, and tennis in Laguna Beach — from LBTA.',
    type: 'website',
    url: `${site}/blog`,
  },
}

export default function BlogLayout({ children }: { children: React.ReactNode }) {
  return children
}
