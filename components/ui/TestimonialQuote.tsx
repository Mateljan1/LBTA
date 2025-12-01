import AnimatedSection from './AnimatedSection'

interface TestimonialQuoteProps {
  quote: string
  author: string
  role: string
  className?: string
}

export default function TestimonialQuote({ quote, author, role, className = '' }: TestimonialQuoteProps) {
  return (
    <AnimatedSection className={className}>
      <div className="border-l-2 border-lbta-burnt pl-8 py-4">
        <p className="text-xl md:text-2xl font-serif font-light text-gray-600 italic mb-6 leading-relaxed">
          "{quote}"
        </p>
        <div>
          <p className="text-sm font-sans font-medium text-lbta-charcoal">
            {author}
          </p>
          <p className="text-xs font-sans text-gray-500 mt-1">
            {role}
          </p>
        </div>
      </div>
    </AnimatedSection>
  )
}

