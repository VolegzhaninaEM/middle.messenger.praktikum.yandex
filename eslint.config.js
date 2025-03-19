import globals from 'globals'
import tseslint from 'typescript-eslint'

/** @type {import('eslint').Linter.Config[]} */
export default [
  { files: ['**/*.{js,mjs,cjs,ts}'] },
  { languageOptions: { globals: globals.browser } },
  {
    rules: {
      "no-unused-vars": "error",
      // Игнорировать переменные и аргументы, начинающиеся с "_"
      '@typescript-eslint/no-unused-vars': [
        'warn',
        {
          varsIgnorePattern: '^_', // Игнорировать переменные, начинающиеся с "_"
          argsIgnorePattern: '^_' // Игнорировать аргументы функций, начинающиеся с "_"
        }
      ]
    }
  },
  ...tseslint.configs.recommended
]
