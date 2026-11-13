// vitest.config.ts
import { defineConfig } from 'vitest/config';
import path from 'path';

export default defineConfig({
  test: {
    environment: 'node', // Gunakan 'jsdom' jika menguji komponen React
    globals: true,
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
});