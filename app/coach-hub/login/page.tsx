'use client'

import { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'

/** Allow only relative paths under /coach-hub to prevent open redirect and path traversal (OWASP A01). */
function safeRedirectTarget(raw: string | null): string {
  if (!raw || typeof raw !== 'string') return '/coach-hub'
  const path = raw.trim()
  if (path === '' || path.startsWith('//')) return '/coach-hub'
  try {
    const u = new URL(path, 'http://localhost')
    if (u.origin !== 'http://localhost' || u.protocol !== 'http:') return '/coach-hub'
    const resolved = u.pathname
    if (!resolved.startsWith('/coach-hub') || resolved.includes('..')) return '/coach-hub'
    return resolved
  } catch {
    return '/coach-hub'
  }
}

export default function CoachHubLoginPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const next = safeRedirectTarget(searchParams.get('next'))

  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setSubmitting(true)
    try {
      const res = await fetch('/api/coach-hub/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) {
        setError(data.error ?? 'Login failed')
        return
      }
      router.push(next)
      router.refresh()
    } catch {
      setError('Something went wrong')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-brand-morning-light flex flex-col items-center justify-center px-6">
      <div className="w-full max-w-sm">
        <h1 className="font-headline text-brand-pacific-dusk text-2xl mb-1">
          Coach Hub
        </h1>
        <p className="font-sans text-brand-pacific-dusk/70 text-sm mb-8">
          Sign in to access the plan generator and resources.
        </p>
        <form onSubmit={handleSubmit} className="space-y-4">
          <label htmlFor="coach-hub-password" className="sr-only">
            Password
          </label>
          <input
            id="coach-hub-password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            autoComplete="current-password"
            required
            className="w-full px-4 py-3 border border-black/15 rounded-[2px] font-sans text-brand-pacific-dusk placeholder:text-black/40 focus:outline-none focus:ring-2 focus:ring-brand-victoria-cove focus:ring-offset-2 min-h-[48px]"
            disabled={submitting}
          />
          {error && (
            <p className="font-sans text-sm text-red-600" role="alert">
              {error}
            </p>
          )}
          <button
            type="submit"
            disabled={submitting}
            className="w-full inline-flex items-center justify-center bg-black text-white font-sans text-sm font-medium tracking-[2.5px] uppercase min-h-[48px] px-10 py-4 rounded-[2px] transition-all duration-300 ease-out hover:bg-gray-800 hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-black/30 focus:ring-offset-2 disabled:opacity-60 disabled:pointer-events-none"
          >
            {submitting ? 'Signing in…' : 'Sign in'}
          </button>
        </form>
      </div>
    </div>
  )
}
