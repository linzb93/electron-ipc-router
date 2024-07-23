import { defineConfig } from "vite";
import pkg from "../../package.json";
import dts from "vite-plugin-dts";

export default defineConfig({
  build: {
    rollupOptions: {
      external: [...Object.keys(pkg.dependencies), /^node:.*/, "electron"],
    },
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
});
