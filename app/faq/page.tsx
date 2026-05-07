import type { Metadata } from 'next'
import { FAQSchema } from '@/components/SEOSchemas'
import { BreadcrumbListSchema } from '@/app/schema'
import FAQInteractive from './FAQInteractive'
import faqData from '@/data/faq.json'

export const metadata: Metadata = {
  alternates: { canonical: '/faq' },
  title: 'Tennis Training FAQ',
  description: 'Straight answers about costs ($150K-300K for 10-year pathway), college success rates (60% for committed players), and what makes LBTA different. No sugar-coating.',
  keywords: 'tennis training cost, D1 tennis scholarship, tennis academy FAQ, college tennis recruitment, ATP tennis coaching',
  openGraph: {
    title: 'Tennis Training FAQ | Laguna Beach Tennis Academy',
    description: 'Straight answers about costs, college success rates, and what makes LBTA different.',
    type: 'website',
    images: [{ url: '/images/hero/laguna-horizon.webp', width: 1920, height: 1080, alt: 'Laguna Beach Tennis Academy' }],
  },
}

export default function FAQPage() {
  const faqs = faqData as Array<{ id: string; question: string; answer: string; category?: string; icon?: string }>
  return (
    <>
      <FAQSchema />
      <BreadcrumbListSchema items={[
        { name: 'Home', href: '/' },
        { name: 'FAQ' },
      ]} />
      <FAQInteractive faqs={faqs} />
    </>
  )
}
