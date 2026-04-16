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
        bg: { primary: "#0d1117", secondary: "#161b22", card: "#1c2333", hover: "#21262d" },
        accent: {
          purple: "#6e40c9",
          blue: "#2188ff",
          green: "#28a745",
          orange: "#e36209",
          red: "#d73a49",
          teal: "#1abc9c",
          yellow: "#f0b429",
        },
        border: "#30363d",
      },
    },
  },
  plugins: [],
};
export default config;
