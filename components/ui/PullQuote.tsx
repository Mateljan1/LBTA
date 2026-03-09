'use client'

interface PullQuoteProps {
  quote: string
  attribution?: string
  /** light = pacific-dusk text on light bg; dark = sandstone/white on dark bg */
  variant?: 'light' | 'dark'
  className?: string
}

export default function PullQuote({
  quote,
  attribution,
  variant = 'light',
  className = '',
}: PullQuoteProps) {
  const isDark = variant === 'dark'
  const quoteClass = isDark
    ? 'font-headline text-xl md:text-2xl italic text-brand-sandstone font-light leading-relaxed'
    : 'font-headline text-xl md:text-2xl italic text-brand-pacific-dusk font-light leading-relaxed'
  const attrClass = isDark
    ? 'font-sans text-body-sm text-white/70 mt-2'
    : 'font-sans text-body-sm text-brand-pacific-dusk/70 mt-2'
  return (
    <blockquote className={`section-quote ${className}`}>
      <p className={quoteClass}>{quote}</p>
      {attribution && <footer className={attrClass}>— {attribution}</footer>}
    </blockquote>
  )
}
