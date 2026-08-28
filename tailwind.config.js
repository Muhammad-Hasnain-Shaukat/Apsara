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
        apsara: {
          bg: '#EAEBE7',
          cream: '#E5E7E2',
          sand: '#DFE2DD',
          linen: '#D8DDD6',
          card: '#FFFFFF',
          'card-warm': '#F5F7F3',
          
          // Exact Terracotta Cognac Brown from User Swatch (#A65B2E)
          terracotta: '#A65B2E',
          'terracotta-dark': '#8E4A22',
          'terracotta-light': '#BD6F3F',
          'terracotta-soft': '#F4E8DF',
          border: '#A65B2E',
          'border-subtle': '#D4AA8E',
          
          espresso: '#221A15',
          'dark-wood': '#2C221C',
          body: '#665E56',
          muted: '#857F78',
          
          camel: '#A65B2E',
          'camel-dark': '#8E4A22',
          'camel-hover': '#965026',
          'camel-light': '#D9A779',
          'camel-soft': '#F4EAE0',
          gold: '#C59A58',
        }
      },
      fontFamily: {
        serif: ['"Playfair Display"', '"Cormorant Garamond"', 'Georgia', 'serif'],
        sans: ['"Plus Jakarta Sans"', 'Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
      boxShadow: {
        'clean': '0 4px 20px -2px rgba(44, 34, 28, 0.05)',
        'clean-hover': '0 12px 30px -4px rgba(166, 91, 46, 0.18)',
        'card': '0 2px 12px rgba(44, 34, 28, 0.04), 0 0 0 1px rgba(166, 91, 46, 0.3)',
        'card-hover': '0 16px 36px -6px rgba(166, 91, 46, 0.2), 0 0 0 1px rgba(166, 91, 46, 0.6)',
      }
    },
  },
  plugins: [],
}
