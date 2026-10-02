import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        navy: { DEFAULT: "#0A1628", 2: "#0F1F37", 3: "#16294A" },
        mist: "#F0F2F5",
        slate: { DEFAULT: "#8A9BB0", dark: "#5B6B80" },
        line: "#DCE1E8",
      },
      fontFamily: {
        display: ['"Syne Variable"', "Syne", "system-ui", "sans-serif"],
        sans: ['"Inter Variable"', "Inter", "system-ui", "sans-serif"],
      },
      maxWidth: { page: "84rem" },
    },
  },
  plugins: [],
};
export default config;
