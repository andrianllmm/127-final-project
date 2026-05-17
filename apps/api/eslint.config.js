import globals from 'globals';
import slonik from 'eslint-plugin-slonik';
import { defineConfig, globalIgnores } from 'eslint/config';
import baseConfig from '@repo/eslint-config/base';

export default defineConfig([
  globalIgnores(['dist', 'eslint.config.js']),

  ...baseConfig,

  {
    files: ['**/*.{ts,tsx}'],

    languageOptions: {
      globals: {
        ...globals.node,
      },
      parserOptions: {
        project: ['./tsconfig.eslint.json'],
        tsconfigRootDir: import.meta.dirname,
      },
    },

    plugins: {
      slonik,
    },
  },
]);
