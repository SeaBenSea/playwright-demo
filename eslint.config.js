import playwright from "eslint-plugin-playwright";

export default [
  {
    ...playwright.configs["flat/recommended"],
    files: ["**/*.test.js"],
    rules: {
      ...playwright.configs["flat/recommended"].rules,
    },
  },
];
