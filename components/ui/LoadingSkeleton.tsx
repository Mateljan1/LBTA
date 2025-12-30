export default function LoadingSkeleton() {
  return (
    <div className="min-h-screen bg-white pt-40">
      <div className="container-narrow animate-pulse">
        {/* Hero skeleton */}
        <div className="text-center mb-20">
          <div className="h-4 bg-gray-200 rounded w-32 mx-auto mb-6"></div>
          <div className="h-16 bg-gray-200 rounded w-3/4 mx-auto mb-4"></div>
          <div className="h-6 bg-gray-200 rounded w-2/3 mx-auto"></div>
        </div>
        
        {/* Grid skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[1,2,3].map(i => (
            <div key={i} className="space-y-4">
              <div className="aspect-[4/3] bg-gray-200 rounded"></div>
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

