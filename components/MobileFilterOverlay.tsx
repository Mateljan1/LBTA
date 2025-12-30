'use client'

import { X } from 'lucide-react'

interface MobileFilterOverlayProps {
  isOpen: boolean
  onClose: () => void
  selectedCategory: string
  selectedLocation: string
  selectedDays: string[]
  onCategoryChange: (cat: string) => void
  onLocationChange: (loc: string) => void
  onDaysChange: (days: string[]) => void
  categories: string[]
  locations: string[]
}

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']

export default function MobileFilterOverlay({
  isOpen,
  onClose,
  selectedCategory,
  selectedLocation,
  selectedDays,
  onCategoryChange,
  onLocationChange,
  onDaysChange,
  categories,
  locations,
}: MobileFilterOverlayProps) {
  if (!isOpen) return null
  
  const handleDayToggle = (day: string) => {
    const newDays = selectedDays.includes(day)
      ? selectedDays.filter(d => d !== day)
      : [...selectedDays, day]
    onDaysChange(newDays)
  }
  
  const handleClearAll = () => {
    onCategoryChange('all')
    onLocationChange('all')
    onDaysChange([])
  }
  
  const handleApply = () => {
    onClose()
  }
  
  return (
    <div
      className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60] flex items-end md:hidden"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-t-3xl shadow-2xl w-full animate-slide-up max-h-[85vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between rounded-t-3xl">
          <h3 className="font-serif text-[20px] font-semibold text-black">
            Filters
          </h3>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            aria-label="Close filters"
          >
            <X className="w-5 h-5 text-black/60" />
          </button>
        </div>
        
        <div className="px-6 py-6 space-y-6">
          {/* Program Type Filter */}
          <div>
            <label className="font-sans text-[14px] font-semibold text-black/70 mb-3 block uppercase tracking-wide">
              Program Type
            </label>
            <div className="grid grid-cols-2 gap-3">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => onCategoryChange(cat)}
                  className={`px-4 py-3.5 rounded-xl font-sans text-[15px] font-medium transition-all duration-200 min-h-[48px] ${
                    selectedCategory === cat
                      ? 'bg-lbta-orange text-white shadow-md'
                      : 'bg-[#FAF8F3] text-black/70 hover:bg-gray-200'
                  }`}
                >
                  {cat === 'all' ? 'All Programs' : `${cat}`}
                </button>
              ))}
            </div>
          </div>
          
          {/* Location Filter */}
          <div>
            <label className="font-sans text-[14px] font-semibold text-black/70 mb-3 block uppercase tracking-wide">
              Location
            </label>
            <div className="space-y-2">
              {[
                { value: 'all', label: 'All Locations' },
                { value: 'moulton', label: 'Moulton Meadows' },
                { value: 'alta', label: 'Alta Laguna Park' },
                { value: 'lbhs', label: 'Laguna Beach High School' }
              ].map((loc) => (
                <button
                  key={loc.value}
                  onClick={() => onLocationChange(loc.value)}
                  className={`w-full px-4 py-3.5 rounded-xl font-sans text-[15px] font-medium transition-all duration-200 text-left min-h-[48px] ${
                    selectedLocation === loc.value
                      ? 'bg-lbta-red text-white shadow-md'
                      : 'bg-[#FAF8F3] text-black/70 hover:bg-gray-200'
                  }`}
                >
                  {loc.label}
                </button>
              ))}
            </div>
          </div>
          
          {/* Day Filter */}
          <div>
            <label className="font-sans text-[14px] font-semibold text-black/70 mb-3 block uppercase tracking-wide">
              Days (optional)
            </label>
            <div className="grid grid-cols-2 gap-2">
              {DAYS.map((day) => (
                <button
                  key={day}
                  onClick={() => handleDayToggle(day)}
                  className={`px-3 py-3 rounded-xl font-sans text-[14px] font-medium transition-all duration-200 min-h-[48px] ${
                    selectedDays.includes(day)
                      ? 'bg-lbta-orange text-white shadow-sm'
                      : 'bg-[#FAF8F3] text-black/70 hover:bg-gray-200'
                  }`}
                >
                  {day}
                </button>
              ))}
            </div>
          </div>
        </div>
        
        {/* Action Buttons */}
        <div className="sticky bottom-0 bg-white border-t border-gray-200 px-6 py-4 flex gap-3">
          <button
            onClick={handleClearAll}
            className="flex-1 border-2 border-lbta-red text-lbta-red hover:bg-lbta-red/5 font-sans font-semibold text-[16px] py-4 rounded-full transition-all duration-200 min-h-[48px]"
          >
            Clear All
          </button>
          <button
            onClick={handleApply}
            className="flex-1 bg-lbta-red hover:bg-lbta-orange text-white font-sans font-semibold text-[16px] py-4 rounded-full transition-all duration-200 shadow-md min-h-[48px]"
          >
            Apply Filters
          </button>
        </div>
      </div>
    </div>
  )
}
