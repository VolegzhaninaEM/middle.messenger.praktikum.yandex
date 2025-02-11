import js from '@eslint/js'
import globals from 'globals'
import tsEslint from 'typescript-eslint'
import prettierRecommended from 'eslint-plugin-prettier/recommended'
import prettierConfig from './prettier.config.js'

export default tsEslint.config(
  { ignores: ['dist'] },
  {
    extends: [js.configs.recommended, ...tsEslint.configs.recommended],
    files: ['**/*.{js,ts}'],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser
    }
  },
  prettierRecommended,
  {
    rules: {
      'no-console': 'warn',
      'prettier/prettier': ['warn', prettierConfig]
    }
  }
)
