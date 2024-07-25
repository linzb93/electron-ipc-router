import { defineConfig } from "vitest/config";
import dts from "vite-plugin-dts";
export default defineConfig({
  build: {
    lib: {
      entry: "./lib/index.ts",
      fileName: "index",
      formats: ["es"],
    },
  },
  plugins: [
    dts({
      outDir: "./",
      entryRoot: "./lib",
      rollupTypes: true,
      exclude: ["**/*.test.ts"],
    }),
  ],
  test: {
    onConsoleLog() {
      return true;
    },
  },
});
