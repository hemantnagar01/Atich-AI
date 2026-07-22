/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: '#0a0a0a', // neutral-950
        surface: '#171717',    // neutral-900
        border: '#262626',     // neutral-800
        accent: {
          start: '#2dd4bf', // Teal-400 (Greenish tone)
          end: '#0d9488'    // Teal-600
        },
        text: {
          primary: '#fafafa',  // neutral-50
          secondary: '#a3a3a3' // neutral-400
        }
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
