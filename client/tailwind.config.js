/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        montserrat: ['Montserrat', 'sans-serif'],
        dmsans : ['DM Sans', 'sans-serif'],
      },
      keyframes: {
        scrollUp: {
          '0%': { 
            transform: 'translateY(0)' 
          },
          '100%': { 
            transform: 'translateY(-50%)' 
          },
        },
      },
      animation: {
        'scroll-up': 'scrollUp 30s linear infinite',
      },
    },
  },
  plugins: [],
};
