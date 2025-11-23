import { defineConfig } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

// Use the `ignores` property (supported by the flat config) instead of
// legacy `.eslintignore`. This prevents the ESLintIgnoreWarning.
const eslintConfig = defineConfig({
  ignores: [
    "tests/**",
    ".next/**",
    "out/**",
    "build/**",
    "node_modules/**",
    "coverage/**",
    "next-env.d.ts",
  ],
  // Merge Next.js recommended flat configs as overrides
  overrides: [
    ...nextVitals,
    ...nextTs,
  ],
});

export default eslintConfig;
