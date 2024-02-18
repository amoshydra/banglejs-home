import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

const BASE_URL = process.env.BASE_URL || '';

// https://vitejs.dev/config/
export default defineConfig({
  base: `${BASE_URL}/`,
  plugins: [react({
    jsxImportSource: "@emotion/react",
    babel: {
      plugins: ["@emotion/babel-plugin"],
    },
  })],
})
