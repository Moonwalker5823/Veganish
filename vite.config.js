import { defineConfig } from 'vite'

export default defineConfig({
  // Static site — index.html at root, assets in /assets
  server: {
    port: 5173
  },
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    // Keep the SVG favicon and small icons as real files rather than data URIs,
    // so they stay cacheable and referenceable from meta tags.
    assetsInlineLimit: 0
  }
})
