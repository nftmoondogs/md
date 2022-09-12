/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  mode: "jit",
  theme: {
    extend: {
      colors: {
        primary: "#00040f",
        creamgreen: "#D7F0D3",
        darkblue: "#0F0C1D",
        secondary: "#00f6ff",
        dimWhite: "rgba(255, 255, 255, 0.7)",
        dimBlue: "rgba(9, 151, 124, 0.1)",
        goldenyellow: "#ffbe00",
        foot: "#100c1c",
        foot2: "#110c1c",
        purple: "#8284c9",
        grey: "#b4b4b4",
        bluel: "#3366CC"
      },
      fontFamily: {
        poppins: ["Poppins", "sans-serif"],
        Aboreto: ['Aboreto', 'cursive'],
        sydney: ['sydney', 'sans-serif'],
        gaz: ['Gazpacho Black'],
        rav: ['Montserrat', 'sans-serif'],
        pt: ['PT Serif', 'serif'],
        mon: ['Montserrat', 'sans-serif'],
      },
    },
    screens: {
      xs: "480px",
      ss: "620px",
      sm: "768px",
      md: "1060px",
      lg: "1200px",
      xl: "1700px",
    },
  },
  plugins: [],
};
