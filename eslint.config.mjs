import eslintJs from '@eslint/js';
import eslintPluginAstro from 'eslint-plugin-astro';
import astroParser from 'astro-eslint-parser';
import globals from 'globals';
import tseslint from 'typescript-eslint';

export default [
  eslintJs.configs.recommended,
  ...tseslint.configs.recommended,
  ...eslintPluginAstro.configs['flat/recommended'],
  {
    files: ['*.astro', '**/*.astro'],
    languageOptions: {
      parser: astroParser,
    },
  },
  {
    files: ['public/scripts/**/*.js'],
    languageOptions: {
      globals: {
        ...globals.browser,
      },
    },
  },
  {
    files: ['scripts/**/*.mjs'],
    languageOptions: {
      globals: {
        ...globals.node,
      },
    },
  },
  {
    ignores: ['dist/', '.astro/'],
  },
];
