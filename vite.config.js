import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// GitHub Project Pages: set VITE_BASE_PATH=/nama-repo/ (contoh /catalog-it/)
export default defineConfig({
  plugins: [react()],
  base: process.env.VITE_BASE_PATH || '/',
})
