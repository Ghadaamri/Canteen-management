import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5174
  },
  optimizeDeps: {
    exclude: ['js-big-decimal']
  },
  css: {
    additionalData: `@import "@fullcalendar/core/main.css"; @import "@fullcalendar/daygrid/main.css";`
  }
  
})