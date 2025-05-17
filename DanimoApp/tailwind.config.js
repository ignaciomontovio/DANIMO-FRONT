// tailwind.config.js
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    fontFamily: {
      sans: ["Inter", "sans-serif"],
      serif: ["Merriweather", "serif"],
      mono: ["Menlo", "monospace"],
    },

    extend: {
      colors: {
        primary: "#d996ad",   // color-1 rosa
        secondary: "#f9d7ae", // color-2 amarillo
        accent: "#d4b4e4",    // color-3 violeta
        success: "#8ebf99",   // color-4 verde
        info: "#a4c4d0",      // color-5 azul
      },
    },
  },
  plugins: [],
};
