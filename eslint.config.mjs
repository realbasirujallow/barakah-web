import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Round 29: deps refresh pulled in eslint-plugin-react-hooks 7.x which
  // introduces a new class of strict rules (purity, refs, set-state-in-
  // effect, preserve-manual-memoization, static-components, etc.). These
  // flag ~50 pre-existing patterns across the codebase that are
  // functionally correct but not modern-style. Demoted wholesale to
  // warnings so we can land incrementally in a dedicated "react-hooks
  // modernization" round instead of blocking every commit on 50
  // unrelated files.
  {
    rules: {
      "react-hooks/set-state-in-effect": "warn",
      "react-hooks/refs": "warn",
      "react-hooks/purity": "warn",
      "react-hooks/immutability": "warn",
      "react-hooks/unsupported-syntax": "warn",
      "react-hooks/preserve-manual-memoization": "warn",
      "react-hooks/static-components": "warn",
      "react-hooks/error-boundaries": "warn",
      "react-hooks/config": "warn",
      "react-hooks/globals": "warn",
      "react-hooks/fbt": "off",
    },
  },
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
  ]),
]);

export default eslintConfig;
