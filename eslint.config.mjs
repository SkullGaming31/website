import { defineConfig } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

// Use the flat config array form; place an explicit config object with
// `ignores` alongside Next.js flat configs so we avoid the deprecated
// `.eslintignore` file and silence the ESLintIgnoreWarning.
const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  {
    ignores: [
      "tests/**",
      ".next/**",
      "out/**",
      "build/**",
      "node_modules/**",
      "coverage/**",
      "next-env.d.ts",
    ],
  },
]);

export default eslintConfig;
