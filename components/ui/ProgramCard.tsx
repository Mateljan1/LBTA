import Link from 'next/link'
import { ArrowRight } from 'lucide-react'

interface ProgramCardProps {
  title: string
  description: string
  features: string[]
  href: string
}

export default function ProgramCard({ title, description, features, href }: ProgramCardProps) {
  return (
    <div className="card-luxury p-8 md:p-10 h-full flex flex-col">
      <h3 className="text-2xl md:text-3xl font-display font-light tracking-tight text-clay-900 mb-4">
        {title}
      </h3>
      <p className="body-text mb-6 flex-grow">
        {description}
      </p>
      <ul className="space-y-3 mb-8">
        {features.map((feature, index) => (
          <li key={index} className="flex items-start space-x-3 text-clay-700">
            <span className="text-sage-600 mt-1">•</span>
            <span className="text-sm md:text-base">{feature}</span>
          </li>
        ))}
      </ul>
      <Link
        href={href}
        className="inline-flex items-center space-x-2 text-sm uppercase tracking-wider text-clay-800 hover:text-clay-900 transition-colors group"
      >
        <span>Learn More</span>
        <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
      </Link>
    </div>
  )
}

