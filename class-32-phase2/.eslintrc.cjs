/**
 * CLASS 31: ESLint settings.
 * This uses the .eslintrc.cjs format mentioned in the original lab.
 * ESLint checks our code for common mistakes while we work.
 */
module.exports = {
  root: true,
  env: {
    browser: true,
    es2022: true,
    node: true,
  },
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
    ecmaFeatures: { jsx: true },
  },
  plugins: ['react'],
  extends: ['eslint:recommended', 'plugin:react/recommended'],
  settings: {
    react: { version: 'detect' },
  },
  rules: {
    // STEP 1: The lab says students may skip PropTypes for now.
    'react/prop-types': ['off'],

    // STEP 2: Modern Vite/React projects do not require importing React
    // in every JSX file (the React transform handles it).
    'react/react-in-jsx-scope': 'off',
    'react/jsx-uses-react': 'off',
  },
};
