/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          50:  '#eef2ff',
          100: '#e0e7ff',
          400: '#818cf8',
          500: '#6366f1',
          600: '#4f46e5',
          700: '#4338ca',
        },
        sleep:  { DEFAULT: '#6366f1', light: '#e0e7ff' },
        feed:   { DEFAULT: '#f59e0b', light: '#fef3c7' },
        awake:  { DEFAULT: '#10b981', light: '#d1fae5' },
        diaper: { DEFAULT: '#8b5cf6', light: '#ede9fe' },
      },
      fontFamily: { sans: ['Inter', 'system-ui', 'sans-serif'] },
    },
  },
  plugins: [],
}
