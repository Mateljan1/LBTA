'use client'

import { useState, useMemo } from 'react'
import LuxuryYearModal from '@/components/LuxuryYearModal'
import { getUtrCircuitModalData } from '@/lib/utr-match-play'

type Variant = 'hero' | 'footer'

function buttonClass(variant: Variant): string {
  if (variant === 'hero') {
    return 'inline-flex items-center justify-center bg-white text-black font-sans text-sm font-medium tracking-[2.5px] uppercase min-h-[48px] px-10 py-4 rounded-[2px] transition-all duration-300 ease-out hover:bg-gray-100 hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-white/40 focus:ring-offset-2 focus:ring-offset-brand-deep-water'
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
