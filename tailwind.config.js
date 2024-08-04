/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#27272A',
          dark: '#f0f0f0',
        },
      },
    },
  },
  plugins: [],
  darkMode: 'class',
}

