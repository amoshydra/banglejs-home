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
  build: {
    rollupOptions: {
      output: {
        // Pull the React runtime, the router and emotion into their own
        // long-lived chunks so they survive app-code changes in the cache.
        // Returning undefined for everything else leaves rolldown's
        // automatic splitting alone - in particular the lazily imported
        // detail view (and its markdown pipeline) stays a separate chunk.
        manualChunks(id) {
          if (!id.includes('node_modules')) return undefined;
          if (/[\\/]node_modules[\\/](react|react-dom|scheduler)[\\/]/.test(id)) return 'react';
          if (/[\\/]node_modules[\\/]react-router(-dom)?[\\/]/.test(id)) return 'router';
          if (/[\\/]node_modules[\\/]@emotion[\\/]/.test(id)) return 'emotion';
          return undefined;
        },
      },
    },
  },
})
