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
        // LBTA Brand Colors - Bold & Performance-Driven
        lbta: {
          orange: '#f8a121',      // Primary CTA
          burnt: '#e67e30',       // Accents
          intense: '#E65100',     // Urgent CTAs
          cream: '#f5f1e8',       // Main background
          tan: '#f8e6bb',         // Section backgrounds
          charcoal: '#1a1a1a',    // Primary text
          slate: '#2d2d2d',       // Secondary backgrounds
          gold: '#c9a961',        // Premium accents
          sand: '#e8dcc4',        // Soft backgrounds
        },
        vylo: {
          orange: '#F26522',      // VYLO brand distinct color
        },
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'system-ui', 'sans-serif'],
        display: ['var(--font-montserrat)', 'system-ui', 'sans-serif'],
        serif: ['var(--font-cormorant)', 'Georgia', 'serif'],
      },
      fontSize: {
        'display-xl': ['clamp(3.5rem, 7vw, 6rem)', { lineHeight: '1.05', letterSpacing: '-0.01em', fontWeight: '300' }],
        'display-lg': ['clamp(2.5rem, 5vw, 4.5rem)', { lineHeight: '1.1', letterSpacing: '-0.01em', fontWeight: '300' }],
        'display-md': ['clamp(2rem, 4vw, 3rem)', { lineHeight: '1.15', letterSpacing: '0em', fontWeight: '300' }],
        'display-sm': ['clamp(1.5rem, 3vw, 2rem)', { lineHeight: '1.2', letterSpacing: '0em', fontWeight: '400' }],
      },
      spacing: {
        '18': '4.5rem',
        '22': '5.5rem',
        '26': '6.5rem',
        '30': '7.5rem',
        '34': '8.5rem',
        '36': '9rem',
        '40': '10rem',
        '44': '11rem',
        '48': '12rem',
      },
      maxWidth: {
        'prose': '65ch',
        'narrow': '45rem',
        'reading': '72ch',
      },
      animation: {
        'fade-in': 'fadeIn 1s ease-out',
        'slide-up': 'slideUp 1.2s ease-out',
        'scale-in': 'scaleIn 0.8s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        scaleIn: {
          '0%': { opacity: '0', transform: 'scale(0.98)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
      },
      letterSpacing: {
        'ultra-wide': '0.2em',
        'mega-wide': '0.25em',
      },
    },
  },
  plugins: [],
}
export default config

