module.exports = {
  root: true,
  extends: 'airbnb-typescript/base',
  plugins: ['import', 'prettier'],
  rules: {
    "prettier/prettier": ["error", {"semi": true}],
  },
  parserOptions: {
    project: './tsconfig.json',
  },
};
