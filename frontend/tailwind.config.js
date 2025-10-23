/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'op-orange': '#fb923c',
        'op-dark': '#0f172a',
      },
    },
  },
  plugins: [],
}

