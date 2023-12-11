/** @type {import('tailwindcss').Config} */
export default {
    content: [
    "./*.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'primary': '#181429',
        'secondary': '#030311',
        'textclr': '#F1F1FF99',
        'active': '#8279A8',
        'main': '090A15'
      },
    },
  },
  plugins: [],
}

