/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        coffee: {
          50: '#fffaf5',
          100: '#fdf0e4',
          200: '#f4d5bf',
          300: '#e5b98e',
          400: '#d79b64',
          500: '#ca8246',
          600: '#b76531',
          700: '#9e4f24',
          800: '#7f3f1f',
          900: '#5f2f1b',
        },
        cream: {
          50: '#fffdf8',
          100: '#fff7eb',
          200: '#ffe8c8',
          300: '#f9d5a7',
          400: '#f0bb80',
          500: '#e8a54d',
          600: '#d78f31',
          700: '#b97525',
          800: '#945d20',
          900: '#6f441a',
        },
      },
      boxShadow: {
        'soft': '0 12px 40px -18px rgba(108, 62, 31, 0.35)',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Playfair Display', 'serif'],
      },
    },
  },
  plugins: [],
}
