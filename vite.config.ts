import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

const BUILD_PUBLIC_PATH = process.env.BUILD_PUBLIC_PATH || '';

// https://vitejs.dev/config/
export default defineConfig({
  base: `${BUILD_PUBLIC_PATH}/`,
  plugins: [react()],
})
