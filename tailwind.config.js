/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        cyber: {
          bg: '#05050a',
          'bg-light': '#0c0c14',
          'bg-card': '#0a0a12',
          cyan: '#00f0ff',
          'cyan-dim': '#00b8c4',
          'cyan-glow': 'rgba(0, 240, 255, 0.4)',
          red: '#ff2d55',
          'red-dim': '#c41e3a',
          'red-glow': 'rgba(255, 45, 85, 0.4)',
          green: '#00ff9d',
          'green-glow': 'rgba(0, 255, 157, 0.3)',
          yellow: '#ffd60a',
          purple: '#bf5af2',
          'purple-glow': 'rgba(191, 90, 242, 0.3)',
          text: '#f0f0f5',
          'text-dim': '#6e6e80',
          glass: 'rgba(12, 12, 20, 0.7)',
          'glass-border': 'rgba(255, 255, 255, 0.06)',
          'glass-border-hover': 'rgba(255, 255, 255, 0.12)',
        }
      },
      fontFamily: {
        mono: ['JetBrains Mono', 'SF Mono', 'Fira Code', 'monospace'],
        display: ['Syne', 'sans-serif'],
        body: ['Space Grotesk', 'sans-serif'],
      },
      animation: {
        'pulse-glow': 'pulse-glow 2s ease-in-out infinite',
        'scan-line': 'scan-line 4s linear infinite',
        'glitch': 'glitch 0.3s ease-in-out infinite',
        'float': 'float 6s ease-in-out infinite',
        'typing': 'typing 3.5s steps(40, end)',
        'blink': 'blink 1s step-end infinite',
        'shimmer': 'shimmer 2s linear infinite',
        'breathe': 'breathe 4s ease-in-out infinite',
      },
      keyframes: {
        'pulse-glow': {
          '0%, 100%': { 
            boxShadow: '0 0 8px rgba(0, 240, 255, 0.4), 0 0 16px rgba(0, 240, 255, 0.2)' 
          },
          '50%': { 
            boxShadow: '0 0 20px rgba(0, 240, 255, 0.4), 0 0 40px rgba(0, 240, 255, 0.3)' 
          },
        },
        'scan-line': {
          '0%': { transform: 'translateY(-100%)', opacity: '0' },
          '10%': { opacity: '0.6' },
          '90%': { opacity: '0.6' },
          '100%': { transform: 'translateY(100%)', opacity: '0' },
        },
        'glitch': {
          '0%, 100%': { transform: 'translate(0)', filter: 'hue-rotate(0deg)' },
          '20%': { transform: 'translate(-2px, 1px)', filter: 'hue-rotate(10deg)' },
          '40%': { transform: 'translate(-1px, -2px)', filter: 'hue-rotate(-10deg)' },
          '60%': { transform: 'translate(2px, 1px)', filter: 'hue-rotate(5deg)' },
          '80%': { transform: 'translate(1px, -1px)', filter: 'hue-rotate(-5deg)' },
        },
        'float': {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-8px)' },
        },
        'typing': {
          'from': { width: '0' },
          'to': { width: '100%' },
        },
        'blink': {
          '50%': { opacity: '0' },
        },
        'shimmer': {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        'breathe': {
          '0%, 100%': { opacity: '0.5' },
          '50%': { opacity: '0.8' },
        },
      },
      backdropBlur: {
        xs: '2px',
      },
      borderRadius: {
        '2xl': '1rem',
        '3xl': '1.5rem',
      },
    },
  },
  plugins: [],
}
