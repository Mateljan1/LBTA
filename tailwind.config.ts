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
        // LBTA Aman-Level Luxury Palette - Blueprint Standard
        lbta: {
          // BLUEPRINT PRIMARY COLORS
          primary: '#1A1A1A',     // Primary text
          secondary: '#6B6B6B',   // Secondary text
          coral: '#E8956F',       // Sophisticated accent (Blueprint)
          'coral-dark': '#D67D5A', // Coral hover state
          
          // BLUEPRINT BACKGROUNDS
          bone: '#FDFCFA',        // Background 1 (bone white)
          sand: '#F4EDE4',        // Background 2 (warm sand)
          charcoal: '#2B2B2B',    // Background 3 (dark sections)
          
          // LEGACY ALIASES (backwards compatibility)
          white: '#FDFCFA',
          black: '#1A1A1A',
          orange: '#E8956F',      // Now points to coral
          burnt: '#D67D5A',       // Now points to coral-dark
          cream: '#F4EDE4',
        },
        vylo: {
          orange: '#F26522',      // VYLO brand distinct color
        },
      },
      fontFamily: {
        // Homepage Rebuild Font System
        headline: ['Playfair Display', 'Georgia', 'serif'],      // Playfair for headlines
        body: ['Work Sans', 'system-ui', 'sans-serif'],          // Work Sans for everything else
        // Legacy aliases (for pages not yet updated)
        display: ['Playfair Display', 'Georgia', 'serif'],
        serif: ['Playfair Display', 'Georgia', 'serif'],
        sans: ['Work Sans', 'system-ui', 'sans-serif'],
        accent: ['Work Sans', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        // Blueprint Typography System (Exact Scales)
        'display': ['clamp(48px, 9vw, 84px)', { lineHeight: '0.95', letterSpacing: '-0.5px', fontWeight: '300' }],
        'headline': ['clamp(40px, 6vw, 64px)', { lineHeight: '1.1', letterSpacing: '-0.3px', fontWeight: '400' }],
        'headline-md': ['clamp(36px, 5vw, 56px)', { lineHeight: '1.1', letterSpacing: '-0.3px', fontWeight: '400' }],
        'headline-sm': ['clamp(32px, 4vw, 48px)', { lineHeight: '1.1', letterSpacing: '-0.3px', fontWeight: '400' }],
        'subhead': ['clamp(28px, 3.5vw, 32px)', { lineHeight: '1.2', letterSpacing: '-0.2px', fontWeight: '400' }],
        'subhead-sm': ['clamp(24px, 3vw, 28px)', { lineHeight: '1.2', letterSpacing: '-0.2px', fontWeight: '400' }],
        'body-lg': ['20px', { lineHeight: '1.8', letterSpacing: '0.1px', fontWeight: '400' }],
        'body': ['18px', { lineHeight: '1.8', letterSpacing: '0.1px', fontWeight: '400' }],
        'body-sm': ['16px', { lineHeight: '1.8', letterSpacing: '0.1px', fontWeight: '400' }],
        'eyebrow': ['11px', { lineHeight: '1.4', letterSpacing: '2px', fontWeight: '400' }],
      },
      spacing: {
        // Blueprint Spacing System (12px base unit)
        '15': '60px',    // 12 × 5
        '18': '72px',    // 12 × 6
        '20': '80px',    // 12 × 6.67
        '22': '88px',    // Custom
        '24': '96px',    // 12 × 8
        '26': '104px',   // Custom
        '28': '112px',   // Custom
        '30': '120px',   // 12 × 10 (Blueprint outer margins)
        '36': '144px',   // 12 × 12
        '40': '160px',   // 12 × 13.33 (Blueprint section spacing medium)
        '48': '192px',   // 12 × 16
        '60': '240px',   // 12 × 20 (Blueprint section padding desktop)
        '72': '288px',   // 12 × 24
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

