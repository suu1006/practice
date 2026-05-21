import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./features/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        surface: "#f7f8fb",
        ink: "#18202f",
        muted: "#667085",
        brand: "#2563eb",
        accent: "#0f766e"
      }
    }
  },
  plugins: []
};

export default config;
