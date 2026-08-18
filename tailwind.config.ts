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
        spice: {
          50:  '#fdf5ed',
          100: '#fbe7d3',
          200: '#f5c99e',
          300: '#eda869',
          400: '#e4863f',
          500: '#d66b22',
          600: '#b8541a',
          700: '#934216',
          800: '#763617',
          900: '#622d15',
        },
        surface: {
          DEFAULT: '#faf6ef',
          card:    '#ffffff',
          ink:     '#1c1a16',
        },
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'Inter', 'Segoe UI', 'sans-serif'],
        display: ['Plus Jakarta Sans', 'Inter', 'Segoe UI', 'sans-serif'],
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
