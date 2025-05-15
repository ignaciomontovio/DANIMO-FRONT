// tailwind.config.js
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        primary: "#f1a7c1",   // color-1
        secondary: "#f9d7ae", // color-2
        accent: "#d4b4e4",    // color-3
        success: "#a9e5b7",   // color-4
        info: "#a4c4d0",      // color-5
      },
    },
  },
  plugins: [],
};
