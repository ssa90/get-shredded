/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        emerald: {
          400: '#34d399',
          500: '#10b981',
        },
        gray: {
          50: 'rgb(var(--gray-50-rgb) / <alpha-value>)',
          100: 'rgb(var(--gray-100-rgb) / <alpha-value>)',
          200: 'rgb(var(--gray-200-rgb) / <alpha-value>)',
          300: 'rgb(var(--gray-300-rgb) / <alpha-value>)',
          400: 'rgb(var(--gray-400-rgb) / <alpha-value>)',
          500: 'rgb(var(--gray-500-rgb) / <alpha-value>)',
          600: 'rgb(var(--gray-600-rgb) / <alpha-value>)',
          700: 'rgb(var(--gray-700-rgb) / <alpha-value>)',
          800: 'rgb(var(--gray-800-rgb) / <alpha-value>)',
          900: 'rgb(var(--gray-900-rgb) / <alpha-value>)',
          950: 'rgb(var(--gray-950-rgb) / <alpha-value>)',
        },
      },
    },
  },
  plugins: [],
}
