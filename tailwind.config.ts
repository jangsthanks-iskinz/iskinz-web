import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        charcoal: {
          DEFAULT: '#1e2025',
          mid:     '#2d3038',
          light:   '#363a44',
          deep:    '#1a1d22',
        },
        silver: {
          DEFAULT: '#c8cdd4',
          light:   '#e8ebee',
          dark:    '#8a9099',
        },
        accent:     '#4a6fa5',
        warm:       '#b5a99a',
        'off-white': '#f5f4f1',
      },
      fontFamily: {
        sans:      ['Barlow', 'system-ui', 'sans-serif'],
        serif:     ['Cormorant Garamond', 'Georgia', 'serif'],
        condensed: ['Barlow Condensed', 'sans-serif'],
      },
      animation: {
        'fade-up':   'fadeUp 0.7s ease forwards',
        'fade-down': 'fadeDown 0.8s ease forwards',
        pulse:       'pulse 2s infinite',
        bounce:      'bounce 0.4s',
      },
      keyframes: {
        fadeUp: {
          from: { opacity: '0', transform: 'translateY(30px)' },
          to:   { opacity: '1', transform: 'translateY(0)' },
        },
        fadeDown: {
          from: { opacity: '0', transform: 'translateY(-20px)' },
          to:   { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [],
}

export default config
