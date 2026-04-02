/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        gray: {
          950: '#0a0a0f',
          900: '#111118',
          800: '#1a1a25',
          700: '#252535',
          600: '#33334a',
          500: '#55556a',
          400: '#88889a',
          300: '#aaaabc',
          200: '#ccccdd',
          100: '#eeeef5',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
