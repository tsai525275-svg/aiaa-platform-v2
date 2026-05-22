import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      colors: {
        ink: "#050608",
        graphite: "#11141a",
        mist: "#eef2f7",
        steel: "#9ca6b5",
        void: "#090b10"
      }
    }
  },
  plugins: []
};

export default config;
