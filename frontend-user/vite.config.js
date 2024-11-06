import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5175, // Le port que vous souhaitez utiliser
    proxy: {
      '/auth': {
        target: 'http://localhost:5002',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/auth/, ''),
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