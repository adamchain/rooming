import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      assert: path.resolve(__dirname, 'node_modules/assert/build/assert.js'),
      util: path.resolve(__dirname, 'node_modules/util/util.js'),
      buffer: 'buffer',
    },
  },
  optimizeDeps: {
    include: ['buffer'],
    esbuildOptions: {
      define: {
        global: 'globalThis',
      },
    },
  },
  define: {
    'global': 'globalThis',
    'Buffer': ['buffer', 'Buffer'],
  },
});