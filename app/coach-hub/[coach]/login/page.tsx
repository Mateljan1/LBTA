'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams, useParams } from 'next/navigation'

const KNOWN_COACHES: Record<string, { name: string; firstName: string }> = {
  allison: { name: 'Allison Cronk', firstName: 'Allison' },
  andrew: { name: 'Andrew Mateljan', firstName: 'Andrew' },
  peter: { name: 'Peter de Frantz', firstName: 'Peter' },
}

/**
 * Allow only relative paths under /coach-hub/{slug} to prevent open redirect (OWASP A01).
 */
function safeRedirectTarget(raw: string | null, slug: string): string {
  const fallback = `/coach-hub/${slug}`
  if (!raw || typeof raw !== 'string') return fallback
  const path = raw.trim()
  if (path === '' || path.startsWith('//')) return fallback
  try {
    const u = new URL(path, 'http://localhost')
    if (u.origin !== 'http://localhost' || u.protocol !== 'http:') return fallback
    const resolved = u.pathname
    if (!resolved.startsWith(`/coach-hub/${slug}`) || resolved.includes('..')) {
      return fallback
    }
    return resolved
  } catch {
    return fallback
  }
}

export default function PerCoachLoginPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const params = useParams<{ coach: string }>()
  const slug = (params?.coach ?? '').toLowerCase()
  const next = safeRedirectTarget(searchParams.get('next'), slug)
  const coach = KNOWN_COACHES[slug]

  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  // Validate slug client-side; show 404-ish state for unknown coaches.
  useEffect(() => {
    if (slug && !coach) {
      setError('Unknown coach.')
    }
  }, [slug, coach])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!coach) return
    setError(null)
    setSubmitting(true)
    try {
      const res = await fetch(`/api/coach-hub/${slug}/auth`, {
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
        <p className="font-sans text-eyebrow text-brand-victoria-cove mb-3">
          Coach Hub
        </p>
        <h1 className="font-headline text-brand-pacific-dusk text-2xl mb-1">
          {coach ? `${coach.firstName}'s view` : 'Sign in'}
        </h1>
        <p className="font-sans text-brand-pacific-dusk/70 text-sm mb-8">
          {coach
            ? 'Enter your coach password to access today\u2019s plan.'
            : 'This coach view is not available.'}
        </p>
        <form onSubmit={handleSubmit} className="space-y-4">
          <label htmlFor="per-coach-password" className="sr-only">
            Password
          </label>
          <input
            id="per-coach-password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            autoComplete="current-password"
            required
            disabled={submitting || !coach}
            className="w-full px-4 py-3 border border-black/15 rounded-[2px] font-sans text-brand-pacific-dusk placeholder:text-black/40 focus:outline-none focus:ring-2 focus:ring-brand-victoria-cove focus:ring-offset-2 min-h-[48px]"
          />
          {error && (
            <p className="font-sans text-sm text-lbta-red" role="alert">
              {error}
            </p>
          )}
          <button
            type="submit"
            disabled={submitting || !coach}
            className="w-full inline-flex items-center justify-center bg-black text-white font-sans text-sm font-medium tracking-[2.5px] uppercase min-h-[48px] px-10 py-4 rounded-[2px] transition-all duration-300 ease-out hover:bg-gray-800 hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-black/30 focus:ring-offset-2 disabled:opacity-60 disabled:pointer-events-none"
          >
            {submitting ? 'Signing in…' : 'Sign in'}
          </button>
        </form>
      </div>
    </div>
  )
}
