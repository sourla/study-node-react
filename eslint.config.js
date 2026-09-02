import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import tseslint from 'typescript-eslint'
import { defineConfig, globalIgnores } from 'eslint/config'

// React Router Framework Mode route module이 컴포넌트 외에 내보내는 이름들.
// react-refresh 규칙이 이를 위반으로 보지 않게 허용한다.
const routeModuleExports = [
  'loader',
  'clientLoader',
  'action',
  'clientAction',
  'meta',
  'links',
  'headers',
  'handle',
  'shouldRevalidate',
  'ErrorBoundary',
  'HydrateFallback',
  'Layout',
]

export default defineConfig([
  globalIgnores(['dist', 'build', 'coverage', '.react-router']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      js.configs.recommended,
      tseslint.configs.recommended,
      reactHooks.configs.flat.recommended,
      reactRefresh.configs.vite,
    ],
    languageOptions: {
      globals: globals.browser,
    },
    rules: {
      'react-refresh/only-export-components': [
        'error',
        { allowConstantExport: true, allowExportNames: routeModuleExports },
      ],
    },
  },
])
