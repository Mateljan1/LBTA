'use client'

import { events } from '@/lib/analytics'

type Props = {
  href: string
  location: string
  className?: string
  'aria-label'?: string
  children: React.ReactNode
}

/** Footer / static shells: fire GA4 phone_click with placement. */
export default function TrackedPhoneLink({ href, location, className, 'aria-label': ariaLabel, children }: Props) {
  return (
    <a
      href={href}
      className={className}
      aria-label={ariaLabel}
      onClick={() => events.phoneClick(location)}
    >
      {children}
    </a>
  )
}
