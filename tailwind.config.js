/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: '#f8f9fa',
        gridlines: '#dee2e6',
        text: '#343a40',
        rainfall: {
          none: '#f1f8ff',
          light: '#9ecae1',
          medium: '#4292c6',
          heavy: '#084594',
        }
      },
      gridTemplateColumns: {
        '31': 'repeat(31, minmax(0, 1fr))',
        '12': 'repeat(12, minmax(0, 1fr))',
        '7': 'repeat(7, minmax(0, 1fr))',
      }
    },
  },
  plugins: [],
}
