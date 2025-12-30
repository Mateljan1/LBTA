'use client'

import { Phone } from 'lucide-react'

export default function FloatingCallButton() {
  return (
    <a
      href="tel:9494646645"
      className="
        fixed bottom-24 right-4 z-40
        md:hidden
        w-14 h-14
        bg-black text-white
        rounded-full
        flex items-center justify-center
        shadow-lg shadow-black/20
        hover:bg-gray-800
        active:scale-95
        transition-all duration-200
      "
      aria-label="Call (949) 464-6645"
    >
      <Phone className="w-6 h-6" />
    </a>
  )
}

