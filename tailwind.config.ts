import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f3f6fb',
          100: '#e3ebf6',
          200: '#c4d4ea',
          300: '#9db6da',
          400: '#6b8fc4',
          500: '#243b6b',
          600: '#1d3058',
          700: '#162544',
          800: '#101b32',
          900: '#0b1223',
          950: '#060a16',
        },
        secondary: {
          50: '#fafaf9',
          100: '#f3f2f0',
          200: '#e7e5e2',
          300: '#d4d0cb',
          400: '#b8b2aa',
          500: '#8a8279',
          600: '#6b635a',
          700: '#4a453f',
          800: '#2d2a26',
          900: '#1a1816',
        },
        gold: {
          300: '#e4c975',
          400: '#d1ad57',
          500: '#c1933c',
          600: '#a77b2c',
          700: '#876224',
        },
      },
      fontFamily: {
        serif: ['Georgia', 'Cambria', '"Times New Roman"', 'Times', 'serif'],
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
      animation: {
        'fade-in': 'fadeIn 0.6s ease-out',
        'slide-up': 'slideUp 0.6s ease-out',
        'slide-in-left': 'slideInLeft 0.6s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(30px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideInLeft: {
          '0%': { opacity: '0', transform: 'translateX(-30px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
      },
    },
  },
  plugins: [],
};

export default config;
