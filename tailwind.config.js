/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      screens: {
        mainxl: "1050px",
      },
    },
    fontFamily: {
      'Noto': ['Noto Sans Georgian'],
    },
  },
  plugins: [],
};
