/**
 * WHAT THIS FILE DOES:
 * Vite runs our app during development and builds it for deployment.
 * Vitest uses this same file to set up the classroom tests.
 */
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  // STEP 1: Tell Vite how to read React JSX files.
  plugins: [react()],

  // STEP 2: Give Vitest a browser-like test environment.
  // We can test what students see without opening a real browser.
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.js'],
    include: ['src/**/*.test.{js,jsx}'],
    css: true,
  },
});
