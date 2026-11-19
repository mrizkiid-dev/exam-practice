import typography from '@tailwindcss/typography'

/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{vue,js}'],
  theme: {
    extend: {},
  },
  // `prose` classes for rendering markdown notes
  plugins: [typography],
}
