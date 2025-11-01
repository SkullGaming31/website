import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: './test/setup.ts',
    include: ['**/*.{test,spec}.{ts,tsx}'],
    environmentOptions: {
      jsdom: {
        resources: 'usable'
      }
    },
    coverage: {
      provider: 'v8',
      reporter: ['text', 'lcov'],
      include: ['app/**/*.{ts,tsx}', 'lib/**/*.ts'],
      exclude: [
        '**/node_modules/**',
        '**/tests/**',
        '**/*.spec.ts',
        '**/*.test.ts',
        '**/*.spec.tsx',
        '**/*.test.tsx',
        'app/components/TwitchPlayer.tsx' // exclude due to iframe/embed testing complexity
      ],
      thresholds: {
        statements: 50,
        branches: 50,
        functions: 50,
        lines: 50,
      }
    }
    // coverage is configured via CLI flags in package.json scripts to avoid type mismatches
  }
});
