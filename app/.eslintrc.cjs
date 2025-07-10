module.exports = {
  extends: [
    'next/core-web-vitals',
    'eslint-config-prettier',
    'eslint:recommended', // This already includes some basic rules
    'plugin:@typescript-eslint/recommended', // This also includes some strict rules
  ],
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint'],
  root: true,
  rules: {
    // === RULES FOR UNUSED VARIABLES ===
    // Disable the default ESLint rule for unused vars
    'no-unused-vars': 'off',
    // Disable the TypeScript-specific ESLint rule for unused vars
    '@typescript-eslint/no-unused-vars': 'off',

    // === GENERAL RELAXATION RULES (Optional, choose what you need) ===
    // Allow empty functions (e.g., placeholder functions)
    '@typescript-eslint/no-empty-function': 'off',

    // Allow usage of `any` type (if you prefer more flexibility with TypeScript)
    '@typescript-eslint/no-explicit-any': 'off',

    // Allow non-null assertions (e.g., `foo!.bar`)
    '@typescript-eslint/no-non-null-assertion': 'off',

    // Allow empty interfaces
    '@typescript-eslint/no-empty-interface': 'off',

    // Allow explicit `any` in function arguments for arguments that are not used
    // This is useful if you want to keep no-unused-vars on but ignore specific cases
    // '@typescript-eslint/no-unused-vars': ['warn', { 'argsIgnorePattern': '^_' }],

    // Relax specific Next.js related rules if they become too restrictive
    // 'react/no-unescaped-entities': 'off', // Example: to allow < > directly in JSX
    // 'react/display-name': 'off', // Example: if you don't care about displayName for components
  },
};
