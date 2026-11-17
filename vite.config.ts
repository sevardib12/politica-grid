import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// En GitHub Actions la app se publica en https://sevardib12.github.io/politica-grid/
// En local (npm run dev) sigue en la raíz.
export default defineConfig({
  base: process.env.GITHUB_ACTIONS ? '/politica-grid/' : '/',
  plugins: [react(), tailwindcss()],
})
