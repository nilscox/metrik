module.exports = {
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: 'tsconfig.json',
    sourceType: 'module',
  },
  plugins: ['@typescript-eslint/eslint-plugin', 'simple-import-sort'],
  extends: ['plugin:@typescript-eslint/recommended'],
  root: true,
  env: {
    node: true,
    jest: true,
  },
  ignorePatterns: ['.eslintrc.js'],
  rules: {
    'simple-import-sort/imports': [
      'warn',
      {
        groups: [
          ['^(path|fs|stream|util)$'],
          ['^@nest', '^[a-z]'],
          ['^[A-Z]'],
          ['^src/'],
          ['^../'],
          ['^./'],
        ],
      },
    ],
    '@typescript-eslint/explicit-function-return-type': 'off',
    '@typescript-eslint/explicit-module-boundary-types': 'off',
  },
  overrides: [
    {
      files: 'src/sql/migrations/*.ts',
      rules: {
        '@typescript-eslint/no-explicit-any': 'off',
      },
    },
  ],
};
