import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    host: 'localhost', // Cambia a 'localhost' para evitar problemas de resolución de host
    proxy: {
      '/api': {
        target: 'http://localhost:4000',
        changeOrigin: true,
        // No reescribas el path si el backend espera /api/...
        // rewrite: (path) => path.replace(/^\/api/, ''),
      },
    },
  },
})
