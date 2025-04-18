/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {
      borderRadius: {
        'button': '0.5rem',
      },
      colors: {
        'primary': '#f97316', // orange-500
        'primary-hover': '#ea580c', // orange-600
        'secondary': '#22c55e', // green-500
        'secondary-hover': '#16a34a', // green-600
      },
      container: {
        center: true,
        padding: {
          DEFAULT: '1rem',
          sm: '2rem',
          lg: '4rem',
          xl: '5rem',
          '2xl': '6rem',
        },
      }
    },
  },
  plugins: [],
}