import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        soft: {
          pink: "#F8E8E8",
          "pink-light": "#FDF2F2",
          "pink-dark": "#F5D5D5",
          purple: "#E8E0F5",
          "purple-light": "#F3EDFA",
          "purple-dark": "#D9C8EB",
          blue: "#E0E8F5",
          "blue-light": "#EDF3FA",
          "blue-dark": "#C8D9EB",
          lavender: "#F0E8F5",
          "lavender-light": "#F8F3FA",
          "lavender-dark": "#E5D5EB"
        }
      }
    }
  },
  plugins: []
};

export default config;


