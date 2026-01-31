/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // SpinGift Dark Theme
        'sg-bg': '#0d0d0f',
        'sg-bg-secondary': '#151518',
        'sg-bg-tertiary': '#1c1c21',
        'sg-surface': '#212126',
        
        // Telegram Blue Accent
        'sg-accent': '#2AABEE',
        'sg-accent-dark': '#1E96D1',
        'sg-accent-light': '#5BC4F5',
        
        // Purple for epic items
        'sg-purple': '#8B5CF6',
        'sg-purple-dark': '#7C3AED',
        
        // Rarity colors
        'rarity-common': '#9CA3AF',
        'rarity-rare': '#3B82F6',
        'rarity-epic': '#8B5CF6',
        'rarity-legendary': '#F59E0B',
        
        // Status
        'sg-success': '#22C55E',
        'sg-warning': '#F59E0B',
        'sg-danger': '#EF4444',
        
        // Text
        'sg-text': '#FFFFFF',
        'sg-text-secondary': '#71717A',
        'sg-text-muted': '#52525B',
        
        // Borders
        'sg-border': '#27272A',
        'sg-border-light': '#3F3F46',
      },
      fontFamily: {
        'nunito': ['Nunito', 'sans-serif'],
      },
      borderRadius: {
        '2xl': '1rem',
        '3xl': '1.5rem',
        '4xl': '2rem',
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'glow': 'glow 2s ease-in-out infinite',
        'float': 'float 3s ease-in-out infinite',
        'spin-slow': 'spin 8s linear infinite',
      },
      keyframes: {
        glow: {
          '0%, 100%': { opacity: '0.5' },
          '50%': { opacity: '1' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-5px)' },
        },
      },
      backdropBlur: {
        'xs': '2px',
      },
    },
  },
  plugins: [],
}
