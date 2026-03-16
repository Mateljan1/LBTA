'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import Image from 'next/image'

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
        content: "Hi! 👋 I'm the LBTA Assistant. I can help you with:\n\n• Program information & pricing\n• Class schedules\n• Trial lesson booking\n• Coach credentials\n• Location & facilities\n\nHow can I help you today?",
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

    setMessages(prev => [...prev, userMessage])
    setInput('')
    setIsLoading(true)

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          message: userMessage.content,
          history: messages.map(m => ({ role: m.role, content: m.content }))
        }),
      })

      const data = await response.json().catch(() => ({}))
      const reply = data?.reply ?? data?.error ?? "I apologize, but I couldn't process that request. Please try again or call us at (949) 534-0457."

      if (!response.ok) {
        setMessages(prev => [...prev, {
          id: `assistant-${Date.now()}`,
          role: 'assistant',
          content: reply,
          timestamp: new Date()
        }])
        return
      }

      const assistantMessage: Message = {
        id: `assistant-${Date.now()}`,
        role: 'assistant',
        content: reply,
        timestamp: new Date()
      }

      setMessages(prev => [...prev, assistantMessage])
    } catch (error) {
      console.error('Chat error:', error)
      setMessages(prev => [...prev, {
        id: `error-${Date.now()}`,
        role: 'assistant',
        content: "I'm having trouble connecting right now. Please call us directly at (949) 534-0457 or email info@lagunabeachtennisacademy.com",
        timestamp: new Date()
      }])
    } finally {
      setIsLoading(false)
    }
  }, [input, isLoading, messages])

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  // Don't render until mounted (prevents hydration issues)
  if (!mounted) return null

  return (
    <>
      {/* Floating Chat Button — stacked above viewport bottom so BackToTop can sit above it */}
      <div
        className="group/chat relative flex flex-col items-end"
        style={{
          position: 'fixed',
          bottom: 'calc(24px + env(safe-area-inset-bottom, 0px))',
          right: '24px',
          zIndex: 50,
        }}
      >
        {/* Hover label: "Chat with us" so users immediately recognize the control (best practice: Intercom/Drift-style affordance) */}
        <span
          className="pointer-events-none absolute right-full top-1/2 mr-3 hidden -translate-y-1/2 whitespace-nowrap rounded-md bg-brand-pacific-dusk px-3 py-2 text-xs font-medium text-white shadow-lg opacity-0 transition-opacity duration-200 group-hover/chat:opacity-100 md:block"
          style={{ zIndex: 50 }}
          aria-hidden
        >
          Chat with us
        </span>
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className={`group flex h-[60px] w-[60px] min-h-[48px] min-w-[48px] flex-shrink-0 items-center justify-center rounded-full border-0 shadow-lg transition-all duration-300 ease-out focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-sunset-cliff focus-visible:ring-offset-2 ${
            isOpen ? 'bg-brand-deep-water' : 'bg-brand-sunset-cliff'
          }`}
          style={{
            boxShadow: '0 4px 20px rgba(0,0,0,0.2)',
            cursor: 'pointer',
          }}
          onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.1)')}
          onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
          aria-label={isOpen ? 'Close chat' : 'Open chat'}
          title={isOpen ? 'Close chat' : 'Chat with us'}
        >
        {isOpen ? (
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" aria-hidden="true">
            <path d="M6 18L18 6M6 6l12 12" />
          </svg>
        ) : (
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" aria-hidden="true">
            <path d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
        )}
        </button>
      </div>

      {/* Notification Badge — above chat button */}
      {!isOpen && (
        <span
          style={{
            position: 'fixed',
            bottom: 'calc(24px + 60px + 4px + env(safe-area-inset-bottom, 0px))',
            right: '24px',
            zIndex: 50,
            width: '14px',
            height: '14px',
            borderRadius: '50%',
            backgroundColor: 'var(--tide-pool, #3A8B6E)',
            border: '2px solid white',
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
            bottom: 'calc(100px + env(safe-area-inset-bottom, 0px))',
            right: '24px',
            zIndex: 50,
            width: '380px',
            height: '520px',
            maxWidth: 'calc(100vw - 48px)',
            maxHeight: 'calc(100vh - 140px)',
            backgroundColor: 'var(--color-brand-morning-light, #FAF8F4)',
            borderRadius: '12px',
            border: '1px solid rgba(26, 26, 26, 0.08)',
            boxShadow: '0 20px 40px -8px rgba(0,0,0,0.15)',
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column',
            animation: 'slideUp 0.3s ease',
          }}
        >
          {/* Header - Minimal, Aman-level */}
          <div
            style={{
              backgroundColor: 'var(--color-brand-morning-light, #FAF8F4)',
              padding: '20px 24px',
              borderBottom: '1px solid rgba(26, 26, 26, 0.08)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div
                style={{
                  width: '40px',
                  height: '40px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Image
                  src="/logos/LBTAblktext.png"
                  alt="LBTA"
                  width={32}
                  height={32}
                  className="object-contain"
                />
              </div>
              <div>
                <h3 style={{ 
                  fontFamily: 'var(--font-cormorant)', 
                  color: 'var(--pacific-dusk, #1B3A5C)', 
                  fontWeight: 400, 
                  fontSize: '20px', 
                  margin: 0,
                  lineHeight: 1.2
                }}>
                  LBTA
                </h3>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '2px' }}>
                  <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: 'var(--tide-pool, #3A8B6E)' }} />
                  <p style={{ 
                    fontFamily: 'var(--font-sans)',
                    color: 'var(--color-slate, #6B6B6B)', 
                    fontSize: '11px', 
                    margin: 0,
                    letterSpacing: '0.5px'
                  }}>
                    Online
                  </p>
                </div>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              style={{
                background: 'transparent',
                border: 'none',
                width: '32px',
                height: '32px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                opacity: 0.4,
                transition: 'opacity 0.2s'
              }}
              onMouseEnter={(e) => (e.currentTarget.style.opacity = '1')}
              onMouseLeave={(e) => (e.currentTarget.style.opacity = '0.4')}
              aria-label="Close chat"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--pacific-dusk, #1B3A5C)" strokeWidth="2" aria-hidden="true">
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
              <div
                key={message.id}
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
                    backgroundColor: message.role === 'user' ? 'var(--color-brand-sunset-cliff, #E8834A)' : 'white',
                    color: message.role === 'user' ? 'white' : 'var(--pacific-dusk, #1B3A5C)',
                    boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                    fontSize: '14px',
                    lineHeight: '1.5',
                    whiteSpace: 'pre-wrap',
                  }}
                >
                  {message.content}
                </div>
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
                  <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: 'var(--driftwood, #B8A88A)', animation: 'bounce 1.4s infinite ease-in-out both', animationDelay: '-0.32s' }} />
                  <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: 'var(--driftwood, #B8A88A)', animation: 'bounce 1.4s infinite ease-in-out both', animationDelay: '-0.16s' }} />
                  <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: 'var(--driftwood, #B8A88A)', animation: 'bounce 1.4s infinite ease-in-out both' }} />
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
                style={{
                  flex: 1,
                  padding: '12px 16px',
                  borderRadius: '24px',
                  border: '1px solid rgba(27, 58, 92, 0.12)',
                  outline: 'none',
                  fontSize: '14px',
                  backgroundColor: 'var(--morning-light, #FAF8F4)',
                  transition: 'border-color 0.2s',
                }}
                onFocus={(e) => (e.currentTarget.style.borderColor = 'var(--sunset-cliff, #E8834A)')}
                onBlur={(e) => (e.target.style.borderColor = 'rgba(27, 58, 92, 0.12)')}
              />
              <button
                type="button"
                onClick={sendMessage}
                disabled={!input.trim() || isLoading}
                aria-label="Send message"
                className="min-w-[48px] min-h-[48px] rounded-full border-0 flex items-center justify-center transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--sunset-cliff,#E8834A)] focus-visible:ring-offset-2 disabled:cursor-not-allowed"
                style={{
                  width: '48px',
                  height: '48px',
                  backgroundColor: input.trim() && !isLoading ? 'var(--sunset-cliff, #E8834A)' : 'rgba(27, 58, 92, 0.12)',
                  cursor: input.trim() && !isLoading ? 'pointer' : 'not-allowed',
                }}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={input.trim() && !isLoading ? 'white' : 'var(--driftwood, #B8A88A)'} strokeWidth="2" aria-hidden="true">
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
              Need immediate help? Call{' '}
              <a href="tel:9495340457" aria-label="Call (949) 534-0457" className="text-brand-sunset-cliff no-underline font-semibold">
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
