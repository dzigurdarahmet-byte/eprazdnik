import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        purple: {
          DEFAULT: "#7c3aed",
          50: "#f3eeff",
          700: "#6d28d9",
        },
        pink: {
          DEFAULT: "#ec4899",
          50: "#fdf0f7",
        },
      },
      fontFamily: {
        sans: ['"Manrope"', "system-ui", "-apple-system", "sans-serif"],
      },
    },
  },
  plugins: [],
};

export default config;
