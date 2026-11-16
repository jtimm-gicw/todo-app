/**
 * FILE: vite.config.js
 * PURPOSE: Configure Vite and the Vitest test runner.
 *
 * STEP 1: Tell the tools where this STANDALONE classroom app lives.
 * This matters because the parent GitHub repository has another Vite app.
 */
import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

const projectRoot = fileURLToPath(new URL('.', import.meta.url));
const testSetupFile = fileURLToPath(new URL('./src/test/setup.js', import.meta.url));

export default defineConfig({
  // STEP 2: Use the folder that contains THIS config file as project root.
  root: projectRoot,

  // STEP 3: Teach Vite how to run React JSX components.
  plugins: [react()],

  // STEP 4: Run only the classroom tests from THIS mini-app.
  test: {
    root: projectRoot,
    globals: true,
    environment: 'jsdom',
    setupFiles: [testSetupFile],
    include: ['src/**/*.test.{js,jsx}'],
    css: true,
  },
});
