/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    'node_modules/flowbite-react/lib/esm/**/*.js'],
  theme: {
    extend: {
      fontFamily: {
        quicksand: ['"Quicksand"', 'sans-serif'],
        rubiksh: ['"Rubik Doodle Shadow"', 'sans-serif'],
      },
      colors: {
        'darksurf': {
          100: '#121212',
          200: '#282828',
          300: '#3f3f3f',
          400: '#575757',
          500: '#717171',
          600: '#8b8b8b',
        },
        'primary': {
          100: '#3e16ab',
          200: '#5a32b5',
          300: '#714abf',
          400: '#8763c9',
          500: '#9c7cd2',
          600: '#b195db',
        },
        'darksurmix': {
          100: '#191420',
          200: '#2e2935',
          300: '#45404b',
          400: '#5c5862',
          500: '#75727a',
          600: '#8f8c93',
        }
      }
    },
  },
  plugins: [require('flowbite/plugin')
  ],
}