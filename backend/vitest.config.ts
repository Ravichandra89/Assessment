import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    globals: true, // allows using describe, it without imports
    environment: "node", // backend context
    include: ["tests/**/*.test.ts"], // specify test files
  },
});
