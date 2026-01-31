/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    container: { center: true, padding: '2rem' },
    extend: {
      colors: {
        brand: {
          50: '#fff7ed',
          100: '#fde7d9',
          200: '#fad1b8',
          300: '#f7b78f',
          400: '#f08f66',
          500: '#ef6f4b',
          600: '#e0553a',
          700: '#c6432f'
        },
        accent: {
          50: '#f5f3ff',
          100: '#ede9fe',
          300: '#d6bcfa',
          500: '#a78bfa'
        },
        pinks: {
          50: '#fff1f2',
          100: '#ffe4e6',
          300: '#fda4af',
          500: '#fb7185'
        },
        slate: {
          900: '#081325',n
        }
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui']
      },
      keyframes: {
        float: {
          '0%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-6px)' },
          '100%': { transform: 'translateY(0px)' }
        },
        pulseGlow: {
          '0%': { boxShadow: '0 0 0px rgba(124,58,237, 0.0)' },
          '70%': { boxShadow: '0 8px 40px rgba(124,58,237, 0.12)' },
          '100%': { boxShadow: '0 0 0px rgba(124,58,237, 0.0)' }
        }
      },
      animation: {
        float: 'float 4s ease-in-out infinite',
        pulseGlow: 'pulseGlow 2.5s ease-in-out infinite'
      }
    },
  },
  plugins: [],
}
