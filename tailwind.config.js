/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        surface: {
          1: '#0E0F12',
          2: '#1D1E23',
          3: '#292A36',
        },
        meta: '#75778B',
        'meta-soft': '#4A4C5C',
        up: '#3DD68C',
        down: '#F25C6E',
      },
      fontFamily: {
        sans: ["'Poppins'", "'Apple SD Gothic Neo'", "'Malgun Gothic'", 'sans-serif'],
        mono: ["'JetBrains Mono'", "'SF Mono'", 'Menlo', 'monospace'],
      },
      animation: {
        pulse2: 'hoPulse 1.8s ease-out infinite',
        'toast-in': 'hoToastIn 0.35s cubic-bezier(0.22,1,0.36,1)',
      },
      keyframes: {
        hoPulse: {
          '0%': { transform: 'scale(1)', opacity: '0.9' },
          '100%': { transform: 'scale(2.6)', opacity: '0' },
        },
        hoToastIn: {
          from: { transform: 'translateY(14px)', opacity: '0' },
          to: { transform: 'translateY(0)', opacity: '1' },
        },
      },
    },
  },
  plugins: [],
};

