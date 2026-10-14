import { defineConfig, globalIgnores } from "eslint/config";
import next from "@next/eslint-plugin-next";
import hooks from "eslint-plugin-react-hooks";
import tseslint from "typescript-eslint";
export default defineConfig([
  globalIgnores([
    ".next/**",
    "playwright-report/**",
    "test-results/**",
    "next-env.d.ts",
  ]),
  ...tseslint.configs.recommended,
  next.configs["core-web-vitals"],
  { files: ["**/*.{ts,tsx}"], ...hooks.configs.flat["recommended-latest"] },
]);
