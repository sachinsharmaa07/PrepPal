import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'node',
    globals: true,
    setupFiles: ['./src/test/setup.ts'],
    exclude: ['**/node_modules/**', '**/dist/**'],
    env: {
      GROQ_API_KEY: 'test-key',
      JWT_SECRET: 'test-secret',
    }
  }
});
