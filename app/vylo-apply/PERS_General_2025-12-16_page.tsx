'use client'

import { useState } from 'react'
import Image from 'next/image'
import { motion } from 'framer-motion'

// Add font - Neue Haas Grotesk from Adobe Fonts
if (typeof document !== 'undefined') {
  const neueHaasLink = document.createElement('link')
  neueHaasLink.href = 'https://use.typekit.net/ayc1ohg.css'
  neueHaasLink.rel = 'stylesheet'
  document.head.appendChild(neueHaasLink)
}

export default function VYLOApplyPage() {
  const [email, setEmail] = useState('')
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [phone, setPhone] = useState('')
  const [playerUTR, setPlayerUTR] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError('')

    try {
      // Create contact in ActiveCampaign with VYLO tag
      const response = await fetch('/api/vylo-apply', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          firstName,
          lastName,
          phone,
          playerUTR,
        }),
      })

      if (!response.ok) throw new Error('Submission failed')

      setSubmitted(true)
      // Reset form
      setEmail('')
      setFirstName('')
      setLastName('')
      setPhone('')
      setPlayerUTR('')
    } catch (err) {
      setError('Something went wrong. Please try again or email support@lagunabeachtennisacademy.com directly.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: '#0A0A0A',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '40px 20px',
    }}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        style={{
          maxWidth: '800px',
          width: '100%',
        }}
      >
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: '48px' }}>
          <Image
            src="/logos/VYLO Icon_Word_Logo_Classic_Org_Wht.png"
            alt="VYLO Performance Institute"
            width={160}
            height={53}
            style={{ width: 'auto', height: 'auto', maxHeight: '40px', margin: '0 auto' }}
            priority
          />
        </div>

        {/* Headline */}
        <div style={{ textAlign: 'center', marginBottom: '48px', maxWidth: '100%', margin: '0 auto 48px', padding: '0 20px' }}>
          <h1 style={{
            fontFamily: '"neue-haas-grotesk-display", sans-serif',
            fontSize: 'clamp(24px, 5.5vw, 48px)',
            fontWeight: 500,
            lineHeight: 1.1,
            color: '#FFFFFF',
            marginBottom: '32px',
            letterSpacing: '-0.03em',
          }}>
            We build pros who can win under lights.
          </h1>

          <p style={{
            fontFamily: '"neue-haas-grotesk-text", sans-serif',
            fontSize: 'clamp(16px, 3vw, 20px)',
            lineHeight: 1.5,
            color: 'rgba(255, 255, 255, 0.7)',
            marginBottom: '16px',
            fontWeight: 400,
            letterSpacing: '0.01em',
          }}>
            Pressure. Capacity. Results.
          </p>

          <p style={{
            fontFamily: '"neue-haas-grotesk-text", sans-serif',
            fontSize: 'clamp(14px, 2.5vw, 16px)',
            color: 'rgba(255, 255, 255, 0.5)',
            fontWeight: 400,
            letterSpacing: '0.02em',
            marginBottom: '24px',
          }}>
            Roster capped. Entry earned.
          </p>

          {/* Program Details */}
          <div style={{
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'center',
            gap: '12px 20px',
            marginTop: '24px',
            paddingTop: '24px',
            borderTop: '1px solid rgba(255, 255, 255, 0.08)',
          }}>
            <span style={{
              fontFamily: '"neue-haas-grotesk-text", sans-serif',
              fontSize: 'clamp(11px, 2vw, 13px)',
              color: '#F26522',
              fontWeight: 500,
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
            }}>
              UTR 9.0+
            </span>
            <span style={{
              fontFamily: '"neue-haas-grotesk-text", sans-serif',
              fontSize: 'clamp(11px, 2vw, 13px)',
              color: '#F26522',
              fontWeight: 500,
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
            }}>
              Full-Time Commitment
            </span>
            <span style={{
              fontFamily: '"neue-haas-grotesk-text", sans-serif',
              fontSize: 'clamp(11px, 2vw, 13px)',
              color: '#F26522',
              fontWeight: 500,
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
            }}>
              Ten Positions
            </span>
            <span style={{
              fontFamily: '"neue-haas-grotesk-text", sans-serif',
              fontSize: 'clamp(11px, 2vw, 13px)',
              color: '#F26522',
              fontWeight: 500,
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
            }}>
              Laguna Beach, CA
            </span>
          </div>

          <p style={{
            fontFamily: '"neue-haas-grotesk-text", sans-serif',
            fontSize: 'clamp(12px, 2vw, 14px)',
            color: 'rgba(255, 255, 255, 0.4)',
            fontWeight: 400,
            marginTop: '20px',
            lineHeight: 1.6,
          }}>
            Founding Cohort • January 2026 • 30+ D1 Placements • ATP/WTA Coaching
          </p>
        </div>

        {/* VYLO Video */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
          style={{
            marginBottom: 'clamp(40px, 7vw, 56px)',
            borderRadius: 'clamp(8px, 2vw, 12px)',
            overflow: 'hidden',
            border: '1px solid rgba(255, 255, 255, 0.12)',
            boxShadow: '0 20px 60px rgba(0, 0, 0, 0.4)',
            maxWidth: '100%',
          }}
        >
          <div style={{ position: 'relative', width: '100%', paddingTop: '56.25%' }}>
            <iframe
              src="https://player.vimeo.com/video/1141895131?background=1&autoplay=1&loop=1&muted=1"
              frameBorder="0"
              allow="autoplay; fullscreen"
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
              }}
              title="VYLO Performance Institute Training"
            />
          </div>
        </motion.div>

        {/* Form or Success Message */}
        {!submitted ? (
          <motion.div
            style={{
              maxWidth: '600px',
              margin: '0 auto',
              background: 'rgba(255, 255, 255, 0.03)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              borderRadius: '8px',
              padding: 'clamp(32px, 6vw, 48px) clamp(24px, 5vw, 40px)',
            }}
          >
            <div style={{
              textAlign: 'center',
              marginBottom: 'clamp(24px, 5vw, 32px)',
              paddingBottom: 'clamp(24px, 5vw, 32px)',
              borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
            }}>
              <div style={{
                fontFamily: '"neue-haas-grotesk-text", sans-serif',
                fontSize: 'clamp(11px, 2vw, 12px)',
                fontWeight: 500,
                letterSpacing: '0.2em',
                textTransform: 'uppercase',
                color: '#F26522',
                marginBottom: '12px',
              }}>
                Founding Cohort
              </div>
              <div style={{
                fontFamily: '"neue-haas-grotesk-display", sans-serif',
                fontSize: 'clamp(24px, 5vw, 28px)',
                fontWeight: 500,
                color: '#FFFFFF',
                marginBottom: '8px',
                letterSpacing: '-0.01em',
              }}>
                January 2026
              </div>
              <div style={{
                fontFamily: '"neue-haas-grotesk-text", sans-serif',
                fontSize: 'clamp(13px, 2.5vw, 14px)',
                color: 'rgba(255, 255, 255, 0.5)',
                fontWeight: 400,
              }}>
                Ten positions. Laguna Beach, California.
              </div>
            </div>

            <form onSubmit={handleSubmit}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
                <div>
                  <input
                    type="text"
                    placeholder="First Name"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    required
                    style={{
                      width: '100%',
                      padding: '16px',
                      background: 'rgba(255, 255, 255, 0.05)',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                      borderRadius: '4px',
                      color: '#FFFFFF',
                      fontSize: '15px',
                      fontFamily: '"neue-haas-grotesk-text", sans-serif',
                      outline: 'none',
                      transition: 'all 0.3s ease',
                    }}
                    onFocus={(e) => {
                      e.target.style.borderColor = '#F26522'
                      e.target.style.background = 'rgba(255, 255, 255, 0.08)'
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = 'rgba(255, 255, 255, 0.1)'
                      e.target.style.background = 'rgba(255, 255, 255, 0.05)'
                    }}
                  />
                </div>
                <div>
                  <input
                    type="text"
                    placeholder="Last Name"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    required
                    style={{
                      width: '100%',
                      padding: '16px',
                      background: 'rgba(255, 255, 255, 0.05)',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                      borderRadius: '4px',
                      color: '#FFFFFF',
                      fontSize: '15px',
                      fontFamily: '"neue-haas-grotesk-text", sans-serif',
                      outline: 'none',
                      transition: 'all 0.3s ease',
                    }}
                    onFocus={(e) => {
                      e.target.style.borderColor = '#F26522'
                      e.target.style.background = 'rgba(255, 255, 255, 0.08)'
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = 'rgba(255, 255, 255, 0.1)'
                      e.target.style.background = 'rgba(255, 255, 255, 0.05)'
                    }}
                  />
                </div>
              </div>

              <div style={{ marginBottom: '16px' }}>
                <input
                  type="email"
                  placeholder="Email Address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  style={{
                    width: '100%',
                    padding: '16px',
                    background: 'rgba(255, 255, 255, 0.05)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    borderRadius: '4px',
                    color: '#FFFFFF',
                    fontSize: '15px',
                    fontFamily: '"neue-haas-grotesk-text", sans-serif',
                    outline: 'none',
                    transition: 'all 0.3s ease',
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = '#F26522'
                    e.target.style.background = 'rgba(255, 255, 255, 0.08)'
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = 'rgba(255, 255, 255, 0.1)'
                    e.target.style.background = 'rgba(255, 255, 255, 0.05)'
                  }}
                />
              </div>

              <div style={{ marginBottom: '16px' }}>
                <input
                  type="tel"
                  placeholder="Phone Number"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  required
                  style={{
                    width: '100%',
                    padding: '16px',
                    background: 'rgba(255, 255, 255, 0.05)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    borderRadius: '4px',
                    color: '#FFFFFF',
                    fontSize: '15px',
                    fontFamily: '"neue-haas-grotesk-text", sans-serif',
                    outline: 'none',
                    transition: 'all 0.3s ease',
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = '#F26522'
                    e.target.style.background = 'rgba(255, 255, 255, 0.08)'
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = 'rgba(255, 255, 255, 0.1)'
                    e.target.style.background = 'rgba(255, 255, 255, 0.05)'
                  }}
                />
              </div>

              <div style={{ marginBottom: '32px' }}>
                <input
                  type="text"
                  placeholder="Player UTR (if known)"
                  value={playerUTR}
                  onChange={(e) => setPlayerUTR(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '16px',
                    background: 'rgba(255, 255, 255, 0.05)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    borderRadius: '4px',
                    color: '#FFFFFF',
                    fontSize: '15px',
                    fontFamily: '"neue-haas-grotesk-text", sans-serif',
                    outline: 'none',
                    transition: 'all 0.3s ease',
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = '#F26522'
                    e.target.style.background = 'rgba(255, 255, 255, 0.08)'
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = 'rgba(255, 255, 255, 0.1)'
                    e.target.style.background = 'rgba(255, 255, 255, 0.05)'
                  }}
                />
              </div>

              {error && (
                <div style={{
                  padding: '12px 16px',
                  background: 'rgba(239, 68, 68, 0.1)',
                  border: '1px solid rgba(239, 68, 68, 0.3)',
                  borderRadius: '4px',
                  color: '#EF4444',
                  fontSize: '14px',
                  marginBottom: '24px',
                  fontFamily: '"neue-haas-grotesk-text", sans-serif',
                }}>
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={isSubmitting}
                style={{
                  width: '100%',
                  padding: '18px',
                  background: '#F26522',
                  border: 'none',
                  borderRadius: '4px',
                  color: '#FFFFFF',
                  fontSize: '13px',
                  fontWeight: 500,
                  letterSpacing: '0.1em',
                  textTransform: 'uppercase',
                  cursor: isSubmitting ? 'not-allowed' : 'pointer',
                  fontFamily: '"neue-haas-grotesk-text", sans-serif',
                  transition: 'all 0.3s ease',
                  opacity: isSubmitting ? 0.6 : 1,
                }}
                onMouseEnter={(e) => {
                  if (!isSubmitting) {
                    e.currentTarget.style.background = '#FF8C4D'
                    e.currentTarget.style.transform = 'translateY(-1px)'
                  }
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = '#F26522'
                  e.currentTarget.style.transform = 'translateY(0)'
                }}
              >
                {isSubmitting ? 'Submitting...' : 'Register Interest'}
              </button>

              <p style={{
                fontFamily: '"neue-haas-grotesk-text", sans-serif',
                fontSize: '12px',
                color: 'rgba(255, 255, 255, 0.4)',
                textAlign: 'center',
                marginTop: '20px',
                fontWeight: 400,
                lineHeight: 1.5,
              }}>
                By submitting, you'll receive information about the VYLO Founding Cohort.
                We respect your inbox. Unsubscribe anytime.
              </p>
            </form>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            style={{
              maxWidth: '600px',
              margin: '0 auto',
              background: 'rgba(34, 197, 94, 0.05)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(34, 197, 94, 0.2)',
              borderRadius: '8px',
              padding: 'clamp(32px, 6vw, 48px) clamp(24px, 5vw, 40px)',
              textAlign: 'center',
            }}
          >
            <div style={{
              width: '64px',
              height: '64px',
              background: 'rgba(34, 197, 94, 0.1)',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 24px',
            }}>
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#22C55E" strokeWidth="2">
                <polyline points="20 6 9 17 4 12" />
              </svg>
            </div>

            <h2 style={{
              fontFamily: '"neue-haas-grotesk-display", sans-serif',
              fontSize: '28px',
              fontWeight: 500,
              color: '#FFFFFF',
              marginBottom: '16px',
              letterSpacing: '-0.01em',
            }}>
              Welcome to VYLO
            </h2>

            <p style={{
              fontFamily: '"neue-haas-grotesk-text", sans-serif',
              fontSize: '16px',
              lineHeight: 1.6,
              color: 'rgba(255, 255, 255, 0.6)',
              marginBottom: '8px',
              fontWeight: 400,
            }}>
              You're on the list for the Founding Cohort.
            </p>

            <p style={{
              fontFamily: '"neue-haas-grotesk-text", sans-serif',
              fontSize: '14px',
              color: 'rgba(255, 255, 255, 0.5)',
              fontWeight: 400,
            }}>
              We'll reach out soon with next steps.
            </p>
          </motion.div>
        )}

        {/* Footer */}
        <div style={{
          textAlign: 'center',
          marginTop: '48px',
          paddingTop: '32px',
          borderTop: '1px solid rgba(255, 255, 255, 0.06)',
        }}>
          <p style={{
            fontFamily: '"neue-haas-grotesk-text", sans-serif',
            fontSize: '13px',
            color: 'rgba(255, 255, 255, 0.4)',
            marginBottom: '12px',
            fontWeight: 400,
          }}>
            Questions? Email us at
          </p>
          <a
            href="mailto:support@lagunabeachtennisacademy.com"
            style={{
              fontFamily: '"neue-haas-grotesk-text", sans-serif',
              fontSize: '14px',
              color: '#F26522',
              textDecoration: 'none',
              fontWeight: 500,
            }}
          >
            support@lagunabeachtennisacademy.com
          </a>
          <p style={{
            fontFamily: '"neue-haas-grotesk-text", sans-serif',
            fontSize: '13px',
            color: 'rgba(255, 255, 255, 0.3)',
            marginTop: '24px',
            fontWeight: 400,
          }}>
            Laguna Beach, California
          </p>
        </div>
      </motion.div>
    </div>
  )
}
