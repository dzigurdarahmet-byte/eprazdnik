import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import path from "node:path";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "."),
    },
  },
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: ["./tests/setup.ts"],
    include: ["tests/**/*.test.{ts,tsx}"],
    coverage: {
      provider: "v8",
      reporter: ["text", "html"],
      include: ["lib/**/*.ts", "components/**/*.{ts,tsx}"],
      exclude: [
        "lib/notion/client.ts",
        "lib/logger.ts",
        "**/*.d.ts",
        "**/index.ts",
      ],
      // Per-spec §6.4: lib ≥ 70, components ≥ 50 (glob-scoped thresholds).
      thresholds: {
        "lib/**": { lines: 70, functions: 70, branches: 60, statements: 70 },
        "components/**": { lines: 50, functions: 50, branches: 40, statements: 50 },
      },
    },
  },
});
