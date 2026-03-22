/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#152033",
        accent: "#df6d2d",
        sand: "#f6efe6",
        teal: "#0f766e",
        mist: "#e5f1ef"
      },
      boxShadow: {
        soft: "0 20px 50px rgba(21, 32, 51, 0.08)"
      },
      fontFamily: {
        display: ["Georgia", "Cambria", "Times New Roman", "serif"],
        body: ["Trebuchet MS", "Segoe UI", "sans-serif"]
      }
    }
  },
  plugins: []
};
