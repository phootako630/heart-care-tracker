/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontSize: {
        'elder-xs': ['18px', { lineHeight: '28px' }],
        'elder-sm': ['20px', { lineHeight: '30px' }],
        'elder-base': ['22px', { lineHeight: '34px' }],
        'elder-lg': ['28px', { lineHeight: '40px' }],
        'elder-xl': ['32px', { lineHeight: '44px' }],
        'elder-2xl': ['36px', { lineHeight: '48px' }],
        'elder-display': ['48px', { lineHeight: '56px' }],
        'elder-number': ['56px', { lineHeight: '64px' }],
      },
      spacing: {
        'touch': '60px',
        'touch-lg': '70px',
        'touch-xl': '80px',
      },
      colors: {
        primary: '#006D77',
        secondary: '#83C5BE',
        accent: '#E29578',
        alert: '#D62828',
        surface: '#F1FAEE',
        dark: '#1D3557',
      }
    },
  },
  plugins: [],
}