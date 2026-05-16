import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { fileURLToPath, URL } from 'node:url'

/** Add this line to /etc/hosts (run `npm run hosts:flowmetrices` to print it): */
const FLOWMETRICES_HOSTS = ['flowmetrices.com', 'www.flowmetrices.com'] as const

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  server: {
    host: true,
    port: 5174,
    strictPort: true,
    allowedHosts: [...FLOWMETRICES_HOSTS],
  },
  preview: {
    host: true,
    port: 4174,
    strictPort: true,
    allowedHosts: [...FLOWMETRICES_HOSTS],
  },
})
