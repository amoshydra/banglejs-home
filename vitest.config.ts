import { configDefaults, defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    exclude: [
      ...configDefaults.exclude,
      // Vendored upstream BangleApps ships its own (non-vitest) test files.
      "public/externals/**",
    ],
  },
});
