import { defineConfig } from 'vite';

export default defineConfig({
  build: {
    lib: {
      entry: 'src/index.ts',
      name: 'bunboozle',
      formats: ['es']
    },
    rollupOptions: {
      external: ['bun:test']
    }
  }
});
