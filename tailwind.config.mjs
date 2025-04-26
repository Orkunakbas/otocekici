// tailwind.config.mjs - ESM format
import { heroui } from "@heroui/react";

/** @type {import('tailwindcss').Config} */
const config = {
  content: [
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./node_modules/@heroui/theme/dist/**/*.{js,ts,jsx,tsx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#22015E',
          50: '#22015E',
          100: '#22015E',
          200: '#22015E',
          300: '#22015E',
          400: '#22015E',
          500: '#22015E',
          600: '#22015E',
          700: '#22015E',
          800: '#22015E',
          900: '#7672FD',
        },
        secondary: {
          DEFAULT: '#1c1c1c', //text
          50: '#e4e6ff', // hover
         100: '#eff0ff', // arka plan
         200: '#eff0ff', // arka plan
         300: '#eff0ff', // arka plan
         400: '#eff0ff', // arka plan
         500: '#eff0ff', // arka plan
         600: '#eff0ff', // arka plan
         700: '#eff0ff', // arka plan
         800: '#eff0ff', // arka plan
 
        }

      },

    },
  },
  darkMode: "class",
  plugins: [heroui()],
};

export default config;
