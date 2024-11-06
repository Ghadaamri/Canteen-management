/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
  "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        green: "#A7E0E0",
      },
      fontFamily : {
        primary: "Lato" ,
      }
    },
  },
  plugins: [],
}
