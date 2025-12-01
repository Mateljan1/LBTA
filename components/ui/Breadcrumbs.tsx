import Link from 'next/link'
import { ChevronRight } from 'lucide-react'

interface BreadcrumbItem {
  label: string
  href?: string
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[]
}

export default function Breadcrumbs({ items }: BreadcrumbsProps) {
  return (
    <nav aria-label="Breadcrumb" className="container-lbta py-6">
      <ol className="flex items-center space-x-2 text-sm font-sans">
        <li>
          <Link 
            href="/" 
            className="text-gray-500 hover:text-lbta-charcoal transition-colors"
          >
            Home
          </Link>
        </li>
        
        {items.map((item, index) => {
          const isLast = index === items.length - 1
          
          return (
            <li key={item.label} className="flex items-center space-x-2">
              <ChevronRight className="w-4 h-4 text-gray-400" />
              {item.href && !isLast ? (
                <Link 
                  href={item.href}
                  className="text-gray-500 hover:text-lbta-charcoal transition-colors"
                >
                  {item.label}
                </Link>
              ) : (
                <span className="text-lbta-charcoal font-medium">
                  {item.label}
                </span>
              )}
            </li>
          )
        })}
      </ol>
    </nav>
  )
}

