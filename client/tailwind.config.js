/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        pastel: {
          light: '#f3f4f6', // Light gray for backgrounds
          main: '#e0e7ff', // Soft blue for buttons
        },
      },
    },
  },
  plugins: [require('daisyui'),],
}

