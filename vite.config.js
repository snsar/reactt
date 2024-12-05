import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'http://34.92.164.246:9090',
        changeOrigin: true,
        secure: false,
      },
      '/query': {
        target: 'https://950c-2402-800-61cd-6d1a-69d9-c1ec-cebd-7324.ngrok-free.app',
        changeOrigin: true,
        secure: false
      }
    }
  }
})
