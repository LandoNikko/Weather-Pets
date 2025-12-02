/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Pixelify Sans"', 'cursive'],
      },
      colors: {
        background: '#f3f3e9', // Base "white" as requested
        'panel-bg': '#fff9f0', // Slightly warmer for panels
        primary: '#ffcbc7',
        'primary-dark': '#ffa8a2',
        secondary: '#d4e6f7',
        accent: '#fdf4c4',
        text: '#594a4e',
        border: '#594a4e',
        success: '#cdeac0', 
        warning: '#ffe5d1',
      },
      boxShadow: {
        'pixel': '4px 4px 0px 0px #594a4e',
        'pixel-sm': '2px 2px 0px 0px #594a4e',
        'pixel-inset': 'inset 4px 4px 0px 0px rgba(0,0,0,0.1)',
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'bounce-slow': 'bounce 3s infinite',
        'walk': 'walk 1s steps(2) infinite',
        'pixel-bounce': 'pixel-bounce 1s steps(2) infinite',
        'spin-slow': 'spin 8s linear infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        walk: {
          '0%': { transform: 'rotate(-3deg)' },
          '100%': { transform: 'rotate(3deg)' },
        },
        'pixel-bounce': {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-2px)' },
        }
      }
    },
  },
  plugins: [],
}
