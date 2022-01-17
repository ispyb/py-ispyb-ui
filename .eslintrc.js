module.exports = {
  env: {
    node: true,
    commonjs: true,
    browser: true,
  },
  root: true,
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint'],
  extends: ['eslint:recommended', 'plugin:@typescript-eslint/recommended', 'prettier', 'plugin:storybook/recommended'],
  rules: {
    'no-alert': 'off',
    'no-console': 'off',
    'no-unused-vars': 'warn',
    'no-debugger': 'off',
  },
};
