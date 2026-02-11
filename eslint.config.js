import globals from 'globals';
import pluginJs from '@eslint/js';
import tseslint from 'typescript-eslint';

export default [
  pluginJs.configs.recommended,
  ...tseslint.configs.recommended,
  {
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node,
      },
      ecmaVersion: 'latest',
      sourceType: 'module',
    },
    rules: {
      'no-var': 'error',
      'prefer-const': 'warn',
      'semi': ['error', 'always'],
      'quotes': ['error', 'single'],
      'indent': ['error', 2],
      'no-unused-vars': 'off',
      '@typescript-eslint/no-unused-vars': 'warn',
      'eol-last': ['error', 'always']
    },
  },
  {
    ignores: [
      'dist/**',
      'node_modules/**',
      'build/**',
      '**/*.hbs',
      '**/*.pcss'
    ]
  }
];
