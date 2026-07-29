import globals from "globals";
import pluginJs from "@eslint/js";
import prettierPlugin from "eslint-plugin-prettier";
import prettierConfig from "eslint-config-prettier";
import reactPlugin from "eslint-plugin-react";
import reactHooksPlugin from "eslint-plugin-react-hooks";

export default [
  {
    ignores: ["node_modules/**", "dist/**", "build/**"],
  },
  {
    files: ["**/*.{js,jsx}"],
    languageOptions: {
      sourceType: "module",
      globals: {
        ...globals.browser,
        ...globals.node,
      },
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
      },
    },
    plugins: {
      prettier: prettierPlugin,
      react: reactPlugin,
      "react-hooks": reactHooksPlugin,
    },
    rules: {
      ...pluginJs.configs.recommended.rules,
      ...prettierConfig.rules,
      ...reactHooksPlugin.configs.recommended.rules,
      "prettier/prettier": "error",

      // Ignore 'React' when checking for unused variables
      "no-unused-vars": ["warn", { varsIgnorePattern: "^React$" }],

      // Turn off the strict state-in-effect warning for asynchronous data fetching
      "react-hooks/set-state-in-effect": "off",

      "no-console": "off",
    },
  },
];
