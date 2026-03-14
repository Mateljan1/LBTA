import type { Metadata } from 'next'
import { FAQSchema } from '@/components/SEOSchemas'
import FAQInteractive from './FAQInteractive'
import faqData from '@/data/faq.json'

export const metadata: Metadata = {
  title: 'FAQ - Honest Answers About Tennis Training | LBTA',
  description: 'Straight answers about costs ($150K-300K for 10-year pathway), college success rates (60% for committed players), and what makes LBTA different. No sugar-coating.',
  keywords: 'tennis training cost, D1 tennis scholarship, tennis academy FAQ, college tennis recruitment, ATP tennis coaching',
}

export default function FAQPage() {
  const faqs = faqData as Array<{ id: string; question: string; answer: string; category?: string; icon?: string }>
  return (
    <>
      <FAQSchema />
      <FAQInteractive faqs={faqs} />
    </>
  )
}
