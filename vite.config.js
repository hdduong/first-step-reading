import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  test: {
    // Logic + data unit tests run in Node (no DOM needed). Playwright e2e specs
    // live under e2e/ and are excluded here so Vitest doesn't try to run them.
    environment: 'node',
    include: ['src/**/*.{test,spec}.{js,jsx}'],
  },
})
