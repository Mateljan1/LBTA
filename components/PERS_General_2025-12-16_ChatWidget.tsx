'use client'

import { useState, useEffect, useRef, useCallback } from 'react'

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

      if (!response.ok) throw new Error('Failed to get response')

      const data = await response.json()

      const assistantMessage: Message = {
        id: `assistant-${Date.now()}`,
        role: 'assistant',
        content: data.reply || "I apologize, but I couldn't process that request. Please try again or call us at (949) 464-6645.",
        timestamp: new Date()
      }

      setMessages(prev => [...prev, assistantMessage])
    } catch (error) {
      console.error('Chat error:', error)
      setMessages(prev => [...prev, {
        id: `error-${Date.now()}`,
        role: 'assistant',
        content: "I'm having trouble connecting right now. Please call us directly at (949) 464-6645 or email info@lagunabeachtennisacademy.com",
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
      {/* Floating Chat Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        style={{
          position: 'fixed',
          bottom: '24px',
          right: '24px',
          zIndex: 9999,
          width: '60px',
          height: '60px',
          borderRadius: '50%',
          backgroundColor: isOpen ? '#1f2937' : '#E8956F',
          border: 'none',
          boxShadow: '0 4px 20px rgba(0,0,0,0.2)',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          transition: 'all 0.3s ease',
        }}
        onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.1)')}
        onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
        aria-label={isOpen ? 'Close chat' : 'Open chat'}
      >
        {isOpen ? (
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5">
            <path d="M6 18L18 6M6 6l12 12" />
          </svg>
        ) : (
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
            <path d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
        )}
      </button>

      {/* Notification Badge */}
      {!isOpen && (
        <span
          style={{
            position: 'fixed',
            bottom: '76px',
            right: '24px',
            zIndex: 9999,
            width: '14px',
            height: '14px',
            borderRadius: '50%',
            backgroundColor: '#10b981',
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
            bottom: '100px',
            right: '24px',
            zIndex: 9999,
            width: '380px',
            height: '520px',
            maxWidth: 'calc(100vw - 48px)',
            maxHeight: 'calc(100vh - 140px)',
            backgroundColor: '#FDFCFA',
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
              backgroundColor: '#FDFCFA',
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
                <img 
                  src="/logos/chatbot-logo.svg" 
                  alt="LBTA" 
                  style={{ 
                    width: '32px', 
                    height: '32px',
                    objectFit: 'contain'
                  }} 
                />
              </div>
              <div>
                <h3 style={{ 
                  fontFamily: 'var(--font-cormorant)', 
                  color: '#1A1A1A', 
                  fontWeight: 400, 
                  fontSize: '20px', 
                  margin: 0,
                  lineHeight: 1.2
                }}>
                  LBTA
                </h3>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '2px' }}>
                  <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#10b981' }} />
                  <p style={{ 
                    fontFamily: 'var(--font-inter)',
                    color: '#6B6B6B', 
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
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#1A1A1A" strokeWidth="2">
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
              backgroundColor: '#f9fafb',
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
                    backgroundColor: message.role === 'user' ? '#E8956F' : 'white',
                    color: message.role === 'user' ? 'white' : '#1f2937',
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
                  <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#9ca3af', animation: 'bounce 1.4s infinite ease-in-out both', animationDelay: '-0.32s' }} />
                  <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#9ca3af', animation: 'bounce 1.4s infinite ease-in-out both', animationDelay: '-0.16s' }} />
                  <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#9ca3af', animation: 'bounce 1.4s infinite ease-in-out both' }} />
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div
            style={{
              padding: '12px 16px',
              borderTop: '1px solid #e5e7eb',
              backgroundColor: 'white',
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
                  border: '1px solid #e5e7eb',
                  outline: 'none',
                  fontSize: '14px',
                  backgroundColor: '#f9fafb',
                  transition: 'border-color 0.2s',
                }}
                onFocus={(e) => (e.target.style.borderColor = '#E8956F')}
                onBlur={(e) => (e.target.style.borderColor = '#e5e7eb')}
              />
              <button
                onClick={sendMessage}
                disabled={!input.trim() || isLoading}
                style={{
                  width: '44px',
                  height: '44px',
                  borderRadius: '50%',
                  border: 'none',
                  backgroundColor: input.trim() && !isLoading ? '#E8956F' : '#e5e7eb',
                  cursor: input.trim() && !isLoading ? 'pointer' : 'not-allowed',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'all 0.2s',
                }}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={input.trim() && !isLoading ? 'white' : '#9ca3af'} strokeWidth="2">
                  <path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" />
                </svg>
              </button>
            </div>
          </div>

          {/* Footer */}
          <div
            style={{
              padding: '8px 16px',
              borderTop: '1px solid #f3f4f6',
              backgroundColor: 'white',
              textAlign: 'center',
            }}
          >
            <p style={{ fontSize: '11px', color: '#9ca3af', margin: 0 }}>
              Need immediate help? Call{' '}
              <a href="tel:9494646645" style={{ color: '#E8956F', textDecoration: 'none', fontWeight: 600 }}>
                (949) 464-6645
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
