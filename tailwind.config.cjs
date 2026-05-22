/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ['class'],
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: '#01696f',
        'primary-foreground': '#f7f6f2',
        'warm-off': '#f7f6f2',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        md: '6px',
        lg: '10px',
      },
    },
  },
  plugins: [],
};
