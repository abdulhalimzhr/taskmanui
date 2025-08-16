import type { Linter } from 'eslint'

const config: Linter.Config = {
  extends: ['next/core-web-vitals'],
  rules: {
    'react/display-name': 'error',
    '@typescript-eslint/no-unused-vars': 'warn',
    'prefer-const': 'error'
  }
}

export default config
