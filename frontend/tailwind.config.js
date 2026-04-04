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
          bg: '#0C0C0C', // Base dark
          card: '#141414', // Surface dark
          accent: '#F59E0B', // amber-500
          text: '#FAFAFA', // zinc-50
          muted: '#A1A1AA', // zinc-400
          border: '#262626', // zinc-800
        }
      },
      fontFamily: {
        sans: ['DM Sans', 'sans-serif'],
        satoshi: ['Satoshi', 'sans-serif'],
        jetbrains: ['JetBrains Mono', 'monospace'],
      },
    },
  },
  plugins: [],
}
