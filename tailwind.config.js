/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    screens: {
      mobile: "320px",
      tablet: "700px",
      laptop: "1024px",
    },
    extend: {},
  },
  plugins: [],
};
