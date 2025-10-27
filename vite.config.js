// vite.config.js
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

const SRC = new URL('./src', import.meta.url).pathname;

export default defineConfig(({ mode }) => ({
  // ... (plugins, resolve, server, define) ...
  plugins: [react()],
  resolve: { alias: { '@': SRC } },
  server: { /* ... */ },
  define: { /* ... */ },

  server: {
    proxy: {
      '/api': 'http://localhost:4000'
    }
  },
  

  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: '__test__/setupTests.js',
    alias: { '@': SRC },

    // 👇 MODIFY THESE LINES
    reporters: ['default', 'html', 'json'], // Add 'json'
    outputFile: {
      html: './html/index.html',     // Keep the HTML report path
      json: './vitest-report.json'  // Add a path for the JSON report
    }
    // 👆 END OF MODIFIED LINES
  },
}));