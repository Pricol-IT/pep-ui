import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/auth': {
        target: 'http://localhost:8000',
        changeOrigin: true,
        credentials: true
      },
      '/api': {
        target: 'http://localhost:8000',
        changeOrigin: true,
        credentials: true
      },
      '/tasks': {
        target: 'http://localhost:8000',
        changeOrigin: true,
        credentials: true
      },
      '/calendar': {
        target: 'http://localhost:8000',
        changeOrigin: true,
        credentials: true
      },
      '/timetrack': {
        target: 'http://localhost:8000',
        changeOrigin: true,
        credentials: true
      },
      '/announcements': {
        target: 'http://localhost:8000',
        changeOrigin: true,
        credentials: true
      },
      '/weather': {
        target: 'http://localhost:8000',
        changeOrigin: true,
        credentials: true
      }
    }
  }
})
