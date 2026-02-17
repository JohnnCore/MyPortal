import { defineConfig } from 'vite';
import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  build: {
    // Generate source maps for debugging
    sourcemap: false,
    // Target modern browsers for smaller output
    target: 'es2020',
    // Rollup output optimization
    rollupOptions: {
      output: {
        // Manual chunk splitting for better caching
        manualChunks: {
          // Core React libraries (rarely change)
          'vendor-react': ['react', 'react-dom', 'react-router'],
          // Redux ecosystem (rarely change)
          'vendor-redux': ['@reduxjs/toolkit', 'react-redux'],
          // Form & validation libraries
          'vendor-forms': ['react-hook-form', 'zod', '@hookform/resolvers'],
          // UI utilities
          'vendor-ui': ['lucide-react'],
        },
      },
    },
    // Increase chunk size warning limit (we have manual chunks)
    chunkSizeWarningLimit: 600,
  },
  // Optimize dependencies
  optimizeDeps: {
    include: ['react', 'react-dom', 'react-router', '@reduxjs/toolkit', 'react-redux'],
  },
});
