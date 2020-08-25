module.exports = {
  root: true,

  parser: "@typescript-eslint/parser",
  parserOptions: {
    ecmaVersion: 11,
    sourceType: "module",
    ecmaFeatures: {
      jsx: true,
      experimentalObjectRestSpread: true,
    },
  },

  plugins: [
    "@typescript-eslint",
    "react",
  ],
  extends: [
    "plugin:@typescript-eslint/recommended",
    "plugin:react/recommended",
    "prettier/@typescript-eslint",
    "prettier/react",
  ],

  env: {
    node: true,
  },

  settings: {
    react: {
      version: "latest"
    }
  }
};
