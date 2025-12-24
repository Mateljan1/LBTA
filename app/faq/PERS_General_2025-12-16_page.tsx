import type { Metadata } from 'next'
import FAQInteractive from './FAQInteractive'

export const metadata: Metadata = {
  title: 'FAQ - Honest Answers About Tennis Training | LBTA',
  description: 'Straight answers about costs ($150K-300K for 10-year pathway), college success rates (60% for committed players), and what makes LBTA different. No sugar-coating.',
  keywords: 'tennis training cost, D1 tennis scholarship, tennis academy FAQ, college tennis recruitment, ATP tennis coaching',
}

export default function FAQPage() {
  return <FAQInteractive />
}
