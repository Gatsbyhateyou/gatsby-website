import js from '@eslint/js';
import globals from 'globals';

/** @type { import("eslint").Linter.FlatConfig[] } */
export default [
  {
    ignores: [
      'node_modules/',
      'dist/',
      'public/photo/',
      'screenshots/',
      '**/*.min.js',
      'gsap.min.js',
      'supabase.min.js',
      'public/gsap.min.js',
      'public/supabase.min.js',
    ],
  },
  js.configs.recommended,
  {
    files: ['**/*.js'],
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: 'script',
      globals: {
        ...globals.browser,
        posthog: 'readonly',
        ideaBinApi: 'readonly',
        __SUPABASE_URL__: 'readonly',
        __SUPABASE_ANON_KEY__: 'readonly',
        __GA_MEASUREMENT_ID__: 'readonly',
        __POSTHOG_KEY__: 'readonly',
        __POSTHOG_HOST__: 'readonly',
        dataLayer: 'writable',
      },
    },
    rules: {
      'no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
    },
  },
  // Node 脚本：scripts/、config/ 使用 CommonJS；vite.config.js 使用 ESM
  {
    files: ['scripts/**/*.js', 'config/**/*.js', 'font-loader.js', 'analytics-bootstrap.js'],
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: 'commonjs',
      globals: { ...globals.node },
    },
  },
  {
    files: ['vite.config.js'],
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: 'module',
      globals: { ...globals.node },
    },
  },
];
