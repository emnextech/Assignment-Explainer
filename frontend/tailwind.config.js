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
      keyframes: {
        revealUp: {
          "0%": { opacity: "0", transform: "translateY(20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" }
        },
        revealRight: {
          "0%": { opacity: "0", transform: "translateX(-18px)" },
          "100%": { opacity: "1", transform: "translateX(0)" }
        },
        softPulse: {
          "0%, 100%": { opacity: "0.45" },
          "50%": { opacity: "0.95" }
        }
      },
      animation: {
        "reveal-up": "revealUp 640ms ease-out both",
        "reveal-right": "revealRight 640ms ease-out both",
        "soft-pulse": "softPulse 2.2s ease-in-out infinite"
      },
      fontFamily: {
        display: ["Georgia", "Cambria", "Times New Roman", "serif"],
        body: ["Trebuchet MS", "Segoe UI", "sans-serif"]
      }
    }
  },
  plugins: []
};
