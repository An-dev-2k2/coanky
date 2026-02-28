/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ['class'],
  content: ['./index.html', './src/**/*.{vue,cjs,js,ts,jsx,tsx}'],
  theme: {
    extend: {
      maxWidth: {
        'screen-xl': '1280px',
        'screen-2xl': '1536px',
        'screen-3xl': '1920px',
      },
      screens: {
        xxs: '300px',
        '3xl': '1600px',
        '4xl': '1920px',
        '5xl': '2560px',
        '6xl': '3200px',
      },
    },
    screens: {
      xs: '320px',
      sm: '640px',
      md: '768px',
      lg: '1024px',
      xl: '1280px',
      '2xl': '1536px',
    },
  },
  plugins: [],
}
