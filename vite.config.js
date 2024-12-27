import { defineConfig } from 'vite';

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:5950',
        changeOrigin: true,
        secure: false
      }
    }
  }
});