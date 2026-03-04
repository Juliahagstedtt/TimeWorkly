import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
  proxy: {
      "/time": "http://localhost:10000",
      "/login": "http://localhost:10000",
      "/register": "http://localhost:10000",
    }
}
})
