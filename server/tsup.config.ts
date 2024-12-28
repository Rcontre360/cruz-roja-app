import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['./src', '!src/**/*.test.*'],
  splitting: false,
  sourcemap: true,
  clean: true,
});
