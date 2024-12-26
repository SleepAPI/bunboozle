// @ts-check
// eslint typescript support is still in experimental stage

import typescriptEslint from 'typescript-eslint';

import js from '@eslint/js';
import ts from '@typescript-eslint/eslint-plugin';
import tsParser from '@typescript-eslint/parser';
import prettierConfig from 'eslint-config-prettier';
import prettierRecommended from 'eslint-plugin-prettier/recommended';
import globals from 'globals';

export default typescriptEslint.config(
  {
    ignores: ['**/node_modules', '**/dist', '**/coverage', '**/.vscode', '**/dev-dist', '*.d.ts']
  },

  {
    name: 'bunboozle-rules',
    files: ['**/src/**'],
    languageOptions: {
      ecmaVersion: 'latest',
      globals: {
        ...globals.browser,
        ...globals.node
      },
      sourceType: 'module',
      parser: tsParser
    },
    plugins: { ts }
  },

  // general recommendations
  js.configs.recommended,
  typescriptEslint.configs.recommended,
  prettierConfig,
  prettierRecommended, // prettier last to avoid clash with autoformatting

  // final overwrite custom rules
  {
    rules: {
      // turning this on means we can't do: someBoolean && someFunction()
      '@typescript-eslint/no-unused-expressions': 'off'
    }
  }
);
