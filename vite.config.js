// vite.config.js
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Resolve src path for alias (works in ESM config)
const SRC = new URL('./src', import.meta.url).pathname;

export default defineConfig(({ mode }) => ({
  plugins: [react()],

  // App alias
  resolve: {
    alias: { '@': SRC },
  },

  // Dev-only proxy to your Express backend on 4000
  server: {
    proxy: mode === 'development'
      ? {
          '/api': {
            target: 'http://localhost:4000',
            changeOrigin: true,
          },
        }
      : undefined,
  },

  // Make API_BASE resolve to '/api' (useful in tests; harmless elsewhere)
  define: {
    'import.meta.env.VITE_API_BASE': JSON.stringify('/api'),
  },

  // Vitest config (runs via "vitest")
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: '__test__/setupTests.js',   // adjust if your path differs
    alias: { '@': SRC },
    // If you prefer to ONLY define in tests, you can add:
    // define: { 'import.meta.env.VITE_API_BASE': JSON.stringify('/api') },
  },
}));
