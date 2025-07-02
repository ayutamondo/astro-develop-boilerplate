import globals from 'globals'
import pluginJs from '@eslint/js'

export default [
  {
    files: ['src/**/*.js', '**/*.cjs'], // .js ファイル全体を対象にする
    languageOptions: {
      globals: {
        ...globals.browser, // ブラウザ環境
        ...globals.node, // Node.js 環境
      },
    },
    ignores: ['node_modules/', 'dist/', 'screenshots/', 'public/', 'tools/'],
    rules: {
      'linebreak-style': ['error', 'unix'],
      'no-unused-vars': ['error'],
      'no-undef': ['error'],
      indent: ['error', 2],
      quotes: ['error', 'single'],
      semi: ['error', 'never'],
      'no-var': ['error'],
      'prefer-const': ['error'],
    },
  },
  pluginJs.configs.recommended,
]
