// vite.config.js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    include: ['__test__/**/*.test.{js,jsx,ts,tsx}'],
    setupFiles: '__test__/setupTests.js',

    // 👇 AÑADE ESTAS LÍNEAS (REPORTE DE RESULTADOS)
    // Esto crea el reporte de "pasó/falló"
    reporters: ['default', 'html'],
    outputFile: 'vitest-report/index.html',

    // 👇 AÑADE ESTAS LÍNEAS (REPORTE DE COBERTURA)
    // Esto crea el reporte de "% de código probado"
    coverage: {
      provider: 'v8', // El paquete que acabamos de instalar
      reporter: ['text', 'html'], // 'text' para verlo en terminal, 'html' para la página
      reportsDirectory: './coverage', // Carpeta donde se guardará
      all: true, // Mide la cobertura de TODOS tus archivos en src/
      include: ['src/paginas/**/*.jsx', 'src/components/**/*.jsx'], // Mide solo tus páginas y componentes
    },
  },
})