import { defineConfig } from 'vite'

export default defineConfig({
  // Static site — index.html at root, assets in /assets
  server: {
    port: 5173,
    open: true
  },
  build: {
    outDir: 'dist',
    assetsDir: 'assets'
  }
})
