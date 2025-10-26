// vite.config.js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  // Alias para Vite (opcional, pero bueno tenerlo)
  resolve: {
    alias: {
      '@': new URL('./src', import.meta.url).pathname,
    },
  },
  test: {
    // ... otras configuraciones de test ...
    globals: true,
    environment: 'jsdom',
    setupFiles: '__test__/setupTests.js',
    // 👇 ASEGÚRATE DE TENER ESTA SECCIÓN 'alias' DENTRO DE 'test'
    alias: {
      '@': new URL('./src', import.meta.url).pathname,
    },
    // ... resto de config de test ...
  },
})