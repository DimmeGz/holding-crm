import js from '@eslint/js';
import tseslint from '@typescript-eslint/eslint-plugin';
import tsparser from '@typescript-eslint/parser';
import prettierConfig from 'eslint-config-prettier';
import react from 'eslint-plugin-react';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';

export default [
  {
    ignores: ['dist', 'node_modules'],
  },
  {
    files: ['**/*.{ts,tsx}'],

    languageOptions: {
      ecmaVersion: 2022,
      sourceType: 'module',
      parser: tsparser,
      parserOptions: {
        project: './tsconfig.eslint.json',
        ecmaFeatures: {
          jsx: true,
        },
      },
      globals: {
        window: 'readonly',
        document: 'readonly',
        navigator: 'readonly',
        console: 'readonly',
      },
    },

    plugins: {
      '@typescript-eslint': tseslint,
      react: react,
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
    },

    rules: {
      ...js.configs.recommended.rules,
      ...tseslint.configs.recommended.rules,
      ...react.configs.recommended.rules,
      ...reactHooks.configs.recommended.rules,

      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/no-inferrable-types': 'off',
      '@typescript-eslint/typedef': [
        'warn',
        {
          variableDeclaration: true,
          variableDeclarationIgnoreFunction: false,
          parameter: true,
          propertyDeclaration: true,
          memberVariableDeclaration: true,
          arrayDestructuring: false,
          objectDestructuring: false,
          arrowParameter: true, // замість variableDeclarationIgnoreArrow
        },
      ],
      '@typescript-eslint/explicit-function-return-type': [
        'warn',
        {
          allowExpressions: false,
          allowTypedFunctionExpressions: true,
        },
      ],
      '@typescript-eslint/explicit-module-boundary-types': 'warn',
      'react/jsx-key': 'warn',
      'react/no-unescaped-entities': 'warn',
      'react/prop-types': 'off',
      'react/react-in-jsx-scope': 'off',
      'no-undef': 'off',
    },

    settings: {
      react: {
        version: 'detect',
      },
    },
  },
  prettierConfig,
];
