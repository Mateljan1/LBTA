'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import Image from 'next/image'
import { CHAT_COPY } from '@/lib/chat-copy'

interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
}

export default function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [mounted, setMounted] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  // Ensure component only renders on client
  useEffect(() => {
    setMounted(true)
  }, [])

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  // Focus input when chat opens
  useEffect(() => {
    if (isOpen && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 100)
    }
  }, [isOpen])

  // Add welcome message when chat first opens
  useEffect(() => {
    if (isOpen && messages.length === 0) {
      setMessages([{
        id: 'welcome',
        role: 'assistant',
        content: CHAT_COPY.welcome,
        timestamp: new Date()
      }])
    }
  }, [isOpen, messages.length])

  const sendMessage = useCallback(async () => {
    if (!input.trim() || isLoading) return

    const userMessage: Message = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: input.trim(),
      timestamp: new Date()
    }

    setMessages(prev => {
      const updated = [...prev, userMessage]
      
      // Phase 3: Send pathname for context injection
      const pathname = typeof window !== 'undefined' ? window.location.pathname : undefined
      
      // Use updated array for API call
      fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          message: userMessage.content,
          history: updated.map(m => ({ role: m.role, content: m.content })),
          pathname, // Phase 3: Context injection
        }),
      }).then(async (response) => {
        const data = await response.json().catch(() => ({}))
        const reply = data?.reply ?? data?.error ?? "I apologize, but I couldn't process that request. Please try again or call us at (949) 534-0457."

        if (!response.ok) {
          setMessages(prevMsgs => [...prevMsgs, {
            id: `assistant-${Date.now()}`,
            role: 'assistant',
            content: reply,
            timestamp: new Date()
          }])
          setIsLoading(false)
          return
        }

        const assistantMessage: Message = {
          id: `assistant-${Date.now()}`,
          role: 'assistant',
          content: reply,
          timestamp: new Date()
        }

        setMessages(prevMsgs => [...prevMsgs, assistantMessage])
        setIsLoading(false)
      }).catch((error) => {
        console.error('Chat error:', error)
        setMessages(prevMsgs => [...prevMsgs, {
          id: `error-${Date.now()}`,
          role: 'assistant',
          content: CHAT_COPY.errors.network,
          timestamp: new Date()
        }])
        setIsLoading(false)
      })
      
      return updated
    })
    
    setInput('')
    setIsLoading(true)
  }, [input, isLoading])

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  // Don't render until mounted (prevents hydration issues)
  if (!mounted) return null

  /** Offset above fixed mobile bars (sticky CTA, program actions) — set via CSS vars on :root */
  const mobileChrome =
    'var(--lbta-sticky-cta-h, 0px) + var(--lbta-program-bar-h, 0px)'

  return (
    <>
      {/* Floating Chat Button — clears sticky CTA / program bar + safe area */}
      <div
        className="group/chat relative flex flex-col items-end"
        style={{
          position: 'fixed',
          bottom: `calc(24px + ${mobileChrome} + env(safe-area-inset-bottom, 0px))`,
          right: '24px',
          zIndex: 50,
        }}
      >
        {/* Hover label: "Chat with us" so users immediately recognize the control (best practice: Intercom/Drift-style affordance) */}
        <span
          className="pointer-events-none absolute right-full top-1/2 mr-3 hidden -translate-y-1/2 whitespace-nowrap rounded-md border border-white/10 bg-gradient-to-b from-[#1a2f4a] to-brand-deep-water px-3 py-2 text-xs font-medium tracking-wide text-white shadow-lg opacity-0 ring-1 ring-white/15 transition-opacity duration-200 group-hover/chat:opacity-100 md:block"
          style={{ zIndex: 50 }}
          aria-hidden
        >
          Chat with us
        </span>
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className={`group relative flex h-[60px] w-[60px] min-h-[48px] min-w-[48px] flex-shrink-0 items-center justify-center overflow-hidden rounded-full border-0 shadow-[0_6px_28px_rgba(15,34,55,0.45),inset_0_1px_0_rgba(255,255,255,0.12)] ring-1 ring-white/25 transition-all duration-300 ease-out focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-victoria-cove focus-visible:ring-offset-2 focus-visible:ring-offset-white motion-safe:hover:scale-105 ${
            isOpen
              ? 'bg-gradient-to-b from-[#1a2f4a] to-brand-deep-water'
              : 'bg-gradient-to-b from-[#1e3a5c] to-[#0a1628] hover:brightness-110'
          }`}
          style={{
            cursor: 'pointer',
          }}
          aria-label={isOpen ? 'Close chat' : 'Open chat'}
          title={isOpen ? 'Close chat' : 'Chat with us'}
        >
        {isOpen ? (
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" aria-hidden="true">
            <path d="M6 18L18 6M6 6l12 12" />
          </svg>
        ) : (
          <Image
            src="/logos/lbta-club-profile-480.png"
            alt=""
            width={56}
            height={56}
            className="h-14 w-14 object-cover"
            priority={false}
          />
        )}
        </button>
      </div>

      {/* Notification Badge — above chat button */}
      {!isOpen && (
        <span
          style={{
            position: 'fixed',
            bottom: `calc(24px + 60px + 4px + ${mobileChrome} + env(safe-area-inset-bottom, 0px))`,
            right: '24px',
            zIndex: 50,
            width: '14px',
            height: '14px',
            borderRadius: '50%',
            backgroundColor: 'var(--tide-pool, #3A8B6E)',
            border: '2px solid white',
            background: 'linear-gradient(135deg, #E8834A 0%, #C4963C 100%)',
            animation: 'pulse 2s infinite',
            pointerEvents: 'none',
          }}
        />
      )}

      {/* Chat Window */}
      {isOpen && (
        <div
          style={{
            position: 'fixed',
            bottom: `calc(100px + ${mobileChrome} + env(safe-area-inset-bottom, 0px))`,
            right: '24px',
            zIndex: 50,
            width: '380px',
            height: '520px',
            maxWidth: 'calc(100vw - 48px)',
            maxHeight:
              'calc(100vh - 140px - var(--lbta-sticky-cta-h, 0px) - var(--lbta-program-bar-h, 0px))',
            backgroundColor: 'var(--color-brand-morning-light, #FAF8F4)',
            borderRadius: '16px',
            border: '1px solid rgba(255, 255, 255, 0.12)',
            boxShadow: '0 24px 48px -12px rgba(15, 34, 55, 0.35), 0 0 0 1px rgba(0,0,0,0.06)',
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column',
            animation: 'slideUp 0.3s ease',
          }}
        >
          {/* Header — club mark: deep navy, white type, silver ring (matches circular LBTA profile) */}
          <div
            className="flex shrink-0 items-center justify-between border-b border-white/10 bg-gradient-to-b from-[#1a2f4a] to-brand-deep-water px-5 py-4 text-white"
            style={{
              boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.06)',
            }}
          >
            <div className="flex min-w-0 flex-1 items-center gap-3">
              <div className="relative h-11 w-11 shrink-0 overflow-hidden rounded-full ring-1 ring-white/30 shadow-[inset_0_1px_0_rgba(255,255,255,0.15)]">
                <Image
                  src="/logos/lbta-club-profile-480.png"
                  alt=""
                  fill
                  className="object-cover"
                  sizes="44px"
                />
              </div>
              <div className="min-w-0">
                <p className="font-sans text-[11px] font-bold uppercase leading-tight tracking-[0.12em] text-white">
                  Laguna Beach
                </p>
                <p className="font-sans text-[9px] font-normal uppercase leading-tight tracking-[0.28em] text-white/75">
                  Tennis Academy
                </p>
                <div className="mt-1.5 flex items-center gap-1.5">
                  <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-brand-tide-pool shadow-[0_0_0_2px_rgba(255,255,255,0.2)]" />
                  <p className="m-0 font-sans text-[10px] font-medium tracking-wide text-white/70">Assistant online</p>
                </div>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="flex min-h-[48px] min-w-[48px] shrink-0 cursor-pointer items-center justify-center rounded-[2px] border-0 bg-transparent text-white opacity-80 transition-opacity hover:opacity-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/50 focus-visible:ring-offset-2 focus-visible:ring-offset-brand-deep-water"
              aria-label="Close chat"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                <path d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Messages Area */}
          <div
            style={{
              flex: 1,
              overflowY: 'auto',
              padding: '16px',
              backgroundColor: 'var(--morning-light, #FAF8F4)',
              display: 'flex',
              flexDirection: 'column',
              gap: '12px',
            }}
          >
            {messages.map((message) => (
              <div key={message.id}>
                <div
                  style={{
                    display: 'flex',
                    justifyContent: message.role === 'user' ? 'flex-end' : 'flex-start',
                  }}
                >
                  <div
                    style={{
                      maxWidth: '85%',
                      padding: '12px 16px',
                      borderRadius: message.role === 'user' 
                        ? '18px 18px 4px 18px' 
                        : '18px 18px 18px 4px',
                      backgroundColor: message.role === 'user' ? 'var(--color-brand-deep-water, #0F2237)' : 'white',
                      color: message.role === 'user' ? 'white' : 'var(--pacific-dusk, #1B3A5C)',
                      border: message.role === 'user' ? '1px solid rgba(255,255,255,0.08)' : '1px solid rgba(27, 58, 92, 0.1)',
                      boxShadow: message.role === 'user' ? '0 2px 8px rgba(15,34,55,0.2)' : '0 1px 3px rgba(0,0,0,0.08)',
                      fontSize: '14px',
                      lineHeight: '1.5',
                      whiteSpace: 'pre-wrap',
                    }}
                  >
                    {message.content}
                  </div>
                </div>
                {/* Suggested actions after welcome message */}
                {message.id === 'welcome' && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '12px', maxWidth: '85%' }}>
                    <a
                      href="/book"
                      className="inline-flex min-h-[48px] items-center justify-center rounded-lg border border-brand-pacific-dusk/12 bg-white px-4 py-2 text-xs font-sans font-medium text-brand-pacific-dusk shadow-sm transition-colors hover:bg-brand-morning-light focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-victoria-cove focus-visible:ring-offset-2 border-l-[3px] border-l-brand-victoria-cove/50 pl-3"
                      style={{ textDecoration: 'none' }}
                    >
                      Book a Trial
                    </a>
                    <a
                      href="/schedules"
                      className="inline-flex min-h-[48px] items-center justify-center rounded-lg border border-brand-pacific-dusk/12 bg-white px-4 py-2 text-xs font-sans font-medium text-brand-pacific-dusk shadow-sm transition-colors hover:bg-brand-morning-light focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-victoria-cove focus-visible:ring-offset-2 border-l-[3px] border-l-brand-victoria-cove/50 pl-3"
                      style={{ textDecoration: 'none' }}
                    >
                      View Programs & Pricing
                    </a>
                    <a
                      href="/contact"
                      className="inline-flex min-h-[48px] items-center justify-center rounded-lg border border-brand-pacific-dusk/12 bg-white px-4 py-2 text-xs font-sans font-medium text-brand-pacific-dusk shadow-sm transition-colors hover:bg-brand-morning-light focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-victoria-cove focus-visible:ring-offset-2 border-l-[3px] border-l-brand-victoria-cove/50 pl-3"
                      style={{ textDecoration: 'none' }}
                    >
                      Contact Us
                    </a>
                  </div>
                )}
              </div>
            ))}

            {/* Loading indicator */}
            {isLoading && (
              <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
                <div
                  style={{
                    padding: '12px 16px',
                    borderRadius: '18px 18px 18px 4px',
                    backgroundColor: 'white',
                    boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                    display: 'flex',
                    gap: '4px',
                  }}
                >
                  <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: 'var(--color-brand-pacific-dusk, #1B3A5C)', animation: 'bounce 1.4s infinite ease-in-out both', animationDelay: '-0.32s' }} />
                  <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: 'var(--color-brand-pacific-dusk, #1B3A5C)', animation: 'bounce 1.4s infinite ease-in-out both', animationDelay: '-0.16s' }} />
                  <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: 'var(--color-brand-pacific-dusk, #1B3A5C)', animation: 'bounce 1.4s infinite ease-in-out both' }} />
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div
            style={{
              padding: '12px 16px',
              borderTop: '1px solid rgba(27, 58, 92, 0.08)',
              backgroundColor: 'var(--salt-air, #FFFFFF)',
            }}
          >
            <div
              style={{
                display: 'flex',
                gap: '8px',
                alignItems: 'center',
              }}
            >
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Type your message..."
                disabled={isLoading}
                className="flex-1 min-h-[48px] rounded-full border border-brand-pacific-dusk/12 bg-brand-morning-light px-4 text-sm outline-none transition-[border-color,box-shadow] focus-visible:border-brand-victoria-cove focus-visible:ring-2 focus-visible:ring-brand-victoria-cove/35"
                style={{
                  flex: 1,
                  fontSize: '14px',
                }}
                onFocus={(e) => {
                  e.currentTarget.style.borderColor = 'var(--color-brand-victoria-cove, #2E8B8B)'
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = 'rgba(27, 58, 92, 0.12)'
                }}
              />
              <button
                type="button"
                onClick={sendMessage}
                disabled={!input.trim() || isLoading}
                aria-label="Send message"
                className="flex min-h-[48px] min-w-[48px] items-center justify-center rounded-full border-0 bg-black text-white transition-all duration-200 hover:bg-neutral-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-black/30 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:bg-brand-pacific-dusk/15 disabled:text-brand-pacific-dusk/35"
                style={{
                  width: '48px',
                  height: '48px',
                  cursor: input.trim() && !isLoading ? 'pointer' : 'not-allowed',
                }}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                  <path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" />
                </svg>
              </button>
            </div>
          </div>

          {/* Footer */}
          <div
            style={{
              padding: '8px 16px',
              borderTop: '1px solid rgba(27, 58, 92, 0.06)',
              backgroundColor: 'var(--salt-air, #FFFFFF)',
              textAlign: 'center',
            }}
          >
            <p style={{ fontSize: '11px', color: 'var(--color-slate, #6B6B6B)', margin: 0 }}>
              <a href="/help" className="rounded-sm font-semibold text-brand-victoria-cove no-underline hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-victoria-cove focus-visible:ring-offset-2">
                What can you do?
              </a>
              {' • '}
              Need immediate help? Call{' '}
              <a href="tel:9495340457" aria-label="Call (949) 534-0457" className="rounded-sm font-semibold text-brand-victoria-cove no-underline hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-victoria-cove focus-visible:ring-offset-2">
                (949) 534-0457
              </a>
            </p>
          </div>
        </div>
      )}

      {/* CSS Animations */}
      <style jsx global>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.7; transform: scale(1.1); }
        }
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes bounce {
          0%, 80%, 100% { transform: scale(0); }
          40% { transform: scale(1); }
        }
      `}</style>
    </>
  )
}
