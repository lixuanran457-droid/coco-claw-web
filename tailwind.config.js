/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './components/**/*.{js,vue,ts}',
    './layouts/**/*.vue',
    './pages/**/*.vue',
    './plugins/**/*.{js,ts}',
    './app.vue',
    './error.vue'
  ],
  theme: {
    extend: {
      colors: {
        cyber: {
          dark: '#0a0a1a',
          darker: '#050510',
          card: '#12122a',
          border: '#2a2a5a',
          primary: '#00d4ff',
          secondary: '#a855f7',
          accent: '#f472b6',
          success: '#22c55e',
          warning: '#f59e0b',
          danger: '#ef4444',
          text: '#e2e8f0',
          muted: '#94a3b8'
        }
      },
      fontFamily: {
        mono: ['ui-monospace', 'SFMono-Regular', 'Menlo', 'Monaco', 'Consolas', 'Liberation Mono', 'Courier New', 'monospace'],
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif']
      },
      backgroundImage: {
        'cyber-gradient': 'linear-gradient(135deg, #00d4ff 0%, #a855f7 50%, #f472b6 100%)',
        'cyber-gradient-radial': 'radial-gradient(ellipse at center, #00d4ff 0%, #a855f7 100%)',
        'card-glow': 'linear-gradient(135deg, rgba(0, 212, 255, 0.1) 0%, rgba(168, 85, 247, 0.1) 100%)'
      },
      boxShadow: {
        'cyber': '0 0 20px rgba(0, 212, 255, 0.3)',
        'cyber-lg': '0 0 40px rgba(0, 212, 255, 0.5)',
        'cyber-purple': '0 0 20px rgba(168, 85, 247, 0.3)',
        'inner-glow': 'inset 0 0 20px rgba(0, 212, 255, 0.1)'
      },
      animation: {
        'pulse-glow': 'pulse-glow 2s ease-in-out infinite',
        'float': 'float 3s ease-in-out infinite',
        'neon-flicker': 'neon-flicker 1.5s ease-in-out infinite'
      },
      keyframes: {
        'pulse-glow': {
          '0%, 100%': { boxShadow: '0 0 20px rgba(0, 212, 255, 0.3)' },
          '50%': { boxShadow: '0 0 40px rgba(0, 212, 255, 0.6)' }
        },
        'float': {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' }
        },
        'neon-flicker': {
          '0%, 100%': { opacity: 1 },
          '41%': { opacity: 1 },
          '42%': { opacity: 0.8 },
          '43%': { opacity: 1 },
          '44%': { opacity: 0.9 },
          '45%': { opacity: 1 }
        }
      }
    }
  },
  plugins: []
}
