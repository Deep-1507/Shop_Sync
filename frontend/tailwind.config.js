/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-out forwards',
      },
      fontFamily: {
        Anton: ["Anton SC", ,"sans-serif"],
        sans: ['Open Sans', 'Arial', 'sans-serif'], // Add your Google Font here
      },
      colors :{
          walmartBlue: '#0071CE',
          walmartYellow: '#FFC120',
          TryOnButtonColor: '#F0F600',
      },
      height:{
        '192':'45rem',
      }
      
    },
  },
  plugins: [],
}

