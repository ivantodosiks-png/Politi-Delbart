import type { Config } from "tailwindcss";

export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      boxShadow: {
        glow: "0 0 0 1px rgba(56,189,248,.35), 0 10px 30px rgba(56,189,248,.12)"
      }
    }
  },
  plugins: []
} satisfies Config;

