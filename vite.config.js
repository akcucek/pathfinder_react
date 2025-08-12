import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5178,
    host: true,
    proxy: {
      '/agent': 'http://localhost:5001',
      '/test_plans': 'http://localhost:5001',
      '/user_stories': 'http://localhost:5001'
    }
  }
})
