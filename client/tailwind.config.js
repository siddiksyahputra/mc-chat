/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,js}"],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#4d11ac',
          50: '#f5f1fc',
          100: '#ebe3f9',
          200: '#d7c7f3',
          300: '#c3abed',
          400: '#af8fe7',
          500: '#9b73e1',
          600: '#8757db',
          700: '#733bd5',
          800: '#5f1fcf',
          900: '#4d11ac',
        }
      }
    },
  },
  plugins: [],
}