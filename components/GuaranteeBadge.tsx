'use client'

import { Shield } from 'lucide-react'

interface GuaranteeBadgeProps {
  variant?: 'light' | 'dark'
  className?: string
}

export default function GuaranteeBadge({ variant = 'light', className = '' }: GuaranteeBadgeProps) {
  const isLight = variant === 'light'
  
  return (
    <div className={`inline-flex items-center gap-2 ${className}`}>
      <Shield className={`w-4 h-4 ${isLight ? 'text-green-600' : 'text-green-400'}`} />
      <span className={`font-sans text-[13px] font-medium ${isLight ? 'text-black/70' : 'text-white/80'}`}>
        30-Day Money-Back Guarantee
      </span>
    </div>
  )
}

