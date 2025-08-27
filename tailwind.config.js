/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        coffee: {
          50: '#fdf6f0',
          100: '#f7e6d3',
          200: '#edc9a3',
          300: '#dfa774',
          400: '#d18b4c',
          500: '#b8703d',
          600: '#a05a2f',
          700: '#824729',
          800: '#6a3a26',
          900: '#573122',
        },
        tech: {
          50: '#f0f9ff',
          100: '#e0f2fe',
          200: '#bae6fd',
          300: '#7dd3fc',
          400: '#38bdf8',
          500: '#0ea5e9',
          600: '#0284c7',
          700: '#0369a1',
          800: '#075985',
          900: '#0c4a6e',
        }
      }
    },
  },
  plugins: [],
};
