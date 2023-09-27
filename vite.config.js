import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  base: "/ggeugle-by-react/", // ex: /my_project/
  plugins: [react()],
})
