/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        islamic: {
          green: '#059669',
          gold: '#F59E0B',
          light: '#F9FAFB',
          dark: '#1F2937',
        }
      },
    },
  },
  plugins: [],
}