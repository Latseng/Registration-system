/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        mainColor: "#51b6b6",
        mainColorLight: "#99d9d9",
      },
      keyframes: {
        slideInRight: {
          "0%": { transform: "translateX(20%)", opacity: "0" },
          "100%": { transform: "translateX(0)", opacity: "1" },
        },
        slideInLeft: {
          "0%": { transform: "translateX(-20%)", opacity: "0" },
          "100%": { transform: "translateX(0)", opacity: "1" },
        },
      },
      animation: {
        slideInRight: "slideInRight 1s ease-out forwards",
        slideInLeft: "slideInLeft 1s ease-out forwards",
      },
    },
  },
  plugins: [],
};

