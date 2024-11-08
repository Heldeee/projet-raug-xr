import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import mkcert from 'vite-plugin-mkcert'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), mkcert()],
  base: process.env.NODE_ENV === 'production' ? '/projet-raug-xr/' : '/',
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
  },
  server: { https: true }
})