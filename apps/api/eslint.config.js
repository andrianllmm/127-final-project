import globals from 'globals';
import tseslint from 'typescript-eslint';
import slonik from 'eslint-plugin-slonik';
import { defineConfig, globalIgnores } from 'eslint/config';
import baseConfig from '@repo/eslint-config/base';

export default defineConfig([
  ...baseConfig,
  globalIgnores(['eslint.config.js']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [tseslint.configs.recommended],
    plugins: {
      slonik,
    },
    languageOptions: {
      globals: globals.node,
      parserOptions: {
        project: ['./tsconfig.eslint.json'],
        tsconfigRootDir: import.meta.dirname,
      },
    },
  },
]);
