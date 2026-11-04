import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-body)", "Segoe UI", "sans-serif"],
        display: ["var(--font-display)", "Segoe UI", "sans-serif"],
      },
      boxShadow: {
        neon: "0 0 32px rgba(34, 211, 238, 0.22)",
      },
    },
  },
  plugins: [],
};

export default config;
