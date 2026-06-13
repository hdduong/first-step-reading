import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  // Dev only: forward /api calls to the local Node server (npm start) so the
  // SPA + backend behave like production. No effect on the production build.
  server: {
    proxy: { '/api': 'http://localhost:3000' },
  },
  test: {
    // Logic + data unit tests run in Node (no DOM needed). Playwright e2e specs
    // live under e2e/ and are excluded here so Vitest doesn't try to run them.
    environment: 'node',
    include: ['src/**/*.{test,spec}.{js,jsx}'],
  },
})
