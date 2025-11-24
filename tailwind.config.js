/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        'display': ['Cormorant Garamond', 'serif'],
        'body': ['DM Sans', 'sans-serif'],
        'accent': ['Delius', 'cursive'],
        // Keep legacy name for backwards compatibility
        'delius': ['Delius', 'cursive'],
      },
      colors: {
        // Enhanced arch-gray with warm undertones
        'arch-gray': {
          50: '#FAFAF8',   // Warmed
          100: '#F5F3EF',  // Cream undertone
          200: '#E8E6E0',
          300: '#D4D2CC',
          400: '#A3A099',
          500: '#737068',
          600: '#524F47',
          700: '#403D36',
          800: '#262420',
          900: '#171614',
        },
        // Warm accent colors
        'warm': {
          cream: '#FDF8F3',
          sand: '#E8DFD5',
          terracotta: '#C4A484',
          stone: '#A89F91',
        },
        // Blue accent palette
        'accent': {
          DEFAULT: '#74C5FF',
          soft: '#B8DFFF',
          muted: '#5BA3D9',
          dark: '#3D8BC4',
        },
      },
      // Animation timing functions
      transitionTimingFunction: {
        'smooth': 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
        'dramatic': 'cubic-bezier(0.76, 0, 0.24, 1)',
        'bounce-soft': 'cubic-bezier(0.175, 0.885, 0.32, 1.275)',
      },
      // Animation durations
      transitionDuration: {
        'fast': '300ms',
        'normal': '400ms',
        'slow': '600ms',
        'page': '800ms',
      },
    },
  },
  plugins: [],
}
