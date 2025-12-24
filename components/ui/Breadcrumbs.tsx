import Link from 'next/link'
import { ChevronRight, Home } from 'lucide-react'
import Script from 'next/script'

interface BreadcrumbItem {
  label: string
  href?: string
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[]
}

export default function Breadcrumbs({ items }: BreadcrumbsProps) {
  // Generate BreadcrumbList schema
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Home",
        "item": "https://lagunabeachtennisacademy.com"
      },
      ...items.map((item, index) => ({
        "@type": "ListItem",
        "position": index + 2,
        "name": item.label,
        "item": item.href ? `https://lagunabeachtennisacademy.com${item.href}` : undefined
      }))
    ]
  }

  return (
    <>
      <Script
        id="breadcrumb-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      
      <nav aria-label="Breadcrumb" className="max-w-7xl mx-auto px-6 py-4 md:py-6">
        <ol className="flex items-center flex-wrap gap-1 text-[13px] font-sans">
          <li className="flex items-center">
            <Link 
              href="/" 
              className="flex items-center gap-1.5 text-black/50 hover:text-lbta-orange transition-colors"
            >
              <Home className="w-3.5 h-3.5" />
              <span className="sr-only md:not-sr-only">Home</span>
            </Link>
          </li>
          
          {items.map((item, index) => {
            const isLast = index === items.length - 1
            
            return (
              <li key={item.label} className="flex items-center gap-1">
                <ChevronRight className="w-3.5 h-3.5 text-black/30" />
                {item.href && !isLast ? (
                  <Link 
                    href={item.href}
                    className="text-black/50 hover:text-lbta-orange transition-colors"
                  >
                    {item.label}
                  </Link>
                ) : (
                  <span className="text-black/80 font-medium">
                    {item.label}
                  </span>
                )}
              </li>
            )
          })}
        </ol>
      </nav>
    </>
  )
}

