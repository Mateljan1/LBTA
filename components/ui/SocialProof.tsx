import AnimatedSection from './AnimatedSection'

const trustBadges = [
  { text: 'Official City Partner', year: 'Since 2020' },
  { text: 'USPTA Certified', year: 'Elite Level' },
  { text: 'ATP/WTA Experience', year: '50+ Years Combined' },
  { text: '20+ D1 Placements', year: 'Proven Track Record' },
]

export default function SocialProof() {
  return (
    <section className="py-12 bg-white border-y border-gray-200">
      <div className="container-lbta">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {trustBadges.map((badge, index) => (
            <AnimatedSection key={badge.text} delay={index * 0.1}>
              <div className="text-center">
                <p className="text-sm font-sans font-medium text-lbta-charcoal mb-1">
                  {badge.text}
                </p>
                <p className="text-xs text-gray-500 font-sans">
                  {badge.year}
                </p>
              </div>
            </AnimatedSection>
          ))}
        </div>
      </div>
    </section>
  )
}

