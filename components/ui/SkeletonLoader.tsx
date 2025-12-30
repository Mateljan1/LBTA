'use client'

// Skeleton loader components for perceived performance

export function ProgramCardSkeleton() {
  return (
    <div className="bg-white rounded-lg border border-black/5 overflow-hidden animate-pulse">
      {/* Header */}
      <div className="p-6 border-b border-black/5">
        <div className="flex justify-between items-start mb-4">
          <div>
            <div className="h-6 w-40 bg-gray-200 rounded mb-2" />
            <div className="h-4 w-24 bg-gray-100 rounded" />
          </div>
          <div className="h-5 w-5 bg-gray-200 rounded" />
        </div>
        <div className="h-4 w-32 bg-gray-100 rounded" />
      </div>
      
      {/* Body */}
      <div className="p-6 space-y-3">
        <div className="h-4 w-full bg-gray-100 rounded" />
        <div className="h-4 w-3/4 bg-gray-100 rounded" />
        <div className="h-4 w-1/2 bg-gray-100 rounded" />
      </div>
      
      {/* Footer */}
      <div className="p-6 border-t border-black/5 flex justify-between items-center">
        <div className="h-6 w-20 bg-gray-200 rounded" />
        <div className="h-10 w-32 bg-gray-200 rounded-full" />
      </div>
    </div>
  )
}

export function CampCardSkeleton() {
  return (
    <div className="bg-white rounded-lg border border-black/5 overflow-hidden animate-pulse">
      {/* Image placeholder */}
      <div className="aspect-[16/9] bg-gray-200" />
      
      {/* Content */}
      <div className="p-6 space-y-3">
        <div className="h-4 w-20 bg-gray-100 rounded" />
        <div className="h-6 w-3/4 bg-gray-200 rounded" />
        <div className="h-4 w-full bg-gray-100 rounded" />
        <div className="h-4 w-2/3 bg-gray-100 rounded" />
        <div className="flex justify-between items-center pt-4">
          <div className="h-5 w-16 bg-gray-200 rounded" />
          <div className="h-8 w-24 bg-gray-200 rounded-full" />
        </div>
      </div>
    </div>
  )
}

export function TestimonialSkeleton() {
  return (
    <div className="bg-white rounded-lg p-6 animate-pulse">
      <div className="flex gap-1 mb-4">
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="h-4 w-4 bg-gray-200 rounded" />
        ))}
      </div>
      <div className="space-y-2 mb-4">
        <div className="h-4 w-full bg-gray-100 rounded" />
        <div className="h-4 w-full bg-gray-100 rounded" />
        <div className="h-4 w-2/3 bg-gray-100 rounded" />
      </div>
      <div className="flex items-center gap-3">
        <div className="h-10 w-10 bg-gray-200 rounded-full" />
        <div>
          <div className="h-4 w-24 bg-gray-200 rounded mb-1" />
          <div className="h-3 w-16 bg-gray-100 rounded" />
        </div>
      </div>
    </div>
  )
}

export function HeroSkeleton() {
  return (
    <div className="relative min-h-[70vh] bg-gray-200 animate-pulse">
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="h-4 w-32 bg-gray-300 rounded mx-auto" />
          <div className="h-12 w-64 bg-gray-300 rounded mx-auto" />
          <div className="h-6 w-48 bg-gray-300 rounded mx-auto" />
          <div className="h-12 w-40 bg-gray-300 rounded-full mx-auto mt-8" />
        </div>
      </div>
    </div>
  )
}

export function ScheduleTableSkeleton() {
  return (
    <div className="bg-white rounded-lg border border-black/5 overflow-hidden animate-pulse">
      <div className="p-6 border-b border-black/5">
        <div className="h-6 w-48 bg-gray-200 rounded" />
      </div>
      <div className="divide-y divide-black/5">
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="p-4 flex justify-between items-center">
            <div className="flex-1 space-y-2">
              <div className="h-5 w-40 bg-gray-200 rounded" />
              <div className="h-4 w-24 bg-gray-100 rounded" />
            </div>
            <div className="h-5 w-16 bg-gray-200 rounded" />
          </div>
        ))}
      </div>
    </div>
  )
}

// Generic skeleton shapes
export function Skeleton({ 
  className = '', 
  variant = 'rectangular' 
}: { 
  className?: string
  variant?: 'rectangular' | 'circular' | 'text' 
}) {
  const baseClasses = 'animate-pulse bg-gray-200'
  const variantClasses = {
    rectangular: 'rounded',
    circular: 'rounded-full',
    text: 'rounded h-4'
  }
  
  return (
    <div className={`${baseClasses} ${variantClasses[variant]} ${className}`} />
  )
}

