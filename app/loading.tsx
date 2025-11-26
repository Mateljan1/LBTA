export default function Loading() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-sand-50">
      <div className="text-center">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-clay-800 mb-4"></div>
        <p className="text-clay-600 font-sans text-sm uppercase tracking-wider">
          Loading...
        </p>
      </div>
    </div>
  )
}

