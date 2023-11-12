/* eslint-env node */
require("@rushstack/eslint-patch/modern-module-resolution");

module.exports = {
  root: true,
  "extends": [
    "plugin:vue/vue3-essential",
    "eslint:recommended"
  ],
  parserOptions: {
    ecmaVersion: "latest"
  },
  rules: {
    semi: ["error", "always"],
    "semi-spacing": ["error", {
      before: false,
      after: true
    }],
    quotes: ["error", "double", { avoidEscape: true }],
    "no-useless-rename": "error",
    "no-unused-vars": ["warn", {
      args: "after-used",
      argsIgnorePattern: "^_"
    }],
  }
};
