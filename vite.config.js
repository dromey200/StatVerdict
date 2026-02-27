import { defineConfig } from 'vite';
import compression from 'vite-plugin-compression';
import { createHtmlPlugin } from 'vite-plugin-html';
import autoprefixer from 'autoprefixer';
import cssnano from 'cssnano';

export default defineConfig({
  plugins: [
    createHtmlPlugin({
      minify: true,
      inject: {
        data: {
          title: 'StatVerdict - AI-Powered ARPG Loot Analysis',
        },
      },
    }),
    compression({
      algorithm: 'gzip',
      ext: '.gz',
    }),
    compression({
      algorithm: 'brotliCompress',
      ext: '.br',
    }),
  ],
  
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
      output: {
        manualChunks: {
          vendor: ['./translations.js'],
          analytics: ['./analytics.js'],
        },
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
  
  optimizeDeps: {
    include: [],
  },
  
  css: {
    devSourcemap: true,
    postcss: {
      plugins: [
        autoprefixer(),
        cssnano({
          preset: 'default',
        }),
      ],
    },
  },
});
