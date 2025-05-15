/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: '#024b7e',
        secondary: '#1e3f66',
      },
    },
  },
  plugins: [],
};