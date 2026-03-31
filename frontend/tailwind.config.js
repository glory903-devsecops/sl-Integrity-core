/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        sl: {
          bg: '#0F172A', // Deep Navy
          card: 'rgba(30, 41, 59, 0.7)', // Slate 800 with glass opacity
          accent: '#3B82F6', // Blue 500
          text: '#F8FAFC', // Slate 50
          muted: '#94A3B8', // Slate 400
          border: 'rgba(255, 255, 255, 0.1)',
        }
      },
      backdropBlur: {
        xs: '2px',
      }
    },
  },
  plugins: [],
}
