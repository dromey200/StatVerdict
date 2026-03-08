import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { resolve } from 'path';

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],

  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
      '@shared': resolve(__dirname, 'src/shared'),
      '@styles': resolve(__dirname, 'src/styles'),
    },
  },

  build: {
    target: 'es2020',
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
      },
    },
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        scanner: resolve(__dirname, 'diablo-4-scanner.html'),
      },
    },
    sourcemap: true,
    cssCodeSplit: true,
    chunkSizeWarningLimit: 1000,
  },

  server: {
    port: 3000,
    open: true,
    cors: true,
  },

  preview: {
    port: 8080,
  },
});
