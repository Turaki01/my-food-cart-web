import type { Config } from 'tailwindcss'

export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          50:  '#f0faf4',
          100: '#dcf5e5',
          200: '#b9eacb',
          300: '#85d8a4',
          400: '#4bbd78',
          500: '#25a057',
          600: '#1A6B3A',
          700: '#155a31',
          800: '#114828',
          900: '#0d3a20',
        },
        surface: {
          DEFAULT: '#f5f4ef',
          card:    '#ffffff',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        '2xl': '1rem',
        '3xl': '1.5rem',
        '4xl': '2rem',
      },
    },
  },
  plugins: [],
} satisfies Config
