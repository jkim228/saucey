/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        canvas: '#FAF7F2',
        paper: '#FFFDF9',
        brand: '#B8643F',
        butter: {
          DEFAULT: '#FDEED8',
          border: '#F0D3AA',
          text: '#7A3518',
          edge: '#D9A27A',
        },
        planned: {
          DEFAULT: '#E3DDE0',
          border: '#DAD3E3',
          text: '#695856',
        },
        neutral: {
          DEFAULT: '#EBE8DE',
          border: '#DDD8CE',
          text: '#57534E',
        },
        action: '#97482A',
        surface: {
          border: '#F2EEE6',
          inset: '#FBF9F5',
          dashed: '#E5E2DA',
          control: '#EBE8DE',
        },
        ink: {
          day: '#5A3E2B',
          muted: '#78716C',
          faint: '#D6D3CD',
          label: '#A65F44',
        },
      },
      fontFamily: {
        sans: ['"Inter Variable"', 'Inter', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
        display: ['Gloock', 'Georgia', 'serif'],
        serif: ['"Newsreader Variable"', 'Newsreader', 'Georgia', 'serif'],
        label: ['"DM Sans Variable"', '"DM Sans"', '-apple-system', 'sans-serif'],
      },
      width: {
        'day-card': 'calc((100% + 4px) / 1.5)',
        'weekend-card': 'calc(100% - (100% + 4px) / 1.5 + 4px)',
      },
      height: {
        'day-card': '235px',
      },
      boxShadow: {
        card: '0 2px 8px -2px rgba(45, 42, 38, 0.05), 0 1px 3px rgba(45, 42, 38, 0.04)',
      },
    },
  },
  plugins: [],
}
