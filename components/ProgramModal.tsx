'use client'

import Link from 'next/link'
import { X } from 'lucide-react'

interface Program {
  name: string
  day: string
  time: string
  ages: string
  duration: string
  price: string
  location: string
  coach: string
  category: string
}

interface ProgramModalProps {
  program: Program | null
  onClose: () => void
}

export default function ProgramModal({ program, onClose }: ProgramModalProps) {
  if (!program) return null
  
  return (
    <div 
      className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div 
        className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 relative"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-full transition-colors"
          aria-label="Close"
        >
          <X className="w-5 h-5 text-black/60" />
        </button>
        
        <h3 className="font-serif text-[28px] font-semibold text-black mb-6 pr-8">
          {program.name}
        </h3>
        
        <div className="space-y-3 mb-8">
          <div className="flex justify-between">
            <span className="font-sans text-[15px] text-black/60">Location:</span>
            <span className="font-sans text-[15px] text-black font-semibold">{program.location}</span>
          </div>
          <div className="flex justify-between">
            <span className="font-sans text-[15px] text-black/60">Time:</span>
            <span className="font-sans text-[15px] text-black font-semibold">{program.day} · {program.time}</span>
          </div>
          <div className="flex justify-between">
            <span className="font-sans text-[15px] text-black/60">Ages:</span>
            <span className="font-sans text-[15px] text-black">{program.ages}</span>
          </div>
          <div className="flex justify-between">
            <span className="font-sans text-[15px] text-black/60">Duration:</span>
            <span className="font-sans text-[15px] text-black">{program.duration}</span>
          </div>
          <div className="flex justify-between">
            <span className="font-sans text-[15px] text-black/60">Coach:</span>
            <span className="font-sans text-[15px] text-black">{program.coach}</span>
          </div>
          <div className="flex justify-between pt-3 border-t border-gray-200">
            <span className="font-sans text-[15px] text-black/60">Price:</span>
            <span className="font-sans text-[18px] text-lbta-orange font-bold">{program.price}</span>
          </div>
        </div>
        
        <Link
          href="/book"
          className="block w-full bg-lbta-red hover:bg-lbta-orange text-white text-center font-sans font-semibold text-[16px] py-4 rounded-lg transition-all duration-200"
        >
          Book or Try →
        </Link>
      </div>
    </div>
  )
}
