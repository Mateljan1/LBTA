import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // LBTA Brand Kit — Laguna Beach Palette
        brand: {
          'pacific-dusk': '#1B3A5C',
          'deep-water': '#0F2237',
          'victoria-cove': '#2E8B8B',
          'thousand-steps': '#C4963C',
          'sunset-cliff': '#E8834A',
          'sandstone': '#F5F0E5',
          'morning-light': '#FAF8F4',
          'salt-air': '#FFFFFF',
          'tide-pool': '#3A8B6E',
          'sage-hill': '#7A8B6E',
          'driftwood': '#B8A88A',
        },
        // LBTA mapped to Brand Kit + legacy compat
        lbta: {
          burnt: '#E8834A',       // Deprecated: use brand-sunset-cliff instead
          orange: '#E8834A',      // Sunset Cliff (was #F8A121)
          red: '#F04E23',         // Legacy — avoid in new code
          beige: '#F5F0E5',       // Sandstone (was #F8E6BB)
          black: '#0A0A0A',       // Rich black
          white: '#FFFFFF',
          cream: '#FAF8F4',       // Morning Light (was #FAF8F3)
          sand: '#F5F0E5',        // Sandstone (was #F4EDE4)
          stone: '#E8E4DF',       // Border/divider
          charcoal: '#1B3A5C',    // Pacific Dusk (was #2B2B2B)
          slate: '#6B6B6B',       // Secondary text
          primary: '#1B3A5C',     // Pacific Dusk
          secondary: '#6B6B6B',
          coral: '#E8834A',       // Sunset Cliff alias
          'coral-dark': '#D4773F',
          bone: '#FAF8F4',        // Morning Light
        },
      },
      fontFamily: {
        headline: ['var(--font-cormorant)', 'Cormorant', 'Georgia', 'serif'],
        body: ['var(--font-dm-sans)', 'DM Sans', 'system-ui', 'sans-serif'],
        display: ['var(--font-cormorant)', 'Cormorant', 'Georgia', 'serif'],
        serif: ['var(--font-cormorant)', 'Cormorant', 'Georgia', 'serif'],
        sans: ['var(--font-dm-sans)', 'DM Sans', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        // Brand Kit Typography Scale
        'display-xl': ['clamp(3rem, 7vw, 5.5rem)', {
          lineHeight: '0.95',
          letterSpacing: '-0.02em',
          fontWeight: '300'
        }],
        'display': ['clamp(2rem, 4.5vw, 3.5rem)', {
          lineHeight: '1.05',
          letterSpacing: '-0.015em',
          fontWeight: '300'
        }],
        'display-sm': ['clamp(1.5rem, 3vw, 2.2rem)', {
          lineHeight: '1.15',
          letterSpacing: '-0.01em',
          fontWeight: '300'
        }],
        'headline-xl': ['clamp(2.5rem, 5vw, 3.5rem)', {
          lineHeight: '1.1',
          letterSpacing: '-0.02em',
          fontWeight: '400'
        }],
        'headline': ['clamp(1.6rem, 2.5vw, 2rem)', {
          lineHeight: '1.2',
          letterSpacing: '-0.01em',
          fontWeight: '400'
        }],
        'headline-sm': ['clamp(1.25rem, 2vw, 1.5rem)', {
          lineHeight: '1.25',
          letterSpacing: '-0.005em',
          fontWeight: '400'
        }],
        'subhead': ['clamp(1.125rem, 2vw, 1.375rem)', {
          lineHeight: '1.5',
          letterSpacing: '0',
          fontWeight: '400'
        }],
        'body-xl': ['1.25rem', { lineHeight: '1.75', letterSpacing: '0', fontWeight: '300' }],
        'body-lg': ['1.05rem', { lineHeight: '1.75', letterSpacing: '0', fontWeight: '300' }],
        'body': ['1rem', { lineHeight: '1.7', letterSpacing: '0', fontWeight: '400' }],
        'body-sm': ['0.9375rem', { lineHeight: '1.65', letterSpacing: '0', fontWeight: '400' }],
        'ui': ['0.875rem', { lineHeight: '1.5', letterSpacing: '0.01em', fontWeight: '500' }],
        'ui-sm': ['0.8125rem', { lineHeight: '1.4', letterSpacing: '0.01em', fontWeight: '500' }],
        'eyebrow': ['0.7rem', {
          lineHeight: '1.4',
          letterSpacing: '0.18em',
          fontWeight: '600'
        }],
        'eyebrow-sm': ['0.65rem', {
          lineHeight: '1.4',
          letterSpacing: '0.12em',
          fontWeight: '600'
        }],
      },
      spacing: {
        // 8px base unit for tighter control
        '4.5': '1.125rem',   // 18px
        '5.5': '1.375rem',   // 22px
        '6.5': '1.625rem',   // 26px
        '7': '1.75rem',      // 28px
        '7.5': '1.875rem',   // 30px
        '13': '3.25rem',     // 52px
        '15': '3.75rem',     // 60px
        '18': '4.5rem',      // 72px
        '22': '5.5rem',      // 88px
        '26': '6.5rem',      // 104px
        '30': '7.5rem',      // 120px
        '34': '8.5rem',      // 136px
        '38': '9.5rem',      // 152px
        '42': '10.5rem',     // 168px
        '46': '11.5rem',     // 184px
        '50': '12.5rem',     // 200px
      },
      maxWidth: {
        'prose': '65ch',
        'narrow': '42rem',
        'content': '72rem',
        'wide': '90rem',
      },
      borderRadius: {
        'luxury': '2px',     // Nearly square - Aman style
        'subtle': '4px',     // Subtle rounding
        'soft': '8px',       // Soft edges
      },
      boxShadow: {
        // Refined shadow system
        'subtle': '0 1px 2px rgba(0,0,0,0.04)',
        'soft': '0 2px 8px rgba(0,0,0,0.06)',
        'medium': '0 4px 16px rgba(0,0,0,0.08)',
        'elevated': '0 8px 32px rgba(0,0,0,0.10)',
        'luxury': '0 12px 48px rgba(0,0,0,0.12)',
        // Interactive shadows
        'hover': '0 8px 24px rgba(0,0,0,0.08)',
        'focus': '0 0 0 3px rgba(46,139,139,0.15)',
        // Card shadows
        'card': '0 1px 3px rgba(0,0,0,0.02), 0 4px 12px rgba(0,0,0,0.04)',
        'card-hover': '0 2px 6px rgba(0,0,0,0.03), 0 8px 24px rgba(0,0,0,0.06)',
      },
      animation: {
        // Refined animations
        'fade-in': 'fadeIn 0.6s cubic-bezier(0.22, 0.61, 0.36, 1) forwards',
        'fade-in-up': 'fadeInUp 0.7s cubic-bezier(0.22, 0.61, 0.36, 1) forwards',
        'fade-in-down': 'fadeInDown 0.7s cubic-bezier(0.22, 0.61, 0.36, 1) forwards',
        'slide-in-right': 'slideInRight 0.5s cubic-bezier(0.22, 0.61, 0.36, 1) forwards',
        'slide-in-left': 'slideInLeft 0.5s cubic-bezier(0.22, 0.61, 0.36, 1) forwards',
        'scale-in': 'scaleIn 0.5s cubic-bezier(0.22, 0.61, 0.36, 1) forwards',
        'reveal': 'reveal 0.8s cubic-bezier(0.22, 0.61, 0.36, 1) forwards',
        'shimmer': 'shimmer 2s linear infinite',
        'pulse-subtle': 'pulseSubtle 3s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        fadeInUp: {
          '0%': { opacity: '0', transform: 'translateY(24px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeInDown: {
          '0%': { opacity: '0', transform: 'translateY(-24px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideInRight: {
          '0%': { opacity: '0', transform: 'translateX(100%)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        slideInLeft: {
          '0%': { opacity: '0', transform: 'translateX(-100%)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        scaleIn: {
          '0%': { opacity: '0', transform: 'scale(0.96)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        reveal: {
          '0%': { opacity: '0', transform: 'translateY(40px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        shimmer: {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(100%)' },
        },
        pulseSubtle: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.85' },
        },
      },
      transitionTimingFunction: {
        'luxury': 'cubic-bezier(0.22, 0.61, 0.36, 1)',
        'smooth': 'cubic-bezier(0.4, 0, 0.2, 1)',
        'bounce': 'cubic-bezier(0.34, 1.56, 0.64, 1)',
      },
      transitionDuration: {
        '400': '400ms',
        '600': '600ms',
        '800': '800ms',
        '1000': '1000ms',
        '1200': '1200ms',
      },
      aspectRatio: {
        'hero': '21 / 9',
        'section': '3 / 2',
        'portrait': '3 / 4',
        'square': '1 / 1',
      },
      backdropBlur: {
        xs: '2px',
      },
    },
  },
  plugins: [],
}
export default config
