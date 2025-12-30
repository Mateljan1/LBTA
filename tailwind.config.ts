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
        // LBTA Production Spec Colors - Luxury Palette
        lbta: {
          // PRIMARY COLORS (Production Spec)
          orange: '#F8A121',      // Primary accent - warm gold
          red: '#F04E23',         // CTA accent - confident coral
          beige: '#F8E6BB',       // Soft beige background
          black: '#0A0A0A',       // Rich black (not pure black)
          white: '#FFFFFF',       // Pure white
          
          // REFINED NEUTRALS
          cream: '#FAF8F3',       // Off-white background
          sand: '#F4EDE4',        // Warm neutral
          stone: '#E8E4DF',       // Border/divider color
          charcoal: '#2B2B2B',    // Dark text
          slate: '#6B6B6B',       // Secondary text
          
          // LEGACY (backwards compatibility)
          primary: '#1A1A1A',     
          secondary: '#6B6B6B',   
          coral: '#E8956F',       
          'coral-dark': '#D67D5A',
          bone: '#FDFCFA',        
        },
        vylo: {
          orange: '#F26522',
        },
      },
      fontFamily: {
        // LBTA Final Font Stack (Playfair Display + Work Sans)
        headline: ['Playfair Display', 'Georgia', 'Times New Roman', 'serif'],
        body: ['Work Sans', 'system-ui', '-apple-system', 'sans-serif'],
        display: ['Playfair Display', 'Georgia', 'Times New Roman', 'serif'],
        serif: ['Playfair Display', 'Georgia', 'Times New Roman', 'serif'],
        sans: ['Work Sans', 'system-ui', '-apple-system', 'sans-serif'],
      },
      fontSize: {
        // REFINED Typography Scale - Luxury Hierarchy
        // Display: Hero headlines only
        'display-xl': ['clamp(3rem, 8vw, 5.25rem)', { 
          lineHeight: '0.95', 
          letterSpacing: '-0.03em', 
          fontWeight: '300' 
        }],
        'display': ['clamp(2.75rem, 7vw, 4.5rem)', { 
          lineHeight: '1.0', 
          letterSpacing: '-0.025em', 
          fontWeight: '400' 
        }],
        // Headlines: Section titles
        'headline-xl': ['clamp(2.5rem, 5vw, 3.5rem)', { 
          lineHeight: '1.1', 
          letterSpacing: '-0.02em', 
          fontWeight: '600' 
        }],
        'headline': ['clamp(2rem, 4vw, 2.75rem)', { 
          lineHeight: '1.15', 
          letterSpacing: '-0.015em', 
          fontWeight: '600' 
        }],
        'headline-sm': ['clamp(1.5rem, 3vw, 2rem)', { 
          lineHeight: '1.2', 
          letterSpacing: '-0.01em', 
          fontWeight: '600' 
        }],
        // Subheads: Lead paragraphs
        'subhead': ['clamp(1.25rem, 2.5vw, 1.5rem)', { 
          lineHeight: '1.4', 
          letterSpacing: '-0.005em', 
          fontWeight: '400' 
        }],
        // Body text
        'body-xl': ['1.25rem', { lineHeight: '1.75', letterSpacing: '0', fontWeight: '400' }],
        'body-lg': ['1.125rem', { lineHeight: '1.75', letterSpacing: '0', fontWeight: '400' }],
        'body': ['1rem', { lineHeight: '1.7', letterSpacing: '0', fontWeight: '400' }],
        'body-sm': ['0.9375rem', { lineHeight: '1.65', letterSpacing: '0', fontWeight: '400' }],
        // UI text
        'ui': ['0.875rem', { lineHeight: '1.5', letterSpacing: '0.01em', fontWeight: '500' }],
        'ui-sm': ['0.8125rem', { lineHeight: '1.4', letterSpacing: '0.01em', fontWeight: '500' }],
        // Eyebrow/Overline
        'eyebrow': ['0.6875rem', { 
          lineHeight: '1.4', 
          letterSpacing: '0.15em', 
          fontWeight: '500' 
        }],
        'eyebrow-sm': ['0.625rem', { 
          lineHeight: '1.4', 
          letterSpacing: '0.12em', 
          fontWeight: '500' 
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
        'focus': '0 0 0 3px rgba(248,161,33,0.2)',
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
