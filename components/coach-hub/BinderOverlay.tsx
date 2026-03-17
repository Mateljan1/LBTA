'use client'

import type { CoachHubInitialData } from '@/components/coach-hub/CoachHubClient'

type BinderOverlayProps = {
  initialData: CoachHubInitialData
  coach: string
  season: string
  week: number
  onClose: () => void
}

export function BinderOverlay({ onClose }: BinderOverlayProps) {
  return (
    <div className="fixed inset-0 z-[100] bg-black/50 flex items-center justify-center p-4" role="dialog" aria-modal="true" aria-label="Week Binder">
      <div className="bg-brand-morning-light rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-auto p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="font-headline text-brand-pacific-dusk text-xl">Week Binder — Track E</h2>
          <button
            type="button"
            onClick={onClose}
            className="min-h-[48px] px-4 rounded border border-black/20 font-sans text-sm font-medium"
          >
            Close
          </button>
        </div>
        <p className="font-sans text-sm text-brand-pacific-dusk/70">Binder content will be implemented in Track E.</p>
      </div>
    </div>
  )
}
