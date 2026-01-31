/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // SpinGift Dark Theme
        'dark': {
          DEFAULT: '#0a0a0b',
          '50': '#18181b',
          '100': '#151517',
          '200': '#121214',
          '300': '#0f0f10',
          '400': '#0c0c0d',
          '500': '#0a0a0b',
        },
        // Telegram Blue Accent
        'accent': {
          DEFAULT: '#2AABEE',
          'light': '#5BC4F5',
          'dark': '#1E96D1',
        },
        // Purple for epic items
        'purple': {
          DEFAULT: '#8B5CF6',
          'light': '#A78BFA',
          'dark': '#7C3AED',
        },
        // Gold/Yellow
        'gold': {
          DEFAULT: '#F59E0B',
          'light': '#FBBF24',
          'dark': '#D97706',
        },
        // Success Green
        'success': {
          DEFAULT: '#22C55E',
          'light': '#4ADE80',
          'dark': '#16A34A',
        },
        // Danger Red
        'danger': {
          DEFAULT: '#EF4444',
          'light': '#F87171',
          'dark': '#DC2626',
        },
      },
      fontFamily: {
        'nunito': ['Nunito', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        '2xl': '1rem',
        '3xl': '1.5rem',
        '4xl': '2rem',
      },
      animation: {
        'spin-slow': 'spin 8s linear infinite',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float': 'float 3s ease-in-out infinite',
        'glow': 'glow 2s ease-in-out infinite',
        'shimmer': 'shimmer 2s linear infinite',
        'bounce-in': 'bounce-in 0.5s ease-out',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-8px)' },
        },
        glow: {
          '0%, 100%': { opacity: '0.6', transform: 'scale(1)' },
          '50%': { opacity: '1', transform: 'scale(1.05)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        'bounce-in': {
          '0%': { transform: 'scale(0.8)', opacity: '0' },
          '50%': { transform: 'scale(1.05)' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
      },
    },
  },
  plugins: [],
}
