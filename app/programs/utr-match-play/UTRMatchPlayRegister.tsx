'use client'

import { useState, useMemo } from 'react'
import LuxuryYearModal from '@/components/LuxuryYearModal'
import { getUtrCircuitModalData } from '@/lib/utr-match-play'

type Variant = 'hero' | 'hero-teal' | 'footer'

function buttonClass(variant: Variant): string {
  if (variant === 'hero') {
    return 'inline-flex items-center justify-center bg-white text-black font-sans text-sm font-medium tracking-[2.5px] uppercase min-h-[48px] px-10 py-4 rounded-[2px] transition-all duration-300 ease-out hover:bg-gray-100 hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-white/40 focus:ring-offset-2 focus:ring-offset-brand-deep-water'
  }
  if (variant === 'hero-teal') {
    return 'inline-flex items-center justify-center rounded-lg bg-brand-victoria-cove px-7 font-sans text-[15px] font-bold text-white min-h-[48px] transition-opacity hover:opacity-[0.92] focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-victoria-cove focus-visible:ring-offset-2 focus-visible:ring-offset-brand-deep-water'
  }
  return 'btn-primary'
}

/**
 * Opens LuxuryYearModal for UTR Match Play Series. Mount once per CTA (hero + footer each mount their own modal instance).
 */
export default function UTRMatchPlayRegister({
  variant,
  label = 'Register for Season 1',
}: {
  variant: Variant
  label?: string
}) {
  const [open, setOpen] = useState(false)
  const modalData = useMemo(() => getUtrCircuitModalData(), [])

  return (
    <>
      <button type="button" onClick={() => setOpen(true)} className={buttonClass(variant)}>
        {label}
      </button>
      <LuxuryYearModal
        isOpen={open}
        onClose={() => setOpen(false)}
        type="utr-circuit"
        data={modalData}
        season="spring"
      />
    </>
  )
}
