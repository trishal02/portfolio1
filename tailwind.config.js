/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        'racing-red': 'var(--racing-red)',
        'racing-red-light': 'var(--racing-red-light)',
        'racing-red-dark': 'var(--racing-red-dark)',
        'asphalt': 'var(--asphalt)',
        'asphalt-light': 'var(--asphalt-light)',
        'asphalt-lighter': 'var(--asphalt-lighter)',
        'metallic-gray': 'var(--metallic-gray)',
        'metallic-gray-light': 'var(--metallic-gray-light)',
        'white': 'var(--white)',
        'yellow': 'var(--yellow)',
        'green': 'var(--green)',
      },
      fontFamily: {
        display: ['var(--font-display)', 'sans-serif'],
        body: ['var(--font-body)', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
