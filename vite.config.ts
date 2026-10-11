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
  optimizeDeps: {
    // Only scan our own entry. The vendored BangleApps tree under public/
    // ships thousands of Espruino modules whose bare imports (eg
    // `import ... from "Storage"`) are not npm packages; letting Vite 8's
    // default entry inference crawl them breaks dependency pre-bundling.
    entries: ['index.html'],
  },
})
