/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class', // This enables dark mode via class instead of media query
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Microsoft 365 dark mode colors
        'ms-dark-bg': '#202020',
        'ms-dark-surface': '#1b1b1b',
        'ms-dark-card': '#252525',
        'ms-dark-card-hover': '#2d2d2d',
        'ms-dark-border': '#3b3b3b',
        'ms-dark-border-hover': '#4b4b4b',
        'ms-blue': '#0078d4',
        'ms-blue-hover': '#106ebe',
        'ms-blue-light': '#0078d4',
      }
    },
  },
  plugins: [],
}