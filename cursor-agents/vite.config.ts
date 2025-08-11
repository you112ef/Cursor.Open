import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  root: 'src/renderer',
  build: {
    outDir: '../../dist/renderer',
    emptyOutDir: true
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
      '@/renderer': path.resolve(__dirname, 'src/renderer'),
      '@/shared': path.resolve(__dirname, 'src/shared')
    }
  },
  base: './',
  server: {
    port: 3000
  },
  optimizeDeps: {
    include: [
      'react',
      'react-dom',
      '@monaco-editor/react',
      'monaco-editor'
    ]
  }
});