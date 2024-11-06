import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173, // Le port du frontend
    proxy: {
      '/api/auth': {
        target: 'http://localhost:5001', // Backend 1
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/auth/, ''),
      },
      '/api/menu': {
        target: 'http://localhost:5002', // Backend 2
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/menu/, ''),
      },
    },
  },
  optimizeDeps: {
    exclude: ['js-big-decimal']
  },
  css: {
    additionalData: `@import "@fullcalendar/core/main.css"; @import "@fullcalendar/daygrid/main.css";`
  }
});
