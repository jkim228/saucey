import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// GitHub Pages serves the site at /saucey/; the dev server and tests stay at /.
export default defineConfig(({ command }) => ({
  base: command === 'build' ? '/saucey/' : '/',
  plugins: [react()],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: './src/test-setup.js',
    // Node 25's built-in localStorage would otherwise replace jsdom's.
    poolOptions: {
      forks: { execArgv: ['--no-experimental-webstorage'] },
    },
  },
}))
