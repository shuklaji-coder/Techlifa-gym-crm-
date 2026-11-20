/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ['class'],
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        background: 'var(--bg-main)',
        surface: 'var(--bg-surface)',
        'surface-elevated': 'var(--bg-surface-elevated)',
        'surface-card': 'var(--bg-surface-card)',
        border: 'var(--border-color)',
        'border-highlight': 'var(--border-highlight)',
        primary: {
          DEFAULT: 'var(--primary-color)',
          hover: 'var(--primary-hover)',
          muted: 'var(--primary-muted)',
          foreground: 'var(--primary-foreground)',
        },
        accent: {
          lime: '#C6FF00',
          cyan: '#00F0FF',
          amber: '#FFB800',
          rose: '#FF3366',
          violet: '#8B5CF6',
          emerald: '#10B981',
        },
        brand: {
          50: '#F7FEE7',
          100: '#ECFCCB',
          200: '#D9F99D',
          300: '#BEF264',
          400: '#A3E635',
          500: '#C6FF00', // Electric Lime
          600: '#65A30D',
          700: '#4D7C0F',
          800: '#3F6212',
          900: '#365314',
          950: '#1A2E05',
        },
        dark: {
          950: '#07090E',
          900: '#0B0E14', // Deep Charcoal Canvas
          850: '#0E131C',
          800: '#121722', // Card Surface
          750: '#171E2C', // Elevated Card
          700: '#1F283B', // Borders / Dividers
          600: '#2A364E',
          500: '#475569',
          400: '#94A3B8',
          300: '#CBD5E1',
          200: '#E2E8F0',
          100: '#F1F5F9',
          50: '#F8FAFC',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
        display: ['Plus Jakarta Sans', 'Inter', 'sans-serif'],
      },
      borderRadius: {
        '2xl': '1rem',
        '3xl': '1.5rem',
      },
      boxShadow: {
        'neon-glow': '0 0 25px -5px var(--glow-color)',
        'neon-subtle': '0 0 15px -3px var(--glow-color)',
        'inner-glow': 'inset 0 1px 1px 0 rgba(255, 255, 255, 0.08)',
        'card-elevated': '0 10px 30px -10px rgba(0, 0, 0, 0.5), 0 0 1px 1px rgba(255, 255, 255, 0.05)',
      },
      animation: {
        'pulse-subtle': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'shimmer': 'shimmer 2s linear infinite',
      },
      keyframes: {
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        }
      }
    },
  },
  plugins: [],
}
