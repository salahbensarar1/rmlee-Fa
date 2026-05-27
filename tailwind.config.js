/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        forest: '#123225',
        'forest-light': '#1d4f3a',
        leaf: '#2f8f6f',
        'leaf-light': '#5daf8f',
        gold: '#cfa347',
        'gold-bright': '#e6bc66',
        cocoa: '#5d4124',
        'cocoa-light': '#7b5a37',
        cream: '#f8f1e6',
        sand: '#efe4d4',
        charcoal: '#1f2321',
      },
      fontFamily: {
        sans: ['Outfit', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        serif: ['Cormorant Garamond', 'ui-serif', 'serif'],
      },
      borderRadius: {
        xl: '18px',
        '2xl': '24px',
        '3xl': '30px',
      },
      boxShadow: {
        premium: '0 20px 55px rgba(18, 50, 37, 0.18)',
        'premium-lg': '0 28px 80px rgba(18, 50, 37, 0.24)',
        soft: '0 10px 25px rgba(18, 50, 37, 0.1)',
        lift: '0 14px 35px rgba(22, 30, 26, 0.14)',
      },
      animation: {
        'float-slow': 'float-slow 7s ease-in-out infinite',
      },
      keyframes: {
        'float-slow': {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-12px)' },
        },
      },
    },
  },
  plugins: [],
}
