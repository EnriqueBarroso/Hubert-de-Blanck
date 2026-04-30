/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        // Sistema de tokens — neo-brutalismo teatral azul/carmín
        paper: '#F2EBDA',      // fondo principal — papel crema
        'paper-2': '#FFFCF0',  // cards — papel más claro
        ink: '#0F1738',        // tinta principal — azul casi negro
        'ink-soft': '#4A5470', // tinta secundaria para metadatos
        carmin: '#B8253A',     // acento — rojo carmín
      },
      fontFamily: {
        // Display: serif teatral con personalidad
        serif: ['"Cormorant Garamond"', 'Georgia', 'serif'],
        // Body: sans-serif neutra y legible
        sans: ['"Inter"', 'system-ui', 'sans-serif'],
        // Metadatos: monoespaciada tipo máquina de escribir
        mono: ['"JetBrains Mono"', 'ui-monospace', 'monospace'],
      },
      boxShadow: {
        'brut-sm': '3px 3px 0 0 #0F1738',
        'brut': '5px 5px 0 0 #0F1738',
        'brut-lg': '8px 8px 0 0 #0F1738',
        'brut-carmin': '5px 5px 0 0 #B8253A',
        'brut-carmin-lg': '8px 8px 0 0 #B8253A',
      },
      letterSpacing: {
        widest: '0.2em',
        ultra: '0.3em',
      },
    },
  },
  plugins: [],
};
