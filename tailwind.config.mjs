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
        // Minimal Professional Colors - Corporate Style
        brand: {
          primary: '#1e3a8a',    // Deep Navy Blue - Güven
          secondary: '#1e3a8a',  // Same Blue - Consistent
          dark: '#0f172a',       // Almost Black - Premium
          light: '#f8fafc',      // Off White - Clean
          gray: '#64748b',       // Neutral Gray
        },
        accent: {
          emergency: '#1e3a8a',  // Blue - Consistent
          success: '#10b981',    // Subtle Green
          info: '#1e3a8a',       // Blue
        }
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', '-apple-system', 'sans-serif'],
      },
      boxShadow: {
        'brand': '0 4px 6px -1px rgba(30, 64, 175, 0.1), 0 2px 4px -1px rgba(30, 64, 175, 0.06)',
        'brand-lg': '0 10px 15px -3px rgba(30, 64, 175, 0.1), 0 4px 6px -2px rgba(30, 64, 175, 0.05)',
      }
    },
  },
  darkMode: "class",
  plugins: [
    heroui({
      themes: {
        light: {
          colors: {
            primary: {
              DEFAULT: "#1e3a8a",
              foreground: "#ffffff",
            },
            secondary: {
              DEFAULT: "#1e3a8a",
              foreground: "#ffffff",
            },
            danger: {
              DEFAULT: "#1e3a8a",
              foreground: "#ffffff",
            },
            success: {
              DEFAULT: "#10b981",
              foreground: "#ffffff",
            },
          },
        },
      },
    }),
  ],
};

export default config;
