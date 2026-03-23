import { defineConfig } from 'vitest/config';
import vue from '@vitejs/plugin-vue';
import path from 'path';

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '\\.(css|less|scss|sass)$': path.resolve(__dirname, 'tests/cssMock.js'),
      postcss: path.resolve(__dirname, 'tests/cssMock.js'),
      tailwindcss: path.resolve(__dirname, 'tests/cssMock.js'),
      '@csstools/css-calc': path.resolve(__dirname, 'tests/cssMock.js'),
      '@': path.resolve(__dirname, 'src'),
    },
  },
  test: {
    environment: 'jsdom',
    isolate: false,
    mockReset: true,
    include: [
      'src/components/tests/**/*.test.js',
      'src/components/tests/**/*.spec.js',
    ],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html'],
      include: ['src/components/**/*.vue'],
    },
  },
});
