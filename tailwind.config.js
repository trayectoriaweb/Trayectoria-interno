/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        klein: {
          DEFAULT: '#0033FF',
          hover: '#0026CC',
          light: '#EBF0FF',
          border: '#C7D7FE',
          glow: 'rgba(0, 51, 255, 0.18)',
        },
        tray: {
          50: '#F8FAFC',
          100: '#F1F5F9',
          200: '#E2E8F0',
          300: '#CBD5E1',
          400: '#94A3B8',
          500: '#64748B',
          600: '#475569',
          700: '#334155',
          800: '#1E293B',
          900: '#0F172A',
          950: '#020617',
        },
        brand: {
          accent: '#0033FF',
          accentLight: '#EBF0FF',
          highlight: '#0033FF',
          success: '#16A34A',
          warning: '#F59E0B',
          danger: '#DC2626',
        }
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'system-ui', '-apple-system', 'BlinkMacSystemFont', '"Segoe UI"', 'Roboto', 'sans-serif'],
        mono: ['"JetBrains Mono"', '"Fira Code"', 'ui-monospace', 'monospace'],
        display: ['"Plus Jakarta Sans"', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'subtle': '0 1px 2px 0 rgba(0, 0, 0, 0.04), 0 1px 3px 0 rgba(0, 0, 0, 0.02)',
        'card': '0 0 0 1px rgba(0, 0, 0, 0.06), 0 2px 8px -2px rgba(0, 0, 0, 0.04)',
        'elevated': '0 10px 25px -5px rgba(0, 0, 0, 0.05), 0 8px 10px -6px rgba(0, 0, 0, 0.03)',
        'klein': '0 0 15px rgba(0, 51, 255, 0.25)',
      },
      borderRadius: {
        'window': '22px',
        'card': '16px',
      }
    },
  },
  plugins: [],
}
