export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        red: {
          DEFAULT: '#C0392B',
          dark: '#96281B',
          mid: '#E74C3C',
          light: '#FDECEA',
        },
        gold: {
          DEFAULT: '#D4A017',
          dark: '#B8870F',
          light: '#FDF6DC',
        },
        brand: {
          bg: '#FDF8F7',
          border: '#E8D5D3',
        },
        primary: {
          DEFAULT: '#C0392B',
          light: '#FDECEA',
          dark: '#96281B',
        },
        accent: {
          DEFAULT: '#D4A017',
          light: '#FDF6DC',
        },
      },
      fontFamily: {
        sans: ['DM Sans', 'sans-serif'],
        display: ['Nunito', 'sans-serif'],
      },
      boxShadow: {
        soft: '0 10px 24px rgba(192, 57, 43, 0.10)',
      },
    },
  },
  plugins: [],
}
