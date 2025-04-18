import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  optimizeDeps: {
    esbuildOptions: {
      tsconfigRaw: JSON.stringify({
        compilerOptions: {
          skipLibCheck: true,
          skipDefaultLibCheck: true
        }
      })
    }
  },
  plugins: [react()],
  base: '/',
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true,
      },
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
});