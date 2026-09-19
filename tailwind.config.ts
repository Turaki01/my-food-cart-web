import type { Config } from 'tailwindcss'

export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          50:  '#ecfdf5',
          100: '#d1fae5',
          200: '#a7f3d0',
          300: '#6ee7b7',
          400: '#34d399',
          500: '#10b981',
          600: '#059669',
          700: '#047857',
          800: '#065f46',
          900: '#064e3b',
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
          DEFAULT: '#fafafa',
          card:    '#ffffff',
          ink:     '#111827',
        },
        ink: '#111827',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Geist', 'Inter', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        sm:      '3px',
        DEFAULT: '4px',
        md:      '6px',
        lg:      '8px',
        xl:      '10px',
        '2xl':   '12px',
        '3xl':   '16px',
      },
    },
  },
  plugins: [],
} satisfies Config
