/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    './app/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          primary: '#5660ff',
          accent: '#00c4ff',
          cyan: '#34f5d2'
        }
      },
      fontFamily: {
        heading: ['Poppins','var(--font-sans)','system-ui','sans-serif'],
        body: ['Open Sans','var(--font-sans)','system-ui','sans-serif']
      },
      container: { center: true, padding: '1rem' },
      boxShadow: {
        glow: '0 0 0 1px rgba(86,96,255,.4), 0 8px 30px -8px rgba(0,196,255,.45)'
      }
    }
  },
  plugins: []
};
