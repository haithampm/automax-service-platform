import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        bg: {
          primary: "#0d1117",
          secondary: "#161b22",
          card: "#1c2333",
          hover: "#21262d",
          elevated: "#222938",
        },
        accent: {
          purple: "#6e40c9",
          blue: "#2188ff",
          green: "#28a745",
          orange: "#e36209",
          red: "#d73a49",
          teal: "#1abc9c",
          yellow: "#f0b429",
        },
        border: {
          DEFAULT: "#30363d",
          muted: "#21262d",
        },
        text: {
          primary: "#e6edf3",
          secondary: "#8b949e",
          muted: "#6e7681",
        },
      },
      boxShadow: {
        sm: "0 1px 2px rgba(0, 0, 0, 0.22)",
        md: "0 8px 24px rgba(0, 0, 0, 0.26)",
        lg: "0 18px 48px rgba(0, 0, 0, 0.34)",
      },
      borderRadius: {
        lg: "0.75rem",
        xl: "1rem",
        "2xl": "1.25rem",
      },
      fontFamily: {
        sans: ["Inter", "sans-serif"],
      },
    },
  },
  plugins: [],
};

export default config;
