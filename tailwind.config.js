/** @type {import('tailwindcss').Config} */
export default {
  prefix: 'tw-', // Avoid conflicts with existing CSS
  content: [
    './index.html',
    './src/**/*.{vue,js,ts,jsx,tsx}'
  ],
  theme: {
    extend: {
      colors: {
        'aerospace-blue': {
          500: '#4a9dd7',
          600: '#4a7ba7',
          light: '#60a5fa'
        },
        'aerospace-success': '#4ade80',
        'aerospace-warning': '#f59e0b',
        'aerospace-error': '#ef4444'
      },
      backdropBlur: {
        xs: '2px'
      }
    }
  },
  plugins: []
};
