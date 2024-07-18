import { defineConfig } from 'vite'
import pkg from './package.json';
export default defineConfig({
  build: {
    rollupOptions: {
      external: [
        ...Object.keys(pkg.dependencies),
        /^node:.*/,
        'electron'
      ]
    },
    lib: {
      entry: './lib/index.ts',
      name: 'Counter',
      fileName: 'counter',
      formats: ['es'],
    }
  }
})
