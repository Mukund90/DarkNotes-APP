import globals from 'globals';
import pluginJs from '@eslint/js';
import prettierPlugin from 'eslint-plugin-prettier';
import prettierConfig from 'eslint-config-prettier';
import reactPlugin from 'eslint-plugin-react';
import reactHooksPlugin from 'eslint-plugin-react-hooks';

export default [
  // Ignore folders
  {
    ignores: ['node_modules/**', 'dist/**', 'build/**'],
  },

  // Main JavaScript configuration
  {
    files: ['**/*.{js,jsx}'],
    languageOptions: {
      sourceType: 'commonjs',
      ecmaVersion: 'latest',
      globals: {
        ...globals.node,
        ...globals.browser,
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
      'react-hooks': reactHooksPlugin,
    },

    rules: {
      ...pluginJs.configs.recommended.rules,
      ...prettierConfig.rules,
      ...reactHooksPlugin.configs.recommended.rules,

      'prettier/prettier': 'error',
      'no-unused-vars': ['warn', { varsIgnorePattern: '^React$' }],
      'react-hooks/set-state-in-effect': 'off',
      'no-console': 'off',
    },
  },

  // Vitest test files
  {
    files: ['tests/**/*.js', '**/*.test.js', '**/*.spec.js'],
    languageOptions: {
      globals: {
        ...globals.node,
        ...globals.vitest,
      },
    },
  },
];
