/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          indigo: '#4F59CC',
          navy: '#1D2476',
          mid: '#3C45B1',
          light: '#737BDE',
          pale: '#A0A5E9',
          periwinkle: '#C7D2FE',
          ghost: '#ECEEFE',
          secondary: '#CDCDE8',
          shaft: '#111827',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
      fontSize: {
        'app-xs':  ['12px', { lineHeight: '18px', letterSpacing: '0.01em' }],
        'app-sm':  ['14px', { lineHeight: '20px' }],
        'app-base': ['15px', { lineHeight: '22px' }],
        'app-md':  ['16px', { lineHeight: '24px' }],
      }
    },
  },
  plugins: [],
}
