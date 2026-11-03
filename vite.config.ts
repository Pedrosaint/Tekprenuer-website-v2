import react, { reactCompilerPreset } from '@vitejs/plugin-react'
import babel from '@rolldown/plugin-babel'
import tailwindcss from '@tailwindcss/vite'
import { defineConfig } from 'vite'
import { seoPlugin } from './plugins/seo-plugin.ts'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), babel({ presets: [reactCompilerPreset()] }), tailwindcss(), seoPlugin()],
  // Never inline images as base64: prerendered HTML and JS would carry duplicates and lose caching.
  // three.js (~920 kB) lives in a lazy chunk that only loads after interaction, hence the raised warning limit.
  build: { assetsInlineLimit: 0, chunkSizeWarningLimit: 1000 },
  server: {
    port: 6600,
    open: true
  },
  preview: { port: 4173 },
})
