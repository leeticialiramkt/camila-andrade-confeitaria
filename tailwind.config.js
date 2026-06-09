/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        marsala: {
          DEFAULT: '#5c061e',
          light: '#7a0828',
          dark: '#3e0414',
        },
        gold: {
          DEFAULT: '#b8860b',
          light: '#d4a017',
          dark: '#8b6508',
        },
        offwhite: '#fffdfa',
        cream: '#fdfbf7',
      },
      fontFamily: {
        serif: ['Playfair Display', 'Georgia', 'serif'],
        sans: ['Lato', 'Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
